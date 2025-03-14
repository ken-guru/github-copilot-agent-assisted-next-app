import { renderHook, act } from '@testing-library/react';
import { useActivitiesTracking } from '../useActivitiesTracking';

describe('useActivitiesTracking', () => {
  // Create unique IDs for each test to avoid state interference between tests
  const getActivityId = (testName: string) => `${testName}_${Date.now()}`;

  it('should initialize with empty state', () => {
    const { result } = renderHook(() => useActivitiesTracking());

    expect(result.current.activities.size).toBe(0);
    expect(result.current.allActivityIds.size).toBe(0);
    expect(result.current.startedActivityIds.size).toBe(0);
    expect(result.current.completedActivityIds).toHaveLength(0);
    expect(result.current.removedActivityIds).toHaveLength(0);
    expect(result.current.hasActuallyStartedActivity).toBe(false);
  });

  it('should track added activities', () => {
    const { result } = renderHook(() => useActivitiesTracking());
    const id = getActivityId('trackAdded');

    act(() => {
      result.current.addActivity(id);
    });

    expect(result.current.activities.has(id)).toBe(true);
    expect(result.current.allActivityIds.has(id)).toBe(true);
  });

  it('should track started activities', () => {
    const { result } = renderHook(() => useActivitiesTracking());
    const id = getActivityId('trackStarted');

    act(() => {
      result.current.addActivity(id);
    });

    act(() => {
      result.current.startActivity(id);
    });

    expect(result.current.startedActivityIds.has(id)).toBe(true);
    expect(result.current.hasActuallyStartedActivity).toBe(true);
  });

  it('should track completed activities', () => {
    const { result } = renderHook(() => useActivitiesTracking());
    const id = getActivityId('trackCompleted');

    // Add the activity
    act(() => {
      result.current.addActivity(id);
    });

    // Start the activity
    act(() => {
      result.current.startActivity(id);
    });

    // Complete the activity
    act(() => {
      result.current.completeActivity(id);
    });

    expect(result.current.completedActivityIds).toContain(id);
    expect(result.current.activities.has(id)).toBe(false);
  });

  it('should complete activity when completeActivity is called, even if not explicitly started', () => {
    const { result } = renderHook(() => useActivitiesTracking());
    const id = getActivityId('autoComplete');

    // With our new state machine implementation, completing an activity 
    // will automatically transition it through the required states
    // (PENDING -> RUNNING -> COMPLETED)
    act(() => {
      result.current.addActivity(id);
    });

    // This should internally start and then complete the activity
    act(() => {
      result.current.completeActivity(id);
    });

    // The activity should now be in the completed list and removed from active activities
    expect(result.current.completedActivityIds).toContain(id);
    expect(result.current.activities.has(id)).toBe(false);
    expect(result.current.startedActivityIds.has(id)).toBe(true);
  });

  it('should track removed activities', () => {
    const { result } = renderHook(() => useActivitiesTracking());
    const id = getActivityId('trackRemoved');

    act(() => {
      result.current.addActivity(id);
    });

    act(() => {
      result.current.removeActivity(id);
    });

    expect(result.current.removedActivityIds).toContain(id);
    expect(result.current.activities.has(id)).toBe(false);
  });

  it('should preserve started status when removing activities', () => {
    const { result } = renderHook(() => useActivitiesTracking());
    const id = getActivityId('preserveStarted');

    act(() => {
      result.current.addActivity(id);
    });

    act(() => {
      result.current.startActivity(id);
    });

    act(() => {
      result.current.removeActivity(id);
    });

    expect(result.current.startedActivityIds.has(id)).toBe(true);
    expect(result.current.hasActuallyStartedActivity).toBe(true);
  });

  it('should reset all state', () => {
    const { result } = renderHook(() => useActivitiesTracking());
    const id1 = getActivityId('reset1');
    const id2 = getActivityId('reset2');

    act(() => {
      result.current.addActivity(id1);
    });

    act(() => {
      result.current.startActivity(id1);
    });

    act(() => {
      result.current.completeActivity(id1);
    });

    act(() => {
      result.current.addActivity(id2);
    });

    act(() => {
      result.current.removeActivity(id2);
    });

    act(() => {
      result.current.resetActivities();
    });

    expect(result.current.activities.size).toBe(0);
    expect(result.current.allActivityIds.size).toBe(0);
    expect(result.current.startedActivityIds.size).toBe(0);
    expect(result.current.completedActivityIds).toHaveLength(0);
    expect(result.current.removedActivityIds).toHaveLength(0);
    expect(result.current.hasActuallyStartedActivity).toBe(false);
  });
});