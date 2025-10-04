import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import SettingsContent from './SettingsContent';
import { useAppStore } from '@/store/useAppStore';
import { messages } from '@/i18n/config';
import React from 'react';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <IntlProvider locale="en" messages={messages.en}>
    {children}
  </IntlProvider>
);

describe('SettingsContent', () => {
  beforeEach(() => {
    useAppStore.setState({
      showTrayMessage: true,
      setShowTrayMessage: vi.fn(),
    });
  });

  describe('when rendered', () => {
    it('shows language switcher', () => {
      render(<SettingsContent />, { wrapper });

      expect(screen.getByText(messages.en['settings.language'])).toBeInTheDocument();
    });

    it('shows theme selector', () => {
      render(<SettingsContent />, { wrapper });

      expect(screen.getByText(messages.en['theme.light'])).toBeInTheDocument();
      expect(screen.getByText(messages.en['theme.dark'])).toBeInTheDocument();
    });

    it('shows tray message checkbox', () => {
      render(<SettingsContent />, { wrapper });

      expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    it('shows about section', () => {
      render(<SettingsContent />, { wrapper });

      expect(screen.getByText('Nicolae Balica')).toBeInTheDocument();
    });
  });

  describe('when tray message checkbox is checked', () => {
    it('reflects showTrayMessage state', () => {
      useAppStore.setState({ showTrayMessage: true });

      render(<SettingsContent />, { wrapper });

      const checkbox = screen.getByRole('checkbox') as HTMLInputElement;

      expect(checkbox.checked).toBe(true);
    });
  });

  describe('when tray message checkbox is clicked', () => {
    it('calls setShowTrayMessage with toggled value', () => {
      const setShowTrayMessageMock = vi.fn();

      useAppStore.setState({
        showTrayMessage: false,
        setShowTrayMessage: setShowTrayMessageMock,
      });

      render(<SettingsContent />, { wrapper });

      const checkbox = screen.getByRole('checkbox');

      fireEvent.click(checkbox);

      expect(setShowTrayMessageMock).toHaveBeenCalledWith(true);
    });
  });
});
