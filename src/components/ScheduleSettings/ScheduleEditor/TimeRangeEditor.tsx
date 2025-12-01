import React from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import TimeSelect from '@/components/TimeSelect/TimeSelect';

interface TimeRangeEditorProps {
  timeRanges: Array<{ start: string; end: string }>;
  onUpdateTimeRange: (index: number, field: 'start' | 'end', value: string) => void;
  onRemoveTimeRange: (index: number) => void;
  onAddTimeRange: () => void;
  canAddMore: boolean;
  validationError: string | null;
}

const TimeRangeEditor: React.FC<TimeRangeEditorProps> = ({
  timeRanges,
  onUpdateTimeRange,
  onRemoveTimeRange,
  onAddTimeRange,
  canAddMore,
  validationError,
}) => {
  const intl = useIntl();

  return (
    <div className="mt-3 space-y-2">
      {timeRanges.map((range, idx) => (
        <div key={`edit-${range.start}-${range.end}-${idx}`} className="flex flex-col items-start gap-1">
          <div className="flex items-center gap-2">
            <TimeSelect
              value={range.start}
              onChange={(value) => onUpdateTimeRange(idx, 'start', value)}
              ariaLabelPrefix={`${intl.formatMessage({ id: 'schedule.startTime' })} ${idx + 1}`}
            />

            <span className="text-sm text-gray-600 dark:text-gray-400">-</span>

            <TimeSelect
              value={range.end}
              onChange={(value) => onUpdateTimeRange(idx, 'end', value)}
              ariaLabelPrefix={`${intl.formatMessage({ id: 'schedule.endTime' })} ${idx + 1}`}
            />
          </div>

          {Boolean(timeRanges.length) && (
            <button onClick={() => onRemoveTimeRange(idx)} className="text-red-500 hover:text-red-600 text-sm">
              <FormattedMessage id="schedule.removeTimeRange" />
            </button>
          )}
        </div>
      ))}

      {canAddMore && (
        <button onClick={onAddTimeRange} className="text-blue-500 hover:text-blue-600 text-sm">
          <FormattedMessage id="schedule.addTimeRange" />
        </button>
      )}

      {validationError && <p className="text-red-500 text-xs mt-1">{validationError}</p>}
    </div>
  );
};

export default TimeRangeEditor;
