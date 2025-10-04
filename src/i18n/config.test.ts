import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { getSupportedLocale, getDefaultLocale, messages } from './config';

describe('i18n/config', () => {
  describe('getSupportedLocale', () => {
    it('returns language part of locale code', () => {
      expect(getSupportedLocale('en-US')).toBe('en');
      expect(getSupportedLocale('fr-FR')).toBe('fr');
      expect(getSupportedLocale('de-DE')).toBe('de');
    });

    it('returns en for unsupported languages', () => {
      expect(getSupportedLocale('xx-XX')).toBe('en');
    });

    it('handles locale without region', () => {
      expect(getSupportedLocale('es')).toBe('es');
    });
  });

  describe('getDefaultLocale', () => {
    let originalNavigator: Navigator;

    beforeEach(() => {
      originalNavigator = global.navigator;
    });

    afterEach(() => {
      Object.defineProperty(global, 'navigator', {
        value: originalNavigator,
        writable: true,
      });
    });

    it('returns navigator language when available', () => {
      Object.defineProperty(global, 'navigator', {
        value: { language: 'fr-FR' },
        writable: true,
      });

      expect(getDefaultLocale()).toBe('fr');
    });

    it('returns en when navigator is unavailable', () => {
      Object.defineProperty(global, 'navigator', {
        value: undefined,
        writable: true,
      });

      expect(getDefaultLocale()).toBe('en');
    });
  });

  describe('messages', () => {
    it('exports all supported locale messages', () => {
      expect(messages).toHaveProperty('en');
      expect(messages).toHaveProperty('es');
      expect(messages).toHaveProperty('fr');
      expect(messages).toHaveProperty('de');
      expect(messages).toHaveProperty('zh');
      expect(messages).toHaveProperty('ja');
      expect(messages).toHaveProperty('pt');
      expect(messages).toHaveProperty('ru');
      expect(messages).toHaveProperty('ko');
      expect(messages).toHaveProperty('it');
      expect(messages).toHaveProperty('ro');
    });
  });
});
