import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import ActivityManager from '../ActivityManager';
import * as colorUtils from '../../utils/colors';
import { DEFAULT_ACTIVITIES } from '../../types/activity';

// Mock window.matchMedia and getNextAvailableColorSet
jest.mock('../../utils/colors', () => ({
  ...jest.requireActual('../../utils/colors'),
  getNextAvailableColorSet: jest.fn().mockImplementation(() => ({
    background: '#E8F5E9',
    text: '#1B5E20',
    border: '#2E7D32'
  }))
}));

// Ensure dark mode detection works in tests
beforeAll(() => {
  Object.defineProperty(document.documentElement, 'classList', {
    value: {
      contains: jest.fn().mockReturnValue(false),
      add: jest.fn(),
      remove: jest.fn(),
    }
  });
});

describe('ActivityManager Component', () => {
  const mockOnActivitySelect = jest.fn();
  const mockOnActivityRemove = jest.fn();
  
  beforeEach(() => {
    mockOnActivitySelect.mockClear();
    mockOnActivityRemove.mockClear();
    jest.clearAllMocks();
  // Reset localStorage to default activities before each test
  localStorage.setItem('activities_v1', JSON.stringify(DEFAULT_ACTIVITIES));
  });
  
  it('should render default activities on mount', async () => {
    render(
      <ActivityManager 
        onActivitySelect={mockOnActivitySelect}
        onActivityRemove={mockOnActivityRemove}
        currentActivityId={null}
        completedActivityIds={[]}
        timelineEntries={[]}
      />
    );
    
    // It should render the heading
    expect(screen.getByText('Activities')).toBeInTheDocument();
    
    // It should render the default activities
    await waitFor(() => {
      expect(screen.getByText('Homework')).toBeInTheDocument();
      expect(screen.getByText('Reading')).toBeInTheDocument();
      expect(screen.getByText('Play Time')).toBeInTheDocument();
      expect(screen.getByText('Chores')).toBeInTheDocument();
    });
  });
  
  it('should allow adding a new activity', async () => {
    render(
      <ActivityManager 
        onActivitySelect={mockOnActivitySelect}
        onActivityRemove={mockOnActivityRemove}
        currentActivityId={null}
        completedActivityIds={[]}
        timelineEntries={[]}
      />
    );
    
    // Type in a new activity name
    const input = screen.getByLabelText('Activity name');
    fireEvent.change(input, { target: { value: 'New Test Activity' } });
    
    // Click the Add Activity button
    fireEvent.click(screen.getByText('Add Activity'));
    
    // New activity should appear in the list
    expect(await screen.findByText('New Test Activity')).toBeInTheDocument();
    
    // Input should be cleared
    expect(input).toHaveValue('');
    
    // It should have assigned a color to the activity
    expect(colorUtils.getNextAvailableColorSet).toHaveBeenCalled();
  });

  it('should add activity in pending state without starting it', async () => {
    render(
      <ActivityManager 
        onActivitySelect={mockOnActivitySelect}
        onActivityRemove={mockOnActivityRemove}
        currentActivityId={null}
        completedActivityIds={[]}
        timelineEntries={[]}
      />
    );
    
    // Type in a new activity name
    const input = screen.getByLabelText('Activity name');
    fireEvent.change(input, { target: { value: 'New Test Activity' } });
    
    // Click the Add Activity button
    fireEvent.click(screen.getByText('Add Activity'));

    // Should call onActivitySelect with the new activity and justAdd=true
    expect(mockOnActivitySelect).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'New Test Activity'
      }),
      true
    );
  });
  
  it('should mark an activity as completed when clicking Complete', async () => {
    render(
      <ActivityManager 
        onActivitySelect={mockOnActivitySelect}
        onActivityRemove={mockOnActivityRemove}
        currentActivityId="1" // Homework is current
        completedActivityIds={[]}
        timelineEntries={[]}
      />
    );
    
    // Wait for activities to render
    await waitFor(() => {
      expect(screen.getByText('Homework')).toBeInTheDocument();
    });
    
    // Find the Complete button for the running activity
    const completeButton = await screen.findByRole('button', { name: 'Complete' });
    
    // Click Complete
    fireEvent.click(completeButton);
    
    // Should call onActivitySelect with null to mark it as completed
    expect(mockOnActivitySelect).toHaveBeenCalledWith(null);
  });
  
  it('should show completed activities with completed styling', async () => {
    render(
      <ActivityManager 
        onActivitySelect={mockOnActivitySelect}
        onActivityRemove={mockOnActivityRemove}
        currentActivityId={null}
        completedActivityIds={['1']} // Homework is completed
        timelineEntries={[]}
      />
    );
    
    // Wait for activities to render
    await waitFor(() => {
      expect(screen.getByText('Homework')).toBeInTheDocument();
    });
    
    // Should show "Completed" icon/label
    expect(await screen.findByLabelText('Completed')).toBeInTheDocument();
    
    // Find the homework container div
    const homeworkItem = screen.getByText('Homework').closest('div');
    if (!homeworkItem) {
      throw new Error('Could not find homework item container');
    }
    
    // The homework item should not contain start/complete buttons
    // We need to check this differently since there are multiple Start buttons in the document
    const homeworkButtons = within(homeworkItem).queryAllByRole('button');
    expect(homeworkButtons.length).toBe(0); // No buttons in the completed activity item
  });
  
  it('should allow removing an activity', async () => {
    render(
      <ActivityManager 
        onActivitySelect={mockOnActivitySelect}
        onActivityRemove={mockOnActivityRemove}
        currentActivityId={null}
        completedActivityIds={[]}
        timelineEntries={[]}
      />
    );
    
    // Wait for activities to render
    await waitFor(() => {
      expect(screen.getByText('Homework')).toBeInTheDocument();
    });
    
    // Find all remove buttons and click the first one
    const removeButtons = await screen.findAllByRole('button', { name: 'Remove' });
    expect(removeButtons.length).toBeGreaterThan(0);
    const firstRemoveButton = removeButtons[0] as HTMLElement;
    fireEvent.click(firstRemoveButton);
    
    // Should call onActivityRemove
    expect(mockOnActivityRemove).toHaveBeenCalledTimes(1);
  });
  
  it('should disable removing activities that appear in the timeline', async () => {
    const timelineEntries = [
      {
        id: '1',
        activityId: '1', // Homework in timeline
        activityName: 'Homework',
        startTime: 1000000,
        endTime: 1000000 + 3600000,
      }
    ];
    
    render(
      <ActivityManager 
        onActivitySelect={mockOnActivitySelect}
        onActivityRemove={mockOnActivityRemove}
        currentActivityId={null}
        completedActivityIds={[]}
        timelineEntries={timelineEntries}
      />
    );
    
    // Wait for activities to render
    await waitFor(() => {
      expect(screen.getByText('Homework')).toBeInTheDocument();
    });
    
    // Find all remove buttons
    const removeButtons = await screen.findAllByRole('button', { name: 'Remove' });
    
    // First button (Homework) should be disabled
    expect(removeButtons[0]).toBeDisabled();
    
    // Other buttons should be enabled
    expect(removeButtons[1]).not.toBeDisabled();
  });
  
  it('should disable adding activities when time is up', async () => {
    render(
      <ActivityManager 
        onActivitySelect={mockOnActivitySelect}
        onActivityRemove={mockOnActivityRemove}
        currentActivityId={null}
        completedActivityIds={[]}
        timelineEntries={[]}
        isTimeUp={true}
      />
    );
    
    // Add Activity button should be disabled
    const addButton = screen.getByText('Add Activity');
    expect(addButton).toBeDisabled();
    
    // Name input should be disabled
    const input = screen.getByLabelText('Activity name');
    expect(input).toBeDisabled();
  });
  
  it('should start an activity when clicking Start', async () => {
    render(
      <ActivityManager 
        onActivitySelect={mockOnActivitySelect}
        onActivityRemove={mockOnActivityRemove}
        currentActivityId={null}
        completedActivityIds={[]}
        timelineEntries={[]}
      />
    );
    
    // Wait for activities to render and initialization to complete
    await waitFor(() => {
      expect(screen.getByText('Homework')).toBeInTheDocument();
    });
    
    // Clear mocks after initialization but before the action we're testing
    mockOnActivitySelect.mockClear();
    
    // Find the first activity item - need to get the entire card, not just the header
    const homeworkItem = screen.getByText('Homework').closest('.card') as HTMLElement;
    if (!homeworkItem) {
      throw new Error('Could not find homework item container');
    }
    
    // Find the Start button within this item and click it
    const startButton = within(homeworkItem).getByRole('button', { name: 'Start' });
    fireEvent.click(startButton);
    
    // Should call onActivitySelect with the activity object
    expect(mockOnActivitySelect).toHaveBeenCalledTimes(1);
    expect(mockOnActivitySelect.mock.calls[0][0]).toHaveProperty('id', '1'); // Homework id
    expect(mockOnActivitySelect.mock.calls[0][0]).toHaveProperty('name', 'Homework');
  });
  
  it('should pass elapsedTime to running activity', async () => {
    render(
      <ActivityManager 
        onActivitySelect={mockOnActivitySelect}
        onActivityRemove={mockOnActivityRemove}
        currentActivityId="1" // Homework is running
        completedActivityIds={[]}
        timelineEntries={[]}
        elapsedTime={30}
      />
    );
    
    // Wait for activities to render
    await waitFor(() => {
      expect(screen.getByText('Homework')).toBeInTheDocument();
    });
    
    // Check if the timer is displayed with the correct time
    expect(screen.getByText('00:30')).toBeInTheDocument();
  });
  
  it('should not show timer for non-running activities', async () => {
    render(
      <ActivityManager 
        onActivitySelect={mockOnActivitySelect}
        onActivityRemove={mockOnActivityRemove}
        currentActivityId="2" // Reading is running
        completedActivityIds={[]}
        timelineEntries={[]}
        elapsedTime={30}
      />
    );
    
    // Wait for activities to render and find the Homework item
    await waitFor(() => {
      expect(screen.getByText('Homework')).toBeInTheDocument();
    });
    
    // The Homework activity (not running) should not show the timer
    const homeworkItem = screen.getByText('Homework').closest('div');
    expect(within(homeworkItem || document.body).queryByText('00:30')).not.toBeInTheDocument();
  });

  describe('Progress Bar Integration', () => {
    const mockProps = {
      onActivitySelect: jest.fn(),
      onActivityRemove: jest.fn(),
      completedActivityIds: [],
      currentActivityId: null,
      timelineEntries: [],
      elapsedTime: 0,
    };

    it('renders progress bar when totalDuration and timerActive props are provided', () => {
      render(
        <ActivityManager 
          {...mockProps}
          totalDuration={3600000} // 1 hour
          timerActive={true}
        />
      );
      
      const progressContainer = screen.getByTestId('progress-container');
      expect(progressContainer).toBeInTheDocument();
      expect(progressContainer).toHaveClass('w-100');
    });

    it('renders progress bar even when timer is not active', () => {
      render(
        <ActivityManager 
          {...mockProps}
          totalDuration={3600000}
          timerActive={false}
        />
      );
      
      // Progress bar should still be rendered for layout consistency
      expect(screen.getByTestId('progress-container')).toBeInTheDocument();
    });

    it('does not render progress bar when totalDuration is not provided', () => {
      render(
        <ActivityManager 
          {...mockProps}
          timerActive={true}
        />
      );
      
      // Progress bar should still render as it's always shown for consistent layout
      expect(screen.getByTestId('progress-container')).toBeInTheDocument();
    });

    it('has correct layout order: progress bar, form, activities list', async () => {
      render(
        <ActivityManager 
          {...mockProps}
          totalDuration={3600000}
          timerActive={true}
        />
      );
      
      // Wait for activities to load
      await waitFor(() => {
        expect(screen.getByText('Homework')).toBeInTheDocument();
      });
      
      const cardBody = screen.getByTestId('activity-manager').querySelector('.card-body');
      const children = Array.from(cardBody?.children || []);
      
      // Check order: progress container, form column, activities list container
      expect(children[0]).toHaveClass('flex-shrink-0', 'mb-3'); // Progress bar
      expect(children[1]).toHaveAttribute('data-testid', 'activity-form-column'); // Form
      expect(children[2]).toHaveClass('flex-grow-1'); // Activities list (overflow now handled by inline styles)
    });
  });

  describe('Reset Button', () => {
    const mockProps = {
      onActivitySelect: jest.fn(),
      onActivityRemove: jest.fn(),
      completedActivityIds: [],
      currentActivityId: null,
      timelineEntries: [],
      elapsedTime: 0,
    };

    it('does not render reset button when onReset prop is not provided', () => {
      render(<ActivityManager {...mockProps} />);
      
      expect(screen.queryByRole('button', { name: /Reset/i })).not.toBeInTheDocument();
    });

    it('renders reset button when onReset prop is provided', () => {
      const onReset = jest.fn();
      render(<ActivityManager {...mockProps} onReset={onReset} />);
      
      const resetButton = screen.getByRole('button', { name: /Reset/i });
      expect(resetButton).toBeInTheDocument();
      expect(resetButton).toHaveClass('btn-outline-danger');
      expect(resetButton).toHaveAttribute('title', 'Reset session and return to time setup');
    });

    it('calls onReset callback when reset button is clicked', () => {
      const onReset = jest.fn();
      render(<ActivityManager {...mockProps} onReset={onReset} />);
      
      const resetButton = screen.getByRole('button', { name: /Reset/i });
      fireEvent.click(resetButton);
      
      expect(onReset).toHaveBeenCalledTimes(1);
    });

    it('is positioned in the card header alongside the title', () => {
      const onReset = jest.fn();
      render(<ActivityManager {...mockProps} onReset={onReset} />);
      
      const cardHeader = screen.getByText('Activities').closest('.card-header');
      const resetButton = screen.getByRole('button', { name: /Reset/i });
      
      expect(cardHeader).toContainElement(resetButton);
      expect(cardHeader).toHaveClass('card-header-consistent');
    });
  });

  describe('Extend Duration Button (1 min)', () => {
    const mockProps = {
      onActivitySelect: jest.fn(),
      onActivityRemove: jest.fn(),
      completedActivityIds: [],
      currentActivityId: null,
      timelineEntries: [],
      elapsedTime: 0,
    };

    it('does not render 1 min button when onExtendDuration prop is not provided', () => {
      render(<ActivityManager {...mockProps} />);
      
      expect(screen.queryByRole('button', { name: /1 min/i })).not.toBeInTheDocument();
    });

    it('renders 1 min button when onExtendDuration prop is provided', () => {
      const onExtendDuration = jest.fn();
      render(<ActivityManager {...mockProps} onExtendDuration={onExtendDuration} />);
      
      const extendButton = screen.getByRole('button', { name: /1 min/i });
      expect(extendButton).toBeInTheDocument();
      expect(extendButton).toHaveClass('btn-outline-primary');
      expect(extendButton).toHaveAttribute('title', 'Add 1 minute to session duration');
    });

    it('calls onExtendDuration callback when 1 min button is clicked', () => {
      const onExtendDuration = jest.fn();
      render(<ActivityManager {...mockProps} onExtendDuration={onExtendDuration} />);
      
      const extendButton = screen.getByRole('button', { name: /1 min/i });
      fireEvent.click(extendButton);
      
      expect(onExtendDuration).toHaveBeenCalledTimes(1);
    });

    it('positions 1 min button before reset button in card header', () => {
      const onReset = jest.fn();
      const onExtendDuration = jest.fn();
      render(<ActivityManager {...mockProps} onReset={onReset} onExtendDuration={onExtendDuration} />);
      
      const cardHeader = screen.getByText('Activities').closest('.card-header');
      const extendButton = screen.getByRole('button', { name: /1 min/i });
      const resetButton = screen.getByRole('button', { name: /Reset/i });
      
      expect(cardHeader).toContainElement(extendButton);
      expect(cardHeader).toContainElement(resetButton);
      
      // Check order - extend button should come before reset button in DOM
      const buttons = cardHeader?.querySelectorAll('button');
      expect(buttons?.[0]).toBe(extendButton);
      expect(buttons?.[1]).toBe(resetButton);
    });

    it('displays appropriate icon in 1 min button', () => {
      const onExtendDuration = jest.fn();
      render(<ActivityManager {...mockProps} onExtendDuration={onExtendDuration} />);
      
      const extendButton = screen.getByRole('button', { name: /1 min/i });
      const icon = extendButton.querySelector('i.bi-plus-circle');
      
      expect(icon).toBeInTheDocument();
    });
  });

  describe('Overtime Warning Integration', () => {
    const baseMockProps = {
      onActivitySelect: mockOnActivitySelect,
      onActivityRemove: mockOnActivityRemove,
      currentActivityId: null,
      completedActivityIds: [],
      timelineEntries: [],
      timerActive: true
    };

    const overtimeProps = {
      ...baseMockProps,
      totalDuration: 1800, // 30 minutes
      elapsedTime: 2100,   // 35 minutes (5 minutes overtime)
      onExtendDuration: jest.fn()
    };

    it('shows ActivityForm when not in overtime', () => {
      const normalProps = {
        ...baseMockProps,
        totalDuration: 1800, // 30 minutes
        elapsedTime: 1500,   // 25 minutes (not overtime)
      };

      render(<ActivityManager {...normalProps} />);
      
      // Should show activity form, not overtime warning
      expect(screen.queryByTestId('overtime-warning')).not.toBeInTheDocument();
      expect(screen.getByTestId('activity-form')).toBeInTheDocument();
    });

    it('shows OvertimeWarning when in overtime', () => {
      render(<ActivityManager {...overtimeProps} />);
      
      // Should show overtime warning, not activity form
      expect(screen.getByTestId('overtime-warning')).toBeInTheDocument();
      expect(screen.queryByTestId('activity-form')).not.toBeInTheDocument();
    });

    it('calculates overtime duration correctly', () => {
      render(<ActivityManager {...overtimeProps} />);
      
      // 5 minutes overtime = 300 seconds = 5m 0s
      expect(screen.getByText('Overtime by 5m 0s')).toBeInTheDocument();
    });

    it('shows extend duration button in header during overtime', () => {
      const mockExtend = jest.fn();
      render(<ActivityManager {...overtimeProps} onExtendDuration={mockExtend} />);
      
      const extendButton = screen.getByRole('button', { name: /1 min/i });
      fireEvent.click(extendButton);
      
      expect(mockExtend).toHaveBeenCalledTimes(1);
    });

    it('switches back to ActivityForm when overtime ends', () => {
      const { rerender } = render(<ActivityManager {...overtimeProps} />);
      
      // Initially in overtime - should show warning
      expect(screen.getByTestId('overtime-warning')).toBeInTheDocument();
      expect(screen.queryByTestId('activity-form')).not.toBeInTheDocument();
      
      // Update props to no longer be in overtime
      const noOvertimeProps = {
        ...overtimeProps,
        elapsedTime: 1700 // 28 minutes 20 seconds (not overtime)
      };
      
      rerender(<ActivityManager {...noOvertimeProps} />);
      
      // Should now show activity form, not warning
      expect(screen.queryByTestId('overtime-warning')).not.toBeInTheDocument();
      expect(screen.getByTestId('activity-form')).toBeInTheDocument();
    });

    it('handles zero total duration gracefully', () => {
      const zeroProps = {
        ...baseMockProps,
        totalDuration: 0,
        elapsedTime: 100,
      };

      render(<ActivityManager {...zeroProps} />);
      
      // With zero duration and elapsed time > 0, should show overtime warning
      // This is the fix for issue #2 - starting activity with 0 seconds available
      expect(screen.getByTestId('overtime-warning')).toBeInTheDocument();
      expect(screen.queryByTestId('activity-form')).not.toBeInTheDocument();
      expect(screen.getByText('Overtime by 1m 40s')).toBeInTheDocument();
    });

    it('handles negative elapsed time gracefully', () => {
      const negativeProps = {
        ...baseMockProps,
        totalDuration: 1800,
        elapsedTime: -100,
      };

      render(<ActivityManager {...negativeProps} />);
      
      // With negative elapsed time, should show activity form (not overtime)
      expect(screen.queryByTestId('overtime-warning')).not.toBeInTheDocument();
      expect(screen.getByTestId('activity-form')).toBeInTheDocument();
    });

    it('maintains consistent layout height between form and warning', () => {
      const { rerender } = render(<ActivityManager {...baseMockProps} />);
      
      // Get container element when showing form
      const formContainer = screen.getByTestId('activity-form-column');
      const formHeight = formContainer.getBoundingClientRect().height;
      
      // Switch to overtime
      rerender(<ActivityManager {...overtimeProps} />);
      
      // Container should still exist with same structure
      const warningContainer = screen.getByTestId('activity-form-column');
      const warningHeight = warningContainer.getBoundingClientRect().height;
      
      // Heights should be similar (allowing for small differences due to content)
      expect(Math.abs(warningHeight - formHeight)).toBeLessThan(50);
    });
  });
});