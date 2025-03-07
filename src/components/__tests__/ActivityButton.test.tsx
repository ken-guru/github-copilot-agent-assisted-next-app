import { render, screen, fireEvent } from '@testing-library/react';
import { ActivityButton } from '../ActivityButton';
import styles from '../ActivityManager.module.css';
import { jest } from '@jest/globals';

describe('ActivityButton', () => {
  const defaultActivity = {
    id: 'test1',
    name: 'Test Activity',
    colors: {
      background: '#fff',
      text: '#000',
      border: '#ccc'
    }
  };

  const defaultProps = {
    activity: defaultActivity,
    isCompleted: false,
    isRunning: false,
    onSelect: jest.fn(),
    timelineEntries: []
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders activity name', () => {
    render(<ActivityButton {...defaultProps} />);
    expect(screen.getByText('Test Activity')).toBeInTheDocument();
  });

  it('applies completed styles when completed', () => {
    render(<ActivityButton {...defaultProps} isCompleted={true} />);
    const container = screen.getByText('Test Activity').closest('div');
    expect(container).toHaveClass(styles.completedActivityItem);
  });

  it('shows completed tag when completed', () => {
    render(<ActivityButton {...defaultProps} isCompleted={true} />);
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('shows start/complete button when not completed', () => {
    render(<ActivityButton {...defaultProps} />);
    expect(screen.getByRole('button', { name: 'Start' })).toBeInTheDocument();
  });

  it('shows complete button when running', () => {
    render(<ActivityButton {...defaultProps} isRunning={true} />);
    expect(screen.getByRole('button', { name: 'Complete' })).toBeInTheDocument();
  });

  it('handles select events', () => {
    render(<ActivityButton {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: 'Start' }));
    expect(defaultProps.onSelect).toHaveBeenCalledWith(defaultActivity);
  });

  it('shows and handles remove button when onRemove provided', () => {
    const onRemove = jest.fn();
    render(<ActivityButton {...defaultProps} onRemove={onRemove} />);
    
    const removeButton = screen.getByRole('button', { name: 'Remove' });
    fireEvent.click(removeButton);
    
    expect(onRemove).toHaveBeenCalledWith(defaultActivity.id);
  });

  it('disables remove button when activity is in timeline', () => {
    const onRemove = jest.fn();
    render(<ActivityButton {...defaultProps} 
      onRemove={onRemove}
      timelineEntries={[{ activityId: 'test1', startTime: 0, endTime: 300 }]}
    />);
    
    expect(screen.getByRole('button', { name: 'Remove' })).toBeDisabled();
  });
});
