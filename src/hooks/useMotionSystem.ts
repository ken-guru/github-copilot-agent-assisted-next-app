/**
 * React Hook for Material 3 Expressive Motion System
 * 
 * This hook provides utilities for implementing Material 3 motion patterns
 * in React components with proper performance optimization and accessibility support.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  createTransition,
  SharedElementTransitions,
  PerformanceOptimizedAnimations,
  MicroInteractions,
  ReducedMotionAlternatives,
  AnimationFrameUtils,
  applyMotionStyles,
  createKeyframeAnimation,
  type TransitionConfig,
  type AnimationType
} from '../utils/material3-motion-system';

/**
 * Hook for managing motion preferences and reduced motion
 */
export function useMotionPreferences() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const getTransition = useCallback((
    normalTransition: string,
    reducedTransition?: string
  ) => {
    return ReducedMotionAlternatives.getTransition(normalTransition, reducedTransition);
  }, []);

  return {
    prefersReducedMotion,
    getTransition
  };
}

/**
 * Hook for creating and managing transitions
 */
export function useTransition(config: TransitionConfig = {}) {
  const { getTransition } = useMotionPreferences();
  
  const transition = createTransition(config);
  const accessibleTransition = getTransition(transition);

  return {
    transition: accessibleTransition,
    style: { transition: accessibleTransition }
  };
}

/**
 * Hook for managing shared element transitions
 */
export function useSharedElementTransition(
  transitionType: keyof typeof SharedElementTransitions = 'fade'
) {
  const [isEntering, setIsEntering] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const { prefersReducedMotion } = useMotionPreferences();

  const transitions = SharedElementTransitions[transitionType];

  const enter = useCallback(() => {
    setIsEntering(true);
    setIsExiting(false);
  }, []);

  const exit = useCallback(() => {
    setIsExiting(true);
    setIsEntering(false);
  }, []);

  const reset = useCallback(() => {
    setIsEntering(false);
    setIsExiting(false);
  }, []);

  const getStyles = useCallback(() => {
    if (prefersReducedMotion) {
      // Return simplified styles for reduced motion
      if (isEntering) return { opacity: 1 };
      if (isExiting) return { opacity: 0 };
      return {};
    }

    if (isEntering) {
      return { ...transitions.enter, ...transitions.enterActive };
    }
    if (isExiting) {
      return { ...transitions.exit, ...transitions.exitActive };
    }
    return transitions.enter;
  }, [isEntering, isExiting, prefersReducedMotion, transitions]);

  return {
    enter,
    exit,
    reset,
    styles: getStyles(),
    isEntering,
    isExiting
  };
}

/**
 * Hook for performance-optimized animations
 */
export function usePerformanceOptimizedAnimation(
  animationType: 'transform' | 'opacity' | 'transformOpacity' = 'transformOpacity'
) {
  const elementRef = useRef<HTMLElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const startAnimation = useCallback(() => {
    setIsAnimating(true);
    if (elementRef.current) {
      const optimizationStyles = PerformanceOptimizedAnimations[animationType];
      applyMotionStyles(elementRef.current, optimizationStyles);
    }
  }, [animationType]);

  const endAnimation = useCallback(() => {
    setIsAnimating(false);
    if (elementRef.current) {
      const cleanupStyles = PerformanceOptimizedAnimations.cleanup;
      applyMotionStyles(elementRef.current, cleanupStyles);
    }
  }, []);

  const optimizationStyles = PerformanceOptimizedAnimations[animationType];

  return {
    ref: elementRef,
    startAnimation,
    endAnimation,
    isAnimating,
    optimizationStyles
  };
}

/**
 * Hook for micro-interactions
 */
export function useMicroInteraction(
  interactionType: keyof typeof MicroInteractions
) {
  const [isActive, setIsActive] = useState(false);
  const { prefersReducedMotion } = useMotionPreferences();

  const activate = useCallback(() => {
    if (prefersReducedMotion) return;
    setIsActive(true);
  }, [prefersReducedMotion]);

  const deactivate = useCallback(() => {
    setIsActive(false);
  }, []);

  const styles = isActive ? MicroInteractions[interactionType] : {};

  return {
    activate,
    deactivate,
    isActive,
    styles,
    handlers: {
      onMouseDown: activate,
      onMouseUp: deactivate,
      onMouseLeave: deactivate,
      onTouchStart: activate,
      onTouchEnd: deactivate
    }
  };
}

/**
 * Hook for managing keyframe animations
 */
