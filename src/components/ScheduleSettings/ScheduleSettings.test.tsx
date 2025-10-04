import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import ScheduleSettings from './ScheduleSettings';
import { useAppStore } from '@/store/useAppStore';
import { messages } from '@/i18n/config';
import * as timeUtils from '@/utils/timeUtils';
import React from 'react';

vi.mock('@/utils/timeUtils', async () => {
  const actual = await vi.importActual('@/utils/timeUtils');

  return {
    ...actual,
    getCurrentWeekDay: vi.fn(),
  };
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <IntlProvider locale="en" messages={messages.en}>
    {children}
  </IntlProvider>
);

describe('ScheduleSettings', () => {
  beforeEach(() => {
    vi.mocked(timeUtils.getCurrentWeekDay).mockReturnValue('monday');

    useAppStore.setState({
      scheduleConfig: [],
      scheduleEnabled: false,
      movementStatus: 'stopped',
      updateDaySchedule: vi.fn(),
      setScheduleEnabled: vi.fn(),
    });
  });

  describe('when schedule is collapsed', () => {
    it('renders toggle and expand button', () => {
      render(<ScheduleSettings />, { wrapper });

      expect(screen.getByText(messages.en['schedule.title'])).toBeInTheDocument();
      expect(screen.getByLabelText(messages.en['schedule.expand'])).toBeInTheDocument();
    });

    it('does not show day schedule list', () => {
      render(<ScheduleSettings />, { wrapper });

      expect(screen.queryByText(messages.en['days.monday'])).not.toBeInTheDocument();
    });
  });

  describe('when expand button is clicked', () => {
    it('expands and shows schedule details', () => {
      render(<ScheduleSettings />, { wrapper });

      const expandButton = screen.getByLabelText(messages.en['schedule.expand']);

      fireEvent.click(expandButton);

      expect(screen.getByText(messages.en['days.monday'])).toBeInTheDocument();
      expect(screen.getByLabelText(messages.en['schedule.collapse'])).toBeInTheDocument();
    });
  });

  describe('when schedule toggle is clicked', () => {
    it('calls setScheduleEnabled', () => {
      const setScheduleEnabledMock = vi.fn();
      useAppStore.setState({ setScheduleEnabled: setScheduleEnabledMock });

      render(<ScheduleSettings />, { wrapper });

      const toggleButton = screen.getByRole('switch');

      fireEvent.click(toggleButton);

      expect(setScheduleEnabledMock).toHaveBeenCalledWith(true);
    });
  });

  describe('when movement is running', () => {
    it('cancels editing', () => {
      useAppStore.setState({
        scheduleConfig: [{ dayIndex: 1, start: '09:00', end: '17:00' }],
      });

      const { rerender } = render(<ScheduleSettings />, { wrapper });

      const expandButton = screen.getByLabelText(messages.en['schedule.expand']);

      fireEvent.click(expandButton);

      act(() => {
        useAppStore.setState({ movementStatus: 'moving' });
        rerender(<ScheduleSettings />);
      });

      expect(screen.queryByText(messages.en['schedule.save'])).not.toBeInTheDocument();
    });
  });

  describe('when toggling a day with no schedule', () => {
    it('starts editing with default time range', () => {
      render(<ScheduleSettings />, { wrapper });

      const expandButton = screen.getByLabelText(messages.en['schedule.expand']);

      fireEvent.click(expandButton);

      const mondayToggle = screen.getAllByRole('checkbox')[1];

      fireEvent.click(mondayToggle);

      expect(screen.getByText(messages.en['schedule.save'])).toBeInTheDocument();
      expect(screen.getByText(messages.en['schedule.cancel'])).toBeInTheDocument();
    });
  });

  describe('when toggling a day with existing schedule', () => {
    it('clears the schedule', () => {
      const updateDayScheduleMock = vi.fn();

      useAppStore.setState({
        scheduleConfig: [{ dayIndex: 1, start: '09:00', end: '17:00' }],
        updateDaySchedule: updateDayScheduleMock,
      });

      render(<ScheduleSettings />, { wrapper });

      const expandButton = screen.getByLabelText(messages.en['schedule.expand']);

      fireEvent.click(expandButton);

      const mondayToggle = screen.getAllByRole('checkbox')[0];

      fireEvent.click(mondayToggle);

      expect(updateDayScheduleMock).toHaveBeenCalledWith('monday', []);
    });
  });

  describe('when editing a day', () => {
    it('shows schedule editor', () => {
      useAppStore.setState({
        scheduleConfig: [{ dayIndex: 1, start: '09:00', end: '17:00' }],
      });

      render(<ScheduleSettings />, { wrapper });

      const expandButton = screen.getByLabelText(messages.en['schedule.expand']);

      fireEvent.click(expandButton);

      const editButton = screen.getByText(messages.en['schedule.edit']);

      fireEvent.click(editButton);

      expect(screen.getByText(messages.en['schedule.save'])).toBeInTheDocument();
      expect(screen.getByText(messages.en['schedule.cancel'])).toBeInTheDocument();
    });
  });
});
