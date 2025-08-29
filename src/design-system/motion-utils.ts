/**
 * Material 3 Motion System Utilities
 * JavaScript utilities for programmatic motion control, animations, and transitions
 */

import type { 
  Material3MotionDuration, 
  Material3MotionEasing, 
  Material3AnimationState,
  Material3MotionConfig 
} from './types';

/**
 * Motion Duration Constants
 */
const MOTION_DURATIONS = {
  SHORT1: 50,
  SHORT2: 100,
  SHORT3: 150,
  SHORT4: 200,
  MEDIUM1: 250,
  MEDIUM2: 300,
  MEDIUM3: 350,
  MEDIUM4: 400,
  LONG1: 450,
  LONG2: 500,
  LONG3: 550,
  LONG4: 600,
  EXTRA_LONG1: 700,
  EXTRA_LONG2: 800,
  EXTRA_LONG3: 900,
  EXTRA_LONG4: 1000,
} as const;

/**
 * Motion Easing Constants
 */
const MOTION_EASINGS = {
  LINEAR: 'linear',
  STANDARD: 'cubic-bezier(0.2, 0.0, 0, 1.0)',
  STANDARD_ACCELERATE: 'cubic-bezier(0.3, 0, 1, 1)',
  STANDARD_DECELERATE: 'cubic-bezier(0, 0, 0, 1)',
  EMPHASIZED: 'cubic-bezier(0.2, 0.0, 0, 1.0)',
  EMPHASIZED_ACCELERATE: 'cubic-bezier(0.3, 0.0, 0.8, 0.15)',
  EMPHASIZED_DECELERATE: 'cubic-bezier(0.05, 0.7, 0.1, 1.0)',
  EXPRESSIVE_STANDARD: 'cubic-bezier(0.2, 0.0, 0, 1.0)',
  EXPRESSIVE_ENTRANCE: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
  EXPRESSIVE_EXIT: 'cubic-bezier(0.4, 0.0, 1, 1)',
  EXPRESSIVE_BOUNCE: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  EXPRESSIVE_ELASTIC: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  EXPRESSIVE_BACK: 'cubic-bezier(0.68, -0.6, 0.32, 1.6)',
} as const;

/**
 * Motion Utility Functions
 */
