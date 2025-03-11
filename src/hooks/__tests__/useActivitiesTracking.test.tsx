import { renderHook, act } from '@testing-library/react';
import { useActivitiesTracking } from '../useActivitiesTracking';

describe('useActivitiesTracking', () => {
  const mockActivityId1 = '1';
  const mockActivityId2 = '2';
  const mockActivityId3 = '3';

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

    act(() => {
      result.current.addActivity(mockActivityId1);
    });

    expect(result.current.activities.has(mockActivityId1)).toBe(true);
    expect(result.current.allActivityIds.has(mockActivityId1)).toBe(true);
  });

  it('should track started activities', () => {
    const { result } = renderHook(() => useActivitiesTracking());

    act(() => {
      result.current.addActivity(mockActivityId1);
      result.current.startActivity(mockActivityId1);
    });

    expect(result.current.startedActivityIds.has(mockActivityId1)).toBe(true);
    expect(result.current.hasActuallyStartedActivity).toBe(true);
  });

  it('should track completed activities', () => {
    const { result } = renderHook(() => useActivitiesTracking());

    // Add the activity
    act(() => {
      result.current.addActivity(mockActivityId1);
    });

    // Start the activity - now in a separate act call
    act(() => {
      result.current.startActivity(mockActivityId1);
    });

    // Complete the activity - now in a separate act call
    act(() => {
      result.current.completeActivity(mockActivityId1);
    });

    expect(result.current.completedActivityIds).toContain(mockActivityId1);
    expect(result.current.activities.has(mockActivityId1)).toBe(false);
  });

  it('should not mark activity as completed if it was not started', () => {
    const { result } = renderHook(() => useActivitiesTracking());

    act(() => {
      result.current.addActivity(mockActivityId1);
      result.current.completeActivity(mockActivityId1);
    });

    expect(result.current.completedActivityIds).not.toContain(mockActivityId1);
    expect(result.current.activities.has(mockActivityId1)).toBe(false);
  });

  it('should track removed activities', () => {
    const { result } = renderHook(() => useActivitiesTracking());

    act(() => {
      result.current.addActivity(mockActivityId1);
      result.current.removeActivity(mockActivityId1);
    });

    expect(result.current.removedActivityIds).toContain(mockActivityId1);
    expect(result.current.activities.has(mockActivityId1)).toBe(false);
  });

  it('should preserve started status when removing activities', () => {
    const { result } = renderHook(() => useActivitiesTracking());

    act(() => {
      result.current.addActivity(mockActivityId1);
      result.current.startActivity(mockActivityId1);
      result.current.removeActivity(mockActivityId1);
    });

    expect(result.current.startedActivityIds.has(mockActivityId1)).toBe(true);
    expect(result.current.hasActuallyStartedActivity).toBe(true);
  });

  it('should reset all state', () => {
    const { result } = renderHook(() => useActivitiesTracking());

    act(() => {
      result.current.addActivity(mockActivityId1);
      result.current.startActivity(mockActivityId1);
      result.current.completeActivity(mockActivityId1);
      result.current.addActivity(mockActivityId2);
      result.current.removeActivity(mockActivityId2);
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