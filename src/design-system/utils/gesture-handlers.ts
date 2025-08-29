/**
 * Mobile gesture handlers for Material 3 Expressive design
 * Implements swipe gestures, pull-to-refresh, and advanced touch interactions
 */

export interface SwipeGestureOptions {
  threshold?: number; // Minimum distance for swipe
  velocityThreshold?: number; // Minimum velocity for swipe
  maxTime?: number; // Maximum time for swipe gesture
  direction?: 'horizontal' | 'vertical' | 'both';
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

export interface PullToRefreshOptions {
  threshold?: number; // Distance to trigger refresh
  onRefresh: () => Promise<void> | void;
  refreshIndicator?: HTMLElement;
}

interface TouchPoint {
  x: number;
  y: number;
  time: number;
}

/**
 * Enhanced swipe gesture handler with velocity and direction detection
 */
export function addSwipeGestures(
  element: HTMLElement,
  options: SwipeGestureOptions
): () => void {
  const {
    threshold = 50,
    velocityThreshold = 0.3,
    maxTime = 1000,
    direction = 'horizontal',
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown
  } = options;

  let startPoint: TouchPoint | null = null;
  let currentPoint: TouchPoint | null = null;

  const handleTouchStart = (event: TouchEvent) => {
    if (event.touches.length !== 1) return;
    
    const touch = event.touches[0];
    if (!touch) return;
    
    startPoint = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };
    currentPoint = startPoint;
  };

  const handleTouchMove = (event: TouchEvent) => {
    if (!startPoint || event.touches.length !== 1) return;
    
    const touch = event.touches[0];
    if (!touch) return;
    
    currentPoint = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };
  };

  const handleTouchEnd = (event: TouchEvent) => {
    if (!startPoint || !currentPoint) return;

    const deltaX = currentPoint.x - startPoint.x;
    const deltaY = currentPoint.y - startPoint.y;
    const deltaTime = currentPoint.time - startPoint.time;
    
    // Check if gesture is within time limit
    if (deltaTime > maxTime) {
      resetGesture();
      return;
    }

    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const velocity = distance / deltaTime;

    // Check if distance and velocity meet thresholds
    if (distance < threshold || velocity < velocityThreshold) {
      resetGesture();
      return;
    }

    // Determine primary direction
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);
    
    if (direction === 'horizontal' || (direction === 'both' && absX > absY)) {
      // Horizontal swipe
      if (deltaX > 0 && onSwipeRight) {
        event.preventDefault();
        onSwipeRight();
      } else if (deltaX < 0 && onSwipeLeft) {
        event.preventDefault();
        onSwipeLeft();
      }
    } else if (direction === 'vertical' || (direction === 'both' && absY > absX)) {
      // Vertical swipe
      if (deltaY > 0 && onSwipeDown) {
        event.preventDefault();
        onSwipeDown();
      } else if (deltaY < 0 && onSwipeUp) {
        event.preventDefault();
        onSwipeUp();
      }
    }

    resetGesture();
  };

  const resetGesture = () => {
    startPoint = null;
    currentPoint = null;
  };

  const handleTouchCancel = () => {
    resetGesture();
  };

  // Add passive listeners for better performance
  const options_passive = { passive: false };
  
  element.addEventListener('touchstart', handleTouchStart, options_passive);
  element.addEventListener('touchmove', handleTouchMove, options_passive);
  element.addEventListener('touchend', handleTouchEnd, options_passive);
  element.addEventListener('touchcancel', handleTouchCancel, options_passive);

  // Return cleanup function
  return () => {
    element.removeEventListener('touchstart', handleTouchStart);
    element.removeEventListener('touchmove', handleTouchMove);
    element.removeEventListener('touchend', handleTouchEnd);
    element.removeEventListener('touchcancel', handleTouchCancel);
  };
}

/**
 * Pull-to-refresh gesture handler
 */
