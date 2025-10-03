import { useIntl, FormattedMessage } from 'react-intl';
import { useAppStore } from '@/store/useAppStore';
import SettingsContent from '@/components/SettingsContent/SettingsContent';

const AppHeader = () => {
  const intl = useIntl();
  const openModal = useAppStore((state) => state.openModal);
  const closeModal = useAppStore((state) => state.closeModal);

  const handleOpenSettings = () => {
    openModal({
      title: <FormattedMessage id="settings.title" />,
      body: <SettingsContent />,
      footer: (
        <div className="flex justify-end">
          <button onClick={closeModal} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            <FormattedMessage id="settings.done" />
          </button>
        </div>
      ),
    });
  };

  return (
    <header className="w-full flex items-center justify-center mb-8 mt-8">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent tracking-tight mr-2">
        <FormattedMessage id="app.title" />
      </h1>

      <button
        onClick={handleOpenSettings}
        className="text-2xl transition-transform duration-300 hover:rotate-45"
        aria-label={intl.formatMessage({ id: 'app.openSettings' })}
      >
        ⚙️
      </button>
    </header>
  );
};

export default AppHeader;
