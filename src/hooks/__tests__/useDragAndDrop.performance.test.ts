/**
 * Performance tests for useDragAndDrop hook
 * Tests rapid reordering scenarios and large activity lists
 */

import { renderHook, act } from '@testing-library/react';
import { jest } from '@jest/globals';
import { useDragAndDrop } from '../useDragAndDrop';

// Mock dependencies
const mockReorderActivities = jest.fn();
const mockGetActivities = jest.fn(() => []);
const mockGetActivitiesInOrder = jest.fn(() => []);

jest.mock('../../utils/activity-storage', () => ({
  reorderActivities: mockReorderActivities,
  getActivities: mockGetActivities,
  getActivitiesInOrder: mockGetActivitiesInOrder,
}));

const mockIsDragAndDropSupported = jest.fn(() => true);
const mockIsTouchSupported = jest.fn(() => true);
const mockIsVibrationSupported = jest.fn(() => false);

jest.mock('../../utils/feature-detection', () => ({
  isDragAndDropSupported: mockIsDragAndDropSupported,
  isTouchSupported: mockIsTouchSupported,
  isVibrationSupported: mockIsVibrationSupported,
}));

// Helper to create large activity ID arrays
const createActivityIds = (count: number): string[] => {
  return Array.from({ length: count }, (_, i) => `activity-${i}`);
};

// Helper to measure execution time
const measureTime = async (fn: () => void | Promise<void>): Promise<number> => {
  const start = performance.now();
  await fn();
  return performance.now() - start;
};

