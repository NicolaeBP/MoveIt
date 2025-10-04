import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import LanguageSwitcher from './LanguageSwitcher';
import { useLocaleStore } from '@/store/useLocaleStore';
import { localeNames } from '@/i18n/config';

describe('LanguageSwitcher', () => {
  describe('when component renders', () => {
    it('displays select dropdown with all supported languages', () => {
      useLocaleStore.setState({ locale: 'en' });

      render(<LanguageSwitcher />);

      const select = screen.getByLabelText('Language selection');

      expect(select).toBeInTheDocument();

      Object.entries(localeNames).forEach(([, name]) => {
        expect(screen.getByRole('option', { name })).toBeInTheDocument();
      });
    });

    it('displays current locale as selected', () => {
      useLocaleStore.setState({ locale: 'fr' });

      render(<LanguageSwitcher />);

      const select = screen.getByLabelText('Language selection') as HTMLSelectElement;

      expect(select.value).toBe('fr');
    });
  });

  describe('when language is changed', () => {
    it('calls setLocale with selected language', () => {
      const setLocaleMock = vi.fn();

      useLocaleStore.setState({ locale: 'en', setLocale: setLocaleMock });

      render(<LanguageSwitcher />);

      const select = screen.getByLabelText('Language selection') as HTMLSelectElement;
      select.value = 'es';
      select.dispatchEvent(new Event('change', { bubbles: true }));

      expect(setLocaleMock).toHaveBeenCalledWith('es');
    });
  });
});
