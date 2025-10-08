import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TimeSetup from '../TimeSetup';

describe('TimeSetup Deadline Mode', () => {
  const mockOnTimeSet = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should pass true for deadline mode when using deadline input', () => {
    render(<TimeSetup onTimeSet={mockOnTimeSet} />);
    
    // Switch to deadline mode
    const deadlineButton = screen.getByRole('button', { name: /set deadline/i });
    fireEvent.click(deadlineButton);
    
    // Set a deadline time (2 hours from now)
    const deadlineInput = screen.getByLabelText(/deadline time/i);
    const futureTime = new Date(Date.now() + 2 * 60 * 60 * 1000);
    const timeString = futureTime.toTimeString().slice(0, 5); // HH:MM format
    fireEvent.change(deadlineInput, { target: { value: timeString } });
    
    // Submit the form
    const submitButton = screen.getByRole('button', { name: /set time/i });
    fireEvent.click(submitButton);
    
    // Verify that onTimeSet was called with isDeadlineMode=true
    expect(mockOnTimeSet).toHaveBeenCalledWith(
      expect.any(Number),
      true // isDeadlineMode should be true
    );
  });

  it('should pass false for deadline mode when using duration input', () => {
    render(<TimeSetup onTimeSet={mockOnTimeSet} />);
    
    // Stay in duration mode (default)
    const hoursInput = screen.getByLabelText(/hours/i);
    fireEvent.change(hoursInput, { target: { value: '2' } });
    
    // Submit the form
    const submitButton = screen.getByRole('button', { name: /set time/i });
    fireEvent.click(submitButton);
    
    // Verify that onTimeSet was called with isDeadlineMode=false
    expect(mockOnTimeSet).toHaveBeenCalledWith(
      7200, // 2 hours in seconds
      false // isDeadlineMode should be false
    );
  });

  it('should calculate correct duration for deadline in the future', () => {
    render(<TimeSetup onTimeSet={mockOnTimeSet} />);
    
    // Switch to deadline mode
    const deadlineButton = screen.getByRole('button', { name: /set deadline/i });
    fireEvent.click(deadlineButton);
    
    // Get current time and calculate a deadline 2 hours in the future
    const now = new Date();
    const futureTime = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    const timeString = `${String(futureTime.getHours()).padStart(2, '0')}:${String(futureTime.getMinutes()).padStart(2, '0')}`;
    
    const deadlineInput = screen.getByLabelText(/deadline time/i);
    fireEvent.change(deadlineInput, { target: { value: timeString } });
    
    // Submit the form
    const submitButton = screen.getByRole('button', { name: /set time/i });
    fireEvent.click(submitButton);
    
    // Verify that onTimeSet was called with approximately 2 hours and isDeadlineMode=true
    expect(mockOnTimeSet).toHaveBeenCalled();
    const [duration, isDeadline] = mockOnTimeSet.mock.calls[0];
    expect(isDeadline).toBe(true);
    // Allow some tolerance (within 40 seconds of 2 hours to account for test execution time)
    expect(duration).toBeGreaterThan(7160); // Just under 2 hours
    expect(duration).toBeLessThan(7240); // Just over 2 hours
  });

  it('should handle deadline set for tomorrow if time is earlier than now', () => {
    render(<TimeSetup onTimeSet={mockOnTimeSet} />);
    
    // Switch to deadline mode
    const deadlineButton = screen.getByRole('button', { name: /set deadline/i });
    fireEvent.click(deadlineButton);
    
    // Get current time and set deadline to 1 hour ago (should be interpreted as tomorrow)
    const now = new Date();
    const pastTime = new Date(now.getTime() - 1 * 60 * 60 * 1000);
    const timeString = `${String(pastTime.getHours()).padStart(2, '0')}:${String(pastTime.getMinutes()).padStart(2, '0')}`;
    
    const deadlineInput = screen.getByLabelText(/deadline time/i);
    fireEvent.change(deadlineInput, { target: { value: timeString } });
    
    // Submit the form
    const submitButton = screen.getByRole('button', { name: /set time/i });
    fireEvent.click(submitButton);
    
    // Verify that onTimeSet was called with approximately 23 hours (tomorrow at that time) and isDeadlineMode=true
    expect(mockOnTimeSet).toHaveBeenCalled();
    const [duration, isDeadline] = mockOnTimeSet.mock.calls[0];
    expect(isDeadline).toBe(true);
    // Should be approximately 23 hours (82800 seconds), allow tolerance
    expect(duration).toBeGreaterThan(82700); // Just under 23 hours
    expect(duration).toBeLessThan(82900); // Just over 23 hours
  });
});
