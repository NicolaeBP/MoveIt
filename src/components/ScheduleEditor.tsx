import React from 'react';
import { FormattedMessage } from 'react-intl';
import TimeRangeEditor from './TimeRangeEditor';

interface ScheduleEditorProps {
  timeRanges: Array<{ start: string; end: string }>;
  validationError: string | null;
  canAddMore: boolean;
  onUpdateTimeRange: (index: number, field: 'start' | 'end', value: string) => void;
  onRemoveTimeRange: (index: number) => void;
  onAddTimeRange: () => void;
  onSave: () => void;
  onCancel: () => void;
}

const ScheduleEditor: React.FC<ScheduleEditorProps> = ({
  timeRanges,
  validationError,
  canAddMore,
  onUpdateTimeRange,
  onRemoveTimeRange,
  onAddTimeRange,
  onSave,
  onCancel,
}) => (
  <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
    <TimeRangeEditor
      timeRanges={timeRanges}
      onUpdateTimeRange={onUpdateTimeRange}
      onRemoveTimeRange={onRemoveTimeRange}
      onAddTimeRange={onAddTimeRange}
      canAddMore={canAddMore}
      validationError={validationError}
    />

    <div className="mt-3 flex gap-2">
      <button onClick={onSave} className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
        <FormattedMessage id="schedule.save" />
      </button>

      <button
        onClick={onCancel}
        className="px-3 py-1 text-sm bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
      >
        <FormattedMessage id="schedule.cancel" />
      </button>
    </div>
  </div>
);

export default ScheduleEditor;
