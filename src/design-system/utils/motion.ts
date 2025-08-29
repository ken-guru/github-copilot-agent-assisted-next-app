/**
 * Material 3 Motion System
 * Core animation utilities, easing curves, and duration tokens following Material 3 design principles
 */

/**
 * Material 3 Easing Curves
 * These curves provide natural motion that feels smooth and responsive
 */
export const Material3Easing = {
  // Standard easing for most animations
  standard: 'cubic-bezier(0.2, 0, 0, 1)',
  
  // Emphasized easing for important elements
  emphasized: 'cubic-bezier(0.05, 0.7, 0.1, 1)',
  
  // Decelerated easing for entering elements
  decelerated: 'cubic-bezier(0, 0, 0.2, 1)',
  
  // Accelerated easing for exiting elements
  accelerated: 'cubic-bezier(0.3, 0, 1, 1)',
  
  // Linear easing for continuous motion
  linear: 'linear',
  
  // Legacy support
  legacy: {
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)'
  }
} as const;

/**
 * Material 3 Duration Tokens
 * Consistent timing values for different types of animations
 */
export const Material3Duration = {
  // Extra short for quick feedback
  extraShort1: 50,
  extraShort2: 100,
  
  // Short for simple transitions
  short1: 150,
  short2: 200,
  short3: 250,
  short4: 300,
  
  // Medium for standard transitions
  medium1: 350,
  medium2: 400,
  medium3: 450,
  medium4: 500,
  
  // Long for complex animations
  long1: 550,
  long2: 600,
  long3: 700,
  long4: 800,
  
  // Extra long for dramatic effects
  extraLong1: 900,
  extraLong2: 1000,
  extraLong3: 1200,
  extraLong4: 1500
} as const;

/**
 * Animation Type Mappings
 * Recommended durations and easings for different animation types
 */
export const Material3AnimationTypes = {
  // Simple state changes
  simple: {
    duration: Material3Duration.short2,
    easing: Material3Easing.standard
  },
  
  // Component entrance
  enter: {
    duration: Material3Duration.medium2,
    easing: Material3Easing.decelerated
  },
  
  // Component exit
  exit: {
    duration: Material3Duration.short3,
    easing: Material3Easing.accelerated
  },
  
  // Interactive feedback
  interaction: {
    duration: Material3Duration.extraShort2,
    easing: Material3Easing.standard
  },
  
  // Emphasized transitions
  emphasized: {
    duration: Material3Duration.medium3,
    easing: Material3Easing.emphasized
  },
  
  // Complex layout changes
  complex: {
    duration: Material3Duration.long1,
    easing: Material3Easing.emphasized
  },
  
  // Loading and progress
  loading: {
    duration: Material3Duration.long2,
    easing: Material3Easing.linear
  }
} as const;

/**
 * CSS Animation Utility Functions
 */
export const Material3Animations = {
  /**
   * Generate a CSS transition string
   */
  transition: (
    property: string | string[],
    type: keyof typeof Material3AnimationTypes = 'simple',
    customDuration?: number,
    customEasing?: string
  ): string => {
    const config = Material3AnimationTypes[type];
    const duration = customDuration || config.duration;
    const easing = customEasing || config.easing;
    
    const properties = Array.isArray(property) ? property : [property];
    
    return properties
      .map(prop => `${prop} ${duration}ms ${easing}`)
      .join(', ');
  },

  /**
   * Generate keyframe animation CSS
   */
  keyframes: (
    name: string,
    frames: Record<string, Record<string, string | number>>
  ): string => {
    const frameEntries = Object.entries(frames);
    const keyframeRules = frameEntries
      .map(([percentage, styles]) => {
        const styleRules = Object.entries(styles)
          .map(([prop, value]) => `${prop}: ${value}`)
          .join('; ');
        return `${percentage} { ${styleRules} }`;
      })
      .join('\n  ');
    
    return `@keyframes ${name} {\n  ${keyframeRules}\n}`;
  },

  /**
   * Apply animation to element
   */
  apply: (
    element: HTMLElement,
    config: {
      property: string | string[];
      type?: keyof typeof Material3AnimationTypes;
      duration?: number;
      easing?: string;
      delay?: number;
    }
  ): void => {
    const transition = Material3Animations.transition(
      config.property,
      config.type,
      config.duration,
      config.easing
    );
    
    element.style.transition = transition;
    
    if (config.delay) {
      element.style.transitionDelay = `${config.delay}ms`;
    }
  }
};