export function useKeyframeAnimation() {
  const [activeAnimations, setActiveAnimations] = useState<Set<string>>(new Set());
  const { prefersReducedMotion } = useMotionPreferences();

  const createAnimation = useCallback((
    name: string,
    keyframes: Record<string, Record<string, any>>,
    options: Parameters<typeof createKeyframeAnimation>[2] = {}
  ) => {
    if (prefersReducedMotion) {
      // Return a simplified animation or none for reduced motion
      return 'none';
    }

    const animation = createKeyframeAnimation(name, keyframes, options);
    setActiveAnimations(prev => new Set(prev).add(name));
    return animation;
  }, [prefersReducedMotion]);

  const removeAnimation = useCallback((name: string) => {
    setActiveAnimations(prev => {
      const newSet = new Set(prev);
      newSet.delete(name);
      return newSet;
    });

    // Remove the style element if it exists
    if (typeof document !== 'undefined') {
      const styleElement = document.getElementById(`keyframes-${name}`);
      if (styleElement) {
        styleElement.remove();
      }
    }
  }, []);

  const clearAllAnimations = useCallback(() => {
    activeAnimations.forEach(name => {
      if (typeof document !== 'undefined') {
        const styleElement = document.getElementById(`keyframes-${name}`);
        if (styleElement) {
          styleElement.remove();
        }
      }
    });
    setActiveAnimations(new Set());
  }, [activeAnimations]);

  return {
    createAnimation,
    removeAnimation,
    clearAllAnimations,
    activeAnimations: Array.from(activeAnimations)
  };
}

/**
 * Hook for throttled animation frame callbacks
 */
export function useAnimationFrame(callback: () => void, deps: React.DependencyList = []) {
  const callbackRef = useRef(callback);
  const frameRef = useRef<number | null>(null);

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const throttledCallback = useCallback(
    AnimationFrameUtils.throttleToFrame(() => {
      callbackRef.current();
    }),
    []
  );

  const start = useCallback(() => {
    if (frameRef.current !== null) return;
    
    frameRef.current = 1; // Set a mock frame ID for testing
    
    const animate = () => {
      throttledCallback();
      if (frameRef.current !== null) {
        frameRef.current = AnimationFrameUtils.requestFrame(animate);
      }
    };
    
    AnimationFrameUtils.requestFrame(animate);
  }, [throttledCallback]);

  const stop = useCallback(() => {
    if (frameRef.current !== null) {
      AnimationFrameUtils.cancelFrame(frameRef.current);
      frameRef.current = null;
    }
  }, []);

  // Cleanup on unmount or dependency change
  useEffect(() => {
    return () => {
      if (frameRef.current !== null) {
        AnimationFrameUtils.cancelFrame(frameRef.current);
      }
    };
  }, deps);

  return { start, stop, isRunning: frameRef.current !== null };
}

/**
 * Hook for measuring animation performance
 */
export function useAnimationPerformance() {
  const [measurements, setMeasurements] = useState<Record<string, number>>({});

  const measureAnimation = useCallback((
    name: string,
    animationCallback: () => void | Promise<void>
  ) => {
    const startTime = performance.now();
    
    const finish = () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      setMeasurements(prev => ({
        ...prev,
        [name]: duration
      }));
      
      if (process.env.NODE_ENV === 'development') {
        console.debug(`Animation "${name}" took ${duration.toFixed(2)}ms`);
      }
    };

    const result = animationCallback();
    
    if (result instanceof Promise) {
      result.then(finish).catch(finish);
    } else {
      finish();
    }
  }, []);

  const clearMeasurements = useCallback(() => {
    setMeasurements({});
  }, []);

  const getAverageTime = useCallback((animationName: string) => {
    const times = Object.entries(measurements)
      .filter(([name]) => name.startsWith(animationName))
      .map(([, time]) => time);
    
    if (times.length === 0) return 0;
    return times.reduce((sum, time) => sum + time, 0) / times.length;
  }, [measurements]);

  return {
    measureAnimation,
    measurements,
    clearMeasurements,
    getAverageTime
  };
}

/**
 * Hook for creating ripple effects
 */
export function useRippleEffect() {
  const containerRef = useRef<HTMLElement>(null);
  const { prefersReducedMotion } = useMotionPreferences();

  const createRipple = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current || prefersReducedMotion) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    
    // Get click position
    const clientX = 'clientX' in event ? event.clientX : event.touches[0].clientX;
    const clientY = 'clientY' in event ? event.clientY : event.touches[0].clientY;
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    // Create ripple element
    const ripple = document.createElement('span');
    ripple.className = 'md-ripple-effect';
    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: currentColor;
      opacity: 0.1;
      pointer-events: none;
      transform: scale(0);
      left: ${x}px;
      top: ${y}px;
      width: 0;
      height: 0;
      animation: md-ripple var(--md-sys-motion-duration-medium2) var(--md-sys-motion-easing-standard) forwards;
    `;

    container.appendChild(ripple);

    // Remove ripple after animation
    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
    }, 300);
  }, [prefersReducedMotion]);

  const rippleHandlers = {
    onMouseDown: createRipple,
    onTouchStart: createRipple
  };

  return {
    ref: containerRef,
    createRipple,
    rippleHandlers
  };
}

/**
 * Combined hook for common motion patterns
 */
export function useMotionSystem() {
  const motionPreferences = useMotionPreferences();
  const performanceAnimation = usePerformanceOptimizedAnimation();
  const keyframeAnimation = useKeyframeAnimation();
  const animationPerformance = useAnimationPerformance();
  const rippleEffect = useRippleEffect();

  return {
    ...motionPreferences,
    ...performanceAnimation,
    ...keyframeAnimation,
    ...animationPerformance,
    ...rippleEffect,
    createTransition,
    useTransition,
    useSharedElementTransition,
    useMicroInteraction,
    useAnimationFrame
  };
}