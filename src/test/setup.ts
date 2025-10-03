import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock window.electronAPI for tests
if (typeof window !== 'undefined') {
  (window as unknown as Record<string, unknown>).electronAPI = {
    mouseMover: {
      toggle: vi.fn(),
      onRunningStateChanged: vi.fn(() => () => {}),
    },
    accessibility: {
      openSettings: vi.fn(),
    },
    window: {
      minimize: vi.fn(),
      maximize: vi.fn(),
      hideToTray: vi.fn(),
    },
    locale: {
      getSystemLocale: vi.fn().mockResolvedValue('en'),
    },
    theme: {
      shouldUseDarkColors: vi.fn().mockResolvedValue(false),
      onNativeThemeUpdated: vi.fn(() => () => {}),
    },
  };
}
