/**
 * Drag and drop state management hook for activity reordering
 * Handles drag events, visual feedback, and persistent order updates
 * @module useDragAndDrop
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { reorderActivities } from '../utils/activity-storage';
import { isDragAndDropSupported, isTouchSupported, isVibrationSupported } from '../utils/feature-detection';
import { startPerformanceTimer, endPerformanceTimer } from '../utils/performance-monitor';

/**
 * Drag and drop state interface
 */
export interface DragAndDropState {
  draggedItem: string | null;
  dragOverItem: string | null;
  isDragging: boolean;
  isTouchDragging: boolean;
  touchStartPosition: { x: number; y: number } | null;
  isSupported: boolean;
  supportedMethods: {
    dragAndDrop: boolean;
    touch: boolean;
    vibration: boolean;
  };
}

/**
 * Drag and drop event handlers interface
 */
export interface DragAndDropHandlers {
  handleDragStart: (activityId: string) => void;
  handleDragOver: (activityId: string) => void;
  handleDragEnd: () => void;
  handleDrop: (targetId: string) => void;
  handleDragEnter: (activityId: string) => void;
  handleDragLeave: () => void;
  // Touch event handlers
  handleTouchStart: (activityId: string, event: TouchEvent) => void;
  handleTouchMove: (event: TouchEvent) => void;
  handleTouchEnd: (event: TouchEvent) => void;
  handleTouchCancel: () => void;
}

/**
 * Hook options interface
 */
export interface UseDragAndDropOptions {
  onReorder?: (newOrder: string[]) => void;
  debounceMs?: number;
  longPressMs?: number;
  touchMoveThreshold?: number;
}

/**
 * Custom hook for managing drag-and-drop state and reordering logic
 * @param activityIds Array of activity IDs in current order
 * @param options Hook configuration options
 * @returns Drag state and event handlers
 */
