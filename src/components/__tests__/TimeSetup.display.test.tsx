import { render, screen, fireEvent } from '@testing-library/react';
import TimeSetup from '../TimeSetup';

describe('TimeSetup Display Issues', () => {
  const mockOnTimeSet = jest.fn();

  beforeEach(() => {
    mockOnTimeSet.mockClear();
  });

  describe('Minutes Input Display Bug', () => {
    it('should display 0 in minutes input when user types 0', () => {
      render(<TimeSetup onTimeSet={mockOnTimeSet} />);
      
      const minutesInput = screen.getByLabelText('Minutes') as HTMLInputElement;
      
      // Initially should show 0 (new default)
      expect(minutesInput.value).toBe('0');
      
      // User types 0
      fireEvent.change(minutesInput, { target: { value: '0' } });
      
      // Should display 0, not revert to 1
      expect(minutesInput.value).toBe('0');
    });

    it('should allow zero values in all duration inputs', () => {
      render(<TimeSetup onTimeSet={mockOnTimeSet} />);
      
      const hoursInput = screen.getByLabelText('Hours') as HTMLInputElement;
      const minutesInput = screen.getByLabelText('Minutes') as HTMLInputElement;
      const secondsInput = screen.getByLabelText('Seconds') as HTMLInputElement;
      
      // Set all to zero
      fireEvent.change(hoursInput, { target: { value: '0' } });
      fireEvent.change(minutesInput, { target: { value: '0' } });
      fireEvent.change(secondsInput, { target: { value: '0' } });
      
      // All should display 0
      expect(hoursInput.value).toBe('0');
      expect(minutesInput.value).toBe('0');
      expect(secondsInput.value).toBe('0');
    });

    it('should submit with 0 duration when all inputs are 0', () => {
      render(<TimeSetup onTimeSet={mockOnTimeSet} />);
      
      // Set all to zero
      fireEvent.change(screen.getByLabelText('Hours'), { target: { value: '0' } });
      fireEvent.change(screen.getByLabelText('Minutes'), { target: { value: '0' } });
      fireEvent.change(screen.getByLabelText('Seconds'), { target: { value: '0' } });
      
      // Submit
      fireEvent.click(screen.getByRole('button', { name: 'Set Time' }));
      
      // Should call with 0 seconds
      expect(mockOnTimeSet).toHaveBeenCalledWith(0);
    });
  });
});
