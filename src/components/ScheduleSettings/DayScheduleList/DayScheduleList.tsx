import React from 'react';
import { FormattedMessage } from 'react-intl';
import type { WeekDay, ScheduleEntry } from '@shared/types';

interface DayScheduleListProps {
  day: WeekDay;
  schedule: ScheduleEntry[];
  isCurrentDay: boolean;
  onToggle: (selectedDay: WeekDay) => void;
  onEdit: (selectedDay: WeekDay) => void;
  disabled?: boolean;
}

const DayScheduleList: React.FC<DayScheduleListProps> = ({ day, schedule, isCurrentDay, onToggle, onEdit, disabled = false }) => {
  const isScheduleActive = Boolean(schedule.length);

  const scheduleWrapperStyles = isCurrentDay
    ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
    : 'bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700';

  const dayStyles = isCurrentDay ? 'text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300';

  const scheduleRangeElements = schedule.map((range, idx) => (
    <span key={`${range.start}-${range.end}-${idx}`}>
      {Boolean(idx) && ', '}
      {range.start} - {range.end}
    </span>
  ));

  return (
    <div className={`p-3 rounded-lg transition-colors ${scheduleWrapperStyles}`}>
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isScheduleActive}
            onChange={() => onToggle(day)}
            disabled={disabled}
            className="rounded text-blue-500 focus:ring-blue-500 disabled:opacity-50"
          />

          <span className={`text-sm font-medium ${dayStyles}`}>
            <FormattedMessage id={`days.${day}`} />

            {isCurrentDay && (
              <span className="ml-2 text-xs text-blue-600 dark:text-blue-400">
                (<FormattedMessage id="schedule.today" />)
              </span>
            )}
          </span>
        </label>

        {isScheduleActive && !disabled && (
          <button onClick={() => onEdit(day)} className="text-sm text-blue-500 hover:text-blue-600 transition-colors">
            <FormattedMessage id="schedule.edit" />
          </button>
        )}
      </div>

      {isScheduleActive && <div className="mt-2 ml-6 text-xs text-gray-600 dark:text-gray-400">{scheduleRangeElements}</div>}
    </div>
  );
};

export default DayScheduleList;
