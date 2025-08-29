/**
 * Material 3 Expressive Animation System
 * Provides utilities for implementing Material 3 animations and micro-interactions
 */

export interface AnimationConfig {
  duration: string;
  easing: string;
  delay?: string;
  fillMode?: 'none' | 'forwards' | 'backwards' | 'both';
}

export interface SharedElementTransition {
  element: HTMLElement;
  targetElement?: HTMLElement;
  duration?: string;
  easing?: string;
  properties?: string[];
}

export interface LoadingAnimationConfig {
  type: 'pulse' | 'wave' | 'skeleton' | 'spinner' | 'organic';
  duration?: string;
  intensity?: 'subtle' | 'moderate' | 'prominent';
}

export interface MicroInteractionConfig {
  trigger: 'hover' | 'focus' | 'click' | 'validation' | 'success' | 'error';
  animation: 'scale' | 'ripple' | 'shake' | 'bounce' | 'glow' | 'slide';
  duration?: string;
  intensity?: 'subtle' | 'moderate' | 'prominent';
}

/**
 * Material 3 Expressive easing curves
 */
export const MATERIAL3_EASING = {
  standard: 'cubic-bezier(0.2, 0.0, 0, 1.0)',
  emphasized: 'cubic-bezier(0.05, 0.7, 0.1, 1.0)',
  decelerated: 'cubic-bezier(0.0, 0.0, 0.2, 1.0)',
  accelerated: 'cubic-bezier(0.4, 0.0, 1, 1.0)',
  expressive: 'cubic-bezier(0.4, 0.0, 0.2, 1.0)',
  organic: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
} as const;

/**
 * Material 3 Expressive duration tokens
 */
export const MATERIAL3_DURATION = {
  short1: '50ms',
  short2: '100ms',
  short3: '150ms',
  short4: '200ms',
  medium1: '250ms',
  medium2: '300ms',
  medium3: '350ms',
  medium4: '400ms',
  long1: '450ms',
  long2: '500ms',
  long3: '550ms',
  long4: '600ms',
  extraLong1: '700ms',
  extraLong2: '800ms',
  extraLong3: '900ms',
  extraLong4: '1000ms',
} as const;

/**
 * Creates a shared element transition between two elements
 */
export function createSharedElementTransition(config: SharedElementTransition): Animation | null {
  const { element, targetElement, duration = MATERIAL3_DURATION.medium2, easing = MATERIAL3_EASING.emphasized } = config;
  
  if (!element || typeof element.animate !== 'function') {
    return null;
  }

  const startRect = element.getBoundingClientRect();
  const endRect = targetElement ? targetElement.getBoundingClientRect() : startRect;

  const deltaX = endRect.left - startRect.left;
  const deltaY = endRect.top - startRect.top;
  const deltaW = endRect.width / startRect.width;
  const deltaH = endRect.height / startRect.height;

  return element.animate([
    {
      transform: 'translate(0, 0) scale(1)',
      opacity: 1,
    },
    {
      transform: `translate(${deltaX}px, ${deltaY}px) scale(${deltaW}, ${deltaH})`,
      opacity: targetElement ? 1 : 0,
    }
  ], {
    duration: parseInt(duration),
    easing,
    fill: 'forwards',
  });
}

/**
 * Creates loading state animations with organic motion patterns
 */
export function createLoadingAnimation(element: HTMLElement, config: LoadingAnimationConfig): Animation | null {
  if (!element || typeof element.animate !== 'function') {
    return null;
  }

  const { type, duration = MATERIAL3_DURATION.long2, intensity = 'moderate' } = config;

  const intensityMultiplier = {
    subtle: 0.5,
    moderate: 1,
    prominent: 1.5,
  }[intensity];

  switch (type) {
    case 'pulse':
      return element.animate([
        { opacity: 0.6, transform: 'scale(1)' },
        { opacity: 1, transform: `scale(${1 + 0.05 * intensityMultiplier})` },
        { opacity: 0.6, transform: 'scale(1)' },
      ], {
        duration: parseInt(duration),
        easing: MATERIAL3_EASING.organic,
        iterations: Infinity,
      });

    case 'wave':
      return element.animate([
        { transform: 'translateX(-100%)', opacity: 0 },
        { transform: 'translateX(0%)', opacity: 0.8 },
        { transform: 'translateX(100%)', opacity: 0 },
      ], {
        duration: parseInt(duration) * 1.5,
        easing: MATERIAL3_EASING.emphasized,
        iterations: Infinity,
      });

    case 'skeleton':
      return element.animate([
        { backgroundPosition: '-200px 0' },
        { backgroundPosition: 'calc(200px + 100%) 0' },
      ], {
        duration: parseInt(duration),
        easing: MATERIAL3_EASING.standard,
        iterations: Infinity,
      });

    case 'spinner':
      return element.animate([
        { transform: 'rotate(0deg)' },
        { transform: 'rotate(360deg)' },
      ], {
        duration: parseInt(duration),
        easing: 'linear',
        iterations: Infinity,
      });

    case 'organic':
      return element.animate([
        { 
          transform: 'scale(1) rotate(0deg)',
          borderRadius: '50%',
          opacity: 0.8,
        },
        { 
          transform: `scale(${1.2 * intensityMultiplier}) rotate(180deg)`,
          borderRadius: '30%',
          opacity: 1,
        },
        { 
          transform: 'scale(1) rotate(360deg)',
          borderRadius: '50%',
          opacity: 0.8,
        },
      ], {
        duration: parseInt(duration) * 2,
        easing: MATERIAL3_EASING.organic,
        iterations: Infinity,
      });

    default:
      return null;
  }
}

