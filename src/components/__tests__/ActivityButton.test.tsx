import { render, screen, fireEvent } from '@testing-library/react';
import { ActivityButton } from '../ActivityButton';
import { jest } from '@jest/globals';

describe('ActivityButton', () => {
  const defaultActivity = {
    id: 'test1',
    name: 'Test Activity',
    colorIndex: 0,
    createdAt: new Date().toISOString(),
    isActive: true
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
    // Check for Bootstrap Card component structure when completed
    const cardElement = screen.getByText('Test Activity').closest('.card');
    expect(cardElement).toBeInTheDocument();
    expect(cardElement).toHaveClass('card');
  });

  it('shows checkmark icon when completed', () => {
    render(<ActivityButton {...defaultProps} isCompleted={true} />);
    const completedTag = screen.getByLabelText('Completed');
    expect(completedTag).toBeInTheDocument();
    expect(completedTag.querySelector('svg')).toBeInTheDocument();
  });

  it('shows start button with play icon when not completed', () => {
    render(<ActivityButton {...defaultProps} />);
    const startButton = screen.getByRole('button', { name: 'Start' });
    expect(startButton).toBeInTheDocument();
    expect(startButton.querySelector('svg')).toBeInTheDocument();
  });

  it('shows complete button with checkmark when running', () => {
    render(<ActivityButton {...defaultProps} isRunning={true} />);
    const completeButton = screen.getByRole('button', { name: 'Complete' });
    expect(completeButton).toBeInTheDocument();
    expect(completeButton.querySelector('svg')).toBeInTheDocument();
  });

  it('handles select events', () => {
    render(<ActivityButton {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: 'Start' }));
    expect(defaultProps.onSelect).toHaveBeenCalledWith(defaultActivity);
  });

  it('shows and handles remove button with trash icon when onRemove provided', () => {
    const onRemove = jest.fn();
    render(<ActivityButton {...defaultProps} onRemove={onRemove} />);
    
    const removeButton = screen.getByRole('button', { name: 'Remove' });
    expect(removeButton.querySelector('svg')).toBeInTheDocument();
    
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
