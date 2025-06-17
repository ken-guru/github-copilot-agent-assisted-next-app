import { render, screen, fireEvent } from '@testing-library/react';
import { ActivityButton } from '@components/ui/ActivityButton';
import type { ActivityButtonProps } from '@components/ui/ActivityButton';
import { jest } from '@jest/globals';

describe('ActivityButton', () => {
  const mockActivity = {
    id: 'activity1',
    name: 'Test Activity',
  };

  const defaultProps: ActivityButtonProps = {
    activity: mockActivity,
    isCompleted: false,
    isActive: false,
    onClick: jest.fn(),
    onRemove: jest.fn(),
    disabled: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders activity name', () => {
    render(<ActivityButton {...defaultProps} />);
    expect(screen.getByText('Test Activity')).toBeInTheDocument();
  });

  it('applies correct variant and classes when active', () => {
    render(<ActivityButton {...defaultProps} isActive={true} />);
    const button = screen.getByTestId(`activity-button-${mockActivity.id}`);
    expect(button).toHaveClass('btn-primary');
    expect(button).toHaveClass('active');
  });

  it('applies correct variant and classes when completed', () => {
    render(<ActivityButton {...defaultProps} isCompleted={true} />);
    const button = screen.getByTestId(`activity-button-${mockActivity.id}`);
    expect(button).toHaveClass('btn-success');
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('applies default variant when neither active nor completed', () => {
    render(<ActivityButton {...defaultProps} />);
    const button = screen.getByTestId(`activity-button-${mockActivity.id}`);
    expect(button).toHaveClass('btn-secondary');
  });

  it('calls onClick when the main button is clicked', () => {
    render(<ActivityButton {...defaultProps} />);
    const button = screen.getByTestId(`activity-button-${mockActivity.id}`);
    fireEvent.click(button);
    expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
  });

  it('disables the main button when isCompleted is true', () => {
    render(<ActivityButton {...defaultProps} isCompleted={true} />);
    const button = screen.getByTestId(`activity-button-${mockActivity.id}`);
    expect(button).toBeDisabled();
  });

  it('disables the main button when disabled prop is true', () => {
    render(<ActivityButton {...defaultProps} disabled={true} />);
    const button = screen.getByTestId(`activity-button-${mockActivity.id}`);
    expect(button).toBeDisabled();
  });

  it('renders the remove button', () => {
    render(<ActivityButton {...defaultProps} />);
    const removeButton = screen.getByTestId(`remove-activity-${mockActivity.id}-button`);
    expect(removeButton).toBeInTheDocument();
    expect(removeButton).toHaveClass('btn-danger');
  });

  it('calls onRemove when the remove button is clicked', () => {
    render(<ActivityButton {...defaultProps} />);
    const removeButton = screen.getByTestId(`remove-activity-${mockActivity.id}-button`);
    fireEvent.click(removeButton);
    expect(defaultProps.onRemove).toHaveBeenCalledTimes(1);
  });

  it('disables the remove button when disabled prop is true', () => {
    render(<ActivityButton {...defaultProps} disabled={true} />);
    const removeButton = screen.getByTestId(`remove-activity-${mockActivity.id}-button`);
    expect(removeButton).toBeDisabled();
  });

  it('does not show "Completed" badge when not completed', () => {
    render(<ActivityButton {...defaultProps} />);
    expect(screen.queryByText('Completed')).not.toBeInTheDocument();
  });
});
