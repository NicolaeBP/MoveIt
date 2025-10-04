import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import { useLocaleStore } from '@/store/useLocaleStore';
import { useThemeStore } from '@/store/useThemeStore';
import { useAppStore } from '@/store/useAppStore';
import { messages } from '@/i18n/config';

describe('App', () => {
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

  describe('when not initialized', () => {
    it('renders nothing', () => {
      useLocaleStore.setState({ initializeLocale: vi.fn().mockImplementation(() => new Promise(() => {})) });

      render(<App />);

      expect(screen.queryByText(messages.en['app.title'])).not.toBeInTheDocument();
    });
  });

  describe('when initialized', () => {
    it('renders main application structure', async () => {
      render(<App />);

      await waitFor(() => {
        expect(screen.getByText(messages.en['app.title'])).toBeInTheDocument();
        expect(screen.getByText(messages.en['timeSettings.label'])).toBeInTheDocument();
        expect(screen.getByText(messages.en['schedule.title'])).toBeInTheDocument();
      });
    });
  });
});
