export const IPC_CHANNELS = {
  MOUSE_MOVER_TOGGLE: 'mouse-mover:toggle',
  MOUSE_MOVER_RUNNING_STATE_CHANGED: 'mouse-mover:running-state-changed',
  ACCESSIBILITY_OPEN_SETTINGS: 'accessibility:open-settings',
  WINDOW_MINIMIZE: 'window:minimize',
  WINDOW_MAXIMIZE: 'window:maximize',
  WINDOW_HIDE_TO_TRAY: 'window:hide-to-tray',
  GET_SYSTEM_LOCALE: 'locale:get-system',
  THEME_SHOULD_USE_DARK_COLORS: 'theme:should-use-dark-colors',
  THEME_UPDATED: 'theme:updated',
  UPDATE_CHECK_FOR_UPDATES: 'update:check-for-updates',
  UPDATE_RESTART_AND_INSTALL: 'update:restart-and-install',
  UPDATE_AUTO_ENABLED_CHANGED: 'update:auto-enabled-changed',
  UPDATE_DOWNLOADED: 'update:downloaded',
  SET_IS_UP_TO_DATE: 'update:set-is-up-to-date',
} as const;

export const DEV_SERVER_PORT = 5173;

export const APP_CONFIG = {
  WINDOW_DIMENSIONS: {
    width: 420,
    height: 555,
  },
  DEVELOPMENT_URL: `http://localhost:${DEV_SERVER_PORT}`,
} as const;

export const PATHS = {
  PRELOAD: 'preload.js',
  INDEX_HTML: 'index.html',
  ASSETS: {
    ICON_TEMPLATE: '../assets/iconTemplate.png',
    ICON_PNG: '../assets/icon.png',
    ICON_ICO: '../assets/icon.ico',
    ICON_ICNS: '../assets/icon.icns',
  },
} as const;

export const PLATFORMS = {
  DARWIN: 'darwin',
  WIN32: 'win32',
  LINUX: 'linux',
} as const;

export const ELECTRON_EVENTS = {
  CLOSE: 'close',
  CLICK: 'click',
  ACTIVATE: 'activate',
  WINDOW_ALL_CLOSED: 'window-all-closed',
  BEFORE_QUIT: 'before-quit',
  UPDATED: 'updated',
} as const;

export const WINDOW_CONFIG = {
  frame: false,
  transparent: true,
  resizable: false,
  maximizable: false,
  fullscreenable: false,
  webPreferences: {
    contextIsolation: true,
    nodeIntegration: false,
    webSecurity: true,
  },
} as const;

export const TRAY_ICON_SIZE = { width: 16, height: 16 } as const;

export const MOUSE_MOVEMENT_PIXELS = 1;

export const SMART_MOUSE_MOVER = 'MoveIt';
