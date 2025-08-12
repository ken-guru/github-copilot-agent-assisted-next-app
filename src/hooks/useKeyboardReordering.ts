import { useState, useCallback, useRef, useEffect } from 'react';
import { getActivityOrder, setActivityOrder } from '@/utils/activity-order';

export interface KeyboardReorderingState {
  focusedItem: string | null;
  isReordering: boolean;
  lastAnnouncedPosition: number | null;
}

export interface KeyboardReorderingHandlers {
  handleKeyDown: (event: KeyboardEvent, activityId: string) => void;
  setFocusedItem: (activityId: string | null) => void;
  announcePosition: (activityId: string, newPosition: number, totalItems: number, customMessage?: string) => void;
  clearAnnouncements: () => void;
}

export interface UseKeyboardReorderingProps {
  activityIds: string[];
  onReorder?: (newOrder: string[]) => void;
  announceDelay?: number;
}

/**
 * Hook for keyboard-based activity reordering with accessibility support
 * Provides keyboard navigation (Ctrl+Up/Down, Alt+Up/Down) and screen reader announcements
 */
export function useKeyboardReordering({
  activityIds,
  onReorder,
  announceDelay = 300
}: UseKeyboardReorderingProps): KeyboardReorderingState & KeyboardReorderingHandlers {
  const [focusedItem, setFocusedItem] = useState<string | null>(null);
  const [isReordering, setIsReordering] = useState(false);
  const [lastAnnouncedPosition, setLastAnnouncedPosition] = useState<number | null>(null);
  
  // Ref for the ARIA live region
  const liveRegionRef = useRef<HTMLDivElement | null>(null);
  const announceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Move an activity up or down in the order
   */
  const moveActivity = useCallback((activityId: string, direction: 'up' | 'down') => {
    const currentOrder = getActivityOrder();
    let orderToUse: string[];

    // If no custom order exists, use the current activity IDs as the base order
    if (currentOrder.length === 0) {
      orderToUse = [...activityIds];
    } else {
      // Ensure all current activities are in the order
      const missingIds = activityIds.filter(id => !currentOrder.includes(id));
      orderToUse = [...currentOrder, ...missingIds];
    }

    const currentIndex = orderToUse.indexOf(activityId);
    if (currentIndex === -1) {
      console.warn(`Activity ${activityId} not found in order`);
      return;
    }

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    // Check bounds
    if (newIndex < 0 || newIndex >= orderToUse.length) {
      // Announce that we can't move further
      const position = direction === 'up' ? 'first' : 'last';
      announcePosition(activityId, currentIndex + 1, orderToUse.length, `Already at ${position} position`);
      return;
    }

    // Create new order by swapping items
    const newOrder = [...orderToUse];
    const currentItem = newOrder[currentIndex];
    const targetItem = newOrder[newIndex];
    if (currentItem && targetItem) {
      newOrder[currentIndex] = targetItem;
      newOrder[newIndex] = currentItem;
    }

    // Save the new order
    setActivityOrder(newOrder);
    
    // Announce the new position
    announcePosition(activityId, newIndex + 1, newOrder.length);
    
    // Call the onReorder callback if provided
    onReorder?.(newOrder);
  }, [activityIds, onReorder, announceDelay]);

  /**
   * Handle keyboard events for reordering
   */
  const handleKeyDown = useCallback((event: KeyboardEvent, activityId: string) => {
    // Check for reordering key combinations
    const isCtrlModifier = event.ctrlKey && !event.altKey && !event.shiftKey && !event.metaKey;
    const isAltModifier = event.altKey && !event.ctrlKey && !event.shiftKey && !event.metaKey;
    
    if (!isCtrlModifier && !isAltModifier) {
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      event.stopPropagation();
      setIsReordering(true);
      moveActivity(activityId, 'up');
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      event.stopPropagation();
      setIsReordering(true);
      moveActivity(activityId, 'down');
      return;
    }
  }, [moveActivity]);

  /**
   * Announce position changes to screen readers
   */
  const announcePosition = useCallback((
    activityId: string, 
    newPosition: number, 
    totalItems: number,
    customMessage?: string
  ) => {
    if (!liveRegionRef.current) {
      return;
    }

    // Clear any existing timeout
    if (announceTimeoutRef.current) {
      clearTimeout(announceTimeoutRef.current);
    }

    const message = customMessage || `Activity moved to position ${newPosition} of ${totalItems}`;
    
    // Use a slight delay to ensure screen readers pick up the announcement
    announceTimeoutRef.current = setTimeout(() => {
      if (liveRegionRef.current) {
        liveRegionRef.current.textContent = message;
        setLastAnnouncedPosition(newPosition);
      }
    }, announceDelay);
  }, [announceDelay]);

  /**
   * Clear announcements from the live region
   */
  const clearAnnouncements = useCallback(() => {
    if (announceTimeoutRef.current) {
      clearTimeout(announceTimeoutRef.current);
      announceTimeoutRef.current = null;
    }
    
    if (liveRegionRef.current) {
      liveRegionRef.current.textContent = '';
    }
    
    setLastAnnouncedPosition(null);
    setIsReordering(false);
  }, []);

  /**
   * Create and manage the ARIA live region
   */
  useEffect(() => {
    // Create the live region if it doesn't exist
    if (!liveRegionRef.current) {
      const liveRegion = document.createElement('div');
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.setAttribute('class', 'sr-only');
      liveRegion.style.position = 'absolute';
      liveRegion.style.left = '-10000px';
      liveRegion.style.width = '1px';
      liveRegion.style.height = '1px';
      liveRegion.style.overflow = 'hidden';
      
      document.body.appendChild(liveRegion);
      liveRegionRef.current = liveRegion;
    }

    // Cleanup function
    return () => {
      if (announceTimeoutRef.current) {
        clearTimeout(announceTimeoutRef.current);
      }
      
      if (liveRegionRef.current && document.body.contains(liveRegionRef.current)) {
        document.body.removeChild(liveRegionRef.current);
        liveRegionRef.current = null;
      }
    };
  }, []);

  /**
   * Clear reordering state after a delay
   */
  useEffect(() => {
    if (isReordering) {
      const timeout = setTimeout(() => {
        setIsReordering(false);
      }, 1000); // Clear reordering state after 1 second

      return () => clearTimeout(timeout);
    }
  }, [isReordering]);

  return {
    focusedItem,
    isReordering,
    lastAnnouncedPosition,
    handleKeyDown,
    setFocusedItem,
    announcePosition,
    clearAnnouncements
  };
}