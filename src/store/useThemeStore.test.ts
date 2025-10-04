import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useThemeStore } from './useThemeStore';

describe('useThemeStore', () => {
  beforeEach(() => {
    useThemeStore.setState({ theme: 'auto', systemTheme: 'light' });
  });

  describe('setTheme', () => {
    it('updates theme', () => {
      const { setTheme } = useThemeStore.getState();

      setTheme('dark');

      expect(useThemeStore.getState().theme).toBe('dark');
    });
  });

  describe('setSystemTheme', () => {
    it('updates system theme', () => {
      const { setSystemTheme } = useThemeStore.getState();

      setSystemTheme('dark');

      expect(useThemeStore.getState().systemTheme).toBe('dark');
    });
  });

  describe('initializeTheme', () => {
    describe('when electron API is available', () => {
      it('gets system theme from electron', async () => {
        const shouldUseDarkColorsMock = vi.fn().mockResolvedValue(true);

        window.electronAPI = {
          ...window.electronAPI,
          theme: {
            ...window.electronAPI.theme,
            shouldUseDarkColors: shouldUseDarkColorsMock,
          },
        };

        await useThemeStore.getState().initializeTheme();

        expect(shouldUseDarkColorsMock).toHaveBeenCalled();
        expect(useThemeStore.getState().systemTheme).toBe('dark');
      });
    });

    describe('when electron API fails', () => {
      it('falls back to media query', async () => {
        const shouldUseDarkColorsMock = vi.fn().mockRejectedValue(new Error('Failed'));

        window.electronAPI = {
          ...window.electronAPI,
          theme: {
            ...window.electronAPI.theme,
            shouldUseDarkColors: shouldUseDarkColorsMock,
          },
        };

        Object.defineProperty(window, 'matchMedia', {
          writable: true,
          value: vi.fn().mockReturnValue({
            matches: false,
          }),
        });

        await useThemeStore.getState().initializeTheme();

        expect(useThemeStore.getState().systemTheme).toBe('light');
      });
    });
  });

  describe('subscribeToSystemTheme', () => {
    describe('when electron API is available', () => {
      it('subscribes to native theme updates', () => {
        const unsubscribeMock = vi.fn();
        const onNativeThemeUpdatedMock = vi.fn().mockReturnValue(unsubscribeMock);

        window.electronAPI = {
          ...window.electronAPI,
          theme: {
            ...window.electronAPI.theme,
            onNativeThemeUpdated: onNativeThemeUpdatedMock,
          },
        };

        const unsubscribe = useThemeStore.getState().subscribeToSystemTheme();

        expect(onNativeThemeUpdatedMock).toHaveBeenCalled();
        expect(unsubscribe).toBe(unsubscribeMock);
      });
    });

    describe('when electron API is not available', () => {
      it('subscribes to media query changes', () => {
        const addEventListenerMock = vi.fn();

        Object.defineProperty(window, 'matchMedia', {
          writable: true,
          value: vi.fn().mockReturnValue({
            matches: false,
            addEventListener: addEventListenerMock,
            removeEventListener: vi.fn(),
          }),
        });

        window.electronAPI = {
          ...window.electronAPI,
          theme: undefined,
        };

        useThemeStore.getState().subscribeToSystemTheme();

        expect(addEventListenerMock).toHaveBeenCalledWith('change', expect.any(Function));
      });
    });
  });
});
