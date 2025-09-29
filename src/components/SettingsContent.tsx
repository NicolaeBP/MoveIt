import { FormattedMessage } from 'react-intl';
import { useAppStore } from '@/store/useAppStore';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import ThemeSelector from '@/components/ThemeSelector';
import AboutSection from '@/components/AboutSection';

const SettingsContent = () => {
  const showTrayMessage = useAppStore((state) => state.showTrayMessage);
  const setShowTrayMessage = useAppStore((state) => state.setShowTrayMessage);

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

      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <AboutSection />
      </div>
    </div>
  );
};

export default SettingsContent;
