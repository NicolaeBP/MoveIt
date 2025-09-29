/**
 * Shared types for schedule functionality
 * Pure types only - no utility functions
 */

// Core schedule structure - the ONLY format we use
// Store times as strings, convert to ms only when calculating
export interface ScheduleEntry {
  dayIndex: number;  // 0=Sunday, 1=Monday, ..., 6=Saturday (JS Date.getDay() format)
  start: string;     // Time in HH:MM format (e.g., "09:00")
  end: string;       // Time in HH:MM format (e.g., "18:00")
}

export type ScheduleConfig = ScheduleEntry[];

export type WeekDay = 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';
