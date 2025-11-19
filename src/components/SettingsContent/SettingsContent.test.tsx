import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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
      autoUpdatesEnabled: true,
      setAutoUpdatesEnabled: vi.fn(),
      isUpToDate: null,
      setIsUpToDate: vi.fn(),
    });

    globalThis.electronAPI = {
      ...globalThis.electronAPI,
      updates: {
        ...globalThis.electronAPI.updates,
        checkForUpdates: vi.fn().mockResolvedValue(undefined),
        notifyAutoUpdatesChanged: vi.fn(),
      },
    };
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

      const checkboxes = screen.getAllByRole('checkbox');

      expect(checkboxes.length).toBeGreaterThanOrEqual(1);
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

      const checkboxes = screen.getAllByRole('checkbox');
      const trayMessageCheckbox = checkboxes[0] as HTMLInputElement;

      expect(trayMessageCheckbox.checked).toBe(true);
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

      const checkbox = screen.getAllByRole('checkbox')[0];

      fireEvent.click(checkbox);

      expect(setShowTrayMessageMock).toHaveBeenCalledWith(true);
    });
  });

  describe('when auto-updates checkbox is rendered', () => {
    it('shows auto-updates checkbox with label', () => {
      render(<SettingsContent />, { wrapper });

      expect(screen.getByText(messages.en['settings.autoUpdates'])).toBeInTheDocument();
    });

    it('reflects autoUpdatesEnabled state when checked', () => {
      useAppStore.setState({ autoUpdatesEnabled: true });

      render(<SettingsContent />, { wrapper });

      const checkboxes = screen.getAllByRole('checkbox');
      const autoUpdatesCheckbox = checkboxes[1] as HTMLInputElement;

      expect(autoUpdatesCheckbox.checked).toBe(true);
    });

    it('reflects autoUpdatesEnabled state when unchecked', () => {
      useAppStore.setState({ autoUpdatesEnabled: false });

      render(<SettingsContent />, { wrapper });

      const checkboxes = screen.getAllByRole('checkbox');
      const autoUpdatesCheckbox = checkboxes[1] as HTMLInputElement;

      expect(autoUpdatesCheckbox.checked).toBe(false);
    });
  });

  describe('when auto-updates checkbox is clicked', () => {
    it('calls setAutoUpdatesEnabled with toggled value', () => {
      const setAutoUpdatesEnabledMock = vi.fn();

      useAppStore.setState({
        autoUpdatesEnabled: false,
        setAutoUpdatesEnabled: setAutoUpdatesEnabledMock,
      });

      render(<SettingsContent />, { wrapper });

      const checkboxes = screen.getAllByRole('checkbox');
      const autoUpdatesCheckbox = checkboxes[1];

      fireEvent.click(autoUpdatesCheckbox);

      expect(setAutoUpdatesEnabledMock).toHaveBeenCalledWith(true);
    });

    it('calls notifyAutoUpdatesChanged with toggled value', () => {
      const notifyMock = vi.fn();
      globalThis.electronAPI.updates.notifyAutoUpdatesChanged = notifyMock;

      useAppStore.setState({ autoUpdatesEnabled: false });

      render(<SettingsContent />, { wrapper });

      const checkboxes = screen.getAllByRole('checkbox');
      const autoUpdatesCheckbox = checkboxes[1];

      fireEvent.click(autoUpdatesCheckbox);

      expect(notifyMock).toHaveBeenCalledWith(true);
    });
  });

  describe('when check for updates button is rendered', () => {
    it('shows button with default text', () => {
      useAppStore.setState({ isUpToDate: null });

      render(<SettingsContent />, { wrapper });

      expect(screen.getByText(messages.en['settings.checkForUpdates'])).toBeInTheDocument();
    });

    it('shows checking text when checking for updates', async () => {
      const checkForUpdatesMock = vi.fn().mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

      globalThis.electronAPI.updates.checkForUpdates = checkForUpdatesMock;

      useAppStore.setState({ isUpToDate: null });

      render(<SettingsContent />, { wrapper });

      const button = screen.getByRole('button', {
        name: messages.en['settings.checkForUpdates'],
      });

      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText(messages.en['updates.checking'])).toBeInTheDocument();
      });
    });

    it('shows up to date text when isUpToDate is true', () => {
      useAppStore.setState({ isUpToDate: true });

      render(<SettingsContent />, { wrapper });

      expect(screen.getByText(messages.en['updates.upToDate'])).toBeInTheDocument();
    });

    it('shows update available text when isUpToDate is false', () => {
      useAppStore.setState({ isUpToDate: false });

      render(<SettingsContent />, { wrapper });

      expect(screen.getByText(messages.en['settings.updateAvailable'])).toBeInTheDocument();
    });
  });

  describe('when check for updates button is clicked', () => {
    it('calls electronAPI.updates.checkForUpdates', async () => {
      const checkForUpdatesMock = vi.fn().mockResolvedValue(undefined);

      globalThis.electronAPI.updates.checkForUpdates = checkForUpdatesMock;

      render(<SettingsContent />, { wrapper });

      const button = screen.getByRole('button', {
        name: messages.en['settings.checkForUpdates'],
      });

      fireEvent.click(button);

      expect(checkForUpdatesMock).toHaveBeenCalledOnce();
    });

    it('disables button during check', async () => {
      render(<SettingsContent />, { wrapper });

      const button = screen.getByRole('button', {
        name: messages.en['settings.checkForUpdates'],
      }) as HTMLButtonElement;

      fireEvent.click(button);

      expect(button.disabled).toBe(true);
    });

    it('displays error message when check fails', async () => {
      const checkForUpdatesMock = vi.fn().mockRejectedValue(new Error('Network error'));

      globalThis.electronAPI.updates.checkForUpdates = checkForUpdatesMock;

      render(<SettingsContent />, { wrapper });

      const button = screen.getByRole('button', {
        name: messages.en['settings.checkForUpdates'],
      });

      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText(messages.en['updates.checkError'])).toBeInTheDocument();
      });
    });
  });
});
