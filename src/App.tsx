import { IntlProvider } from 'react-intl';
import WindowControls from '@/components/WindowControls';
import AppHeader from '@/components/AppHeader';
import TimeSettings from '@/components/TimeSettings';
import InfoSection from '@/components/InfoSection';
import ActionButton from '@/components/ActionButton';
import ScheduleStatus from '@/components/ScheduleStatus';
import ScheduleSettings from '@/components/ScheduleSettings';
import Modal from '@/components/Modal';
import { useAppInitialization } from '@/hooks/useAppInitialization';
import { useLocaleStore } from '@/store/useLocaleStore';
import { messages } from '@/i18n/config';

const App = () => {
  const locale = useLocaleStore((state) => state.locale);
  const { isInitialized } = useAppInitialization();

  if (!isInitialized) return null;

  return (
    <IntlProvider locale={locale} messages={messages[locale]} defaultLocale="en">
      <main className="flex flex-col select-none w-full h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 relative">
        <WindowControls />

        <section className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide p-8 pt-0">
          <AppHeader />

          <TimeSettings />

          <ScheduleSettings />

          <ScheduleStatus />

          <InfoSection />

          <ActionButton />

          <Modal />
        </section>
      </main>
    </IntlProvider>
  );
};

export default App;
