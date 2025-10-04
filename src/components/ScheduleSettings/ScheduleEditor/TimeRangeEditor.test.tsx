import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import TimeRangeEditor from './TimeRangeEditor';
import { messages } from '@/i18n/config';

describe('TimeRangeEditor', () => {
  describe('when component renders with one time range', () => {
    it('displays start and end time inputs', () => {
      const timeRanges = [{ start: '09:00', end: '17:00' }];

      render(
        <IntlProvider locale="en" messages={messages.en}>
          <TimeRangeEditor
            timeRanges={timeRanges}
            onUpdateTimeRange={vi.fn()}
            onRemoveTimeRange={vi.fn()}
            onAddTimeRange={vi.fn()}
            canAddMore={true}
            validationError={null}
          />
        </IntlProvider>
      );

      const startInput = screen.getByLabelText(/Start time 1/) as HTMLInputElement;
      const endInput = screen.getByLabelText(/End time 1/) as HTMLInputElement;

      expect(startInput.value).toBe('09:00');
      expect(endInput.value).toBe('17:00');
    });

    it('displays remove button', () => {
      const timeRanges = [{ start: '09:00', end: '17:00' }];

      render(
        <IntlProvider locale="en" messages={messages.en}>
          <TimeRangeEditor
            timeRanges={timeRanges}
            onUpdateTimeRange={vi.fn()}
            onRemoveTimeRange={vi.fn()}
            onAddTimeRange={vi.fn()}
            canAddMore={true}
            validationError={null}
          />
        </IntlProvider>
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
        <IntlProvider locale="en" messages={messages.en}>
          <TimeRangeEditor
            timeRanges={timeRanges}
            onUpdateTimeRange={vi.fn()}
            onRemoveTimeRange={vi.fn()}
            onAddTimeRange={vi.fn()}
            canAddMore={true}
            validationError={null}
          />
        </IntlProvider>
      );

      expect(screen.getByLabelText(/Start time 1/)).toBeInTheDocument();
      expect(screen.getByLabelText(/End time 1/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Start time 2/)).toBeInTheDocument();
      expect(screen.getByLabelText(/End time 2/)).toBeInTheDocument();
    });
  });

  describe('when canAddMore is true', () => {
    it('displays add time range button', () => {
      const timeRanges = [{ start: '09:00', end: '17:00' }];

      render(
        <IntlProvider locale="en" messages={messages.en}>
          <TimeRangeEditor
            timeRanges={timeRanges}
            onUpdateTimeRange={vi.fn()}
            onRemoveTimeRange={vi.fn()}
            onAddTimeRange={vi.fn()}
            canAddMore={true}
            validationError={null}
          />
        </IntlProvider>
      );

      expect(screen.getByText(messages.en['schedule.addTimeRange'])).toBeInTheDocument();
    });
  });

  describe('when canAddMore is false', () => {
    it('does not display add time range button', () => {
      const timeRanges = [{ start: '09:00', end: '17:00' }];

      render(
        <IntlProvider locale="en" messages={messages.en}>
          <TimeRangeEditor
            timeRanges={timeRanges}
            onUpdateTimeRange={vi.fn()}
            onRemoveTimeRange={vi.fn()}
            onAddTimeRange={vi.fn()}
            canAddMore={false}
            validationError={null}
          />
        </IntlProvider>
      );

      expect(screen.queryByText(messages.en['schedule.addTimeRange'])).not.toBeInTheDocument();
    });
  });

  describe('when validation error exists', () => {
    it('displays error message', () => {
      const timeRanges = [{ start: '09:00', end: '17:00' }];
      const error = 'Invalid time range';

      render(
        <IntlProvider locale="en" messages={messages.en}>
          <TimeRangeEditor
            timeRanges={timeRanges}
            onUpdateTimeRange={vi.fn()}
            onRemoveTimeRange={vi.fn()}
            onAddTimeRange={vi.fn()}
            canAddMore={true}
            validationError={error}
          />
        </IntlProvider>
      );

      expect(screen.getByText(error)).toBeInTheDocument();
    });
  });

  describe('when start time is changed', () => {
    it('calls onUpdateTimeRange with correct parameters', () => {
      const onUpdateTimeRangeMock = vi.fn();
      const timeRanges = [{ start: '09:00', end: '17:00' }];

      render(
        <IntlProvider locale="en" messages={messages.en}>
          <TimeRangeEditor
            timeRanges={timeRanges}
            onUpdateTimeRange={onUpdateTimeRangeMock}
            onRemoveTimeRange={vi.fn()}
            onAddTimeRange={vi.fn()}
            canAddMore={true}
            validationError={null}
          />
        </IntlProvider>
      );

      const startInput = screen.getByLabelText(/Start time 1/);

      fireEvent.change(startInput, { target: { value: '10:00' } });

      expect(onUpdateTimeRangeMock).toHaveBeenCalledWith(0, 'start', '10:00');
    });
  });

  describe('when end time is changed', () => {
    it('calls onUpdateTimeRange with correct parameters', () => {
      const onUpdateTimeRangeMock = vi.fn();
      const timeRanges = [{ start: '09:00', end: '17:00' }];

      render(
        <IntlProvider locale="en" messages={messages.en}>
          <TimeRangeEditor
            timeRanges={timeRanges}
            onUpdateTimeRange={onUpdateTimeRangeMock}
            onRemoveTimeRange={vi.fn()}
            onAddTimeRange={vi.fn()}
            canAddMore={true}
            validationError={null}
          />
        </IntlProvider>
      );

      const endInput = screen.getByLabelText(/End time 1/);

      fireEvent.change(endInput, { target: { value: '18:00' } });

      expect(onUpdateTimeRangeMock).toHaveBeenCalledWith(0, 'end', '18:00');
    });
  });

  describe('when remove button is clicked', () => {
    it('calls onRemoveTimeRange with correct index', () => {
      const onRemoveTimeRangeMock = vi.fn();
      const timeRanges = [{ start: '09:00', end: '17:00' }];

      render(
        <IntlProvider locale="en" messages={messages.en}>
          <TimeRangeEditor
            timeRanges={timeRanges}
            onUpdateTimeRange={vi.fn()}
            onRemoveTimeRange={onRemoveTimeRangeMock}
            onAddTimeRange={vi.fn()}
            canAddMore={true}
            validationError={null}
          />
        </IntlProvider>
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
        <IntlProvider locale="en" messages={messages.en}>
          <TimeRangeEditor
            timeRanges={timeRanges}
            onUpdateTimeRange={vi.fn()}
            onRemoveTimeRange={vi.fn()}
            onAddTimeRange={onAddTimeRangeMock}
            canAddMore={true}
            validationError={null}
          />
        </IntlProvider>
      );

      const addButton = screen.getByText(messages.en['schedule.addTimeRange']);
      fireEvent.click(addButton);

      expect(onAddTimeRangeMock).toHaveBeenCalledTimes(1);
    });
  });
});
