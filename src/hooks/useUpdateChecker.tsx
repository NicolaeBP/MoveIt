import { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useAppStore } from '@/store/useAppStore';
import { UpdateModal } from '@/components/UpdateModal/UpdateModal';

/**
 * Hook that listens for auto-update events from the main process
 * and manages the update modal display.
 *
 * This hook:
 * - Listens for update-available events
 * - Listens for update-downloaded events
 * - Updates the store with latest available version
 * - Shows update modal when appropriate
 * - Tracks download progress
 */
export const useUpdateChecker = () => {
  const openModal = useAppStore((state) => state.openModal);
  const setLatestAvailableVersion = useAppStore((state) => state.setLatestAvailableVersion);
  const setUpdateDownloadProgress = useAppStore((state) => state.setUpdateDownloadProgress);

  useEffect(() => {
    // Listen for update available
    const unsubscribeAvailable = window.electronAPI.updates.onUpdateAvailable((info) => {
      console.log('[Update Checker] Update available:', info.version);

      // Store the latest version for display in About section
      setLatestAvailableVersion(info.version);

      // Show modal with update info (download in progress)
      openModal({
        title: <FormattedMessage id="updates.title" />,
        body: <UpdateModal version={info.version} releaseNotes={info.releaseNotes} isDownloaded={false} />,
      });
    });

    // Listen for update downloaded
    const unsubscribeDownloaded = window.electronAPI.updates.onUpdateDownloaded((info) => {
      console.log('[Update Checker] Update downloaded:', info.version);

      // Reset download progress
      setUpdateDownloadProgress(null);

      // Show modal with restart button
      openModal({
        title: <FormattedMessage id="updates.title" />,
        body: <UpdateModal version={info.version} releaseNotes={info.releaseNotes} isDownloaded={true} />,
      });
    });

    // Listen for download progress
    const unsubscribeProgress = window.electronAPI.updates.onUpdateProgress((progress) => {
      setUpdateDownloadProgress(progress.percent);
    });

    // Listen for update not available (manual check)
    const unsubscribeNotAvailable = window.electronAPI.updates.onUpdateNotAvailable(() => {
      console.log('[Update Checker] No updates available');
      setLatestAvailableVersion(null);

      // Could show a notification here: "You're running the latest version"
      // For now, we'll just log it
    });

    // Listen for errors
    const unsubscribeError = window.electronAPI.updates.onUpdateError((error) => {
      console.error('[Update Checker] Update error:', error.message);

      // Reset state on error
      setUpdateDownloadProgress(null);

      // Could show error modal here
    });

    // Cleanup listeners on unmount
    return () => {
      unsubscribeAvailable();
      unsubscribeDownloaded();
      unsubscribeProgress();
      unsubscribeNotAvailable();
      unsubscribeError();
    };
  }, [openModal, setLatestAvailableVersion, setUpdateDownloadProgress]);
};
