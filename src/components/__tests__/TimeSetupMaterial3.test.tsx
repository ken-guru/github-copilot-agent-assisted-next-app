import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TimeSetupMaterial3 from '../TimeSetupMaterial3';

// Mock the client-side check to avoid hydration issues in tests
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useEffect: (fn: () => void, deps: any[]) => {
    if (deps && deps.length === 0) {
      // Simulate client-side mounting
      fn();
    }
  },
}));

describe('TimeSetupMaterial3', () => {
  const mockOnTimeSet = jest.fn();

  beforeEach(() => {
    mockOnTimeSet.mockClear();
    // Mock current time for consistent testing
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-15 10:00:00'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Basic Rendering', () => {
    it('renders with duration mode by default', () => {
      render(<TimeSetupMaterial3 onTimeSet={mockOnTimeSet} />);
      
      expect(screen.getByTestId('time-setup-material3')).toBeInTheDocument();
      expect(screen.getByText('Set Time')).toBeInTheDocument();
      expect(screen.getByTestId('duration-mode-button')).toBeInTheDocument();
      expect(screen.getByTestId('deadline-mode-button')).toBeInTheDocument();
      expect(screen.getByTestId('duration-inputs')).toBeInTheDocument();
      expect(screen.getByTestId('set-time-button')).toBeInTheDocument();
    });

    it('shows duration inputs in duration mode', () => {
      render(<TimeSetupMaterial3 onTimeSet={mockOnTimeSet} />);
      
      expect(screen.getByTestId('hours-input')).toBeInTheDocument();
      expect(screen.getByTestId('minutes-input')).toBeInTheDocument();
      expect(screen.getByTestId('seconds-input')).toBeInTheDocument();
      expect(screen.getByLabelText('Hours')).toBeInTheDocument();
      expect(screen.getByLabelText('Minutes')).toBeInTheDocument();
      expect(screen.getByLabelText('Seconds')).toBeInTheDocument();
    });

    it('switches to deadline mode correctly', async () => {
      const user = userEvent.setup();
      render(<TimeSetupMaterial3 onTimeSet={mockOnTimeSet} />);
      
      const deadlineButton = screen.getByTestId('deadline-mode-button');
      await user.click(deadlineButton);
      
      expect(screen.getByTestId('deadline-input-group')).toBeInTheDocument();
      expect(screen.getByTestId('deadline-input')).toBeInTheDocument();
      expect(screen.getByLabelText('Deadline Time')).toBeInTheDocument();
      expect(screen.queryByTestId('duration-inputs')).not.toBeInTheDocument();
    });
  });

  describe('Duration Mode', () => {
    it('handles duration input correctly', async () => {
      const user = userEvent.setup();
      render(<TimeSetupMaterial3 onTimeSet={mockOnTimeSet} />);
      
      const hoursInput = screen.getByTestId('hours-input');
      const minutesInput = screen.getByTestId('minutes-input');
      const secondsInput = screen.getByTestId('seconds-input');
      
      await user.clear(hoursInput);
      await user.type(hoursInput, '1');
      await user.clear(minutesInput);
      await user.type(minutesInput, '30');
      await user.clear(secondsInput);
      await user.type(secondsInput, '45');
      
      expect(hoursInput).toHaveValue('1');
      expect(minutesInput).toHaveValue('30');
      expect(secondsInput).toHaveValue('45');
    });

    it('submits duration correctly', async () => {
      const user = userEvent.setup();
      render(<TimeSetupMaterial3 onTimeSet={mockOnTimeSet} />);
      
      const hoursInput = screen.getByTestId('hours-input');
      const minutesInput = screen.getByTestId('minutes-input');
      const secondsInput = screen.getByTestId('seconds-input');
      const submitButton = screen.getByTestId('set-time-button');
      
      await user.clear(hoursInput);
      await user.type(hoursInput, '2');
      await user.clear(minutesInput);
      await user.type(minutesInput, '15');
      await user.clear(secondsInput);
      await user.type(secondsInput, '30');
      
      await user.click(submitButton);
      
      // 2 hours + 15 minutes + 30 seconds = 8130 seconds
      expect(mockOnTimeSet).toHaveBeenCalledWith(8130);
    });

    it('validates hours input range', async () => {
      const user = userEvent.setup();
      render(<TimeSetupMaterial3 onTimeSet={mockOnTimeSet} />);
      
      const hoursInput = screen.getByTestId('hours-input');
      const submitButton = screen.getByTestId('set-time-button');
      
      await user.clear(hoursInput);
      await user.type(hoursInput, '25'); // Invalid: > 23
      await user.click(submitButton);
      
      expect(screen.getByText('Hours must be between 0 and 23')).toBeInTheDocument();
      expect(mockOnTimeSet).not.toHaveBeenCalled();
    });

    it('validates minutes input range', async () => {
      const user = userEvent.setup();
      render(<TimeSetupMaterial3 onTimeSet={mockOnTimeSet} />);
      
      const minutesInput = screen.getByTestId('minutes-input');
      const submitButton = screen.getByTestId('set-time-button');
      
      await user.clear(minutesInput);
      await user.type(minutesInput, '65'); // Invalid: > 59
      await user.click(submitButton);
      
      expect(screen.getByText('Minutes must be between 0 and 59')).toBeInTheDocument();
      expect(mockOnTimeSet).not.toHaveBeenCalled();
    });

    it('validates seconds input range', async () => {
      const user = userEvent.setup();
      render(<TimeSetupMaterial3 onTimeSet={mockOnTimeSet} />);
      
      const secondsInput = screen.getByTestId('seconds-input');
      const submitButton = screen.getByTestId('set-time-button');
      
      await user.clear(secondsInput);
      await user.type(secondsInput, '70'); // Invalid: > 59
      await user.click(submitButton);
      
      expect(screen.getByText('Seconds must be between 0 and 59')).toBeInTheDocument();
      expect(mockOnTimeSet).not.toHaveBeenCalled();
    });

    it('validates that duration is greater than 0', async () => {
      const user = userEvent.setup();
      render(<TimeSetupMaterial3 onTimeSet={mockOnTimeSet} />);
      
      const submitButton = screen.getByTestId('set-time-button');
      
      // All inputs are 0 by default
      await user.click(submitButton);
      
      expect(screen.getByText('Please set a duration greater than 0')).toBeInTheDocument();
      expect(mockOnTimeSet).not.toHaveBeenCalled();
    });

    it('clears errors when user corrects input', async () => {
      const user = userEvent.setup();
      render(<TimeSetupMaterial3 onTimeSet={mockOnTimeSet} />);
      
      const hoursInput = screen.getByTestId('hours-input');
      const submitButton = screen.getByTestId('set-time-button');
      
      // First create an error
      await user.clear(hoursInput);
      await user.type(hoursInput, '25');
      await user.click(submitButton);
      
      expect(screen.getByText('Hours must be between 0 and 23')).toBeInTheDocument();
      
      // Then correct the input
      await user.clear(hoursInput);
      await user.type(hoursInput, '2');
      
      await waitFor(() => {
        expect(screen.queryByText('Hours must be between 0 and 23')).not.toBeInTheDocument();
      });
    });
  });

  describe('Deadline Mode', () => {
    it('handles deadline input correctly', async () => {
      const user = userEvent.setup();
      render(<TimeSetupMaterial3 onTimeSet={mockOnTimeSet} />);
      
      const deadlineButton = screen.getByTestId('deadline-mode-button');
      await user.click(deadlineButton);
      
      const deadlineInput = screen.getByTestId('deadline-input');
      await user.type(deadlineInput, '14:30');
      
      expect(deadlineInput).toHaveValue('14:30');
    });

    it('submits deadline correctly for same day', async () => {
      const user = userEvent.setup();
      render(<TimeSetupMaterial3 onTimeSet={mockOnTimeSet} />);
      
      const deadlineButton = screen.getByTestId('deadline-mode-button');
      await user.click(deadlineButton);
      
      const deadlineInput = screen.getByTestId('deadline-input');
      const submitButton = screen.getByTestId('set-time-button');
      
      // Set deadline to 14:30 (current time is 10:00)
      await user.type(deadlineInput, '14:30');
      await user.click(submitButton);
      
      // Should be 4.5 hours = 16200 seconds
      expect(mockOnTimeSet).toHaveBeenCalledWith(16200);
    });

    it('submits deadline correctly for next day', async () => {
      const user = userEvent.setup();
      render(<TimeSetupMaterial3 onTimeSet={mockOnTimeSet} />);
      
      const deadlineButton = screen.getByTestId('deadline-mode-button');
      await user.click(deadlineButton);
      
      const deadlineInput = screen.getByTestId('deadline-input');
      const submitButton = screen.getByTestId('set-time-button');
      
      // Set deadline to 08:00 (earlier than current time 10:00, so next day)
      await user.type(deadlineInput, '08:00');
      await user.click(submitButton);
      
      // Should be 22 hours = 79200 seconds (until 8 AM tomorrow)
      expect(mockOnTimeSet).toHaveBeenCalledWith(79200);
    });

    it('validates that deadline time is provided', async () => {
      const user = userEvent.setup();
      render(<TimeSetupMaterial3 onTimeSet={mockOnTimeSet} />);
      
      const deadlineButton = screen.getByTestId('deadline-mode-button');
      await user.click(deadlineButton);
      
      const submitButton = screen.getByTestId('set-time-button');
      await user.click(submitButton);
      
      expect(screen.getByText('Please select a deadline time')).toBeInTheDocument();
      expect(mockOnTimeSet).not.toHaveBeenCalled();
    });

    it('shows helper text for deadline input', async () => {
      const user = userEvent.setup();
      render(<TimeSetupMaterial3 onTimeSet={mockOnTimeSet} />);
      
      const deadlineButton = screen.getByTestId('deadline-mode-button');
      await user.click(deadlineButton);
      
      expect(screen.getByText('Select a time for today or tomorrow')).toBeInTheDocument();
    });

    it('clears deadline errors when user provides input', async () => {
      const user = userEvent.setup();
      render(<TimeSetupMaterial3 onTimeSet={mockOnTimeSet} />);
      
      const deadlineButton = screen.getByTestId('deadline-mode-button');
      await user.click(deadlineButton);
      
      const deadlineInput = screen.getByTestId('deadline-input');
      const submitButton = screen.getByTestId('set-time-button');
      
      // First create an error
      await user.click(submitButton);
      expect(screen.getByText('Please select a deadline time')).toBeInTheDocument();
      
      // Then provide input
      await user.type(deadlineInput, '15:00');
      
      await waitFor(() => {
        expect(screen.queryByText('Please select a deadline time')).not.toBeInTheDocument();
      });
    });
  });

  describe('Mode Switching', () => {
    it('switches between modes correctly', async () => {
      const user = userEvent.setup();
      render(<TimeSetupMaterial3 onTimeSet={mockOnTimeSet} />);
      
      // Start in duration mode
      expect(screen.getByTestId('duration-inputs')).toBeInTheDocument();
      expect(screen.queryByTestId('deadline-input-group')).not.toBeInTheDocument();
      
      // Switch to deadline mode
      const deadlineButton = screen.getByTestId('deadline-mode-button');
      await user.click(deadlineButton);
      
      expect(screen.queryByTestId('duration-inputs')).not.toBeInTheDocument();
      expect(screen.getByTestId('deadline-input-group')).toBeInTheDocument();
      
      // Switch back to duration mode
      const durationButton = screen.getByTestId('duration-mode-button');
      await user.click(durationButton);
      
      expect(screen.getByTestId('duration-inputs')).toBeInTheDocument();
      expect(screen.queryByTestId('deadline-input-group')).not.toBeInTheDocument();
    });

    it('preserves input values when switching modes', async () => {
      const user = userEvent.setup();
      render(<TimeSetupMaterial3 onTimeSet={mockOnTimeSet} />);
      
      // Set duration values
      const hoursInput = screen.getByTestId('hours-input');
      await user.clear(hoursInput);
      await user.type(hoursInput, '2');
      
      // Switch to deadline mode
      const deadlineButton = screen.getByTestId('deadline-mode-button');
      await user.click(deadlineButton);
      
      const deadlineInput = screen.getByTestId('deadline-input');
      await user.type(deadlineInput, '15:30');
      
      // Switch back to duration mode
      const durationButton = screen.getByTestId('duration-mode-button');
      await user.click(durationButton);
      
      // Duration values should be preserved
      expect(screen.getByTestId('hours-input')).toHaveValue('2');
      
      // Switch back to deadline mode
      await user.click(deadlineButton);
      
      // Deadline value should be preserved
      expect(screen.getByTestId('deadline-input')).toHaveValue('15:30');
    });
  });

  describe('Form Submission', () => {
    it('submits form on Enter key in duration mode', async () => {
      const user = userEvent.setup();
      render(<TimeSetupMaterial3 onTimeSet={mockOnTimeSet} />);
      
      const hoursInput = screen.getByTestId('hours-input');
      await user.clear(hoursInput);
      await user.type(hoursInput, '1');
      await user.keyboard('{Enter}');
      
      expect(mockOnTimeSet).toHaveBeenCalledWith(3600); // 1 hour
    });

    it('submits form on Enter key in deadline mode', async () => {
      const user = userEvent.setup();
      render(<TimeSetupMaterial3 onTimeSet={mockOnTimeSet} />);
      
      const deadlineButton = screen.getByTestId('deadline-mode-button');
      await user.click(deadlineButton);
      
      const deadlineInput = screen.getByTestId('deadline-input');
      await user.type(deadlineInput, '12:00');
      await user.keyboard('{Enter}');
      
      expect(mockOnTimeSet).toHaveBeenCalledWith(7200); // 2 hours
    });
  });

  describe('Accessibility', () => {
    it('has proper form structure and labels', () => {
      render(<TimeSetupMaterial3 onTimeSet={mockOnTimeSet} />);
      
      const form = screen.getByTestId('time-setup-form');
      expect(form.tagName).toBe('FORM');
      
      expect(screen.getByLabelText('Hours')).toBeInTheDocument();
      expect(screen.getByLabelText('Minutes')).toBeInTheDocument();
      expect(screen.getByLabelText('Seconds')).toBeInTheDocument();
      
      const submitButton = screen.getByTestId('set-time-button');
      expect(submitButton).toHaveAttribute('type', 'submit');
    });

    it('announces errors to screen readers', async () => {
      const user = userEvent.setup();
      render(<TimeSetupMaterial3 onTimeSet={mockOnTimeSet} />);
      
      const submitButton = screen.getByTestId('set-time-button');
      await user.click(submitButton);
      
      const errorMessage = screen.getByText('Please set a duration greater than 0');
      expect(errorMessage).toHaveAttribute('role', 'alert');
    });

    it('maintains proper focus order', async () => {
      const user = userEvent.setup();
      render(<TimeSetupMaterial3 onTimeSet={mockOnTimeSet} />);
      
      const hoursInput = screen.getByTestId('hours-input');
      const minutesInput = screen.getByTestId('minutes-input');
      const secondsInput = screen.getByTestId('seconds-input');
      const submitButton = screen.getByTestId('set-time-button');
      
      hoursInput.focus();
      expect(hoursInput).toHaveFocus();
      
      await user.tab();
      expect(minutesInput).toHaveFocus();
      
      await user.tab();
      expect(secondsInput).toHaveFocus();
      
      await user.tab();
      expect(submitButton).toHaveFocus();
    });
  });

  describe('Material 3 Integration', () => {
    it('uses Material 3 components correctly', () => {
      render(<TimeSetupMaterial3 onTimeSet={mockOnTimeSet} />);
      
      // Check Material 3 TextField usage
      const hoursInput = screen.getByTestId('hours-input');
      expect(hoursInput.closest('.textField')).toBeInTheDocument();
      
      // Check Material 3 Button usage
      const submitButton = screen.getByTestId('set-time-button');
      expect(submitButton.closest('.button')).toBeInTheDocument();
      
      // Check Material 3 FormGroup usage
      const durationInputs = screen.getByTestId('duration-inputs');
      expect(durationInputs).toHaveClass('row');
    });

    it('applies error styling correctly', async () => {
      const user = userEvent.setup();
      render(<TimeSetupMaterial3 onTimeSet={mockOnTimeSet} />);
      
      const hoursInput = screen.getByTestId('hours-input');
      const submitButton = screen.getByTestId('set-time-button');
      
      await user.clear(hoursInput);
      await user.type(hoursInput, '25');
      await user.click(submitButton);
      
      expect(hoursInput.closest('.textField')).toHaveClass('error');
    });
  });

  describe('Edge Cases', () => {
    it('handles negative input values', async () => {
      const user = userEvent.setup();
      render(<TimeSetupMaterial3 onTimeSet={mockOnTimeSet} />);
      
      const hoursInput = screen.getByTestId('hours-input');
      
      await user.clear(hoursInput);
      await user.type(hoursInput, '-5');
      
      // Should be clamped to 0
      expect(hoursInput).toHaveValue('0');
    });

    it('handles non-numeric input', async () => {
      const user = userEvent.setup();
      render(<TimeSetupMaterial3 onTimeSet={mockOnTimeSet} />);
      
      const hoursInput = screen.getByTestId('hours-input');
      
      await user.clear(hoursInput);
      await user.type(hoursInput, 'abc');
      
      // Should default to 0 for invalid input
      expect(hoursInput).toHaveValue('0');
    });

    it('handles very large input values', async () => {
      const user = userEvent.setup();
      render(<TimeSetupMaterial3 onTimeSet={mockOnTimeSet} />);
      
      const hoursInput = screen.getByTestId('hours-input');
      
      await user.clear(hoursInput);
      await user.type(hoursInput, '999');
      
      // Should be clamped to maximum (23)
      expect(hoursInput).toHaveValue('23');
    });
  });
});