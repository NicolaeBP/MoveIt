import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ModalContent } from '@/components/Modal/Modal';
import type { ScheduleConfig, WeekDay } from '@shared/types';
import { updateDaySchedule } from '@/utils/scheduleUtils';
import { DEFAULT_INTERVAL_MS, MS_PER_MINUTE } from '@/constants/timeConstants';

const MAX_INTERVAL_MS = 24 * 60 * MS_PER_MINUTE;

type MovementStatus = 'moving' | 'waiting' | 'stopped';

export interface AppStore {
  interval: number;
  modalContent: ModalContent | null;
  scheduleConfig: ScheduleConfig;
  scheduleEnabled: boolean;
  showTrayMessage: boolean;
  movementStatus: MovementStatus;
  autoUpdatesEnabled: boolean;
  isUpToDate: boolean | null;
  setInterval: (interval: number) => void;
  openModal: (content: ModalContent) => void;
  closeModal: () => void;
  updateDaySchedule: (day: WeekDay, timeRanges: Array<{ start: string; end: string }>) => void;
  setScheduleEnabled: (enabled: boolean) => void;
  setShowTrayMessage: (show: boolean) => void;
  setMovementStatus: (status: 'moving' | 'waiting' | 'stopped') => void;
  setAutoUpdatesEnabled: (enabled: boolean) => void;
  setIsUpToDate: (isUpToDate: boolean | null) => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      interval: DEFAULT_INTERVAL_MS,
      modalContent: null,
      scheduleConfig: [],
      scheduleEnabled: false,
      showTrayMessage: true,
      movementStatus: 'stopped' as 'moving' | 'waiting' | 'stopped',
      autoUpdatesEnabled: true,
      isUpToDate: null,

      setInterval: (interval) => set({ interval }),
      openModal: (content) => set({ modalContent: content }),
      closeModal: () => set({ modalContent: null }),
      updateDaySchedule: (day, timeRanges) =>
        set((state) => ({
          scheduleConfig: updateDaySchedule(state.scheduleConfig, day, timeRanges),
        })),
      setScheduleEnabled: (enabled) => set({ scheduleEnabled: enabled }),
      setShowTrayMessage: (show) => set({ showTrayMessage: show }),
      setMovementStatus: (status) => set({ movementStatus: status }),
      setAutoUpdatesEnabled: (enabled) => set({ autoUpdatesEnabled: enabled }),
      setIsUpToDate: (isUpToDate) => set({ isUpToDate }),
    }),
    {
      name: 'moveit-storage',
      partialize: (state) => ({
        interval: state.interval,
        scheduleConfig: state.scheduleConfig,
        scheduleEnabled: state.scheduleEnabled,
        showTrayMessage: state.showTrayMessage,
        autoUpdatesEnabled: state.autoUpdatesEnabled,
      }),
      merge: (persistedState, currentState) => {
        const merged = { ...currentState, ...(persistedState as Partial<AppStore>) };

        if (
          typeof merged.interval !== 'number' ||
          Number.isNaN(merged.interval) ||
          merged.interval <= 0 ||
          merged.interval > MAX_INTERVAL_MS
        ) {
          merged.interval = DEFAULT_INTERVAL_MS;
        }

        if (!Array.isArray(merged.scheduleConfig)) {
          merged.scheduleConfig = [];
        }

        return merged;
      },
    }
  )
);
