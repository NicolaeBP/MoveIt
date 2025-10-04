import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import ActionButton from './ActionButton';
import { useAppStore } from '@/store/useAppStore';
import { messages } from '@/i18n/config';
import type { ScheduleConfig } from '@shared/types';

const renderComponent = () => render(
  <IntlProvider locale="en" messages={messages.en}>
    <ActionButton />
  </IntlProvider>
);

describe('ActionButton', () => {
  beforeEach(() => {
    useAppStore.setState({
      interval: 60000,
      scheduleConfig: [],
      scheduleEnabled: false,
      movementStatus: 'stopped',
      openModal: vi.fn(),
      closeModal: vi.fn(),
    });
  });

  describe('when movement is stopped', () => {
    it('displays start button', () => {
      renderComponent();

      expect(screen.getByText(messages.en['action.start'])).toBeInTheDocument();
    });

    it('has aria-pressed as false', () => {
      renderComponent();

      const button = screen.getByRole('button');

      expect(button).toHaveAttribute('aria-pressed', 'false');
    });
  });

  describe('when movement is running', () => {
    it('displays stop button', () => {
      useAppStore.setState({ movementStatus: 'moving' });

      renderComponent();

      expect(screen.getByText(messages.en['action.stop'])).toBeInTheDocument();
    });

    it('has aria-pressed as true', () => {
      useAppStore.setState({ movementStatus: 'moving' });

      renderComponent();

      const button = screen.getByRole('button');

      expect(button).toHaveAttribute('aria-pressed', 'true');
    });
  });

  describe('when schedule is enabled but not configured', () => {
    it('disables the button', () => {
      useAppStore.setState({ scheduleEnabled: true, scheduleConfig: [] });

      renderComponent();

      const button = screen.getByRole('button');

      expect(button).toBeDisabled();
    });
  });

  describe('when button is clicked successfully', () => {
    it('calls mouse mover toggle with correct parameters', async () => {
      const toggleMock = vi.fn().mockResolvedValue(true);

      window.electronAPI = {
        ...window.electronAPI,
        mouseMover: { ...window.electronAPI.mouseMover, toggle: toggleMock },
      };

      useAppStore.setState({ interval: 60000, scheduleEnabled: false, scheduleConfig: [] });

      renderComponent();

      const button = screen.getByRole('button');

      fireEvent.click(button);

      await waitFor(() => {
        expect(toggleMock).toHaveBeenCalledWith(60000, []);
      });
    });

    it('passes schedule config when schedule is enabled', async () => {
      const toggleMock = vi.fn().mockResolvedValue(true);

      window.electronAPI = {
        ...window.electronAPI,
        mouseMover: { ...window.electronAPI.mouseMover, toggle: toggleMock },
      };

      const scheduleConfig: ScheduleConfig = [{ dayIndex: 1, start: '09:00', end: '17:00' }];

      useAppStore.setState({ interval: 60000, scheduleEnabled: true, scheduleConfig });

      renderComponent();

      const button = screen.getByRole('button');

      fireEvent.click(button);

      await waitFor(() => {
        expect(toggleMock).toHaveBeenCalledWith(60000, scheduleConfig);
      });
    });
  });

  describe('when toggle fails due to permissions', () => {
    it('opens accessibility modal with correct content', async () => {
      const toggleMock = vi.fn().mockResolvedValue(false);
      const openModalMock = vi.fn();

      window.electronAPI = {
        ...window.electronAPI,
        mouseMover: { ...window.electronAPI.mouseMover, toggle: toggleMock },
      };

      useAppStore.setState({ openModal: openModalMock, movementStatus: 'stopped' });

      renderComponent();

      const button = screen.getByRole('button');

      fireEvent.click(button);

      await waitFor(() => {
        expect(openModalMock).toHaveBeenCalledTimes(1);
      });

      const modalConfig = openModalMock.mock.calls[0][0];

      render(
        <IntlProvider locale="en" messages={messages.en}>
          <div>
            {modalConfig.title}
            {modalConfig.body}
            {modalConfig.footer}
          </div>
        </IntlProvider>
      );

      expect(screen.getByText(messages.en['accessibility.title'])).toBeInTheDocument();
      expect(screen.getByText(messages.en['accessibility.intro'])).toBeInTheDocument();
      expect(screen.getByText(messages.en['accessibility.cancel'])).toBeInTheDocument();
      expect(screen.getByText(messages.en['accessibility.openSettings'])).toBeInTheDocument();
    });
  });
});
