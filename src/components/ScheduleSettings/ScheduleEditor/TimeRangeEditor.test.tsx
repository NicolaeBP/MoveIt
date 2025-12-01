import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import TimeRangeEditor from './TimeRangeEditor';
import { messages } from '@/i18n/config';
import React from 'react';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <IntlProvider locale="en" messages={messages.en}>
    {children}
  </IntlProvider>
);

describe('TimeRangeEditor', () => {
  describe('when component renders with one time range', () => {
    it('displays start and end time selects with correct values', () => {
      const timeRanges = [{ start: '09:00', end: '17:00' }];

      render(
        <TimeRangeEditor
          timeRanges={timeRanges}
          onUpdateTimeRange={vi.fn()}
          onRemoveTimeRange={vi.fn()}
          onAddTimeRange={vi.fn()}
          canAddMore={true}
          validationError={null}
        />,
        { wrapper }
      );

      const startHours = screen.getByLabelText(`${messages.en['schedule.startTime']} 1 ${messages.en['time.hours']}`) as HTMLSelectElement;
      const startMinutes = screen.getByLabelText(
        `${messages.en['schedule.startTime']} 1 ${messages.en['time.minutes']}`
      ) as HTMLSelectElement;
      const endHours = screen.getByLabelText(`${messages.en['schedule.endTime']} 1 ${messages.en['time.hours']}`) as HTMLSelectElement;
      const endMinutes = screen.getByLabelText(`${messages.en['schedule.endTime']} 1 ${messages.en['time.minutes']}`) as HTMLSelectElement;

      expect(startHours.value).toBe('09');
      expect(startMinutes.value).toBe('00');
      expect(endHours.value).toBe('17');
      expect(endMinutes.value).toBe('00');
    });

    it('displays remove button', () => {
      const timeRanges = [{ start: '09:00', end: '17:00' }];

      render(
        <TimeRangeEditor
          timeRanges={timeRanges}
          onUpdateTimeRange={vi.fn()}
          onRemoveTimeRange={vi.fn()}
          onAddTimeRange={vi.fn()}
          canAddMore={true}
          validationError={null}
        />,
        { wrapper }
      );

      expect(screen.getByText(messages.en['schedule.removeTimeRange'])).toBeInTheDocument();
    });
  });

  describe('when multiple time ranges exist', () => {
    it('displays all time ranges', () => {
      const timeRanges = [
        { start: '09:00', end: '12:00' },
        { start: '13:00', end: '17:00' },
      ];

      render(
        <TimeRangeEditor
          timeRanges={timeRanges}
          onUpdateTimeRange={vi.fn()}
          onRemoveTimeRange={vi.fn()}
          onAddTimeRange={vi.fn()}
          canAddMore={true}
          validationError={null}
        />,
        { wrapper }
      );

      expect(screen.getByLabelText(`${messages.en['schedule.startTime']} 1 ${messages.en['time.hours']}`)).toBeInTheDocument();
      expect(screen.getByLabelText(`${messages.en['schedule.endTime']} 1 ${messages.en['time.hours']}`)).toBeInTheDocument();
      expect(screen.getByLabelText(`${messages.en['schedule.startTime']} 2 ${messages.en['time.hours']}`)).toBeInTheDocument();
      expect(screen.getByLabelText(`${messages.en['schedule.endTime']} 2 ${messages.en['time.hours']}`)).toBeInTheDocument();
    });
  });

  describe('when canAddMore is true', () => {
    it('displays add time range button', () => {
      const timeRanges = [{ start: '09:00', end: '17:00' }];

      render(
        <TimeRangeEditor
          timeRanges={timeRanges}
          onUpdateTimeRange={vi.fn()}
          onRemoveTimeRange={vi.fn()}
          onAddTimeRange={vi.fn()}
          canAddMore={true}
          validationError={null}
        />,
        { wrapper }
      );

      expect(screen.getByText(messages.en['schedule.addTimeRange'])).toBeInTheDocument();
    });
  });

  describe('when canAddMore is false', () => {
    it('does not display add time range button', () => {
      const timeRanges = [{ start: '09:00', end: '17:00' }];

      render(
        <TimeRangeEditor
          timeRanges={timeRanges}
          onUpdateTimeRange={vi.fn()}
          onRemoveTimeRange={vi.fn()}
          onAddTimeRange={vi.fn()}
          canAddMore={false}
          validationError={null}
        />,
        { wrapper }
      );

      expect(screen.queryByText(messages.en['schedule.addTimeRange'])).not.toBeInTheDocument();
    });
  });

  describe('when validation error exists', () => {
    it('displays error message', () => {
      const timeRanges = [{ start: '09:00', end: '17:00' }];
      const error = 'Invalid time range';

      render(
        <TimeRangeEditor
          timeRanges={timeRanges}
          onUpdateTimeRange={vi.fn()}
          onRemoveTimeRange={vi.fn()}
          onAddTimeRange={vi.fn()}
          canAddMore={true}
          validationError={error}
        />,
        { wrapper }
      );

      expect(screen.getByText(error)).toBeInTheDocument();
    });
  });

  describe('when start time hour is changed', () => {
    it('calls onUpdateTimeRange with correct parameters', () => {
      const onUpdateTimeRangeMock = vi.fn();
      const timeRanges = [{ start: '09:00', end: '17:00' }];

      render(
        <TimeRangeEditor
          timeRanges={timeRanges}
          onUpdateTimeRange={onUpdateTimeRangeMock}
          onRemoveTimeRange={vi.fn()}
          onAddTimeRange={vi.fn()}
          canAddMore={true}
          validationError={null}
        />,
        { wrapper }
      );

      const startHoursSelect = screen.getByLabelText(`${messages.en['schedule.startTime']} 1 ${messages.en['time.hours']}`);

      fireEvent.change(startHoursSelect, { target: { value: '10' } });

      expect(onUpdateTimeRangeMock).toHaveBeenCalledWith(0, 'start', '10:00');
    });
  });

  describe('when end time hour is changed', () => {
    it('calls onUpdateTimeRange with correct parameters', () => {
      const onUpdateTimeRangeMock = vi.fn();
      const timeRanges = [{ start: '09:00', end: '17:00' }];

      render(
        <TimeRangeEditor
          timeRanges={timeRanges}
          onUpdateTimeRange={onUpdateTimeRangeMock}
          onRemoveTimeRange={vi.fn()}
          onAddTimeRange={vi.fn()}
          canAddMore={true}
          validationError={null}
        />,
        { wrapper }
      );

      const endHoursSelect = screen.getByLabelText(`${messages.en['schedule.endTime']} 1 ${messages.en['time.hours']}`);

      fireEvent.change(endHoursSelect, { target: { value: '18' } });

      expect(onUpdateTimeRangeMock).toHaveBeenCalledWith(0, 'end', '18:00');
    });
  });

  describe('when remove button is clicked', () => {
    it('calls onRemoveTimeRange with correct index', () => {
      const onRemoveTimeRangeMock = vi.fn();
      const timeRanges = [{ start: '09:00', end: '17:00' }];

      render(
        <TimeRangeEditor
          timeRanges={timeRanges}
          onUpdateTimeRange={vi.fn()}
          onRemoveTimeRange={onRemoveTimeRangeMock}
          onAddTimeRange={vi.fn()}
          canAddMore={true}
          validationError={null}
        />,
        { wrapper }
      );

      const removeButton = screen.getByText(messages.en['schedule.removeTimeRange']);

      fireEvent.click(removeButton);

      expect(onRemoveTimeRangeMock).toHaveBeenCalledWith(0);
    });
  });

  describe('when add time range button is clicked', () => {
    it('calls onAddTimeRange', () => {
      const onAddTimeRangeMock = vi.fn();
      const timeRanges = [{ start: '09:00', end: '17:00' }];

      render(
        <TimeRangeEditor
          timeRanges={timeRanges}
          onUpdateTimeRange={vi.fn()}
          onRemoveTimeRange={vi.fn()}
          onAddTimeRange={onAddTimeRangeMock}
          canAddMore={true}
          validationError={null}
        />,
        { wrapper }
      );

      const addButton = screen.getByText(messages.en['schedule.addTimeRange']);
      fireEvent.click(addButton);

      expect(onAddTimeRangeMock).toHaveBeenCalledTimes(1);
    });
  });
});
