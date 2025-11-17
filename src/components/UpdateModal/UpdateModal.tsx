import { FormattedMessage } from 'react-intl';
import { useAppStore } from '@/store/useAppStore';

interface UpdateModalProps {
  version: string;
}

export const UpdateModal = ({ version }: UpdateModalProps) => {
  const closeModal = useAppStore((state) => state.closeModal);

  const handleRestart = () => globalThis.electronAPI.updates.restartAndInstall();

  const handleClose = () => closeModal();

  return (
    <div className="flex flex-col gap-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          <FormattedMessage id="updates.newVersionAvailable" values={{ version }} />
        </h3>
      </div>

      <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
        <p className="text-sm text-center text-gray-700 dark:text-gray-300">
          <FormattedMessage id="updates.readyToInstall" />
        </p>
      </div>

      <div className="flex justify-end gap-3">
        <button
          onClick={handleClose}
          className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          <FormattedMessage id="common.close" />
        </button>

        <button
          onClick={handleRestart}
          className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
        >
          <FormattedMessage id="updates.restartNow" />
        </button>
      </div>
    </div>
  );
};
