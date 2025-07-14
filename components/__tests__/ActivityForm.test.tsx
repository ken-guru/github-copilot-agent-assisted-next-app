import { render, screen, fireEvent } from '@testing-library/react';
import ActivityForm from '../ActivityForm';
import { jest } from '@jest/globals';

describe('ActivityForm', () => {
  const defaultProps = {
    onAddActivity: jest.fn(),
    isDisabled: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders input and add button', () => {
    render(<ActivityForm {...defaultProps} />);
    expect(screen.getByRole('textbox')).toHaveAttribute('placeholder', 'New activity name');
    expect(screen.getByText('Add')).toBeInTheDocument();
  });

  it('shows "Time is up!" placeholder when disabled', () => {
    render(<ActivityForm {...defaultProps} isDisabled={true} />);
    expect(screen.getByRole('textbox')).toHaveAttribute('placeholder', 'Time is up!');
  });

  it('disables input and button when isDisabled is true', () => {
    render(<ActivityForm {...defaultProps} isDisabled={true} />);
    expect(screen.getByRole('textbox')).toBeDisabled();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('calls onAddActivity with trimmed input value when form is submitted', () => {
    render(<ActivityForm {...defaultProps} />);
    const input = screen.getByRole('textbox');
    const form = screen.getByRole('form');

    fireEvent.change(input, { target: { value: '  New Activity  ' } });
    fireEvent.submit(form);

    expect(defaultProps.onAddActivity).toHaveBeenCalledWith('New Activity');
  });

  it('clears input after successful submission', () => {
    render(<ActivityForm {...defaultProps} />);
    const input = screen.getByRole('textbox');
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
    const input = screen.getByRole('textbox');
    const form = screen.getByRole('form');

    fireEvent.change(input, { target: { value: 'New Activity' } });
    fireEvent.submit(form);

    expect(defaultProps.onAddActivity).not.toHaveBeenCalled();
  });
});