import type { ScheduleConfig } from '../shared/types';
import { MS_PER_HOUR, MS_PER_MINUTE, DAYS_PER_WEEK, TIME_FORMAT_REGEX, MS_PER_SECOND } from './timeConstants';

/**
 * Parse time string like "09:30" to milliseconds since midnight
 * Local function for electron backend only
 */
const parseTimeToMs = (timeString: string): number => {
  const match = timeString.match(TIME_FORMAT_REGEX);
  if (!match) return 0;

  const hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  return hours * MS_PER_HOUR + minutes * MS_PER_MINUTE;
};

/**
 * Create a timestamp for a specific day and time
 */
const createTimestamp = (dayIndex: number, timeMs: number, currentDayIndex: number, currentTimeMs: number): number => {
  // Calculate day difference
  let daysDiff = dayIndex - currentDayIndex;

  if (daysDiff < 0) daysDiff += DAYS_PER_WEEK; // Next week
  if (daysDiff === 0 && timeMs <= currentTimeMs) daysDiff = DAYS_PER_WEEK; // Next week if time passed

  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + daysDiff);

  // Convert milliseconds since midnight to hours/minutes/seconds
  const hours = Math.floor(timeMs / MS_PER_HOUR);
  const minutes = Math.floor((timeMs % MS_PER_HOUR) / MS_PER_MINUTE);
  const seconds = Math.floor((timeMs % MS_PER_MINUTE) / MS_PER_SECOND);

  targetDate.setHours(hours, minutes, seconds, 0);

  return targetDate.getTime();
};

/**
 * Get when to start moving the mouse next and when to stop
 *
 * @param config - Sorted array of schedule entries
 * @param currentDayIndex - Current-day index (0=Sunday, 1=Monday, etc.)
 * @param currentTimeMs - Current time in milliseconds since midnight
 * @returns Object with start and end timestamps, or null if no schedule
 */
export const getNextMoveStartTime = (
  config: ScheduleConfig,
  currentDayIndex: number,
  currentTimeMs: number
): { startTime: number; endTime: number } | undefined => {
  // Check if we're currently in an active entry - convert string times to ms for comparison
  const activeEntry = config.find((entry) => {
    if (entry.dayIndex !== currentDayIndex) return false;

    const startMs = parseTimeToMs(entry.start);
    const endMs = parseTimeToMs(entry.end);

    return currentTimeMs >= startMs && currentTimeMs < endMs;
  });

  // We're in schedule, should start moving now, stop at the end of this entry
  if (activeEntry) {
    return {
      startTime: Date.now(),
      endTime: createTimestamp(activeEntry.dayIndex, parseTimeToMs(activeEntry.end), currentDayIndex, currentTimeMs),
    };
  }

  // Not in schedule, find the next entry to start moving
  let nextEntry = config.find((entry) => {
    if (entry.dayIndex > currentDayIndex) return true;

    if (entry.dayIndex === currentDayIndex) return parseTimeToMs(entry.start) > currentTimeMs;

    return false;
  });

  // If no other entry found this week, use the first and only entry, the one we started with
  if (!nextEntry) nextEntry = config[0];

  return {
    startTime: createTimestamp(nextEntry.dayIndex, parseTimeToMs(nextEntry.start), currentDayIndex, currentTimeMs),
    endTime: createTimestamp(nextEntry.dayIndex, parseTimeToMs(nextEntry.end), currentDayIndex, currentTimeMs),
  };
};
