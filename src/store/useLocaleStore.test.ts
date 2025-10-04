import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useLocaleStore } from './useLocaleStore';

describe('useLocaleStore', () => {
  beforeEach(() => {
    useLocaleStore.setState({ locale: 'en' });
    localStorage.clear();
  });

  describe('setLocale', () => {
    it('updates locale and document language', () => {
      const { setLocale } = useLocaleStore.getState();

      setLocale('fr');

      expect(useLocaleStore.getState().locale).toBe('fr');
      expect(document.documentElement.lang).toBe('fr');
    });
  });

  describe('initializeLocale', () => {
    describe('when persisted locale exists', () => {
      it('sets document language from persisted state', async () => {
        localStorage.setItem('locale-storage', JSON.stringify({ state: { locale: 'es' } }));

        useLocaleStore.setState({ locale: 'es' });

        await useLocaleStore.getState().initializeLocale();

        expect(document.documentElement.lang).toBe('es');
      });
    });

    describe('when no persisted locale and electron API available', () => {
      it('gets system locale from electron', async () => {
        const getSystemLocaleMock = vi.fn().mockResolvedValue('de-DE');

        window.electronAPI = {
          ...window.electronAPI,
          locale: {
            ...window.electronAPI.locale,
            getSystemLocale: getSystemLocaleMock,
          },
        };

        await useLocaleStore.getState().initializeLocale();

        expect(getSystemLocaleMock).toHaveBeenCalled();
        expect(useLocaleStore.getState().locale).toBe('de');
      });
    });

    describe('when no persisted locale and electron API not available', () => {
      it('uses current locale', async () => {
        window.electronAPI = {
          ...window.electronAPI,
          locale: undefined,
        };

        useLocaleStore.setState({ locale: 'en' });

        await useLocaleStore.getState().initializeLocale();

        expect(document.documentElement.lang).toBe('en');
      });
    });
  });
});
