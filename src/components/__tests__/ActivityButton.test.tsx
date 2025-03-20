import { render, screen, fireEvent, act } from '@testing-library/react';
import { ActivityButton } from '../ActivityButton';
import styles from '../ActivityButton.module.css';
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
    render(<ActivityButton 
      {...defaultProps} 
      onRemove={onRemove}
      timelineEntries={[{ 
        id: '1',
        activityId: 'test1',
        activityName: 'Test Activity',
        startTime: 0,
        endTime: 300 
      }]}
      isInTimeline={true}
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

  describe('Activity Completion Delay Feature', () => {
    it('shows completion progress bar when completing a running activity', () => {
      render(<ActivityButton {...defaultProps} isRunning={true} />);
      
      // Click the complete button
      fireEvent.click(screen.getByRole('button', { name: 'Complete' }));
      
      // Check that the progress bar exists
      const progressBar = screen.getByTestId('completion-progress-test-activity');
      expect(progressBar).toBeInTheDocument();
      expect(progressBar).toHaveClass(styles.completionProgressBar);
    });

    it('allows cancellation of completion during delay period', () => {
      render(<ActivityButton {...defaultProps} isRunning={true} />);
      
      // Click the complete button
      fireEvent.click(screen.getByRole('button', { name: 'Complete' }));
      
      // Cancel the completion
      fireEvent.click(screen.getByRole('button', { name: 'Cancel completion' }));
      
      // Progress bar should be gone
      expect(screen.queryByTestId('completion-progress-test-activity')).not.toBeInTheDocument();
      
      // onSelect should not have been called
      expect(defaultProps.onSelect).not.toHaveBeenCalled();
    });

    it('completes activity after delay period', () => {
      render(<ActivityButton {...defaultProps} isRunning={true} />);
      
      // Click the complete button
      fireEvent.click(screen.getByRole('button', { name: 'Complete' }));
      
      // Fast-forward time by 3 seconds
      act(() => {
        jest.advanceTimersByTime(3100);
      });
      
      // Progress bar should be gone after completion
      expect(screen.queryByTestId('completion-progress-test-activity')).not.toBeInTheDocument();
      
      // onSelect should have been called with the activity
      expect(defaultProps.onSelect).toHaveBeenCalledWith(defaultActivity);
    });

    it('updates progress bar width during delay period', () => {
      render(<ActivityButton {...defaultProps} isRunning={true} />);
      
      // Click the complete button
      fireEvent.click(screen.getByRole('button', { name: 'Complete' }));
      
      const progressBar = screen.getByTestId('completion-progress-test-activity');
      
      // Initial width should be 0%
      expect(progressBar).toHaveStyle({ width: '0%' });
      
      // Advance time by 1.5 seconds (halfway)
      act(() => {
        jest.advanceTimersByTime(1500);
      });
      
      // Width should be approximately 50% (actual calculation may vary slightly)
      const widthAfter1500ms = parseFloat(progressBar.style.width);
      expect(widthAfter1500ms).toBeGreaterThanOrEqual(45);
      expect(widthAfter1500ms).toBeLessThanOrEqual(55);
      
      // Advance time to 3 seconds
      act(() => {
        jest.advanceTimersByTime(1600);
      });
      
      // Width should reach 100% and activity should complete
      expect(defaultProps.onSelect).toHaveBeenCalledWith(defaultActivity);
    });
    
    it('cleans up interval on unmount', () => {
      const { unmount } = render(<ActivityButton {...defaultProps} isRunning={true} />);
      
      // Click the complete button
      fireEvent.click(screen.getByRole('button', { name: 'Complete' }));
      
      // Spy on clearInterval
      const clearIntervalSpy = jest.spyOn(window, 'clearInterval');
      
      // Unmount the component
      unmount();
      
      // Check if clearInterval was called
      expect(clearIntervalSpy).toHaveBeenCalled();
      
      // Restore the spy
      clearIntervalSpy.mockRestore();
    });
    
    // New tests for "Continue to iterate?" functionality
    it('shows "Continue to iterate?" message after completion', () => {
      render(<ActivityButton {...defaultProps} isRunning={true} />);
      
      // Click the complete button
      fireEvent.click(screen.getByRole('button', { name: 'Complete' }));
      
      // Fast-forward time by 3 seconds to complete the activity
      act(() => {
        jest.advanceTimersByTime(3100);
      });
      
      // Check for the "Continue to iterate?" message
      expect(screen.getByText('Continue to iterate?')).toBeInTheDocument();
    });
    
    it('shows Yes and No buttons with the iteration question', () => {
      render(<ActivityButton {...defaultProps} isRunning={true} />);
      
      // Click the complete button
      fireEvent.click(screen.getByRole('button', { name: 'Complete' }));
      
      // Fast-forward time by 3 seconds to complete the activity
      act(() => {
        jest.advanceTimersByTime(3100);
      });
      
      // Check for Yes and No buttons
      expect(screen.getByRole('button', { name: 'Yes' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'No' })).toBeInTheDocument();
    });
    
    it('clicking Yes on iteration prompt starts the activity again', () => {
      render(<ActivityButton {...defaultProps} isRunning={true} />);
      
      // Click the complete button
      fireEvent.click(screen.getByRole('button', { name: 'Complete' }));
      
      // Fast-forward time by 3 seconds to complete the activity
      act(() => {
        jest.advanceTimersByTime(3100);
      });
      
      // First call to onSelect occurs when activity completes
      expect(defaultProps.onSelect).toHaveBeenCalledTimes(1);
      
      // Click "Yes" to start activity again
      fireEvent.click(screen.getByRole('button', { name: 'Yes' }));
      
      // onSelect should be called again with the same activity
      expect(defaultProps.onSelect).toHaveBeenCalledTimes(2);
      expect(defaultProps.onSelect).toHaveBeenNthCalledWith(2, defaultActivity);
    });
    
    it('clicking No on iteration prompt dismisses the iteration message', () => {
      render(<ActivityButton {...defaultProps} isRunning={true} />);
      
      // Click the complete button
      fireEvent.click(screen.getByRole('button', { name: 'Complete' }));
      
      // Fast-forward time by 3 seconds to complete the activity
      act(() => {
        jest.advanceTimersByTime(3100);
      });
      
      // Click "No" to dismiss the iteration message
      fireEvent.click(screen.getByRole('button', { name: 'No' }));
      
      // Check that the iteration message is gone
      expect(screen.queryByText('Continue to iterate?')).not.toBeInTheDocument();
      
      // onSelect should not be called again
      expect(defaultProps.onSelect).toHaveBeenCalledTimes(1);
    });
    
    it('automatically dismisses iteration message after timeout', () => {
      render(<ActivityButton {...defaultProps} isRunning={true} />);
      
      // Click the complete button
      fireEvent.click(screen.getByRole('button', { name: 'Complete' }));
      
      // Fast-forward time by 3 seconds to complete the activity
      act(() => {
        jest.advanceTimersByTime(3100);
      });
      
      // Iteration message should be visible
      expect(screen.getByText('Continue to iterate?')).toBeInTheDocument();
      
      // Fast-forward time by 5 seconds (iteration prompt timeout)
      act(() => {
        jest.advanceTimersByTime(5000);
      });
      
      // Check that the iteration message is gone
      expect(screen.queryByText('Continue to iterate?')).not.toBeInTheDocument();
    });
  });

  describe('Iteration Prompt Feature', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('shows iteration prompt after completing activity', async () => {
      render(<ActivityButton {...defaultProps} isRunning={true} />);

      // Click the complete button
      fireEvent.click(screen.getByRole('button', { name: 'Complete' }));

      // Fast-forward time by 3 seconds to complete the activity
      act(() => {
        jest.advanceTimersByTime(3100);
      });

      // Check that the iteration prompt appears
      expect(screen.getByText('Continue to iterate?')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Yes' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'No' })).toBeInTheDocument();
    });

    it('restarts activity when clicking Yes', async () => {
      render(<ActivityButton {...defaultProps} isRunning={true} />);

      // Click the complete button
      fireEvent.click(screen.getByRole('button', { name: 'Complete' }));

      // Fast-forward time by 3 seconds
      act(() => {
        jest.advanceTimersByTime(3100);
      });

      // Click Yes to restart
      fireEvent.click(screen.getByRole('button', { name: 'Yes' }));

      // Should call onSelect with the activity
      expect(defaultProps.onSelect).toHaveBeenCalledWith(defaultActivity);

      // Prompt should be dismissed
      expect(screen.queryByText('Continue to iterate?')).not.toBeInTheDocument();
    });

    it('dismisses prompt when clicking No', async () => {
      render(<ActivityButton {...defaultProps} isRunning={true} />);

      // Click the complete button
      fireEvent.click(screen.getByRole('button', { name: 'Complete' }));

      // Fast-forward time by 3 seconds
      act(() => {
        jest.advanceTimersByTime(3100);
      });

      // Click No to dismiss
      fireEvent.click(screen.getByRole('button', { name: 'No' }));

      // Prompt should be dismissed
      expect(screen.queryByText('Continue to iterate?')).not.toBeInTheDocument();

      // onSelect should not be called again
      expect(defaultProps.onSelect).toHaveBeenCalledTimes(1);
    });

    it('auto-dismisses iteration prompt after timeout', async () => {
      render(<ActivityButton {...defaultProps} isRunning={true} />);

      // Click the complete button
      fireEvent.click(screen.getByRole('button', { name: 'Complete' }));

      // Fast-forward time by 3 seconds to complete activity
      act(() => {
        jest.advanceTimersByTime(3100);
      });

      // Verify prompt is shown
      expect(screen.getByText('Continue to iterate?')).toBeInTheDocument();

      // Fast-forward time by 5 seconds (iteration prompt timeout)
      act(() => {
        jest.advanceTimersByTime(5000);
      });

      // Prompt should be dismissed
      expect(screen.queryByText('Continue to iterate?')).not.toBeInTheDocument();
    });

    it('cleans up timeouts on unmount', () => {
      const { unmount } = render(<ActivityButton {...defaultProps} isRunning={true} />);

      // Click the complete button
      fireEvent.click(screen.getByRole('button', { name: 'Complete' }));

      // Fast-forward time by 3 seconds
      act(() => {
        jest.advanceTimersByTime(3100);
      });

      // Spy on clearTimeout
      const clearTimeoutSpy = jest.spyOn(window, 'clearTimeout');

      // Unmount the component
      unmount();

      // Check if clearTimeout was called
      expect(clearTimeoutSpy).toHaveBeenCalled();

      // Restore the spy
      clearTimeoutSpy.mockRestore();
    });
  });
});
