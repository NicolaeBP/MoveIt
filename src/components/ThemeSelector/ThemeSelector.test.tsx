import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import ThemeSelector from './ThemeSelector';
import { useThemeStore } from '@/store/useThemeStore';
import { messages } from '@/i18n/config';
import React from 'react';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <IntlProvider locale="en" messages={messages.en}>
    {children}
  </IntlProvider>
);

describe('ThemeSelector', () => {
  describe('when component renders', () => {
    it('displays theme label and theme buttons', () => {
      useThemeStore.setState({ theme: 'light' });

      render(<ThemeSelector />, { wrapper });

      expect(screen.getByText(messages.en['theme.label'])).toBeInTheDocument();
      expect(screen.getByText(messages.en['theme.light'])).toBeInTheDocument();
      expect(screen.getByText(messages.en['theme.dark'])).toBeInTheDocument();
      expect(screen.getByText(messages.en['theme.auto'])).toBeInTheDocument();
    });
  });

  describe('when current theme is light', () => {
    it('marks light button as pressed', () => {
      useThemeStore.setState({ theme: 'light' });

      render(<ThemeSelector />, { wrapper });

      const lightButton = screen.getByText(messages.en['theme.light']);

      expect(lightButton).toHaveAttribute('aria-pressed', 'true');
    });
  });

  describe('when current theme is dark', () => {
    it('marks dark button as pressed', () => {
      useThemeStore.setState({ theme: 'dark' });

      render(<ThemeSelector />, { wrapper });

      const darkButton = screen.getByText(messages.en['theme.dark']);

      expect(darkButton).toHaveAttribute('aria-pressed', 'true');
    });
  });

  describe('when current theme is auto', () => {
    it('marks auto button as pressed', () => {
      useThemeStore.setState({ theme: 'auto' });

      render(<ThemeSelector />, { wrapper });

      const autoButton = screen.getByText(messages.en['theme.auto']);

      expect(autoButton).toHaveAttribute('aria-pressed', 'true');
    });
  });

  describe('when light button is clicked', () => {
    it('calls setTheme with light', () => {
      const setThemeMock = vi.fn();

      useThemeStore.setState({ theme: 'dark', setTheme: setThemeMock });

      render(<ThemeSelector />, { wrapper });

      const lightButton = screen.getByText(messages.en['theme.light']);

      lightButton.click();

      expect(setThemeMock).toHaveBeenCalledWith('light');
    });
  });

  describe('when dark button is clicked', () => {
    it('calls setTheme with dark', () => {
      const setThemeMock = vi.fn();

      useThemeStore.setState({ theme: 'light', setTheme: setThemeMock });

      render(<ThemeSelector />, { wrapper });

      const darkButton = screen.getByText(messages.en['theme.dark']);

      darkButton.click();

      expect(setThemeMock).toHaveBeenCalledWith('dark');
    });
  });

  describe('when auto button is clicked', () => {
    it('calls setTheme with auto', () => {
      const setThemeMock = vi.fn();

      useThemeStore.setState({ theme: 'light', setTheme: setThemeMock });

      render(<ThemeSelector />, { wrapper });

      const autoButton = screen.getByText(messages.en['theme.auto']);

      autoButton.click();

      expect(setThemeMock).toHaveBeenCalledWith('auto');
    });
  });
});
