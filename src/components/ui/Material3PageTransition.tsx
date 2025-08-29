/**
 * Material 3 Page Transition Component
 * Implements smooth page transitions with Material 3 Expressive motion
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useAnimations } from '../../hooks/useAnimations';
import styles from './Material3PageTransition.module.css';

export interface Material3PageTransitionProps {
  children: React.ReactNode;
  transitionKey: string;
  direction?: 'forward' | 'backward' | 'up' | 'down';
  duration?: 'short' | 'medium' | 'long';
  easing?: 'standard' | 'emphasized' | 'decelerated' | 'accelerated';
  className?: string;
  onTransitionStart?: () => void;
  onTransitionEnd?: () => void;
}

export const Material3PageTransition: React.FC<Material3PageTransitionProps> = ({
  children,
  transitionKey,
  direction = 'forward',
  duration = 'medium',
  easing = 'emphasized',
  className,
  onTransitionStart,
  onTransitionEnd,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentKey, setCurrentKey] = useState(transitionKey);
  const [previousChildren, setPreviousChildren] = useState<React.ReactNode>(null);
  const { isReducedMotion } = useAnimations();

  const performTransition = useCallback(async () => {
    if (!containerRef.current || isReducedMotion) {
      setCurrentKey(transitionKey);
      setPreviousChildren(null);
      return;
    }

    setIsTransitioning(true);
    onTransitionStart?.();

    const container = containerRef.current;
    const exitElement = container.querySelector('[data-transition="exit"]') as HTMLElement;
    const enterElement = container.querySelector('[data-transition="enter"]') as HTMLElement;

    if (exitElement && enterElement) {
      // Apply transition classes
      exitElement.classList.add(styles[`exit${direction.charAt(0).toUpperCase() + direction.slice(1)}`]);
      enterElement.classList.add(styles[`enter${direction.charAt(0).toUpperCase() + direction.slice(1)}`]);
      
      // Apply duration and easing
      const durationClass = styles[`duration${duration.charAt(0).toUpperCase() + duration.slice(1)}`];
      const easingClass = styles[`easing${easing.charAt(0).toUpperCase() + easing.slice(1)}`];
      
      exitElement.classList.add(durationClass, easingClass);
      enterElement.classList.add(durationClass, easingClass);

      // Wait for animation to complete
      await new Promise<void>((resolve) => {
        const handleTransitionEnd = () => {
          enterElement.removeEventListener('transitionend', handleTransitionEnd);
          resolve();
        };
        enterElement.addEventListener('transitionend', handleTransitionEnd);
        
        // Fallback timeout
        setTimeout(resolve, 600);
      });
    }

    setIsTransitioning(false);
    setPreviousChildren(null);
    setCurrentKey(transitionKey);
    onTransitionEnd?.();
  }, [transitionKey, direction, duration, easing, isReducedMotion, onTransitionStart, onTransitionEnd]);

  useEffect(() => {
    if (transitionKey !== currentKey) {
      setPreviousChildren(children);
      performTransition();
    }
  }, [transitionKey, currentKey, children, performTransition]);

  const containerClasses = [
    styles.container,
    isTransitioning && styles.transitioning,
    styles[`direction${direction.charAt(0).toUpperCase() + direction.slice(1)}`],
    className,
  ].filter(Boolean).join(' ');

  if (isReducedMotion) {
    return (
      <div ref={containerRef} className={containerClasses}>
        {children}
      </div>
    );
  }

  return (
    <div ref={containerRef} className={containerClasses}>
      {isTransitioning && previousChildren && (
        <div className={styles.page} data-transition="exit">
          {previousChildren}
        </div>
      )}
      <div 
        className={styles.page} 
        data-transition={isTransitioning ? "enter" : "current"}
      >
        {children}
      </div>
    </div>
  );
};

/**
 * Hook for managing page transitions
 */
export function usePageTransition() {
  const [transitionKey, setTransitionKey] = useState(() => Math.random().toString(36));
  const [isTransitioning, setIsTransitioning] = useState(false);

  const triggerTransition = useCallback((newKey?: string) => {
    setTransitionKey(newKey || Math.random().toString(36));
  }, []);

  const handleTransitionStart = useCallback(() => {
    setIsTransitioning(true);
  }, []);

  const handleTransitionEnd = useCallback(() => {
    setIsTransitioning(false);
  }, []);

  return {
    transitionKey,
    isTransitioning,
    triggerTransition,
    handleTransitionStart,
    handleTransitionEnd,
  };
}

/**
 * Shared Element Transition Component
 */
export interface SharedElementTransitionProps {
  children: React.ReactNode;
  elementId: string;
  className?: string;
}

export const SharedElementTransition: React.FC<SharedElementTransitionProps> = ({
  children,
  elementId,
  className,
}) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const { createSharedTransition } = useAnimations();

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Find matching element with same ID
    const targetElement = document.querySelector(`[data-shared-element="${elementId}"]`) as HTMLElement;
    
    if (targetElement && targetElement !== element) {
      createSharedTransition({
        element,
        targetElement,
      });
    }
  }, [elementId, createSharedTransition]);

  return (
    <div 
      ref={elementRef}
      className={className}
      data-shared-element={elementId}
    >
      {children}
    </div>
  );
};