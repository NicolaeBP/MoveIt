import {
  app,
  BrowserWindow,
  ipcMain,
  systemPreferences,
  shell,
  Tray,
  Menu,
  nativeImage,
  nativeTheme,
  Notification,
  powerMonitor,
} from 'electron';

import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';
import { mouse } from '@nut-tree-fork/nut-js';
import type { ScheduleConfig } from '../shared/types';

import {
  IPC_CHANNELS,
  APP_CONFIG,
  PATHS,
  WINDOW_CONFIG,
  ELECTRON_EVENTS,
  PLATFORMS,
  SMART_MOUSE_MOVER,
  TRAY_ICON_SIZE,
  MOUSE_MOVEMENT_PIXELS,
} from './constants';
import { MS_PER_HOUR, MS_PER_MINUTE, MS_PER_SECOND } from './timeConstants';
import { getNextMoveStartTime } from './utils';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Application state
let mainApplicationWindow: BrowserWindow | null = null;
let systemTray: Tray | null = null;
let scheduleTransitionTimer: NodeJS.Timeout | null = null;
let currentScheduleConfig: ScheduleConfig | null = null;
let currentIntervalMs: number = 0;
let lastSetPosition: { x: number; y: number } | null = null;

// ============================================================================
// PUBLIC API - IPC HANDLERS
// ============================================================================

// === WINDOW CONTROL ===
ipcMain.handle(IPC_CHANNELS.WINDOW_MINIMIZE, () => mainApplicationWindow?.minimize());

ipcMain.handle(IPC_CHANNELS.WINDOW_MAXIMIZE, () =>
  mainApplicationWindow?.isMaximized() ? mainApplicationWindow.unmaximize() : mainApplicationWindow?.maximize()
);

app.on(ELECTRON_EVENTS.WINDOW_ALL_CLOSED, () => process.platform !== PLATFORMS.DARWIN && app.quit());

app.on(ELECTRON_EVENTS.BEFORE_QUIT, () => {
  stopMovementCycle();

  if (systemTray && !systemTray.isDestroyed()) {
    systemTray.destroy();
    systemTray = null;
  }

  if (mainApplicationWindow) {
    mainApplicationWindow = null;
  }
});

ipcMain.handle(IPC_CHANNELS.WINDOW_HIDE_TO_TRAY, (_, showNotification?: boolean) => {
  if (showNotification) showTrayNotification();

  mainApplicationWindow?.hide();
});

const showTrayNotification = () => {
  if (!Notification.isSupported()) return;

  const notification = new Notification({
    title: SMART_MOUSE_MOVER,
    body: 'App minimized to system tray',
  });

  notification.show();

  notification.on('click', () => mainApplicationWindow?.show());
};

// === SYSTEM INTEGRATION ===
ipcMain.handle(IPC_CHANNELS.ACCESSIBILITY_OPEN_SETTINGS, async (): Promise<void> => {
  if (process.platform === 'darwin') {
    await shell.openExternal('x-apple.systempreferences:com.apple.preference.security?Privacy_Accessibility');
  }
});

ipcMain.handle(IPC_CHANNELS.GET_SYSTEM_LOCALE, () => app.getLocale());

ipcMain.handle(IPC_CHANNELS.THEME_SHOULD_USE_DARK_COLORS, () => nativeTheme.shouldUseDarkColors);

// === THEME ===
nativeTheme.on(ELECTRON_EVENTS.UPDATED, () => {
  if (mainApplicationWindow && !mainApplicationWindow.isDestroyed()) {
    mainApplicationWindow.webContents.send(IPC_CHANNELS.THEME_UPDATED, nativeTheme.shouldUseDarkColors);
  }
});

// === APP LIFECYCLE ===
app.whenReady().then(() => {
  if (process.platform === PLATFORMS.DARWIN && process.env.NODE_ENV === 'development') {
    const iconPath = join(__dirname, PATHS.ASSETS.ICON_PNG);

    if (existsSync(iconPath)) {
      const icon = nativeImage.createFromPath(iconPath);
      app.dock?.setIcon(icon);
    }
  }

  createMainApplicationWindow();
  createSystemTray();

  app.on(ELECTRON_EVENTS.ACTIVATE, () => !BrowserWindow.getAllWindows().length && createMainApplicationWindow());
});

powerMonitor.on('resume', () => {
  if (isMovementCycleRunning()) runMovementCycle();
});

const createMainApplicationWindow = () => {
  mainApplicationWindow = new BrowserWindow({
    ...APP_CONFIG.WINDOW_DIMENSIONS,
    ...WINDOW_CONFIG,
    webPreferences: {
      ...WINDOW_CONFIG.webPreferences,
      preload: join(__dirname, PATHS.PRELOAD),
    },
  });

  if (process.env.NODE_ENV === 'development') {
    mainApplicationWindow.loadURL(APP_CONFIG.DEVELOPMENT_URL).catch(console.error);

    mainApplicationWindow.webContents.openDevTools({ mode: 'detach' });
  } else {
    mainApplicationWindow.loadFile(join(__dirname, PATHS.INDEX_HTML)).catch(console.error);
  }
};

