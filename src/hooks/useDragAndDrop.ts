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
}

/**
 * Hook options interface
 */
export interface UseDragAndDropOptions {
  onReorder?: (newOrder: string[]) => void;
  debounceMs?: number;
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
  const { onReorder, debounceMs = 300 } = options;
  
  // Drag and drop state
  const [state, setState] = useState<DragAndDropState>({
    draggedItem: null,
    dragOverItem: null,
    isDragging: false,
  });

  // Debounce timer ref for order persistence
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

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
    const [draggedItem] = newOrder.splice(draggedIndex, 1);
    
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
    setState({
      draggedItem: null,
      dragOverItem: null,
      isDragging: false,
    });
  }, []);

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

  // Cleanup debounce timer on unmount
  const cleanup = useCallback(() => {
    clearDebounceTimer();
  }, [clearDebounceTimer]);

  const handlers: DragAndDropHandlers = {
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDrop,
    handleDragEnter,
    handleDragLeave,
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