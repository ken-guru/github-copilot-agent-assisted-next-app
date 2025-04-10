import { renderHook, act } from '@testing-library/react';
import { useActivitiesTracking } from '../../hooks/useActivitiesTracking';

describe('useActivitiesTracking Duplicate Activity Handling', () => {
  it('should handle duplicate activity additions gracefully', () => {
    const { result } = renderHook(() => useActivitiesTracking());
    const id = 'duplicate-test';
    
    // First addition should succeed
    act(() => {
      result.current.addActivity(id);
    });
    
    expect(result.current.activities.has(id)).toBe(true);
    expect(result.current.allActivityIds.has(id)).toBe(true);
    
    // Track the state before attempting duplicate addition
    const activitiesCountBefore = result.current.activities.size;
    const allActivityIdsCountBefore = result.current.allActivityIds.size;
    
    // Second addition should be handled gracefully
    act(() => {
      result.current.addActivity(id);
    });
    
    // Verify state is unchanged and no duplicate was added
    expect(result.current.activities.size).toBe(activitiesCountBefore);
    expect(result.current.allActivityIds.size).toBe(allActivityIdsCountBefore);
    expect(result.current.activities.has(id)).toBe(true);
  });
  
  it('should maintain normal activity lifecycle after duplicate addition attempts', () => {
    const { result } = renderHook(() => useActivitiesTracking());
    const id = 'lifecycle-test';
    
    // Add activity
    act(() => {
      result.current.addActivity(id);
    });
    
    // Try to add same activity again
    act(() => {
      result.current.addActivity(id);
    });
    
    // Should be able to start the activity normally
    act(() => {
      result.current.startActivity(id);
    });
    
    expect(result.current.startedActivityIds.has(id)).toBe(true);
    
    // Should be able to complete the activity normally
    act(() => {
      result.current.completeActivity(id);
    });
    
    expect(result.current.completedActivityIds).toContain(id);
    
    // Activity should be properly tracked as completed
    expect(result.current.activities.has(id)).toBe(false);
  });
  
  it('should handle multiple duplicate additions of default activities', () => {
    const { result } = renderHook(() => useActivitiesTracking());
    
    // Add default activities with hardcoded IDs (simulating ActivityManager behavior)
    const defaultIds = ['1', '2', '3', '4'];
    
    // First round of additions
    act(() => {
      defaultIds.forEach(id => result.current.addActivity(id));
    });
    
    expect(result.current.allActivityIds.size).toBe(4);
    
    // Try adding the same activities again (simulating re-render)
    act(() => {
      defaultIds.forEach(id => result.current.addActivity(id));
    });
    
    // Should still have only 4 activities
    expect(result.current.allActivityIds.size).toBe(4);
    
    // Activities should be in expected states
    defaultIds.forEach(id => {
      expect(result.current.activities.has(id)).toBe(true);
    });
    
    // Should be able to operate on these activities normally
    act(() => {
      result.current.startActivity('1');
    });
    
    expect(result.current.startedActivityIds.has('1')).toBe(true);
  });
});
