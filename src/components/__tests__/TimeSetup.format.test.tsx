import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TimeSetup from '../TimeSetup';

describe('TimeSetup Input Format Consistency Tests', () => {
  // Mock onTimeSet function
  const mockOnTimeSet = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('time inputs correctly convert to duration values', () => {
    render(<TimeSetup onTimeSet={mockOnTimeSet} />);
    
    // Set time values
    const hoursInput = screen.getByLabelText(/hours/i);
    const minutesInput = screen.getByLabelText(/minutes/i);
    const secondsInput = screen.getByLabelText(/seconds/i);
    
    fireEvent.change(hoursInput, { target: { value: '0' } });
    fireEvent.change(minutesInput, { target: { value: '45' } });
    fireEvent.change(secondsInput, { target: { value: '0' } });
    
    // Submit the form to trigger onTimeSet
    const submitButton = screen.getByRole('button', { name: /set time/i });
    fireEvent.click(submitButton);
    
    // Check that onTimeSet was called with correct value (45 minutes = 2700 seconds) and false for deadline mode
    expect(mockOnTimeSet).toHaveBeenCalledWith(2700, false);
  });
  
  test('switching between duration and deadline modes preserves settings', () => {
    render(<TimeSetup onTimeSet={mockOnTimeSet} />);
    
    // Set initial time values
    const hoursInput = screen.getByLabelText(/hours/i);
    const minutesInput = screen.getByLabelText(/minutes/i);
    
    fireEvent.change(hoursInput, { target: { value: '1' } });
    fireEvent.change(minutesInput, { target: { value: '30' } });
    
    // Find and click the "Set Deadline" button to switch modes
    const deadlineButton = screen.getByRole('button', { name: /set deadline/i });
    fireEvent.click(deadlineButton);
    
    // Switch back to duration mode
    const durationButton = screen.getByRole('button', { name: /set duration/i });
    fireEvent.click(durationButton);
    
    // Verify time values are preserved
    expect(screen.getByLabelText(/hours/i)).toHaveValue(1);
    expect(screen.getByLabelText(/minutes/i)).toHaveValue(30);
  });
  
  test('handles long durations correctly', () => {
    render(<TimeSetup onTimeSet={mockOnTimeSet} />);
    
    // Set a long duration (8 hours 30 minutes)
    const hoursInput = screen.getByLabelText(/hours/i);
    const minutesInput = screen.getByLabelText(/minutes/i);
    
    fireEvent.change(hoursInput, { target: { value: '8' } });
    fireEvent.change(minutesInput, { target: { value: '30' } });
    
    // Submit the form
    const submitButton = screen.getByRole('button', { name: /set time/i });
    fireEvent.click(submitButton);
    
    // Check that onTimeSet was called with correct value (8h30m = 30600 seconds) and false for deadline mode
    expect(mockOnTimeSet).toHaveBeenCalledWith(30600, false);
  });
  
  test('handles very short durations correctly', () => {
    render(<TimeSetup onTimeSet={mockOnTimeSet} />);
    
    // Set a very short duration (1 minute)
    const minutesInput = screen.getByLabelText(/minutes/i);
    const hoursInput = screen.getByLabelText(/hours/i);
    const secondsInput = screen.getByLabelText(/seconds/i);
    
    fireEvent.change(hoursInput, { target: { value: '0' } });
    fireEvent.change(minutesInput, { target: { value: '1' } });
    fireEvent.change(secondsInput, { target: { value: '0' } });
    
    // Submit the form
    const submitButton = screen.getByRole('button', { name: /set time/i });
    fireEvent.click(submitButton);
    
    // Check that onTimeSet was called with correct value (1 minute = 60 seconds) and false for deadline mode
    expect(mockOnTimeSet).toHaveBeenCalledWith(60, false);
  });
  
  test('handles input validation constraints', () => {
    render(<TimeSetup onTimeSet={mockOnTimeSet} />);
    
    // Check that validation constraints are in place
    const hoursInput = screen.getByLabelText(/hours/i);
    const minutesInput = screen.getByLabelText(/minutes/i);
    const secondsInput = screen.getByLabelText(/seconds/i);
    
    // Hours should be non-negative
    expect(hoursInput).toHaveAttribute('min', '0');
    
    // Minutes and seconds should be between 0 and 59
    expect(minutesInput).toHaveAttribute('min', '0');
    expect(minutesInput).toHaveAttribute('max', '59');
    expect(secondsInput).toHaveAttribute('min', '0');
    expect(secondsInput).toHaveAttribute('max', '59');
  });
  
  test('seconds input affects total duration calculation', () => {
    render(<TimeSetup onTimeSet={mockOnTimeSet} />);
    
    // Set values with seconds
    const hoursInput = screen.getByLabelText(/hours/i);
    const minutesInput = screen.getByLabelText(/minutes/i);
    const secondsInput = screen.getByLabelText(/seconds/i);
    
    fireEvent.change(hoursInput, { target: { value: '0' } });
    fireEvent.change(minutesInput, { target: { value: '0' } });
    fireEvent.change(secondsInput, { target: { value: '30' } });
    
    // Submit the form
    const submitButton = screen.getByRole('button', { name: /set time/i });
    fireEvent.click(submitButton);
    
    // Check that onTimeSet was called with correct value (30 seconds) and false for deadline mode
    expect(mockOnTimeSet).toHaveBeenCalledWith(30, false);
  });
});
