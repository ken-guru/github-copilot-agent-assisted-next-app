/**
 * Drag and drop state management hook for activity reordering
 * Handles drag events, visual feedback, and persistent order updates
 * @module useDragAndDrop
 */

import { useState, useCallback, useRef } from 'react';
import { reorderActivities } from '../utils/activity-storage';

/**
 * Drag and drop state interface
 */
export interface DragAndDropState {
  draggedItem: string | null;
  dragOverItem: string | null;
  isDragging: boolean;
  isTouchDragging: boolean;
  touchStartPosition: { x: number; y: number } | null;
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
  
  // Drag and drop state
  const [state, setState] = useState<DragAndDropState>({
    draggedItem: null,
    dragOverItem: null,
    isDragging: false,
    isTouchDragging: false,
    touchStartPosition: null,
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
    if (!activityId || typeof activityId !== 'string') {
      console.warn('Invalid activity ID provided to handleDragStart');
      return;
    }

    setState(prev => ({
      ...prev,
      draggedItem: activityId,
      isDragging: true,
      dragOverItem: null,
    }));
  }, []);

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
    resetTouchState();
    setState({
      draggedItem: null,
      dragOverItem: null,
      isDragging: false,
      isTouchDragging: false,
      touchStartPosition: null,
    });
  }, [resetTouchState]);

  /**
   * Handle drop event (perform reordering)
   */
  const handleDrop = useCallback((targetId: string) => {
    if (!state.draggedItem || !targetId) {
      console.warn('Invalid drop operation: missing dragged item or target');
      handleDragEnd();
      return;
    }

    if (state.draggedItem === targetId) {
      // Dropped on itself, no reordering needed
      handleDragEnd();
      return;
    }

    try {
      const newOrder = calculateNewOrder(state.draggedItem, targetId);
      
      // Persist the new order
      persistOrder(newOrder);
      
      // Clear drag state
      handleDragEnd();
    } catch (error) {
      if (error instanceof Error && error.message.includes('activity not found')) {
        console.warn(error.message);
      } else {
        console.error('Failed to handle drop operation:', error);
      }
      handleDragEnd();
    }
  }, [state.draggedItem, calculateNewOrder, persistOrder, handleDragEnd]);

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
        if ('vibrate' in navigator) {
          navigator.vibrate(50);
        }
      }
    }, longPressMs);
  }, [longPressMs, clearLongPressTimer, resetTouchState]);

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
    cleanup,
  };
}

export default useDragAndDrop;