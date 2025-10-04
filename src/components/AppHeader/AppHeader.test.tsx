import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import AppHeader from './AppHeader';
import { useAppStore } from '@/store/useAppStore';
import { messages } from '@/i18n/config';
import React from 'react';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <IntlProvider locale="en" messages={messages.en}>
    {children}
  </IntlProvider>
);

describe('AppHeader', () => {
  describe('when component renders', () => {
    it('displays app title', () => {
      useAppStore.setState({ openModal: vi.fn(), closeModal: vi.fn() });

      render(<AppHeader />, { wrapper });

      expect(screen.getByText(messages.en['app.title'])).toBeInTheDocument();
    });

    it('displays settings button', () => {
      useAppStore.setState({ openModal: vi.fn(), closeModal: vi.fn() });

      render(<AppHeader />, { wrapper });

      const button = screen.getByLabelText(messages.en['app.openSettings']);

      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('⚙️');
    });
  });

  describe('when settings button is clicked', () => {
    it('opens modal with correct settings content', () => {
      const openModalMock = vi.fn();
      const closeModalMock = vi.fn();

      useAppStore.setState({ openModal: openModalMock, closeModal: closeModalMock });

      render(<AppHeader />, { wrapper });

      const button = screen.getByLabelText(messages.en['app.openSettings']);

      button.click();

      expect(openModalMock).toHaveBeenCalledTimes(1);

      const modalConfig = openModalMock.mock.calls[0][0];

      render(
        <div>
          {modalConfig.title}
          {modalConfig.body}
          {modalConfig.footer}
        </div>,
        { wrapper }
      );

      expect(screen.getByText(messages.en['settings.title'])).toBeInTheDocument();
      expect(screen.getByText(messages.en['settings.done'])).toBeInTheDocument();
    });
  });
});
