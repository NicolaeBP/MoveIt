import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import ScheduleToggle from './ScheduleToggle';
import { messages } from '@/i18n/config';

describe('ScheduleToggle', () => {
  describe('when component renders', () => {
    it('displays schedule label', () => {
      render(
        <IntlProvider locale="en" messages={messages.en}>
          <ScheduleToggle enabled={false} isRunning={false} onToggle={vi.fn()} />
        </IntlProvider>
      );

      expect(screen.getByText(messages.en['schedule.title'])).toBeInTheDocument();
    });

    it('displays toggle switch', () => {
      render(
        <IntlProvider locale="en" messages={messages.en}>
          <ScheduleToggle enabled={false} isRunning={false} onToggle={vi.fn()} />
        </IntlProvider>
      );

      const toggle = screen.getByRole('switch');

      expect(toggle).toBeInTheDocument();
      expect(toggle).toHaveAttribute('aria-label', messages.en['schedule.toggle']);
    });
  });

  describe('when enabled is true', () => {
    it('marks toggle as checked', () => {
      render(
        <IntlProvider locale="en" messages={messages.en}>
          <ScheduleToggle enabled={true} isRunning={false} onToggle={vi.fn()} />
        </IntlProvider>
      );

      const toggle = screen.getByRole('switch');

      expect(toggle).toHaveAttribute('aria-checked', 'true');
    });
  });

  describe('when enabled is false', () => {
    it('marks toggle as unchecked', () => {
      render(
        <IntlProvider locale="en" messages={messages.en}>
          <ScheduleToggle enabled={false} isRunning={false} onToggle={vi.fn()} />
        </IntlProvider>
      );

      const toggle = screen.getByRole('switch');

      expect(toggle).toHaveAttribute('aria-checked', 'false');
    });
  });

  describe('when isRunning is true', () => {
    it('disables the toggle', () => {
      render(
        <IntlProvider locale="en" messages={messages.en}>
          <ScheduleToggle enabled={false} isRunning={true} onToggle={vi.fn()} />
        </IntlProvider>
      );

      const toggle = screen.getByRole('switch');

      expect(toggle).toBeDisabled();
    });
  });

  describe('when toggle is clicked', () => {
    it('calls onToggle callback', () => {
      const onToggleMock = vi.fn();

      render(
        <IntlProvider locale="en" messages={messages.en}>
          <ScheduleToggle enabled={false} isRunning={false} onToggle={onToggleMock} />
        </IntlProvider>
      );

      const toggle = screen.getByRole('switch');

      toggle.click();

      expect(onToggleMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('when isRunning is true and toggle is clicked', () => {
    it('does not call onToggle callback', () => {
      const onToggleMock = vi.fn();

      render(
        <IntlProvider locale="en" messages={messages.en}>
          <ScheduleToggle enabled={false} isRunning={true} onToggle={onToggleMock} />
        </IntlProvider>
      );

      const toggle = screen.getByRole('switch');

      toggle.click();

      expect(onToggleMock).not.toHaveBeenCalled();
    });
  });
});
