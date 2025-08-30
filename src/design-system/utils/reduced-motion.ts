import React from 'react';

/**
 * Reduced Motion Support for Material 3 Components
 * 
 * Comprehensive reduced motion implementation respecting user preferences
 * and providing accessible animations for Material 3 design system.
 */

/**
 * Motion preferences detection and management
 */
export const MotionPreferences = {
  /**
   * Check if user prefers reduced motion
   */
  prefersReducedMotion: (): boolean => {
    if (typeof window === 'undefined') return false;
    
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  /**
   * Listen for changes in motion preferences
   */
  onMotionPreferenceChange: (callback: (prefersReduced: boolean) => void): (() => void) => {
    if (typeof window === 'undefined') return () => {};
    
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => callback(e.matches);
    
    mediaQuery.addEventListener('change', handler);
    
    // Return cleanup function
    return () => mediaQuery.removeEventListener('change', handler);
  },

  /**
   * Get appropriate animation duration based on motion preferences
   */
  getDuration: (normalDuration: number, reducedDuration: number = 0): number => {
    return MotionPreferences.prefersReducedMotion() ? reducedDuration : normalDuration;
  },

  /**
   * Get appropriate easing based on motion preferences
   */
  getEasing: (
    normalEasing: string = 'cubic-bezier(0.2, 0, 0, 1)', 
    reducedEasing: string = 'linear'
  ): string => {
    return MotionPreferences.prefersReducedMotion() ? reducedEasing : normalEasing;
  }
} as const;

/**
 * Material 3 motion tokens with reduced motion support
 */
export const Material3Motion = {
  duration: {
    // Emphasized motion (large, expressive movements)
    emphasized: {
      enter: MotionPreferences.getDuration(500, 200),
      exit: MotionPreferences.getDuration(400, 150)
    },
    
    // Standard motion (most UI elements)
    standard: {
      enter: MotionPreferences.getDuration(300, 150),
      exit: MotionPreferences.getDuration(250, 100)
    },
    
    // Short motion (small UI changes)
    short: {
      enter: MotionPreferences.getDuration(200, 100),
      exit: MotionPreferences.getDuration(150, 50)
    },
    
    // Extra short motion (micro-interactions)
    extraShort: {
      enter: MotionPreferences.getDuration(100, 50),
      exit: MotionPreferences.getDuration(75, 25)
    }
  },

  easing: {
    // Emphasized easing (attention-grabbing)
    emphasized: {
      standard: MotionPreferences.getEasing('cubic-bezier(0.2, 0, 0, 1)'),
      decelerate: MotionPreferences.getEasing('cubic-bezier(0, 0, 0, 1)'),
      accelerate: MotionPreferences.getEasing('cubic-bezier(0.3, 0, 1, 1)')
    },
    
    // Standard easing (most common)
    standard: {
      standard: MotionPreferences.getEasing('cubic-bezier(0.2, 0, 0, 1)'),
      decelerate: MotionPreferences.getEasing('cubic-bezier(0, 0, 0, 1)'),
      accelerate: MotionPreferences.getEasing('cubic-bezier(0.3, 0, 1, 1)')
    }
  }
} as const;

/**
 * CSS custom properties for motion
 */
export const generateMotionCSS = (): string => {
  const prefersReduced = MotionPreferences.prefersReducedMotion();
  
  return `
    :root {
      /* Duration tokens */
      --m3-motion-duration-emphasized-enter: ${Material3Motion.duration.emphasized.enter}ms;
      --m3-motion-duration-emphasized-exit: ${Material3Motion.duration.emphasized.exit}ms;
      --m3-motion-duration-standard-enter: ${Material3Motion.duration.standard.enter}ms;
      --m3-motion-duration-standard-exit: ${Material3Motion.duration.standard.exit}ms;
      --m3-motion-duration-short-enter: ${Material3Motion.duration.short.enter}ms;
      --m3-motion-duration-short-exit: ${Material3Motion.duration.short.exit}ms;
      --m3-motion-duration-extra-short-enter: ${Material3Motion.duration.extraShort.enter}ms;
      --m3-motion-duration-extra-short-exit: ${Material3Motion.duration.extraShort.exit}ms;
      
      /* Easing tokens */
      --m3-motion-easing-emphasized: ${Material3Motion.easing.emphasized.standard};
      --m3-motion-easing-emphasized-decelerate: ${Material3Motion.easing.emphasized.decelerate};
      --m3-motion-easing-emphasized-accelerate: ${Material3Motion.easing.emphasized.accelerate};
      --m3-motion-easing-standard: ${Material3Motion.easing.standard.standard};
      --m3-motion-easing-standard-decelerate: ${Material3Motion.easing.standard.decelerate};
      --m3-motion-easing-standard-accelerate: ${Material3Motion.easing.standard.accelerate};
    }

    /* Respect reduced motion preference */
    @media (prefers-reduced-motion: reduce) {
      *,
      *::before,
      *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
      }
      
      /* Override for essential animations that should remain */
      .m3-essential-animation {
        animation-duration: 200ms !important;
        transition-duration: 200ms !important;
      }
    }

    /* Base motion classes */
    .m3-motion-emphasized-enter {
      animation-duration: var(--m3-motion-duration-emphasized-enter);
      transition-duration: var(--m3-motion-duration-emphasized-enter);
      animation-timing-function: var(--m3-motion-easing-emphasized);
      transition-timing-function: var(--m3-motion-easing-emphasized);
    }

    .m3-motion-emphasized-exit {
      animation-duration: var(--m3-motion-duration-emphasized-exit);
      transition-duration: var(--m3-motion-duration-emphasized-exit);
      animation-timing-function: var(--m3-motion-easing-emphasized-accelerate);
      transition-timing-function: var(--m3-motion-easing-emphasized-accelerate);
    }

    .m3-motion-standard-enter {
      animation-duration: var(--m3-motion-duration-standard-enter);
      transition-duration: var(--m3-motion-duration-standard-enter);
      animation-timing-function: var(--m3-motion-easing-standard);
      transition-timing-function: var(--m3-motion-easing-standard);
    }

    .m3-motion-standard-exit {
      animation-duration: var(--m3-motion-duration-standard-exit);
      transition-duration: var(--m3-motion-duration-standard-exit);
      animation-timing-function: var(--m3-motion-easing-standard-accelerate);
      transition-timing-function: var(--m3-motion-easing-standard-accelerate);
    }

    .m3-motion-short {
      animation-duration: var(--m3-motion-duration-short-enter);
      transition-duration: var(--m3-motion-duration-short-enter);
      animation-timing-function: var(--m3-motion-easing-standard);
      transition-timing-function: var(--m3-motion-easing-standard);
    }

    .m3-motion-extra-short {
      animation-duration: var(--m3-motion-duration-extra-short-enter);
      transition-duration: var(--m3-motion-duration-extra-short-enter);
      animation-timing-function: var(--m3-motion-easing-standard);
      transition-timing-function: var(--m3-motion-easing-standard);
    }
  `;
};

/**
 * Animation utilities with reduced motion support
 */
export const AnimationUtils = {
  /**
   * Fade in animation with reduced motion support
   */
  fadeIn: (element: HTMLElement, duration?: number): void => {
    const animationDuration = duration || Material3Motion.duration.standard.enter;
    
    if (MotionPreferences.prefersReducedMotion()) {
      // Instant transition for reduced motion
      element.style.opacity = '1';
      return;
    }

    element.style.opacity = '0';
    element.style.transition = `opacity ${animationDuration}ms ${Material3Motion.easing.standard.standard}`;
    
    requestAnimationFrame(() => {
      element.style.opacity = '1';
    });
  },

  /**
   * Fade out animation with reduced motion support
   */
  fadeOut: (element: HTMLElement, duration?: number): Promise<void> => {
    const animationDuration = duration || Material3Motion.duration.standard.exit;
    
    if (MotionPreferences.prefersReducedMotion()) {
      // Instant transition for reduced motion
      element.style.opacity = '0';
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      element.style.transition = `opacity ${animationDuration}ms ${Material3Motion.easing.standard.accelerate}`;
      element.style.opacity = '0';
      
      setTimeout(resolve, animationDuration);
    });
  },

  /**
   * Slide in animation with reduced motion support
   */
  slideIn: (
    element: HTMLElement, 
    direction: 'up' | 'down' | 'left' | 'right' = 'up',
    duration?: number
  ): void => {
    const animationDuration = duration || Material3Motion.duration.standard.enter;
    
    if (MotionPreferences.prefersReducedMotion()) {
      // Instant transition for reduced motion
      element.style.transform = 'translate3d(0, 0, 0)';
      element.style.opacity = '1';
      return;
    }

    const transforms = {
      up: 'translate3d(0, 20px, 0)',
      down: 'translate3d(0, -20px, 0)',
      left: 'translate3d(20px, 0, 0)',
      right: 'translate3d(-20px, 0, 0)'
    };

    element.style.transform = transforms[direction];
    element.style.opacity = '0';
    element.style.transition = `transform ${animationDuration}ms ${Material3Motion.easing.standard.standard}, opacity ${animationDuration}ms ${Material3Motion.easing.standard.standard}`;
    
    requestAnimationFrame(() => {
      element.style.transform = 'translate3d(0, 0, 0)';
      element.style.opacity = '1';
    });
  },

  /**
   * Scale animation with reduced motion support
   */
  scaleIn: (element: HTMLElement, duration?: number): void => {
    const animationDuration = duration || Material3Motion.duration.short.enter;
    
    if (MotionPreferences.prefersReducedMotion()) {
      // Instant transition for reduced motion
      element.style.transform = 'scale(1)';
      element.style.opacity = '1';
      return;
    }

    element.style.transform = 'scale(0.8)';
    element.style.opacity = '0';
    element.style.transition = `transform ${animationDuration}ms ${Material3Motion.easing.emphasized.standard}, opacity ${animationDuration}ms ${Material3Motion.easing.emphasized.standard}`;
    
    requestAnimationFrame(() => {
      element.style.transform = 'scale(1)';
      element.style.opacity = '1';
    });
  },

  /**
   * Create a spring animation (respects reduced motion)
   */
  spring: (
    element: HTMLElement,
    property: string,
    fromValue: string,
    toValue: string,
    duration?: number
  ): void => {
    const animationDuration = duration || Material3Motion.duration.emphasized.enter;
    
    if (MotionPreferences.prefersReducedMotion()) {
      // Set final value immediately
      (element.style as any)[property] = toValue;
      return;
    }

    (element.style as any)[property] = fromValue;
    element.style.transition = `${property} ${animationDuration}ms ${Material3Motion.easing.emphasized.standard}`;
    
    requestAnimationFrame(() => {
      (element.style as any)[property] = toValue;
    });
  }
} as const;

