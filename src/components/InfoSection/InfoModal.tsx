import { FormattedMessage } from 'react-intl';

const InfoModalContent = () => {
  return (
    <div className="space-y-4 text-slate-600 dark:text-gray-300">
      <p>
        <FormattedMessage id="infoModal.intro" />
      </p>

      <div className="space-y-3">
        <div>
          <h3 className="font-semibold text-slate-800 dark:text-gray-100 mb-1">
            <FormattedMessage id="infoModal.smartDetection.title" />
          </h3>

          <p className="text-sm">
            <FormattedMessage id="infoModal.smartDetection.description" />
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-slate-800 dark:text-gray-100 mb-1">
            <FormattedMessage id="infoModal.minimalMovement.title" />
          </h3>

          <p className="text-sm">
            <FormattedMessage id="infoModal.minimalMovement.description" />
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-slate-800 dark:text-gray-100 mb-1">
            <FormattedMessage id="infoModal.configurableTiming.title" />
          </h3>

          <p className="text-sm">
            <FormattedMessage id="infoModal.configurableTiming.description" />
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-slate-800 dark:text-gray-100 mb-1">
            <FormattedMessage id="infoModal.privacyFirst.title" />
          </h3>

          <p className="text-sm">
            <FormattedMessage id="infoModal.privacyFirst.description" />
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-slate-800 dark:text-gray-100 mb-1">
            <FormattedMessage id="infoModal.lightweight.title" />
          </h3>

          <p className="text-sm">
            <FormattedMessage id="infoModal.lightweight.description" />
          </p>
        </div>
      </div>
    </div>
  );
};

export default InfoModalContent;
