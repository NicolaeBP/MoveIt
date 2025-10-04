import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import ScheduleEditor from './ScheduleEditor';
import { messages } from '@/i18n/config';
import React from 'react';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <IntlProvider locale="en" messages={messages.en}>
    {children}
  </IntlProvider>
);

describe('ScheduleEditor', () => {
  describe('when time ranges are provided', () => {
    it('renders TimeRangeEditor with time ranges', () => {
      const timeRanges = [{ start: '09:00', end: '17:00' }];

      render(
        <ScheduleEditor
          timeRanges={timeRanges}
          validationError={null}
          canAddMore={true}
          onUpdateTimeRange={vi.fn()}
          onRemoveTimeRange={vi.fn()}
          onAddTimeRange={vi.fn()}
          onSave={vi.fn()}
          onCancel={vi.fn()}
        />,
        { wrapper }
      );

      expect(screen.getByText(messages.en['schedule.save'])).toBeInTheDocument();
      expect(screen.getByText(messages.en['schedule.cancel'])).toBeInTheDocument();
    });
  });

  describe('when validation error exists', () => {
    it('passes validation error to TimeRangeEditor', () => {
      const validationError = 'Time ranges overlap';

      render(
        <ScheduleEditor
          timeRanges={[{ start: '09:00', end: '17:00' }]}
          validationError={validationError}
          canAddMore={true}
          onUpdateTimeRange={vi.fn()}
          onRemoveTimeRange={vi.fn()}
          onAddTimeRange={vi.fn()}
          onSave={vi.fn()}
          onCancel={vi.fn()}
        />,
        { wrapper }
      );

      expect(screen.getByText(validationError)).toBeInTheDocument();
    });
  });

  describe('when save button is clicked', () => {
    it('calls onSave', () => {
      const onSaveMock = vi.fn();

      render(
        <ScheduleEditor
          timeRanges={[{ start: '09:00', end: '17:00' }]}
          validationError={null}
          canAddMore={true}
          onUpdateTimeRange={vi.fn()}
          onRemoveTimeRange={vi.fn()}
          onAddTimeRange={vi.fn()}
          onSave={onSaveMock}
          onCancel={vi.fn()}
        />,
        { wrapper }
      );

      const saveButton = screen.getByText(messages.en['schedule.save']);
      fireEvent.click(saveButton);

      expect(onSaveMock).toHaveBeenCalled();
    });
  });

  describe('when cancel button is clicked', () => {
    it('calls onCancel', () => {
      const onCancelMock = vi.fn();

      render(
        <ScheduleEditor
          timeRanges={[{ start: '09:00', end: '17:00' }]}
          validationError={null}
          canAddMore={true}
          onUpdateTimeRange={vi.fn()}
          onRemoveTimeRange={vi.fn()}
          onAddTimeRange={vi.fn()}
          onSave={vi.fn()}
          onCancel={onCancelMock}
        />,
        { wrapper }
      );

      const cancelButton = screen.getByText(messages.en['schedule.cancel']);
      fireEvent.click(cancelButton);

      expect(onCancelMock).toHaveBeenCalled();
    });
  });
});
