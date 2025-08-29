/**
 * Material 3 Expressive Animation Utilities
 * Provides shared element transitions, micro-interactions, and performance-optimized animations
 */

import { CSSProperties, RefObject } from 'react';

// Animation performance monitoring
let animationFrameId: number | null = null;
let performanceObserver: PerformanceObserver | null = null;

/**
 * Shared Element Transition Configuration
 */
export interface SharedElementConfig {
  id: string;
  element: HTMLElement;
  fromRect: DOMRect;
  toRect: DOMRect;
  duration?: number;
  easing?: string;
  onComplete?: () => void;
}

/**
 * Animation State Management
 */
interface AnimationState {
  isAnimating: boolean;
  currentAnimations: Map<string, Animation>;
  sharedElements: Map<string, HTMLElement>;
}

const animationState: AnimationState = {
  isAnimating: false,
  currentAnimations: new Map(),
  sharedElements: new Map(),
};

/**
 * Material 3 Easing Curves
 */
export const MATERIAL3_EASING = {
  // Material 3 standard easing curves
  standard: 'cubic-bezier(0.2, 0.0, 0, 1.0)',
  accelerate: 'cubic-bezier(0.3, 0.0, 0.8, 0.15)',
  decelerate: 'cubic-bezier(0.05, 0.7, 0.1, 1.0)',
  emphasized: 'cubic-bezier(0.3, 0.0, 0.0, 1.0)',
  // Expressive easing for organic feel
  expressiveEntrance: 'cubic-bezier(0.05, 0.0, 0.0, 1.0)',
  expressiveExit: 'cubic-bezier(0.3, 0.0, 1.0, 1.0)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
} as const;

/**
 * Animation Duration Scales (ms)
 */
export const ANIMATION_DURATION = {
  // Material 3 duration tokens
  short1: 50,
  short2: 100,
  short3: 150,
  short4: 200,
  medium1: 250,
  medium2: 300,
  medium3: 350,
  medium4: 400,
  long1: 450,
  long2: 500,
  long3: 550,
  long4: 600,
  // Extended durations for expressive animations
  extraLong1: 700,
  extraLong2: 800,
  extraLong3: 900,
  extraLong4: 1000,
} as const;

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get animation duration with reduced motion support
 */
export function getAnimationDuration(duration: keyof typeof ANIMATION_DURATION): number {
  if (prefersReducedMotion()) {
    return 0; // Instant animations for reduced motion
  }
  return ANIMATION_DURATION[duration];
}

/**
 * Create shared element transition between two elements
 */
export function createSharedElementTransition(config: SharedElementConfig): Promise<void> {
  return new Promise((resolve) => {
    const { id, element, fromRect, toRect, duration = ANIMATION_DURATION.medium2, easing = MATERIAL3_EASING.emphasized, onComplete } = config;

    // Skip animation if reduced motion is preferred
    if (prefersReducedMotion()) {
      onComplete?.();
      resolve();
      return;
    }

    // Calculate transform values
    const deltaX = fromRect.left - toRect.left;
    const deltaY = fromRect.top - toRect.top;
    const deltaWidth = fromRect.width / toRect.width;
    const deltaHeight = fromRect.height / toRect.height;

    // Create FLIP animation
    const animation = element.animate([
      {
        transform: `translate(${deltaX}px, ${deltaY}px) scale(${deltaWidth}, ${deltaHeight})`,
        opacity: 0.8,
      },
      {
        transform: 'translate(0, 0) scale(1, 1)',
        opacity: 1,
      }
    ], {
      duration,
      easing,
      fill: 'both',
    });

    // Store animation reference
    animationState.currentAnimations.set(id, animation);

    animation.addEventListener('finish', () => {
      animationState.currentAnimations.delete(id);
      onComplete?.();
      resolve();
    });

    animation.addEventListener('cancel', () => {
      animationState.currentAnimations.delete(id);
      resolve();
    });
  });
}

/**
 * Register element for shared element transitions
 */
export function registerSharedElement(id: string, element: HTMLElement): void {
  animationState.sharedElements.set(id, element);
}

/**
 * Unregister shared element
 */
