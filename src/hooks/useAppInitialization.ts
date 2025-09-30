import { useEffect, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useLocaleStore } from '@/store/useLocaleStore';
import { useThemeStore } from '@/store/useThemeStore';

export const useAppInitialization = () => {
  const [isInitialized, setIsInitialized] = useState(false);

  const initializeLocale = useLocaleStore((state) => state.initializeLocale);
  const initializeTheme = useThemeStore((state) => state.initializeTheme);
  const subscribeToSystemTheme = useThemeStore((state) => state.subscribeToSystemTheme);
  const resolvedTheme = useThemeStore((state) => (state.theme === 'auto' ? state.systemTheme : state.theme));
  const setMovementStatus = useAppStore((state) => state.setMovementStatus);

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
    const mouseMoverAPI = window.electronAPI?.mouseMover;

    return mouseMoverAPI?.onRunningStateChanged?.((status: 'moving' | 'waiting' | 'stopped') => {
      setMovementStatus(status);
    });
  }, [setMovementStatus]);

  return { isInitialized };
};
