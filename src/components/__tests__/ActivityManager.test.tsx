import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import ActivityManager from '../ActivityManager';
import * as colorUtils from '../../utils/colors';

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
  });
  
  it('should render default activities on mount', async () => {
    render(
      <ActivityManager onActivitySelect={mockOnActivitySelect}
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
      expect(screen.getByRole('heading', { name: 'Homework' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Reading' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Play Time' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Chores' })).toBeInTheDocument();
    });
  });
  
  it('should allow adding a new activity', async () => {
    render(
      <ActivityManager onActivitySelect={mockOnActivitySelect}
        onActivityRemove={mockOnActivityRemove}
        currentActivityId={null}
        completedActivityIds={[]}
        timelineEntries={[]}
      />
    );
    
    // Type in a new activity name
    const input = screen.getByPlaceholderText('New activity name');
    fireEvent.change(input, { target: { value: 'New Test Activity' } });
    
    // Click the Add button
    fireEvent.click(screen.getByText('Add'));
    
    // New activity should appear in the list
    expect(await screen.findByRole('heading', { name: 'New Test Activity' })).toBeInTheDocument();
    
    // Input should be cleared
    expect(input).toHaveValue('');
    
    // It should have assigned a color to the activity
    expect(colorUtils.getNextAvailableColorSet).toHaveBeenCalled();
  });

  it('should add activity in pending state without starting it', async () => {
    render(
      <ActivityManager onActivitySelect={mockOnActivitySelect}
        onActivityRemove={mockOnActivityRemove}
        currentActivityId={null}
        completedActivityIds={[]}
        timelineEntries={[]}
      />
    );
    
    // Type in a new activity name
    const input = screen.getByPlaceholderText('New activity name');
    fireEvent.change(input, { target: { value: 'New Test Activity' } });
    
    // Click the Add button
    fireEvent.click(screen.getByText('Add'));

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
      <ActivityManager onActivitySelect={mockOnActivitySelect}
        onActivityRemove={mockOnActivityRemove}
        currentActivityId="1" // Homework is current
        completedActivityIds={[]}
        timelineEntries={[]}
      />
    );
    
    // Wait for activities to render
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Homework' })).toBeInTheDocument();
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
      <ActivityManager onActivitySelect={mockOnActivitySelect}
        onActivityRemove={mockOnActivityRemove}
        currentActivityId={null}
        completedActivityIds={['1']} // Homework is completed
        timelineEntries={[]}
      />
    );
    
    // Wait for activities to render
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Homework' })).toBeInTheDocument();
    });
    
    // Should show "Completed" icon/label
    expect(await screen.findByLabelText('Completed')).toBeInTheDocument();
    
    // Find the homework activity item by using getByRole for the heading
    const homeworkHeading = screen.getByRole('heading', { name: 'Homework' });
    const homeworkItem = homeworkHeading.closest('.activityItem') as HTMLElement;
    if (!homeworkItem) {
      throw new Error('Could not find homework item container');
    }
    
    // The homework item should not contain start/complete buttons in the content area, only in actions
    // Completed activities still have buttons in the action area but no action buttons like start
    const startButtons = within(homeworkItem).queryAllByLabelText('Start');
    const completeButtons = within(homeworkItem).queryAllByLabelText('Complete');
    
    // Should not have start or complete buttons for completed activities
    expect(startButtons.length).toBe(0);
    expect(completeButtons.length).toBe(0);
  });
  
  it('should allow removing an activity', async () => {
    render(
      <ActivityManager onActivitySelect={mockOnActivitySelect}
        onActivityRemove={mockOnActivityRemove}
        currentActivityId={null}
        completedActivityIds={[]}
        timelineEntries={[]}
      />
    );
    
    // Wait for activities to render
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Homework' })).toBeInTheDocument();
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
      <ActivityManager onActivitySelect={mockOnActivitySelect}
        onActivityRemove={mockOnActivityRemove}
        currentActivityId={null}
        completedActivityIds={[]}
        timelineEntries={timelineEntries}
      />
    );
    
    // Wait for activities to render
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Homework' })).toBeInTheDocument();
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
      <ActivityManager onActivitySelect={mockOnActivitySelect}
        onActivityRemove={mockOnActivityRemove}
        currentActivityId={null}
        completedActivityIds={[]}
        timelineEntries={[]}
        isTimeUp={true}
      />
    );
    
    // Form section should not be rendered when time is up
    const form = screen.queryByTestId('activity-form');
    expect(form).not.toBeInTheDocument();
    
    // Should show different description
    expect(screen.getByText('Time is up! No more activities can be added.')).toBeInTheDocument();
    
    // Activities should still be visible though
    expect(screen.getByRole('heading', { name: 'Homework' })).toBeInTheDocument();
  });
  
  it('should start an activity when clicking Start', async () => {
    render(
      <ActivityManager onActivitySelect={mockOnActivitySelect}
        onActivityRemove={mockOnActivityRemove}
        currentActivityId={null}
        completedActivityIds={[]}
        timelineEntries={[]}
      />
    );
    
    // Wait for activities to render and initialization to complete
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Homework' })).toBeInTheDocument();
    });
    
    // Clear mocks after initialization but before the action we're testing
    mockOnActivitySelect.mockClear();
    
    // Find the first activity item using the heading
    const homeworkHeading = screen.getByRole('heading', { name: 'Homework' });
    const homeworkItem = homeworkHeading.closest('.activityItem') as HTMLElement;
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
      <ActivityManager onActivitySelect={mockOnActivitySelect}
        onActivityRemove={mockOnActivityRemove}
        currentActivityId="1" // Homework is running
        completedActivityIds={[]}
        timelineEntries={[]}
        elapsedTime={30}
      />
    );
    
    // Wait for activities to render
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Homework' })).toBeInTheDocument();
    });
    
    // Check if the timer is displayed with the correct time
    expect(screen.getByText('00:30')).toBeInTheDocument();
  });
  
  it('should not show timer for non-running activities', async () => {
    render(
      <ActivityManager onActivitySelect={mockOnActivitySelect}
        onActivityRemove={mockOnActivityRemove}
        currentActivityId="2" // Reading is running
        completedActivityIds={[]}
        timelineEntries={[]}
        elapsedTime={30}
      />
    );
    
    // Wait for activities to render and find the Homework item
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Homework' })).toBeInTheDocument();
    });
    
    // The Homework activity (not running) should not show the timer
    const homeworkHeading = screen.getByRole('heading', { name: 'Homework' });
    const homeworkItem = homeworkHeading.closest('.activityItem') as HTMLElement;
    expect(within(homeworkItem).queryByText('00:30')).not.toBeInTheDocument();
  });
});