import React from 'react';
import { useIntl, FormattedMessage } from 'react-intl';

interface ScheduleToggleProps {
  enabled: boolean;
  isRunning: boolean;
  onToggle: () => void;
}

const ScheduleToggle: React.FC<ScheduleToggleProps> = ({ enabled, isRunning, onToggle }) => {
  const intl = useIntl();

  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-700 dark:text-gray-300 font-medium">
        <FormattedMessage id="schedule.title" />
      </span>

      <button
        onClick={onToggle}
        disabled={isRunning}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full ml-2
          ${isRunning ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${enabled ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'}
          transition-colors duration-200
        `}
        role="switch"
        aria-checked={enabled}
        aria-label={intl.formatMessage({ id: 'schedule.toggle' })}
      >
        <span
          className={`
            inline-block h-4 w-4 transform rounded-full
            bg-white shadow-lg transition-transform duration-200
            ${enabled ? 'translate-x-6' : 'translate-x-1'}
          `}
        />
      </button>
    </div>
  );
};

export default ScheduleToggle;
