/**
 * Material 3 Expressive Motion System
 * 
 * This module provides utilities for implementing Material 3 Expressive motion patterns
 * including easing curves, duration scales, transition utilities, shared element transitions,
 * and performance-optimized animation patterns.
 */

import { Material3CSSProperties } from '../types/material3-tokens';

/**
 * Material 3 Expressive easing curve definitions
 * Following Material 3 motion principles for natural, purposeful animations
 */
export const Material3Easing = {
  // Standard easing for most transitions
  standard: 'cubic-bezier(0.2, 0.0, 0, 1.0)',
  
  // Emphasized easing for important transitions
  emphasized: 'cubic-bezier(0.2, 0.0, 0, 1.0)',
  
  // Emphasized decelerate for incoming elements
  emphasizedDecelerate: 'cubic-bezier(0.05, 0.7, 0.1, 1.0)',
  
  // Emphasized accelerate for outgoing elements
  emphasizedAccelerate: 'cubic-bezier(0.3, 0.0, 0.8, 0.15)',
  
  // Legacy easing for compatibility
  legacy: 'cubic-bezier(0.4, 0.0, 0.2, 1.0)',
  
  // Linear easing for specific use cases
  linear: 'cubic-bezier(0.0, 0.0, 1.0, 1.0)',
} as const;

/**
 * Material 3 Expressive duration scales
 * Organized by interaction type and complexity
 */
export const Material3Duration = {
  // Short durations for simple state changes
  short1: 50,   // Immediate feedback
  short2: 100,  // Simple hover states
  short3: 150,  // Focus indicators
  short4: 200,  // Button press feedback
  
  // Medium durations for component transitions
  medium1: 250, // Card hover elevation
  medium2: 300, // Form field focus
  medium3: 350, // Menu open/close
  medium4: 400, // Modal backdrop
  
  // Long durations for complex animations
  long1: 450,   // Page transitions
  long2: 500,   // Shared element transitions
  long3: 550,   // Complex layout changes
  long4: 600,   // Full screen transitions
  
  // Extra long durations for elaborate animations
  extraLong1: 700,  // Loading sequences
  extraLong2: 800,  // Onboarding flows
  extraLong3: 900,  // Complex data visualizations
  extraLong4: 1000, // Celebration animations
} as const;

/**
 * Animation type categories for contextual duration selection
 */
export type AnimationType = 
  | 'micro'           // Immediate feedback (50-100ms)
  | 'simple'          // Basic state changes (100-200ms)
  | 'complex'         // Component transitions (200-400ms)
  | 'elaborate'       // Page/view transitions (400-600ms)
  | 'expressive';     // Celebration/onboarding (600ms+)

/**
 * Get appropriate duration for animation type
 */
export function getDurationForAnimationType(type: AnimationType): number {
  switch (type) {
    case 'micro':
      return Material3Duration.short1;
    case 'simple':
      return Material3Duration.short3;
    case 'complex':
      return Material3Duration.medium2;
    case 'elaborate':
      return Material3Duration.long2;
    case 'expressive':
      return Material3Duration.extraLong1;
    default:
      return Material3Duration.medium2;
  }
}

/**
 * Transition utility configuration
 */
export interface TransitionConfig {
  property?: string | string[];
  duration?: number | keyof typeof Material3Duration;
  easing?: keyof typeof Material3Easing;
  delay?: number;
}

/**
 * Create CSS transition string from configuration
 */
export function createTransition(config: TransitionConfig): string {
  const {
    property = 'all',
    duration = 'medium2',
    easing = 'standard',
    delay = 0
  } = config;

  const durationValue = typeof duration === 'number' 
    ? duration 
    : Material3Duration[duration];
  
  const easingValue = Material3Easing[easing];
  
  const properties = Array.isArray(property) ? property : [property];
  
  return properties
    .map(prop => `${prop} ${durationValue}ms ${easingValue} ${delay}ms`)
    .join(', ');
}

/**
 * Shared element transition patterns
 */
