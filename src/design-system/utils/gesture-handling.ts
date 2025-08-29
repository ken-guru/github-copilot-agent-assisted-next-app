/**
 * Mobile gesture utilities for Material 3 Expressive design
 * Implements Material 3 gesture patterns and touch interactions
 */

export interface SwipeGestureOptions {
  threshold?: number;          // Minimum distance for swipe detection (px)
  velocityThreshold?: number;  // Minimum velocity for swipe (px/ms)
  preventScrolling?: boolean;  // Prevent scrolling during gesture
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

export interface PinchGestureOptions {
  threshold?: number;          // Minimum scale change for pinch detection
  onPinchStart?: (scale: number) => void;
  onPinchMove?: (scale: number) => void;
  onPinchEnd?: (scale: number) => void;
}

/**
 * Adds swipe gesture handling to an element
 */
export function addSwipeGesture(
  element: HTMLElement,
  options: SwipeGestureOptions
): () => void {
  const {
    threshold = 50,
    velocityThreshold = 0.3,
    preventScrolling = false,
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown
  } = options;

  let startX = 0;
  let startY = 0;
  let startTime = 0;
  let isTracking = false;

  const handleTouchStart = (event: TouchEvent) => {
    if (event.touches.length !== 1) return;

    const touch = event.touches[0];
    if (!touch) return;

    startX = touch.clientX;
    startY = touch.clientY;
    startTime = Date.now();
    isTracking = true;

    if (preventScrolling) {
      event.preventDefault();
    }
  };

  const handleTouchMove = (event: TouchEvent) => {
    if (!isTracking || event.touches.length !== 1) return;

    if (preventScrolling) {
      event.preventDefault();
    }
  };

  const handleTouchEnd = (event: TouchEvent) => {
    if (!isTracking) return;

    const touch = event.changedTouches[0];
    if (!touch) return;

    const endX = touch.clientX;
    const endY = touch.clientY;
    const endTime = Date.now();

    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const deltaTime = endTime - startTime;

    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    // Calculate velocity
    const velocityX = absX / deltaTime;
    const velocityY = absY / deltaTime;

    // Determine if gesture meets thresholds
    const isValidSwipe = (absX > threshold || absY > threshold) && 
                        (velocityX > velocityThreshold || velocityY > velocityThreshold);

    if (isValidSwipe) {
      // Determine primary direction
      if (absX > absY) {
        // Horizontal swipe
        if (deltaX > 0 && onSwipeRight) {
          onSwipeRight();
        } else if (deltaX < 0 && onSwipeLeft) {
          onSwipeLeft();
        }
      } else {
        // Vertical swipe
        if (deltaY > 0 && onSwipeDown) {
          onSwipeDown();
        } else if (deltaY < 0 && onSwipeUp) {
          onSwipeUp();
        }
      }
    }

    isTracking = false;
  };

  const handleTouchCancel = () => {
    isTracking = false;
  };

  // Add event listeners with passive option for better performance
  const passiveOptions = { passive: !preventScrolling };
  element.addEventListener('touchstart', handleTouchStart, passiveOptions);
  element.addEventListener('touchmove', handleTouchMove, passiveOptions);
  element.addEventListener('touchend', handleTouchEnd, passiveOptions);
  element.addEventListener('touchcancel', handleTouchCancel, passiveOptions);

  // Return cleanup function
  return () => {
    element.removeEventListener('touchstart', handleTouchStart);
    element.removeEventListener('touchmove', handleTouchMove);
    element.removeEventListener('touchend', handleTouchEnd);
    element.removeEventListener('touchcancel', handleTouchCancel);
  };
}

/**
 * Adds pinch/zoom gesture handling to an element
 */
export function addPinchGesture(
  element: HTMLElement,
  options: PinchGestureOptions
): () => void {
  const {
    threshold = 0.1,
    onPinchStart,
    onPinchMove,
    onPinchEnd
  } = options;

  let initialDistance = 0;
  let currentScale = 1;
  let isTracking = false;

  const getDistance = (touches: TouchList): number => {
    if (touches.length < 2) return 0;
    
    const touch1 = touches[0];
    const touch2 = touches[1];
    
    if (!touch1 || !touch2) return 0;

    const dx = touch2.clientX - touch1.clientX;
    const dy = touch2.clientY - touch1.clientY;
    
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = (event: TouchEvent) => {
    if (event.touches.length === 2) {
      initialDistance = getDistance(event.touches);
      isTracking = true;
      currentScale = 1;
      
      if (onPinchStart) {
        onPinchStart(currentScale);
      }
      
      event.preventDefault();
    }
  };

  const handleTouchMove = (event: TouchEvent) => {
    if (!isTracking || event.touches.length !== 2) return;

    const currentDistance = getDistance(event.touches);
    if (initialDistance === 0) return;

    const newScale = currentDistance / initialDistance;
    const scaleDiff = Math.abs(newScale - currentScale);

    // Only trigger if scale change is above threshold
    if (scaleDiff > threshold) {
      currentScale = newScale;
      
      if (onPinchMove) {
        onPinchMove(currentScale);
      }
    }

    event.preventDefault();
  };

  const handleTouchEnd = (event: TouchEvent) => {
    if (!isTracking) return;

    if (event.touches.length < 2) {
      isTracking = false;
      
      if (onPinchEnd) {
        onPinchEnd(currentScale);
      }
    }
  };

  element.addEventListener('touchstart', handleTouchStart, { passive: false });
  element.addEventListener('touchmove', handleTouchMove, { passive: false });
  element.addEventListener('touchend', handleTouchEnd, { passive: false });

  return () => {
    element.removeEventListener('touchstart', handleTouchStart);
    element.removeEventListener('touchmove', handleTouchMove);
    element.removeEventListener('touchend', handleTouchEnd);
  };
}

/**
 * Adds long press gesture handling
 */
export function addLongPressGesture(
  element: HTMLElement,
  onLongPress: () => void,
  duration = 500
): () => void {
  let pressTimer: NodeJS.Timeout | null = null;
  let isPressed = false;

  const handleStart = () => {
    isPressed = true;
    pressTimer = setTimeout(() => {
      if (isPressed) {
        onLongPress();
      }
    }, duration);
  };

  const handleEnd = () => {
    isPressed = false;
    if (pressTimer) {
      clearTimeout(pressTimer);
      pressTimer = null;
    }
  };

  // Support both mouse and touch events
  element.addEventListener('mousedown', handleStart);
  element.addEventListener('mouseup', handleEnd);
  element.addEventListener('mouseleave', handleEnd);
  element.addEventListener('touchstart', handleStart, { passive: true });
  element.addEventListener('touchend', handleEnd, { passive: true });
  element.addEventListener('touchcancel', handleEnd, { passive: true });

  return () => {
    if (pressTimer) {
      clearTimeout(pressTimer);
    }
    element.removeEventListener('mousedown', handleStart);
    element.removeEventListener('mouseup', handleEnd);
    element.removeEventListener('mouseleave', handleEnd);
    element.removeEventListener('touchstart', handleStart);
    element.removeEventListener('touchend', handleEnd);
    element.removeEventListener('touchcancel', handleEnd);
  };
}

/**
 * Utility to prevent default scroll behavior during custom gestures
 */
export function preventScrollDuringGesture(element: HTMLElement): () => void {
  const handleTouchMove = (event: TouchEvent) => {
    event.preventDefault();
  };

  element.addEventListener('touchmove', handleTouchMove, { passive: false });

  return () => {
    element.removeEventListener('touchmove', handleTouchMove);
  };
}

/**
 * Detects if device supports hover (non-touch devices)
 */
export function supportsHover(): boolean {
  return window.matchMedia('(hover: hover)').matches;
}

/**
 * Adaptive gesture handling based on device capabilities
 */
export function getAdaptiveEventHandlers(
  onActivate: () => void,
  onSecondaryAction?: () => void
): {
  onClick?: () => void;
  onTouchStart?: () => void;
  onContextMenu?: (event: Event) => void;
} {
  const isTouchDevice = 'ontouchstart' in window;
  
  if (isTouchDevice) {
    return {
      onTouchStart: onActivate,
      onContextMenu: onSecondaryAction ? (event: Event) => {
        event.preventDefault();
        onSecondaryAction();
      } : undefined
    };
  } else {
    return {
      onClick: onActivate,
      onContextMenu: onSecondaryAction ? (event: Event) => {
        event.preventDefault();
        onSecondaryAction();
      } : undefined
    };
  }
}