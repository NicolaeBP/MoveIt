import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import Modal from './Modal';
import { useAppStore } from '@/store/useAppStore';
import type { AppStore } from '@/store/useAppStore';

// Mock zustand store
vi.mock('@/store/useAppStore');

const messages = {
  'modal.close.aria': 'Close modal',
};

describe('Modal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing when modalContent is null', () => {
    vi.mocked(useAppStore).mockImplementation(<T,>(selector: (state: AppStore) => T): T => {
      const state = {
        modalContent: null,
        closeModal: vi.fn(),
      } as unknown as AppStore;
      return selector(state);
    });

    const { container } = render(
      <IntlProvider locale="en" messages={messages}>
        <Modal />
      </IntlProvider>
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders modal when modalContent is provided', () => {
    vi.mocked(useAppStore).mockImplementation(<T,>(selector: (state: AppStore) => T): T => {
      const state = {
        modalContent: {
          title: <span>Test Title</span>,
          body: <span>Test Body</span>,
        },
        closeModal: vi.fn(),
      } as unknown as AppStore;
      return selector(state);
    });

    render(
      <IntlProvider locale="en" messages={messages}>
        <Modal />
      </IntlProvider>
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Body')).toBeInTheDocument();
  });

  it('renders modal with footer when provided', () => {
    vi.mocked(useAppStore).mockImplementation(<T,>(selector: (state: AppStore) => T): T => {
      const state = {
        modalContent: {
          title: <span>Test Title</span>,
          body: <span>Test Body</span>,
          footer: <button>Footer Button</button>,
        },
        closeModal: vi.fn(),
      } as unknown as AppStore;
      return selector(state);
    });

    render(
      <IntlProvider locale="en" messages={messages}>
        <Modal />
      </IntlProvider>
    );

    expect(screen.getByText('Footer Button')).toBeInTheDocument();
  });

  it('calls closeModal when close button is clicked', () => {
    const closeModalMock = vi.fn();

    vi.mocked(useAppStore).mockImplementation(<T,>(selector: (state: AppStore) => T): T => {
      const state = {
        modalContent: {
          title: <span>Test Title</span>,
          body: <span>Test Body</span>,
        },
        closeModal: closeModalMock,
      } as unknown as AppStore;
      return selector(state);
    });

    render(
      <IntlProvider locale="en" messages={messages}>
        <Modal />
      </IntlProvider>
    );

    const closeButton = screen.getByLabelText('Close modal');
    closeButton.click();

    expect(closeModalMock).toHaveBeenCalledTimes(1);
  });
});
