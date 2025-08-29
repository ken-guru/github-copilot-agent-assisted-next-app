/**
 * Page Transition Animations for Next.js App Router
 * 
 * Provides smooth page transitions using Material 3 motion principles.
 * Includes route-based animations, shared element transitions, and
 * optimized performance for navigation flows.
 */

import { ANIMATION_DURATION, MATERIAL3_EASING, prefersReducedMotion } from './animation-utils';

export interface PageTransitionConfig {
  type: 'slide' | 'fade' | 'scale' | 'shared-element';
  direction?: 'left' | 'right' | 'up' | 'down';
  duration?: number;
  easing?: string;
  sharedElements?: string[];
}

export interface PageTransitionContext {
  fromRoute: string;
  toRoute: string;
  direction: 'forward' | 'back';
  isInitialLoad: boolean;
}

/**
 * Create page exit animation
 */
export function createPageExitAnimation(
  pageElement: HTMLElement,
  config: PageTransitionConfig,
  context: PageTransitionContext
): Animation {
  if (prefersReducedMotion()) {
    return pageElement.animate([
      { opacity: 1 },
      { opacity: 0 }
    ], {
      duration: ANIMATION_DURATION.short2,
      easing: 'ease-out',
      fill: 'forwards'
    });
  }

  const duration = config.duration || ANIMATION_DURATION.medium2;
  const easing = config.easing || MATERIAL3_EASING.emphasized;

  switch (config.type) {
    case 'slide':
      return createSlideExitAnimation(pageElement, config, duration, easing, context);
    case 'scale':
      return createScaleExitAnimation(pageElement, duration, easing);
    case 'shared-element':
      return createSharedElementExitAnimation(pageElement, config, duration, easing);
    default:
      return createFadeExitAnimation(pageElement, duration, easing);
  }
}

/**
 * Create page enter animation
 */
export function createPageEnterAnimation(
  pageElement: HTMLElement,
  config: PageTransitionConfig,
  context: PageTransitionContext
): Animation {
  if (prefersReducedMotion()) {
    return pageElement.animate([
      { opacity: 0 },
      { opacity: 1 }
    ], {
      duration: ANIMATION_DURATION.short2,
      easing: 'ease-in',
      fill: 'forwards'
    });
  }

  const duration = config.duration || ANIMATION_DURATION.medium2;
  const easing = config.easing || MATERIAL3_EASING.emphasized;

  switch (config.type) {
    case 'slide':
      return createSlideEnterAnimation(pageElement, config, duration, easing, context);
    case 'scale':
      return createScaleEnterAnimation(pageElement, duration, easing);
    case 'shared-element':
      return createSharedElementEnterAnimation(pageElement, config, duration, easing);
    default:
      return createFadeEnterAnimation(pageElement, duration, easing);
  }
}

/**
 * Slide exit animation
 */
function createSlideExitAnimation(
  element: HTMLElement,
  config: PageTransitionConfig,
  duration: number,
  easing: string,
  context: PageTransitionContext
): Animation {
  const direction = getSlideDirection(config.direction, context);
  
  const transforms = {
    left: 'translateX(-100%)',
    right: 'translateX(100%)',
    up: 'translateY(-100%)',
    down: 'translateY(100%)'
  };

  return element.animate([
    { 
      transform: 'translateX(0) translateY(0)', 
      opacity: 1 
    },
    { 
      transform: transforms[direction], 
      opacity: 0.8 
    }
  ], {
    duration,
    easing,
    fill: 'forwards'
  });
}

/**
 * Slide enter animation
 */
function createSlideEnterAnimation(
  element: HTMLElement,
  config: PageTransitionConfig,
  duration: number,
  easing: string,
  context: PageTransitionContext
): Animation {
  const direction = getSlideDirection(config.direction, context);
  
  const transforms = {
    left: 'translateX(100%)',
    right: 'translateX(-100%)',
    up: 'translateY(100%)',
    down: 'translateY(-100%)'
  };

  return element.animate([
    { 
      transform: transforms[direction], 
      opacity: 0.8 
    },
    { 
      transform: 'translateX(0) translateY(0)', 
      opacity: 1 
    }
  ], {
    duration,
    easing,
    fill: 'forwards'
  });
}

/**
 * Scale exit animation
 */
function createScaleExitAnimation(
  element: HTMLElement,
  duration: number,
  easing: string
): Animation {
  return element.animate([
    { 
      transform: 'scale(1)', 
      opacity: 1 
    },
    { 
      transform: 'scale(0.95)', 
      opacity: 0 
    }
  ], {
    duration,
    easing,
    fill: 'forwards'
  });
}

/**
 * Scale enter animation
 */
function createScaleEnterAnimation(
  element: HTMLElement,
  duration: number,
  easing: string
): Animation {
  return element.animate([
    { 
      transform: 'scale(1.05)', 
      opacity: 0 
    },
    { 
      transform: 'scale(1)', 
      opacity: 1 
    }
  ], {
    duration,
    easing,
    fill: 'forwards'
  });
}

/**
 * Fade exit animation
 */
function createFadeExitAnimation(
  element: HTMLElement,
  duration: number,
  easing: string
): Animation {
  return element.animate([
    { opacity: 1 },
    { opacity: 0 }
  ], {
    duration,
    easing,
    fill: 'forwards'
  });
}

/**
 * Fade enter animation
 */
function createFadeEnterAnimation(
  element: HTMLElement,
  duration: number,
  easing: string
): Animation {
  return element.animate([
    { opacity: 0 },
    { opacity: 1 }
  ], {
    duration,
    easing,
    fill: 'forwards'
  });
}

