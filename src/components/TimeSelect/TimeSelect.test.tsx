import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import TimeSelect from './TimeSelect';
import { messages } from '@/i18n/config';
import React from 'react';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <IntlProvider locale="en" messages={messages.en}>
    {children}
  </IntlProvider>
);

describe('TimeSelect', () => {
  describe('when component renders with a time value', () => {
    it('displays correct hour and minute selected', () => {
      render(<TimeSelect value="09:30" onChange={vi.fn()} ariaLabelPrefix="Start time" />, { wrapper });

      const hourSelect = screen.getByLabelText(`Start time ${messages.en['time.hours']}`);
      const minuteSelect = screen.getByLabelText(`Start time ${messages.en['time.minutes']}`);

      expect(hourSelect).toHaveValue('09');
      expect(minuteSelect).toHaveValue('30');
    });

    it('renders all 24 hour options', () => {
      render(<TimeSelect value="00:00" onChange={vi.fn()} ariaLabelPrefix="Start time" />, { wrapper });

      const hourSelect = screen.getByLabelText(`Start time ${messages.en['time.hours']}`);
      const options = hourSelect.querySelectorAll('option');

      expect(options).toHaveLength(24);
      expect(options[0]).toHaveValue('00');
      expect(options[23]).toHaveValue('23');
    });

    it('renders all 60 minute options', () => {
      render(<TimeSelect value="00:00" onChange={vi.fn()} ariaLabelPrefix="Start time" />, { wrapper });

      const minuteSelect = screen.getByLabelText(`Start time ${messages.en['time.minutes']}`);
      const options = minuteSelect.querySelectorAll('option');

      expect(options).toHaveLength(60);
      expect(options[0]).toHaveValue('00');
      expect(options[59]).toHaveValue('59');
    });
  });

  describe('when hour is changed', () => {
    it('calls onChange with new HH:MM format', () => {
      const onChangeMock = vi.fn();
      render(<TimeSelect value="09:30" onChange={onChangeMock} ariaLabelPrefix="Start time" />, { wrapper });

      const hourSelect = screen.getByLabelText(`Start time ${messages.en['time.hours']}`);
      fireEvent.change(hourSelect, { target: { value: '14' } });

      expect(onChangeMock).toHaveBeenCalledWith('14:30');
    });
  });

  describe('when minute is changed', () => {
    it('calls onChange with new HH:MM format', () => {
      const onChangeMock = vi.fn();
      render(<TimeSelect value="09:30" onChange={onChangeMock} ariaLabelPrefix="Start time" />, { wrapper });

      const minuteSelect = screen.getByLabelText(`Start time ${messages.en['time.minutes']}`);
      fireEvent.change(minuteSelect, { target: { value: '45' } });

      expect(onChangeMock).toHaveBeenCalledWith('09:45');
    });
  });

  describe('when time is at edge values', () => {
    it('handles midnight 00:00', () => {
      render(<TimeSelect value="00:00" onChange={vi.fn()} ariaLabelPrefix="Start time" />, { wrapper });

      const hourSelect = screen.getByLabelText(`Start time ${messages.en['time.hours']}`);
      const minuteSelect = screen.getByLabelText(`Start time ${messages.en['time.minutes']}`);

      expect(hourSelect).toHaveValue('00');
      expect(minuteSelect).toHaveValue('00');
    });

    it('handles 23:59', () => {
      render(<TimeSelect value="23:59" onChange={vi.fn()} ariaLabelPrefix="Start time" />, { wrapper });

      const hourSelect = screen.getByLabelText(`Start time ${messages.en['time.hours']}`);
      const minuteSelect = screen.getByLabelText(`Start time ${messages.en['time.minutes']}`);

      expect(hourSelect).toHaveValue('23');
      expect(minuteSelect).toHaveValue('59');
    });
  });

  describe('when different aria label prefix is provided', () => {
    it('uses correct prefix for accessibility', () => {
      render(<TimeSelect value="12:00" onChange={vi.fn()} ariaLabelPrefix="End time" />, { wrapper });

      expect(screen.getByLabelText(`End time ${messages.en['time.hours']}`)).toBeInTheDocument();
      expect(screen.getByLabelText(`End time ${messages.en['time.minutes']}`)).toBeInTheDocument();
    });
  });
});
