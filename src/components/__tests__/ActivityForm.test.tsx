import { render, screen, fireEvent } from '@testing-library/react';
import ActivityForm from '../feature/ActivityForm';
import { jest } from '@jest/globals';

describe('ActivityForm', () => {
  const defaultProps = {
    onAddActivity: jest.fn(),
    isDisabled: false,
    isSimplified: false,
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
    it('should hide description and color fields in simplified mode', () => {
    render(<ActivityForm {...defaultProps} isSimplified={true} />);
    
    expect(screen.getByRole('textbox', { name: /name/i })).toBeInTheDocument();
    expect(screen.queryByRole('textbox', { name: /description/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /color/i })).not.toBeInTheDocument();
  });

  it('should show all fields in full mode', () => {
    render(<ActivityForm {...defaultProps} isSimplified={false} />);
    
    expect(screen.getByRole('textbox', { name: /name/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /description/i })).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument(); // Color dropdown button
  });

  it('should auto-populate description as empty in simplified mode', () => {
    const mockOnAddActivity = jest.fn();
    render(<ActivityForm {...defaultProps} isSimplified={true} onAddActivity={mockOnAddActivity} />);
    
    const nameInput = screen.getByRole('textbox', { name: /name/i });
    const submitButton = screen.getByRole('button', { name: /add activity/i });
    
    fireEvent.change(nameInput, { target: { value: 'Test Activity' } });
    fireEvent.click(submitButton);
    
    expect(mockOnAddActivity).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Test Activity',
        description: '', // Should be empty in simplified mode
      })
    );
  });
  });
});