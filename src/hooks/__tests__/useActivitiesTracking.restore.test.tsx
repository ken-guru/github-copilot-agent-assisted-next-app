import { renderHook, act } from '@testing-library/react';
import { useActivitiesTracking } from '../useActivitiesTracking';

describe('useActivitiesTracking - restore transition', () => {
  it('transitions REMOVED -> PENDING via restoreActivity and updates removedActivityIds', () => {
    const { result } = renderHook(() => useActivitiesTracking());
    const id = 'restore-me';

    // Add and remove
    act(() => {
      result.current.addActivity(id);
      result.current.removeActivity(id);
    });

    expect(result.current.removedActivityIds).toContain(id);
    expect(result.current.activities.has(id)).toBe(false);

    // Restore
    act(() => {
      result.current.restoreActivity(id);
    });

    // After restore, it should no longer be in removed and should be active again (PENDING)
    expect(result.current.removedActivityIds).not.toContain(id);
    expect(result.current.activities.has(id)).toBe(true);
  });

  it('reset clears removedActivityIds', () => {
    const { result } = renderHook(() => useActivitiesTracking());
    const id = 'to-reset';

    act(() => {
      result.current.addActivity(id);
      result.current.removeActivity(id);
      result.current.resetActivities();
    });

    expect(result.current.removedActivityIds).toHaveLength(0);
    expect(result.current.activities.size).toBe(0);
  });
});
