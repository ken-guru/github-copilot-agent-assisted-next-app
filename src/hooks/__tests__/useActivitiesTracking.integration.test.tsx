import { useActivitiesTracking } from '../useActivitiesTracking';
import { renderHook, act } from '@testing-library/react';

describe('useActivitiesTracking - Duplicate Activity Integration Test', () => {
  const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  
  beforeEach(() => {
    consoleSpy.mockClear();
  });
  
  afterAll(() => {
    consoleSpy.mockRestore();
  });
  
  it('should handle duplicate activity additions gracefully without errors', () => {
    const { result } = renderHook(() => useActivitiesTracking());
    
    // Add an activity with ID that will be duplicated
    const testActivityId = 'test-activity';
    
    // First addition should succeed
    act(() => {
      result.current.addActivity(testActivityId);
    });
    expect(result.current.activities.has(testActivityId)).toBe(true);
    
    // Second addition should be handled gracefully without throwing
    act(() => {
      result.current.addActivity(testActivityId);
    });
    
    // Activity should still be tracked properly
    expect(result.current.activities.has(testActivityId)).toBe(true);
    expect(result.current.allActivityIds.has(testActivityId)).toBe(true);
  });
  
  it('should allow normal activity lifecycle after duplicate addition attempts', () => {
    const { result } = renderHook(() => useActivitiesTracking());
    const testActivityId = 'lifecycle-test';
    
    // Add activity
    act(() => {
      result.current.addActivity(testActivityId);
    });
    
    // Try to add the same activity again (duplicate)
    act(() => {
      result.current.addActivity(testActivityId);
    });
    
    // Should still be able to start the activity
    act(() => {
      result.current.startActivity(testActivityId);
    });
    expect(result.current.startedActivityIds.has(testActivityId)).toBe(true);
    
    // Should be able to complete the activity
    act(() => {
      result.current.completeActivity(testActivityId);
    });
    expect(result.current.completedActivityIds).toContain(testActivityId);
  });
  
  it('should handle default activities with hardcoded IDs (1, 2, 3, 4)', () => {
    const { result } = renderHook(() => useActivitiesTracking());
    
    // Add default activities with hardcoded IDs
    const defaultIds = ['1', '2', '3', '4'];
    
    // First round of additions
    act(() => {
      defaultIds.forEach(id => result.current.addActivity(id));
    });
    
    // Should have added all activities
    defaultIds.forEach(id => {
      expect(result.current.activities.has(id)).toBe(true);
    });
    
    // Try adding the same activities again (duplicates)
    act(() => {
      defaultIds.forEach(id => result.current.addActivity(id));
    });
    
    // Should still have all activities and work properly
    defaultIds.forEach(id => {
      expect(result.current.activities.has(id)).toBe(true);
    });
    
    // Should be able to operate on these activities
    act(() => {
      result.current.startActivity('1');
    });
    expect(result.current.startedActivityIds.has('1')).toBe(true);
  });
});
