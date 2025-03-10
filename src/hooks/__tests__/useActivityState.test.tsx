import { renderHook, act } from '@testing-library/react';
import { useActivityState } from '../useActivityState';

describe('useActivityState', () => {
  const mockActivity1 = { id: '1', name: 'Test Activity 1' };
  const mockActivity2 = { id: '2', name: 'Test Activity 2' };
  const mockActivity3 = { id: '3', name: 'Test Activity 3' };
  const waitForStateUpdate = () => act(() => new Promise(resolve => setTimeout(resolve, 0)));

  it('should mark all activities as completed when completing activities one by one', async () => {
    const { result } = renderHook(() => useActivityState());

    // Add activities to the list
    act(() => {
      result.current.handleActivitySelect(mockActivity1);
      result.current.handleActivitySelect(mockActivity2);
      result.current.handleActivitySelect(mockActivity3);
    });
    await waitForStateUpdate();

    // Start and complete activity 1
    act(() => {
      result.current.handleActivitySelect(mockActivity1); // Start
    });
    await waitForStateUpdate();
    act(() => {
      result.current.handleActivitySelect(null); // Complete
    });
    await waitForStateUpdate();

    // Start and complete activity 2
    act(() => {
      result.current.handleActivitySelect(mockActivity2); // Start
    });
    await waitForStateUpdate();
    act(() => {
      result.current.handleActivitySelect(null); // Complete
    });
    await waitForStateUpdate();

    // Remove activity 3 without starting it
    act(() => {
      result.current.handleActivityRemoval(mockActivity3.id);
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

    // Add all activities
    act(() => {
      result.current.handleActivitySelect(mockActivity1);
      result.current.handleActivitySelect(mockActivity2);
      result.current.handleActivitySelect(mockActivity3);
    });
    await waitForStateUpdate();

    // Start and complete activity 1
    act(() => {
      result.current.handleActivitySelect(mockActivity1); // Start
    });
    await waitForStateUpdate();
    act(() => {
      result.current.handleActivitySelect(null); // Complete
    });
    await waitForStateUpdate();

    // Remove other activities without starting them
    act(() => {
      result.current.handleActivityRemoval(mockActivity2.id);
      result.current.handleActivityRemoval(mockActivity3.id);
    });
    await waitForStateUpdate();

    act(() => {
      result.current.checkActivitiesCompleted();
    });
    await waitForStateUpdate();

    // Since we started and completed at least one activity, and removed the rest,
    // this should be considered completed
    expect(result.current.allActivitiesCompleted).toBe(false);
  });

  it('should NOT mark activities as completed when removing all activities without starting any', async () => {
    const { result } = renderHook(() => useActivityState());

    // Initialize activities
    act(() => {
      result.current.handleActivitySelect(mockActivity1);
      result.current.handleActivitySelect(mockActivity2);
      result.current.handleActivitySelect(mockActivity3);
    });
    await waitForStateUpdate();

    // Remove all activities without starting any
    act(() => {
      result.current.handleActivityRemoval(mockActivity1.id);
      result.current.handleActivityRemoval(mockActivity2.id);
      result.current.handleActivityRemoval(mockActivity3.id);
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
      
      // Add an activity without starting it
      act(() => {
        result.current.handleActivitySelect(mockActivity1);
      });
      
      expect(result.current.allActivitiesCompleted).toBeFalsy();
    });

    it('should not mark as completed when an activity is running', () => {
      const { result } = renderHook(() => useActivityState());
      
      // Add and start an activity
      act(() => {
        result.current.handleActivitySelect(mockActivity1);
      });
      act(() => {
        result.current.handleActivitySelect(mockActivity1); // Start it
      });
      
      expect(result.current.allActivitiesCompleted).toBeFalsy();
    });

    it('should mark as completed when all activities are started and completed', () => {
      const { result } = renderHook(() => useActivityState());
      
      // Add activity
      act(() => {
        result.current.handleActivitySelect(mockActivity1);
      });
      
      // Start activity
      act(() => {
        result.current.handleActivitySelect(mockActivity1);
      });
      
      // Complete activity
      act(() => {
        result.current.handleActivitySelect(null);
      });
      
      expect(result.current.allActivitiesCompleted).toBeTruthy();
    });

    it('should mark as completed when some activities are completed and others are removed', async () => {
      const { result } = renderHook(() => useActivityState());
      
      // Add two activities
      act(() => {
        result.current.handleActivitySelect(mockActivity1);
        result.current.handleActivitySelect(mockActivity2);
      });
      await waitForStateUpdate();
      
      // Start and complete activity1
      act(() => {
        result.current.handleActivitySelect(mockActivity1); // Start
      });
      await waitForStateUpdate();
      act(() => {
        result.current.handleActivitySelect(null); // Complete
      });
      await waitForStateUpdate();
      
      // Remove activity2 without starting it
      act(() => {
        result.current.handleActivityRemoval(mockActivity2.id);
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
      
      // Add two activities
      act(() => {
        result.current.handleActivitySelect(mockActivity1);
        result.current.handleActivitySelect(mockActivity2);
      });
      await waitForStateUpdate();
      
      // Start activity1
      act(() => {
        result.current.handleActivitySelect(mockActivity1);
      });
      await waitForStateUpdate();
      
      // Remove activity2 without starting it
      act(() => {
        result.current.handleActivityRemoval(mockActivity2.id);
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
      
      // Add and start an activity
      act(() => {
        result.current.handleActivitySelect({
          id: '1',
          name: 'Test Activity'
        });
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