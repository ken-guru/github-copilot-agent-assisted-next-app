/**
 * React Hook for Page Transitions
 * 
 * Provides easy integration of page transitions with Next.js App Router.
 * Handles route changes, loading states, and animation coordination.
 */

'use client';

import { useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { 
  PageTransitionConfig, 
  PageTransitionContext,
  pageTransitionCoordinator,
  getRouteTransitionConfig,
  executeViewTransition
} from '../utils/page-transition-animations';

export interface UsePageTransitionsOptions {
  config?: PageTransitionConfig;
  disabled?: boolean;
  onTransitionStart?: (context: PageTransitionContext) => void;
  onTransitionComplete?: (context: PageTransitionContext) => void;
}

/**
 * Hook for managing page transitions in Next.js App Router
 */
export function usePageTransitions(options: UsePageTransitionsOptions = {}) {
  const pathname = usePathname();
  const prevPathnameRef = useRef<string | undefined>(undefined);
  const pageElementRef = useRef<HTMLElement | null>(null);
  const isInitialLoadRef = useRef(true);

  const {
    config,
    disabled = false,
    onTransitionStart,
    onTransitionComplete
  } = options;

  /**
   * Execute page transition
   */
  const executeTransition = useCallback(async (
    fromRoute: string,
    toRoute: string,
    direction: 'forward' | 'back' = 'forward'
  ) => {
    if (disabled || !pageElementRef.current) return;

    const context: PageTransitionContext = {
      fromRoute,
      toRoute,
      direction,
      isInitialLoad: isInitialLoadRef.current
    };

    const transitionConfig = config || getRouteTransitionConfig(fromRoute, toRoute);

    try {
      onTransitionStart?.(context);

      await pageTransitionCoordinator.executeTransition(
        null, // fromElement handled by Next.js
        pageElementRef.current,
        context,
        transitionConfig
      );

      onTransitionComplete?.(context);
    } catch (error) {
      console.warn('Page transition failed:', error);
    }
  }, [config, disabled, onTransitionStart, onTransitionComplete]);

  /**
   * Handle route changes
   */
  useEffect(() => {
    if (isInitialLoadRef.current) {
      isInitialLoadRef.current = false;
      prevPathnameRef.current = pathname;
      return;
    }

    if (prevPathnameRef.current && prevPathnameRef.current !== pathname) {
      const fromRoute = prevPathnameRef.current;
      const toRoute = pathname;
      
      // Determine direction based on browser history
      const direction = window.history.state?.direction || 'forward';
      
      executeTransition(fromRoute, toRoute, direction);
    }

    prevPathnameRef.current = pathname;
  }, [pathname, executeTransition]);

  /**
   * Set page element reference
   */
  const setPageElement = useCallback((element: HTMLElement | null) => {
    pageElementRef.current = element;
  }, []);

  /**
   * Manually trigger transition
   */
  const triggerTransition = useCallback((
    fromRoute: string,
    toRoute: string,
    direction: 'forward' | 'back' = 'forward'
  ) => {
    return executeTransition(fromRoute, toRoute, direction);
  }, [executeTransition]);

  return {
    setPageElement,
    triggerTransition,
    isTransitioning: pageTransitionCoordinator.isActive
  };
}

/**
 * Hook for View Transitions API integration
 */
export function useViewTransitions() {
  const executeTransition = useCallback(
    async (updateCallback: () => void | Promise<void>) => {
      return executeViewTransition(updateCallback);
    },
    []
  );

  return {
    executeViewTransition: executeTransition,
    supportsViewTransitions: typeof document !== 'undefined' && 'startViewTransition' in document
  };
}

/**
 * Hook for route-based transition configuration
 */
export function useRouteTransitions(customRoutes?: Record<string, PageTransitionConfig>) {
  const getTransitionConfig = useCallback((fromRoute: string, toRoute: string): PageTransitionConfig => {
    // Check custom routes first
    if (customRoutes) {
      const customConfig = customRoutes[toRoute] || customRoutes[`${fromRoute}->${toRoute}`];
      if (customConfig) {
        return customConfig;
      }
    }

    // Fall back to default route-based config
    return getRouteTransitionConfig(fromRoute, toRoute);
  }, [customRoutes]);

  return {
    getTransitionConfig
  };
}

/**
 * Hook for managing shared element transitions
 */
export function useSharedElementTransitions(sharedElements: string[] = []) {
  const markSharedElements = useCallback((container: HTMLElement) => {
    sharedElements.forEach(selector => {
      const element = container.querySelector(selector);
      if (element instanceof HTMLElement) {
        element.style.viewTransitionName = selector.replace(/[^a-zA-Z0-9]/g, '');
      }
    });
  }, [sharedElements]);

  const clearSharedElements = useCallback((container: HTMLElement) => {
    sharedElements.forEach(selector => {
      const element = container.querySelector(selector);
      if (element instanceof HTMLElement) {
        element.style.viewTransitionName = '';
      }
    });
  }, [sharedElements]);

  return {
    markSharedElements,
    clearSharedElements,
    sharedElements
  };
}