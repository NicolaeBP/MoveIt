import { describe, it, expect, vi, afterEach } from 'vitest';
import { weekDayToIndex, getCurrentWeekDay } from './timeUtils';

describe('timeUtils', () => {
  describe('weekDayToIndex', () => {
    it('returns 0 for sunday', () => {
      expect(weekDayToIndex('sunday')).toBe(0);
    });

    it('returns 1 for monday', () => {
      expect(weekDayToIndex('monday')).toBe(1);
    });

    it('returns 2 for tuesday', () => {
      expect(weekDayToIndex('tuesday')).toBe(2);
    });

    it('returns 3 for wednesday', () => {
      expect(weekDayToIndex('wednesday')).toBe(3);
    });

    it('returns 4 for thursday', () => {
      expect(weekDayToIndex('thursday')).toBe(4);
    });

    it('returns 5 for friday', () => {
      expect(weekDayToIndex('friday')).toBe(5);
    });

    it('returns 6 for saturday', () => {
      expect(weekDayToIndex('saturday')).toBe(6);
    });
  });

  describe('getCurrentWeekDay', () => {
    afterEach(() => {
      vi.useRealTimers();
    });

    it('returns sunday when day is 0', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2025-01-05T12:00:00Z')); // Sunday (update year if test fails)

      expect(getCurrentWeekDay()).toBe('sunday');
    });

    it('returns monday when day is 1', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2025-01-06T12:00:00Z')); // Monday (update year if test fails)

      expect(getCurrentWeekDay()).toBe('monday');
    });
  });
});
