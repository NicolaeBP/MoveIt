import React, { useState, useEffect } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { useAppStore } from '@/store/useAppStore';
import { MS_PER_MINUTE, MS_PER_SECOND } from '@/constants/timeConstants';

const MAX_INTERVAL_MS = 24 * 60 * MS_PER_MINUTE;

const TimeSettings = () => {
  const intl = useIntl();

  const interval = useAppStore((state) => state.interval);
  const setInterval = useAppStore((state) => state.setInterval);

  const [inputValue, setInputValue] = useState('');

  const inputStyles = interval
    ? 'border-gray-300 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-indigo-400 focus:bg-white dark:focus:bg-gray-600 focus:shadow-lg focus:shadow-indigo-500/10'
    : 'border-red-500 bg-red-50 dark:bg-red-900/20';

  const formatIntervalDisplay = (milliseconds: number): string => {
    if (milliseconds <= 0) return '';

    const minutes = milliseconds / MS_PER_MINUTE;

    if (Number.isInteger(minutes)) return `${minutes}m`;

    return `${milliseconds / MS_PER_SECOND}s`;
  };

  const handleIntervalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();

    setInputValue(value);

    if (!value) {
      setInterval(0);
      return;
    }

    const lastChar = value.slice(-1);

    if (lastChar !== 's' && lastChar !== 'm') return;

    const number = parseFloat(value.slice(0, -1));

    if (isNaN(number) || number <= 0) return;

    const intervalMs = lastChar === 'm' ? number * MS_PER_MINUTE : number * MS_PER_SECOND;

    if (intervalMs > MAX_INTERVAL_MS) {
      setInputValue(formatIntervalDisplay(interval));
      return;
    }

    setInterval(intervalMs);
  };

  const handleInputBlur = () => {
    const lastChar = inputValue.slice(-1);
    const numPart = inputValue.slice(0, -1);
    const number = parseFloat(numPart);

    if (!inputValue || isNaN(number) || number <= 0 || (lastChar !== 's' && lastChar !== 'm')) {
      setInputValue(formatIntervalDisplay(interval));
      return;
    }

    const intervalMs = lastChar === 'm' ? number * MS_PER_MINUTE : number * MS_PER_SECOND;

    if (intervalMs > MAX_INTERVAL_MS) {
      setInputValue(formatIntervalDisplay(interval));
    }
  };

  useEffect(() => {
    setInputValue(formatIntervalDisplay(interval));
  }, [interval]);

  return (
    <section className="mb-6">
      <label htmlFor="interval-input" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
        <FormattedMessage id="timeSettings.label" />
      </label>

      <input
        id="interval-input"
        type="text"
        value={inputValue}
        onChange={handleIntervalChange}
        onBlur={handleInputBlur}
        placeholder={intl.formatMessage({ id: 'timeSettings.placeholder' })}
        className={`flex-1 px-4 py-3 pr-10 border-2 rounded-lg text-base transition-all duration-300 bg-gray-50 dark:bg-gray-700 dark:text-gray-200 focus:outline-none ${inputStyles}`}
        aria-describedby="time-examples"
      />

      <div id="time-examples" className="text-xs text-gray-500 dark:text-gray-400 mt-2 italic">
        <FormattedMessage id="timeSettings.examples" />
      </div>
    </section>
  );
};

export default TimeSettings;
