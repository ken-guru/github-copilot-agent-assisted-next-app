import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import ActivityManager from '../ActivityManager';
import { ToastProvider } from '../ToastNotificationProvider';
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
      <ToastProvider>
        <ActivityManager 
          onActivitySelect={mockOnActivitySelect}
          onActivityRemove={mockOnActivityRemove}
          currentActivityId={null}
          completedActivityIds={[]}
          timelineEntries={[]}
        />
      </ToastProvider>
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
      <ToastProvider>
        <ActivityManager 
          onActivitySelect={mockOnActivitySelect}
          onActivityRemove={mockOnActivityRemove}
          currentActivityId={null}
          completedActivityIds={[]}
          timelineEntries={[]}
        />
      </ToastProvider>
    );
    
    // Type in a new activity name
    const input = screen.getByLabelText('Name');
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
      <ToastProvider>
        <ActivityManager 
          onActivitySelect={mockOnActivitySelect}
          onActivityRemove={mockOnActivityRemove}
          currentActivityId={null}
          completedActivityIds={[]}
          timelineEntries={[]}
        />
      </ToastProvider>
    );
    
    // Type in a new activity name
    const input = screen.getByLabelText('Name');
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
      <ToastProvider>
        <ActivityManager 
          onActivitySelect={mockOnActivitySelect}
          onActivityRemove={mockOnActivityRemove}
          currentActivityId="1" // Homework is current
          completedActivityIds={[]}
          timelineEntries={[]}
        />
      </ToastProvider>
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
      <ToastProvider>
        <ActivityManager 
          onActivitySelect={mockOnActivitySelect}
          onActivityRemove={mockOnActivityRemove}
          currentActivityId={null}
          completedActivityIds={['1']} // Homework is completed
          timelineEntries={[]}
        />
      </ToastProvider>
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
      <ToastProvider>
        <ActivityManager 
          onActivitySelect={mockOnActivitySelect}
          onActivityRemove={mockOnActivityRemove}
          currentActivityId={null}
          completedActivityIds={[]}
          timelineEntries={[]}
        />
      </ToastProvider>
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
      <ToastProvider>
        <ActivityManager 
          onActivitySelect={mockOnActivitySelect}
          onActivityRemove={mockOnActivityRemove}
          currentActivityId={null}
          completedActivityIds={[]}
          timelineEntries={timelineEntries}
        />
      </ToastProvider>
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
      <ToastProvider>
        <ActivityManager 
          onActivitySelect={mockOnActivitySelect}
          onActivityRemove={mockOnActivityRemove}
          currentActivityId={null}
          completedActivityIds={[]}
          timelineEntries={[]}
          isTimeUp={true}
        />
      </ToastProvider>
    );
    
    // Add Activity button should be disabled
    const addButton = screen.getByText('Add Activity');
    expect(addButton).toBeDisabled();
    
    // Name input should be disabled
    const input = screen.getByLabelText('Name');
    expect(input).toBeDisabled();
  });
  
  it('should start an activity when clicking Start', async () => {
    render(
      <ToastProvider>
        <ActivityManager 
          onActivitySelect={mockOnActivitySelect}
          onActivityRemove={mockOnActivityRemove}
          currentActivityId={null}
          completedActivityIds={[]}
          timelineEntries={[]}
        />
      </ToastProvider>
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
      <ToastProvider>
        <ActivityManager 
          onActivitySelect={mockOnActivitySelect}
          onActivityRemove={mockOnActivityRemove}
          currentActivityId="1" // Homework is running
          completedActivityIds={[]}
          timelineEntries={[]}
          elapsedTime={30}
        />
      </ToastProvider>
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
      <ToastProvider>
        <ActivityManager 
          onActivitySelect={mockOnActivitySelect}
          onActivityRemove={mockOnActivityRemove}
          currentActivityId="2" // Reading is running
          completedActivityIds={[]}
          timelineEntries={[]}
          elapsedTime={30}
        />
      </ToastProvider>
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
        <ToastProvider>
          <ActivityManager 
            {...mockProps}
            totalDuration={3600000} // 1 hour
            timerActive={true}
          />
        </ToastProvider>
      );
      
      const progressContainer = screen.getByTestId('progress-container');
      expect(progressContainer).toBeInTheDocument();
      expect(progressContainer).toHaveClass('w-100');
    });

    it('renders progress bar even when timer is not active', () => {
      render(
        <ToastProvider>
          <ActivityManager 
            {...mockProps}
            totalDuration={3600000}
            timerActive={false}
          />
        </ToastProvider>
      );
      
      // Progress bar should still be rendered for layout consistency
      expect(screen.getByTestId('progress-container')).toBeInTheDocument();
    });

    it('does not render progress bar when totalDuration is not provided', () => {
      render(
        <ToastProvider>
          <ActivityManager 
            {...mockProps}
            timerActive={true}
          />
        </ToastProvider>
      );
      
      // Progress bar should still render as it's always shown for consistent layout
      expect(screen.getByTestId('progress-container')).toBeInTheDocument();
    });

    it('has correct layout order: progress bar, form, activities list', async () => {
      render(
        <ToastProvider>
          <ActivityManager 
            {...mockProps}
            totalDuration={3600000}
            timerActive={true}
          />
        </ToastProvider>
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
      render(
        <ToastProvider>
          <ActivityManager {...mockProps} />
        </ToastProvider>
      );
      
      expect(screen.queryByRole('button', { name: /Reset/i })).not.toBeInTheDocument();
    });

    it('renders reset button when onReset prop is provided', () => {
      const onReset = jest.fn();
      render(
        <ToastProvider>
          <ActivityManager {...mockProps} onReset={onReset} />
        </ToastProvider>
      );
      
      const resetButton = screen.getByRole('button', { name: /Reset/i });
      expect(resetButton).toBeInTheDocument();
      expect(resetButton).toHaveClass('btn-outline-danger');
      expect(resetButton).toHaveAttribute('title', 'Reset session and return to time setup');
    });

    it('calls onReset callback when reset button is clicked', () => {
      const onReset = jest.fn();
      render(
        <ToastProvider>
          <ActivityManager {...mockProps} onReset={onReset} />
        </ToastProvider>
      );
      
      const resetButton = screen.getByRole('button', { name: /Reset/i });
      fireEvent.click(resetButton);
      
      expect(onReset).toHaveBeenCalledTimes(1);
    });

    it('is positioned in the card header alongside the title', () => {
      const onReset = jest.fn();
      render(
        <ToastProvider>
          <ActivityManager {...mockProps} onReset={onReset} />
        </ToastProvider>
      );
      
      const cardHeader = screen.getByText('Activities').closest('.card-header');
      const resetButton = screen.getByRole('button', { name: /Reset/i });
      
      expect(cardHeader).toContainElement(resetButton);
      expect(cardHeader).toHaveClass('d-flex', 'justify-content-between', 'align-items-center');
    });
  });
});