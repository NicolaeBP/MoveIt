/**
 * Schedule-Specific Utilities
 * Pure schedule logic: validation, manipulation, and data conversion
 * Times stored as strings - no conversion needed for display!
 */
import { weekDayToIndex } from './timeUtils';
import type { ScheduleConfig, ScheduleEntry, WeekDay } from '@shared/types';

export const validateTimeRanges = (ranges: Array<{ start: string; end: string }>): string | null => {
  if (!ranges.length) return null;

  const sameTimeRange = ranges.find((range) => range.start === range.end);

  if (sameTimeRange) return 'schedule.sameStartEnd';

  const crossingRange = ranges.find((range) => range.end < range.start);

  if (crossingRange) return 'schedule.crossesMidnight';

  const hasOverlap = ranges.some((range1, i) =>
    ranges.slice(i + 1).some((range2) => !(range1.end <= range2.start || range2.end <= range1.start))
  );

  return hasOverlap ? 'schedule.timeRangesOverlap' : null;
};

/**
 * Get all schedule entries for a specific day
 */
export const getDayEntries = (schedule: ScheduleConfig, day: WeekDay): ScheduleEntry[] => {
  if (!schedule || !Array.isArray(schedule)) return [];

  return schedule.filter((entry) => entry.dayIndex === weekDayToIndex(day));
};

/**
 * Update all entries for a specific day
 */
export const updateDaySchedule = (
  currentSchedule: ScheduleConfig,
  day: WeekDay,
  timeRanges: Array<{ start: string; end: string }>
): ScheduleConfig => {
  const dayIndex = weekDayToIndex(day);

  const otherDaysEntries = currentSchedule.filter((entry) => entry.dayIndex !== dayIndex);

  const newDayEntries: ScheduleEntry[] = timeRanges.map(({ start, end }) => ({
    dayIndex,
    start,
    end,
  }));

  return [...otherDaysEntries, ...newDayEntries].sort((a, b) => {
    if (a.dayIndex !== b.dayIndex) return a.dayIndex - b.dayIndex;

    return a.start.localeCompare(b.start); // String comparison for HH:MM
  });
};
