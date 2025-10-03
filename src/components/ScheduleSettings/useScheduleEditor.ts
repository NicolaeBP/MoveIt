/**
 * Custom hook for schedule editing logic
 */
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { useAppStore } from '@/store/useAppStore';
import { validateTimeRanges } from '@/utils/scheduleUtils';
import type { WeekDay } from '@shared/types';
import { DEFAULT_START_TIME, DEFAULT_END_TIME } from '@/constants/timeConstants';

export const useScheduleEditor = () => {
  const intl = useIntl();
  const updateDaySchedule = useAppStore((state) => state.updateDaySchedule);

  const [editingDay, setEditingDay] = useState<WeekDay | null>(null);
  const [tempTimeRanges, setTempTimeRanges] = useState<Array<{ start: string; end: string }>>([]);
  const [validationError, setValidationError] = useState<string | null>(null);

  const startEditing = (day: WeekDay, timeRanges: Array<{ start: string; end: string }>) => {
    setEditingDay(day);
    setTempTimeRanges(timeRanges);
    setValidationError(null);
  };

  const cancelEditing = () => {
    setEditingDay(null);
    setTempTimeRanges([]);
    setValidationError(null);
  };

  const saveTimeRanges = () => {
    if (!editingDay) return;

    if (tempTimeRanges.length) {
      const validationKey = validateTimeRanges(tempTimeRanges);

      if (validationKey) {
        setValidationError(intl.formatMessage({ id: validationKey }));
        return;
      }
    }

    updateDaySchedule(editingDay, tempTimeRanges);
    setEditingDay(null);
    setValidationError(null);
  };

  const addTimeRange = () => setTempTimeRanges((prev) => [...prev, { start: DEFAULT_START_TIME, end: DEFAULT_END_TIME }]);

  const removeTimeRange = (index: number) => setTempTimeRanges((prev) => prev.filter((_, i) => i !== index));

  const updateTimeRange = (index: number, field: 'start' | 'end', value: string) => {
    setTempTimeRanges((prev) => {
      const newRanges = [...prev];
      newRanges[index] = { ...newRanges[index], [field]: value };

      return newRanges;
    });

    if (validationError) {
      setValidationError(null);
    }
  };

  return {
    editingDay,
    tempTimeRanges,
    validationError,
    startEditing,
    cancelEditing,
    saveTimeRanges,
    addTimeRange,
    removeTimeRange,
    updateTimeRange,
  };
};
