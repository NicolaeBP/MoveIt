import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import WindowControls from './WindowControls';
import { useAppStore } from '@/store/useAppStore';

describe('WindowControls', () => {
  describe('when component renders', () => {
    it('displays three window control buttons', () => {
      render(<WindowControls />);

      // Todo: move all aria labels to translation files and add language translations
      expect(screen.getByLabelText('Minimize window')).toBeInTheDocument();
      expect(screen.getByLabelText('Maximize window')).toBeInTheDocument();
      expect(screen.getByLabelText('Hide to tray')).toBeInTheDocument();
    });
  });

  describe('when minimize button is clicked', () => {
    it('calls electronAPI minimize', async () => {
      const minimizeMock = vi.fn();

      window.electronAPI = {
        ...window.electronAPI,
        window: {
          ...window.electronAPI.window,
          minimize: minimizeMock,
        },
      };

      render(<WindowControls />);

      const minimizeButton = screen.getByLabelText('Minimize window');

      minimizeButton.click();

      await vi.waitFor(() => {
        expect(minimizeMock).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('when maximize button is clicked', () => {
    it('calls electronAPI maximize', async () => {
      const maximizeMock = vi.fn();

      window.electronAPI = {
        ...window.electronAPI,
        window: {
          ...window.electronAPI.window,
          maximize: maximizeMock,
        },
      };

      render(<WindowControls />);

      const maximizeButton = screen.getByLabelText('Maximize window');

      maximizeButton.click();

      await vi.waitFor(() => {
        expect(maximizeMock).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('when hide to tray button is clicked', () => {
    it('passes showTrayMessage value to hideToTray', async () => {
      const hideToTrayMock = vi.fn();

      window.electronAPI = {
        ...window.electronAPI,
        window: {
          ...window.electronAPI.window,
          hideToTray: hideToTrayMock,
        },
      };

      useAppStore.setState({ showTrayMessage: false });

      render(<WindowControls />);

      const hideButton = screen.getByLabelText('Hide to tray');

      hideButton.click();

      await vi.waitFor(() => {
        expect(hideToTrayMock).toHaveBeenCalledWith(false);
      });
    });
  });
});
