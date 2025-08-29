/**
 * React hook for Material 3 Expressive animations and micro-interactions
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  createSharedElementTransition,
  createLoadingAnimation,
  createMicroInteraction,
  createPageTransition,
  createOptimizedAnimation,
  AnimationPerformanceManager,
  SharedElementTransition,
  LoadingAnimationConfig,
  MicroInteractionConfig,
  MATERIAL3_DURATION,
  MATERIAL3_EASING,
} from '../utils/material3-animations';

export interface UseAnimationsOptions {
  respectReducedMotion?: boolean;
  performanceOptimization?: boolean;
}

export interface AnimationControls {
  // Shared element transitions
  createSharedTransition: (config: SharedElementTransition) => Animation | null;
  
  // Loading animations
  startLoadingAnimation: (element: HTMLElement, config: LoadingAnimationConfig) => Animation | null;
  stopLoadingAnimation: (animation: Animation | null) => void;
  
  // Micro-interactions
  triggerMicroInteraction: (element: HTMLElement, config: MicroInteractionConfig) => Animation | null;
  
  // Page transitions
  transitionToPage: (exitElement: HTMLElement, enterElement: HTMLElement, direction?: 'forward' | 'backward') => Promise<void>;
  
  // Hover and focus animations
  createHoverAnimation: (element: HTMLElement) => Animation | null;
  createFocusAnimation: (element: HTMLElement) => Animation | null;
  
  // Performance utilities
  isReducedMotion: boolean;
  activeAnimationCount: number;
  pauseAllAnimations: () => void;
  resumeAllAnimations: () => void;
}

export function useAnimations(options: UseAnimationsOptions = {}): AnimationControls {
  const { respectReducedMotion = true, performanceOptimization = true } = options;
  const performanceManager = useRef(AnimationPerformanceManager.getInstance());
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [activeAnimationCount, setActiveAnimationCount] = useState(0);

  useEffect(() => {
    const manager = performanceManager.current;
    setIsReducedMotion(manager.isReducedMotionPreferred());

    // Update animation count periodically
    const interval = setInterval(() => {
      setActiveAnimationCount(manager.getActiveAnimationCount());
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const createSharedTransition = useCallback((config: SharedElementTransition) => {
    if (respectReducedMotion && isReducedMotion) {
      return null;
    }
    return createSharedElementTransition(config);
  }, [respectReducedMotion, isReducedMotion]);

  const startLoadingAnimation = useCallback((element: HTMLElement, config: LoadingAnimationConfig) => {
    if (respectReducedMotion && isReducedMotion) {
      return null;
    }
    return createLoadingAnimation(element, config);
  }, [respectReducedMotion, isReducedMotion]);

  const stopLoadingAnimation = useCallback((animation: Animation | null) => {
    if (animation) {
      animation.cancel();
    }
  }, []);

  const triggerMicroInteraction = useCallback((element: HTMLElement, config: MicroInteractionConfig) => {
    if (respectReducedMotion && isReducedMotion) {
      return null;
    }
    return createMicroInteraction(element, config);
  }, [respectReducedMotion, isReducedMotion]);

  const transitionToPage = useCallback(async (
    exitElement: HTMLElement,
    enterElement: HTMLElement,
    direction: 'forward' | 'backward' = 'forward'
  ) => {
    if (respectReducedMotion && isReducedMotion) {
      // Instant transition for reduced motion
      exitElement.style.display = 'none';
      enterElement.style.display = 'block';
      return;
    }
    return createPageTransition(exitElement, enterElement, direction);
  }, [respectReducedMotion, isReducedMotion]);

  const createHoverAnimation = useCallback((element: HTMLElement) => {
    if (respectReducedMotion && isReducedMotion) {
      return null;
    }

    return createOptimizedAnimation(element, [
      { 
        transform: 'scale(1)',
        boxShadow: 'var(--md-sys-elevation-level1)',
      },
      { 
        transform: 'scale(1.02)',
        boxShadow: 'var(--md-sys-elevation-level2)',
      },
    ], {
      duration: parseInt(MATERIAL3_DURATION.short3),
      easing: MATERIAL3_EASING.emphasized,
      fill: 'forwards',
    });
  }, [respectReducedMotion, isReducedMotion]);

  const createFocusAnimation = useCallback((element: HTMLElement) => {
    if (respectReducedMotion && isReducedMotion) {
      return null;
    }

    return createOptimizedAnimation(element, [
      { 
        outline: '0px solid var(--md-sys-color-primary)',
        outlineOffset: '0px',
      },
      { 
        outline: '2px solid var(--md-sys-color-primary)',
        outlineOffset: '2px',
      },
    ], {
      duration: parseInt(MATERIAL3_DURATION.short4),
      easing: MATERIAL3_EASING.emphasized,
      fill: 'forwards',
    });
  }, [respectReducedMotion, isReducedMotion]);

  const pauseAllAnimations = useCallback(() => {
    performanceManager.current.pauseAllAnimations();
  }, []);

  const resumeAllAnimations = useCallback(() => {
    performanceManager.current.resumeAllAnimations();
  }, []);

  return {
    createSharedTransition,
    startLoadingAnimation,
    stopLoadingAnimation,
    triggerMicroInteraction,
    transitionToPage,
    createHoverAnimation,
    createFocusAnimation,
    isReducedMotion,
    activeAnimationCount,
    pauseAllAnimations,
    resumeAllAnimations,
  };
}

/**
 * Hook for managing hover animations
 */
