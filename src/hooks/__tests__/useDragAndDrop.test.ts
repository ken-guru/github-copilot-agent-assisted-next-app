/**
 * Unit tests for useDragAndDrop hook
 * Tests drag-and-drop state transitions and reordering logic
 */

import { renderHook, act } from '@testing-library/react';
import { useDragAndDrop } from '../useDragAndDrop';
import { reorderActivities } from '../../utils/activity-storage';

// Mock the activity storage module
jest.mock('../../utils/activity-storage', () => ({
  reorderActivities: jest.fn(),
}));

const mockReorderActivities = reorderActivities as jest.MockedFunction<typeof reorderActivities>;

describe('useDragAndDrop', () => {
  const mockActivityIds = ['activity-1', 'activity-2', 'activity-3', 'activity-4'];
  
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('Initial State', () => {
    it('should initialize with empty drag state', () => {
      const { result } = renderHook(() => useDragAndDrop(mockActivityIds));

      expect(result.current.state).toEqual({
        draggedItem: null,
        dragOverItem: null,
        isDragging: false,
      });
    });

    it('should provide all required handlers', () => {
      const { result } = renderHook(() => useDragAndDrop(mockActivityIds));

      expect(result.current.handlers).toHaveProperty('handleDragStart');
      expect(result.current.handlers).toHaveProperty('handleDragOver');
      expect(result.current.handlers).toHaveProperty('handleDragEnd');
      expect(result.current.handlers).toHaveProperty('handleDrop');
      expect(result.current.handlers).toHaveProperty('handleDragEnter');
      expect(result.current.handlers).toHaveProperty('handleDragLeave');
    });

    it('should provide utility functions', () => {
      const { result } = renderHook(() => useDragAndDrop(mockActivityIds));

      expect(typeof result.current.getActivityClasses).toBe('function');
      expect(typeof result.current.isActivityDragged).toBe('function');
      expect(typeof result.current.isActivityDraggedOver).toBe('function');
      expect(typeof result.current.cleanup).toBe('function');
    });
  });

  describe('Drag Start', () => {
    it('should set dragged item and isDragging state', () => {
      const { result } = renderHook(() => useDragAndDrop(mockActivityIds));

      act(() => {
        result.current.handlers.handleDragStart('activity-1');
      });

      expect(result.current.state).toEqual({
        draggedItem: 'activity-1',
        dragOverItem: null,
        isDragging: true,
      });
    });

    it('should handle invalid activity ID gracefully', () => {
      const { result } = renderHook(() => useDragAndDrop(mockActivityIds));
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      act(() => {
        result.current.handlers.handleDragStart('');
      });

      expect(result.current.state.isDragging).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith('Invalid activity ID provided to handleDragStart');
      
      consoleSpy.mockRestore();
    });

    it('should reset dragOverItem when starting new drag', () => {
      const { result } = renderHook(() => useDragAndDrop(mockActivityIds));

      // Set initial drag over state
      act(() => {
        result.current.handlers.handleDragEnter('activity-2');
      });

      expect(result.current.state.dragOverItem).toBe('activity-2');

      // Start new drag
      act(() => {
        result.current.handlers.handleDragStart('activity-1');
      });

      expect(result.current.state.dragOverItem).toBe(null);
    });
  });

  describe('Drag Over and Enter/Leave', () => {
    it('should set dragOverItem on drag over', () => {
      const { result } = renderHook(() => useDragAndDrop(mockActivityIds));

      act(() => {
        result.current.handlers.handleDragOver('activity-2');
      });

      expect(result.current.state.dragOverItem).toBe('activity-2');
    });

    it('should set dragOverItem on drag enter', () => {
      const { result } = renderHook(() => useDragAndDrop(mockActivityIds));

      act(() => {
        result.current.handlers.handleDragEnter('activity-3');
      });

      expect(result.current.state.dragOverItem).toBe('activity-3');
    });

    it('should clear dragOverItem on drag leave', () => {
      const { result } = renderHook(() => useDragAndDrop(mockActivityIds));

      // Set drag over state
      act(() => {
        result.current.handlers.handleDragEnter('activity-2');
      });

      expect(result.current.state.dragOverItem).toBe('activity-2');

      // Clear on leave
      act(() => {
        result.current.handlers.handleDragLeave();
      });

      expect(result.current.state.dragOverItem).toBe(null);
    });

    it('should not update state if dragOverItem is the same', () => {
      const { result } = renderHook(() => useDragAndDrop(mockActivityIds));

      act(() => {
        result.current.handlers.handleDragOver('activity-2');
      });

      const stateAfterFirst = result.current.state;

      act(() => {
        result.current.handlers.handleDragOver('activity-2');
      });

      expect(result.current.state).toBe(stateAfterFirst);
    });

    it('should handle invalid activity IDs gracefully', () => {
      const { result } = renderHook(() => useDragAndDrop(mockActivityIds));

      act(() => {
        result.current.handlers.handleDragOver('');
      });

      expect(result.current.state.dragOverItem).toBe(null);
    });
  });

  describe('Drag End', () => {
    it('should reset all drag state', () => {
      const { result } = renderHook(() => useDragAndDrop(mockActivityIds));

      // Set up drag state
      act(() => {
        result.current.handlers.handleDragStart('activity-1');
        result.current.handlers.handleDragOver('activity-2');
      });

      expect(result.current.state.isDragging).toBe(true);

      // End drag
      act(() => {
        result.current.handlers.handleDragEnd();
      });

      expect(result.current.state).toEqual({
        draggedItem: null,
        dragOverItem: null,
        isDragging: false,
      });
    });
  });

  describe('Drop Handling', () => {
    it('should reorder activities and persist changes', () => {
      const mockOnReorder = jest.fn();
      const { result } = renderHook(() => 
        useDragAndDrop(mockActivityIds, { onReorder: mockOnReorder, debounceMs: 0 })
      );

      // Start drag
      act(() => {
        result.current.handlers.handleDragStart('activity-1');
      });

      // Verify drag state is set
      expect(result.current.state.draggedItem).toBe('activity-1');
      expect(result.current.state.isDragging).toBe(true);

      // Drop on different target
      act(() => {
        result.current.handlers.handleDrop('activity-3');
      });

      // Should reset state immediately
      expect(result.current.state).toEqual({
        draggedItem: null,
        dragOverItem: null,
        isDragging: false,
      });

      // Should call reorderActivities with new order (activity-1 moved to position of activity-3)
      act(() => {
        jest.runAllTimers();
      });

      expect(mockReorderActivities).toHaveBeenCalledWith(['activity-2', 'activity-3', 'activity-1', 'activity-4']);
      expect(mockOnReorder).toHaveBeenCalledWith(['activity-2', 'activity-3', 'activity-1', 'activity-4']);
    });

    it('should handle drop on same item (no reordering)', () => {
      const mockOnReorder = jest.fn();
      const { result } = renderHook(() => 
        useDragAndDrop(mockActivityIds, { onReorder: mockOnReorder })
      );

      // Start drag
      act(() => {
        result.current.handlers.handleDragStart('activity-1');
      });

      // Drop on same item
      act(() => {
        result.current.handlers.handleDrop('activity-1');
      });

      // Should reset state
      expect(result.current.state).toEqual({
        draggedItem: null,
        dragOverItem: null,
        isDragging: false,
      });

      // Should not call reorderActivities
      act(() => {
        jest.runAllTimers();
      });

      expect(mockReorderActivities).not.toHaveBeenCalled();
      expect(mockOnReorder).not.toHaveBeenCalled();
    });

    it('should handle invalid drop operations gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      const { result } = renderHook(() => useDragAndDrop(mockActivityIds));

      // Drop without starting drag
      act(() => {
        result.current.handlers.handleDrop('activity-2');
      });

      expect(consoleSpy).toHaveBeenCalledWith('Invalid drop operation: missing dragged item or target');
      expect(result.current.state.isDragging).toBe(false);

      consoleSpy.mockRestore();
    });

    it('should handle reordering errors gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      // Set up error before creating the hook
      mockReorderActivities.mockImplementation(() => {
        throw new Error('Storage error');
      });

      const { result } = renderHook(() => useDragAndDrop(mockActivityIds, { debounceMs: 0 }));

      act(() => {
        result.current.handlers.handleDragStart('activity-1');
      });

      // Verify drag state is set
      expect(result.current.state.draggedItem).toBe('activity-1');

      act(() => {
        result.current.handlers.handleDrop('activity-2');
      });

      // Wait for the debounced operation to complete
      act(() => {
        jest.runAllTimers();
      });

      expect(consoleSpy).toHaveBeenCalledWith('Failed to persist activity order:', expect.any(Error));
      expect(result.current.state.isDragging).toBe(false);

      consoleSpy.mockRestore();
    });

    it('should debounce order persistence', () => {
      const { result } = renderHook(() => useDragAndDrop(mockActivityIds, { debounceMs: 300 }));

      // Perform multiple drops quickly
      act(() => {
        result.current.handlers.handleDragStart('activity-1');
      });
      
      act(() => {
        result.current.handlers.handleDrop('activity-2');
      });

      act(() => {
        result.current.handlers.handleDragStart('activity-2');
      });
      
      act(() => {
        result.current.handlers.handleDrop('activity-3');
      });

      // Should not have called reorderActivities yet
      expect(mockReorderActivities).not.toHaveBeenCalled();

      // Fast forward past debounce time
      act(() => {
        jest.advanceTimersByTime(300);
      });

      // Should only call once with the latest order
      expect(mockReorderActivities).toHaveBeenCalledTimes(1);
    });
  });

  describe('Reordering Logic', () => {
    it('should correctly reorder when moving item forward', () => {
      const { result } = renderHook(() => useDragAndDrop(mockActivityIds, { debounceMs: 0 }));

      // Move activity-1 to position of activity-3 (forward)
      act(() => {
        result.current.handlers.handleDragStart('activity-1');
      });
      
      act(() => {
        result.current.handlers.handleDrop('activity-3');
      });

      act(() => {
        jest.runAllTimers();
      });

      expect(mockReorderActivities).toHaveBeenCalledWith(['activity-2', 'activity-3', 'activity-1', 'activity-4']);
    });

    it('should correctly reorder when moving item backward', () => {
      const { result } = renderHook(() => useDragAndDrop(mockActivityIds, { debounceMs: 0 }));

      // Move activity-3 to position of activity-1 (backward)
      act(() => {
        result.current.handlers.handleDragStart('activity-3');
      });
      
      act(() => {
        result.current.handlers.handleDrop('activity-1');
      });

      act(() => {
        jest.runAllTimers();
      });

      expect(mockReorderActivities).toHaveBeenCalledWith(['activity-3', 'activity-1', 'activity-2', 'activity-4']);
    });

    it('should handle invalid activity IDs in reordering', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      const { result } = renderHook(() => useDragAndDrop(mockActivityIds));

      // Try to drop on non-existent activity
      act(() => {
        result.current.handlers.handleDragStart('activity-1');
      });
      
      act(() => {
        result.current.handlers.handleDrop('non-existent');
      });

      expect(consoleSpy).toHaveBeenCalledWith('Invalid drag operation: activity not found in current order');
      expect(mockReorderActivities).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe('Utility Functions', () => {
    it('should return correct CSS classes for activities', () => {
      const { result } = renderHook(() => useDragAndDrop(mockActivityIds));

      // No drag state
      expect(result.current.getActivityClasses('activity-1')).toBe('');

      // Set dragged item
      act(() => {
        result.current.handlers.handleDragStart('activity-1');
      });

      expect(result.current.getActivityClasses('activity-1')).toBe('dragging');
      expect(result.current.getActivityClasses('activity-2')).toBe('');

      // Set drag over item
      act(() => {
        result.current.handlers.handleDragOver('activity-2');
      });

      expect(result.current.getActivityClasses('activity-1')).toBe('dragging');
      expect(result.current.getActivityClasses('activity-2')).toBe('drag-over');
      expect(result.current.getActivityClasses('activity-3')).toBe('');
    });

    it('should correctly identify dragged activities', () => {
      const { result } = renderHook(() => useDragAndDrop(mockActivityIds));

      expect(result.current.isActivityDragged('activity-1')).toBe(false);

      act(() => {
        result.current.handlers.handleDragStart('activity-1');
      });

      expect(result.current.isActivityDragged('activity-1')).toBe(true);
      expect(result.current.isActivityDragged('activity-2')).toBe(false);
    });

    it('should correctly identify drag-over activities', () => {
      const { result } = renderHook(() => useDragAndDrop(mockActivityIds));

      expect(result.current.isActivityDraggedOver('activity-2')).toBe(false);

      act(() => {
        result.current.handlers.handleDragStart('activity-1');
        result.current.handlers.handleDragOver('activity-2');
      });

      expect(result.current.isActivityDraggedOver('activity-1')).toBe(false); // Can't drag over self
      expect(result.current.isActivityDraggedOver('activity-2')).toBe(true);
      expect(result.current.isActivityDraggedOver('activity-3')).toBe(false);
    });
  });

  describe('Cleanup', () => {
    it('should clear debounce timer on cleanup', () => {
      const { result } = renderHook(() => useDragAndDrop(mockActivityIds, { debounceMs: 300 }));

      // Start a debounced operation
      act(() => {
        result.current.handlers.handleDragStart('activity-1');
        result.current.handlers.handleDrop('activity-2');
      });

      // Call cleanup
      act(() => {
        result.current.cleanup();
      });

      // Fast forward time
      act(() => {
        jest.advanceTimersByTime(300);
      });

      // Should not have called reorderActivities
      expect(mockReorderActivities).not.toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty activity list', () => {
      const { result } = renderHook(() => useDragAndDrop([]));

      act(() => {
        result.current.handlers.handleDragStart('activity-1');
        result.current.handlers.handleDrop('activity-2');
      });

      expect(result.current.state.isDragging).toBe(false);
      expect(mockReorderActivities).not.toHaveBeenCalled();
    });

    it('should handle single activity list', () => {
      const { result } = renderHook(() => useDragAndDrop(['activity-1']));

      act(() => {
        result.current.handlers.handleDragStart('activity-1');
        result.current.handlers.handleDrop('activity-1');
      });

      expect(result.current.state.isDragging).toBe(false);
      expect(mockReorderActivities).not.toHaveBeenCalled();
    });

    it('should handle activity list changes during drag', () => {
      const { result, rerender } = renderHook(
        ({ activityIds }) => useDragAndDrop(activityIds),
        { initialProps: { activityIds: mockActivityIds } }
      );

      // Start drag
      act(() => {
        result.current.handlers.handleDragStart('activity-1');
      });

      // Change activity list
      rerender({ activityIds: ['activity-2', 'activity-3'] });

      // Try to drop
      act(() => {
        result.current.handlers.handleDrop('activity-2');
      });

      // Should handle gracefully
      expect(result.current.state.isDragging).toBe(false);
    });
  });
});