export function unregisterSharedElement(id: string): void {
  animationState.sharedElements.delete(id);
}

/**
 * Get shared element by ID
 */
export function getSharedElement(id: string): HTMLElement | undefined {
  return animationState.sharedElements.get(id);
}

/**
 * Create loading animation for buttons and async operations
 */
export function createLoadingAnimation(element: HTMLElement, type: 'spinner' | 'pulse' | 'shimmer' = 'spinner'): () => void {
  if (prefersReducedMotion()) {
    // Just add loading class for reduced motion
    element.classList.add('loading');
    return () => element.classList.remove('loading');
  }

  let animation: Animation;

  switch (type) {
    case 'spinner':
      // Create spinner element if it doesn't exist
      let spinner = element.querySelector('.loading-spinner') as HTMLElement;
      if (!spinner) {
        spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        spinner.style.cssText = `
          width: 16px;
          height: 16px;
          border: 2px solid var(--m3-surface-variant);
          border-top: 2px solid var(--m3-primary);
          border-radius: 50%;
          margin-right: 8px;
        `;
        element.prepend(spinner);
      }

      animation = spinner.animate([
        { transform: 'rotate(0deg)' },
        { transform: 'rotate(360deg)' }
      ], {
        duration: ANIMATION_DURATION.long2,
        iterations: Infinity,
        easing: 'linear'
      });
      break;

    case 'pulse':
      animation = element.animate([
        { opacity: 1, transform: 'scale(1)' },
        { opacity: 0.7, transform: 'scale(0.98)' },
        { opacity: 1, transform: 'scale(1)' }
      ], {
        duration: ANIMATION_DURATION.long1,
        iterations: Infinity,
        easing: MATERIAL3_EASING.standard
      });
      break;

    case 'shimmer':
      // Add shimmer gradient
      element.style.background = `
        linear-gradient(90deg, 
          var(--m3-surface) 0%, 
          var(--m3-surface-variant) 50%, 
          var(--m3-surface) 100%)
      `;
      element.style.backgroundSize = '200% 100%';

      animation = element.animate([
        { backgroundPosition: '-200% 0' },
        { backgroundPosition: '200% 0' }
      ], {
        duration: ANIMATION_DURATION.extraLong2,
        iterations: Infinity,
        easing: 'linear'
      });
      break;
  }

  // Store animation reference
  const animationId = `loading-${Math.random().toString(36).substr(2, 9)}`;
  animationState.currentAnimations.set(animationId, animation);

  // Return cleanup function
  return () => {
    animation.cancel();
    animationState.currentAnimations.delete(animationId);
    
    // Clean up spinner element
    if (type === 'spinner') {
      const spinner = element.querySelector('.loading-spinner');
      spinner?.remove();
    }

    // Reset shimmer styles
    if (type === 'shimmer') {
      element.style.background = '';
      element.style.backgroundSize = '';
    }

    element.classList.remove('loading');
  };
}

/**
 * Create hover animation with scale and elevation
 */
export function createHoverAnimation(element: HTMLElement, options: {
  scale?: number;
  elevation?: number;
  colorShift?: string;
} = {}): { onMouseEnter: () => void; onMouseLeave: () => void } {
  const { scale = 1.02, elevation = 2, colorShift } = options;

  if (prefersReducedMotion()) {
    return {
      onMouseEnter: () => element.classList.add('hover-state'),
      onMouseLeave: () => element.classList.remove('hover-state')
    };
  }

  let hoverAnimation: Animation | null = null;

  const onMouseEnter = () => {
    // Cancel any existing animation
    hoverAnimation?.cancel();

    const keyframes: Keyframe[] = [
      { 
        transform: 'scale(1)', 
        boxShadow: 'var(--m3-elevation-1)',
        ...(colorShift && { backgroundColor: colorShift })
      },
      { 
        transform: `scale(${scale})`, 
        boxShadow: `var(--m3-elevation-${elevation})`,
        ...(colorShift && { backgroundColor: colorShift })
      }
    ];

    hoverAnimation = element.animate(keyframes, {
      duration: ANIMATION_DURATION.short4,
      easing: MATERIAL3_EASING.expressiveEntrance,
      fill: 'forwards'
    });
  };

  const onMouseLeave = () => {
    // Cancel any existing animation
    hoverAnimation?.cancel();

    const keyframes: Keyframe[] = [
      { 
        transform: `scale(${scale})`, 
        boxShadow: `var(--m3-elevation-${elevation})`,
        ...(colorShift && { backgroundColor: colorShift })
      },
      { 
        transform: 'scale(1)', 
        boxShadow: 'var(--m3-elevation-1)',
        ...(colorShift && { backgroundColor: '' })
      }
    ];

    hoverAnimation = element.animate(keyframes, {
      duration: ANIMATION_DURATION.short3,
      easing: MATERIAL3_EASING.expressiveExit,
      fill: 'forwards'
    });
  };

  return { onMouseEnter, onMouseLeave };
}

