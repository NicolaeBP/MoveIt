import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Mock zustand to use our custom mock with auto-reset
vi.mock('zustand');

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock window.electronAPI for tests
if (globalThis.window !== undefined) {
  (globalThis.window as unknown as Record<string, unknown>).electronAPI = {
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