export function useHoverAnimation(elementRef: React.RefObject<HTMLElement>) {
  const { createHoverAnimation, isReducedMotion } = useAnimations();
  const hoverAnimationRef = useRef<Animation | null>(null);

  const handleMouseEnter = useCallback(() => {
    if (elementRef.current && !isReducedMotion) {
      hoverAnimationRef.current = createHoverAnimation(elementRef.current);
    }
  }, [elementRef, createHoverAnimation, isReducedMotion]);

  const handleMouseLeave = useCallback(() => {
    if (hoverAnimationRef.current) {
      hoverAnimationRef.current.reverse();
    }
  }, []);

  return { handleMouseEnter, handleMouseLeave };
}

/**
 * Hook for managing focus animations
 */
export function useFocusAnimation(elementRef: React.RefObject<HTMLElement>) {
  const { createFocusAnimation, isReducedMotion } = useAnimations();
  const focusAnimationRef = useRef<Animation | null>(null);

  const handleFocus = useCallback(() => {
    if (elementRef.current && !isReducedMotion) {
      focusAnimationRef.current = createFocusAnimation(elementRef.current);
    }
  }, [elementRef, createFocusAnimation, isReducedMotion]);

  const handleBlur = useCallback(() => {
    if (focusAnimationRef.current) {
      focusAnimationRef.current.reverse();
    }
  }, []);

  return { handleFocus, handleBlur };
}

/**
 * Hook for managing loading animations
 */
export function useLoadingAnimation(config: LoadingAnimationConfig) {
  const { startLoadingAnimation, stopLoadingAnimation } = useAnimations();
  const [isLoading, setIsLoading] = useState(false);
  const animationRef = useRef<Animation | null>(null);
  const elementRef = useRef<HTMLElement | null>(null);

  const startLoading = useCallback((element?: HTMLElement) => {
    const targetElement = element || elementRef.current;
    if (targetElement) {
      elementRef.current = targetElement;
      animationRef.current = startLoadingAnimation(targetElement, config);
      setIsLoading(true);
    }
  }, [startLoadingAnimation, config]);

  const stopLoading = useCallback(() => {
    if (animationRef.current) {
      stopLoadingAnimation(animationRef.current);
      animationRef.current = null;
      setIsLoading(false);
    }
  }, [stopLoadingAnimation]);

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        stopLoadingAnimation(animationRef.current);
      }
    };
  }, [stopLoadingAnimation]);

  return { startLoading, stopLoading, isLoading, elementRef };
}

/**
 * Hook for managing micro-interactions
 */
export function useMicroInteractions() {
  const { triggerMicroInteraction } = useAnimations();

  const triggerValidationError = useCallback((element: HTMLElement) => {
    return triggerMicroInteraction(element, {
      trigger: 'validation',
      animation: 'shake',
      intensity: 'moderate',
    });
  }, [triggerMicroInteraction]);

  const triggerSuccess = useCallback((element: HTMLElement) => {
    return triggerMicroInteraction(element, {
      trigger: 'success',
      animation: 'bounce',
      intensity: 'subtle',
    });
  }, [triggerMicroInteraction]);

  const triggerClick = useCallback((element: HTMLElement) => {
    return triggerMicroInteraction(element, {
      trigger: 'click',
      animation: 'ripple',
      intensity: 'moderate',
    });
  }, [triggerMicroInteraction]);

  const triggerHover = useCallback((element: HTMLElement) => {
    return triggerMicroInteraction(element, {
      trigger: 'hover',
      animation: 'scale',
      intensity: 'subtle',
    });
  }, [triggerMicroInteraction]);

  return {
    triggerValidationError,
    triggerSuccess,
    triggerClick,
    triggerHover,
  };
}