import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import WindowControls from './WindowControls';
import { useAppStore } from '@/store/useAppStore';
import { messages } from '@/i18n/config';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <IntlProvider locale="en" messages={messages.en}>
    {children}
  </IntlProvider>
);

describe('WindowControls', () => {
  describe('when component renders', () => {
    it('displays three window control buttons', () => {
      render(<WindowControls />, { wrapper });

      expect(screen.getByLabelText(messages.en['window.minimize'])).toBeInTheDocument();
      expect(screen.getByLabelText(messages.en['window.maximize'])).toBeInTheDocument();
      expect(screen.getByLabelText(messages.en['window.hideToTray'])).toBeInTheDocument();
    });
  });

  describe('when minimize button is clicked', () => {
    it('calls electronAPI minimize', async () => {
      const minimizeMock = vi.fn();

      window.electronAPI = {
        ...window.electronAPI,
        window: {
          ...window.electronAPI.window,
          minimize: minimizeMock,
        },
      };

      render(<WindowControls />, { wrapper });

      const minimizeButton = screen.getByLabelText(messages.en['window.minimize']);

      minimizeButton.click();

      await vi.waitFor(() => {
        expect(minimizeMock).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('when maximize button is clicked', () => {
    it('calls electronAPI maximize', async () => {
      const maximizeMock = vi.fn();

      window.electronAPI = {
        ...window.electronAPI,
        window: {
          ...window.electronAPI.window,
          maximize: maximizeMock,
        },
      };

      render(<WindowControls />, { wrapper });

      const maximizeButton = screen.getByLabelText(messages.en['window.maximize']);

      maximizeButton.click();

      await vi.waitFor(() => {
        expect(maximizeMock).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('when hide to tray button is clicked', () => {
    it('passes showTrayMessage value to hideToTray', async () => {
      const hideToTrayMock = vi.fn();

      window.electronAPI = {
        ...window.electronAPI,
        window: {
          ...window.electronAPI.window,
          hideToTray: hideToTrayMock,
        },
      };

      useAppStore.setState({ showTrayMessage: false });

      render(<WindowControls />, { wrapper });

      const hideButton = screen.getByLabelText(messages.en['window.hideToTray']);

      hideButton.click();

      await vi.waitFor(() => {
        expect(hideToTrayMock).toHaveBeenCalledWith(false);
      });
    });
  });
});
