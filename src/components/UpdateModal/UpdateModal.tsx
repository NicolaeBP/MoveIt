import { FormattedMessage } from 'react-intl';
import { useAppStore } from '@/store/useAppStore';
import { parseReleaseNotes } from '@/utils/parseReleaseNotes';

interface UpdateModalProps {
  version: string;
  releaseNotes: string;
  isDownloaded: boolean;
}

export const UpdateModal = ({ version, releaseNotes, isDownloaded }: UpdateModalProps) => {
  const autoUpdatesEnabled = useAppStore((state) => state.autoUpdatesEnabled);
  const setAutoUpdatesEnabled = useAppStore((state) => state.setAutoUpdatesEnabled);
  const updateDownloadProgress = useAppStore((state) => state.updateDownloadProgress);
  const closeModal = useAppStore((state) => state.closeModal);

  const firstSection = parseReleaseNotes(releaseNotes);

  const handleRestart = () => {
    window.electronAPI.updates.restartAndInstall();
  };

  const handleClose = () => {
    closeModal();
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          <FormattedMessage id="updates.newVersionAvailable" values={{ version }} />
        </h3>
      </div>

      {/* Release Notes */}
      {firstSection && (
        <div className="max-h-48 overflow-y-auto rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <div className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">{firstSection}</div>
          </div>
        </div>
      )}

      {/* Download Progress */}
      {!isDownloaded && updateDownloadProgress !== null && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>
              <FormattedMessage id="updates.downloading" />
            </span>
            <span>{updateDownloadProgress.toFixed(0)}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${updateDownloadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Auto-updates Checkbox */}
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={autoUpdatesEnabled}
          onChange={(e) => setAutoUpdatesEnabled(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
        />
        <span className="text-sm text-gray-700 dark:text-gray-300">
          <FormattedMessage id="settings.autoUpdates" />
        </span>
      </label>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <button
          onClick={handleClose}
          className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          <FormattedMessage id="common.close" />
        </button>
        {isDownloaded && (
          <button
            onClick={handleRestart}
            className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
          >
            <FormattedMessage id="updates.restartNow" />
          </button>
        )}
      </div>
    </div>
  );
};
