import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import AboutSection from './AboutSection';
import { APP_INFO } from '@/constants/appInfo';
import { messages } from '@/i18n/config';

const renderComponent = () => render(
  <IntlProvider locale="en" messages={messages.en}>
    <AboutSection />
  </IntlProvider>
);

describe('AboutSection', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_BUILD_DATE', '');
    vi.stubEnv('PACKAGE_VERSION', '');
  });

  describe('when component renders', () => {
    it('displays app information', () => {
      renderComponent();

      expect(screen.getByText(messages.en['about.title'])).toBeInTheDocument();
      expect(screen.getByText(messages.en['about.version'], { exact: false })).toBeInTheDocument();
      expect(screen.getByText(messages.en['about.author'], { exact: false })).toBeInTheDocument();
      expect(screen.getByText(messages.en['about.email'], { exact: false })).toBeInTheDocument();
      expect(screen.getAllByText(messages.en['about.github'], { exact: false })).toHaveLength(2);
    });

    it('displays default version when PACKAGE_VERSION is not set', () => {
      renderComponent();

      expect(screen.getByText(`v${APP_INFO.DEFAULT_VERSION}`)).toBeInTheDocument();
    });

    it('displays author name', () => {
      renderComponent();

      expect(screen.getByText(APP_INFO.AUTHOR)).toBeInTheDocument();
    });

    it('displays clickable email link', () => {
      renderComponent();

      const emailLink = screen.getByText(APP_INFO.EMAIL);

      expect(emailLink).toBeInTheDocument();
      expect(emailLink.closest('a')).toHaveAttribute('href', `mailto:${APP_INFO.EMAIL}`);
    });

    it('displays clickable GitHub link', () => {
      renderComponent();

      const githubLink = screen.getByText(messages.en['about.viewOnGithub']);

      expect(githubLink).toBeInTheDocument();
      expect(githubLink.closest('a')).toHaveAttribute('href', messages.en['links.github']);
      expect(githubLink.closest('a')).toHaveAttribute('target', '_blank');
      expect(githubLink.closest('a')).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('displays copyright notice', () => {
      renderComponent();

      expect(screen.getByText(messages.en['about.copyright'])).toBeInTheDocument();
    });
  });

  describe('when VITE_BUILD_DATE is set', () => {
    it('displays build date', () => {
      const buildDate = '2025-01-15T10:30:00.000Z';

      vi.stubEnv('VITE_BUILD_DATE', buildDate);

      renderComponent();

      expect(screen.getByText(/Build:/)).toBeInTheDocument();
    });
  });

  describe('when PACKAGE_VERSION is set', () => {
    it('displays package version', () => {
      vi.stubEnv('PACKAGE_VERSION', '2.0.0');

      renderComponent();

      expect(screen.getByText('v2.0.0')).toBeInTheDocument();
    });
  });
});