/**
 * Shared element exit animation
 */
function createSharedElementExitAnimation(
  element: HTMLElement,
  config: PageTransitionConfig,
  duration: number,
  easing: string
): Animation {
  // Mark shared elements for transition
  if (config.sharedElements) {
    config.sharedElements.forEach(selector => {
      const sharedElement = element.querySelector(selector);
      if (sharedElement instanceof HTMLElement) {
        sharedElement.style.viewTransitionName = selector.replace(/[^a-zA-Z0-9]/g, '');
      }
    });
  }

  return element.animate([
    { 
      transform: 'scale(1)', 
      opacity: 1 
    },
    { 
      transform: 'scale(0.98)', 
      opacity: 0.8 
    }
  ], {
    duration,
    easing,
    fill: 'forwards'
  });
}

/**
 * Shared element enter animation
 */
function createSharedElementEnterAnimation(
  element: HTMLElement,
  config: PageTransitionConfig,
  duration: number,
  easing: string
): Animation {
  // Mark shared elements for transition
  if (config.sharedElements) {
    config.sharedElements.forEach(selector => {
      const sharedElement = element.querySelector(selector);
      if (sharedElement instanceof HTMLElement) {
        sharedElement.style.viewTransitionName = selector.replace(/[^a-zA-Z0-9]/g, '');
      }
    });
  }

  return element.animate([
    { 
      transform: 'scale(1.02)', 
      opacity: 0.8 
    },
    { 
      transform: 'scale(1)', 
      opacity: 1 
    }
  ], {
    duration,
    easing,
    fill: 'forwards'
  });
}

/**
 * Get slide direction based on config and context
 */
function getSlideDirection(
  configDirection: string | undefined,
  context: PageTransitionContext
): 'left' | 'right' | 'up' | 'down' {
  if (configDirection) {
    return configDirection as 'left' | 'right' | 'up' | 'down';
  }

  // Auto-determine direction based on navigation
  if (context.direction === 'back') {
    return 'right'; // Slide from right when going back
  } else {
    return 'left'; // Slide from left when going forward
  }
}

/**
 * Create route-based transition configuration
 */
export function getRouteTransitionConfig(
  fromRoute: string,
  toRoute: string
): PageTransitionConfig {
  // Define route hierarchy for intelligent transitions
  const routeHierarchy = {
    '/': 0,
    '/activities': 1,
    '/activities/[id]': 2,
    '/settings': 1,
    '/profile': 1,
    '/help': 1
  };

  const fromLevel = routeHierarchy[fromRoute as keyof typeof routeHierarchy] || 1;
  const toLevel = routeHierarchy[toRoute as keyof typeof routeHierarchy] || 1;

  // Deeper level = slide left, shallower = slide right
  if (toLevel > fromLevel) {
    return {
      type: 'slide',
      direction: 'left',
      duration: ANIMATION_DURATION.medium2
    };
  } else if (toLevel < fromLevel) {
    return {
      type: 'slide',
      direction: 'right',
      duration: ANIMATION_DURATION.medium2
    };
  }

  // Same level = fade transition
  return {
    type: 'fade',
    duration: ANIMATION_DURATION.short4
  };
}

/**
 * Page transition coordinator for Next.js App Router
 */
export class PageTransitionCoordinator {
  private currentTransition: Animation | null = null;
  private isTransitioning = false;

  /**
   * Execute page transition
   */
  async executeTransition(
    fromElement: HTMLElement | null,
    toElement: HTMLElement,
    context: PageTransitionContext,
    config?: PageTransitionConfig
  ): Promise<void> {
    if (this.isTransitioning) {
      return;
    }

    this.isTransitioning = true;
    const transitionConfig = config || getRouteTransitionConfig(context.fromRoute, context.toRoute);

    try {
      // Prepare new page
      toElement.style.pointerEvents = 'none';
      
      if (fromElement && !context.isInitialLoad) {
        // Run exit and enter animations in parallel
        const exitAnimation = createPageExitAnimation(fromElement, transitionConfig, context);
        const enterAnimation = createPageEnterAnimation(toElement, transitionConfig, context);

        await Promise.all([
          exitAnimation.finished,
          enterAnimation.finished
        ]);
      } else {
        // Initial load - just run enter animation
        const enterAnimation = createPageEnterAnimation(toElement, transitionConfig, context);
        await enterAnimation.finished;
      }

      // Re-enable interactions
      toElement.style.pointerEvents = '';
    } finally {
      this.isTransitioning = false;
      this.currentTransition = null;
    }
  }

  /**
   * Cancel current transition
   */
  cancelTransition(): void {
    if (this.currentTransition) {
      this.currentTransition.cancel();
      this.currentTransition = null;
    }
    this.isTransitioning = false;
  }

  /**
   * Check if transition is active
   */
  get isActive(): boolean {
    return this.isTransitioning;
  }
}

/**
 * Global page transition coordinator instance
 */
export const pageTransitionCoordinator = new PageTransitionCoordinator();

/**
 * View Transitions API support (when available)
 */
export function supportsViewTransitions(): boolean {
  return typeof document !== 'undefined' && 'startViewTransition' in document;
}

/**
 * Execute transition using View Transitions API
 */
export async function executeViewTransition(
  updateCallback: () => void | Promise<void>
): Promise<void> {
  if (!supportsViewTransitions()) {
    await updateCallback();
    return;
  }

  const transition = (document as any).startViewTransition(updateCallback);
  await transition.finished;
}