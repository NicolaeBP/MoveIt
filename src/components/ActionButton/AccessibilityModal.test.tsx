import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import AccessibilityModalContent from './AccessibilityModal';
import { messages } from '@/i18n/config';

const renderComponent = () => render(
  <IntlProvider locale="en" messages={messages.en}>
    <AccessibilityModalContent />
  </IntlProvider>
);

describe('AccessibilityModalContent', () => {
  describe('when component renders', () => {
    it('displays accessibility introduction message', () => {
      renderComponent();

      expect(screen.getByText(messages.en['accessibility.intro'])).toBeInTheDocument();
    });

    it('displays permissions introduction', () => {
      renderComponent();

      expect(screen.getByText(messages.en['accessibility.permissions.intro'])).toBeInTheDocument();
    });

    it('displays all required permissions', () => {
      renderComponent();

      expect(screen.getByText(messages.en['accessibility.permissions.detectIdle'])).toBeInTheDocument();
      expect(screen.getByText(messages.en['accessibility.permissions.moveMouse'])).toBeInTheDocument();
      expect(screen.getByText(messages.en['accessibility.permissions.keepAwake'])).toBeInTheDocument();
    });

    it('displays privacy note', () => {
      renderComponent();

      expect(screen.getByText(messages.en['accessibility.privacyNote'])).toBeInTheDocument();
      expect(screen.getByText(messages.en['accessibility.privacyDescription'])).toBeInTheDocument();
    });
  });
});
