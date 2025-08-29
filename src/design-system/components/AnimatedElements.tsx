/**
 * Material 3 Animation Components
 * React components and hooks for entrance/exit animations
 */

'use client';

import React from 'react';
import {
  Material3AnimationPresets,
  Material3Performance,
  Material3Duration,
  Material3Easing,
  AnimationPreset
} from '../utils/motion';

export interface AnimationConfig {
  preset?: AnimationPreset;
  duration?: number;
  easing?: string;
  delay?: number;
  custom?: {
    from: Record<string, string | number>;
    to: Record<string, string | number>;
  };
}

export interface AnimatedElementProps {
  children: React.ReactNode;
  animation?: AnimationConfig;
  trigger?: 'mount' | 'visible' | 'hover' | 'manual';
  className?: string;
  style?: React.CSSProperties;
  onAnimationStart?: () => void;
  onAnimationEnd?: () => void;
  as?: React.ElementType;
}

/**
 * Custom hook for managing element animations
 */
export function useAnimation(config: AnimationConfig = {}) {
  const [isAnimating, setIsAnimating] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState(false);
  const elementRef = React.useRef<HTMLDivElement>(null);
  const animationRef = React.useRef<Animation | null>(null);

  const animate = React.useCallback(
    (direction: 'enter' | 'exit' = 'enter') => {
      if (!elementRef.current || isAnimating) return Promise.resolve();

      const element = elementRef.current;
      setIsAnimating(true);

      let keyframes: Keyframe[];
      let animationConfig = config;

      if (config.preset) {
        const preset = Material3AnimationPresets[config.preset];
        if ('from' in preset && 'to' in preset) {
          keyframes = direction === 'enter' 
            ? [preset.from as Keyframe, preset.to as Keyframe]
            : [preset.to as Keyframe, preset.from as Keyframe];
          animationConfig = { ...config, ...preset.config };
        } else {
          // For keyframe-based presets like pulse, spin
          keyframes = Object.entries(preset as Record<string, Record<string, string>>)
            .map(([offset, styles]) => ({ offset: parseFloat(offset.replace('%', '')) / 100, ...styles }));
        }
      } else if (config.custom) {
        keyframes = direction === 'enter'
          ? [config.custom.from as Keyframe, config.custom.to as Keyframe]
          : [config.custom.to as Keyframe, config.custom.from as Keyframe];
      } else {
        // Default fade animation
        keyframes = direction === 'enter'
          ? [{ opacity: 0 }, { opacity: 1 }]
          : [{ opacity: 1 }, { opacity: 0 }];
      }

      const options: KeyframeAnimationOptions = {
        duration: Material3Performance.getDuration(
          animationConfig.duration || Material3Duration.medium2
        ),
        easing: Material3Performance.getEasing(
          animationConfig.easing || Material3Easing.standard
        ),
        delay: animationConfig.delay || 0,
        fill: 'forwards'
      };

      return new Promise<void>((resolve) => {
        const animation = Material3Performance.animate(element, keyframes, options);
        animationRef.current = animation;

        animation.addEventListener('finish', () => {
          setIsAnimating(false);
          setIsVisible(direction === 'enter');
          animationRef.current = null;
          resolve();
        });

        animation.addEventListener('cancel', () => {
          setIsAnimating(false);
          animationRef.current = null;
          resolve();
        });
      });
    },
    [config, isAnimating]
  );

  const enter = React.useCallback(() => animate('enter'), [animate]);
  const exit = React.useCallback(() => animate('exit'), [animate]);

  const cancel = React.useCallback(() => {
    if (animationRef.current) {
      animationRef.current.cancel();
    }
  }, []);

  return {
    elementRef,
    isAnimating,
    isVisible,
    enter,
    exit,
    cancel
  };
}

/**
 * Hook for intersection-based animations
 */
