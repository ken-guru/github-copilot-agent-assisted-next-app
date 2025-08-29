/**
 * Device orientation and viewport utilities for Material 3 Expressive design
 * Handles device rotation, viewport changes, and safe area management
 */

import React from 'react';

export interface ViewportInfo {
  width: number;
  height: number;
  orientation: 'portrait' | 'landscape';
  isTouch: boolean;
  deviceType: 'mobile' | 'tablet' | 'desktop';
}

/**
 * Gets current viewport information
 */
export function getViewportInfo(): ViewportInfo {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const isTouch = 'ontouchstart' in window;
  
  // Determine orientation
  const orientation = width > height ? 'landscape' : 'portrait';
  
  // Determine device type based on viewport size and touch capability
  let deviceType: 'mobile' | 'tablet' | 'desktop';
  if (isTouch) {
    if (width < 600) {
      deviceType = 'mobile';
    } else {
      deviceType = 'tablet';
    }
  } else {
    deviceType = 'desktop';
  }

  return { width, height, orientation, isTouch, deviceType };
}

/**
 * Handles device rotation with smooth transitions
 */
export function handleDeviceRotation(
  onRotation: (info: ViewportInfo) => void,
  debounceMs = 250
): () => void {
  let timeoutId: NodeJS.Timeout | null = null;
  
  const handleResize = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    timeoutId = setTimeout(() => {
      const viewportInfo = getViewportInfo();
      onRotation(viewportInfo);
    }, debounceMs);
  };

  // Listen for both resize and orientation change events
  window.addEventListener('resize', handleResize);
  window.addEventListener('orientationchange', handleResize);

  // Return cleanup function
  return () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('orientationchange', handleResize);
  };
}

/**
 * CSS classes for different device orientations
 */
export function getOrientationStyles(
  portraitClasses: string,
  landscapeClasses: string
): string {
  return `portrait:${portraitClasses} landscape:${landscapeClasses}`;
}

/**
 * Viewport-based conditional rendering helper
 */
export function useViewportConditional() {
  const [viewportInfo, setViewportInfo] = React.useState<ViewportInfo | null>(null);

  React.useEffect(() => {
    // Initial viewport info
    setViewportInfo(getViewportInfo());

    // Set up rotation handler
    const cleanup = handleDeviceRotation((info) => {
      setViewportInfo(info);
    });

    return cleanup;
  }, []);

  return viewportInfo;
}

/**
 * Safe area management for devices with notches, etc.
 */
export function applySafeAreaStyles(element: HTMLElement): void {
  // Apply CSS custom properties for safe areas
  element.style.paddingTop = 'max(env(safe-area-inset-top), 0px)';
  element.style.paddingBottom = 'max(env(safe-area-inset-bottom), 0px)';
  element.style.paddingLeft = 'max(env(safe-area-inset-left), 0px)';
  element.style.paddingRight = 'max(env(safe-area-inset-right), 0px)';
}

/**
 * Dynamic viewport height that accounts for mobile browser UI
 */
export function updateViewportHeight(): void {
  // Use the actual viewport height, accounting for mobile browser UI
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

/**
 * Setup viewport height management
 */
export function setupViewportHeightManagement(): () => void {
  // Initial setup
  updateViewportHeight();

  // Update on resize and orientation change
  const handleUpdate = () => {
    updateViewportHeight();
  };

  window.addEventListener('resize', handleUpdate);
  window.addEventListener('orientationchange', handleUpdate);

  // Return cleanup function
  return () => {
    window.removeEventListener('resize', handleUpdate);
    window.removeEventListener('orientationchange', handleUpdate);
  };
}

/**
 * Keyboard handling for mobile devices
 */
export function handleVirtualKeyboard(
  onKeyboardShow: (height: number) => void,
  onKeyboardHide: () => void
): () => void {
  let initialViewportHeight = window.innerHeight;
  
  const handleResize = () => {
    const currentHeight = window.innerHeight;
    const heightDifference = initialViewportHeight - currentHeight;
    
    // Threshold for detecting virtual keyboard (typically > 150px change)
    if (heightDifference > 150) {
      onKeyboardShow(heightDifference);
    } else {
      onKeyboardHide();
      initialViewportHeight = currentHeight; // Update baseline
    }
  };

  window.addEventListener('resize', handleResize);
  
  return () => {
    window.removeEventListener('resize', handleResize);
  };
}

/**
 * React hook for handling device orientation
 */
export function useDeviceOrientation() {
  // This is a placeholder for the React hook implementation
  // Would need to be implemented in a React component context
  return {
    orientation: 'portrait' as 'portrait' | 'landscape',
    isSupported: true,
    angle: 0
  };
}

/**
 * Responsive breakpoint detection
 */
export function getCurrentBreakpoint(): 'xs' | 'sm' | 'md' | 'lg' | 'xl' {
  const width = window.innerWidth;
  
  if (width < 600) return 'xs';
  if (width < 905) return 'sm';
  if (width < 1240) return 'md';
  if (width < 1440) return 'lg';
  return 'xl';
}

/**
 * Smooth transition for orientation changes
 */
export function addOrientationTransition(element: HTMLElement): void {
  element.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
}

/**
 * Device-specific optimization hints
 */
export function getDeviceOptimizations(deviceType: 'mobile' | 'tablet' | 'desktop'): {
  animationPreference: 'reduced' | 'standard' | 'enhanced';
  shadowIntensity: 'light' | 'standard' | 'enhanced';
  touchTargetSize: 'compact' | 'standard' | 'large';
} {
  switch (deviceType) {
    case 'mobile':
      return {
        animationPreference: 'reduced', // Preserve battery
        shadowIntensity: 'light',       // Better performance
        touchTargetSize: 'large'        // Better accessibility
      };
    case 'tablet':
      return {
        animationPreference: 'standard',
        shadowIntensity: 'standard',
        touchTargetSize: 'standard'
      };
    case 'desktop':
      return {
        animationPreference: 'enhanced',
        shadowIntensity: 'enhanced',
        touchTargetSize: 'compact'
      };
  }
}