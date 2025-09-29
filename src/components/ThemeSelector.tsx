import { FormattedMessage } from 'react-intl';
import { useThemeStore } from '@/store/useThemeStore';

const themes = [
  { value: 'light', labelId: 'theme.light' },
  { value: 'dark', labelId: 'theme.dark' },
  { value: 'auto', labelId: 'theme.auto' },
] as const;

const ThemeSelector = () => {
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);

  const getDynamicThemeStyles = (value: string) =>
    theme === value
      ? 'bg-blue-500 text-white shadow-lg'
      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600';

  return (
    <div className="flex flex-col gap-2">
      <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
        <FormattedMessage id="theme.label" />
      </div>

      <div className="flex gap-2">
        {themes.map(({ value, labelId }) => (
          <button
            key={value}
            onClick={() => setTheme(value)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${getDynamicThemeStyles(value)}`}
            aria-pressed={theme === value}
          >
            <FormattedMessage id={labelId} />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeSelector;
