import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { useScheduleEditor } from './useScheduleEditor';
import { useAppStore } from '@/store/useAppStore';
import { messages } from '@/i18n/config';
import React from 'react';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <IntlProvider locale="en" messages={messages.en}>
    {children}
  </IntlProvider>
);

describe('useScheduleEditor', () => {
  beforeEach(() => {
    useAppStore.setState({ updateDaySchedule: vi.fn() });
  });

  describe('when startEditing is called', () => {
    it('sets editing day and time ranges', () => {
      const { result } = renderHook(() => useScheduleEditor(), { wrapper });
      const timeRanges = [{ start: '09:00', end: '17:00' }];

      act(() => {
        result.current.startEditing('monday', timeRanges);
      });

      expect(result.current.editingDay).toBe('monday');
      expect(result.current.tempTimeRanges).toEqual(timeRanges);
      expect(result.current.validationError).toBeNull();
    });
  });

  describe('when cancelEditing is called', () => {
    it('clears editing state', () => {
      const { result } = renderHook(() => useScheduleEditor(), { wrapper });

      act(() => {
        result.current.startEditing('monday', [{ start: '09:00', end: '17:00' }]);
      });

      act(() => {
        result.current.cancelEditing();
      });

      expect(result.current.editingDay).toBeNull();
      expect(result.current.tempTimeRanges).toEqual([]);
      expect(result.current.validationError).toBeNull();
    });
  });

  describe('when saveTimeRanges is called', () => {
    describe('when validation passes', () => {
      it('calls updateDaySchedule and clears editing state', () => {
        const updateDayScheduleMock = vi.fn();

        useAppStore.setState({ updateDaySchedule: updateDayScheduleMock });

        const { result } = renderHook(() => useScheduleEditor(), { wrapper });
        const timeRanges = [{ start: '09:00', end: '17:00' }];

        act(() => {
          result.current.startEditing('monday', timeRanges);
        });

        act(() => {
          result.current.saveTimeRanges();
        });

        expect(updateDayScheduleMock).toHaveBeenCalledWith('monday', timeRanges);
        expect(result.current.editingDay).toBeNull();
        expect(result.current.validationError).toBeNull();
      });
    });

    describe('when validation fails', () => {
      it('sets validation error and does not save', () => {
        const updateDayScheduleMock = vi.fn();

        useAppStore.setState({ updateDaySchedule: updateDayScheduleMock });

        const { result } = renderHook(() => useScheduleEditor(), { wrapper });
        const invalidRanges = [{ start: '09:00', end: '09:00' }];

        act(() => {
          result.current.startEditing('monday', invalidRanges);
        });

        act(() => {
          result.current.saveTimeRanges();
        });

        expect(updateDayScheduleMock).not.toHaveBeenCalled();
        expect(result.current.validationError).toBe(messages.en['schedule.sameStartEnd']);
      });
    });
  });

  describe('when addTimeRange is called', () => {
    it('adds new time range with defaults', () => {
      const { result } = renderHook(() => useScheduleEditor(), { wrapper });

      act(() => {
        result.current.addTimeRange();
      });

      expect(result.current.tempTimeRanges).toHaveLength(1);
      expect(result.current.tempTimeRanges[0]).toMatchObject({ start: '09:00', end: '18:00' });
    });
  });

  describe('when removeTimeRange is called', () => {
    it('removes time range at index', () => {
      const { result } = renderHook(() => useScheduleEditor(), { wrapper });

      act(() => {
        result.current.startEditing('monday', [
          { start: '09:00', end: '12:00' },
          { start: '13:00', end: '17:00' },
        ]);
      });

      act(() => {
        result.current.removeTimeRange(0);
      });

      expect(result.current.tempTimeRanges).toHaveLength(1);
      expect(result.current.tempTimeRanges[0]).toEqual({ start: '13:00', end: '17:00' });
    });
  });

  describe('when updateTimeRange is called', () => {
    it('updates time range field', () => {
      const { result } = renderHook(() => useScheduleEditor(), { wrapper });

      act(() => {
        result.current.startEditing('monday', [{ start: '09:00', end: '17:00' }]);
      });

      act(() => {
        result.current.updateTimeRange(0, 'start', '10:00');
      });

      expect(result.current.tempTimeRanges[0].start).toBe('10:00');
    });

    it('clears validation error when updating', () => {
      const { result } = renderHook(() => useScheduleEditor(), { wrapper });

      act(() => {
        result.current.startEditing('monday', [{ start: '09:00', end: '09:00' }]);
        result.current.saveTimeRanges();
      });

      act(() => {
        result.current.updateTimeRange(0, 'end', '17:00');
      });

      expect(result.current.validationError).toBeNull();
    });
  });
});
