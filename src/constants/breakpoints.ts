/**
 * Bootstrap CSS Framework Breakpoint Constants
 * 
 * These constants match Bootstrap 5.x responsive breakpoints for consistency
 * across the application. Use these constants instead of magic numbers.
 * 
 * @see https://getbootstrap.com/docs/5.3/layout/breakpoints/
 */

// Bootstrap breakpoint values (in pixels)
export const BOOTSTRAP_BREAKPOINTS = {
  /** Extra small devices (portrait phones, less than 576px) */
  XS: 0,
  
  /** Small devices (landscape phones, 576px and up) */
  SM: 576,
  
  /** Medium devices (tablets, 768px and up) */
  MD: 768,
  
  /** Large devices (desktops, 992px and up) */
  LG: 992,
  
  /** Extra large devices (large desktops, 1200px and up) */
  XL: 1200,
  
  /** Extra extra large devices (larger desktops, 1400px and up) */
  XXL: 1400,
} as const;

// Commonly used breakpoint aliases for convenience
export const BOOTSTRAP_MD_BREAKPOINT = BOOTSTRAP_BREAKPOINTS.MD;
export const BOOTSTRAP_SM_BREAKPOINT = BOOTSTRAP_BREAKPOINTS.SM;
export const BOOTSTRAP_LG_BREAKPOINT = BOOTSTRAP_BREAKPOINTS.LG;

// Type for breakpoint values
export type BootstrapBreakpoint = typeof BOOTSTRAP_BREAKPOINTS[keyof typeof BOOTSTRAP_BREAKPOINTS];
