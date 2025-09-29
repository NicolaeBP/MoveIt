import type { WeekDay } from '@shared/types';

const WEEKDAYS: WeekDay[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

/**
 * Convert weekday name to index (0=Sunday, 1=Monday, etc.)
 */
export const weekDayToIndex = (day: WeekDay): number => WEEKDAYS.indexOf(day);

/**
 * Get current weekday as string
 */
export const getCurrentWeekDay = (): WeekDay => WEEKDAYS[new Date().getDay()];
