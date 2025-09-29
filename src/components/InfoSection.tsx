import { useIntl, FormattedMessage } from 'react-intl';
import { useAppStore } from '@/store/useAppStore';
import InfoModalContent from '@/components/InfoModalContent';

const InfoSection = () => {
  const intl = useIntl();

  const openModal = useAppStore((state) => state.openModal);

  const handleOpenInfo = () => {
    openModal({
      title: <FormattedMessage id="infoModal.title" />,
      body: <InfoModalContent />,
    });
  };

  return (
    <section className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 rounded-lg p-4 mb-6 flex items-center gap-2.5">
      <button
        onClick={handleOpenInfo}
        className="w-5 h-5 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 hover:scale-110"
        aria-label={intl.formatMessage({ id: 'info.button.aria' })}
      >
        <span className="text-white text-xs font-bold">i</span>
      </button>

      <p className="text-sm text-slate-600 dark:text-gray-300 leading-relaxed">
        <FormattedMessage id="info.description" />
      </p>
    </section>
  );
};

export default InfoSection;
