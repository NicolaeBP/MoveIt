import React, { useState, useEffect, useRef } from 'react';
import { FormattedMessage } from 'react-intl';
import { useAppStore } from '@/store/useAppStore';
import LanguageSwitcher from '@/components/LanguageSwitcher/LanguageSwitcher';
import ThemeSelector from '@/components/ThemeSelector/ThemeSelector';
import AboutSection from '@/components/AboutSection/AboutSection';

const SettingsContent = () => {
  const showTrayMessage = useAppStore((state) => state.showTrayMessage);
  const setShowTrayMessage = useAppStore((state) => state.setShowTrayMessage);
  const autoUpdatesEnabled = useAppStore((state) => state.autoUpdatesEnabled);
  const setAutoUpdatesEnabled = useAppStore((state) => state.setAutoUpdatesEnabled);
  const isUpToDate = useAppStore((state) => state.isUpToDate);
  const setIsUpToDate = useAppStore((state) => state.setIsUpToDate);

  const isUpToDateRef = useRef(isUpToDate);

  const [isCheckingForUpdates, setIsCheckingForUpdates] = useState(false);
  const [checkError, setCheckError] = useState<string | null>(null);

  const handleCheckForUpdates = async () => {
    setCheckError(null);
    setIsCheckingForUpdates(true);

    try {
      await globalThis.electronAPI.updates.checkForUpdates();
      setIsCheckingForUpdates(false);
    } catch (error) {
      console.error('Error checking for updates:', error);

      setCheckError('updates.checkError');
      setIsCheckingForUpdates(false);
    }
  };

  const handleAutoUpdatesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAutoUpdatesEnabled(e.target.checked);
    globalThis.electronAPI.updates.notifyAutoUpdatesChanged(e.target.checked);
  };

  useEffect(() => {
    isUpToDateRef.current = isUpToDate;
  }, [isUpToDate]);

  useEffect(() => {
    return () => {
      if (isUpToDateRef.current === true) setIsUpToDate(null);
    };
  }, [setIsUpToDate]);

  const getButtonTextId = (): string => {
    if (isCheckingForUpdates) return 'updates.checking';
    if (isUpToDate === true) return 'updates.upToDate';
    if (isUpToDate === false) return 'settings.updateAvailable';

    return 'settings.checkForUpdates';
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
          <FormattedMessage id="settings.language" />
        </div>

        <LanguageSwitcher />
      </div>

      <div className="mt-4">
        <ThemeSelector />
      </div>

      <div className="mt-4">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={showTrayMessage}
            onChange={(e) => setShowTrayMessage(e.target.checked)}
            className="w-4 h-4 text-blue-500 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            <FormattedMessage id="settings.showTrayMessage" />
          </span>
        </label>
      </div>

      <div className="mt-4">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={autoUpdatesEnabled}
            onChange={handleAutoUpdatesChange}
            className="w-4 h-4 text-blue-500 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />

          <span className="text-sm text-gray-700 dark:text-gray-300">
            <FormattedMessage id="settings.autoUpdates" />
          </span>
        </label>
      </div>

      <div className="mt-4">
        <button
          onClick={handleCheckForUpdates}
          disabled={isCheckingForUpdates}
          className="w-full rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FormattedMessage id={getButtonTextId()} />
        </button>

        {checkError && (
          <div className="mt-2 text-sm text-red-600 dark:text-red-400">
            <FormattedMessage id={checkError} />
          </div>
        )}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <AboutSection />
      </div>
    </div>
  );
};

export default SettingsContent;
