import { contextBridge, ipcRenderer } from 'electron';
import type { ScheduleConfig } from '../shared/types';
import { IPC_CHANNELS } from './constants';

const electronAPI = {
  mouseMover: {
    toggle: (intervalMs: number, scheduleConfig?: ScheduleConfig): Promise<boolean> =>
      ipcRenderer.invoke(IPC_CHANNELS.MOUSE_MOVER_TOGGLE, intervalMs, scheduleConfig),
    onRunningStateChanged: (callback: (status: 'moving' | 'waiting' | 'stopped') => void) => {
      const listener = (_: Electron.IpcRendererEvent, status: 'moving' | 'waiting' | 'stopped') => callback(status);

      ipcRenderer.on(IPC_CHANNELS.MOUSE_MOVER_RUNNING_STATE_CHANGED, listener);

      return () => ipcRenderer.removeListener(IPC_CHANNELS.MOUSE_MOVER_RUNNING_STATE_CHANGED, listener);
    },
  },
  accessibility: {
    openSettings: (): Promise<void> => ipcRenderer.invoke(IPC_CHANNELS.ACCESSIBILITY_OPEN_SETTINGS),
  },
  window: {
    minimize: (): Promise<void> => ipcRenderer.invoke(IPC_CHANNELS.WINDOW_MINIMIZE),
    maximize: (): Promise<void> => ipcRenderer.invoke(IPC_CHANNELS.WINDOW_MAXIMIZE),
    hideToTray: (showNotification?: boolean): Promise<void> => ipcRenderer.invoke(IPC_CHANNELS.WINDOW_HIDE_TO_TRAY, showNotification),
  },
  locale: {
    getSystemLocale: (): Promise<string> => ipcRenderer.invoke(IPC_CHANNELS.GET_SYSTEM_LOCALE),
  },
  theme: {
    shouldUseDarkColors: (): Promise<boolean> => ipcRenderer.invoke(IPC_CHANNELS.THEME_SHOULD_USE_DARK_COLORS),
    onNativeThemeUpdated: (callback: (isDark: boolean) => void) => {
      const listener = (_: Electron.IpcRendererEvent, isDark: boolean) => callback(isDark);
      ipcRenderer.on(IPC_CHANNELS.THEME_UPDATED, listener);

      return () => ipcRenderer.removeListener(IPC_CHANNELS.THEME_UPDATED, listener);
    },
  },
};

contextBridge.exposeInMainWorld('electronAPI', electronAPI);

export type ElectronAPI = typeof electronAPI;