/**
 * React hooks for motion management
 */
export const useReducedMotion = (): boolean => {
  const [prefersReduced, setPrefersReduced] = React.useState(() => 
    MotionPreferences.prefersReducedMotion()
  );

  React.useEffect(() => {
    const cleanup = MotionPreferences.onMotionPreferenceChange(setPrefersReduced);
    return cleanup;
  }, []);

  return prefersReduced;
};

/**
 * Animation variants for different motion preferences
 */
export const createAnimationVariants = (
  normalAnimation: any,
  reducedAnimation: any = { duration: 0.1, ease: "linear" }
) => {
  return {
    normal: normalAnimation,
    reduced: reducedAnimation,
    current: MotionPreferences.prefersReducedMotion() ? reducedAnimation : normalAnimation
  };
};

/**
 * Material 3 specific animation presets
 */
export const Material3Animations = {
  /**
   * FAB (Floating Action Button) animations
   */
  fab: {
    enter: createAnimationVariants(
      {
        scale: [0.8, 1],
        opacity: [0, 1],
        duration: Material3Motion.duration.emphasized.enter,
        easing: Material3Motion.easing.emphasized.standard
      },
      {
        opacity: [0, 1],
        duration: 100,
        easing: 'linear'
      }
    ),
    exit: createAnimationVariants(
      {
        scale: [1, 0.8],
        opacity: [1, 0],
        duration: Material3Motion.duration.emphasized.exit,
        easing: Material3Motion.easing.emphasized.accelerate
      },
      {
        opacity: [1, 0],
        duration: 50,
        easing: 'linear'
      }
    ),
    hover: createAnimationVariants(
      {
        scale: [1, 1.05],
        duration: Material3Motion.duration.short.enter,
        easing: Material3Motion.easing.standard.standard
      },
      {
        duration: 0
      }
    )
  },

  /**
   * Card animations
   */
  card: {
    enter: createAnimationVariants(
      {
        y: [20, 0],
        opacity: [0, 1],
        duration: Material3Motion.duration.standard.enter,
        easing: Material3Motion.easing.standard.standard
      },
      {
        opacity: [0, 1],
        duration: 100,
        easing: 'linear'
      }
    ),
    hover: createAnimationVariants(
      {
        y: [0, -2],
        boxShadow: [
          'rgba(0, 0, 0, 0.1) 0px 1px 3px',
          'rgba(0, 0, 0, 0.15) 0px 4px 12px'
        ],
        duration: Material3Motion.duration.short.enter,
        easing: Material3Motion.easing.standard.standard
      },
      {
        duration: 0
      }
    )
  },

  /**
   * Modal/Dialog animations
   */
  modal: {
    overlay: createAnimationVariants(
      {
        opacity: [0, 1],
        duration: Material3Motion.duration.standard.enter,
        easing: Material3Motion.easing.standard.standard
      },
      {
        opacity: [0, 1],
        duration: 50,
        easing: 'linear'
      }
    ),
    content: createAnimationVariants(
      {
        scale: [0.9, 1],
        opacity: [0, 1],
        duration: Material3Motion.duration.emphasized.enter,
        easing: Material3Motion.easing.emphasized.standard
      },
      {
        opacity: [0, 1],
        duration: 100,
        easing: 'linear'
      }
    )
  },

  /**
   * Navigation animations
   */
  navigation: {
    slideIn: createAnimationVariants(
      {
        x: [-300, 0],
        opacity: [0, 1],
        duration: Material3Motion.duration.emphasized.enter,
        easing: Material3Motion.easing.emphasized.decelerate
      },
      {
        opacity: [0, 1],
        duration: 100,
        easing: 'linear'
      }
    ),
    slideOut: createAnimationVariants(
      {
        x: [0, -300],
        opacity: [1, 0],
        duration: Material3Motion.duration.emphasized.exit,
        easing: Material3Motion.easing.emphasized.accelerate
      },
      {
        opacity: [1, 0],
        duration: 50,
        easing: 'linear'
      }
    )
  }
} as const;

/**
 * Accessibility announcements for animations
 */
export const announceAnimations = (animationType: string, isStarting: boolean): void => {
  if (!MotionPreferences.prefersReducedMotion()) return;
  
  const announcement = isStarting 
    ? `${animationType} animation started`
    : `${animationType} animation completed`;
    
  // Create announcement for screen readers
  const announceElement = document.createElement('div');
  announceElement.setAttribute('aria-live', 'polite');
  announceElement.setAttribute('aria-atomic', 'true');
  announceElement.style.position = 'absolute';
  announceElement.style.left = '-10000px';
  announceElement.textContent = announcement;
  
  document.body.appendChild(announceElement);
  
  setTimeout(() => {
    if (announceElement.parentNode) {
      announceElement.parentNode.removeChild(announceElement);
    }
  }, 1000);
};