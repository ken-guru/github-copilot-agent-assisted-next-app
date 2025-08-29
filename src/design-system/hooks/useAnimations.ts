/**
 * React Hook for Shared Element Transitions
 * Provides easy-to-use React integration for Material 3 shared element transitions
 */

import { useRef, useCallback, useEffect } from 'react';
import { 
  createSharedElementTransition, 
  registerSharedElement, 
  unregisterSharedElement,
  getSharedElement,
  SharedElementConfig 
} from '../utils/animation-utils';

export interface UseSharedElementOptions {
  id: string;
  onTransitionStart?: () => void;
  onTransitionEnd?: () => void;
  duration?: number;
  easing?: string;
}

/**
 * Hook for managing shared element transitions
 */
export function useSharedElement(options: UseSharedElementOptions) {
  const { id, onTransitionStart, onTransitionEnd, duration, easing } = options;
  const elementRef = useRef<HTMLElement>(null);

  // Register element when component mounts
  useEffect(() => {
    if (elementRef.current) {
      registerSharedElement(id, elementRef.current);
    }

    return () => {
      unregisterSharedElement(id);
    };
  }, [id]);

  // Update registration when element changes
  useEffect(() => {
    if (elementRef.current) {
      registerSharedElement(id, elementRef.current);
    }
  }, [id]);

  /**
   * Trigger transition to another shared element
   */
  const transitionTo = useCallback(async (targetId: string) => {
    if (!elementRef.current) return;

    const targetElement = getSharedElement(targetId);
    if (!targetElement) {
      console.warn(`Shared element with id "${targetId}" not found`);
      return;
    }

    onTransitionStart?.();

    const fromRect = elementRef.current.getBoundingClientRect();
    const toRect = targetElement.getBoundingClientRect();

    const config: SharedElementConfig = {
      id: `${id}-to-${targetId}`,
      element: targetElement,
      fromRect,
      toRect,
      duration,
      easing,
      onComplete: onTransitionEnd,
    };

    await createSharedElementTransition(config);
  }, [id, duration, easing, onTransitionStart, onTransitionEnd]);

  /**
   * Trigger transition from another shared element to this one
   */
  const transitionFrom = useCallback(async (sourceId: string) => {
    if (!elementRef.current) return;

    const sourceElement = getSharedElement(sourceId);
    if (!sourceElement) {
      console.warn(`Shared element with id "${sourceId}" not found`);
      return;
    }

    onTransitionStart?.();

    const fromRect = sourceElement.getBoundingClientRect();
    const toRect = elementRef.current.getBoundingClientRect();

    const config: SharedElementConfig = {
      id: `${sourceId}-to-${id}`,
      element: elementRef.current,
      fromRect,
      toRect,
      duration,
      easing,
      onComplete: onTransitionEnd,
    };

    await createSharedElementTransition(config);
  }, [id, duration, easing, onTransitionStart, onTransitionEnd]);

  return {
    ref: elementRef,
    transitionTo,
    transitionFrom,
  };
}

/**
 * Hook for page transitions with shared elements
 */
export function usePageTransition() {
  const pageRef = useRef<HTMLElement>(null);

  const transitionToPage = useCallback(async (
    targetPageRef: React.RefObject<HTMLElement>,
    direction: 'forward' | 'backward' = 'forward'
  ) => {
    if (!pageRef.current || !targetPageRef.current) return;

    const { createPageTransition } = await import('../utils/animation-utils');
    
    await createPageTransition(
      pageRef.current,
      targetPageRef.current,
      direction
    );
  }, []);

  return {
    ref: pageRef,
    transitionToPage,
  };
}

/**
 * Hook for stagger animations
 */
