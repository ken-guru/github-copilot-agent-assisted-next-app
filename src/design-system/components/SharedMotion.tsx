/**
 * Material 3 Shared Motion Components and Animation Hooks
 * Reusable animation components and consistent motion patterns
 */

'use client';

import React from 'react';
import {
  Material3Performance,
  Material3Duration,
  Material3Easing,
  Material3Animations,
  Material3StateTransition
} from '../utils/motion';

export type MotionPreset = 'enterFromTop' | 'enterFromBottom' | 'enterFromLeft' | 'enterFromRight' | 
                         'exitToTop' | 'exitToBottom' | 'exitToLeft' | 'exitToRight' |
                         'fadeIn' | 'fadeOut' | 'scaleIn' | 'scaleOut' | 'slideUp' | 'slideDown';

export type AnimationTiming = 'short1' | 'short2' | 'medium1' | 'medium2' | 'long1' | 'long2' | 'extraLong1' | 'extraLong2';

export interface MotionConfig {
  preset?: MotionPreset;
  duration?: AnimationTiming;
  delay?: number;
  easing?: keyof typeof Material3Easing;
  stagger?: number;
  once?: boolean;
}

/**
 * Central motion manager hook for consistent animations
 */
export function useMotionManager() {
  const [animationQueue, setAnimationQueue] = React.useState<Array<{
    id: string;
    element: HTMLElement;
    config: MotionConfig;
    callback?: () => void;
  }>>([]);

  const registerAnimation = React.useCallback((
    element: HTMLElement,
    config: MotionConfig,
    callback?: () => void
  ) => {
    const id = `motion_${Date.now()}_${Math.random()}`;
    
    setAnimationQueue(prev => [...prev, {
      id,
      element,
      config,
      callback
    }]);

    return id;
  }, []);

  const executeAnimation = React.useCallback((
    element: HTMLElement,
    config: MotionConfig,
    callback?: () => void
  ) => {
    if (Material3Performance.respectsReducedMotion()) {
      callback?.();
      return;
    }

    const durationKey = config.duration || 'medium2';
    const duration = Material3Duration[durationKey];
    const easing = config.easing ? Material3Easing[config.easing] : Material3Easing.standard;
    const delay = config.delay || 0;

    // Create simple animation based on preset
    const getTransform = (preset: MotionPreset) => {
      switch (preset) {
        case 'fadeIn':
          return { from: { opacity: '0' }, to: { opacity: '1' } };
        case 'fadeOut':
          return { from: { opacity: '1' }, to: { opacity: '0' } };
        case 'scaleIn':
          return { from: { transform: 'scale(0.8)', opacity: '0' }, to: { transform: 'scale(1)', opacity: '1' } };
        case 'scaleOut':
          return { from: { transform: 'scale(1)', opacity: '1' }, to: { transform: 'scale(0.8)', opacity: '0' } };
        case 'slideUp':
          return { from: { transform: 'translateY(20px)', opacity: '0' }, to: { transform: 'translateY(0)', opacity: '1' } };
        case 'slideDown':
          return { from: { transform: 'translateY(-20px)', opacity: '0' }, to: { transform: 'translateY(0)', opacity: '1' } };
        case 'enterFromTop':
          return { from: { transform: 'translateY(-100%)', opacity: '0' }, to: { transform: 'translateY(0)', opacity: '1' } };
        case 'enterFromBottom':
          return { from: { transform: 'translateY(100%)', opacity: '0' }, to: { transform: 'translateY(0)', opacity: '1' } };
        case 'enterFromLeft':
          return { from: { transform: 'translateX(-100%)', opacity: '0' }, to: { transform: 'translateX(0)', opacity: '1' } };
        case 'enterFromRight':
          return { from: { transform: 'translateX(100%)', opacity: '0' }, to: { transform: 'translateX(0)', opacity: '1' } };
        default:
          return { from: { opacity: '0' }, to: { opacity: '1' } };
      }
    };

    const animation = getTransform(config.preset || 'fadeIn');

    // Apply initial state
    Object.assign(element.style, animation.from);
    
    requestAnimationFrame(() => {
      element.style.transition = `all ${duration}ms ${easing}`;
      if (delay > 0) {
        element.style.transitionDelay = `${delay}ms`;
      }
      
      Object.assign(element.style, animation.to);
      
      setTimeout(() => {
        element.style.transition = '';
        element.style.transitionDelay = '';
        callback?.();
      }, duration + delay);
    });
  }, []);

  const cancelAnimation = React.useCallback((id: string) => {
    setAnimationQueue(prev => prev.filter(item => item.id !== id));
  }, []);

  const playSequence = React.useCallback((sequence: Array<{
    element: HTMLElement;
    config: MotionConfig;
    callback?: () => void;
  }>) => {
    sequence.forEach((item, index) => {
      const staggerDelay = (item.config.stagger || 0) * index;
      const totalDelay = (item.config.delay || 0) + staggerDelay;
      
      setTimeout(() => {
        executeAnimation(item.element, {
          ...item.config,
          delay: totalDelay
        }, item.callback);
      }, totalDelay);
    });
  }, [executeAnimation]);

  return {
    registerAnimation,
    executeAnimation,
    cancelAnimation,
    playSequence
  };
}

