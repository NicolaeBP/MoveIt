import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import TimeSettings from './TimeSettings';
import { useAppStore } from '@/store/useAppStore';
import { MS_PER_MINUTE, MS_PER_SECOND } from '@/constants/timeConstants';
import { messages } from '@/i18n/config';
import React from 'react';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <IntlProvider locale="en" messages={messages.en}>
    {children}
  </IntlProvider>
);

describe('TimeSettings', () => {
  beforeEach(() => {
    useAppStore.setState({
      interval: 5 * MS_PER_MINUTE,
      setInterval: vi.fn(),
      movementStatus: 'stopped',
    });
  });

  describe('when component renders', () => {
    it('displays label and input field', () => {
      render(<TimeSettings />, { wrapper });

      expect(screen.getByText(messages.en['timeSettings.label'])).toBeInTheDocument();
      expect(screen.getByPlaceholderText(messages.en['timeSettings.placeholder'])).toBeInTheDocument();
    });

    it('displays examples text', () => {
      render(<TimeSettings />, { wrapper });

      expect(screen.getByText(messages.en['timeSettings.examples'])).toBeInTheDocument();
    });

    it('displays current interval in minutes format', () => {
      render(<TimeSettings />, { wrapper });

      const input = screen.getByPlaceholderText(messages.en['timeSettings.placeholder']) as HTMLInputElement;

      expect(input.value).toBe('5m');
    });
  });

  describe('when interval is in seconds', () => {
    it('displays interval in seconds format', () => {
      useAppStore.setState({ interval: 30 * MS_PER_SECOND });

      render(<TimeSettings />, { wrapper });

      const input = screen.getByPlaceholderText(messages.en['timeSettings.placeholder']) as HTMLInputElement;

      expect(input.value).toBe('30s');
    });
  });

  describe('when movement is running', () => {
    it('disables the input field', () => {
      useAppStore.setState({ movementStatus: 'moving' });

      render(<TimeSettings />, { wrapper });

      const input = screen.getByPlaceholderText(messages.en['timeSettings.placeholder']);

      expect(input).toBeDisabled();
    });
  });

  describe('when valid time in minutes is entered', () => {
    it('calls setInterval with correct milliseconds', () => {
      const setIntervalMock = vi.fn();
      useAppStore.setState({ setInterval: setIntervalMock });

      render(<TimeSettings />, { wrapper });

      const input = screen.getByPlaceholderText(messages.en['timeSettings.placeholder']);

      fireEvent.change(input, { target: { value: '10m' } });

      expect(setIntervalMock).toHaveBeenCalledWith(10 * MS_PER_MINUTE);
    });
  });

  describe('when valid time in seconds is entered', () => {
    it('calls setInterval with correct milliseconds', () => {
      const setIntervalMock = vi.fn();
      useAppStore.setState({ setInterval: setIntervalMock });

      render(<TimeSettings />, { wrapper });

      const input = screen.getByPlaceholderText(messages.en['timeSettings.placeholder']);

      fireEvent.change(input, { target: { value: '45s' } });

      expect(setIntervalMock).toHaveBeenCalledWith(45 * MS_PER_SECOND);
    });
  });

  describe('when input is cleared', () => {
    it('calls setInterval with 0', () => {
      const setIntervalMock = vi.fn();
      useAppStore.setState({ setInterval: setIntervalMock });

      render(<TimeSettings />, { wrapper });

      const input = screen.getByPlaceholderText(messages.en['timeSettings.placeholder']);

      fireEvent.change(input, { target: { value: '' } });

      expect(setIntervalMock).toHaveBeenCalledWith(0);
    });
  });

  describe('when input loses focus with invalid value', () => {
    it('resets to previous valid interval', () => {
      useAppStore.setState({ interval: 5 * MS_PER_MINUTE });

      render(<TimeSettings />, { wrapper });

      const input = screen.getByPlaceholderText(messages.en['timeSettings.placeholder']) as HTMLInputElement;

      fireEvent.change(input, { target: { value: 'invalid' } });
      fireEvent.blur(input);

      expect(input.value).toBe('5m');
    });
  });

  describe('when interval is 0', () => {
    it('applies error styling', () => {
      useAppStore.setState({ interval: 0 });

      render(<TimeSettings />, { wrapper });

      const input = screen.getByPlaceholderText(messages.en['timeSettings.placeholder']);

      expect(input).toHaveClass('border-red-500');
    });
  });

  describe('when value exceeds maximum', () => {
    it('resets to current interval on change', () => {
      useAppStore.setState({ interval: 5 * MS_PER_MINUTE });

      render(<TimeSettings />, { wrapper });

      const input = screen.getByPlaceholderText(messages.en['timeSettings.placeholder']) as HTMLInputElement;

      fireEvent.change(input, { target: { value: '10000m' } });

      expect(input.value).toBe('5m');
    });
  });
});
