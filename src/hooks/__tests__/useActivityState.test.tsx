import { renderHook, act } from '@testing-library/react';
import { useActivityState } from '../useActivityState';

describe('useActivityState', () => {
  // Helper function to create unique test activities for each test
  const createTestActivities = (idPrefix: string) => ({
    activity1: { id: `${idPrefix}_1`, name: `${idPrefix} Activity 1` },
    activity2: { id: `${idPrefix}_2`, name: `${idPrefix} Activity 2` },
    activity3: { id: `${idPrefix}_3`, name: `${idPrefix} Activity 3` },
  });
  
  const waitForStateUpdate = () => act(() => new Promise(resolve => setTimeout(resolve, 0)));
  
  it('should mark all activities as completed when completing activities one by one', async () => {
    const { result } = renderHook(() => useActivityState());
    const { activity1, activity2, activity3 } = createTestActivities('test1');
    
    // Add activities to the list
    act(() => {
      result.current.handleActivitySelect(activity1);
      result.current.handleActivitySelect(activity2);
      result.current.handleActivitySelect(activity3);
    });
    await waitForStateUpdate();
    
    // Start and complete activity 1
    act(() => {
      result.current.handleActivitySelect(activity1); // Start
    });
    await waitForStateUpdate();
    
    act(() => {
      result.current.handleActivitySelect(null); // Complete
    });
    await waitForStateUpdate();
    
    // Start and complete activity 2
    act(() => {
      result.current.handleActivitySelect(activity2); // Start
    });
    await waitForStateUpdate();
    
    act(() => {
      result.current.handleActivitySelect(null); // Complete
    });
    await waitForStateUpdate();
    
    // Remove activity 3 without starting it
    act(() => {
      result.current.handleActivityRemoval(activity3.id);
    });
    await waitForStateUpdate();
    
    act(() => {
      result.current.checkActivitiesCompleted();
    });
    await waitForStateUpdate();
    
    expect(result.current.allActivitiesCompleted).toBe(true);
  });
  
  it('should mark activities as completed when starting some and removing others', async () => {
    const { result } = renderHook(() => useActivityState());
    const { activity1, activity2, activity3 } = createTestActivities('test2');
    
    // Add all activities
    act(() => {
      result.current.handleActivitySelect(activity1);
      result.current.handleActivitySelect(activity2);
      result.current.handleActivitySelect(activity3);
    });
    await waitForStateUpdate();
    
    // Start and complete activity 1
    act(() => {
      result.current.handleActivitySelect(activity1); // Start
    });
    await waitForStateUpdate();
    
    act(() => {
      result.current.handleActivitySelect(null); // Complete
    });
    await waitForStateUpdate();
    
    // Remove other activities without starting them
    act(() => {
      result.current.handleActivityRemoval(activity2.id);
      result.current.handleActivityRemoval(activity3.id);
    });
    await waitForStateUpdate();
    
    act(() => {
      result.current.checkActivitiesCompleted();
    });
    await waitForStateUpdate();
    
    // With our new state machine, completing at least one activity and removing the rest is considered completed
    expect(result.current.allActivitiesCompleted).toBe(true);
  });
  
  it('should NOT mark activities as completed when removing all activities without starting any', async () => {
    const { result } = renderHook(() => useActivityState());
    const { activity1, activity2, activity3 } = createTestActivities('test3');
    
    // Initialize activities
    act(() => {
      result.current.handleActivitySelect(activity1);
      result.current.handleActivitySelect(activity2);
      result.current.handleActivitySelect(activity3);
    });
    await waitForStateUpdate();
    
    // Remove all activities without starting any
    act(() => {
      result.current.handleActivityRemoval(activity1.id);
      result.current.handleActivityRemoval(activity2.id);
      result.current.handleActivityRemoval(activity3.id);
    });
    await waitForStateUpdate();
    
    act(() => {
      result.current.checkActivitiesCompleted();
    });
    await waitForStateUpdate();
    
    expect(result.current.allActivitiesCompleted).toBe(false);
  });
  
  describe('completion state', () => {
    it('should not mark as completed when there are no activities', () => {
      const { result } = renderHook(() => useActivityState());
      expect(result.current.allActivitiesCompleted).toBeFalsy();
    });
    
    it('should not mark as completed when there are pending activities', () => {
      const { result } = renderHook(() => useActivityState());
      const { activity1 } = createTestActivities('test4');
      
      // Add an activity without starting it
      act(() => {
        result.current.handleActivitySelect(activity1);
      });
      
      expect(result.current.allActivitiesCompleted).toBeFalsy();
    });
    
    it('should not mark as completed when an activity is running', () => {
      const onTimerStart = jest.fn();
      
      // Use a new hook instance to avoid state from previous tests
      const { result } = renderHook(() => useActivityState({ onTimerStart }));
      
      // Add a new activity with a unique ID
      const uniqueActivity = { id: 'unique_test5', name: 'Unique Activity Test 5' };
      
      // Add and start an activity
      act(() => {
        result.current.handleActivitySelect(uniqueActivity);
      });
      
      // Check that the activity is not completed since it's still running
      expect(result.current.allActivitiesCompleted).toBeFalsy();
    });
    
    it('should mark as completed when all activities are started and completed', () => {
      const { result } = renderHook(() => useActivityState());
      const { activity1 } = createTestActivities('test6');
      
      // Add activity
      act(() => {
        result.current.handleActivitySelect(activity1);
      });
      
      // Start activity
      act(() => {
        result.current.handleActivitySelect(activity1);
      });
      
      // Complete activity
      act(() => {
        result.current.handleActivitySelect(null);
      });
      
      expect(result.current.allActivitiesCompleted).toBeTruthy();
    });
    
    it('should mark as completed when some activities are completed and others are removed', async () => {
      const { result } = renderHook(() => useActivityState());
      const { activity1, activity2 } = createTestActivities('test7');
      
      // Add two activities
      act(() => {
        result.current.handleActivitySelect(activity1);
        result.current.handleActivitySelect(activity2);
      });
      await waitForStateUpdate();
      
      // Start and complete activity1
      act(() => {
        result.current.handleActivitySelect(activity1); // Start
      });
      await waitForStateUpdate();
      
      act(() => {
        result.current.handleActivitySelect(null); // Complete
      });
      await waitForStateUpdate();
      
      // Remove activity2 without starting it
      act(() => {
        result.current.handleActivityRemoval(activity2.id);
      });
      await waitForStateUpdate();
      
      act(() => {
        result.current.checkActivitiesCompleted();
      });
      await waitForStateUpdate();
      
      expect(result.current.allActivitiesCompleted).toBe(true);
    });
    
    it('should mark activities as completed when the last activity is completed after removing others', async () => {
      const { result } = renderHook(() => useActivityState());
      const { activity1, activity2 } = createTestActivities('test8');
      
      // Add two activities
      act(() => {
        result.current.handleActivitySelect(activity1);
        result.current.handleActivitySelect(activity2);
      });
      await waitForStateUpdate();
      
      // Start activity1
      act(() => {
        result.current.handleActivitySelect(activity1);
      });
      await waitForStateUpdate();
      
      // Remove activity2 without starting it
      act(() => {
        result.current.handleActivityRemoval(activity2.id);
      });
      await waitForStateUpdate();
      
      // Complete activity1
      act(() => {
        result.current.handleActivitySelect(null);
      });
      await waitForStateUpdate();
      
      act(() => {
        result.current.checkActivitiesCompleted();
      });
      await waitForStateUpdate();
      
      expect(result.current.allActivitiesCompleted).toBe(true);
    });
  });
  
  describe('reset functionality', () => {
    it('should reset all state when resetActivities is called', () => {
      const { result } = renderHook(() => useActivityState());
      const { activity1 } = createTestActivities('test9');
      
      // Add and start an activity
      act(() => {
        result.current.handleActivitySelect(activity1);
      });
      
      expect(result.current.currentActivity).toBeTruthy();
      expect(result.current.timelineEntries.length).toBe(1);
      
      // Reset the state
      act(() => {
        result.current.resetActivities();
      });
      
      // Verify everything is reset
      expect(result.current.currentActivity).toBeNull();
      expect(result.current.timelineEntries).toHaveLength(0);
      expect(result.current.completedActivityIds).toHaveLength(0);
      expect(result.current.allActivitiesCompleted).toBeFalsy();
    });
  });
});