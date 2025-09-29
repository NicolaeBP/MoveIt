import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SupportedLocale } from '@/i18n/config';
import { getSupportedLocale, getDefaultLocale } from '@/i18n/config';

interface LocaleStore {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
  initializeLocale: () => Promise<void>;
}

export const useLocaleStore = create<LocaleStore>()(
  persist(
    (set, get) => ({
      locale: getDefaultLocale(),
      setLocale: (locale: SupportedLocale) => {
        document.documentElement.lang = locale;
        set({ locale });
      },
      initializeLocale: async () => {
        const persistedData = localStorage.getItem('locale-storage');

        if (persistedData) {
          const state = get();
          document.documentElement.lang = state.locale;

          return;
        }

        // No persisted locale, try to get system locale from Electron
        const localeAPI = window.electronAPI?.locale;

        if (typeof window !== 'undefined' && window.electronAPI && localeAPI?.getSystemLocale) {
          const systemLocale = await localeAPI.getSystemLocale();
          const supportedLocale = getSupportedLocale(systemLocale);

          get().setLocale(supportedLocale);
        } else {
          // Fallback to browser locale if Electron API not available
          const state = get();
          document.documentElement.lang = state.locale;
        }
      },
    }),
    {
      name: 'locale-storage',
      partialize: (state) => ({ locale: state.locale }),
    }
  )
);