export const SharedElementTransitions = {
  /**
   * Fade transition for content changes
   */
  fade: {
    enter: {
      opacity: 0,
      transition: createTransition({
        property: 'opacity',
        duration: 'medium2',
        easing: 'emphasizedDecelerate'
      })
    },
    enterActive: {
      opacity: 1
    },
    exit: {
      opacity: 1,
      transition: createTransition({
        property: 'opacity',
        duration: 'medium1',
        easing: 'emphasizedAccelerate'
      })
    },
    exitActive: {
      opacity: 0
    }
  },

  /**
   * Scale transition for modal/dialog appearances
   */
  scale: {
    enter: {
      opacity: 0,
      transform: 'scale(0.8)',
      transition: createTransition({
        property: ['opacity', 'transform'],
        duration: 'medium3',
        easing: 'emphasizedDecelerate'
      })
    },
    enterActive: {
      opacity: 1,
      transform: 'scale(1)'
    },
    exit: {
      opacity: 1,
      transform: 'scale(1)',
      transition: createTransition({
        property: ['opacity', 'transform'],
        duration: 'medium2',
        easing: 'emphasizedAccelerate'
      })
    },
    exitActive: {
      opacity: 0,
      transform: 'scale(0.9)'
    }
  },

  /**
   * Slide transition for navigation
   */
  slide: {
    enter: {
      opacity: 0,
      transform: 'translateX(24px)',
      transition: createTransition({
        property: ['opacity', 'transform'],
        duration: 'long1',
        easing: 'emphasizedDecelerate'
      })
    },
    enterActive: {
      opacity: 1,
      transform: 'translateX(0)'
    },
    exit: {
      opacity: 1,
      transform: 'translateX(0)',
      transition: createTransition({
        property: ['opacity', 'transform'],
        duration: 'medium4',
        easing: 'emphasizedAccelerate'
      })
    },
    exitActive: {
      opacity: 0,
      transform: 'translateX(-24px)'
    }
  },

  /**
   * Elevation transition for card interactions
   */
  elevation: {
    enter: {
      boxShadow: 'var(--md-sys-elevation-level0)',
      transition: createTransition({
        property: 'box-shadow',
        duration: 'short4',
        easing: 'standard'
      })
    },
    enterActive: {
      boxShadow: 'var(--md-sys-elevation-level2)'
    },
    exit: {
      boxShadow: 'var(--md-sys-elevation-level2)',
      transition: createTransition({
        property: 'box-shadow',
        duration: 'short3',
        easing: 'standard'
      })
    },
    exitActive: {
      boxShadow: 'var(--md-sys-elevation-level0)'
    }
  }
} as const;

/**
 * Performance-optimized animation patterns
 */
export const PerformanceOptimizedAnimations = {
  /**
   * GPU-accelerated transform animations
   */
  transform: {
    willChange: 'transform',
    backfaceVisibility: 'hidden' as const,
    perspective: 1000
  },

  /**
   * Opacity animations for fade effects
   */
  opacity: {
    willChange: 'opacity'
  },

  /**
   * Combined transform and opacity for complex animations
   */
  transformOpacity: {
    willChange: 'transform, opacity',
    backfaceVisibility: 'hidden' as const,
    perspective: 1000
  },

  /**
   * Cleanup styles to remove will-change after animation
   */
  cleanup: {
    willChange: 'auto',
    backfaceVisibility: 'visible' as const,
    perspective: 'none'
  }
} as const;

/**
 * Micro-interaction patterns for common UI elements
 */
