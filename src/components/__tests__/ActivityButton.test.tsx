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
    timelineEntries: [],
    elapsedTime: 0
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
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
      timelineEntries={[{ 
        id: '1',
        activityId: 'test1',
        activityName: 'Test Activity',
        startTime: 0,
        endTime: 300 
      }]}
    />);
    
    expect(screen.getByRole('button', { name: 'Remove' })).toBeDisabled();
  });

  describe('Timer Display', () => {
    it('shows timer when activity is running', () => {
      render(<ActivityButton {...defaultProps} isRunning={true} elapsedTime={30} />);
      expect(screen.getByText('00:30')).toBeInTheDocument();
    });

    it('does not show timer when activity is not running', () => {
      render(<ActivityButton {...defaultProps} elapsedTime={30} />);
      expect(screen.queryByText('00:30')).not.toBeInTheDocument();
    });

    it('formats time correctly for different durations', () => {
      render(<ActivityButton {...defaultProps} isRunning={true} elapsedTime={3665} />);
      expect(screen.getByText('61:05')).toBeInTheDocument();
    });

    it('does not show timer when activity is completed', () => {
      render(<ActivityButton {...defaultProps} isCompleted={true} isRunning={false} elapsedTime={30} />);
      expect(screen.queryByText('00:30')).not.toBeInTheDocument();
    });
  });
});
