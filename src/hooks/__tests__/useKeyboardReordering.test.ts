import { renderHook, act } from '@testing-library/react';
import { useKeyboardReordering } from '../useKeyboardReordering';
import * as activityOrderUtils from '@/utils/activity-order';

// Mock the activity order utilities
jest.mock('@/utils/activity-order');

const mockGetActivityOrder = activityOrderUtils.getActivityOrder as jest.MockedFunction<typeof activityOrderUtils.getActivityOrder>;
const mockSetActivityOrder = activityOrderUtils.setActivityOrder as jest.MockedFunction<typeof activityOrderUtils.setActivityOrder>;

describe('useKeyboardReordering', () => {
  const mockActivityIds = ['activity-1', 'activity-2', 'activity-3', 'activity-4'];
  const mockOnReorder = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetActivityOrder.mockReturnValue([]);
    
    // Mock console.warn to avoid noise in tests
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    // Clean up any live regions that might have been created
    const liveRegions = document.querySelectorAll('[aria-live]');
    liveRegions.forEach(region => {
      if (document.body.contains(region)) {
        document.body.removeChild(region);
      }
    });
    
    jest.restoreAllMocks();
  });

  describe('initialization', () => {
    it('should initialize with default state', () => {
      const { result } = renderHook(() =>
        useKeyboardReordering({
          activityIds: mockActivityIds,
          onReorder: mockOnReorder
        })
      );

      expect(result.current.focusedItem).toBeNull();
      expect(result.current.isReordering).toBe(false);
      expect(result.current.lastAnnouncedPosition).toBeNull();
    });

    it('should create ARIA live region on mount', () => {
      renderHook(() =>
        useKeyboardReordering({
          activityIds: mockActivityIds,
          onReorder: mockOnReorder
        })
      );

      const liveRegion = document.querySelector('[aria-live="polite"]');
      expect(liveRegion).toBeInTheDocument();
      expect(liveRegion).toHaveAttribute('aria-atomic', 'true');
      expect(liveRegion).toHaveClass('sr-only');
    });
  });

  describe('focus management', () => {
    it('should set focused item', () => {
      const { result } = renderHook(() =>
        useKeyboardReordering({
          activityIds: mockActivityIds,
          onReorder: mockOnReorder
        })
      );

      act(() => {
        result.current.setFocusedItem('activity-1');
      });

      expect(result.current.focusedItem).toBe('activity-1');
    });

    it('should clear focused item', () => {
      const { result } = renderHook(() =>
        useKeyboardReordering({
          activityIds: mockActivityIds,
          onReorder: mockOnReorder
        })
      );

      act(() => {
        result.current.setFocusedItem('activity-1');
      });

      act(() => {
        result.current.setFocusedItem(null);
      });

      expect(result.current.focusedItem).toBeNull();
    });
  });

  describe('keyboard event handling', () => {
    it('should handle Ctrl+ArrowUp to move activity up', () => {
      mockGetActivityOrder.mockReturnValue(['activity-1', 'activity-2', 'activity-3']);
      
      const { result } = renderHook(() =>
        useKeyboardReordering({
          activityIds: mockActivityIds,
          onReorder: mockOnReorder
        })
      );

      const event = new KeyboardEvent('keydown', {
        key: 'ArrowUp',
        ctrlKey: true,
        altKey: false,
        shiftKey: false,
        metaKey: false
      });

      // Mock preventDefault and stopPropagation
      const preventDefault = jest.fn();
      const stopPropagation = jest.fn();
      Object.defineProperty(event, 'preventDefault', { value: preventDefault });
      Object.defineProperty(event, 'stopPropagation', { value: stopPropagation });

      act(() => {
        result.current.handleKeyDown(event, 'activity-2');
      });

      expect(preventDefault).toHaveBeenCalled();
      expect(stopPropagation).toHaveBeenCalled();
      expect(mockSetActivityOrder).toHaveBeenCalledWith(['activity-2', 'activity-1', 'activity-3', 'activity-4']);
      expect(mockOnReorder).toHaveBeenCalledWith(['activity-2', 'activity-1', 'activity-3', 'activity-4']);
      expect(result.current.isReordering).toBe(true);
    });

    it('should handle Ctrl+ArrowDown to move activity down', () => {
      mockGetActivityOrder.mockReturnValue(['activity-1', 'activity-2', 'activity-3']);
      
      const { result } = renderHook(() =>
        useKeyboardReordering({
          activityIds: mockActivityIds,
          onReorder: mockOnReorder
        })
      );

      const event = new KeyboardEvent('keydown', {
        key: 'ArrowDown',
        ctrlKey: true,
        altKey: false,
        shiftKey: false,
        metaKey: false
      });

      const preventDefault = jest.fn();
      const stopPropagation = jest.fn();
      Object.defineProperty(event, 'preventDefault', { value: preventDefault });
      Object.defineProperty(event, 'stopPropagation', { value: stopPropagation });

      act(() => {
        result.current.handleKeyDown(event, 'activity-2');
      });

      expect(preventDefault).toHaveBeenCalled();
      expect(stopPropagation).toHaveBeenCalled();
      expect(mockSetActivityOrder).toHaveBeenCalledWith(['activity-1', 'activity-3', 'activity-2', 'activity-4']);
      expect(mockOnReorder).toHaveBeenCalledWith(['activity-1', 'activity-3', 'activity-2', 'activity-4']);
      expect(result.current.isReordering).toBe(true);
    });

    it('should handle Alt+ArrowUp to move activity up', () => {
      mockGetActivityOrder.mockReturnValue(['activity-1', 'activity-2', 'activity-3']);
      
      const { result } = renderHook(() =>
        useKeyboardReordering({
          activityIds: mockActivityIds,
          onReorder: mockOnReorder
        })
      );

      const event = new KeyboardEvent('keydown', {
        key: 'ArrowUp',
        ctrlKey: false,
        altKey: true,
        shiftKey: false,
        metaKey: false
      });

      const preventDefault = jest.fn();
      const stopPropagation = jest.fn();
      Object.defineProperty(event, 'preventDefault', { value: preventDefault });
      Object.defineProperty(event, 'stopPropagation', { value: stopPropagation });

      act(() => {
        result.current.handleKeyDown(event, 'activity-2');
      });

      expect(preventDefault).toHaveBeenCalled();
      expect(stopPropagation).toHaveBeenCalled();
      expect(mockSetActivityOrder).toHaveBeenCalledWith(['activity-2', 'activity-1', 'activity-3', 'activity-4']);
      expect(mockOnReorder).toHaveBeenCalledWith(['activity-2', 'activity-1', 'activity-3', 'activity-4']);
    });

    it('should ignore events without proper modifier keys', () => {
      const { result } = renderHook(() =>
        useKeyboardReordering({
          activityIds: mockActivityIds,
          onReorder: mockOnReorder
        })
      );

      const event = new KeyboardEvent('keydown', {
        key: 'ArrowUp',
        ctrlKey: false,
        altKey: false,
        shiftKey: false,
        metaKey: false
      });

      const preventDefault = jest.fn();
      const stopPropagation = jest.fn();
      Object.defineProperty(event, 'preventDefault', { value: preventDefault });
      Object.defineProperty(event, 'stopPropagation', { value: stopPropagation });

      act(() => {
        result.current.handleKeyDown(event, 'activity-2');
      });

      expect(preventDefault).not.toHaveBeenCalled();
      expect(stopPropagation).not.toHaveBeenCalled();
      expect(mockSetActivityOrder).not.toHaveBeenCalled();
      expect(mockOnReorder).not.toHaveBeenCalled();
    });

    it('should ignore events with multiple modifier keys', () => {
      const { result } = renderHook(() =>
        useKeyboardReordering({
          activityIds: mockActivityIds,
          onReorder: mockOnReorder
        })
      );

      const event = new KeyboardEvent('keydown', {
        key: 'ArrowUp',
        ctrlKey: true,
        altKey: true,
        shiftKey: false,
        metaKey: false
      });

      const preventDefault = jest.fn();
      const stopPropagation = jest.fn();
      Object.defineProperty(event, 'preventDefault', { value: preventDefault });
      Object.defineProperty(event, 'stopPropagation', { value: stopPropagation });

      act(() => {
        result.current.handleKeyDown(event, 'activity-2');
      });

      expect(preventDefault).not.toHaveBeenCalled();
      expect(stopPropagation).not.toHaveBeenCalled();
      expect(mockSetActivityOrder).not.toHaveBeenCalled();
    });

    it('should ignore non-arrow keys', () => {
      const { result } = renderHook(() =>
        useKeyboardReordering({
          activityIds: mockActivityIds,
          onReorder: mockOnReorder
        })
      );

      const event = new KeyboardEvent('keydown', {
        key: 'Enter',
        ctrlKey: true,
        altKey: false,
        shiftKey: false,
        metaKey: false
      });

      const preventDefault = jest.fn();
      const stopPropagation = jest.fn();
      Object.defineProperty(event, 'preventDefault', { value: preventDefault });
      Object.defineProperty(event, 'stopPropagation', { value: stopPropagation });

      act(() => {
        result.current.handleKeyDown(event, 'activity-2');
      });

      expect(preventDefault).not.toHaveBeenCalled();
      expect(stopPropagation).not.toHaveBeenCalled();
      expect(mockSetActivityOrder).not.toHaveBeenCalled();
    });
  });

  describe('boundary conditions', () => {
    it('should not move activity up when already at first position', () => {
      mockGetActivityOrder.mockReturnValue(['activity-1', 'activity-2', 'activity-3']);
      
      const { result } = renderHook(() =>
        useKeyboardReordering({
          activityIds: mockActivityIds,
          onReorder: mockOnReorder,
          announceDelay: 0 // Immediate announcement for testing
        })
      );

      const event = new KeyboardEvent('keydown', {
        key: 'ArrowUp',
        ctrlKey: true
      });

      const preventDefault = jest.fn();
      const stopPropagation = jest.fn();
      Object.defineProperty(event, 'preventDefault', { value: preventDefault });
      Object.defineProperty(event, 'stopPropagation', { value: stopPropagation });

      act(() => {
        result.current.handleKeyDown(event, 'activity-1');
      });

      expect(mockSetActivityOrder).not.toHaveBeenCalled();
      expect(mockOnReorder).not.toHaveBeenCalled();
    });

    it('should not move activity down when already at last position', () => {
      // Use all activities in order so activity-4 is truly at the last position
      mockGetActivityOrder.mockReturnValue(['activity-1', 'activity-2', 'activity-3', 'activity-4']);
      
      const { result } = renderHook(() =>
        useKeyboardReordering({
          activityIds: mockActivityIds,
          onReorder: mockOnReorder,
          announceDelay: 0
        })
      );

      const event = new KeyboardEvent('keydown', {
        key: 'ArrowDown',
        ctrlKey: true
      });

      const preventDefault = jest.fn();
      const stopPropagation = jest.fn();
      Object.defineProperty(event, 'preventDefault', { value: preventDefault });
      Object.defineProperty(event, 'stopPropagation', { value: stopPropagation });

      act(() => {
        result.current.handleKeyDown(event, 'activity-4');
      });

      expect(mockSetActivityOrder).not.toHaveBeenCalled();
      expect(mockOnReorder).not.toHaveBeenCalled();
    });

    it('should handle activity not found in order', () => {
      mockGetActivityOrder.mockReturnValue(['activity-1', 'activity-2']);
      
      const { result } = renderHook(() =>
        useKeyboardReordering({
          activityIds: ['activity-1', 'activity-2'], // Only include activities that are in the order
          onReorder: mockOnReorder
        })
      );

      const event = new KeyboardEvent('keydown', {
        key: 'ArrowUp',
        ctrlKey: true
      });

      const preventDefault = jest.fn();
      const stopPropagation = jest.fn();
      Object.defineProperty(event, 'preventDefault', { value: preventDefault });
      Object.defineProperty(event, 'stopPropagation', { value: stopPropagation });

      act(() => {
        result.current.handleKeyDown(event, 'activity-3');
      });

      expect(console.warn).toHaveBeenCalledWith('Activity activity-3 not found in order');
      expect(mockSetActivityOrder).not.toHaveBeenCalled();
    });
  });

  describe('no custom order handling', () => {
    it('should use activity IDs as base order when no custom order exists', () => {
      mockGetActivityOrder.mockReturnValue([]);
      
      const { result } = renderHook(() =>
        useKeyboardReordering({
          activityIds: mockActivityIds,
          onReorder: mockOnReorder
        })
      );

      const event = new KeyboardEvent('keydown', {
        key: 'ArrowUp',
        ctrlKey: true
      });

      const preventDefault = jest.fn();
      const stopPropagation = jest.fn();
      Object.defineProperty(event, 'preventDefault', { value: preventDefault });
      Object.defineProperty(event, 'stopPropagation', { value: stopPropagation });

      act(() => {
        result.current.handleKeyDown(event, 'activity-2');
      });

      expect(mockSetActivityOrder).toHaveBeenCalledWith(['activity-2', 'activity-1', 'activity-3', 'activity-4']);
      expect(mockOnReorder).toHaveBeenCalledWith(['activity-2', 'activity-1', 'activity-3', 'activity-4']);
    });

    it('should add missing activities to existing order', () => {
      mockGetActivityOrder.mockReturnValue(['activity-1', 'activity-2']);
      
      const { result } = renderHook(() =>
        useKeyboardReordering({
          activityIds: mockActivityIds,
          onReorder: mockOnReorder
        })
      );

      const event = new KeyboardEvent('keydown', {
        key: 'ArrowDown',
        ctrlKey: true
      });

      const preventDefault = jest.fn();
      const stopPropagation = jest.fn();
      Object.defineProperty(event, 'preventDefault', { value: preventDefault });
      Object.defineProperty(event, 'stopPropagation', { value: stopPropagation });

      act(() => {
        result.current.handleKeyDown(event, 'activity-1');
      });

      expect(mockSetActivityOrder).toHaveBeenCalledWith(['activity-2', 'activity-1', 'activity-3', 'activity-4']);
    });
  });

  describe('announcements', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should announce position changes', () => {
      const { result } = renderHook(() =>
        useKeyboardReordering({
          activityIds: mockActivityIds,
          onReorder: mockOnReorder,
          announceDelay: 100
        })
      );

      act(() => {
        result.current.announcePosition('activity-1', 2, 4);
      });

      // Fast-forward past the announce delay
      act(() => {
        jest.advanceTimersByTime(100);
      });

      const liveRegion = document.querySelector('[aria-live="polite"]');
      expect(liveRegion).toHaveTextContent('Activity moved to position 2 of 4');
      expect(result.current.lastAnnouncedPosition).toBe(2);
    });

    it('should announce custom messages', () => {
      const { result } = renderHook(() =>
        useKeyboardReordering({
          activityIds: mockActivityIds,
          onReorder: mockOnReorder,
          announceDelay: 100
        })
      );

      act(() => {
        result.current.announcePosition('activity-1', 1, 4, 'Already at first position');
      });

      act(() => {
        jest.advanceTimersByTime(100);
      });

      const liveRegion = document.querySelector('[aria-live="polite"]');
      expect(liveRegion).toHaveTextContent('Already at first position');
    });

    it('should clear announcements', () => {
      const { result } = renderHook(() =>
        useKeyboardReordering({
          activityIds: mockActivityIds,
          onReorder: mockOnReorder,
          announceDelay: 100
        })
      );

      act(() => {
        result.current.announcePosition('activity-1', 2, 4);
      });

      act(() => {
        jest.advanceTimersByTime(100);
      });

      act(() => {
        result.current.clearAnnouncements();
      });

      const liveRegion = document.querySelector('[aria-live="polite"]');
      expect(liveRegion).toHaveTextContent('');
      expect(result.current.lastAnnouncedPosition).toBeNull();
      expect(result.current.isReordering).toBe(false);
    });

    it('should clear previous announcement timeout when new announcement is made', () => {
      const { result } = renderHook(() =>
        useKeyboardReordering({
          activityIds: mockActivityIds,
          onReorder: mockOnReorder,
          announceDelay: 100
        })
      );

      act(() => {
        result.current.announcePosition('activity-1', 2, 4);
      });

      act(() => {
        result.current.announcePosition('activity-1', 3, 4);
      });

      act(() => {
        jest.advanceTimersByTime(100);
      });

      const liveRegion = document.querySelector('[aria-live="polite"]');
      expect(liveRegion).toHaveTextContent('Activity moved to position 3 of 4');
    });
  });

  describe('cleanup', () => {
    it('should clean up live region on unmount', () => {
      const { unmount } = renderHook(() =>
        useKeyboardReordering({
          activityIds: mockActivityIds,
          onReorder: mockOnReorder
        })
      );

      expect(document.querySelector('[aria-live="polite"]')).toBeInTheDocument();

      unmount();

      expect(document.querySelector('[aria-live="polite"]')).not.toBeInTheDocument();
    });

    it('should clear timeouts on unmount', () => {
      jest.useFakeTimers();
      const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

      const { result, unmount } = renderHook(() =>
        useKeyboardReordering({
          activityIds: mockActivityIds,
          onReorder: mockOnReorder,
          announceDelay: 100
        })
      );

      act(() => {
        result.current.announcePosition('activity-1', 2, 4);
      });

      unmount();

      expect(clearTimeoutSpy).toHaveBeenCalled();

      jest.useRealTimers();
      clearTimeoutSpy.mockRestore();
    });
  });

  describe('reordering state management', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should set isReordering to true during reorder operation', () => {
      mockGetActivityOrder.mockReturnValue(['activity-1', 'activity-2', 'activity-3']);
      
      const { result } = renderHook(() =>
        useKeyboardReordering({
          activityIds: mockActivityIds,
          onReorder: mockOnReorder
        })
      );

      const event = new KeyboardEvent('keydown', {
        key: 'ArrowUp',
        ctrlKey: true
      });

      const preventDefault = jest.fn();
      const stopPropagation = jest.fn();
      Object.defineProperty(event, 'preventDefault', { value: preventDefault });
      Object.defineProperty(event, 'stopPropagation', { value: stopPropagation });

      act(() => {
        result.current.handleKeyDown(event, 'activity-2');
      });

      expect(result.current.isReordering).toBe(true);
    });

    it('should clear isReordering after timeout', () => {
      mockGetActivityOrder.mockReturnValue(['activity-1', 'activity-2', 'activity-3']);
      
      const { result } = renderHook(() =>
        useKeyboardReordering({
          activityIds: mockActivityIds,
          onReorder: mockOnReorder
        })
      );

      const event = new KeyboardEvent('keydown', {
        key: 'ArrowUp',
        ctrlKey: true
      });

      const preventDefault = jest.fn();
      const stopPropagation = jest.fn();
      Object.defineProperty(event, 'preventDefault', { value: preventDefault });
      Object.defineProperty(event, 'stopPropagation', { value: stopPropagation });

      act(() => {
        result.current.handleKeyDown(event, 'activity-2');
      });

      expect(result.current.isReordering).toBe(true);

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(result.current.isReordering).toBe(false);
    });
  });

  describe('optional onReorder callback', () => {
    it('should work without onReorder callback', () => {
      mockGetActivityOrder.mockReturnValue(['activity-1', 'activity-2', 'activity-3']);
      
      const { result } = renderHook(() =>
        useKeyboardReordering({
          activityIds: mockActivityIds
        })
      );

      const event = new KeyboardEvent('keydown', {
        key: 'ArrowUp',
        ctrlKey: true
      });

      const preventDefault = jest.fn();
      const stopPropagation = jest.fn();
      Object.defineProperty(event, 'preventDefault', { value: preventDefault });
      Object.defineProperty(event, 'stopPropagation', { value: stopPropagation });

      expect(() => {
        act(() => {
          result.current.handleKeyDown(event, 'activity-2');
        });
      }).not.toThrow();

      expect(mockSetActivityOrder).toHaveBeenCalledWith(['activity-2', 'activity-1', 'activity-3', 'activity-4']);
    });
  });
});