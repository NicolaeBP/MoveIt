import { describe, it, expect } from 'vitest';
import { validateTimeRanges, getDayEntries, updateDaySchedule } from './scheduleUtils';

describe('scheduleUtils', () => {
  describe('validateTimeRanges', () => {
    describe('when ranges array is empty', () => {
      it('returns null', () => {
        expect(validateTimeRanges([])).toBeNull();
      });
    });

    describe('when start and end times are the same', () => {
      it('returns same start end error', () => {
        const ranges = [{ start: '09:00', end: '09:00' }];

        expect(validateTimeRanges(ranges)).toBe('schedule.sameStartEnd');
      });
    });

    describe('when end time is before start time', () => {
      it('returns crosses midnight error', () => {
        const ranges = [{ start: '17:00', end: '09:00' }];

        expect(validateTimeRanges(ranges)).toBe('schedule.crossesMidnight');
      });
    });

    describe('when time ranges overlap', () => {
      it('returns overlap error', () => {
        const ranges = [
          { start: '09:00', end: '12:00' },
          { start: '11:00', end: '14:00' },
        ];

        expect(validateTimeRanges(ranges)).toBe('schedule.timeRangesOverlap');
      });
    });

    describe('when time ranges are valid', () => {
      it('returns null', () => {
        const ranges = [
          { start: '09:00', end: '12:00' },
          { start: '13:00', end: '17:00' },
        ];

        expect(validateTimeRanges(ranges)).toBeNull();
      });
    });

    describe('when time ranges are adjacent', () => {
      it('returns null', () => {
        const ranges = [
          { start: '09:00', end: '12:00' },
          { start: '12:00', end: '17:00' },
        ];

        expect(validateTimeRanges(ranges)).toBeNull();
      });
    });
  });

  describe('getDayEntries', () => {
    describe('when schedule is empty', () => {
      it('returns empty array', () => {
        expect(getDayEntries([], 'monday')).toEqual([]);
      });
    });

    describe('when schedule has no entries for the day', () => {
      it('returns empty array', () => {
        const schedule = [{ dayIndex: 0, start: '09:00', end: '17:00' }];

        expect(getDayEntries(schedule, 'monday')).toEqual([]);
      });
    });

    describe('when schedule has entries for the day', () => {
      it('returns day entries', () => {
        const schedule = [
          { dayIndex: 0, start: '08:00', end: '10:00' },
          { dayIndex: 1, start: '09:00', end: '17:00' },
          { dayIndex: 1, start: '18:00', end: '20:00' },
        ];

        const result = getDayEntries(schedule, 'monday');

        expect(result).toHaveLength(2);
        expect(result[0]).toEqual({ dayIndex: 1, start: '09:00', end: '17:00' });
        expect(result[1]).toEqual({ dayIndex: 1, start: '18:00', end: '20:00' });
      });
    });
  });

  describe('updateDaySchedule', () => {
    describe('when adding ranges to empty schedule', () => {
      it('creates new entries for the day', () => {
        const result = updateDaySchedule([], 'monday', [{ start: '09:00', end: '17:00' }]);

        expect(result).toEqual([{ dayIndex: 1, start: '09:00', end: '17:00' }]);
      });
    });

    describe('when updating existing day entries', () => {
      it('replaces all entries for that day', () => {
        const currentSchedule = [
          { dayIndex: 1, start: '08:00', end: '10:00' },
          { dayIndex: 1, start: '11:00', end: '13:00' },
        ];

        const result = updateDaySchedule(currentSchedule, 'monday', [{ start: '09:00', end: '17:00' }]);

        expect(result).toEqual([{ dayIndex: 1, start: '09:00', end: '17:00' }]);
      });
    });

    describe('when removing all entries for a day', () => {
      it('removes day from schedule', () => {
        const currentSchedule = [
          { dayIndex: 1, start: '09:00', end: '17:00' },
          { dayIndex: 2, start: '10:00', end: '18:00' },
        ];

        const result = updateDaySchedule(currentSchedule, 'monday', []);

        expect(result).toEqual([{ dayIndex: 2, start: '10:00', end: '18:00' }]);
      });
    });

    describe('when adding multiple ranges', () => {
      it('creates multiple entries sorted by start time', () => {
        const result = updateDaySchedule([], 'monday', [
          { start: '13:00', end: '17:00' },
          { start: '09:00', end: '12:00' },
        ]);

        expect(result).toEqual([
          { dayIndex: 1, start: '09:00', end: '12:00' },
          { dayIndex: 1, start: '13:00', end: '17:00' },
        ]);
      });
    });

    describe('when schedule has multiple days', () => {
      it('preserves other days and sorts correctly', () => {
        const currentSchedule = [
          { dayIndex: 0, start: '08:00', end: '10:00' },
          { dayIndex: 2, start: '10:00', end: '18:00' },
        ];

        const result = updateDaySchedule(currentSchedule, 'monday', [{ start: '09:00', end: '17:00' }]);

        expect(result).toEqual([
          { dayIndex: 0, start: '08:00', end: '10:00' },
          { dayIndex: 1, start: '09:00', end: '17:00' },
          { dayIndex: 2, start: '10:00', end: '18:00' },
        ]);
      });
    });
  });
});
