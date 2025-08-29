/**
 * React hook for Material 3 accessibility features
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { 
  focusManager, 
  screenReader, 
  prefersReducedMotion,
  KeyboardNavigation,
  type FocusOptions 
} from '../utils/accessibility-utils';
import { 
  Material3AriaEnhancements,
  material3ColorAccessibility 
} from '../utils/material3-accessibility';

export interface UseAccessibilityOptions {
  announceChanges?: boolean;
  manageFocus?: boolean;
  enhanceKeyboardNavigation?: boolean;
  respectReducedMotion?: boolean;
}

export interface AccessibilityState {
  prefersReducedMotion: boolean;
  prefersHighContrast: boolean;
  keyboardNavigation: boolean;
  screenReaderActive: boolean;
}

/**
 * Hook for managing accessibility features
 */
export function useAccessibility(options: UseAccessibilityOptions = {}) {
  const {
    announceChanges = true,
    manageFocus = true,
    enhanceKeyboardNavigation = true,
    respectReducedMotion = true,
  } = options;

  const [accessibilityState, setAccessibilityState] = useState<AccessibilityState>({
    prefersReducedMotion: prefersReducedMotion(),
    prefersHighContrast: false,
    keyboardNavigation: false,
    screenReaderActive: false,
  });

  const keyboardNavigationRef = useRef<KeyboardNavigation | null>(null);

  // Announce message to screen readers
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (announceChanges) {
      screenReader.announce(message, priority);
    }
  }, [announceChanges]);

  // Focus management
  const setFocus = useCallback((element: HTMLElement | null, focusOptions?: FocusOptions) => {
    if (manageFocus && element) {
      focusManager.setFocus(element, focusOptions);
    }
  }, [manageFocus]);

  const restoreFocus = useCallback(() => {
    if (manageFocus) {
      focusManager.restoreFocus();
    }
  }, [manageFocus]);

  const trapFocus = useCallback((container: HTMLElement) => {
    if (manageFocus) {
      focusManager.trapFocus(container);
    }
  }, [manageFocus]);

  const releaseFocusTrap = useCallback(() => {
    if (manageFocus) {
      focusManager.releaseFocusTrap();
    }
  }, [manageFocus]);

  // Keyboard navigation setup
  const setupKeyboardNavigation = useCallback((
    container: HTMLElement,
    selector: string,
    navigationOptions?: {
      wrap?: boolean;
      orientation?: 'horizontal' | 'vertical' | 'both';
      activateOnFocus?: boolean;
    }
  ) => {
    if (enhanceKeyboardNavigation) {
      keyboardNavigationRef.current = new KeyboardNavigation(
        container,
        selector,
        navigationOptions
      );
    }
  }, [enhanceKeyboardNavigation]);

  // Color contrast validation
  const validateContrast = useCallback((foreground: string, background: string, isLargeText = false) => {
    return material3ColorAccessibility.validateColorTokens({
      foreground,
      background,
    });
  }, []);

  // ARIA enhancements
  const enhanceButton = useCallback((button: HTMLElement, ariaOptions: {
    label?: string;
    describedBy?: string;
    pressed?: boolean;
    expanded?: boolean;
    controls?: string;
  }) => {
    Material3AriaEnhancements.enhanceButton(button, ariaOptions);
  }, []);

  const enhanceFormField = useCallback((field: HTMLElement, ariaOptions: {
    label?: string;
    required?: boolean;
    invalid?: boolean;
    describedBy?: string;
    errorMessage?: string;
  }) => {
    Material3AriaEnhancements.enhanceFormField(field, ariaOptions);
  }, []);

  // Media query listeners
  useEffect(() => {
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const highContrastQuery = window.matchMedia('(prefers-contrast: high)');

    const updateAccessibilityState = () => {
      setAccessibilityState(prev => ({
        ...prev,
        prefersReducedMotion: reducedMotionQuery.matches,
        prefersHighContrast: highContrastQuery.matches,
      }));
    };

    // Initial check
    updateAccessibilityState();

    // Add listeners
    reducedMotionQuery.addEventListener('change', updateAccessibilityState);
    highContrastQuery.addEventListener('change', updateAccessibilityState);

    return () => {
      reducedMotionQuery.removeEventListener('change', updateAccessibilityState);
      highContrastQuery.removeEventListener('change', updateAccessibilityState);
    };
  }, []);

  // Keyboard navigation detection
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        setAccessibilityState(prev => ({
          ...prev,
          keyboardNavigation: true,
        }));
      }
    };

    const handleMouseDown = () => {
      setAccessibilityState(prev => ({
        ...prev,
        keyboardNavigation: false,
      }));
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  // Screen reader detection
  useEffect(() => {
    // Simple heuristic for screen reader detection
    const checkScreenReader = () => {
      const hasAriaLive = document.querySelector('[aria-live]');
      const hasScreenReaderText = document.querySelector('.sr-only');
      
      setAccessibilityState(prev => ({
        ...prev,
        screenReaderActive: !!(hasAriaLive || hasScreenReaderText),
      }));
    };

    checkScreenReader();
    
    // Check periodically
    const interval = setInterval(checkScreenReader, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (keyboardNavigationRef.current) {
        // Cleanup keyboard navigation if needed
        keyboardNavigationRef.current = null;
      }
    };
  }, []);

  return {
    // State
    accessibilityState,
    
    // Announcement functions
    announce,
    
    // Focus management
    setFocus,
    restoreFocus,
    trapFocus,
    releaseFocusTrap,
    
    // Keyboard navigation
    setupKeyboardNavigation,
    
    // Color contrast
    validateContrast,
    
    // ARIA enhancements
    enhanceButton,
    enhanceFormField,
    
    // Utility functions
    prefersReducedMotion: accessibilityState.prefersReducedMotion,
    prefersHighContrast: accessibilityState.prefersHighContrast,
    isKeyboardNavigation: accessibilityState.keyboardNavigation,
    isScreenReaderActive: accessibilityState.screenReaderActive,
  };
}

