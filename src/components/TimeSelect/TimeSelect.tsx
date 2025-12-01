import React from 'react';
import { useIntl } from 'react-intl';

interface TimeSelectProps {
  value: string;
  onChange: (value: string) => void;
  ariaLabelPrefix: string;
}

const HOUR_OPTIONS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const MINUTE_OPTIONS = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

const TimeSelect: React.FC<TimeSelectProps> = ({ value, onChange, ariaLabelPrefix }) => {
  const intl = useIntl();
  const [hours, minutes] = value.split(':');

  const handleHourChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(`${e.target.value}:${minutes}`);
  };

  const handleMinuteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(`${hours}:${e.target.value}`);
  };

  const selectStyles =
    'px-2 py-1 text-sm border rounded bg-white dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500';

  return (
    <div className="flex items-center gap-1">
      <select
        value={hours}
        onChange={handleHourChange}
        className={selectStyles}
        aria-label={`${ariaLabelPrefix} ${intl.formatMessage({ id: 'time.hours' })}`}
      >
        {HOUR_OPTIONS.map((h) => (
          <option key={h} value={h}>
            {h}
          </option>
        ))}
      </select>

      <span className="text-gray-600 dark:text-gray-400 font-medium">:</span>

      <select
        value={minutes}
        onChange={handleMinuteChange}
        className={selectStyles}
        aria-label={`${ariaLabelPrefix} ${intl.formatMessage({ id: 'time.minutes' })}`}
      >
        {MINUTE_OPTIONS.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TimeSelect;
