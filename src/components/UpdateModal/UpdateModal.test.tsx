import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { UpdateModal } from './UpdateModal';
import { useAppStore } from '@/store/useAppStore';
import { messages } from '@/i18n/config';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <IntlProvider locale="en" messages={messages.en}>
    {children}
  </IntlProvider>
);

describe('UpdateModal', () => {
  beforeEach(() => {
    useAppStore.setState({
      closeModal: vi.fn(),
    });

    globalThis.electronAPI = {
      ...globalThis.electronAPI,
      updates: {
        ...globalThis.electronAPI.updates,
        restartAndInstall: vi.fn(),
      },
    };
  });

  describe('when rendered with version', () => {
    it('displays new version message with version number', () => {
      render(<UpdateModal version="1.0.5" />, { wrapper });

      expect(
        screen.getByText(
          messages.en['updates.newVersionAvailable'].replace('{version}', '1.0.5')
        )
      ).toBeInTheDocument();
    });

    it('displays ready to install message', () => {
      render(<UpdateModal version="1.0.5" />, { wrapper });

      expect(screen.getByText(messages.en['updates.readyToInstall'])).toBeInTheDocument();
    });

    it('displays close button', () => {
      render(<UpdateModal version="1.0.5" />, { wrapper });

      expect(screen.getByText(messages.en['common.close'])).toBeInTheDocument();
    });

    it('displays restart now button', () => {
      render(<UpdateModal version="1.0.5" />, { wrapper });

      expect(screen.getByText(messages.en['updates.restartNow'])).toBeInTheDocument();
    });
  });

  describe('when close button is clicked', () => {
    it('calls closeModal', () => {
      const closeModalMock = vi.fn();

      useAppStore.setState({ closeModal: closeModalMock });

      render(<UpdateModal version="1.0.5" />, { wrapper });

      const closeButton = screen.getByText(messages.en['common.close']);

      fireEvent.click(closeButton);

      expect(closeModalMock).toHaveBeenCalledOnce();
    });
  });

  describe('when restart now button is clicked', () => {
    it('calls electronAPI.updates.restartAndInstall', () => {
      const restartAndInstallMock = vi.fn();

      globalThis.electronAPI.updates.restartAndInstall = restartAndInstallMock;

      render(<UpdateModal version="1.0.5" />, { wrapper });

      const restartButton = screen.getByText(messages.en['updates.restartNow']);

      fireEvent.click(restartButton);

      expect(restartAndInstallMock).toHaveBeenCalledOnce();
    });
  });
});
