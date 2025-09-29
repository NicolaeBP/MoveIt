import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useAppStore } from '@/store/useAppStore';

export interface ModalContent {
  title: ReactNode;
  body: ReactNode;
  footer?: ReactNode;
}

const Modal = () => {
  const intl = useIntl();

  const modalContent = useAppStore((state) => state.modalContent);
  const closeModal = useAppStore((state) => state.closeModal);

  useEffect(() => {
    if (modalContent) {
      const handleEscape = (event: KeyboardEvent) => event.key === 'Escape' && closeModal();

      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';

      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = 'unset';
      };
    }
  }, [modalContent, closeModal]);

  if (!modalContent) return null;

  return (
    <dialog className="fixed inset-0 bg-white dark:bg-gray-800 z-50 flex flex-col w-full h-full">
      <header className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-slate-800 dark:text-gray-100">{modalContent.title}</h2>

        <button
          onClick={closeModal}
          className="text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-gray-300 transition-colors"
          aria-label={intl.formatMessage({ id: 'modal.close.aria' })}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-6">{modalContent.body}</div>

      {modalContent.footer && <footer className="px-6 py-4 border-t border-slate-100 dark:border-gray-700">{modalContent.footer}</footer>}
    </dialog>
  );
};

export default Modal;
