import { useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useAppStore } from '@/store/useAppStore';
import { getCurrentWeekDay } from '@/utils/timeUtils';
import { useScheduleEditor } from './useScheduleEditor';
import ScheduleToggle from './ScheduleToggle/ScheduleToggle';
import DayScheduleList from './DayScheduleList/DayScheduleList';
import ScheduleEditor from './ScheduleEditor/ScheduleEditor';
import type { WeekDay } from '@shared/types';
import { getDayEntries } from '@/utils/scheduleUtils';
import { DEFAULT_START_TIME, DEFAULT_END_TIME, MAX_TIME_RANGES_PER_DAY } from '@/constants/timeConstants';

const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;

const ScheduleSettings = () => {
  const scheduleConfig = useAppStore((state) => state.scheduleConfig);
  const scheduleEnabled = useAppStore((state) => state.scheduleEnabled);
  const updateDaySchedule = useAppStore((state) => state.updateDaySchedule);
  const setScheduleEnabled = useAppStore((state) => state.setScheduleEnabled);
  const movementStatus = useAppStore((state) => state.movementStatus);

  const [isExpanded, setIsExpanded] = useState(false);
  const isRunning = movementStatus !== 'stopped';

  const currentDay = getCurrentWeekDay();

  const {
    startEditing,
    cancelEditing,
    editingDay,
    addTimeRange,
    saveTimeRanges,
    updateTimeRange,
    tempTimeRanges,
    removeTimeRange,
    validationError,
  } = useScheduleEditor();

  const handleToggleDay = (day: WeekDay) => {
    const entries = getDayEntries(scheduleConfig, day);

    if (!entries.length) {
      startEditing(day, [{ start: DEFAULT_START_TIME, end: DEFAULT_END_TIME }]);
      return;
    }

    updateDaySchedule(day, []);
  };

  const handleEditDay = (day: WeekDay) => startEditing(day, getDayEntries(scheduleConfig, day));

  const handleScheduleToggle = () => setScheduleEnabled(!scheduleEnabled);

  useEffect(() => {
    if (isRunning) cancelEditing();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning]);

  return (
    <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ScheduleToggle enabled={scheduleEnabled} isRunning={isRunning} onToggle={handleScheduleToggle} />

            <button
              onClick={() => setIsExpanded((prev) => !prev)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              aria-label={isExpanded ? 'Collapse schedule' : 'Expand schedule'}
            >
              <svg
                className={`w-4 h-4 text-gray-500 dark:text-gray-400 transform transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {isExpanded && (
          <>
            <div className="space-y-2">
              {weekdays.map((day) => (
                <div key={day}>
                  {editingDay === day ? (
                    <ScheduleEditor
                      timeRanges={tempTimeRanges}
                      validationError={validationError}
                      canAddMore={tempTimeRanges.length < MAX_TIME_RANGES_PER_DAY}
                      onUpdateTimeRange={updateTimeRange}
                      onRemoveTimeRange={removeTimeRange}
                      onAddTimeRange={addTimeRange}
                      onSave={saveTimeRanges}
                      onCancel={cancelEditing}
                    />
                  ) : (
                    <DayScheduleList
                      day={day}
                      schedule={getDayEntries(scheduleConfig, day)}
                      isCurrentDay={currentDay === day}
                      onToggle={handleToggleDay}
                      onEdit={handleEditDay}
                      disabled={isRunning}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="text-xs text-gray-500 dark:text-gray-400 italic">
              <FormattedMessage id="schedule.info" />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ScheduleSettings;