export const MicroInteractions = {
  /**
   * Button press feedback
   */
  buttonPress: {
    transform: 'scale(0.98)',
    transition: createTransition({
      property: 'transform',
      duration: 'short1',
      easing: 'standard'
    })
  },

  /**
   * Card hover elevation
   */
  cardHover: {
    transform: 'translateY(-2px)',
    boxShadow: 'var(--md-sys-elevation-level3)',
    transition: createTransition({
      property: ['transform', 'box-shadow'],
      duration: 'short4',
      easing: 'standard'
    })
  },

  /**
   * Focus ring animation
   */
  focusRing: {
    outline: '2px solid var(--md-sys-color-primary)',
    outlineOffset: '2px',
    transition: createTransition({
      property: ['outline', 'outline-offset'],
      duration: 'short2',
      easing: 'standard'
    })
  },

  /**
   * Loading pulse animation
   */
  loadingPulse: {
    animation: `pulse ${Material3Duration.medium4}ms ${Material3Easing.standard} infinite alternate`
  },

  /**
   * Ripple effect for touch feedback
   */
  ripple: {
    position: 'relative' as const,
    overflow: 'hidden' as const,
    '&::before': {
      content: '""',
      position: 'absolute' as const,
      top: '50%',
      left: '50%',
      width: 0,
      height: 0,
      borderRadius: '50%',
      background: 'var(--md-sys-color-on-surface)',
      opacity: 0.1,
      transform: 'translate(-50%, -50%)',
      transition: createTransition({
        property: ['width', 'height'],
        duration: 'medium2',
        easing: 'standard'
      })
    },
    '&:active::before': {
      width: '200px',
      height: '200px'
    }
  }
} as const;

/**
 * Reduced motion alternatives for accessibility
 */
export const ReducedMotionAlternatives = {
  /**
   * Check if user prefers reduced motion
   */
  prefersReducedMotion: (): boolean => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  /**
   * Get appropriate transition based on motion preference
   */
  getTransition: (normalTransition: string, reducedTransition?: string): string => {
    if (ReducedMotionAlternatives.prefersReducedMotion()) {
      return reducedTransition || 'none';
    }
    return normalTransition;
  },

  /**
   * Reduced motion variants of common transitions
   */
  variants: {
    fade: {
      normal: createTransition({
        property: 'opacity',
        duration: 'medium2',
        easing: 'standard'
      }),
      reduced: createTransition({
        property: 'opacity',
        duration: 'short1',
        easing: 'linear'
      })
    },
    scale: {
      normal: createTransition({
        property: ['opacity', 'transform'],
        duration: 'medium3',
        easing: 'emphasizedDecelerate'
      }),
      reduced: createTransition({
        property: 'opacity',
        duration: 'short2',
        easing: 'linear'
      })
    },
    slide: {
      normal: createTransition({
        property: ['opacity', 'transform'],
        duration: 'long1',
        easing: 'emphasizedDecelerate'
      }),
      reduced: createTransition({
        property: 'opacity',
        duration: 'short3',
        easing: 'linear'
      })
    }
  }
} as const;

/**
 * Animation frame utilities for performance monitoring
 */
export const AnimationFrameUtils = {
  /**
   * Request animation frame with fallback
   */
  requestFrame: (callback: FrameRequestCallback): number => {
    if (typeof window === 'undefined') return 0;
    return window.requestAnimationFrame(callback);
  },

  /**
   * Cancel animation frame
   */
  cancelFrame: (id: number): void => {
    if (typeof window === 'undefined') return;
    window.cancelAnimationFrame(id);
  },

  /**
   * Measure animation performance
   */
  measurePerformance: (animationName: string, callback: () => void): void => {
    if (typeof window === 'undefined' || !window.performance) {
      callback();
      return;
    }

    const startTime = window.performance.now();
    callback();
    const endTime = window.performance.now();
    
    console.debug(`Animation "${animationName}" took ${endTime - startTime} milliseconds`);
  },

  /**
   * Throttle animation updates to 60fps
   */
  throttleToFrame: (callback: () => void): (() => void) => {
    let frameId: number | null = null;
    
    return () => {
      if (frameId !== null) return;
      
      frameId = AnimationFrameUtils.requestFrame(() => {
        callback();
        frameId = null;
      });
    };
  }
} as const;

/**
 * CSS-in-JS helper for applying motion styles
 */
