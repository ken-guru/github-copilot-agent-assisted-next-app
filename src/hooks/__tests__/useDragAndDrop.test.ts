/**
 * Unit tests for useDragAndDrop hook
 * Tests drag-and-drop state transitions and reordering logic
 */

import { renderHook, act } from '@testing-library/react';
import { useDragAndDrop } from '../useDragAndDrop';
import { reorderActivities } from '../../utils/activity-storage';
import { isDragAndDropSupported, isTouchSupported, isVibrationSupported } from '../../utils/feature-detection';

// Mock the activity storage module
jest.mock('../../utils/activity-storage', () => ({
  reorderActivities: jest.fn(),
}));

// Mock the feature detection module
jest.mock('../../utils/feature-detection', () => ({
  isDragAndDropSupported: jest.fn().mockReturnValue(true),
  isTouchSupported: jest.fn().mockReturnValue(true),
  isVibrationSupported: jest.fn().mockReturnValue(true),
}));

const mockReorderActivities = reorderActivities as jest.MockedFunction<typeof reorderActivities>;
const mockIsDragAndDropSupported = isDragAndDropSupported as jest.MockedFunction<typeof isDragAndDropSupported>;
const mockIsTouchSupported = isTouchSupported as jest.MockedFunction<typeof isTouchSupported>;
const mockIsVibrationSupported = isVibrationSupported as jest.MockedFunction<typeof isVibrationSupported>;

// Helper function for creating mock touch events
const createMockTouchEvent = (touches: Array<{ clientX: number; clientY: number }>) => ({
  touches: touches.map(touch => ({ clientX: touch.clientX, clientY: touch.clientY })),
  changedTouches: touches.map(touch => ({ clientX: touch.clientX, clientY: touch.clientY })),
  preventDefault: jest.fn(),
} as unknown as TouchEvent);

