import { useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useAppStore } from '@/store/useAppStore';
import AccessibilityModalContent from '@/components/AccessibilityModalContent';

const ActionButton = () => {
  const interval = useAppStore((state) => state.interval);
  const scheduleConfig = useAppStore((state) => state.scheduleConfig);
  const scheduleEnabled = useAppStore((state) => state.scheduleEnabled);
  const openModal = useAppStore((state) => state.openModal);
  const closeModal = useAppStore((state) => state.closeModal);

  const [isToggling, setIsToggling] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const mouseMoverAPI = window.electronAPI?.mouseMover;

  const dynamicButtonStyles = isRunning
    ? 'from-rose-500 to-rose-600 hover:shadow-rose-500/25'
    : 'from-blue-400 to-blue-500 hover:shadow-blue-400/25';

  const switchToggleEffect = !isToggling ? 'hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0' : '';
  const isDisabled = isToggling || (scheduleEnabled && !scheduleConfig.length);

  const accessibilityModalConfig = {
    title: <FormattedMessage id="accessibility.title" />,
    body: <AccessibilityModalContent />,
    footer: (
      <div className="flex gap-3">
        <button
          onClick={closeModal}
          className="flex-1 px-4 py-2 bg-slate-200 dark:bg-gray-700 text-slate-700 dark:text-gray-200 rounded-lg hover:bg-slate-300 dark:hover:bg-gray-600 transition-colors"
        >
          <FormattedMessage id="accessibility.cancel" />
        </button>

        <button
          onClick={handleOpenSettings}
          className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <FormattedMessage id="accessibility.openSettings" />
        </button>
      </div>
    ),
  };

  function handleOpenSettings() {
    closeModal();

    if (window.electronAPI?.accessibility) window.electronAPI.accessibility.openSettings().catch(console.error);
  }

  const handleMouseMoverToggle = async (): Promise<void> => {
    setIsToggling(true);

    try {
      const wasStarting = !isRunning;
      const wasToggleSuccessful = await mouseMoverAPI.toggle(interval, scheduleConfig);

      if (!wasToggleSuccessful && wasStarting) openModal(accessibilityModalConfig);
    } catch (error) {
      console.error(error);
    } finally {
      setIsToggling(false);
    }
  };

  useEffect(() => {
    return mouseMoverAPI?.onRunningStateChanged?.((status: 'moving' | 'waiting' | 'stopped') => {
      setIsRunning(status === 'moving' || status === 'waiting');
    });
  }, [mouseMoverAPI]);

  return (
    <button
      onClick={handleMouseMoverToggle}
      disabled={isDisabled}
      className={`disabled:opacity-50 disabled:pointer-events-none disabled:bg-gray-300 w-full py-3.5 text-white border-none rounded-lg text-base font-semibold transition-all duration-300 relative overflow-hidden bg-gradient-to-r ${dynamicButtonStyles} ${switchToggleEffect}`}
      aria-pressed={isRunning}
      aria-busy={isToggling}
    >
      <FormattedMessage id={isRunning ? 'action.stop' : 'action.start'} />
    </button>
  );
};

export default ActionButton;