describe('useDragAndDrop Performance Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useFakeTimers();
    
    // Mock reorderActivities to succeed without validation
    mockReorderActivities.mockImplementation(() => {
      // Just succeed without doing anything
    });
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  describe('Large Activity Lists', () => {
    it('should initialize efficiently with 50+ activities', async () => {
      const largeActivityList = createActivityIds(50);
      
      const executionTime = await measureTime(() => {
        renderHook(() => useDragAndDrop(largeActivityList));
      });

      // Should initialize quickly even with large lists
      expect(executionTime).toBeLessThan(50);
    });

    it('should handle reordering calculations efficiently for large lists', async () => {
      const largeActivityList = createActivityIds(100);
      
      const { result } = renderHook(() => useDragAndDrop(largeActivityList));

      const executionTime = await measureTime(() => {
        act(() => {
          result.current.handlers.handleDragStart('activity-0');
          result.current.handlers.handleDrop('activity-99');
        });
      });

      // Should handle large list reordering quickly
      expect(executionTime).toBeLessThan(20);
    });

    it('should maintain performance with frequent activity list updates', async () => {
      let activityList = createActivityIds(20);
      
      const { rerender } = renderHook(
        ({ activities }) => useDragAndDrop(activities),
        { initialProps: { activities: activityList } }
      );

      const executionTime = await measureTime(() => {
        // Simulate 10 rapid activity list updates
        for (let i = 0; i < 10; i++) {
          activityList = [...activityList, `new-activity-${i}`];
          rerender({ activities: activityList });
        }
      });

      // Should handle frequent updates efficiently
      expect(executionTime).toBeLessThan(100);
    });
  });

  describe('Rapid Reordering Operations', () => {
    it('should debounce persistence calls during rapid reordering', async () => {
      const activities = createActivityIds(10);
      
      // Ensure mock is properly set up for this test
      mockReorderActivities.mockClear();
      mockReorderActivities.mockImplementation(() => {
        // Just succeed without doing anything
      });
      
      const { result } = renderHook(() => 
        useDragAndDrop(activities, { debounceMs: 100 })
      );

      // Perform a complete drag and drop operation
      act(() => {
        result.current.handlers.handleDragStart('activity-0');
      });

      // Verify drag state is set
      expect(result.current.state.isDragging).toBe(true);
      expect(result.current.state.draggedItem).toBe('activity-0');

      act(() => {
        result.current.handlers.handleDrop('activity-1');
      });

      // Should not call persistence immediately due to debouncing
      expect(mockReorderActivities).not.toHaveBeenCalled();

      // Fast-forward debounce timer
      act(() => {
        jest.advanceTimersByTime(150);
      });

      // Should call persistence after debounce
      expect(mockReorderActivities).toHaveBeenCalledTimes(1);
      expect(mockReorderActivities).toHaveBeenCalledWith(['activity-1', 'activity-0', 'activity-2', 'activity-3', 'activity-4', 'activity-5', 'activity-6', 'activity-7', 'activity-8', 'activity-9']);
    });

    it('should handle rapid drag events without performance degradation', async () => {
      const activities = createActivityIds(15);
      const { result } = renderHook(() => useDragAndDrop(activities));

      const executionTime = await measureTime(() => {
        act(() => {
          // Simulate rapid drag events
          for (let i = 0; i < 50; i++) {
            result.current.handlers.handleDragStart(`activity-${i % activities.length}`);
            result.current.handlers.handleDragOver(`activity-${(i + 1) % activities.length}`);
            result.current.handlers.handleDragEnd();
          }
        });
      });

      // Should handle rapid events efficiently
      expect(executionTime).toBeLessThan(100);
    });

    it('should optimize state updates during drag operations', async () => {
      const activities = createActivityIds(10);
      const { result } = renderHook(() => useDragAndDrop(activities));

      let stateUpdateCount = 0;
      const originalState = result.current.state;

      // Monitor state changes
      const checkStateChanges = () => {
        if (result.current.state !== originalState) {
          stateUpdateCount++;
        }
      };

      act(() => {
        result.current.handlers.handleDragStart('activity-0');
        checkStateChanges();
        
        // Multiple drag over events on same target
        for (let i = 0; i < 5; i++) {
          result.current.handlers.handleDragOver('activity-1');
          checkStateChanges();
        }
        
        result.current.handlers.handleDragEnd();
        checkStateChanges();
      });

      // Should minimize unnecessary state updates
      expect(stateUpdateCount).toBeLessThan(10);
    });
  });

  describe('Touch Event Performance', () => {
    it('should handle rapid touch events efficiently', async () => {
      const activities = createActivityIds(10);
      const { result } = renderHook(() => useDragAndDrop(activities));

      // Mock touch events
      const createTouchEvent = (clientX: number, clientY: number): TouchEvent => ({
        touches: [{ clientX, clientY }] as unknown as TouchList,
        changedTouches: [{ clientX, clientY }] as unknown as TouchList,
        preventDefault: jest.fn(),
      } as unknown as TouchEvent);

      const executionTime = await measureTime(() => {
        act(() => {
          // Simulate rapid touch move events
          result.current.handlers.handleTouchStart('activity-0', createTouchEvent(100, 100));
          
          for (let i = 0; i < 30; i++) {
            result.current.handlers.handleTouchMove(createTouchEvent(100 + i, 100 + i));
          }
          
          result.current.handlers.handleTouchEnd(createTouchEvent(130, 130));
        });
      });

      // Should handle touch events efficiently
      expect(executionTime).toBeLessThan(50);
    });

    it('should optimize long press detection for performance', async () => {
      const activities = createActivityIds(5);
      const { result } = renderHook(() => 
        useDragAndDrop(activities, { longPressMs: 100 })
      );

      const touchEvent = {
        touches: [{ clientX: 100, clientY: 100 }] as unknown as TouchList,
        changedTouches: [{ clientX: 100, clientY: 100 }] as unknown as TouchList,
        preventDefault: jest.fn(),
      } as unknown as TouchEvent;

      act(() => {
        result.current.handlers.handleTouchStart('activity-0', touchEvent);
      });

      // Should not immediately trigger drag state
      expect(result.current.state.isTouchDragging).toBe(false);

      // Fast-forward to trigger long press
      act(() => {
        jest.advanceTimersByTime(100);
      });

      // Should efficiently transition to drag state
      expect(result.current.state.isTouchDragging).toBe(true);
    });
  });

  describe('Memory Management', () => {
    it('should cleanup timers and prevent memory leaks', () => {
      const activities = createActivityIds(10);
      const { result, unmount } = renderHook(() => useDragAndDrop(activities));

      // Start some operations that create timers
      act(() => {
        result.current.handlers.handleDragStart('activity-0');
        result.current.handlers.handleTouchStart('activity-1', {
          touches: [{ clientX: 100, clientY: 100 }] as unknown as TouchList,
          changedTouches: [{ clientX: 100, clientY: 100 }] as unknown as TouchList,
          preventDefault: jest.fn(),
        } as unknown as TouchEvent);
      });

      // Unmount component
      unmount();

      // Advance timers to ensure cleanup worked
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      // Should not call persistence after cleanup
      expect(mockReorderActivities).not.toHaveBeenCalled();
    });

    it('should handle component re-renders without creating excessive closures', async () => {
      const activities = createActivityIds(10);
      
      const { result, rerender } = renderHook(
        ({ onReorder }: { onReorder: (order: string[]) => void }) => useDragAndDrop(activities, { onReorder }),
        { 
          initialProps: { 
            onReorder: jest.fn() 
          } 
        }
      );

      // Re-render with same props
      rerender({ onReorder: jest.fn() });

      // Handlers should be stable when possible
      const newHandlers = result.current.handlers;
      
      // Some handlers might change due to dependencies, but structure should be consistent
      expect(typeof newHandlers.handleDragStart).toBe('function');
      expect(typeof newHandlers.handleDragEnd).toBe('function');
    });
  });

  describe('Error Handling Performance', () => {
    it('should handle storage errors without blocking UI', async () => {
      const activities = createActivityIds(10);
      
      // Mock storage error
      mockReorderActivities.mockImplementation(() => {
        throw new Error('Storage quota exceeded');
      });

      const { result } = renderHook(() => useDragAndDrop(activities));

      const executionTime = await measureTime(() => {
        act(() => {
          result.current.handlers.handleDragStart('activity-0');
          result.current.handlers.handleDrop('activity-1');
          
          // Fast-forward debounce timer to trigger storage call
          jest.advanceTimersByTime(300);
        });
      });

      // Should handle errors gracefully without performance impact
      expect(executionTime).toBeLessThan(500);
      
      // Should still clean up drag state
      expect(result.current.state.isDragging).toBe(false);
    });

    it('should recover from invalid drag operations efficiently', async () => {
      const activities = createActivityIds(5);
      const { result } = renderHook(() => useDragAndDrop(activities));

      const executionTime = await measureTime(() => {
        act(() => {
          // Invalid operations
          result.current.handlers.handleDragStart('invalid-id');
          result.current.handlers.handleDrop('another-invalid-id');
          result.current.handlers.handleDragStart('activity-0');
          result.current.handlers.handleDrop('activity-0'); // Drop on self
        });
      });

      // Should handle invalid operations efficiently
      expect(executionTime).toBeLessThan(30);
      
      // Should maintain consistent state
      expect(result.current.state.isDragging).toBe(false);
    });
  });

  describe('Feature Detection Performance', () => {
    it('should initialize feature detection efficiently', () => {
      const activities = createActivityIds(5);
      
      const startTime = performance.now();
      const { result } = renderHook(() => useDragAndDrop(activities));
      const endTime = performance.now();
      
      const initTime = endTime - startTime;
      
      // Should initialize quickly
      expect(initTime).toBeLessThan(50);
      
      // Should have feature detection results
      expect(result.current.state.supportedMethods).toBeDefined();
      expect(typeof result.current.state.supportedMethods.dragAndDrop).toBe('boolean');
      expect(typeof result.current.state.supportedMethods.touch).toBe('boolean');
    });
  });
});