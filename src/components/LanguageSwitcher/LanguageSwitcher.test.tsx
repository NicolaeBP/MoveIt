import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import LanguageSwitcher from './LanguageSwitcher';
import { useLocaleStore } from '@/store/useLocaleStore';
import { localeNames, messages } from '@/i18n/config';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <IntlProvider locale="en" messages={messages.en}>
    {children}
  </IntlProvider>
);

describe('LanguageSwitcher', () => {
  describe('when component renders', () => {
    it('displays select dropdown with all supported languages', () => {
      useLocaleStore.setState({ locale: 'en' });

      render(<LanguageSwitcher />, { wrapper });

      const select = screen.getByLabelText(messages.en['settings.language.aria']);

      expect(select).toBeInTheDocument();

      Object.entries(localeNames).forEach(([, name]) => {
        expect(screen.getByRole('option', { name })).toBeInTheDocument();
      });
    });

    it('displays current locale as selected', () => {
      useLocaleStore.setState({ locale: 'fr' });

      render(<LanguageSwitcher />, { wrapper });

      const select = screen.getByLabelText(messages.en['settings.language.aria']) as HTMLSelectElement;

      expect(select.value).toBe('fr');
    });
  });

  describe('when language is changed', () => {
    it('calls setLocale with selected language', () => {
      const setLocaleMock = vi.fn();

      useLocaleStore.setState({ locale: 'en', setLocale: setLocaleMock });

      render(<LanguageSwitcher />, { wrapper });

      const select = screen.getByLabelText(messages.en['settings.language.aria']) as HTMLSelectElement;
      select.value = 'es';
      select.dispatchEvent(new Event('change', { bubbles: true }));

      expect(setLocaleMock).toHaveBeenCalledWith('es');
    });
  });
});
