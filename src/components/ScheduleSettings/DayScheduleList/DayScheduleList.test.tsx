import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import DayScheduleList from './DayScheduleList';
import { messages } from '@/i18n/config';

describe('DayScheduleList', () => {
  describe('when schedule is not active', () => {
    it('displays unchecked checkbox', () => {
      render(
        <IntlProvider locale="en" messages={messages.en}>
          <DayScheduleList day="monday" schedule={[]} isCurrentDay={false} onToggle={vi.fn()} onEdit={vi.fn()} />
        </IntlProvider>
      );

      const checkbox = screen.getByRole('checkbox');

      expect(checkbox).not.toBeChecked();
    });

    it('does not display edit button', () => {
      render(
        <IntlProvider locale="en" messages={messages.en}>
          <DayScheduleList day="monday" schedule={[]} isCurrentDay={false} onToggle={vi.fn()} onEdit={vi.fn()} />
        </IntlProvider>
      );

      expect(screen.queryByText(messages.en['schedule.edit'])).not.toBeInTheDocument();
    });
  });

  describe('when schedule is active', () => {
    const schedule = [{ dayIndex: 1, start: '09:00', end: '17:00' }];

    it('displays checked checkbox', () => {
      render(
        <IntlProvider locale="en" messages={messages.en}>
          <DayScheduleList day="monday" schedule={schedule} isCurrentDay={false} onToggle={vi.fn()} onEdit={vi.fn()} />
        </IntlProvider>
      );

      const checkbox = screen.getByRole('checkbox');

      expect(checkbox).toBeChecked();
    });

    it('displays schedule time ranges', () => {
      render(
        <IntlProvider locale="en" messages={messages.en}>
          <DayScheduleList day="monday" schedule={schedule} isCurrentDay={false} onToggle={vi.fn()} onEdit={vi.fn()} />
        </IntlProvider>
      );

      expect(screen.getByText(/09:00 - 17:00/)).toBeInTheDocument();
    });

    it('displays edit button', () => {
      render(
        <IntlProvider locale="en" messages={messages.en}>
          <DayScheduleList day="monday" schedule={schedule} isCurrentDay={false} onToggle={vi.fn()} onEdit={vi.fn()} />
        </IntlProvider>
      );

      expect(screen.getByText(messages.en['schedule.edit'])).toBeInTheDocument();
    });
  });

  describe('when is current day', () => {
    it('displays today indicator', () => {
      render(
        <IntlProvider locale="en" messages={messages.en}>
          <DayScheduleList day="monday" schedule={[]} isCurrentDay={true} onToggle={vi.fn()} onEdit={vi.fn()} />
        </IntlProvider>
      );

      expect(screen.getByText(/today/i)).toBeInTheDocument();
    });
  });

  describe('when multiple time ranges exist', () => {
    it('displays all time ranges', () => {
      const schedule = [
        { dayIndex: 1, start: '09:00', end: '12:00' },
        { dayIndex: 1, start: '13:00', end: '17:00' },
      ];

      render(
        <IntlProvider locale="en" messages={messages.en}>
          <DayScheduleList day="monday" schedule={schedule} isCurrentDay={false} onToggle={vi.fn()} onEdit={vi.fn()} />
        </IntlProvider>
      );

      expect(screen.getByText(/09:00 - 12:00/)).toBeInTheDocument();
      expect(screen.getByText(/13:00 - 17:00/)).toBeInTheDocument();
    });
  });

  describe('when checkbox is toggled', () => {
    it('calls onToggle with correct day', () => {
      const onToggleMock = vi.fn();

      render(
        <IntlProvider locale="en" messages={messages.en}>
          <DayScheduleList day="monday" schedule={[]} isCurrentDay={false} onToggle={onToggleMock} onEdit={vi.fn()} />
        </IntlProvider>
      );

      const checkbox = screen.getByRole('checkbox');

      fireEvent.click(checkbox);

      expect(onToggleMock).toHaveBeenCalledWith('monday');
    });
  });

  describe('when edit button is clicked', () => {
    it('calls onEdit with correct day', () => {
      const onEditMock = vi.fn();
      const schedule = [{ dayIndex: 1, start: '09:00', end: '17:00' }];

      render(
        <IntlProvider locale="en" messages={messages.en}>
          <DayScheduleList day="monday" schedule={schedule} isCurrentDay={false} onToggle={vi.fn()} onEdit={onEditMock} />
        </IntlProvider>
      );

      const editButton = screen.getByText(messages.en['schedule.edit']);

      fireEvent.click(editButton);

      expect(onEditMock).toHaveBeenCalledWith('monday');
    });
  });

  describe('when disabled prop is true', () => {
    it('disables the checkbox', () => {
      render(
        <IntlProvider locale="en" messages={messages.en}>
          <DayScheduleList day="monday" schedule={[]} isCurrentDay={false} onToggle={vi.fn()} onEdit={vi.fn()} disabled={true} />
        </IntlProvider>
      );

      const checkbox = screen.getByRole('checkbox');

      expect(checkbox).toBeDisabled();
    });

    it('hides edit button even when schedule is active', () => {
      const schedule = [{ dayIndex: 1, start: '09:00', end: '17:00' }];

      render(
        <IntlProvider locale="en" messages={messages.en}>
          <DayScheduleList day="monday" schedule={schedule} isCurrentDay={false} onToggle={vi.fn()} onEdit={vi.fn()} disabled={true} />
        </IntlProvider>
      );

      expect(screen.queryByText(messages.en['schedule.edit'])).not.toBeInTheDocument();
    });
  });
});
