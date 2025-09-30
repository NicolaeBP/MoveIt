import { useIntl, FormattedMessage } from 'react-intl';
import { useAppStore } from '@/store/useAppStore';

const ScheduleStatus = () => {
  const intl = useIntl();

  const scheduleConfig = useAppStore((state) => state.scheduleConfig);
  const scheduleEnabled = useAppStore((state) => state.scheduleEnabled);
  const status = useAppStore((state) => state.movementStatus);

  const wrapperDynamicStyles =
    status === 'moving'
      ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400'
      : 'bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-400';

  const getStatusMessageId = () => {
    if (status === 'moving') return 'schedule.status.running';

    if (status === 'waiting') return 'schedule.status.outsideSchedule';

    if (!scheduleConfig.length) return 'schedule.status.noSchedule';

    return 'schedule.status.stopped';
  };

  if (!scheduleEnabled) return null;

  return (
    <div className={`mt-3 mb-1 p-2 rounded-lg text-xs ${wrapperDynamicStyles}`} aria-live="polite" aria-atomic="true">
      <div className="flex items-center gap-1">
        <span className={`inline-block w-2 h-2 rounded-full ${status === 'moving' ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />

        <output className="font-medium" aria-label={intl.formatMessage({ id: getStatusMessageId() })}>
          <FormattedMessage id={getStatusMessageId()} />
        </output>
      </div>
    </div>
  );
};

export default ScheduleStatus;
