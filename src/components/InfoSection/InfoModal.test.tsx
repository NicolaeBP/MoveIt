import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import InfoModalContent from './InfoModal';
import { messages } from '@/i18n/config';
import React from 'react';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <IntlProvider locale="en" messages={messages.en}>
    {children}
  </IntlProvider>
);

describe('InfoModalContent', () => {
  describe('when component renders', () => {
    it('displays intro message', () => {
      render(<InfoModalContent />, { wrapper });

      expect(screen.getByText(messages.en['infoModal.intro'])).toBeInTheDocument();
    });

    it('displays smart detection feature', () => {
      render(<InfoModalContent />, { wrapper });

      expect(screen.getByText(messages.en['infoModal.smartDetection.title'])).toBeInTheDocument();
      expect(screen.getByText(messages.en['infoModal.smartDetection.description'])).toBeInTheDocument();
    });

    it('displays minimal movement feature', () => {
      render(<InfoModalContent />, { wrapper });

      expect(screen.getByText(messages.en['infoModal.minimalMovement.title'])).toBeInTheDocument();
      expect(screen.getByText(messages.en['infoModal.minimalMovement.description'])).toBeInTheDocument();
    });

    it('displays configurable timing feature', () => {
      render(<InfoModalContent />, { wrapper });

      expect(screen.getByText(messages.en['infoModal.configurableTiming.title'])).toBeInTheDocument();
      expect(screen.getByText(messages.en['infoModal.configurableTiming.description'])).toBeInTheDocument();
    });

    it('displays privacy first feature', () => {
      render(<InfoModalContent />, { wrapper });

      expect(screen.getByText(messages.en['infoModal.privacyFirst.title'])).toBeInTheDocument();
      expect(screen.getByText(messages.en['infoModal.privacyFirst.description'])).toBeInTheDocument();
    });

    it('displays lightweight feature', () => {
      render(<InfoModalContent />, { wrapper });

      expect(screen.getByText(messages.en['infoModal.lightweight.title'])).toBeInTheDocument();
      expect(screen.getByText(messages.en['infoModal.lightweight.description'])).toBeInTheDocument();
    });
  });
});