export function addPullToRefresh(
  element: HTMLElement,
  options: PullToRefreshOptions
): () => void {
  const { threshold = 80, onRefresh, refreshIndicator } = options;
  
  let startY = 0;
  let currentY = 0;
  let isRefreshing = false;
  let isPulling = false;

  const handleTouchStart = (event: TouchEvent) => {
    if (event.touches.length !== 1 || isRefreshing) return;
    
    // Only allow pull-to-refresh at the top of the scroll container
    if (element.scrollTop > 0) return;
    
    const touch = event.touches[0];
    if (!touch) return;
    
    startY = touch.clientY;
    isPulling = true;
  };

  const handleTouchMove = (event: TouchEvent) => {
    if (!isPulling || event.touches.length !== 1 || isRefreshing) return;
    
    const touch = event.touches[0];
    if (!touch) return;
    
    currentY = touch.clientY;
    const deltaY = currentY - startY;
    
    // Only allow downward motion
    if (deltaY <= 0) {
      isPulling = false;
      return;
    }

    // Prevent default scrolling when pulling
    if (element.scrollTop === 0) {
      event.preventDefault();
    }

    // Update refresh indicator
    if (refreshIndicator) {
      const progress = Math.min(deltaY / threshold, 1);
      refreshIndicator.style.transform = `translateY(${deltaY * 0.5}px)`;
      refreshIndicator.style.opacity = progress.toString();
      
      if (progress >= 1) {
        refreshIndicator.classList.add('ready');
      } else {
        refreshIndicator.classList.remove('ready');
      }
    }
  };

  const handleTouchEnd = async () => {
    if (!isPulling || isRefreshing) return;
    
    const deltaY = currentY - startY;
    
    if (deltaY >= threshold) {
      isRefreshing = true;
      
      // Trigger refresh
      try {
        await onRefresh();
      } catch (error) {
        console.error('Pull to refresh failed:', error);
      } finally {
        isRefreshing = false;
      }
    }
    
    // Reset state
    isPulling = false;
    
    // Reset indicator
    if (refreshIndicator) {
      refreshIndicator.style.transform = '';
      refreshIndicator.style.opacity = '';
      refreshIndicator.classList.remove('ready');
    }
  };

  const handleTouchCancel = () => {
    isPulling = false;
    isRefreshing = false;
    
    if (refreshIndicator) {
      refreshIndicator.style.transform = '';
      refreshIndicator.style.opacity = '';
      refreshIndicator.classList.remove('ready');
    }
  };

  const options_passive = { passive: false };
  
  element.addEventListener('touchstart', handleTouchStart, options_passive);
  element.addEventListener('touchmove', handleTouchMove, options_passive);
  element.addEventListener('touchend', handleTouchEnd, options_passive);
  element.addEventListener('touchcancel', handleTouchCancel, options_passive);

  return () => {
    element.removeEventListener('touchstart', handleTouchStart);
    element.removeEventListener('touchmove', handleTouchMove);
    element.removeEventListener('touchend', handleTouchEnd);
    element.removeEventListener('touchcancel', handleTouchCancel);
  };
}

/**
 * Tab navigation with swipe gestures
 */
export function addTabSwipeNavigation(
  container: HTMLElement,
  tabs: { id: string; element: HTMLElement }[],
  options: {
    onTabChange: (tabId: string) => void;
    getCurrentTab: () => string;
    enableSwipeNavigation?: boolean;
  }
): () => void {
  const { onTabChange, getCurrentTab, enableSwipeNavigation = true } = options;
  
  if (!enableSwipeNavigation) {
    return () => {}; // Return empty cleanup function
  }

  const swipeCleanup = addSwipeGestures(container, {
    direction: 'horizontal',
    threshold: 100,
    velocityThreshold: 0.5,
    onSwipeLeft: () => {
      // Navigate to next tab
      const currentTabId = getCurrentTab();
      const currentIndex = tabs.findIndex(tab => tab.id === currentTabId);
      if (currentIndex !== -1) {
        const nextIndex = (currentIndex + 1) % tabs.length;
        const nextTab = tabs[nextIndex];
        if (nextTab) {
          onTabChange(nextTab.id);
        }
      }
    },
    onSwipeRight: () => {
      // Navigate to previous tab
      const currentTabId = getCurrentTab();
      const currentIndex = tabs.findIndex(tab => tab.id === currentTabId);
      if (currentIndex !== -1) {
        const prevIndex = currentIndex === 0 ? tabs.length - 1 : currentIndex - 1;
        const prevTab = tabs[prevIndex];
        if (prevTab) {
          onTabChange(prevTab.id);
        }
      }
    }
  });

  return swipeCleanup;
}

/**
 * Navigation drawer swipe gestures
 */
export function addDrawerSwipeGestures(
  options: {
    onOpen: () => void;
    onClose: () => void;
    isOpen: () => boolean;
    edgeThreshold?: number;
  }
): () => void {
  const { onOpen, onClose, isOpen, edgeThreshold = 20 } = options;
  
  const swipeFromEdgeCleanup = addSwipeGestures(document.body, {
    direction: 'horizontal',
    threshold: 50,
    onSwipeRight: () => {
      // Only open if we can detect edge start (would need more complex tracking)
      if (!isOpen()) {
        onOpen();
      }
    },
    onSwipeLeft: () => {
      // Close drawer if open
      if (isOpen()) {
        onClose();
      }
    }
  });

  return swipeFromEdgeCleanup;
}