/**
 * Hook for managing live regions
 */
export function useLiveRegion(regionId: string, priority: 'polite' | 'assertive' = 'polite') {
  const liveRegionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    liveRegionRef.current = Material3AriaEnhancements.createLiveRegion(regionId, priority);
    
    return () => {
      // Cleanup if needed
      if (liveRegionRef.current && liveRegionRef.current.parentNode) {
        liveRegionRef.current.parentNode.removeChild(liveRegionRef.current);
      }
    };
  }, [regionId, priority]);

  const announce = useCallback((message: string) => {
    if (liveRegionRef.current) {
      liveRegionRef.current.textContent = message;
      
      // Clear after announcement
      setTimeout(() => {
        if (liveRegionRef.current) {
          liveRegionRef.current.textContent = '';
        }
      }, 1000);
    }
  }, []);

  return { announce };
}

/**
 * Hook for managing focus trap in modals/dialogs
 */
export function useFocusTrap(isActive: boolean) {
  const containerRef = useRef<HTMLElement | null>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isActive && containerRef.current) {
      // Store previously focused element
      previouslyFocusedRef.current = document.activeElement as HTMLElement;
      
      // Trap focus
      focusManager.trapFocus(containerRef.current);
      
      return () => {
        // Release focus trap and restore focus
        focusManager.releaseFocusTrap();
        if (previouslyFocusedRef.current) {
          previouslyFocusedRef.current.focus();
        }
      };
    }
  }, [isActive]);

  return containerRef;
}

/**
 * Hook for reduced motion preferences
 */
export function useReducedMotion() {
  const [prefersReduced, setPrefersReduced] = useState(prefersReducedMotion());

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleChange = () => {
      setPrefersReduced(mediaQuery.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return prefersReduced;
}