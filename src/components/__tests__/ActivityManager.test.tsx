import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import ActivityManager from '../ActivityManager';
import * as colorUtils from '../../utils/colors';
import { act } from 'react-dom/test-utils';

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
    
    // Find the form elements using proper role queries
    const input = screen.getByRole('textbox', { name: /new activity name/i });
    const addButton = screen.getByRole('button', { name: /add/i });
    
    // Add a new activity
    fireEvent.change(input, { target: { value: 'New Test Activity' } });
    fireEvent.click(addButton);
    
    // New activity should appear in the list
    expect(await screen.findByText('New Test Activity')).toBeInTheDocument();
    
    // Input should be cleared
    expect(input).toHaveValue('');
    
    // It should have assigned a color to the activity
    expect(colorUtils.getNextAvailableColorSet).toHaveBeenCalled();
  });
  
  it('should mark an activity as completed when clicking Complete', async () => {
    render(
      <ActivityManager 
        onActivitySelect={mockOnActivitySelect}
        onActivityRemove={mockOnActivityRemove}
        currentActivityId="homework" // Homework is current
        completedActivityIds={[]}
        timelineEntries={[]}
      />
    );
    
    // Wait for activities to render
    await waitFor(() => {
      expect(screen.getByText('Homework')).toBeInTheDocument();
    });
    
    // Find the Complete button using data-testid
    const completeButton = await screen.findByTestId('complete-activity-homework');
    
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
        completedActivityIds={['homework']} // Homework is completed
        timelineEntries={[]}
      />
    );
    
    // Wait for activities to render
    await waitFor(() => {
      expect(screen.getByText('Homework')).toBeInTheDocument();
    });
    
    // Find the homework item
    const homeworkItem = await screen.findByTestId('activity-homework');
    
    // Check for the completedActivityItem class or other indicators
    const completedElement = homeworkItem.querySelector(`.${homeworkItem.className.includes('completed') ? 'completedActivityItem' : ''}`);
    expect(completedElement).toBeTruthy();
    
    // Find the homework container div
    const homeworkContent = screen.getByText('Homework').closest('div');
    if (!homeworkContent) {
      throw new Error('Could not find homework item container');
    }
    
    // The homework item should not contain start/complete buttons
    // We need to check this differently since there are multiple Start buttons in the document
    const homeworkButtons = within(homeworkContent).queryAllByRole('button');
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
    fireEvent.click(removeButtons[0]);
    
    // Should call onActivityRemove
    expect(mockOnActivityRemove).toHaveBeenCalledTimes(1);
  });
  
  it('should disable removing activities that appear in the timeline', async () => {
    const timelineEntries = [
      {
        id: '1',
        activityId: 'homework', // Homework in timeline
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
    
    // Check if the remove button for Homework is disabled
    const homeworkRemoveButton = await screen.findByTestId('remove-activity-homework');
    expect(homeworkRemoveButton).toHaveAttribute('disabled');
    
    // Find another remove button that should not be disabled
    const readingRemoveButton = await screen.findByTestId('remove-activity-reading');
    expect(readingRemoveButton).not.toHaveAttribute('disabled');
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
    
    // Find form elements using proper role queries
    const input = screen.getByRole('textbox');
    const addButton = screen.getByRole('button', { name: /add/i });
    
    // Verify disabled state
    expect(input).toBeDisabled();
    expect(addButton).toBeDisabled();
    
    // Verify placeholder text
    expect(input).toHaveAttribute('placeholder', 'Time is up!');
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
    
    // Find the start button for Homework
    const startButton = await screen.findByTestId('start-activity-homework');
    fireEvent.click(startButton);
    
    // Should call onActivitySelect with the activity object
    expect(mockOnActivitySelect).toHaveBeenCalledTimes(1);
    expect(mockOnActivitySelect.mock.calls[0][0]).toHaveProperty('id', 'homework');
    expect(mockOnActivitySelect.mock.calls[0][0]).toHaveProperty('name', 'Homework');
  });
  
  it('should pass elapsedTime to running activity', async () => {
    render(
      <ActivityManager 
        onActivitySelect={mockOnActivitySelect}
        onActivityRemove={mockOnActivityRemove}
        currentActivityId="homework" // Homework is running
        completedActivityIds={[]}
        timelineEntries={[]}
        elapsedTime={30000} // 30 seconds in milliseconds
      />
    );
    
    // Wait for activities to render
    await waitFor(() => {
      expect(screen.getByText('Homework')).toBeInTheDocument();
    });
    
    // Find the running activity element
    const homeworkItem = await screen.findByTestId('activity-homework');
    
    // Check if the timer element is present inside the activity element
    const timerElement = homeworkItem.querySelector('.timerDisplay');
    expect(timerElement).toBeInTheDocument();
  });
  
  it('should not show timer for non-running activities', async () => {
    render(
      <ActivityManager 
        onActivitySelect={mockOnActivitySelect}
        onActivityRemove={mockOnActivityRemove}
        currentActivityId="reading" // Reading is running
        completedActivityIds={[]}
        timelineEntries={[]}
        elapsedTime={30000}
      />
    );
    
    // Wait for activities to render and find the Homework item
    await waitFor(() => {
      expect(screen.getByText('Homework')).toBeInTheDocument();
    });
    
    // Find the homework activity element
    const homeworkItem = await screen.findByTestId('activity-homework');
    
    // Homework activity (not running) should not have a timer element
    const timerElement = homeworkItem.querySelector('.timerDisplay');
    expect(timerElement).not.toBeInTheDocument();
  });

  describe('Planning Mode', () => {
    it('should start with an empty list in planning mode', async () => {
      render(
        <ActivityManager 
          onActivitySelect={mockOnActivitySelect}
          onActivityRemove={mockOnActivityRemove}
          currentActivityId={null}
          completedActivityIds={[]}
          timelineEntries={[]}
          planningMode={true}
        />
      );
      
      // Should show planning mode heading
      expect(screen.getByText('Plan Your Activities')).toBeInTheDocument();
      
      // Should show empty state message
      expect(screen.getByText('Add activities to get started')).toBeInTheDocument();
      
      // Should not render any default activities
      expect(screen.queryByText('Homework')).not.toBeInTheDocument();
      expect(screen.queryByText('Reading')).not.toBeInTheDocument();
      expect(screen.queryByText('Play Time')).not.toBeInTheDocument();
      expect(screen.queryByText('Chores')).not.toBeInTheDocument();
    });

    it('should allow adding activities in planning mode', async () => {
      render(
        <ActivityManager 
          onActivitySelect={mockOnActivitySelect}
          onActivityRemove={mockOnActivityRemove}
          currentActivityId={null}
          completedActivityIds={[]}
          timelineEntries={[]}
          planningMode={true}
        />
      );
      
      // Type in a new activity name
      const input = screen.getByPlaceholderText('New activity name');
      fireEvent.change(input, { target: { value: 'New Test Activity' } });
      
      // Click the Add button
      fireEvent.click(screen.getByText('Add'));
      
      // New activity should appear in the list
      expect(await screen.findByText('New Test Activity')).toBeInTheDocument();
      
      // Should call onActivitySelect with justAdd=true
      expect(mockOnActivitySelect).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'New Test Activity'
        }),
        true
      );
    });

    it('should show transition button when activities are added', async () => {
      render(
        <ActivityManager 
          onActivitySelect={mockOnActivitySelect}
          onActivityRemove={mockOnActivityRemove}
          currentActivityId={null}
          completedActivityIds={[]}
          timelineEntries={[]}
          planningMode={true}
          onStartActivities={jest.fn()}
        />
      );
      
      // Initially, transition button should be disabled
      const initialButton = screen.getByText('Start Activities');
      expect(initialButton).toBeDisabled();
      
      // Add an activity
      const input = screen.getByPlaceholderText('New activity name');
      fireEvent.change(input, { target: { value: 'Test Activity' } });
      fireEvent.click(screen.getByText('Add'));
      
      // Now the transition button should be enabled
      await waitFor(() => {
        const button = screen.getByText('Start Activities');
        expect(button).toBeEnabled();
      });
    });

    it('should trigger transition when clicking Start Activities', async () => {
      const mockStartActivities = jest.fn();
      render(
        <ActivityManager 
          onActivitySelect={mockOnActivitySelect}
          onActivityRemove={mockOnActivityRemove}
          currentActivityId={null}
          completedActivityIds={[]}
          timelineEntries={[]}
          planningMode={true}
          onStartActivities={mockStartActivities}
        />
      );
      
      // Add an activity
      const input = screen.getByPlaceholderText('New activity name');
      fireEvent.change(input, { target: { value: 'Test Activity' } });
      fireEvent.click(screen.getByText('Add'));
      
      // Click the transition button
      const transitionButton = await screen.findByText('Start Activities');
      fireEvent.click(transitionButton);
      
      // Should call onStartActivities
      expect(mockStartActivities).toHaveBeenCalled();
    });

    it('should disable transition button when no activities are planned', async () => {
      const mockStartActivities = jest.fn();
      render(
        <ActivityManager 
          onActivitySelect={mockOnActivitySelect}
          onActivityRemove={mockOnActivityRemove}
          currentActivityId={null}
          completedActivityIds={[]}
          timelineEntries={[]}
          planningMode={true}
          onStartActivities={mockStartActivities}
        />
      );
      
      // Add and then remove an activity
      const input = screen.getByPlaceholderText('New activity name');
      fireEvent.change(input, { target: { value: 'Test Activity' } });
      fireEvent.click(screen.getByText('Add'));
      
      const transitionButton = await screen.findByText('Start Activities');
      expect(transitionButton).toBeEnabled();
      
      // Remove the activity
      const removeButton = await screen.findByRole('button', { name: 'Remove' });
      fireEvent.click(removeButton);
      
      // Wait for button to be disabled after state update
      await waitFor(() => {
        expect(transitionButton).toBeDisabled();
      });
    });

    describe('Activity Reordering', () => {
      const createDragEvent = (type: string) => {
        const event = new Event(type, { bubbles: true });
        Object.defineProperty(event, 'dataTransfer', {
          value: {
            setData: jest.fn(),
            getData: jest.fn(),
            effectAllowed: null,
            dropEffect: null
          }
        });
        return event;
      };

      const simulateDragAndDrop = async (draggedItem: HTMLElement, dropTarget: HTMLElement) => {
        await act(async () => {
          // Create dragstart event
          const dragStartEvent = createDragEvent('dragstart');
          draggedItem.dispatchEvent(dragStartEvent);
        });

        await act(async () => {
          // Create dragover event
          const dragOverEvent = createDragEvent('dragover');
          dropTarget.dispatchEvent(dragOverEvent);
        });

        await act(async () => {
          // Create drop event
          const dropEvent = createDragEvent('drop');
          dropTarget.dispatchEvent(dropEvent);
        });

        await act(async () => {
          // Create dragend event
          const dragEndEvent = createDragEvent('dragend');
          draggedItem.dispatchEvent(dragEndEvent);
        });
      };

      it('should allow reordering activities in planning mode', async () => {
        render(
          <ActivityManager 
            onActivitySelect={mockOnActivitySelect}
            onActivityRemove={mockOnActivityRemove}
            currentActivityId={null}
            completedActivityIds={[]}
            timelineEntries={[]}
            planningMode={true}
            onStartActivities={jest.fn()}
          />
        );
        
        // Add two activities
        const input = screen.getByPlaceholderText('New activity name');
        
        // Add first activity
        fireEvent.change(input, { target: { value: 'First Activity' } });
        fireEvent.click(screen.getByText('Add'));
        
        // Add second activity
        fireEvent.change(input, { target: { value: 'Second Activity' } });
        fireEvent.click(screen.getByText('Add'));
        
        // Get activity items
        const activities = await screen.findAllByRole('listitem');
        expect(activities).toHaveLength(2);
        
        // Initially, First Activity should be first
        const firstActivity = activities[0];
        const secondActivity = activities[1];
        
        // Simulate drag and drop
        await simulateDragAndDrop(secondActivity, firstActivity);
        
        // Wait for state updates and verify order
        await waitFor(() => {
          const activitiesAfter = screen.getAllByRole('listitem');
          expect(activitiesAfter[0]).toHaveTextContent('Second Activity');
          expect(activitiesAfter[1]).toHaveTextContent('First Activity');
        });
      });

      it('should maintain activity order after adding new activities', async () => {
        render(
          <ActivityManager 
            onActivitySelect={mockOnActivitySelect}
            onActivityRemove={mockOnActivityRemove}
            currentActivityId={null}
            completedActivityIds={[]}
            timelineEntries={[]}
            planningMode={true}
            onStartActivities={jest.fn()}
          />
        );
        
        // Add two activities
        const input = screen.getByPlaceholderText('New activity name');
        
        // Add activities
        fireEvent.change(input, { target: { value: 'First Activity' } });
        fireEvent.click(screen.getByText('Add'));
        fireEvent.change(input, { target: { value: 'Second Activity' } });
        fireEvent.click(screen.getByText('Add'));
        
        // Get and reorder activities
        const activities = await screen.findAllByRole('listitem');
        await simulateDragAndDrop(activities[1], activities[0]);
        
        // Add a third activity
        fireEvent.change(input, { target: { value: 'Third Activity' } });
        fireEvent.click(screen.getByText('Add'));
        
        // Wait for state updates and verify order
        await waitFor(() => {
          const activitiesAfter = screen.getAllByRole('listitem');
          expect(activitiesAfter[0]).toHaveTextContent('Second Activity');
          expect(activitiesAfter[1]).toHaveTextContent('First Activity');
          expect(activitiesAfter[2]).toHaveTextContent('Third Activity');
        });
      });

      it('should not allow reordering in non-planning mode', async () => {
        render(
          <ActivityManager 
            onActivitySelect={mockOnActivitySelect}
            onActivityRemove={mockOnActivityRemove}
            currentActivityId={null}
            completedActivityIds={[]}
            timelineEntries={[]}
            planningMode={false}
          />
        );
        
        // Wait for default activities to render
        await waitFor(() => {
          expect(screen.getByText('Homework')).toBeInTheDocument();
          expect(screen.getByText('Reading')).toBeInTheDocument();
        });
        
        // Activities should not be draggable
        const activities = screen.getAllByRole('listitem');
        activities.forEach(activity => {
          expect(activity.getAttribute('draggable')).toBe('false');
        });
      });
    });

    it('should start with empty state in planning mode', () => {
      render(
        <ActivityManager 
          onActivitySelect={mockOnActivitySelect}
          onActivityRemove={mockOnActivityRemove}
          currentActivityId={null}
          completedActivityIds={[]}
          timelineEntries={[]}
          planningMode={true}
          onStartActivities={jest.fn()}
        />
      );
      
      // Should show planning mode heading
      expect(screen.getByText('Plan Your Activities')).toBeInTheDocument();
      
      // Should show empty state message
      expect(screen.getByText('Add activities to get started')).toBeInTheDocument();
      
      // Should not render any default activities
      expect(screen.queryByText('Homework')).not.toBeInTheDocument();
      expect(screen.queryByText('Reading')).not.toBeInTheDocument();
      expect(screen.queryByText('Play Time')).not.toBeInTheDocument();
      expect(screen.queryByText('Chores')).not.toBeInTheDocument();
    });

    it('should disable Start Activities button when no activities exist', () => {
      render(
        <ActivityManager 
          onActivitySelect={mockOnActivitySelect}
          onActivityRemove={mockOnActivityRemove}
          currentActivityId={null}
          completedActivityIds={[]}
          timelineEntries={[]}
          planningMode={true}
          onStartActivities={jest.fn()}
        />
      );

      const startButton = screen.getByRole('button', { name: /start activities/i });
      expect(startButton).toBeDisabled();
      expect(startButton).toHaveAttribute('aria-disabled', 'true');
    });

    it('should enable Start Activities button when activities are added', async () => {
      render(
        <ActivityManager 
          onActivitySelect={mockOnActivitySelect}
          onActivityRemove={mockOnActivityRemove}
          currentActivityId={null}
          completedActivityIds={[]}
          timelineEntries={[]}
          planningMode={true}
          onStartActivities={jest.fn()}
        />
      );

      // Add an activity
      const input = screen.getByPlaceholderText(/new activity name/i);
      fireEvent.change(input, { target: { value: 'Test Activity' } });
      fireEvent.click(screen.getByText('Add'));

      // Start Activities button should be enabled
      const startButton = screen.getByRole('button', { name: /start activities/i });
      expect(startButton).not.toBeDisabled();
      expect(startButton).toHaveAttribute('aria-disabled', 'false');
    });

    it('should maintain empty state message when all activities are removed', () => {
      render(
        <ActivityManager 
          onActivitySelect={mockOnActivitySelect}
          onActivityRemove={mockOnActivityRemove}
          currentActivityId={null}
          completedActivityIds={[]}
          timelineEntries={[]}
          planningMode={true}
          onStartActivities={jest.fn()}
        />
      );

      // Add and then remove an activity
      const input = screen.getByPlaceholderText(/new activity name/i);
      fireEvent.change(input, { target: { value: 'Test Activity' } });
      fireEvent.click(screen.getByText('Add'));

      // Remove the activity
      fireEvent.click(screen.getByLabelText(/remove test activity/i));

      // Should show empty state message again
      expect(screen.getByText('Add activities to get started')).toBeInTheDocument();
      
      // Start Activities button should be disabled again
      const startButton = screen.getByRole('button', { name: /start activities/i });
      expect(startButton).toBeDisabled();
      expect(startButton).toHaveAttribute('aria-disabled', 'true');
    });
  });
});