/**
 * Common Animation Presets
 */
export const Material3AnimationPresets = {
  // Fade animations
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: Material3AnimationTypes.enter
  },
  
  fadeOut: {
    from: { opacity: 1 },
    to: { opacity: 0 },
    config: Material3AnimationTypes.exit
  },
  
  // Scale animations
  scaleIn: {
    from: { opacity: 0, transform: 'scale(0.8)' },
    to: { opacity: 1, transform: 'scale(1)' },
    config: Material3AnimationTypes.enter
  },
  
  scaleOut: {
    from: { opacity: 1, transform: 'scale(1)' },
    to: { opacity: 0, transform: 'scale(0.8)' },
    config: Material3AnimationTypes.exit
  },
  
  // Slide animations
  slideInUp: {
    from: { opacity: 0, transform: 'translateY(24px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    config: Material3AnimationTypes.enter
  },
  
  slideInDown: {
    from: { opacity: 0, transform: 'translateY(-24px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    config: Material3AnimationTypes.enter
  },
  
  slideInLeft: {
    from: { opacity: 0, transform: 'translateX(-24px)' },
    to: { opacity: 1, transform: 'translateX(0)' },
    config: Material3AnimationTypes.enter
  },
  
  slideInRight: {
    from: { opacity: 0, transform: 'translateX(24px)' },
    to: { opacity: 1, transform: 'translateX(0)' },
    config: Material3AnimationTypes.enter
  },
  
  slideOutUp: {
    from: { opacity: 1, transform: 'translateY(0)' },
    to: { opacity: 0, transform: 'translateY(-24px)' },
    config: Material3AnimationTypes.exit
  },
  
  slideOutDown: {
    from: { opacity: 1, transform: 'translateY(0)' },
    to: { opacity: 0, transform: 'translateY(24px)' },
    config: Material3AnimationTypes.exit
  },
  
  slideOutLeft: {
    from: { opacity: 1, transform: 'translateX(0)' },
    to: { opacity: 0, transform: 'translateX(-24px)' },
    config: Material3AnimationTypes.exit
  },
  
  slideOutRight: {
    from: { opacity: 1, transform: 'translateX(0)' },
    to: { opacity: 0, transform: 'translateX(24px)' },
    config: Material3AnimationTypes.exit
  },
  
  // Interactive feedback
  ripple: {
    from: { transform: 'scale(0)', opacity: 0.12 },
    to: { transform: 'scale(4)', opacity: 0 },
    config: Material3AnimationTypes.interaction
  },
  
  press: {
    from: { transform: 'scale(1)' },
    to: { transform: 'scale(0.96)' },
    config: Material3AnimationTypes.interaction
  },
  
  // Loading animations
  pulse: {
    '0%': { opacity: 1 },
    '50%': { opacity: 0.5 },
    '100%': { opacity: 1 }
  },
  
  spin: {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' }
  },
  
  bounce: {
    '0%, 20%, 53%, 80%, 100%': { transform: 'translate3d(0,0,0)' },
    '40%, 43%': { transform: 'translate3d(0, -8px, 0)' },
    '70%': { transform: 'translate3d(0, -4px, 0)' },
    '90%': { transform: 'translate3d(0, -2px, 0)' }
  }
};

/**
 * Performance-optimized animation utilities
 */
export const Material3Performance = {
  /**
   * Force hardware acceleration for smooth animations
   */
  enableHardwareAcceleration: (element: HTMLElement): void => {
    element.style.willChange = 'transform, opacity';
    element.style.transform = 'translateZ(0)';
  },

  /**
   * Disable hardware acceleration after animation
   */
  disableHardwareAcceleration: (element: HTMLElement): void => {
    element.style.willChange = 'auto';
    element.style.transform = '';
  },

  /**
   * Use requestAnimationFrame for smooth animations
   */
  animate: (
    element: HTMLElement,
    keyframes: Keyframe[],
    options: KeyframeAnimationOptions = {}
  ): Animation => {
    // Set default options optimized for performance
    const animationOptions: KeyframeAnimationOptions = {
      duration: Material3Duration.medium2,
      easing: Material3Easing.standard,
      fill: 'forwards',
      ...options
    };

    // Enable hardware acceleration
    Material3Performance.enableHardwareAcceleration(element);

    const animation = element.animate(keyframes, animationOptions);

    // Cleanup after animation
    animation.addEventListener('finish', () => {
      Material3Performance.disableHardwareAcceleration(element);
    });

    return animation;
  },

  /**
   * Check if user prefers reduced motion
   */
  respectsReducedMotion: (): boolean => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  /**
   * Get appropriate duration based on user preferences
   */
  getDuration: (duration: number): number => {
    return Material3Performance.respectsReducedMotion() ? 0 : duration;
  },

  /**
   * Get appropriate easing based on user preferences
   */
  getEasing: (easing: string): string => {
    return Material3Performance.respectsReducedMotion() ? 'linear' : easing;
  }
};

/**
 * Utility to create smooth transitions between states
 */
export class Material3StateTransition {
  private element: HTMLElement;
  private currentState: string = 'default';
  private states: Record<string, Record<string, string | number>> = {};
  private transitions: Record<string, { duration: number; easing: string }> = {};

  constructor(element: HTMLElement) {
    this.element = element;
  }

  /**
   * Define a visual state
   */
  defineState(
    name: string,
    styles: Record<string, string | number>,
    transition: { duration?: number; easing?: string } = {}
  ): this {
    this.states[name] = styles;
    this.transitions[name] = {
      duration: transition.duration || Material3Duration.medium2,
      easing: transition.easing || Material3Easing.standard
    };
    return this;
  }

  /**
   * Transition to a specific state
   */
  transitionTo(stateName: string): Promise<void> {
    if (!this.states[stateName]) {
      throw new Error(`State "${stateName}" not defined`);
    }

    const targetStyles = this.states[stateName];
    const transition = this.transitions[stateName] || {
      duration: Material3Duration.medium2,
      easing: Material3Easing.standard
    };

    return new Promise((resolve) => {
      // Apply transition
      const properties = Object.keys(targetStyles);
      this.element.style.transition = Material3Animations.transition(
        properties,
        'simple',
        Material3Performance.getDuration(transition.duration),
        Material3Performance.getEasing(transition.easing)
      );

      // Apply target styles
      Object.entries(targetStyles).forEach(([property, value]) => {
        (this.element.style as any)[property] = value;
      });

      // Wait for transition to complete
      const transitionEnd = () => {
        this.element.removeEventListener('transitionend', transitionEnd);
        this.currentState = stateName;
        resolve();
      };

      this.element.addEventListener('transitionend', transitionEnd);

      // Fallback timeout
      setTimeout(transitionEnd, transition.duration + 50);
    });
  }

  /**
   * Get current state
   */
  getCurrentState(): string {
    return this.currentState;
  }

  /**
   * Reset to default state
   */
  reset(): Promise<void> {
    return this.transitionTo('default');
  }
}

/**
 * Export type definitions
 */
export type AnimationType = keyof typeof Material3AnimationTypes;
export type EasingType = keyof typeof Material3Easing;
export type DurationType = keyof typeof Material3Duration;
export type AnimationPreset = keyof typeof Material3AnimationPresets;