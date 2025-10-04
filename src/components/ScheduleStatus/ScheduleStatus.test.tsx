import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import ScheduleStatus from './ScheduleStatus';
import { useAppStore } from '@/store/useAppStore';
import { messages } from '@/i18n/config';
import React from 'react';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <IntlProvider locale="en" messages={messages.en}>
    {children}
  </IntlProvider>
);

describe('ScheduleStatus', () => {
  describe('when scheduleEnabled is false', () => {
    it('renders nothing', () => {
      useAppStore.setState({
        scheduleEnabled: false,
        movementStatus: 'stopped',
        scheduleConfig: [],
      });

      render(<ScheduleStatus />, { wrapper });

      expect(screen.queryByText(messages.en['schedule.status.running'])).not.toBeInTheDocument();
    });
  });

  describe('when scheduleEnabled is true', () => {
    describe('when status is moving', () => {
      it('displays running status', () => {
        useAppStore.setState({
          scheduleEnabled: true,
          movementStatus: 'moving',
          scheduleConfig: [{ dayIndex: 1, start: '09:00', end: '17:00' }],
        });

        render(<ScheduleStatus />, { wrapper });

        expect(screen.getByText(messages.en['schedule.status.running'])).toBeInTheDocument();
      });
    });

    describe('when status is waiting', () => {
      it('displays outside schedule status', () => {
        useAppStore.setState({
          scheduleEnabled: true,
          movementStatus: 'waiting',
          scheduleConfig: [{ dayIndex: 1, start: '09:00', end: '17:00' }],
        });

        render(<ScheduleStatus />, { wrapper });

        expect(screen.getByText(messages.en['schedule.status.outsideSchedule'])).toBeInTheDocument();
      });
    });

    describe('when status is stopped and no schedule configured', () => {
      it('displays no schedule status', () => {
        useAppStore.setState({
          scheduleEnabled: true,
          movementStatus: 'stopped',
          scheduleConfig: [],
        });

        render(<ScheduleStatus />, { wrapper });

        expect(screen.getByText(messages.en['schedule.status.noSchedule'])).toBeInTheDocument();
      });
    });

    describe('when status is stopped and schedule is configured', () => {
      it('displays stopped status', () => {
        useAppStore.setState({
          scheduleEnabled: true,
          movementStatus: 'stopped',
          scheduleConfig: [{ dayIndex: 1, start: '09:00', end: '17:00' }],
        });

        render(<ScheduleStatus />, { wrapper });

        expect(screen.getByText(messages.en['schedule.status.stopped'])).toBeInTheDocument();
      });
    });
  });
});
