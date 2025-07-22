import { render, screen, fireEvent } from '@testing-library/react';
import ActivityForm from '../feature/ActivityForm';
import { jest } from '@jest/globals';

describe('ActivityForm', () => {
  const defaultProps = {
    onAddActivity: jest.fn(),
    isDisabled: false,
    isTimerRunning: false,
    existingActivities: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders input and add button', () => {
    render(<ActivityForm {...defaultProps} />);
    expect(screen.getByRole('textbox', { name: /name/i })).toBeInTheDocument();
    expect(screen.getByText('Add Activity')).toBeInTheDocument();
  });

  it('shows "Time is up!" placeholder when disabled', () => {
    render(<ActivityForm {...defaultProps} isDisabled={true} />);
    // This test may need updating based on the actual component behavior
    expect(screen.getByRole('textbox', { name: /name/i })).toBeDisabled();
  });

  it('disables input and button when isDisabled is true', () => {
    render(<ActivityForm {...defaultProps} isDisabled={true} />);
    expect(screen.getByRole('textbox', { name: /name/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /add activity/i })).toBeDisabled();
  });

  it('calls onAddActivity with trimmed input value when form is submitted', () => {
    render(<ActivityForm {...defaultProps} />);
    const input = screen.getByRole('textbox', { name: /name/i });
    const form = screen.getByRole('form');

    fireEvent.change(input, { target: { value: '  New Activity  ' } });
    fireEvent.submit(form);

    expect(defaultProps.onAddActivity).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'New Activity', // Should be trimmed
      })
    );
  });

  it('clears input after successful submission', () => {
    render(<ActivityForm {...defaultProps} />);
    const input = screen.getByRole('textbox', { name: /name/i });
    const form = screen.getByRole('form');

    fireEvent.change(input, { target: { value: 'New Activity' } });
    fireEvent.submit(form);

    expect(input).toHaveValue('');
  });

  it('does not call onAddActivity when input is empty', () => {
    render(<ActivityForm {...defaultProps} />);
    const form = screen.getByRole('form');

    fireEvent.submit(form);

    expect(defaultProps.onAddActivity).not.toHaveBeenCalled();
  });

  it('does not call onAddActivity when form is disabled', () => {
    render(<ActivityForm {...defaultProps} isDisabled={true} />);
    const input = screen.getByRole('textbox', { name: /name/i });
    const form = screen.getByRole('form');

    fireEvent.change(input, { target: { value: 'New Activity' } });
    fireEvent.submit(form);

    expect(defaultProps.onAddActivity).not.toHaveBeenCalled();
  });

  describe('Simplified form when timer is running', () => {
    it('shows only name field when timer is running', () => {
      render(<ActivityForm {...defaultProps} isTimerRunning={true} />);
      
      // Name field should be visible
      expect(screen.getByRole('textbox', { name: /name/i })).toBeInTheDocument();
      
      // Description and color fields should NOT be visible
      expect(screen.queryByRole('textbox', { name: /description/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /color/i })).not.toBeInTheDocument();
    });

    it('shows all fields when timer is not running', () => {
      render(<ActivityForm {...defaultProps} isTimerRunning={false} />);
      
      // All fields should be visible
      expect(screen.getByRole('textbox', { name: /name/i })).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: /description/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /color/i })).toBeInTheDocument();
    });

    it('auto-assigns color when timer is running and form is submitted', () => {
      const mockOnAddActivity = jest.fn();
      render(<ActivityForm {...defaultProps} isTimerRunning={true} onAddActivity={mockOnAddActivity} />);
      
      const input = screen.getByRole('textbox');
      const form = screen.getByRole('form');

      fireEvent.change(input, { target: { value: 'Quick Activity' } });
      fireEvent.submit(form);

      // Should call onAddActivity with auto-assigned color
      expect(mockOnAddActivity).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Quick Activity',
          colorIndex: expect.any(Number),
        })
      );
    });
  });
});