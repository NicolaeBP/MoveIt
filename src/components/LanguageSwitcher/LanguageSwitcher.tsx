import React from 'react';
import { useLocaleStore } from '@/store/useLocaleStore';
import type { SupportedLocale } from '@/i18n/config';
import { localeNames } from '@/i18n/config';

const LanguageSwitcher = () => {
  const locale = useLocaleStore((state) => state.locale);
  const setLocale = useLocaleStore((state) => state.setLocale);

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => setLocale(event.target.value as SupportedLocale);

  return (
    <select
      value={locale}
      onChange={handleLanguageChange}
      className="px-3 py-1.5 text-sm border border-slate-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-gray-200"
      aria-label="Language selection"
    >
      {Object.entries(localeNames).map(([code, name]) => (
        <option key={code} value={code}>
          {name}
        </option>
      ))}
    </select>
  );
};

export default LanguageSwitcher;
