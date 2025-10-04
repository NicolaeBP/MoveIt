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
    });
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
});
