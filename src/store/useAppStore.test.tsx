import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from './useAppStore';
import { DEFAULT_INTERVAL_MS, MS_PER_MINUTE } from '@/constants/timeConstants';

describe('useAppStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useAppStore.setState({
      interval: DEFAULT_INTERVAL_MS,
      modalContent: null,
      scheduleConfig: [],
      scheduleEnabled: false,
      showTrayMessage: true,
      movementStatus: 'stopped',
    });
  });

  describe('initial state', () => {
    it('has default interval', () => {
      expect(useAppStore.getState().interval).toBe(DEFAULT_INTERVAL_MS);
    });

    it('has no modal content', () => {
      expect(useAppStore.getState().modalContent).toBeNull();
    });

    it('has empty schedule config', () => {
      expect(useAppStore.getState().scheduleConfig).toEqual([]);
    });

    it('has schedule disabled', () => {
      expect(useAppStore.getState().scheduleEnabled).toBe(false);
    });

    it('has tray message enabled', () => {
      expect(useAppStore.getState().showTrayMessage).toBe(true);
    });

    it('has stopped movement status', () => {
      expect(useAppStore.getState().movementStatus).toBe('stopped');
    });
  });

  describe('setInterval', () => {
    it('updates interval', () => {
      const newInterval = 5000;

      useAppStore.getState().setInterval(newInterval);

      expect(useAppStore.getState().interval).toBe(newInterval);
    });
  });

  describe('openModal', () => {
    it('sets modal content', () => {
      const modalContent = {
        title: <span>Test</span>,
        body: <span>Body</span>,
      };

      useAppStore.getState().openModal(modalContent);

      expect(useAppStore.getState().modalContent).toEqual(modalContent);
    });
  });

  describe('closeModal', () => {
    it('clears modal content', () => {
      useAppStore.getState().openModal({
        title: <span>Test</span>,
        body: <span>Body</span>,
      });

      useAppStore.getState().closeModal();

      expect(useAppStore.getState().modalContent).toBeNull();
    });
  });

  describe('updateDaySchedule', () => {
    it('adds time ranges for a day', () => {
      const timeRanges = [{ start: '09:00', end: '17:00' }];

      useAppStore.getState().updateDaySchedule('monday', timeRanges);

      const scheduleConfig = useAppStore.getState().scheduleConfig;

      expect(scheduleConfig).toHaveLength(1);
      expect(scheduleConfig[0]).toEqual({ dayIndex: 1, start: '09:00', end: '17:00' });
    });

    it('updates existing day schedule', () => {
      useAppStore.getState().updateDaySchedule('monday', [{ start: '09:00', end: '17:00' }]);

      useAppStore.getState().updateDaySchedule('monday', [{ start: '10:00', end: '18:00' }]);

      const scheduleConfig = useAppStore.getState().scheduleConfig;

      expect(scheduleConfig).toHaveLength(1);
      expect(scheduleConfig[0]).toEqual({ dayIndex: 1, start: '10:00', end: '18:00' });
    });

    it('removes day when empty time ranges provided', () => {
      useAppStore.getState().updateDaySchedule('monday', [{ start: '09:00', end: '17:00' }]);

      useAppStore.getState().updateDaySchedule('monday', []);

      expect(useAppStore.getState().scheduleConfig).toEqual([]);
    });
  });

  describe('setScheduleEnabled', () => {
    it('enables schedule', () => {
      useAppStore.getState().setScheduleEnabled(true);

      expect(useAppStore.getState().scheduleEnabled).toBe(true);
    });

    it('disables schedule', () => {
      useAppStore.getState().setScheduleEnabled(true);

      useAppStore.getState().setScheduleEnabled(false);

      expect(useAppStore.getState().scheduleEnabled).toBe(false);
    });
  });

  describe('setShowTrayMessage', () => {
    it('enables tray message', () => {
      useAppStore.getState().setShowTrayMessage(false);

      useAppStore.getState().setShowTrayMessage(true);

      expect(useAppStore.getState().showTrayMessage).toBe(true);
    });

    it('disables tray message', () => {
      useAppStore.getState().setShowTrayMessage(false);

      expect(useAppStore.getState().showTrayMessage).toBe(false);
    });
  });

  describe('setMovementStatus', () => {
    it('sets status to moving', () => {
      useAppStore.getState().setMovementStatus('moving');

      expect(useAppStore.getState().movementStatus).toBe('moving');
    });

    it('sets status to waiting', () => {
      useAppStore.getState().setMovementStatus('waiting');

      expect(useAppStore.getState().movementStatus).toBe('waiting');
    });

    it('sets status to stopped', () => {
      useAppStore.getState().setMovementStatus('moving');

      useAppStore.getState().setMovementStatus('stopped');

      expect(useAppStore.getState().movementStatus).toBe('stopped');
    });
  });

  describe('persistence', () => {
    describe('when valid persisted state exists', () => {
      it('restores interval from localStorage', () => {
        const persistedInterval = 3000;

        localStorage.setItem(
          'moveit-storage',
          JSON.stringify({ state: { interval: persistedInterval } })
        );

        useAppStore.persist.rehydrate();

        expect(useAppStore.getState().interval).toBe(persistedInterval);
      });

      it('restores schedule config from localStorage', () => {
        const scheduleConfig = [{ dayIndex: 1, start: '09:00', end: '17:00' }];

        localStorage.setItem(
          'moveit-storage',
          JSON.stringify({ state: { scheduleConfig } })
        );

        useAppStore.persist.rehydrate();

        expect(useAppStore.getState().scheduleConfig).toEqual(scheduleConfig);
      });
    });

    describe('when invalid interval in persisted state', () => {
      it('resets to default when interval is negative', () => {
        localStorage.setItem(
          'moveit-storage',
          JSON.stringify({ state: { interval: -1000 } })
        );

        useAppStore.persist.rehydrate();

        expect(useAppStore.getState().interval).toBe(DEFAULT_INTERVAL_MS);
      });

      it('resets to default when interval is NaN', () => {
        localStorage.setItem(
          'moveit-storage',
          JSON.stringify({ state: { interval: NaN } })
        );

        useAppStore.persist.rehydrate();

        expect(useAppStore.getState().interval).toBe(DEFAULT_INTERVAL_MS);
      });

      it('resets to default when interval exceeds max', () => {
        const maxInterval = 24 * 60 * MS_PER_MINUTE;

        localStorage.setItem(
          'moveit-storage',
          JSON.stringify({ state: { interval: maxInterval + 1000 } })
        );

        useAppStore.persist.rehydrate();

        expect(useAppStore.getState().interval).toBe(DEFAULT_INTERVAL_MS);
      });
    });

    describe('when invalid scheduleConfig in persisted state', () => {
      it('resets to empty array when not an array', () => {
        localStorage.setItem(
          'moveit-storage',
          JSON.stringify({ state: { scheduleConfig: 'invalid' } })
        );

        useAppStore.persist.rehydrate();

        expect(useAppStore.getState().scheduleConfig).toEqual([]);
      });
    });

    describe('partialize', () => {
      it('only persists specific fields', () => {
        useAppStore.setState({
          interval: 5000,
          scheduleEnabled: true,
          showTrayMessage: false,
          movementStatus: 'moving',
          modalContent: { title: <span>Test</span>, body: <span>Body</span> },
        });

        const persisted = JSON.parse(localStorage.getItem('moveit-storage') || '{}');

        expect(persisted.state).toHaveProperty('interval');
        expect(persisted.state).toHaveProperty('scheduleConfig');
        expect(persisted.state).toHaveProperty('scheduleEnabled');
        expect(persisted.state).toHaveProperty('showTrayMessage');
        expect(persisted.state).not.toHaveProperty('movementStatus');
        expect(persisted.state).not.toHaveProperty('modalContent');
      });
    });
  });
});
