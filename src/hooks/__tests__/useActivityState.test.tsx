import { renderHook, act } from '@testing-library/react';
import { useActivityState } from '../useActivityState';

describe('useActivityState', () => {
  const mockActivity1 = { id: '1', name: 'Test Activity 1' };
  const mockActivity2 = { id: '2', name: 'Test Activity 2' };
  const mockActivity3 = { id: '3', name: 'Test Activity 3' };

  const waitForStateUpdate = () => act(() => new Promise(resolve => setTimeout(resolve, 0)));

  it('should mark all activities as completed when completing activities one by one', async () => {
    const { result } = renderHook(() => useActivityState());

    // First, start tracking these activities
    act(() => {
      result.current.handleActivitySelect(mockActivity1);
    });
    await waitForStateUpdate();
    
    act(() => {
      result.current.handleActivitySelect(mockActivity2);
    });
    await waitForStateUpdate();
    
    act(() => {
      result.current.handleActivitySelect(mockActivity3);
    });
    await waitForStateUpdate();

    // Now complete them one by one
    act(() => {
      result.current.handleActivitySelect(mockActivity1);
    });
    await waitForStateUpdate();
    
    act(() => {
      result.current.handleActivitySelect(null);
    });
    await waitForStateUpdate();

    act(() => {
      result.current.handleActivitySelect(mockActivity2);
    });
    await waitForStateUpdate();
    
    act(() => {
      result.current.handleActivitySelect(null);
    });
    await waitForStateUpdate();

    act(() => {
      result.current.handleActivitySelect(mockActivity3);
    });
    await waitForStateUpdate();
    
    act(() => {
      result.current.handleActivitySelect(null);
    });
    await waitForStateUpdate();

    expect(result.current.allActivitiesCompleted).toBe(true);
  });

  it('should mark all activities as completed when removing uncompleted activities', async () => {
    const { result } = renderHook(() => useActivityState());

    // First, start tracking these activities
    act(() => {
      result.current.handleActivitySelect(mockActivity1);
    });
    await waitForStateUpdate();
    
    act(() => {
      result.current.handleActivitySelect(mockActivity2);
    });
    await waitForStateUpdate();
    
    act(() => {
      result.current.handleActivitySelect(mockActivity3);
    });
    await waitForStateUpdate();

    // Start first activity
    act(() => {
      result.current.handleActivitySelect(mockActivity1);
    });
    await waitForStateUpdate();

    // Remove other activities
    act(() => {
      result.current.handleActivityRemoval(mockActivity2.id);
    });
    await waitForStateUpdate();
    
    act(() => {
      result.current.handleActivityRemoval(mockActivity3.id);
    });
    await waitForStateUpdate();

    // Complete the running activity
    act(() => {
      result.current.handleActivitySelect(null);
    });
    await waitForStateUpdate();

    expect(result.current.allActivitiesCompleted).toBe(true);
  });

  it('should mark all activities as completed when completing one and removing the rest', async () => {
    const { result } = renderHook(() => useActivityState());

    // First, start tracking these activities
    act(() => {
      result.current.handleActivitySelect(mockActivity1);
    });
    await waitForStateUpdate();
    
    act(() => {
      result.current.handleActivitySelect(mockActivity2);
    });
    await waitForStateUpdate();
    
    act(() => {
      result.current.handleActivitySelect(mockActivity3);
    });
    await waitForStateUpdate();

    // Start and complete first activity
    act(() => {
      result.current.handleActivitySelect(mockActivity1);
    });
    await waitForStateUpdate();
    
    act(() => {
      result.current.handleActivitySelect(null);
    });
    await waitForStateUpdate();

    // Remove remaining activities
    act(() => {
      result.current.handleActivityRemoval(mockActivity2.id);
    });
    await waitForStateUpdate();
    
    act(() => {
      result.current.handleActivityRemoval(mockActivity3.id);
    });
    await waitForStateUpdate();

    expect(result.current.allActivitiesCompleted).toBe(true);
  });

  it('should mark all activities as completed when removing all activities without starting any', async () => {
    const { result } = renderHook(() => useActivityState());

    // Initialize activities one by one
    act(() => {
      result.current.handleActivitySelect(mockActivity1);
    });
    await waitForStateUpdate();

    act(() => {
      result.current.handleActivitySelect(mockActivity2);
    });
    await waitForStateUpdate();

    act(() => {
      result.current.handleActivitySelect(mockActivity3);
    });
    await waitForStateUpdate();

    // Deselect any active activity
    act(() => {
      result.current.handleActivitySelect(null);
    });
    await waitForStateUpdate();

    // Remove all activities without starting any
    act(() => {
      result.current.handleActivityRemoval(mockActivity1.id);
    });
    await waitForStateUpdate();

    act(() => {
      result.current.handleActivityRemoval(mockActivity2.id);
    });
    await waitForStateUpdate();

    act(() => {
      result.current.handleActivityRemoval(mockActivity3.id);
    });
    await waitForStateUpdate();

    expect(result.current.allActivitiesCompleted).toBe(true);
  });

  describe('completion state', () => {
    it('should not mark as completed when there are no activities', () => {
      const { result } = renderHook(() => useActivityState());
      expect(result.current.allActivitiesCompleted).toBeFalsy();
    });

    it('should not mark as completed when there are pending activities', () => {
      const { result } = renderHook(() => useActivityState());

      // Add an activity
      act(() => {
        result.current.handleActivitySelect({
          id: '1',
          name: 'Test Activity'
        });
      });

      expect(result.current.allActivitiesCompleted).toBeFalsy();
    });

    it('should not mark as completed when an activity is running', () => {
      const { result } = renderHook(() => useActivityState());

      // Add and start an activity
      act(() => {
        result.current.handleActivitySelect({
          id: '1',
          name: 'Test Activity'
        });
      });

      expect(result.current.allActivitiesCompleted).toBeFalsy();
    });

    it('should mark as completed when all activities are completed or removed', () => {
      const { result } = renderHook(() => useActivityState());

      // Add and complete an activity
      act(() => {
        result.current.handleActivitySelect({
          id: '1',
          name: 'Test Activity'
        });
      });

      act(() => {
        result.current.handleActivitySelect(null); // Complete the activity
      });

      expect(result.current.allActivitiesCompleted).toBeTruthy();
    });

    it('should mark as completed when some activities are completed and others are removed', () => {
      const { result } = renderHook(() => useActivityState());

      // Add two activities
      act(() => {
        result.current.handleActivitySelect({
          id: '1',
          name: 'Activity 1'
        });
      });

      act(() => {
        result.current.handleActivitySelect({
          id: '2',
          name: 'Activity 2'
        });
      });

      // Complete one activity
      act(() => {
        result.current.handleActivitySelect(null);
      });

      // Remove the other activity
      act(() => {
        result.current.handleActivityRemoval('2');
      });

      expect(result.current.allActivitiesCompleted).toBeTruthy();
    });

    it('should not mark as completed if an activity is removed but another is pending', () => {
      const { result } = renderHook(() => useActivityState());

      // Add two activities
      act(() => {
        result.current.handleActivitySelect({
          id: '1',
          name: 'Activity 1'
        });
      });

      act(() => {
        result.current.handleActivitySelect({
          id: '2',
          name: 'Activity 2'
        });
      });

      // Remove one activity but leave the other pending
      act(() => {
        result.current.handleActivityRemoval('2');
      });

      expect(result.current.allActivitiesCompleted).toBeFalsy();
    });

    it('should not allow removal of activities that appear in timeline', () => {
      const { result } = renderHook(() => useActivityState());

      // Add and start an activity
      act(() => {
        result.current.handleActivitySelect({
          id: '1',
          name: 'Activity 1'
        });
      });

      // Try to remove the activity that's in the timeline
      act(() => {
        result.current.handleActivityRemoval('1');
      });

      // The activity should still be present in the timeline
      expect(result.current.timelineEntries.some(entry => entry.activityId === '1')).toBeTruthy();
    });
  });
});