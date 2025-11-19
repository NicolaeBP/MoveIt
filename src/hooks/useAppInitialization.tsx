import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useAppStore } from '@/store/useAppStore';
import { useLocaleStore } from '@/store/useLocaleStore';
import { useThemeStore } from '@/store/useThemeStore';
import { UpdateModal } from '@/components/UpdateModal/UpdateModal';

export const useAppInitialization = () => {
  const [isInitialized, setIsInitialized] = useState(false);

  const initializeLocale = useLocaleStore((state) => state.initializeLocale);
  const initializeTheme = useThemeStore((state) => state.initializeTheme);
  const subscribeToSystemTheme = useThemeStore((state) => state.subscribeToSystemTheme);
  const resolvedTheme = useThemeStore((state) => (state.theme === 'auto' ? state.systemTheme : state.theme));
  const setMovementStatus = useAppStore((state) => state.setMovementStatus);
  const autoUpdatesEnabled = useAppStore((state) => state.autoUpdatesEnabled);
  const openModal = useAppStore((state) => state.openModal);
  const setIsUpToDate = useAppStore((state) => state.setIsUpToDate);

  // Initialize locale and theme
  useEffect(() => {
    (async () => {
      await Promise.all([initializeLocale(), initializeTheme()]);
      setIsInitialized(true);
    })();

    const unsubscribe = subscribeToSystemTheme();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [initializeLocale, initializeTheme, subscribeToSystemTheme]);

  // Apply theme to document root
  useEffect(() => {
    const root = document.documentElement;

    if (resolvedTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [resolvedTheme]);

  // Prevent context menu
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    document.addEventListener('contextmenu', handleContextMenu);

    return () => document.removeEventListener('contextmenu', handleContextMenu);
  }, []);

  // Subscribe to movement status changes
  useEffect(() => {
    const mouseMoverAPI = globalThis.electronAPI?.mouseMover;

    return mouseMoverAPI?.onRunningStateChanged?.((status: 'moving' | 'waiting' | 'stopped') => {
      setMovementStatus(status);
    });
  }, [setMovementStatus]);

  // Subscribe to auto-update events
  useEffect(() => {
    globalThis.electronAPI.updates.notifyAutoUpdatesChanged(autoUpdatesEnabled);

    return globalThis.electronAPI.updates.onUpdateDownloaded((info: { version: string }) => {
      openModal({
        title: <FormattedMessage id="updates.title" />,
        body: <UpdateModal version={info.version} />,
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return globalThis.electronAPI.updates.onSetIsUpToDate((isUpToDate: boolean) => {
      setIsUpToDate(isUpToDate);
    });
  }, [setIsUpToDate]);

  return { isInitialized };
};
