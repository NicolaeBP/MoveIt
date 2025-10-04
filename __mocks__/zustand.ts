import { act } from '@testing-library/react';
import { afterEach, vi } from 'vitest';
import type * as ZustandExportedTypes from 'zustand';

// Re-export everything from zustand
export * from 'zustand';

// Import actual zustand functions
const { create: actualCreate } = await vi.importActual<typeof ZustandExportedTypes>('zustand');

// Track all store reset functions
export const storeResetFns = new Set<() => void>();

// Create a wrapper for non-curried usage
const createUncurried = <T>(stateCreator: ZustandExportedTypes.StateCreator<T>) => {
  const store = actualCreate(stateCreator);

  const initialState = store.getInitialState();

  storeResetFns.add(() => {
    store.setState(initialState, true);
  });

  return store;
};

// Override create to support both curried and non-curried patterns
export const create = (<T>(stateCreator: ZustandExportedTypes.StateCreator<T>) => {
  console.log('zustand create mock called');

  return typeof stateCreator === 'function' ? createUncurried(stateCreator) : createUncurried;
}) as typeof ZustandExportedTypes.create;

// Reset all stores after each test
afterEach(() => {
  act(() => {
    storeResetFns.forEach((resetFn) => {
      resetFn();
    });
  });
});
