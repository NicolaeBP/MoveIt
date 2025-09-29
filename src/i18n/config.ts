import en from './locales/en.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import de from './locales/de.json';
import zh from './locales/zh.json';
import ja from './locales/ja.json';
import pt from './locales/pt.json';
import ru from './locales/ru.json';
import ko from './locales/ko.json';
import it from './locales/it.json';
import ro from './locales/ro.json';

export type SupportedLocale = 'en' | 'es' | 'fr' | 'de' | 'zh' | 'ja' | 'pt' | 'ru' | 'ko' | 'it' | 'ro';

export const messages = { en, es, fr, de, zh, ja, pt, ru, ko, it, ro };

export const localeNames: Record<SupportedLocale, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  zh: '中文',
  ja: '日本語',
  pt: 'Português',
  ru: 'Русский',
  ko: '한국어',
  it: 'Italiano',
  ro: 'Română',
};

export const getSupportedLocale = (systemLocale: string): SupportedLocale => {
  const languagePart = systemLocale.split('-')[0] as SupportedLocale;
  return messages[languagePart] ? languagePart : 'en';
};

export const getDefaultLocale = (): SupportedLocale => {
  if (typeof navigator !== 'undefined' && navigator.language) {
    return getSupportedLocale(navigator.language);
  }

  return 'en';
};