export const Material3Motion = {
  /**
   * Duration utilities
   */
  Duration: {
    /**
     * Get duration value in milliseconds
     */
    getValue: (duration: Material3MotionDuration): number => {
      const upperDuration = duration.toUpperCase().replace(/-/g, '_') as keyof typeof MOTION_DURATIONS;
      return MOTION_DURATIONS[upperDuration] || MOTION_DURATIONS.MEDIUM2;
    },

    /**
     * Get CSS duration string
     */
    getCSS: (duration: Material3MotionDuration): string => {
      return `${Material3Motion.Duration.getValue(duration)}ms`;
    },

    /**
     * Apply duration to element
     */
    apply: (element: HTMLElement, duration: Material3MotionDuration): void => {
      element.style.transitionDuration = Material3Motion.Duration.getCSS(duration);
    },

    /**
     * Get recommended duration for element type
     */
    getRecommended: (elementType: string): Material3MotionDuration => {
      const recommendations: Record<string, Material3MotionDuration> = {
        'button': 'short4',
        'card': 'medium2',
        'fab': 'medium1',
        'modal': 'medium3',
        'tooltip': 'short3',
        'snackbar': 'medium2',
        'drawer': 'medium4',
        'tab': 'short4',
        'chip': 'short3',
        'switch': 'short2',
      };
      return recommendations[elementType] || 'medium2';
    },
  },

  /**
   * Easing utilities
   */
  Easing: {
    /**
     * Get easing function string
     */
    getValue: (easing: Material3MotionEasing): string => {
      return MOTION_EASINGS[easing.toUpperCase().replace(/-/g, '_') as keyof typeof MOTION_EASINGS] || MOTION_EASINGS.STANDARD;
    },

    /**
     * Apply easing to element
     */
    apply: (element: HTMLElement, easing: Material3MotionEasing): void => {
      element.style.transitionTimingFunction = Material3Motion.Easing.getValue(easing);
    },

    /**
     * Get recommended easing for interaction type
     */
    getRecommended: (interactionType: string): Material3MotionEasing => {
      const recommendations: Record<string, Material3MotionEasing> = {
        'hover': 'standard',
        'click': 'emphasized',
        'focus': 'standard',
        'entrance': 'expressive-entrance',
        'exit': 'expressive-exit',
        'bounce': 'expressive-bounce',
        'elastic': 'expressive-elastic',
        'loading': 'emphasized',
        'error': 'emphasized-accelerate',
        'success': 'expressive-bounce',
      };
      return recommendations[interactionType] || 'standard';
    },
  },

  /**
   * Transition utilities
   */
  Transition: {
    /**
     * Apply complete transition to element
     */
    apply: (element: HTMLElement, config: Material3MotionConfig): void => {
      const duration = Material3Motion.Duration.getCSS(config.duration || 'medium2');
      const easing = Material3Motion.Easing.getValue(config.easing || 'standard');
      const properties = config.properties || ['all'];
      
      element.style.transition = properties
        .map((prop: string) => `${prop} ${duration} ${easing}`)
        .join(', ');
    },

    /**
     * Create transition string
     */
    create: (config: Material3MotionConfig): string => {
      const duration = Material3Motion.Duration.getCSS(config.duration || 'medium2');
      const easing = Material3Motion.Easing.getValue(config.easing || 'standard');
      const properties = config.properties || ['all'];
      
      return properties
        .map((prop: string) => `${prop} ${duration} ${easing}`)
        .join(', ');
    },

    /**
     * Remove transitions from element
     */
    remove: (element: HTMLElement): void => {
      element.style.transition = 'none';
    },

    /**
     * Temporarily disable transitions
     */
    disable: (element: HTMLElement, callback: () => void): void => {
      const originalTransition = element.style.transition;
      element.style.transition = 'none';
      
      // Force reflow
      void element.offsetHeight;
      
      callback();
      
      // Restore transition after callback
      requestAnimationFrame(() => {
        element.style.transition = originalTransition;
      });
    },
  },

  /**
   * Animation utilities
   */
  Animation: {
    /**
     * Animate element with keyframes
     */
    animate: (
      element: HTMLElement, 
      keyframes: Keyframe[], 
      config: Material3MotionConfig
    ): Animation => {
      const duration = Material3Motion.Duration.getValue(config.duration || 'medium2');
      const easing = Material3Motion.Easing.getValue(config.easing || 'standard');
      
      return element.animate(keyframes, {
        duration,
        easing,
        fill: config.fill || 'both',
        iterations: config.iterations || 1,
      });
    },

    /**
     * Fade in animation
     */
    fadeIn: (element: HTMLElement, config: Partial<Material3MotionConfig> = {}): Animation => {
      return Material3Motion.Animation.animate(element, [
        { opacity: 0 },
        { opacity: 1 }
      ], {
        duration: config.duration || 'medium2',
        easing: config.easing || 'emphasized',
        ...config
      });
    },

    /**
     * Fade out animation
     */
    fadeOut: (element: HTMLElement, config: Partial<Material3MotionConfig> = {}): Animation => {
      return Material3Motion.Animation.animate(element, [
        { opacity: 1 },
        { opacity: 0 }
      ], {
        duration: config.duration || 'medium1',
        easing: config.easing || 'emphasized',
        ...config
      });
    },

    /**
     * Scale in animation
     */
    scaleIn: (element: HTMLElement, config: Partial<Material3MotionConfig> = {}): Animation => {
      return Material3Motion.Animation.animate(element, [
        { opacity: 0, transform: 'scale(0.8)' },
        { opacity: 1, transform: 'scale(1)' }
      ], {
        duration: config.duration || 'medium2',
        easing: config.easing || 'emphasized',
        ...config
      });
    },

    /**
     * Scale out animation
     */
    scaleOut: (element: HTMLElement, config: Partial<Material3MotionConfig> = {}): Animation => {
      return Material3Motion.Animation.animate(element, [
        { opacity: 1, transform: 'scale(1)' },
        { opacity: 0, transform: 'scale(0.8)' }
      ], {
        duration: config.duration || 'medium1',
        easing: config.easing || 'emphasized',
        ...config
      });
    },

    /**
     * Slide in from direction
     */
    slideIn: (
      element: HTMLElement, 
      direction: 'left' | 'right' | 'up' | 'down' = 'left',
      config: Partial<Material3MotionConfig> = {}
    ): Animation => {
      const transforms: Record<string, string> = {
        left: 'translateX(-100%)',
        right: 'translateX(100%)',
        up: 'translateY(-100%)',
        down: 'translateY(100%)',
      };

      return Material3Motion.Animation.animate(element, [
        { opacity: 0, transform: transforms[direction] },
        { opacity: 1, transform: 'translate(0, 0)' }
      ], {
        duration: config.duration || 'medium3',
        easing: config.easing || 'expressive-entrance',
        ...config
      });
    },

    /**
     * Bounce animation
     */
    bounce: (element: HTMLElement, config: Partial<Material3MotionConfig> = {}): Animation => {
      return Material3Motion.Animation.animate(element, [
        { transform: 'scale(1)' },
        { transform: 'scale(1.1)' },
        { transform: 'scale(0.9)' },
        { transform: 'scale(1.02)' },
        { transform: 'scale(1)' }
      ], {
        duration: config.duration || 'long1',
        easing: config.easing || 'expressive-bounce',
        ...config
      });
    },

    /**
     * Shake animation (for errors)
     */
    shake: (element: HTMLElement, config: Partial<Material3MotionConfig> = {}): Animation => {
      return Material3Motion.Animation.animate(element, [
        { transform: 'translateX(0)' },
        { transform: 'translateX(-4px)' },
        { transform: 'translateX(4px)' },
        { transform: 'translateX(-2px)' },
        { transform: 'translateX(2px)' },
        { transform: 'translateX(0)' }
      ], {
        duration: config.duration || 'medium1',
        easing: config.easing || 'emphasized',
        ...config
      });
    },
  },

  /**
   * Component-specific motion presets
   */
  Components: {
    /**
     * Button motion
     */
    button: {
      setup: (element: HTMLElement): void => {
        Material3Motion.Transition.apply(element, {
          duration: 'short4',
          easing: 'standard',
          properties: ['background-color', 'box-shadow', 'transform']
        });
      },

      press: (element: HTMLElement): Animation => {
        return Material3Motion.Animation.animate(element, [
          { transform: 'scale(1)' },
          { transform: 'scale(0.98)' }
        ], {
          duration: 'short1',
          easing: 'standard'
        });
      },

      release: (element: HTMLElement): Animation => {
        return Material3Motion.Animation.animate(element, [
          { transform: 'scale(0.98)' },
          { transform: 'scale(1)' }
        ], {
          duration: 'short2',
          easing: 'standard'
        });
      },
    },

    /**
     * Card motion
     */
    card: {
      setup: (element: HTMLElement): void => {
        Material3Motion.Transition.apply(element, {
          duration: 'medium2',
          easing: 'emphasized',
          properties: ['transform', 'box-shadow']
        });
      },

      hover: (element: HTMLElement): void => {
        element.style.transform = 'translateY(-4px)';
      },

      unhover: (element: HTMLElement): void => {
        element.style.transform = 'translateY(0)';
      },
    },

    /**
     * FAB motion
     */
    fab: {
      setup: (element: HTMLElement): void => {
        Material3Motion.Transition.apply(element, {
          duration: 'medium1',
          easing: 'expressive-bounce',
          properties: ['transform', 'box-shadow']
        });
      },

      hover: (element: HTMLElement): void => {
        element.style.transform = 'scale(1.1)';
      },

      press: (element: HTMLElement): void => {
        element.style.transform = 'scale(0.95)';
      },

      reset: (element: HTMLElement): void => {
        element.style.transform = 'scale(1)';
      },
    },

    /**
     * Modal motion
     */
    modal: {
      enter: (element: HTMLElement): Animation => {
        return Material3Motion.Animation.scaleIn(element, {
          duration: 'medium3',
          easing: 'emphasized'
        });
      },

      exit: (element: HTMLElement): Animation => {
        return Material3Motion.Animation.scaleOut(element, {
          duration: 'medium1',
          easing: 'emphasized'
        });
      },
    },
  },

  /**
   * Utility helpers
   */
  Utils: {
    /**
     * Check if user prefers reduced motion
     */
    prefersReducedMotion: (): boolean => {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    },

    /**
     * Get safe duration (respects user preferences)
     */
    getSafeDuration: (duration: Material3MotionDuration): number => {
      if (Material3Motion.Utils.prefersReducedMotion()) {
        return 1; // 1ms for reduced motion
      }
      return Material3Motion.Duration.getValue(duration);
    },

    /**
     * Create motion-aware config
     */
    createSafeConfig: (config: Material3MotionConfig): Material3MotionConfig => {
      if (Material3Motion.Utils.prefersReducedMotion()) {
        return {
          ...config,
          duration: 'short1', // Override to shortest duration
        };
      }
      return config;
    },

    /**
     * Wait for animation to complete
     */
    waitForAnimation: (animation: Animation): Promise<void> => {
      return new Promise((resolve) => {
        animation.addEventListener('finish', () => resolve(), { once: true });
      });
    },

    /**
     * Cancel all animations on element
     */
    cancelAnimations: (element: HTMLElement): void => {
      element.getAnimations().forEach(animation => {
        animation.cancel();
      });
    },

    /**
     * Check if element has running animations
     */
    hasRunningAnimations: (element: HTMLElement): boolean => {
      return element.getAnimations().some(animation => 
        animation.playState === 'running'
      );
    },
  },

  /**
   * Sequence utilities for complex animations
   */
  Sequence: {
    /**
     * Run animations in sequence
     */
    sequential: async (animations: (() => Animation)[]): Promise<void> => {
      for (const createAnimation of animations) {
        const animation = createAnimation();
        await Material3Motion.Utils.waitForAnimation(animation);
      }
    },

    /**
     * Run animations in parallel
     */
    parallel: (animations: (() => Animation)[]): Promise<void[]> => {
      const promises = animations.map(createAnimation => {
        const animation = createAnimation();
        return Material3Motion.Utils.waitForAnimation(animation);
      });
      return Promise.all(promises);
    },

    /**
     * Stagger animations with delay
     */
    stagger: (
      elements: HTMLElement[],
      animationFn: (element: HTMLElement) => Animation,
      staggerDelay: number = 100
    ): Promise<void[]> => {
      const promises = elements.map((element, index) => {
        return new Promise<void>((resolve) => {
          setTimeout(() => {
            const animation = animationFn(element);
            Material3Motion.Utils.waitForAnimation(animation).then(resolve);
          }, index * staggerDelay);
        });
      });
      return Promise.all(promises);
    },
  },
};

// Export types for TypeScript support
export type { 
  Material3MotionDuration, 
  Material3MotionEasing, 
  Material3AnimationState,
  Material3MotionConfig 
};

// Default export
export default Material3Motion;