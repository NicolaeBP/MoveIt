import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import Modal from './Modal';
import { useAppStore } from '@/store/useAppStore';
import { messages } from '@/i18n/config';

describe('Modal', () => {
  describe('when modalContent is null', () => {
    it('renders nothing', () => {
      useAppStore.setState({ modalContent: null });

      render(
        <IntlProvider locale="en" messages={messages.en}>
          <Modal />
        </IntlProvider>
      );

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  describe('when modalContent is provided', () => {
    it('renders modal with title and body', () => {
      useAppStore.setState({
        modalContent: {
          title: <span>Test Title</span>,
          body: <span>Test Body</span>,
        },
      });

      render(
        <IntlProvider locale="en" messages={messages.en}>
          <Modal />
        </IntlProvider>
      );

      expect(screen.getByText('Test Title')).toBeInTheDocument();
      expect(screen.getByText('Test Body')).toBeInTheDocument();
    });

    it('renders modal with footer when footer is provided', () => {
      useAppStore.setState({
        modalContent: {
          title: <span>Test Title</span>,
          body: <span>Test Body</span>,
          footer: <button>Footer Button</button>,
        },
      });

      render(
        <IntlProvider locale="en" messages={messages.en}>
          <Modal />
        </IntlProvider>
      );

      expect(screen.getByText('Footer Button')).toBeInTheDocument();
    });
  });

  describe('when close button is clicked', () => {
    it('calls closeModal function', () => {
      const closeModalMock = vi.fn();
      useAppStore.setState({
        modalContent: {
          title: <span>Test Title</span>,
          body: <span>Test Body</span>,
        },
        closeModal: closeModalMock,
      });

      render(
        <IntlProvider locale="en" messages={messages.en}>
          <Modal />
        </IntlProvider>
      );

      const closeButton = screen.getByLabelText(messages.en['modal.close.aria']);
      closeButton.click();

      expect(closeModalMock).toHaveBeenCalledTimes(1);
    });
  });
});
