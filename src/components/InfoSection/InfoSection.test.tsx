import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import InfoSection from './InfoSection';
import { useAppStore } from '@/store/useAppStore';
import { messages } from '@/i18n/config';
import React from 'react';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <IntlProvider locale="en" messages={messages.en}>
    {children}
  </IntlProvider>
);

describe('InfoSection', () => {
  describe('when component renders', () => {
    it('displays info description', () => {
      useAppStore.setState({ openModal: vi.fn() });

      render(<InfoSection />, { wrapper });

      expect(screen.getByText(messages.en['info.description'])).toBeInTheDocument();
    });

    it('displays info button', () => {
      useAppStore.setState({ openModal: vi.fn() });

      render(<InfoSection />, { wrapper });

      const button = screen.getByLabelText(messages.en['info.button.aria']);

      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('i');
    });
  });

  describe('when info button is clicked', () => {
    it('opens modal with correct info content', () => {
      const openModalMock = vi.fn();

      useAppStore.setState({ openModal: openModalMock });

      render(<InfoSection />, { wrapper });

      const button = screen.getByLabelText(messages.en['info.button.aria']);

      button.click();

      expect(openModalMock).toHaveBeenCalledTimes(1);

      const modalConfig = openModalMock.mock.calls[0][0];

      render(
        <div>
          {modalConfig.title}
          {modalConfig.body}
        </div>,
        { wrapper }
      );

      expect(screen.getByText(messages.en['infoModal.title'])).toBeInTheDocument();
      expect(screen.getByText(messages.en['infoModal.intro'])).toBeInTheDocument();
      expect(screen.getByText(messages.en['infoModal.smartDetection.title'])).toBeInTheDocument();
    });
  });
});