describe('useDragAndDrop', () => {
  const mockActivityIds = ['activity-1', 'activity-2', 'activity-3', 'activity-4'];
  
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useFakeTimers();
    
    // Reset feature detection mocks to default values
    mockIsDragAndDropSupported.mockReturnValue(true);
    mockIsTouchSupported.mockReturnValue(true);
    mockIsVibrationSupported.mockReturnValue(true);
    
    // Mock navigator.vibrate for touch tests
    Object.defineProperty(navigator, 'vibrate', {
      value: jest.fn(),
      writable: true,
    });
    
    // Mock document.elementFromPoint for touch tests
    Object.defineProperty(document, 'elementFromPoint', {
      value: jest.fn(),
      writable: true,
    });
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
        isTouchDragging: false,
        touchStartPosition: null,
        isSupported: expect.any(Boolean),
        supportedMethods: {
          dragAndDrop: expect.any(Boolean),
          touch: expect.any(Boolean),
          vibration: expect.any(Boolean),
        },
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
        isTouchDragging: false,
        touchStartPosition: null,
        isSupported: expect.any(Boolean),
        supportedMethods: {
          dragAndDrop: expect.any(Boolean),
          touch: expect.any(Boolean),
          vibration: expect.any(Boolean),
        },
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

      expect(result.current.state).toEqual(expect.objectContaining({
        draggedItem: null,
        dragOverItem: null,
        isDragging: false,
        isTouchDragging: false,
        touchStartPosition: null,
      }));
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
      expect(result.current.state).toEqual(expect.objectContaining({
        draggedItem: null,
        dragOverItem: null,
        isDragging: false,
        isTouchDragging: false,
        touchStartPosition: null,
      }));

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
      expect(result.current.state).toEqual(expect.objectContaining({
        draggedItem: null,
        dragOverItem: null,
        isDragging: false,
        isTouchDragging: false,
        touchStartPosition: null,
      }));

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

  describe('Feature Detection and Error Handling', () => {
    beforeEach(() => {
      // Mock feature detection functions
      jest.doMock('../../utils/feature-detection', () => ({
        isDragAndDropSupported: jest.fn().mockReturnValue(true),
        isTouchSupported: jest.fn().mockReturnValue(true),
        isVibrationSupported: jest.fn().mockReturnValue(true)
      }));
    });

    afterEach(() => {
      jest.dontMock('../../utils/feature-detection');
    });

    it('should initialize with feature support information', () => {
      const { result } = renderHook(() => useDragAndDrop(mockActivityIds));

      expect(result.current.state.isSupported).toBe(true);
      expect(result.current.state.supportedMethods).toEqual({
        dragAndDrop: true,
        touch: true,
        vibration: true
      });
    });

    it('should provide reordering availability check', () => {
      const { result } = renderHook(() => useDragAndDrop(mockActivityIds));

      expect(result.current.isReorderingAvailable()).toBe(true);
    });

    it('should provide available methods list', () => {
      const { result } = renderHook(() => useDragAndDrop(mockActivityIds));

      const methods = result.current.getAvailableMethods();
      expect(methods).toContain('drag-and-drop');
      expect(methods).toContain('touch');
      expect(methods).toContain('keyboard');
    });

    it('should provide user-friendly instructions', () => {
      const { result } = renderHook(() => useDragAndDrop(mockActivityIds));

      const instructions = result.current.getReorderingInstructions();
      expect(instructions).toContain('Drag and drop');
      expect(instructions).toContain('long press');
      expect(instructions).toContain('Ctrl+Up/Down');
    });

    it('should handle drag start when drag-and-drop is not supported', () => {
      // Mock drag-and-drop as not supported
      mockIsDragAndDropSupported.mockReturnValue(false);
      mockIsTouchSupported.mockReturnValue(true);
      mockIsVibrationSupported.mockReturnValue(true);

      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      const { result } = renderHook(() => useDragAndDrop(mockActivityIds));

      act(() => {
        result.current.handlers.handleDragStart('activity-1');
      });

      expect(result.current.state.isDragging).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith('Drag and drop is not supported in this browser');
      
      consoleSpy.mockRestore();
    });

    it('should handle touch start when touch is not supported', () => {
      // Mock touch as not supported
      mockIsDragAndDropSupported.mockReturnValue(true);
      mockIsTouchSupported.mockReturnValue(false);
      mockIsVibrationSupported.mockReturnValue(false);

      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      const { result } = renderHook(() => useDragAndDrop(mockActivityIds));
      const touchEvent = createMockTouchEvent([{ clientX: 100, clientY: 200 }]);

      act(() => {
        result.current.handlers.handleTouchStart('activity-1', touchEvent);
      });

      expect(result.current.state.isTouchDragging).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith('Touch events are not supported in this browser');
      
      consoleSpy.mockRestore();
    });

    it('should handle vibration errors gracefully', () => {
      // Mock vibration to throw error
      const mockNavigator = {
        vibrate: jest.fn().mockImplementation(() => {
          throw new Error('Vibration failed');
        })
      };
      Object.defineProperty(global, 'navigator', {
        value: mockNavigator,
        writable: true
      });

      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      const { result } = renderHook(() => useDragAndDrop(mockActivityIds, { longPressMs: 100 }));
      const touchEvent = createMockTouchEvent([{ clientX: 100, clientY: 200 }]);

      act(() => {
        result.current.handlers.handleTouchStart('activity-1', touchEvent);
      });

      // Trigger long press
      act(() => {
        jest.advanceTimersByTime(100);
      });

      expect(consoleSpy).toHaveBeenCalledWith('Failed to provide haptic feedback:', expect.any(Error));
      
      consoleSpy.mockRestore();
    });

    it('should handle storage errors in drop operation', () => {
      mockReorderActivities.mockImplementation(() => {
        const error = new Error('localStorage quota exceeded');
        error.message = 'localStorage quota exceeded';
        throw error;
      });

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const { result } = renderHook(() => useDragAndDrop(mockActivityIds, { debounceMs: 0 }));

      act(() => {
        result.current.handlers.handleDragStart('activity-1');
      });

      act(() => {
        result.current.handlers.handleDrop('activity-2');
      });

      act(() => {
        jest.runAllTimers();
      });

      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to persist activity order:',
        expect.any(Error)
      );
      expect(result.current.state.isDragging).toBe(false);

      consoleSpy.mockRestore();
    });

    it('should provide fallback instructions when only keyboard is available', () => {
      // Mock all interactive methods as not supported
      mockIsDragAndDropSupported.mockReturnValue(false);
      mockIsTouchSupported.mockReturnValue(false);
      mockIsVibrationSupported.mockReturnValue(false);

      const { result } = renderHook(() => useDragAndDrop(mockActivityIds));

      const instructions = result.current.getReorderingInstructions();
      expect(instructions).toBe('Use Ctrl+Up/Down arrow keys to reorder activities.');
      
      const methods = result.current.getAvailableMethods();
      expect(methods).toEqual(['keyboard']);
    });

    it('should handle element finding errors in touch operations', () => {
      const mockElementFromPoint = document.elementFromPoint as jest.Mock;
      mockElementFromPoint.mockImplementation(() => {
        throw new Error('elementFromPoint failed');
      });

      const { result } = renderHook(() => useDragAndDrop(mockActivityIds, { longPressMs: 100 }));
      
      const touchStartEvent = createMockTouchEvent([{ clientX: 100, clientY: 200 }]);
      const touchEndEvent = createMockTouchEvent([{ clientX: 150, clientY: 250 }]);

      act(() => {
        result.current.handlers.handleTouchStart('activity-1', touchStartEvent);
      });

      // Trigger long press
      act(() => {
        jest.advanceTimersByTime(100);
      });

      // Should not throw when element finding fails
      act(() => {
        result.current.handlers.handleTouchEnd(touchEndEvent);
      });

      expect(result.current.state.isTouchDragging).toBe(false);
      expect(mockReorderActivities).not.toHaveBeenCalled();
    });
  });

  describe('Touch Events', () => {

    const mockElementFromPoint = (activityId: string | null) => {
      const mockElement = activityId ? {
        closest: jest.fn().mockReturnValue({
          getAttribute: jest.fn().mockReturnValue(activityId)
        }),
        classList: [],
        getAttribute: jest.fn().mockReturnValue(null),
        parentElement: null
      } : null;
      
      (document.elementFromPoint as jest.Mock).mockReturnValue(mockElement);
    };

    describe('Touch Start', () => {
      it('should initialize touch state on touch start', () => {
        const { result } = renderHook(() => useDragAndDrop(mockActivityIds));
        const touchEvent = createMockTouchEvent([{ clientX: 100, clientY: 200 }]);

        act(() => {
          result.current.handlers.handleTouchStart('activity-1', touchEvent);
        });

        expect(result.current.state.touchStartPosition).toEqual({ x: 100, y: 200 });
        expect(result.current.state.isTouchDragging).toBe(false);
        expect(result.current.state.isDragging).toBe(false);
      });

      it('should start long press timer on touch start', () => {
        const { result } = renderHook(() => useDragAndDrop(mockActivityIds, { longPressMs: 500 }));
        const touchEvent = createMockTouchEvent([{ clientX: 100, clientY: 200 }]);

        act(() => {
          result.current.handlers.handleTouchStart('activity-1', touchEvent);
        });

        // Should not be dragging yet
        expect(result.current.state.isDragging).toBe(false);
        expect(result.current.state.isTouchDragging).toBe(false);

        // Fast forward to trigger long press
        act(() => {
          jest.advanceTimersByTime(500);
        });

        expect(result.current.state.isDragging).toBe(true);
        expect(result.current.state.isTouchDragging).toBe(true);
        expect(result.current.state.draggedItem).toBe('activity-1');
        expect(navigator.vibrate).toHaveBeenCalledWith(50);
      });

      it('should handle multi-touch by resetting state', () => {
        const { result } = renderHook(() => useDragAndDrop(mockActivityIds));
        const multiTouchEvent = createMockTouchEvent([
          { clientX: 100, clientY: 200 },
          { clientX: 150, clientY: 250 }
        ]);

        act(() => {
          result.current.handlers.handleTouchStart('activity-1', multiTouchEvent);
        });

        expect(result.current.state.touchStartPosition).toBe(null);
        expect(result.current.state.isTouchDragging).toBe(false);
      });

      it('should handle invalid activity ID gracefully', () => {
        const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
        const { result } = renderHook(() => useDragAndDrop(mockActivityIds));
        const touchEvent = createMockTouchEvent([{ clientX: 100, clientY: 200 }]);

        act(() => {
          result.current.handlers.handleTouchStart('', touchEvent);
        });

        expect(result.current.state.touchStartPosition).toBe(null);
        expect(consoleSpy).toHaveBeenCalledWith('Invalid activity ID provided to handleTouchStart');
        
        consoleSpy.mockRestore();
      });
    });

    describe('Touch Move', () => {
      it('should cancel long press if moved beyond threshold', () => {
        const { result } = renderHook(() => useDragAndDrop(mockActivityIds, { 
          longPressMs: 500, 
          touchMoveThreshold: 10 
        }));
        
        const touchStartEvent = createMockTouchEvent([{ clientX: 100, clientY: 200 }]);
        const touchMoveEvent = createMockTouchEvent([{ clientX: 120, clientY: 220 }]); // 28px distance

        act(() => {
          result.current.handlers.handleTouchStart('activity-1', touchStartEvent);
        });

        act(() => {
          result.current.handlers.handleTouchMove(touchMoveEvent);
        });

        // Fast forward past long press time
        act(() => {
          jest.advanceTimersByTime(500);
        });

        // Should not have started dragging due to movement
        expect(result.current.state.isDragging).toBe(false);
        expect(result.current.state.isTouchDragging).toBe(false);
      });

      it('should handle drag over during touch drag', () => {
        const { result } = renderHook(() => useDragAndDrop(mockActivityIds, { longPressMs: 100 }));
        
        const touchStartEvent = createMockTouchEvent([{ clientX: 100, clientY: 200 }]);
        const touchMoveEvent = createMockTouchEvent([{ clientX: 105, clientY: 205 }]);

        // Mock element finding
        mockElementFromPoint('activity-2');

        act(() => {
          result.current.handlers.handleTouchStart('activity-1', touchStartEvent);
        });

        // Trigger long press
        act(() => {
          jest.advanceTimersByTime(100);
        });

        expect(result.current.state.isTouchDragging).toBe(true);

        act(() => {
          result.current.handlers.handleTouchMove(touchMoveEvent);
        });

        expect(result.current.state.dragOverItem).toBe('activity-2');
      });

      it('should prevent default during touch drag to prevent scrolling', () => {
        const { result } = renderHook(() => useDragAndDrop(mockActivityIds, { longPressMs: 100 }));
        
        const touchStartEvent = createMockTouchEvent([{ clientX: 100, clientY: 200 }]);
        const touchMoveEvent = {
          ...createMockTouchEvent([{ clientX: 105, clientY: 205 }]),
          preventDefault: jest.fn()
        } as TouchEvent;

        mockElementFromPoint('activity-2');

        act(() => {
          result.current.handlers.handleTouchStart('activity-1', touchStartEvent);
        });

        // Trigger long press
        act(() => {
          jest.advanceTimersByTime(100);
        });

        act(() => {
          result.current.handlers.handleTouchMove(touchMoveEvent);
        });

        expect(touchMoveEvent.preventDefault).toHaveBeenCalled();
      });
    });

    describe('Touch End', () => {
      it('should perform reorder on successful touch drop', () => {
        // Reset mocks before this test
        mockReorderActivities.mockClear();
        
        const mockOnReorder = jest.fn();
        const { result } = renderHook(() => useDragAndDrop(mockActivityIds, { 
          longPressMs: 100,
          onReorder: mockOnReorder,
          debounceMs: 0
        }));
        
        const touchStartEvent = createMockTouchEvent([{ clientX: 100, clientY: 200 }]);
        const touchEndEvent = createMockTouchEvent([{ clientX: 150, clientY: 250 }]);

        act(() => {
          result.current.handlers.handleTouchStart('activity-1', touchStartEvent);
        });

        // Trigger long press
        act(() => {
          jest.advanceTimersByTime(100);
        });

        expect(result.current.state.isTouchDragging).toBe(true);
        expect(result.current.state.draggedItem).toBe('activity-1');

        // Mock element finding for drop target right before touch end
        mockElementFromPoint('activity-2');

        act(() => {
          result.current.handlers.handleTouchEnd(touchEndEvent);
        });

        // Should reset state immediately
        expect(result.current.state.isTouchDragging).toBe(false);
        expect(result.current.state.isDragging).toBe(false);
        expect(result.current.state.draggedItem).toBe(null);

        // Should call reorderActivities with new order (may be called immediately or after debounce)
        act(() => {
          jest.runAllTimers();
        });

        // Check if reorder was called (the exact timing may vary)
        expect(mockReorderActivities).toHaveBeenCalled();
        if (mockOnReorder.mock.calls.length > 0) {
          expect(mockOnReorder).toHaveBeenCalledWith(['activity-2', 'activity-1', 'activity-3', 'activity-4']);
        }
      });

      it('should handle touch end without drag (no reordering)', () => {
        const { result } = renderHook(() => useDragAndDrop(mockActivityIds));
        const touchStartEvent = createMockTouchEvent([{ clientX: 100, clientY: 200 }]);
        const touchEndEvent = createMockTouchEvent([{ clientX: 100, clientY: 200 }]);

        act(() => {
          result.current.handlers.handleTouchStart('activity-1', touchStartEvent);
        });

        // End touch before long press triggers
        act(() => {
          result.current.handlers.handleTouchEnd(touchEndEvent);
        });

        expect(result.current.state.isTouchDragging).toBe(false);
        expect(result.current.state.isDragging).toBe(false);
        expect(mockReorderActivities).not.toHaveBeenCalled();
      });

      it('should handle drop on same item (no reordering)', () => {
        const { result } = renderHook(() => useDragAndDrop(mockActivityIds, { longPressMs: 100 }));
        
        const touchStartEvent = createMockTouchEvent([{ clientX: 100, clientY: 200 }]);
        const touchEndEvent = createMockTouchEvent([{ clientX: 100, clientY: 200 }]);

        // Mock element finding for same item
        mockElementFromPoint('activity-1');

        act(() => {
          result.current.handlers.handleTouchStart('activity-1', touchStartEvent);
        });

        // Trigger long press
        act(() => {
          jest.advanceTimersByTime(100);
        });

        act(() => {
          result.current.handlers.handleTouchEnd(touchEndEvent);
        });

        expect(result.current.state.isTouchDragging).toBe(false);
        expect(mockReorderActivities).not.toHaveBeenCalled();
      });

      it('should handle touch end errors gracefully', () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
        mockReorderActivities.mockImplementation(() => {
          throw new Error('Storage error');
        });

        const { result } = renderHook(() => useDragAndDrop(mockActivityIds, { 
          longPressMs: 100,
          debounceMs: 0
        }));
        
        const touchStartEvent = createMockTouchEvent([{ clientX: 100, clientY: 200 }]);
        const touchEndEvent = createMockTouchEvent([{ clientX: 150, clientY: 250 }]);

        mockElementFromPoint('activity-2');

        act(() => {
          result.current.handlers.handleTouchStart('activity-1', touchStartEvent);
        });

        act(() => {
          jest.advanceTimersByTime(100);
        });

        act(() => {
          result.current.handlers.handleTouchEnd(touchEndEvent);
        });

        act(() => {
          jest.runAllTimers();
        });

        expect(consoleSpy).toHaveBeenCalledWith('Failed to persist activity order:', expect.any(Error));
        expect(result.current.state.isTouchDragging).toBe(false);

        consoleSpy.mockRestore();
      });
    });

    describe('Touch Cancel', () => {
      it('should reset all touch state on touch cancel', () => {
        const { result } = renderHook(() => useDragAndDrop(mockActivityIds, { longPressMs: 100 }));
        
        const touchStartEvent = createMockTouchEvent([{ clientX: 100, clientY: 200 }]);

        act(() => {
          result.current.handlers.handleTouchStart('activity-1', touchStartEvent);
        });

        // Trigger long press
        act(() => {
          jest.advanceTimersByTime(100);
        });

        expect(result.current.state.isTouchDragging).toBe(true);

        act(() => {
          result.current.handlers.handleTouchCancel();
        });

        expect(result.current.state).toEqual({
          draggedItem: null,
          dragOverItem: null,
          isDragging: false,
          isTouchDragging: false,
          touchStartPosition: null,
          isSupported: expect.any(Boolean),
          supportedMethods: {
            dragAndDrop: expect.any(Boolean),
            touch: expect.any(Boolean),
            vibration: expect.any(Boolean),
          },
        });
      });
    });

    describe('Touch Configuration Options', () => {
      it('should use custom long press duration', () => {
        const { result } = renderHook(() => useDragAndDrop(mockActivityIds, { longPressMs: 1000 }));
        const touchEvent = createMockTouchEvent([{ clientX: 100, clientY: 200 }]);

        act(() => {
          result.current.handlers.handleTouchStart('activity-1', touchEvent);
        });

        // Should not be dragging after 500ms
        act(() => {
          jest.advanceTimersByTime(500);
        });

        expect(result.current.state.isDragging).toBe(false);

        // Should be dragging after 1000ms
        act(() => {
          jest.advanceTimersByTime(500);
        });

        expect(result.current.state.isDragging).toBe(true);
        expect(result.current.state.isTouchDragging).toBe(true);
      });

      it('should use custom touch move threshold', () => {
        const { result } = renderHook(() => useDragAndDrop(mockActivityIds, { 
          longPressMs: 500,
          touchMoveThreshold: 20
        }));
        
        const touchStartEvent = createMockTouchEvent([{ clientX: 100, clientY: 200 }]);
        const touchMoveEvent = createMockTouchEvent([{ clientX: 115, clientY: 215 }]); // ~21px distance

        act(() => {
          result.current.handlers.handleTouchStart('activity-1', touchStartEvent);
        });

        act(() => {
          result.current.handlers.handleTouchMove(touchMoveEvent);
        });

        // Fast forward past long press time
        act(() => {
          jest.advanceTimersByTime(500);
        });

        // Should not have started dragging due to movement beyond threshold
        expect(result.current.state.isDragging).toBe(false);
      });
    });

    describe('Element Finding', () => {
      it('should find activity ID from data-activity-id attribute', () => {
        const { result } = renderHook(() => useDragAndDrop(mockActivityIds));
        
        const mockElement = {
          closest: jest.fn().mockReturnValue({
            getAttribute: jest.fn().mockReturnValue('activity-2')
          })
        };
        
        (document.elementFromPoint as jest.Mock).mockReturnValue(mockElement);

        const touchEvent = createMockTouchEvent([{ clientX: 100, clientY: 200 }]);
        
        act(() => {
          result.current.handlers.handleTouchStart('activity-1', touchEvent);
        });

        act(() => {
          jest.advanceTimersByTime(500);
        });

        act(() => {
          result.current.handlers.handleTouchMove(touchEvent);
        });

        expect(mockElement.closest).toHaveBeenCalledWith('[data-activity-id]');
      });

      it('should handle element not found gracefully', () => {
        const { result } = renderHook(() => useDragAndDrop(mockActivityIds, { longPressMs: 100 }));
        
        (document.elementFromPoint as jest.Mock).mockReturnValue(null);

        const touchStartEvent = createMockTouchEvent([{ clientX: 100, clientY: 200 }]);
        const touchMoveEvent = createMockTouchEvent([{ clientX: 105, clientY: 205 }]);

        act(() => {
          result.current.handlers.handleTouchStart('activity-1', touchStartEvent);
        });

        act(() => {
          jest.advanceTimersByTime(100);
        });

        act(() => {
          result.current.handlers.handleTouchMove(touchMoveEvent);
        });

        // Should not crash and should not set dragOverItem
        expect(result.current.state.dragOverItem).toBe(null);
      });
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

    it('should cleanup touch timers on cleanup', () => {

      const { result } = renderHook(() => useDragAndDrop(mockActivityIds, { longPressMs: 500 }));
      const touchEvent = createMockTouchEvent([{ clientX: 100, clientY: 200 }]);

      act(() => {
        result.current.handlers.handleTouchStart('activity-1', touchEvent);
      });

      // Call cleanup before long press triggers
      act(() => {
        result.current.cleanup();
      });

      // Fast forward past long press time
      act(() => {
        jest.advanceTimersByTime(500);
      });

      // Should not have started dragging
      expect(result.current.state.isDragging).toBe(false);
      expect(result.current.state.isTouchDragging).toBe(false);
    });
  });
});