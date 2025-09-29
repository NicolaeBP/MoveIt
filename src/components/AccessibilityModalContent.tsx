import { FormattedMessage } from 'react-intl';

const AccessibilityModalContent = () => (
  <div className="space-y-4 text-slate-600 dark:text-gray-300">
    <p className="font-medium text-slate-800 dark:text-gray-100">
      <FormattedMessage id="accessibility.intro" />
    </p>

    <p>
      <FormattedMessage id="accessibility.permissions.intro" />
    </p>

    <ul className="list-disc list-inside space-y-1 ml-2">
      <li>
        <FormattedMessage id="accessibility.permissions.detectIdle" />
      </li>
      <li>
        <FormattedMessage id="accessibility.permissions.moveMouse" />
      </li>
      <li>
        <FormattedMessage id="accessibility.permissions.keepAwake" />
      </li>
    </ul>

    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
      <p className="text-sm">
        <strong>
          <FormattedMessage id="accessibility.privacyNote" />
        </strong>{' '}
        <FormattedMessage id="accessibility.privacyDescription" />
      </p>
    </div>
  </div>
);

export default AccessibilityModalContent;
