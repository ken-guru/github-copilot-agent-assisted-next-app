import { renderHook, act } from '@testing-library/react';
import { useActivitiesTracking } from '../useActivitiesTracking';

describe('useActivitiesTracking', () => {
  // Create unique IDs for each test to avoid state interference between tests
  const getActivityIds = (testName: string) => ({
    id1: `${testName}_id1`,
    id2: `${testName}_id2`,
  });

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
    const { id1 } = getActivityIds('trackAdded');

    act(() => {
      result.current.addActivity(id1);
    });

    expect(result.current.activities.has(id1)).toBe(true);
    expect(result.current.allActivityIds.has(id1)).toBe(true);
  });

  it('should track started activities', () => {
    const { result } = renderHook(() => useActivitiesTracking());
    const { id1 } = getActivityIds('trackStarted');

    act(() => {
      result.current.addActivity(id1);
      result.current.startActivity(id1);
    });

    expect(result.current.startedActivityIds.has(id1)).toBe(true);
    expect(result.current.hasActuallyStartedActivity).toBe(true);
  });

  it('should track completed activities', () => {
    const { result } = renderHook(() => useActivitiesTracking());
    const { id1 } = getActivityIds('trackCompleted');

    // Add and start the activity in separate act calls to be more explicit
    act(() => {
      result.current.addActivity(id1);
    });

    act(() => {
      result.current.startActivity(id1);
    });

    act(() => {
      result.current.completeActivity(id1);
    });

    expect(result.current.completedActivityIds).toContain(id1);
    expect(result.current.activities.has(id1)).toBe(false);
  });

  it('should complete activity when completeActivity is called, even if not explicitly started', () => {
    const { result } = renderHook(() => useActivitiesTracking());
    const { id1 } = getActivityIds('autoComplete');

    // With our new state machine implementation, completing an activity 
    // will automatically transition it through the required states
    // (PENDING -> RUNNING -> COMPLETED)
    act(() => {
      result.current.addActivity(id1);
    });

    // This should internally start and then complete the activity
    act(() => {
      result.current.completeActivity(id1);
    });

    // The activity should now be in the completed list and removed from active activities
    expect(result.current.completedActivityIds).toContain(id1);
    expect(result.current.activities.has(id1)).toBe(false);
    expect(result.current.startedActivityIds.has(id1)).toBe(true);
  });

  it('should track removed activities', () => {
    const { result } = renderHook(() => useActivitiesTracking());
    const { id1 } = getActivityIds('trackRemoved');

    act(() => {
      result.current.addActivity(id1);
      result.current.removeActivity(id1);
    });

    expect(result.current.removedActivityIds).toContain(id1);
    expect(result.current.activities.has(id1)).toBe(false);
  });

  it('should preserve started status when removing activities', () => {
    const { result } = renderHook(() => useActivitiesTracking());
    const { id1 } = getActivityIds('preserveStarted');

    act(() => {
      result.current.addActivity(id1);
      result.current.startActivity(id1);
      result.current.removeActivity(id1);
    });

    expect(result.current.startedActivityIds.has(id1)).toBe(true);
    expect(result.current.hasActuallyStartedActivity).toBe(true);
  });

  it('should reset all state', () => {
    const { result } = renderHook(() => useActivitiesTracking());
    const { id1, id2 } = getActivityIds('reset');

    act(() => {
      result.current.addActivity(id1);
      result.current.startActivity(id1);
      result.current.completeActivity(id1);
      result.current.addActivity(id2);
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