export function applyMotionStyles(element: HTMLElement, styles: Record<string, any>): void {
  Object.entries(styles).forEach(([property, value]) => {
    if (property.startsWith('--')) {
      // CSS custom property
      element.style.setProperty(property, value);
    } else {
      // Regular CSS property
      (element.style as any)[property] = value;
    }
  });
}

/**
 * Create keyframe animation
 */
export function createKeyframeAnimation(
  name: string,
  keyframes: Record<string, Record<string, any>>,
  options: {
    duration?: number;
    easing?: keyof typeof Material3Easing;
    iterations?: number | 'infinite';
    direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
    fillMode?: 'none' | 'forwards' | 'backwards' | 'both';
  } = {}
): string {
  const {
    duration = Material3Duration.medium2,
    easing = 'standard',
    iterations = 1,
    direction = 'normal',
    fillMode = 'both'
  } = options;

  // Generate keyframe CSS
  const keyframeCSS = Object.entries(keyframes)
    .map(([percentage, styles]) => {
      const styleString = Object.entries(styles)
        .map(([prop, value]) => `${prop}: ${value}`)
        .join('; ');
      return `${percentage} { ${styleString} }`;
    })
    .join(' ');

  // Inject keyframes into document if not already present
  if (typeof document !== 'undefined') {
    const styleId = `keyframes-${name}`;
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `@keyframes ${name} { ${keyframeCSS} }`;
      document.head.appendChild(style);
    }
  }

  return `${name} ${duration}ms ${Material3Easing[easing]} ${iterations} ${direction} ${fillMode}`;
}

/**
 * Utility to create CSS custom properties for motion tokens
 */
export function getMotionCSSProperties(): Record<string, string> {
  return {
    // Easing curves
    [Material3CSSProperties.motion.easing.standard]: Material3Easing.standard,
    [Material3CSSProperties.motion.easing.emphasized]: Material3Easing.emphasized,
    [Material3CSSProperties.motion.easing.emphasizedDecelerate]: Material3Easing.emphasizedDecelerate,
    [Material3CSSProperties.motion.easing.emphasizedAccelerate]: Material3Easing.emphasizedAccelerate,
    [Material3CSSProperties.motion.easing.legacy]: Material3Easing.legacy,
    [Material3CSSProperties.motion.easing.linear]: Material3Easing.linear,

    // Duration scales
    [Material3CSSProperties.motion.duration.short1]: `${Material3Duration.short1}ms`,
    [Material3CSSProperties.motion.duration.short2]: `${Material3Duration.short2}ms`,
    [Material3CSSProperties.motion.duration.short3]: `${Material3Duration.short3}ms`,
    [Material3CSSProperties.motion.duration.short4]: `${Material3Duration.short4}ms`,
    [Material3CSSProperties.motion.duration.medium1]: `${Material3Duration.medium1}ms`,
    [Material3CSSProperties.motion.duration.medium2]: `${Material3Duration.medium2}ms`,
    [Material3CSSProperties.motion.duration.medium3]: `${Material3Duration.medium3}ms`,
    [Material3CSSProperties.motion.duration.medium4]: `${Material3Duration.medium4}ms`,
    [Material3CSSProperties.motion.duration.long1]: `${Material3Duration.long1}ms`,
    [Material3CSSProperties.motion.duration.long2]: `${Material3Duration.long2}ms`,
    [Material3CSSProperties.motion.duration.long3]: `${Material3Duration.long3}ms`,
    [Material3CSSProperties.motion.duration.long4]: `${Material3Duration.long4}ms`,
    [Material3CSSProperties.motion.duration.extraLong1]: `${Material3Duration.extraLong1}ms`,
    [Material3CSSProperties.motion.duration.extraLong2]: `${Material3Duration.extraLong2}ms`,
    [Material3CSSProperties.motion.duration.extraLong3]: `${Material3Duration.extraLong3}ms`,
    [Material3CSSProperties.motion.duration.extraLong4]: `${Material3Duration.extraLong4}ms`,
  };
}