/**
 * Creates micro-interactions for form validation and feedback
 */
export function createMicroInteraction(element: HTMLElement, config: MicroInteractionConfig): Animation | null {
  if (!element || typeof element.animate !== 'function') {
    return null;
  }

  const { animation, duration = MATERIAL3_DURATION.short4, intensity = 'moderate' } = config;

  const intensityMultiplier = {
    subtle: 0.5,
    moderate: 1,
    prominent: 1.5,
  }[intensity];

  switch (animation) {
    case 'scale':
      return element.animate([
        { transform: 'scale(1)' },
        { transform: `scale(${1 + 0.05 * intensityMultiplier})` },
        { transform: 'scale(1)' },
      ], {
        duration: parseInt(duration),
        easing: MATERIAL3_EASING.emphasized,
      });

    case 'ripple':
      const ripple = document.createElement('div');
      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: currentColor;
        opacity: 0.3;
        pointer-events: none;
        transform: scale(0);
        width: 100px;
        height: 100px;
        left: 50%;
        top: 50%;
        margin-left: -50px;
        margin-top: -50px;
      `;
      
      element.style.position = element.style.position || 'relative';
      element.appendChild(ripple);

      const rippleAnimation = ripple.animate([
        { transform: 'scale(0)', opacity: 0.3 },
        { transform: `scale(${2 * intensityMultiplier})`, opacity: 0 },
      ], {
        duration: parseInt(duration) * 2,
        easing: MATERIAL3_EASING.decelerated,
      });

      rippleAnimation.addEventListener('finish', () => {
        ripple.remove();
      });

      return rippleAnimation;

    case 'shake':
      return element.animate([
        { transform: 'translateX(0)' },
        { transform: `translateX(-${4 * intensityMultiplier}px)` },
        { transform: `translateX(${4 * intensityMultiplier}px)` },
        { transform: `translateX(-${2 * intensityMultiplier}px)` },
        { transform: `translateX(${2 * intensityMultiplier}px)` },
        { transform: 'translateX(0)' },
      ], {
        duration: parseInt(duration) * 2,
        easing: MATERIAL3_EASING.emphasized,
      });

    case 'bounce':
      return element.animate([
        { transform: 'translateY(0)' },
        { transform: `translateY(-${8 * intensityMultiplier}px)` },
        { transform: 'translateY(0)' },
        { transform: `translateY(-${4 * intensityMultiplier}px)` },
        { transform: 'translateY(0)' },
      ], {
        duration: parseInt(duration) * 3,
        easing: MATERIAL3_EASING.emphasized,
      });

    case 'glow':
      return element.animate([
        { boxShadow: '0 0 0 0 currentColor' },
        { boxShadow: `0 0 0 ${4 * intensityMultiplier}px currentColor` },
        { boxShadow: '0 0 0 0 currentColor' },
      ], {
        duration: parseInt(duration) * 2,
        easing: MATERIAL3_EASING.organic,
      });

    case 'slide':
      return element.animate([
        { transform: 'translateX(-100%)', opacity: 0 },
        { transform: 'translateX(0)', opacity: 1 },
      ], {
        duration: parseInt(duration),
        easing: MATERIAL3_EASING.emphasized,
      });

    default:
      return null;
  }
}

/**
 * Creates smooth page transitions with appropriate easing
 */
export function createPageTransition(
  exitElement: HTMLElement,
  enterElement: HTMLElement,
  direction: 'forward' | 'backward' = 'forward'
): Promise<void> {
  return new Promise((resolve) => {
    const duration = parseInt(MATERIAL3_DURATION.medium3);
    const easing = MATERIAL3_EASING.emphasized;

    const exitTransform = direction === 'forward' ? 'translateX(-100%)' : 'translateX(100%)';
    const enterTransform = direction === 'forward' ? 'translateX(100%)' : 'translateX(-100%)';

    // Exit animation
    const exitAnimation = exitElement.animate([
      { transform: 'translateX(0)', opacity: 1 },
      { transform: exitTransform, opacity: 0 },
    ], {
      duration,
      easing,
      fill: 'forwards',
    });

    // Enter animation
    enterElement.style.transform = enterTransform;
    enterElement.style.opacity = '0';
    
    const enterAnimation = enterElement.animate([
      { transform: enterTransform, opacity: 0 },
      { transform: 'translateX(0)', opacity: 1 },
    ], {
      duration,
      easing,
      fill: 'forwards',
      delay: duration * 0.1, // Slight overlap
    });

    enterAnimation.addEventListener('finish', () => {
      enterElement.style.transform = '';
      enterElement.style.opacity = '';
      resolve();
    });
  });
}

/**
 * Performance optimization utilities
 */
export class AnimationPerformanceManager {
  private static instance: AnimationPerformanceManager;
  private activeAnimations = new Set<Animation>();
  private performanceObserver?: PerformanceObserver;
  private frameRate = 60;
  private isReducedMotion = false;

  private constructor() {
    this.detectReducedMotion();
    this.setupPerformanceMonitoring();
  }

  static getInstance(): AnimationPerformanceManager {
    if (!AnimationPerformanceManager.instance) {
      AnimationPerformanceManager.instance = new AnimationPerformanceManager();
    }
    return AnimationPerformanceManager.instance;
  }

  private detectReducedMotion(): void {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.isReducedMotion = mediaQuery.matches;
      
      mediaQuery.addEventListener('change', (e) => {
        this.isReducedMotion = e.matches;
        if (this.isReducedMotion) {
          this.pauseAllAnimations();
        }
      });
    }
  }

  private setupPerformanceMonitoring(): void {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      this.performanceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'measure' && entry.name.includes('animation')) {
            // Monitor animation performance
            if (entry.duration > 16.67) { // More than one frame at 60fps
              console.warn(`Animation performance warning: ${entry.name} took ${entry.duration}ms`);
            }
          }
        });
      });

      try {
        this.performanceObserver.observe({ entryTypes: ['measure'] });
      } catch (e) {
        // Performance observer not supported
      }
    }
  }

  registerAnimation(animation: Animation): void {
    if (this.isReducedMotion) {
      animation.cancel();
      return;
    }

    this.activeAnimations.add(animation);
    
    animation.addEventListener('finish', () => {
      this.activeAnimations.delete(animation);
    });

    animation.addEventListener('cancel', () => {
      this.activeAnimations.delete(animation);
    });
  }

  pauseAllAnimations(): void {
    this.activeAnimations.forEach(animation => {
      animation.pause();
    });
  }

  resumeAllAnimations(): void {
    if (!this.isReducedMotion) {
      this.activeAnimations.forEach(animation => {
        animation.play();
      });
    }
  }

  getActiveAnimationCount(): number {
    return this.activeAnimations.size;
  }

  isReducedMotionPreferred(): boolean {
    return this.isReducedMotion;
  }

  optimizeForDevice(): AnimationConfig {
    // Detect device capabilities and adjust animation settings
    const isLowEndDevice = this.detectLowEndDevice();
    
    return {
      duration: isLowEndDevice ? MATERIAL3_DURATION.short2 : MATERIAL3_DURATION.medium2,
      easing: isLowEndDevice ? MATERIAL3_EASING.standard : MATERIAL3_EASING.emphasized,
    };
  }

  private detectLowEndDevice(): boolean {
    if (typeof navigator === 'undefined') return false;
    
    // Check for device memory API
    const deviceMemory = (navigator as any).deviceMemory;
    if (deviceMemory && deviceMemory < 4) {
      return true;
    }

    // Check for hardware concurrency
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
      return true;
    }

    return false;
  }
}

/**
 * Utility function to create optimized animations
 */
export function createOptimizedAnimation(
  element: HTMLElement,
  keyframes: Keyframe[],
  options: KeyframeAnimationOptions
): Animation | null {
  const performanceManager = AnimationPerformanceManager.getInstance();
  
  if (performanceManager.isReducedMotionPreferred()) {
    // Apply final state immediately for reduced motion
    const finalKeyframe = keyframes[keyframes.length - 1];
    Object.assign(element.style, finalKeyframe);
    return null;
  }

  const optimizedOptions = {
    ...performanceManager.optimizeForDevice(),
    ...options,
  };

  const animation = element.animate(keyframes, optimizedOptions);
  performanceManager.registerAnimation(animation);
  
  return animation;
}