export function useDragAndDrop(
  activityIds: string[],
  options: UseDragAndDropOptions = {}
) {
  const { onReorder, debounceMs = 300, longPressMs = 500, touchMoveThreshold = 10 } = options;
  
  // Feature detection
  const [supportedMethods] = useState(() => ({
    dragAndDrop: isDragAndDropSupported(),
    touch: isTouchSupported(),
    vibration: isVibrationSupported(),
  }));
  
  // Drag and drop state
  const [state, setState] = useState<DragAndDropState>({
    draggedItem: null,
    dragOverItem: null,
    isDragging: false,
    isTouchDragging: false,
    touchStartPosition: null,
    isSupported: supportedMethods.dragAndDrop || supportedMethods.touch,
    supportedMethods,
  });

  // Debounce timer ref for order persistence
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Touch-specific refs
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartTimeRef = useRef<number>(0);
  const currentTouchActivityRef = useRef<string | null>(null);
  const touchMoveCountRef = useRef<number>(0);

  /**
   * Clear any pending debounced operations
   */
  const clearDebounceTimer = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
  }, []);

  /**
   * Clear long press timer
   */
  const clearLongPressTimer = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }, []);

  /**
   * Reset touch-specific state
   */
  const resetTouchState = useCallback(() => {
    clearLongPressTimer();
    currentTouchActivityRef.current = null;
    touchMoveCountRef.current = 0;
    setState(prev => ({
      ...prev,
      isTouchDragging: false,
      touchStartPosition: null,
    }));
  }, [clearLongPressTimer]);

  /**
   * Persist the new order with debouncing to reduce localStorage writes
   */
  const persistOrder = useCallback((newOrder: string[]) => {
    clearDebounceTimer();
    
    debounceTimerRef.current = setTimeout(() => {
      try {
        reorderActivities(newOrder);
        onReorder?.(newOrder);
      } catch (error) {
        console.error('Failed to persist activity order:', error);
      }
    }, debounceMs);
  }, [clearDebounceTimer, onReorder, debounceMs]);

  /**
   * Calculate new order after drag and drop operation
   */
  const calculateNewOrder = useCallback((draggedId: string, targetId: string): string[] => {
    if (draggedId === targetId) {
      return activityIds;
    }

    const newOrder = [...activityIds];
    const draggedIndex = newOrder.indexOf(draggedId);
    const targetIndex = newOrder.indexOf(targetId);

    if (draggedIndex === -1 || targetIndex === -1) {
      throw new Error('Invalid drag operation: activity not found in current order');
    }

    // Remove dragged item from its current position
    const removedItems = newOrder.splice(draggedIndex, 1);
    const draggedItem = removedItems[0];
    
    if (!draggedItem) {
      throw new Error('Failed to remove dragged item from order');
    }
    
    // Insert dragged item at target position
    newOrder.splice(targetIndex, 0, draggedItem);

    return newOrder;
  }, [activityIds]);

  /**
   * Handle drag start event
   */
  const handleDragStart = useCallback((activityId: string) => {
    startPerformanceTimer('drag-start', { activityId });
    
    if (!activityId || typeof activityId !== 'string') {
      console.warn('Invalid activity ID provided to handleDragStart');
      endPerformanceTimer('drag-start');
      return;
    }

    // Check if drag and drop is supported
    if (!supportedMethods.dragAndDrop) {
      console.warn('Drag and drop is not supported in this browser');
      endPerformanceTimer('drag-start');
      return;
    }

    setState(prev => ({
      ...prev,
      draggedItem: activityId,
      isDragging: true,
      dragOverItem: null,
    }));
    
    endPerformanceTimer('drag-start');
  }, [supportedMethods.dragAndDrop]);

  /**
   * Handle drag over event (for visual feedback)
   */
  const handleDragOver = useCallback((activityId: string) => {
    if (!activityId || typeof activityId !== 'string') {
      return;
    }

    setState(prev => {
      // Only update if different from current dragOverItem
      if (prev.dragOverItem !== activityId) {
        return {
          ...prev,
          dragOverItem: activityId,
        };
      }
      return prev;
    });
  }, []);

  /**
   * Handle drag enter event
   */
  const handleDragEnter = useCallback((activityId: string) => {
    if (!activityId || typeof activityId !== 'string') {
      return;
    }

    setState(prev => ({
      ...prev,
      dragOverItem: activityId,
    }));
  }, []);

  /**
   * Handle drag leave event
   */
  const handleDragLeave = useCallback(() => {
    setState(prev => ({
      ...prev,
      dragOverItem: null,
    }));
  }, []);

  /**
   * Handle drag end event (cleanup)
   */
  const handleDragEnd = useCallback(() => {
    startPerformanceTimer('drag-end');
    
    resetTouchState();
    setState(prev => ({
      ...prev,
      draggedItem: null,
      dragOverItem: null,
      isDragging: false,
      isTouchDragging: false,
      touchStartPosition: null,
    }));
    
    endPerformanceTimer('drag-end');
  }, [resetTouchState]);

  /**
   * Handle drop event (perform reordering)
   */
  const handleDrop = useCallback((targetId: string) => {
    startPerformanceTimer('reorder-drop', { 
      draggedItem: state.draggedItem, 
      targetId,
      activityCount: activityIds.length 
    });
    
    if (!state.draggedItem || !targetId) {
      console.warn('Invalid drop operation: missing dragged item or target');
      handleDragEnd();
      endPerformanceTimer('reorder-drop');
      return;
    }

    if (state.draggedItem === targetId) {
      // Dropped on itself, no reordering needed
      handleDragEnd();
      endPerformanceTimer('reorder-drop');
      return;
    }

    try {
      const newOrder = calculateNewOrder(state.draggedItem, targetId);
      
      // Persist the new order
      persistOrder(newOrder);
      
      // Clear drag state
      handleDragEnd();
      endPerformanceTimer('reorder-drop');
    } catch (error) {
      if (error instanceof Error && error.message.includes('activity not found')) {
        console.warn(error.message);
      } else if (error instanceof Error && error.message.includes('localStorage')) {
        console.error('Failed to persist reorder due to storage error:', error);
        // Still clear drag state even if persistence failed
      } else {
        console.error('Failed to handle drop operation:', error);
      }
      handleDragEnd();
      endPerformanceTimer('reorder-drop');
    }
  }, [state.draggedItem, calculateNewOrder, persistOrder, handleDragEnd, activityIds.length]);

  /**
   * Get visual feedback classes for an activity
   */
  const getActivityClasses = useCallback((activityId: string) => {
    const classes: string[] = [];
    
    if (state.draggedItem === activityId) {
      classes.push('dragging');
    }
    
    if (state.dragOverItem === activityId && state.draggedItem !== activityId) {
      classes.push('drag-over');
    }
    
    return classes.join(' ');
  }, [state.draggedItem, state.dragOverItem]);

  /**
   * Check if an activity is currently being dragged
   */
  const isActivityDragged = useCallback((activityId: string) => {
    return state.draggedItem === activityId;
  }, [state.draggedItem]);

  /**
   * Check if an activity is currently being dragged over
   */
  const isActivityDraggedOver = useCallback((activityId: string) => {
    return state.dragOverItem === activityId && state.draggedItem !== activityId;
  }, [state.draggedItem, state.dragOverItem]);

  /**
   * Get element at touch position
   */
  const getElementAtTouchPosition = useCallback((touch: Touch): Element | null => {
    return document.elementFromPoint(touch.clientX, touch.clientY);
  }, []);

  /**
   * Find activity ID from touch target element
   */
  const findActivityIdFromElement = useCallback((element: Element | null): string | null => {
    if (!element) return null;
    
    // Look for activity button or card element with data-activity-id
    const activityElement = element.closest('[data-activity-id]');
    if (activityElement) {
      return activityElement.getAttribute('data-activity-id');
    }
    
    // Fallback: look for activity ID in class names or other attributes
    let current = element as Element | null;
    while (current && current !== document.body) {
      // Check for activity ID in various formats
      const classList = Array.from(current.classList || []);
      for (const className of classList) {
        if (className.startsWith('activity-') && activityIds.includes(className)) {
          return className;
        }
      }
      
      // Check data attributes
      const dataId = current.getAttribute('data-id') || current.getAttribute('id');
      if (dataId && activityIds.includes(dataId)) {
        return dataId;
      }
      
      current = current.parentElement;
    }
    
    return null;
  }, [activityIds]);

  /**
   * Handle touch start event
   */
  const handleTouchStart = useCallback((activityId: string, event: TouchEvent) => {
    if (!activityId || typeof activityId !== 'string') {
      console.warn('Invalid activity ID provided to handleTouchStart');
      return;
    }

    // Check if touch is supported
    if (!supportedMethods.touch) {
      console.warn('Touch events are not supported in this browser');
      return;
    }

    // Prevent multiple touches
    if (event.touches.length > 1) {
      resetTouchState();
      return;
    }

    const touch = event.touches[0];
    if (!touch) return;

    // Store touch start information
    currentTouchActivityRef.current = activityId;
    touchStartTimeRef.current = Date.now();
    touchMoveCountRef.current = 0;

    setState(prev => ({
      ...prev,
      touchStartPosition: { x: touch.clientX, y: touch.clientY },
    }));

    // Start long press timer
    clearLongPressTimer();
    longPressTimerRef.current = setTimeout(() => {
      // Only start drag if we haven't moved too much
      if (touchMoveCountRef.current < 3 && currentTouchActivityRef.current === activityId) {
        setState(prev => ({
          ...prev,
          draggedItem: activityId,
          isDragging: true,
          isTouchDragging: true,
          dragOverItem: null,
        }));

        // Provide haptic feedback if available
        if (supportedMethods.vibration) {
          try {
            navigator.vibrate(50);
          } catch (error) {
            console.warn('Failed to provide haptic feedback:', error);
          }
        }
      }
    }, longPressMs);
  }, [longPressMs, clearLongPressTimer, resetTouchState, supportedMethods.touch, supportedMethods.vibration]);

  /**
   * Handle touch move event
   */
  const handleTouchMove = useCallback((event: TouchEvent) => {
    const touch = event.touches[0];
    if (!touch || !currentTouchActivityRef.current) return;

    touchMoveCountRef.current++;

    // If we have a touch start position, check if we've moved beyond threshold
    if (state.touchStartPosition) {
      const deltaX = Math.abs(touch.clientX - state.touchStartPosition.x);
      const deltaY = Math.abs(touch.clientY - state.touchStartPosition.y);
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      // If we've moved too much before long press, cancel the long press
      if (distance > touchMoveThreshold && !state.isTouchDragging) {
        clearLongPressTimer();
        currentTouchActivityRef.current = null;
        return;
      }
    }

    // If we're in touch drag mode, handle drag over
    if (state.isTouchDragging && state.draggedItem) {
      event.preventDefault(); // Prevent scrolling during drag

      const elementUnderTouch = getElementAtTouchPosition(touch);
      const targetActivityId = findActivityIdFromElement(elementUnderTouch);

      if (targetActivityId && targetActivityId !== state.draggedItem) {
        setState(prev => ({
          ...prev,
          dragOverItem: targetActivityId,
        }));
      }
    }
  }, [state.touchStartPosition, state.isTouchDragging, state.draggedItem, touchMoveThreshold, clearLongPressTimer, getElementAtTouchPosition, findActivityIdFromElement]);

  /**
   * Handle touch end event
   */
  const handleTouchEnd = useCallback((event: TouchEvent) => {
    const wasInTouchDrag = state.isTouchDragging;
    const draggedItem = state.draggedItem;
    
    // Clear long press timer
    clearLongPressTimer();

    // If we were in touch drag mode, handle the drop
    if (wasInTouchDrag && draggedItem && event.changedTouches.length > 0) {
      const touch = event.changedTouches[0];
      const elementUnderTouch = getElementAtTouchPosition(touch);
      const targetActivityId = findActivityIdFromElement(elementUnderTouch);

      if (targetActivityId && targetActivityId !== draggedItem) {
        // Perform the drop
        try {
          const newOrder = calculateNewOrder(draggedItem, targetActivityId);
          persistOrder(newOrder);
        } catch (error) {
          if (error instanceof Error && error.message.includes('activity not found')) {
            console.warn(error.message);
          } else {
            console.error('Failed to handle touch drop operation:', error);
          }
        }
      }
    }

    // Reset all touch state
    resetTouchState();
    setState(prev => ({
      ...prev,
      draggedItem: null,
      dragOverItem: null,
      isDragging: false,
      isTouchDragging: false,
      touchStartPosition: null,
    }));
  }, [state.isTouchDragging, state.draggedItem, clearLongPressTimer, getElementAtTouchPosition, findActivityIdFromElement, calculateNewOrder, persistOrder, resetTouchState]);

  /**
   * Handle touch cancel event
   */
  const handleTouchCancel = useCallback(() => {
    resetTouchState();
    setState(prev => ({
      ...prev,
      draggedItem: null,
      dragOverItem: null,
      isDragging: false,
      isTouchDragging: false,
      touchStartPosition: null,
    }));
  }, [resetTouchState]);

  // Cleanup debounce timer on unmount
  const cleanup = useCallback(() => {
    clearDebounceTimer();
    clearLongPressTimer();
    resetTouchState();
  }, [clearDebounceTimer, clearLongPressTimer, resetTouchState]);

  /**
   * Check if any reordering method is available
   */
  const isReorderingAvailable = useCallback(() => {
    return state.isSupported;
  }, [state.isSupported]);

  /**
   * Get available reordering methods
   */
  const getAvailableMethods = useCallback(() => {
    const methods: string[] = [];
    
    if (supportedMethods.dragAndDrop) {
      methods.push('drag-and-drop');
    }
    
    if (supportedMethods.touch) {
      methods.push('touch');
    }
    
    // Keyboard is always available as fallback
    methods.push('keyboard');
    
    return methods;
  }, [supportedMethods]);

  /**
   * Get user-friendly message about available reordering methods
   */
  const getReorderingInstructions = useCallback(() => {
    const methods = getAvailableMethods();
    
    if (methods.includes('drag-and-drop') && methods.includes('touch')) {
      return 'Drag and drop activities to reorder, or use long press on touch devices. Use Ctrl+Up/Down for keyboard navigation.';
    } else if (methods.includes('drag-and-drop')) {
      return 'Drag and drop activities to reorder, or use Ctrl+Up/Down for keyboard navigation.';
    } else if (methods.includes('touch')) {
      return 'Long press and drag activities to reorder, or use Ctrl+Up/Down for keyboard navigation.';
    } else {
      return 'Use Ctrl+Up/Down arrow keys to reorder activities.';
    }
  }, [getAvailableMethods]);

  const handlers: DragAndDropHandlers = {
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDrop,
    handleDragEnter,
    handleDragLeave,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleTouchCancel,
  };

  return {
    state,
    handlers,
    getActivityClasses,
    isActivityDragged,
    isActivityDraggedOver,
    isReorderingAvailable,
    getAvailableMethods,
    getReorderingInstructions,
    cleanup,
  };
}

export default useDragAndDrop;