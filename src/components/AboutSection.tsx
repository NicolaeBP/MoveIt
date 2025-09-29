import { useIntl, FormattedMessage } from 'react-intl';
import { APP_INFO } from '@/constants/appInfo';

const AboutSection = () => {
  const intl = useIntl();
  const githubRepo = intl.formatMessage({ id: 'links.github' });

  const buildDate = import.meta.env.VITE_BUILD_DATE ? new Date(import.meta.env.VITE_BUILD_DATE).toLocaleString() : null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
        <FormattedMessage id="about.title" />
      </h3>

      <div className="space-y-3 text-sm">
        <div>
          <span className="font-medium text-gray-700 dark:text-gray-300">
            <FormattedMessage id="about.version" />:
          </span>{' '}
          <span className="text-gray-600 dark:text-gray-400">v{import.meta.env.PACKAGE_VERSION || APP_INFO.DEFAULT_VERSION}</span>
          {buildDate && <span className="text-xs text-gray-500 dark:text-gray-500 ml-2">(Build: {buildDate})</span>}
        </div>

        <div>
          <span className="font-medium text-gray-700 dark:text-gray-300">
            <FormattedMessage id="about.author" />:
          </span>{' '}
          <span className="text-gray-600 dark:text-gray-400">{APP_INFO.AUTHOR}</span>
        </div>

        <div>
          <span className="font-medium text-gray-700 dark:text-gray-300">
            <FormattedMessage id="about.email" />:
          </span>{' '}
          <a href={`mailto:${APP_INFO.EMAIL}`} className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300">
            {APP_INFO.EMAIL}
          </a>
        </div>

        <div>
          <span className="font-medium text-gray-700 dark:text-gray-300">
            <FormattedMessage id="about.github" />:
          </span>{' '}
          <a
            href={githubRepo}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <FormattedMessage id="about.viewOnGithub" />
          </a>
        </div>

        <div className="pt-2 text-xs text-gray-500 dark:text-gray-500 italic">
          <FormattedMessage id="about.copyright" />
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
