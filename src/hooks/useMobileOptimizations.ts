/**
 * React hook for Material 3 Expressive mobile optimizations
 * 
 * Provides mobile-specific functionality including touch detection,
 * orientation handling, and responsive behavior.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  isTouchDevice,
  isPortraitOrientation,
  getViewportSize,
  isMobileViewport,
  isTabletViewport,
  handleOrientationChange,
  createRippleEffect,
  getTouchOptimizedSpacing,
  getTouchOptimizedSize,
} from '../utils/material3-mobile-utils';

export interface MobileOptimizationState {
  /** Whether the device supports touch */
  isTouch: boolean;
  
  /** Current device orientation */
  orientation: 'portrait' | 'landscape';
  
  /** Current viewport size category */
  viewportSize: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  
  /** Whether the viewport is mobile-sized */
  isMobile: boolean;
  
  /** Whether the viewport is tablet-sized */
  isTablet: boolean;
  
  /** Whether the device is in portrait mode */
  isPortrait: boolean;
}

export interface MobileOptimizationActions {
  /** Get touch-optimized spacing for a given base spacing */
  getTouchSpacing: (baseSpacing: string) => string;
  
  /** Get touch-optimized size for a component */
  getTouchSize: (component: 'button' | 'input' | 'icon') => number;
  
  /** Create ripple effect on an element */
  createRipple: (element: HTMLElement, event: TouchEvent | MouseEvent) => void;
  
  /** Check if hover effects should be enabled */
  shouldEnableHover: () => boolean;
}

export interface UseMobileOptimizationsReturn extends MobileOptimizationState, MobileOptimizationActions {}

/**
 * Hook for Material 3 Expressive mobile optimizations
 */
export function useMobileOptimizations(): UseMobileOptimizationsReturn {
  const [state, setState] = useState<MobileOptimizationState>(() => ({
    isTouch: false,
    orientation: 'portrait',
    viewportSize: 'md',
    isMobile: false,
    isTablet: false,
    isPortrait: true,
  }));
  
  const orientationCleanupRef = useRef<(() => void) | null>(null);
  
  // Initialize state on mount
  useEffect(() => {
    const updateState = () => {
      setState({
        isTouch: isTouchDevice(),
        orientation: isPortraitOrientation() ? 'portrait' : 'landscape',
        viewportSize: getViewportSize(),
        isMobile: isMobileViewport(),
        isTablet: isTabletViewport(),
        isPortrait: isPortraitOrientation(),
      });
    };
    
    updateState();
    
    // Set up orientation change listener
    orientationCleanupRef.current = handleOrientationChange((orientation) => {
      setState(prev => ({
        ...prev,
        orientation,
        isPortrait: orientation === 'portrait',
        viewportSize: getViewportSize(),
        isMobile: isMobileViewport(),
        isTablet: isTabletViewport(),
      }));
    });
    
    // Set up resize listener for viewport changes
    const handleResize = () => {
      setState(prev => ({
        ...prev,
        viewportSize: getViewportSize(),
        isMobile: isMobileViewport(),
        isTablet: isTabletViewport(),
        isPortrait: isPortraitOrientation(),
      }));
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      if (orientationCleanupRef.current) {
        orientationCleanupRef.current();
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Get touch-optimized spacing
  const getTouchSpacing = useCallback((baseSpacing: string): string => {
    return getTouchOptimizedSpacing(baseSpacing);
  }, []);
  
  // Get touch-optimized size
  const getTouchSize = useCallback((component: 'button' | 'input' | 'icon'): number => {
    return getTouchOptimizedSize(component);
  }, []);
  
  // Create ripple effect
  const createRipple = useCallback((element: HTMLElement, event: TouchEvent | MouseEvent): void => {
    createRippleEffect(element, event);
  }, []);
  
  // Check if hover effects should be enabled
  const shouldEnableHover = useCallback((): boolean => {
    return !state.isTouch;
  }, [state.isTouch]);
  
  return {
    ...state,
    getTouchSpacing,
    getTouchSize,
    createRipple,
    shouldEnableHover,
  };
}

/**
 * Hook for responsive values based on viewport size
 */
export function useResponsiveValue<T>(values: {
  xs?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  xxl?: T;
  default: T;
}): T {
  const { viewportSize } = useMobileOptimizations();
  
  return values[viewportSize] ?? values.default;
}

/**
 * Hook for touch-optimized event handlers
 */
export function useTouchOptimizedHandlers() {
  const { isTouch, createRipple } = useMobileOptimizations();
  
  const createTouchHandler = useCallback((
    onClick: (event: React.MouseEvent | React.TouchEvent) => void,
    options: { enableRipple?: boolean } = {}
  ) => {
    return {
      onClick: (event: React.MouseEvent) => {
        if (options.enableRipple && event.currentTarget instanceof HTMLElement) {
          createRipple(event.currentTarget, event.nativeEvent);
        }
        onClick(event);
      },
      onTouchStart: isTouch ? (event: React.TouchEvent) => {
        if (options.enableRipple && event.currentTarget instanceof HTMLElement) {
          const touch = event.touches[0];
          if (touch) {
            createRipple(event.currentTarget, {
              clientX: touch.clientX,
              clientY: touch.clientY,
            } as MouseEvent);
          }
        }
      } : undefined,
    };
  }, [isTouch, createRipple]);
  
  return { createTouchHandler };
}

/**
 * Hook for managing device orientation changes
 */
export function useOrientationChange(
  callback: (orientation: 'portrait' | 'landscape') => void
) {
  const { orientation } = useMobileOptimizations();
  const previousOrientationRef = useRef(orientation);
  
  useEffect(() => {
    if (previousOrientationRef.current !== orientation) {
      callback(orientation);
      previousOrientationRef.current = orientation;
    }
  }, [orientation, callback]);
}

/**
 * Hook for viewport-aware animations
 */
export function useViewportAwareAnimations() {
  const { isMobile, isTablet } = useMobileOptimizations();
  
  const getAnimationDuration = useCallback((baseDuration: number): number => {
    if (isMobile) return baseDuration * 0.8; // Faster on mobile
    if (isTablet) return baseDuration * 0.9; // Slightly faster on tablet
    return baseDuration;
  }, [isMobile, isTablet]);
  
  const shouldReduceMotion = useCallback((): boolean => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);
  
  return {
    getAnimationDuration,
    shouldReduceMotion,
  };
}