export function useStaggerAnimation() {
  const containerRef = useRef<HTMLElement>(null);

  const animateChildren = useCallback(async (
    direction: 'up' | 'down' | 'left' | 'right' = 'up',
    staggerDelay = 50
  ) => {
    if (!containerRef.current) return;

    const children = Array.from(containerRef.current.children) as HTMLElement[];
    
    const { createStaggerAnimation } = await import('../utils/animation-utils');
    
    await createStaggerAnimation(children, direction, staggerDelay);
  }, []);

  return {
    ref: containerRef,
    animateChildren,
  };
}

/**
 * Hook for loading animations
 */
export function useLoadingAnimation(type: 'spinner' | 'pulse' | 'shimmer' = 'spinner') {
  const elementRef = useRef<HTMLElement>(null);

  const startLoading = useCallback(() => {
    if (!elementRef.current) return () => {};

    const { createLoadingAnimation } = require('../utils/animation-utils');
    return createLoadingAnimation(elementRef.current, type);
  }, [type]);

  return {
    ref: elementRef,
    startLoading,
  };
}

/**
 * Hook for hover animations
 */
export function useHoverAnimation(options: {
  scale?: number;
  elevation?: number;
  colorShift?: string;
} = {}) {
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const { createHoverAnimation } = require('../utils/animation-utils');
    const { onMouseEnter, onMouseLeave } = createHoverAnimation(elementRef.current, options);

    const element = elementRef.current;
    element.addEventListener('mouseenter', onMouseEnter);
    element.addEventListener('mouseleave', onMouseLeave);

    return () => {
      element.removeEventListener('mouseenter', onMouseEnter);
      element.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [options.scale, options.elevation, options.colorShift]);

  return {
    ref: elementRef,
  };
}

/**
 * Hook for focus animations
 */
export function useFocusAnimation() {
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const { createFocusAnimation } = require('../utils/animation-utils');
    const { onFocus, onBlur } = createFocusAnimation(elementRef.current);

    const element = elementRef.current;
    element.addEventListener('focus', onFocus);
    element.addEventListener('blur', onBlur);

    return () => {
      element.removeEventListener('focus', onFocus);
      element.removeEventListener('blur', onBlur);
    };
  }, []);

  return {
    ref: elementRef,
  };
}

/**
 * Combined animation hook for common use cases
 */
export function useAnimations(options: {
  hover?: { scale?: number; elevation?: number; colorShift?: string };
  focus?: boolean;
  loading?: 'spinner' | 'pulse' | 'shimmer';
  sharedElement?: { id: string; duration?: number; easing?: string };
} = {}) {
  const elementRef = useRef<HTMLElement>(null);
  
  // Setup hover animation
  const hoverRef = useHoverAnimation(options.hover);
  
  // Setup focus animation
  const focusRef = useFocusAnimation();
  
  // Setup loading animation
  const loadingRef = useLoadingAnimation(options.loading);
  
  // Setup shared element
  const sharedElementRef = options.sharedElement 
    ? useSharedElement({
        id: options.sharedElement.id,
        duration: options.sharedElement.duration,
        easing: options.sharedElement.easing,
      })
    : null;

  // Combine refs
  const combinedRef = useCallback((node: HTMLElement | null) => {
    elementRef.current = node;
    
    if (options.hover) {
      // @ts-ignore - TypeScript doesn't understand ref callback compatibility
      hoverRef.ref.current = node;
    }
    
    if (options.focus) {
      // @ts-ignore - TypeScript doesn't understand ref callback compatibility
      focusRef.ref.current = node;
    }
    
    if (options.loading) {
      // @ts-ignore - TypeScript doesn't understand ref callback compatibility
      loadingRef.ref.current = node;
    }
    
    if (sharedElementRef) {
      // @ts-ignore - TypeScript doesn't understand ref callback compatibility
      sharedElementRef.ref.current = node;
    }
  }, [options.hover, options.focus, options.loading, sharedElementRef]);

  return {
    ref: combinedRef,
    startLoading: loadingRef.startLoading,
    transitionTo: sharedElementRef?.transitionTo,
    transitionFrom: sharedElementRef?.transitionFrom,
  };
}