/**
 * Enhanced motion component with preset support
 */
export const MotionContainer: React.FC<{
  children: React.ReactNode;
  preset?: MotionPreset;
  duration?: AnimationTiming;
  delay?: number;
  easing?: keyof typeof Material3Easing;
  trigger?: boolean;
  once?: boolean;
  className?: string;
  onAnimationComplete?: () => void;
}> = ({
  children,
  preset = 'fadeIn',
  duration = 'medium2',
  delay = 0,
  easing = 'standard',
  trigger = true,
  once = false,
  className = '',
  onAnimationComplete
}) => {
  const elementRef = React.useRef<HTMLDivElement>(null);
  const hasAnimated = React.useRef(false);
  const { executeAnimation } = useMotionManager();

  React.useEffect(() => {
    if (trigger && elementRef.current) {
      if (once && hasAnimated.current) return;
      
      executeAnimation(
        elementRef.current,
        { preset, duration, delay, easing },
        () => {
          hasAnimated.current = true;
          onAnimationComplete?.();
        }
      );
    }
  }, [trigger, preset, duration, delay, easing, once, executeAnimation, onAnimationComplete]);

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
};

/**
 * Staggered animation container for lists
 */
export const StaggeredList: React.FC<{
  children: React.ReactNode[];
  stagger?: number;
  preset?: MotionPreset;
  duration?: AnimationTiming;
  delay?: number;
  className?: string;
  itemClassName?: string;
}> = ({
  children,
  stagger = 100,
  preset = 'fadeIn',
  duration = 'medium2',
  delay = 0,
  className = '',
  itemClassName = ''
}) => {
  const listRef = React.useRef<HTMLDivElement>(null);
  const { playSequence } = useMotionManager();

  React.useEffect(() => {
    if (listRef.current) {
      const items = Array.from(listRef.current.children) as HTMLElement[];
      
      const sequence = items.map((element) => ({
        element,
        config: { preset, duration, delay, stagger }
      }));

      playSequence(sequence);
    }
  }, [children, stagger, preset, duration, delay, playSequence]);

  return (
    <div ref={listRef} className={className}>
      {children.map((child, index) => (
        <div key={index} className={itemClassName}>
          {child}
        </div>
      ))}
    </div>
  );
};

/**
 * Page transition component with route-based animations
 */
export const PageTransition: React.FC<{
  children: React.ReactNode;
  direction?: 'forward' | 'backward';
  type?: 'slide' | 'fade' | 'scale';
  className?: string;
}> = ({
  children,
  direction = 'forward',
  type = 'slide',
  className = ''
}) => {
  const pageRef = React.useRef<HTMLDivElement>(null);
  const { executeAnimation } = useMotionManager();

  const getTransitionPreset = (): MotionPreset => {
    if (type === 'fade') return 'fadeIn';
    if (type === 'scale') return 'scaleIn';
    
    // Slide transitions based on direction
    return direction === 'forward' ? 'enterFromRight' : 'enterFromLeft';
  };

  React.useEffect(() => {
    if (pageRef.current) {
      executeAnimation(pageRef.current, {
        preset: getTransitionPreset(),
        duration: 'medium2',
        easing: 'decelerated'
      });
    }
  }, [direction, type, executeAnimation]);

  return (
    <div ref={pageRef} className={`w-full h-full ${className}`}>
      {children}
    </div>
  );
};

/**
 * Intersection observer hook for scroll-triggered animations
 */
export function useScrollAnimation(
  options: IntersectionObserverInit = {}
) {
  const [isVisible, setIsVisible] = React.useState(false);
  const [hasAnimated, setHasAnimated] = React.useState(false);
  const elementRef = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry && entry.isIntersecting && !hasAnimated) {
          setIsVisible(true);
          setHasAnimated(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options
      }
    );

    const element = elementRef.current;
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [hasAnimated, options]);

  return { elementRef, isVisible, hasAnimated };
}

/**
 * Scroll-triggered animation component
 */
export const ScrollReveal: React.FC<{
  children: React.ReactNode;
  preset?: MotionPreset;
  duration?: AnimationTiming;
  delay?: number;
  threshold?: number;
  once?: boolean;
  className?: string;
}> = ({
  children,
  preset = 'slideUp',
  duration = 'medium2',
  delay = 0,
  threshold = 0.1,
  once = true,
  className = ''
}) => {
  const { elementRef, isVisible } = useScrollAnimation({
    threshold,
    rootMargin: '50px'
  });

  return (
    <MotionContainer
      preset={preset}
      duration={duration}
      delay={delay}
      trigger={isVisible}
      once={once}
      className={className}
    >
      <div ref={elementRef as React.RefObject<HTMLDivElement>}>
        {children}
      </div>
    </MotionContainer>
  );
};