/**
 * Create focus animation with outline and glow
 */
export function createFocusAnimation(element: HTMLElement): { onFocus: () => void; onBlur: () => void } {
  if (prefersReducedMotion()) {
    return {
      onFocus: () => element.classList.add('focus-state'),
      onBlur: () => element.classList.remove('focus-state')
    };
  }

  let focusAnimation: Animation | null = null;

  const onFocus = () => {
    focusAnimation?.cancel();

    focusAnimation = element.animate([
      { 
        outline: '0px solid var(--m3-primary)',
        boxShadow: '0 0 0 0 rgba(var(--m3-primary-rgb), 0)'
      },
      { 
        outline: '2px solid var(--m3-primary)',
        boxShadow: '0 0 0 4px rgba(var(--m3-primary-rgb), 0.12)'
      }
    ], {
      duration: ANIMATION_DURATION.short3,
      easing: MATERIAL3_EASING.expressiveEntrance,
      fill: 'forwards'
    });
  };

  const onBlur = () => {
    focusAnimation?.cancel();

    focusAnimation = element.animate([
      { 
        outline: '2px solid var(--m3-primary)',
        boxShadow: '0 0 0 4px rgba(var(--m3-primary-rgb), 0.12)'
      },
      { 
        outline: '0px solid var(--m3-primary)',
        boxShadow: '0 0 0 0 rgba(var(--m3-primary-rgb), 0)'
      }
    ], {
      duration: ANIMATION_DURATION.short2,
      easing: MATERIAL3_EASING.expressiveExit,
      fill: 'forwards'
    });
  };

  return { onFocus, onBlur };
}

/**
 * Create stagger animation for list items
 */
export function createStaggerAnimation(
  elements: HTMLElement[], 
  direction: 'up' | 'down' | 'left' | 'right' = 'up',
  staggerDelay = 50
): Promise<void> {
  if (prefersReducedMotion()) {
    elements.forEach(el => el.style.opacity = '1');
    return Promise.resolve();
  }

  const promises = elements.map((element, index) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        let transform = '';
        switch (direction) {
          case 'up':
            transform = 'translateY(20px)';
            break;
          case 'down':
            transform = 'translateY(-20px)';
            break;
          case 'left':
            transform = 'translateX(20px)';
            break;
          case 'right':
            transform = 'translateX(-20px)';
            break;
        }

        const animation = element.animate([
          { 
            opacity: 0, 
            transform: `${transform} scale(0.9)` 
          },
          { 
            opacity: 1, 
            transform: 'translateY(0) translateX(0) scale(1)' 
          }
        ], {
          duration: ANIMATION_DURATION.medium2,
          easing: MATERIAL3_EASING.expressiveEntrance,
          fill: 'forwards'
        });

        animation.addEventListener('finish', () => resolve());
      }, index * staggerDelay);
    });
  });

  return Promise.all(promises).then(() => {});
}

/**
 * Performance monitoring for animations
 */
export function startAnimationPerformanceMonitoring(): void {
  if (typeof window === 'undefined' || !window.PerformanceObserver) return;

  performanceObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach((entry) => {
      if (entry.entryType === 'measure' && entry.name.includes('animation')) {
        if (entry.duration > 16.67) { // More than one frame at 60fps
          console.warn(`Animation performance issue: ${entry.name} took ${entry.duration}ms`);
        }
      }
    });
  });

  performanceObserver.observe({ entryTypes: ['measure'] });
}

