/**
 * Feature detection utilities for progressive enhancement
 * Provides graceful degradation when browser features are not supported
 * @module feature-detection
 */

/**
 * Check if HTML5 drag and drop API is supported
 * @returns True if drag and drop is supported, false otherwise
 */
export function isDragAndDropSupported(): boolean {
  try {
    // Check if we're in a browser environment
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return false;
    }
    
    // Check for drag and drop API support
    const testElement = document.createElement('div');
    
    return (
      'draggable' in testElement &&
      typeof testElement.ondragstart !== 'undefined' &&
      typeof testElement.ondragover !== 'undefined' &&
      typeof testElement.ondrop !== 'undefined' &&
      typeof testElement.ondragend !== 'undefined'
    );
  } catch {
    return false;
  }
}

/**
 * Check if touch events are supported
 * @returns True if touch events are supported, false otherwise
 */
export function isTouchSupported(): boolean {
  try {
    if (typeof window === 'undefined') {
      return false;
    }
    
    return (
      'ontouchstart' in window ||
      (window.navigator && window.navigator.maxTouchPoints > 0) ||
      ('DocumentTouch' in window && document instanceof (window as unknown as { DocumentTouch: new() => Document }).DocumentTouch)
    );
  } catch {
    return false;
  }
}

/**
 * Check if localStorage is available and functional
 * @returns True if localStorage is available, false otherwise
 */
export function isLocalStorageSupported(): boolean {
  try {
    if (typeof localStorage === 'undefined') {
      return false;
    }
    
    // Test localStorage functionality
    const testKey = '__feature_test__';
    localStorage.setItem(testKey, 'test');
    const retrieved = localStorage.getItem(testKey);
    localStorage.removeItem(testKey);
    
    return retrieved === 'test';
  } catch {
    return false;
  }
}

/**
 * Check if the Vibration API is supported
 * @returns True if vibration is supported, false otherwise
 */
export function isVibrationSupported(): boolean {
  try {
    return typeof navigator !== 'undefined' && 'vibrate' in navigator;
  } catch {
    return false;
  }
}

/**
 * Check if the user prefers reduced motion
 * @returns True if user prefers reduced motion, false otherwise
 */
export function prefersReducedMotion(): boolean {
  try {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return false;
    }
    
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
}

/**
 * Get supported reordering methods based on browser capabilities
 * @returns Object indicating which reordering methods are supported
 */
export function getSupportedReorderingMethods(): {
  dragAndDrop: boolean;
  touch: boolean;
  keyboard: boolean;
  reducedMotion: boolean;
} {
  return {
    dragAndDrop: isDragAndDropSupported(),
    touch: isTouchSupported(),
    keyboard: true, // Keyboard navigation is always supported
    reducedMotion: prefersReducedMotion(),
  };
}

/**
 * Get the best available reordering method for the current environment
 * @returns The recommended reordering method
 */
export function getRecommendedReorderingMethod(): 'drag-drop' | 'touch' | 'keyboard' {
  const support = getSupportedReorderingMethods();
  
  // If user prefers reduced motion, recommend keyboard
  if (support.reducedMotion) {
    return 'keyboard';
  }
  
  // If touch is supported, prefer touch (mobile-first)
  if (support.touch) {
    return 'touch';
  }
  
  // If drag and drop is supported, use it
  if (support.dragAndDrop) {
    return 'drag-drop';
  }
  
  // Fallback to keyboard
  return 'keyboard';
}

/**
 * Check if the current environment supports activity reordering
 * @returns True if at least one reordering method is supported
 */
export function isReorderingSupported(): boolean {
  const support = getSupportedReorderingMethods();
  return support.dragAndDrop || support.touch || support.keyboard;
}