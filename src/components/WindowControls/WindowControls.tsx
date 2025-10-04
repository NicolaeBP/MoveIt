import React from 'react';
import { useIntl } from 'react-intl';
import { useAppStore } from '@/store/useAppStore';

const DRAG_REGION_STYLE = {
  WebkitAppRegion: 'drag',
} as React.CSSProperties;

const NO_DRAG_STYLE = { WebkitAppRegion: 'no-drag' } as React.CSSProperties;

const WindowControls = () => {
  const intl = useIntl();
  const showTrayMessage = useAppStore((state) => state.showTrayMessage);

  const handleWindowAction = async (action: 'minimize' | 'maximize' | 'hideToTray') => {
    if (typeof window === 'undefined' || !window.electronAPI) return;

    if (action === 'hideToTray') {
      await window.electronAPI.window.hideToTray(showTrayMessage);
    } else {
      await window.electronAPI.window[action]();
    }
  };

  return (
    <nav className="drag-region w-full flex p-2 gap-2 bg-blue-100 dark:bg-gray-800" style={DRAG_REGION_STYLE}>
      <div className="flex justify-end gap-2 ml-auto">
        <button
          onClick={() => handleWindowAction('minimize')}
          className="w-3 h-3 rounded-full bg-amber-400 hover:bg-amber-500 transition-all duration-200 flex items-center justify-center text-[8px] leading-none hover:scale-110"
          style={NO_DRAG_STYLE}
          aria-label={intl.formatMessage({ id: 'window.minimize' })}
        >
          <span className="text-amber-800">−</span>
        </button>

        <button
          onClick={() => handleWindowAction('maximize')}
          className="w-3 h-3 rounded-full bg-emerald-400 hover:bg-emerald-500 transition-all duration-200 flex items-center justify-center text-[8px] leading-none hover:scale-110"
          style={NO_DRAG_STYLE}
          aria-label={intl.formatMessage({ id: 'window.maximize' })}
        >
          <span className="text-emerald-800">□</span>
        </button>

        <button
          onClick={() => handleWindowAction('hideToTray')}
          className="w-3 h-3 rounded-full bg-rose-400 hover:bg-rose-500 transition-all duration-200 flex items-center justify-center text-[8px] leading-none hover:scale-110"
          style={NO_DRAG_STYLE}
          aria-label={intl.formatMessage({ id: 'window.hideToTray' })}
        >
          <span className="text-rose-800">×</span>
        </button>
      </div>
    </nav>
  );
};

export default WindowControls;