/**
 * Stop performance monitoring
 */
export function stopAnimationPerformanceMonitoring(): void {
  performanceObserver?.disconnect();
  performanceObserver = null;
}

/**
 * Cancel all running animations
 */
export function cancelAllAnimations(): void {
  animationState.currentAnimations.forEach((animation) => {
    animation.cancel();
  });
  animationState.currentAnimations.clear();
}

/**
 * Get current animation count (for debugging)
 */
export function getActiveAnimationCount(): number {
  return animationState.currentAnimations.size;
}

/**
 * Create page transition animation
 */
export function createPageTransition(
  fromElement: HTMLElement,
  toElement: HTMLElement,
  direction: 'forward' | 'backward' = 'forward'
): Promise<void> {
  return new Promise((resolve) => {
    if (prefersReducedMotion()) {
      fromElement.style.display = 'none';
      toElement.style.display = 'block';
      resolve();
      return;
    }

    const translateValue = direction === 'forward' ? '-100%' : '100%';
    const reverseTranslateValue = direction === 'forward' ? '100%' : '-100%';

    // Animate out the from element
    const fromAnimation = fromElement.animate([
      { transform: 'translateX(0)', opacity: 1 },
      { transform: `translateX(${translateValue})`, opacity: 0 }
    ], {
      duration: ANIMATION_DURATION.medium3,
      easing: MATERIAL3_EASING.emphasized,
      fill: 'forwards'
    });

    // Animate in the to element
    const toAnimation = toElement.animate([
      { transform: `translateX(${reverseTranslateValue})`, opacity: 0 },
      { transform: 'translateX(0)', opacity: 1 }
    ], {
      duration: ANIMATION_DURATION.medium3,
      easing: MATERIAL3_EASING.emphasized,
      fill: 'forwards'
    });

    Promise.all([
      new Promise(resolve => fromAnimation.addEventListener('finish', resolve)),
      new Promise(resolve => toAnimation.addEventListener('finish', resolve))
    ]).then(() => {
      resolve();
    });
  });
}

/**
 * CSS classes for common animations
 */
export const ANIMATION_CLASSES = {
  // Fade animations
  fadeIn: 'animate-fade-in',
  fadeOut: 'animate-fade-out',
  
  // Scale animations
  scaleIn: 'animate-scale-in',
  scaleOut: 'animate-scale-out',
  
  // Slide animations
  slideInUp: 'animate-slide-in-up',
  slideInDown: 'animate-slide-in-down',
  slideInLeft: 'animate-slide-in-left',
  slideInRight: 'animate-slide-in-right',
  
  // Bounce animations
  bounceIn: 'animate-bounce-in',
  bounceOut: 'animate-bounce-out',
  
  // Loading states
  pulse: 'animate-pulse',
  spin: 'animate-spin',
  shimmer: 'animate-shimmer',
} as const;

/**
 * React hook for easy animation integration
 */
export function useAnimation(ref: RefObject<HTMLElement>) {
  const animateIn = (type: keyof typeof ANIMATION_CLASSES) => {
    if (!ref.current) return;
    ref.current.classList.add(ANIMATION_CLASSES[type]);
  };

  const animateOut = (type: keyof typeof ANIMATION_CLASSES) => {
    if (!ref.current) return;
    ref.current.classList.remove(ANIMATION_CLASSES[type]);
  };

  const createHover = (options?: Parameters<typeof createHoverAnimation>[1]) => {
    if (!ref.current) return { onMouseEnter: () => {}, onMouseLeave: () => {} };
    return createHoverAnimation(ref.current, options);
  };

  const createFocus = () => {
    if (!ref.current) return { onFocus: () => {}, onBlur: () => {} };
    return createFocusAnimation(ref.current);
  };

  const createLoading = (type?: Parameters<typeof createLoadingAnimation>[1]) => {
    if (!ref.current) return () => {};
    return createLoadingAnimation(ref.current, type);
  };

  return {
    animateIn,
    animateOut,
    createHover,
    createFocus,
    createLoading,
  };
}