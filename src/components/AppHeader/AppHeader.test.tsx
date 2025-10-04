import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import AppHeader from './AppHeader';
import { useAppStore } from '@/store/useAppStore';
import { messages } from '@/i18n/config';

describe('AppHeader', () => {
  describe('when component renders', () => {
    it('displays app title', () => {
      useAppStore.setState({ openModal: vi.fn(), closeModal: vi.fn() });

      render(
        <IntlProvider locale="en" messages={messages.en}>
          <AppHeader />
        </IntlProvider>
      );

      expect(screen.getByText(messages.en['app.title'])).toBeInTheDocument();
    });

    it('displays settings button', () => {
      useAppStore.setState({ openModal: vi.fn(), closeModal: vi.fn() });

      render(
        <IntlProvider locale="en" messages={messages.en}>
          <AppHeader />
        </IntlProvider>
      );

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

      render(
        <IntlProvider locale="en" messages={messages.en}>
          <AppHeader />
        </IntlProvider>
      );

      const button = screen.getByLabelText(messages.en['app.openSettings']);

      button.click();

      expect(openModalMock).toHaveBeenCalledTimes(1);

      const modalConfig = openModalMock.mock.calls[0][0];

      render(
        <IntlProvider locale="en" messages={messages.en}>
          <div>
            {modalConfig.title}
            {modalConfig.body}
            {modalConfig.footer}
          </div>
        </IntlProvider>
      );

      expect(screen.getByText(messages.en['settings.title'])).toBeInTheDocument();
      expect(screen.getByText(messages.en['settings.done'])).toBeInTheDocument();
    });
  });
});