export function useIntersectionAnimation(
  config: AnimationConfig = {},
  options: IntersectionObserverInit = {}
) {
  const [hasAnimated, setHasAnimated] = React.useState(false);
  const { elementRef, enter, isVisible } = useAnimation(config);

  React.useEffect(() => {
    const element = elementRef.current;
    if (!element || hasAnimated) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting && !hasAnimated) {
          enter().then(() => setHasAnimated(true));
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [enter, hasAnimated, options]);

  return {
    elementRef,
    isVisible,
    hasAnimated
  };
}

/**
 * Animated wrapper component
 */
export const AnimatedElement: React.FC<AnimatedElementProps> = ({
  children,
  animation = {},
  trigger = 'mount',
  className = '',
  style = {},
  onAnimationStart,
  onAnimationEnd,
  as: Component = 'div'
}) => {
  const { elementRef, enter, exit, isVisible } = useAnimation(animation);
  const { elementRef: intersectionRef } = useIntersectionAnimation(
    animation,
    trigger === 'visible' ? {} : undefined
  );

  // Use the appropriate ref based on trigger
  const ref = trigger === 'visible' ? intersectionRef : elementRef;

  React.useEffect(() => {
    if (trigger === 'mount') {
      onAnimationStart?.();
      enter().then(() => onAnimationEnd?.());
    }
  }, [trigger, enter, onAnimationStart, onAnimationEnd]);

  const handleMouseEnter = () => {
    if (trigger === 'hover') {
      onAnimationStart?.();
      enter().then(() => onAnimationEnd?.());
    }
  };

  const handleMouseLeave = () => {
    if (trigger === 'hover') {
      exit();
    }
  };

  return (
    React.createElement(
      Component,
      {
        ref,
        className,
        style: {
          ...style,
          // Set initial visibility for mount animations
          opacity: trigger === 'mount' ? 0 : undefined
        },
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave
      },
      children
    )
  );
};

/**
 * Fade transition component
 */
export const FadeTransition: React.FC<{
  show: boolean;
  children: React.ReactNode;
  duration?: number;
  className?: string;
}> = ({ show, children, duration = Material3Duration.medium2, className = '' }) => {
  const [shouldRender, setShouldRender] = React.useState(show);
  const { elementRef, enter, exit } = useAnimation({
    preset: 'fadeIn',
    duration
  });

  React.useEffect(() => {
    if (show) {
      setShouldRender(true);
      // Small delay to ensure element is rendered
      setTimeout(() => {
        enter();
      }, 10);
    } else {
      exit().then(() => {
        setShouldRender(false);
      });
    }
  }, [show, enter, exit]);

  if (!shouldRender) return null;

  return (
    <div ref={elementRef} className={className} style={{ opacity: 0 }}>
      {children}
    </div>
  );
};

/**
 * Scale transition component
 */
export const ScaleTransition: React.FC<{
  show: boolean;
  children: React.ReactNode;
  duration?: number;
  className?: string;
}> = ({ show, children, duration = Material3Duration.medium2, className = '' }) => {
  const [shouldRender, setShouldRender] = React.useState(show);
  const { elementRef, enter, exit } = useAnimation({
    preset: 'scaleIn',
    duration
  });

  React.useEffect(() => {
    if (show) {
      setShouldRender(true);
      setTimeout(() => {
        enter();
      }, 10);
    } else {
      exit().then(() => {
        setShouldRender(false);
      });
    }
  }, [show, enter, exit]);

  if (!shouldRender) return null;

  return (
    <div 
      ref={elementRef} 
      className={className} 
      style={{ 
        opacity: 0, 
        transform: 'scale(0.8)',
        transformOrigin: 'center'
      }}
    >
      {children}
    </div>
  );
};

/**
 * Slide transition component
 */
export const SlideTransition: React.FC<{
  show: boolean;
  direction: 'up' | 'down' | 'left' | 'right';
  children: React.ReactNode;
  duration?: number;
  className?: string;
}> = ({ 
  show, 
  direction, 
  children, 
  duration = Material3Duration.medium2, 
  className = '' 
}) => {
  const [shouldRender, setShouldRender] = React.useState(show);
  
  const presetMap = {
    up: 'slideInUp',
    down: 'slideInDown',
    left: 'slideInLeft',
    right: 'slideInRight'
  } as const;

  const { elementRef, enter, exit } = useAnimation({
    preset: presetMap[direction],
    duration
  });

  React.useEffect(() => {
    if (show) {
      setShouldRender(true);
      setTimeout(() => {
        enter();
      }, 10);
    } else {
      exit().then(() => {
        setShouldRender(false);
      });
    }
  }, [show, enter, exit]);

  if (!shouldRender) return null;

  const getInitialTransform = () => {
    switch (direction) {
      case 'up': return 'translateY(24px)';
      case 'down': return 'translateY(-24px)';
      case 'left': return 'translateX(-24px)';
      case 'right': return 'translateX(24px)';
    }
  };

  return (
    <div 
      ref={elementRef} 
      className={className} 
      style={{ 
        opacity: 0, 
        transform: getInitialTransform()
      }}
    >
      {children}
    </div>
  );
};

/**
 * Staggered animation container
 */
export const StaggeredContainer: React.FC<{
  children: React.ReactElement[];
  staggerDelay?: number;
  animation?: AnimationConfig;
  className?: string;
}> = ({ 
  children, 
  staggerDelay = 100, 
  animation = { preset: 'fadeIn' },
  className = '' 
}) => {
  return (
    <div className={className}>
      {React.Children.map(children, (child, index) => (
        <AnimatedElement
          key={index}
          animation={{
            ...animation,
            delay: index * staggerDelay
          }}
          trigger="visible"
        >
          {child}
        </AnimatedElement>
      ))}
    </div>
  );
};

/**
 * Page transition wrapper
 */
export const PageTransition: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <AnimatedElement
      animation={{
        preset: 'fadeIn',
        duration: Material3Duration.medium3
      }}
      trigger="mount"
      className={className}
    >
      {children}
    </AnimatedElement>
  );
};