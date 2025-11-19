import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useAppInitialization } from './useAppInitialization';
import { useLocaleStore } from '@/store/useLocaleStore';
import { useThemeStore } from '@/store/useThemeStore';
import { useAppStore } from '@/store/useAppStore';

describe('useAppInitialization', () => {
  beforeEach(() => {
    useLocaleStore.setState({
      locale: 'en',
      initializeLocale: vi.fn().mockResolvedValue(undefined),
    });

    useThemeStore.setState({
      theme: 'light',
      systemTheme: 'light',
      initializeTheme: vi.fn().mockResolvedValue(undefined),
      subscribeToSystemTheme: vi.fn().mockReturnValue(() => {}),
    });

    useAppStore.setState({
      setMovementStatus: vi.fn(),
      autoUpdatesEnabled: true,
      openModal: vi.fn(),
      setIsUpToDate: vi.fn(),
    });

    globalThis.electronAPI = {
      ...globalThis.electronAPI,
      updates: {
        ...globalThis.electronAPI.updates,
        notifyAutoUpdatesChanged: vi.fn(),
        onUpdateDownloaded: vi.fn().mockReturnValue(() => {}),
        onSetIsUpToDate: vi.fn().mockReturnValue(() => {}),
      },
    };
  });

  describe('when hook is initialized', () => {
    it('calls initializeLocale and initializeTheme', async () => {
      const initializeLocaleMock = vi.fn().mockResolvedValue(undefined);
      const initializeThemeMock = vi.fn().mockResolvedValue(undefined);

      useLocaleStore.setState({ initializeLocale: initializeLocaleMock });
      useThemeStore.setState({ initializeTheme: initializeThemeMock });

      renderHook(() => useAppInitialization());

      await waitFor(() => {
        expect(initializeLocaleMock).toHaveBeenCalled();
        expect(initializeThemeMock).toHaveBeenCalled();
      });
    });

    it('subscribes to system theme changes', () => {
      const subscribeToSystemThemeMock = vi.fn().mockReturnValue(() => {});

      useThemeStore.setState({ subscribeToSystemTheme: subscribeToSystemThemeMock });

      renderHook(() => useAppInitialization());

      expect(subscribeToSystemThemeMock).toHaveBeenCalled();
    });

    it('sets isInitialized to true after initialization', async () => {
      const { result } = renderHook(() => useAppInitialization());

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });
    });
  });

  describe('when theme is dark', () => {
    it('adds dark class to document root', () => {
      useThemeStore.setState({ theme: 'dark', systemTheme: 'dark' });

      renderHook(() => useAppInitialization());

      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });
  });

  describe('when theme is light', () => {
    it('removes dark class from document root', () => {
      document.documentElement.classList.add('dark');

      useThemeStore.setState({ theme: 'light', systemTheme: 'light' });

      renderHook(() => useAppInitialization());

      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });
  });

  describe('when theme is auto with dark system theme', () => {
    it('adds dark class to document root', () => {
      useThemeStore.setState({ theme: 'auto', systemTheme: 'dark' });

      renderHook(() => useAppInitialization());

      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });
  });

  describe('when auto-update subscription is initialized', () => {
    it('calls notifyAutoUpdatesChanged with autoUpdatesEnabled state', () => {
      const notifyMock = vi.fn();

      globalThis.electronAPI.updates.notifyAutoUpdatesChanged = notifyMock;

      useAppStore.setState({ autoUpdatesEnabled: true });

      renderHook(() => useAppInitialization());

      expect(notifyMock).toHaveBeenCalledWith(true);
    });

    it('subscribes to onUpdateDownloaded event', () => {
      const onUpdateDownloadedMock = vi.fn().mockReturnValue(() => {});

      globalThis.electronAPI.updates.onUpdateDownloaded = onUpdateDownloadedMock;

      renderHook(() => useAppInitialization());

      expect(onUpdateDownloadedMock).toHaveBeenCalled();
    });
  });

  describe('when update is downloaded', () => {
    it('opens modal with update version', () => {
      const openModalMock = vi.fn();

      useAppStore.setState({ openModal: openModalMock });

      let updateCallback: ((info: { version: string }) => void) | undefined;

      globalThis.electronAPI.updates.onUpdateDownloaded = vi.fn((callback) => {
        updateCallback = callback;

        return () => {};
      });

      renderHook(() => useAppInitialization());

      // Simulate update downloaded event
      updateCallback?.({ version: '1.0.5' });

      expect(openModalMock).toHaveBeenCalledOnce();

      const callArg = openModalMock.mock.calls[0][0];

      expect(callArg).toHaveProperty('title');
      expect(callArg).toHaveProperty('body');
    });
  });

  describe('when isUpToDate subscription is initialized', () => {
    it('subscribes to onSetIsUpToDate event', () => {
      const onSetIsUpToDateMock = vi.fn().mockReturnValue(() => {});

      globalThis.electronAPI.updates.onSetIsUpToDate = onSetIsUpToDateMock;

      renderHook(() => useAppInitialization());

      expect(onSetIsUpToDateMock).toHaveBeenCalled();
    });
  });

  describe('when isUpToDate event is triggered', () => {
    it('calls setIsUpToDate with true', () => {
      const setIsUpToDateMock = vi.fn();

      useAppStore.setState({ setIsUpToDate: setIsUpToDateMock });

      let isUpToDateCallback: ((isUpToDate: boolean) => void) | undefined;

      globalThis.electronAPI.updates.onSetIsUpToDate = vi.fn((callback) => {
        isUpToDateCallback = callback;

        return () => {};
      });

      renderHook(() => useAppInitialization());

      // Simulate isUpToDate event
      isUpToDateCallback?.(true);

      expect(setIsUpToDateMock).toHaveBeenCalledWith(true);
    });

    it('calls setIsUpToDate with false', () => {
      const setIsUpToDateMock = vi.fn();

      useAppStore.setState({ setIsUpToDate: setIsUpToDateMock });

      let isUpToDateCallback: ((isUpToDate: boolean) => void) | undefined;

      globalThis.electronAPI.updates.onSetIsUpToDate = vi.fn((callback) => {
        isUpToDateCallback = callback;

        return () => {};
      });

      renderHook(() => useAppInitialization());

      // Simulate isUpToDate event
      isUpToDateCallback?.(false);

      expect(setIsUpToDateMock).toHaveBeenCalledWith(false);
    });
  });

  describe('when hook is unmounted', () => {
    it('cleans up onUpdateDownloaded subscription', () => {
      const cleanupMock = vi.fn();
      globalThis.electronAPI.updates.onUpdateDownloaded = vi.fn().mockReturnValue(cleanupMock);

      const { unmount } = renderHook(() => useAppInitialization());

      unmount();

      expect(cleanupMock).toHaveBeenCalled();
    });

    it('cleans up onSetIsUpToDate subscription', () => {
      const cleanupMock = vi.fn();
      globalThis.electronAPI.updates.onSetIsUpToDate = vi.fn().mockReturnValue(cleanupMock);

      const { unmount } = renderHook(() => useAppInitialization());

      unmount();

      expect(cleanupMock).toHaveBeenCalled();
    });
  });
});