const createSystemTray = () => {
  const trayIcon = getTrayIcon();

  if (!trayIcon) return;

  systemTray = new Tray(trayIcon);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show App',
      click: () => mainApplicationWindow?.show(),
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => app.quit(),
    },
  ]);

  systemTray.setContextMenu(contextMenu);

  systemTray.setToolTip(SMART_MOUSE_MOVER);

  if (process.platform === PLATFORMS.WIN32) {
    systemTray.on(ELECTRON_EVENTS.CLICK, () =>
      mainApplicationWindow?.isVisible() ? mainApplicationWindow.hide() : mainApplicationWindow?.show()
    );
  }
};

const getTrayIcon = (): Electron.NativeImage | null => {
  if (process.platform === PLATFORMS.DARWIN) {
    const templatePath = join(__dirname, PATHS.ASSETS.ICON_TEMPLATE);

    if (existsSync(templatePath)) {
      const icon = nativeImage.createFromPath(templatePath);
      icon.setTemplateImage(true);

      return icon;
    }
  }

  const iconPath = process.platform === PLATFORMS.WIN32 ? join(__dirname, PATHS.ASSETS.ICON_ICO) : join(__dirname, PATHS.ASSETS.ICON_PNG);

  if (existsSync(iconPath)) return nativeImage?.createFromPath(iconPath).resize(TRAY_ICON_SIZE);

  return null;
};

// === MOUSE MOVER ===
ipcMain.handle(
  IPC_CHANNELS.MOUSE_MOVER_TOGGLE,
  async (_, idleTimeoutInMilliseconds: number, scheduleConfig?: ScheduleConfig): Promise<boolean> => {
    try {
      if (!checkAccessibilityPermissions()) return false;

      if (isMovementCycleRunning()) {
        stopMovementCycle();
        notifyFrontendStatus('stopped');

        return false;
      } else {
        currentScheduleConfig = scheduleConfig || null;
        currentIntervalMs = idleTimeoutInMilliseconds;

        runMovementCycle();

        return true;
      }
    } catch (error) {
      console.error(error);

      return false;
    }
  }
);

const checkAccessibilityPermissions = (): boolean => {
  if (process.platform === PLATFORMS.DARWIN) return systemPreferences.isTrustedAccessibilityClient(false);

  return true;
};

const isMovementCycleRunning = (): boolean => scheduleTransitionTimer !== null;

const stopMovementCycle = () => {
  clearCurrentTimer();
  currentScheduleConfig = null;
  currentIntervalMs = 0;
  lastSetPosition = null;
};

const notifyFrontendStatus = (status: 'moving' | 'waiting' | 'stopped') => {
  if (mainApplicationWindow && !mainApplicationWindow.isDestroyed()) {
    mainApplicationWindow.webContents.send(IPC_CHANNELS.MOUSE_MOVER_RUNNING_STATE_CHANGED, status);
  }
};

const runMovementCycle = () => {
  if (!currentIntervalMs) return;

  clearCurrentTimer();

  if (!currentScheduleConfig?.length) {
    notifyFrontendStatus('moving');
    void performMouseMovement();
    scheduleTransitionTimer = setTimeout(runMovementCycle, currentIntervalMs);

    return;
  }

  const now = new Date();
  const currentDayIndex = now.getDay();
  const currentTimeMs = now.getHours() * MS_PER_HOUR + now.getMinutes() * MS_PER_MINUTE + now.getSeconds() * MS_PER_SECOND;

  const nextSchedule = getNextMoveStartTime(currentScheduleConfig, currentDayIndex, currentTimeMs);

  if (!nextSchedule) {
    stopMovementCycle();
    notifyFrontendStatus('stopped');
    return;
  }

  const { startTime, endTime } = nextSchedule;

  const phase = getMovementPhase(startTime, endTime, Date.now());

  scheduleNextAction(phase, startTime);
};

const clearCurrentTimer = () => {
  if (scheduleTransitionTimer) {
    clearTimeout(scheduleTransitionTimer);
    scheduleTransitionTimer = null;
  }
};

const getMovementPhase = (startTime: number, endTime: number, now: number): string => {
  if (now < startTime) return 'wait';

  if (now < endTime) return 'move';

  return 'end';
};

const scheduleNextAction = (phase: string, startTime: number) => {
  switch (phase) {
    case 'wait':
      notifyFrontendStatus('waiting');
      scheduleTransitionTimer = setTimeout(runMovementCycle, startTime - Date.now());
      break;

    case 'move':
      notifyFrontendStatus('moving');
      void performMouseMovement();
      scheduleTransitionTimer = setTimeout(runMovementCycle, currentIntervalMs);
      break;

    case 'end':
      runMovementCycle();
      break;

    default:
      stopMovementCycle();
  }
};

const performMouseMovement = async () => {
  if (!currentIntervalMs) return;

  try {
    const currentPos = await mouse.getPosition();

    if (lastSetPosition) {
      if (Math.abs(currentPos.x - lastSetPosition.x) > 2 || Math.abs(currentPos.y - lastSetPosition.y) > 2) {
        lastSetPosition = currentPos;
        scheduleTransitionTimer = setTimeout(runMovementCycle, currentIntervalMs);

        return;
      }
    }

    const newPos = { x: currentPos.x + MOUSE_MOVEMENT_PIXELS, y: currentPos.y };

    await mouse.setPosition(newPos);

    lastSetPosition = newPos;
  } catch (error) {
    console.error(error);
  }
};