/**
 * Parallax scroll component for subtle motion
 */
export const ParallaxElement: React.FC<{
  children: React.ReactNode;
  speed?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  className?: string;
}> = ({
  children,
  speed = 0.5,
  direction = 'up',
  className = ''
}) => {
  const elementRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (Material3Performance.respectsReducedMotion()) return;

    const handleScroll = () => {
      if (!elementRef.current) return;

      const rect = elementRef.current.getBoundingClientRect();
      const scrolled = window.pageYOffset;
      const viewport = window.innerHeight;
      
      if (rect.bottom >= 0 && rect.top <= viewport) {
        const yPos = -(scrolled * speed);
        
        let transform = '';
        switch (direction) {
          case 'up':
            transform = `translateY(${yPos}px)`;
            break;
          case 'down':
            transform = `translateY(${-yPos}px)`;
            break;
          case 'left':
            transform = `translateX(${yPos}px)`;
            break;
          case 'right':
            transform = `translateX(${-yPos}px)`;
            break;
        }

        elementRef.current.style.transform = transform;
      }
    };

    // Simple throttle implementation
    let timeoutId: NodeJS.Timeout | null = null;
    const throttledScroll = () => {
      if (timeoutId) return;
      timeoutId = setTimeout(() => {
        handleScroll();
        timeoutId = null;
      }, 16);
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', throttledScroll);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [speed, direction]);

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
};

/**
 * Morphing component for smooth shape transitions
 */
export const MorphingShape: React.FC<{
  from: React.ReactNode;
  to: React.ReactNode;
  trigger: boolean;
  duration?: AnimationTiming;
  className?: string;
}> = ({
  from,
  to,
  trigger,
  duration = 'medium',
  className = ''
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [currentShape, setCurrentShape] = React.useState<'from' | 'to'>('from');

  React.useEffect(() => {
    if (!containerRef.current) return;

    const element = containerRef.current;
    const durationMs = Material3Duration[duration as keyof typeof Material3Duration];

    if (Material3Performance.respectsReducedMotion()) {
      setCurrentShape(trigger ? 'to' : 'from');
      return;
    }

    // Smooth transition between shapes
    element.style.transition = `all ${durationMs}ms ${Material3Easing.emphasized}`;
    element.style.opacity = '0';
    element.style.transform = 'scale(0.8)';

    setTimeout(() => {
      setCurrentShape(trigger ? 'to' : 'from');
      element.style.opacity = '1';
      element.style.transform = 'scale(1)';
    }, durationMs / 2);

    setTimeout(() => {
      element.style.transition = '';
    }, durationMs);
  }, [trigger, duration]);

  return (
    <div ref={containerRef} className={className}>
      {currentShape === 'from' ? from : to}
    </div>
  );
};

/**
 * Layout animation hook for smooth layout changes
 */
export function useLayoutAnimation<T extends HTMLElement>() {
  const elementRef = React.useRef<T>(null);
  const previousRect = React.useRef<DOMRect | null>(null);

  const animateLayout = React.useCallback(() => {
    if (!elementRef.current || Material3Performance.respectsReducedMotion()) return;

    const element = elementRef.current;
    const currentRect = element.getBoundingClientRect();

    if (previousRect.current) {
      const deltaX = previousRect.current.left - currentRect.left;
      const deltaY = previousRect.current.top - currentRect.top;
      const deltaW = previousRect.current.width / currentRect.width;
      const deltaH = previousRect.current.height / currentRect.height;

      // Apply FLIP animation
      element.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${deltaW}, ${deltaH})`;
      element.style.transition = 'none';

      requestAnimationFrame(() => {
        element.style.transition = `transform ${Material3Duration.medium2}ms ${Material3Easing.emphasized}`;
        element.style.transform = 'none';
      });
    }

    previousRect.current = currentRect;
  }, []);

  React.useLayoutEffect(() => {
    animateLayout();
  });

  return { elementRef, animateLayout };
}

/**
 * Shared layout animation component
 */
export const LayoutTransition: React.FC<{
  children: React.ReactNode;
  layoutId?: string;
  className?: string;
}> = ({ children, layoutId, className = '' }) => {
  const { elementRef, animateLayout } = useLayoutAnimation<HTMLDivElement>();

  React.useEffect(() => {
    animateLayout();
  }, [children, animateLayout]);

  return (
    <div
      ref={elementRef}
      data-layout-id={layoutId}
      className={className}
    >
      {children}
    </div>
  );
};

/**
 * Export all motion utilities for easy access
 */
export {
  Material3Performance,
  Material3Duration,
  Material3Easing,
  Material3Animations,
  Material3StateTransition
} from '../utils/motion';