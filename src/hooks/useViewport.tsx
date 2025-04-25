import { useState, useEffect } from 'react';

/**
 * Viewport size categories
 */
export type ViewportCategory = 'mobile' | 'tablet' | 'desktop';

/**
 * Interface for viewport information returned by the hook
 */
export interface ViewportInfo {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  viewportCategory: ViewportCategory;
  hasTouch: boolean;
}

// Breakpoint values in pixels - can be adjusted based on design requirements
const MOBILE_MAX_WIDTH = 767;
const TABLET_MIN_WIDTH = 768;
const TABLET_MAX_WIDTH = 1023;
const DESKTOP_MIN_WIDTH = 1024;

/**
 * Hook that provides viewport information and responsive breakpoints
 * 
 * @returns {ViewportInfo} Object containing viewport dimensions and category flags
 */
export function useViewport(): ViewportInfo {
  // Default to a common screen size in case window is not available (SSR)
  const [viewport, setViewport] = useState<ViewportInfo>({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
    isMobile: false,
    isTablet: false,
    isDesktop: true, // Default to desktop for SSR
    viewportCategory: 'desktop',
    hasTouch: false,
  });

  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return;
    
    const handleResize = () => {
      // Get current dimensions
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Determine viewport category
      const isMobile = width <= MOBILE_MAX_WIDTH;
      const isTablet = width >= TABLET_MIN_WIDTH && width <= TABLET_MAX_WIDTH;
      const isDesktop = width >= DESKTOP_MIN_WIDTH;
      
      // Determine category string
      let viewportCategory: ViewportCategory = 'desktop';
      if (isMobile) viewportCategory = 'mobile';
      else if (isTablet) viewportCategory = 'tablet';
      
      // Check for touch capability using pointer media query
      // This is more reliable than 'ontouchstart' in window which can give false positives
      const hasTouch = window.matchMedia?.('(pointer: coarse)').matches || false;
      
      setViewport({
        width,
        height,
        isMobile,
        isTablet,
        isDesktop,
        viewportCategory,
        hasTouch,
      });
    };
    
    // Initial call to set the state
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // Empty dependency array so this runs once on mount
  
  return viewport;
}
