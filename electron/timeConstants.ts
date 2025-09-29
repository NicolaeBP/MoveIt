/**
 * Time-related constants for electron backend
 * Duplicated here to avoid importing from frontend code
 */

// Time conversion constants
export const MS_PER_SECOND = 1000;
export const MS_PER_MINUTE = 60000;
export const MS_PER_HOUR = 3600000;

// Calendar constants
export const DAYS_PER_WEEK = 7;

// Time regex pattern - requires HH:MM or H:MM format (minutes must be two digits)
export const TIME_FORMAT_REGEX = /^([0-1]?\d|2[0-3]):([0-5]\d)$/;
