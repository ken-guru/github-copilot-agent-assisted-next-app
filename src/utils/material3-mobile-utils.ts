/**
 * Material 3 Expressive Mobile Optimization Utilities
 * 
 * Provides utilities for touch-optimized interactions, responsive layouts,
 * and mobile-specific Material 3 Expressive patterns.
 */

// Material 3 touch target sizes (in pixels)
export const MATERIAL3_TOUCH_TARGETS = {
  /** Minimum touch target size for accessibility */
  MINIMUM: 44,
  
  /** Standard touch target size */
  STANDARD: 48,
  
  /** Large touch target for primary actions */
  LARGE: 56,
  
  /** Extra large touch target for prominent actions */
  EXTRA_LARGE: 64,
} as const;

// Material 3 mobile breakpoints (enhanced from Bootstrap)
export const MATERIAL3_MOBILE_BREAKPOINTS = {
  /** Extra small mobile (portrait phones) */
  XS: 0,
  
  /** Small mobile (landscape phones) */
  SM: 576,
  
  /** Medium mobile/tablet (small tablets) */
  MD: 768,
  
  /** Large tablet (large tablets) */
  LG: 992,
  
  /** Desktop (small desktops) */
  XL: 1200,
  
  /** Large desktop */
  XXL: 1400,
} as const;

// Mobile-specific spacing scale
export const MATERIAL3_MOBILE_SPACING = {
  /** Extra tight spacing for mobile */
  XS: '4px',
  
  /** Tight spacing */
  SM: '8px',
  
  /** Standard spacing */
  MD: '16px',
  
  /** Comfortable spacing */
  LG: '24px',
  
  /** Spacious spacing */
  XL: '32px',
  
  /** Extra spacious spacing */
  XXL: '48px',
} as const;

// Touch feedback configuration
export const MATERIAL3_TOUCH_FEEDBACK = {
  /** Ripple animation duration */
  RIPPLE_DURATION: '600ms',
  
  /** Touch scale factor for press feedback */
  PRESS_SCALE: 0.95,
  
  /** Hover scale factor for touch devices */
  HOVER_SCALE: 1.02,
  
  /** Touch feedback opacity */
  TOUCH_OPACITY: 0.12,
} as const;

/**
 * Detects if the device supports touch interactions
 */
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    // @ts-ignore - for older browsers
    navigator.msMaxTouchPoints > 0
  );
}

/**
 * Detects if the device is in portrait orientation
 */
export function isPortraitOrientation(): boolean {
  if (typeof window === 'undefined') return true;
  
  return window.innerHeight >= window.innerWidth;
}

/**
 * Gets the current viewport size category
 */
export function getViewportSize(): 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' {
  if (typeof window === 'undefined') return 'md';
  
  const width = window.innerWidth;
  
  if (width < MATERIAL3_MOBILE_BREAKPOINTS.SM) return 'xs';
  if (width < MATERIAL3_MOBILE_BREAKPOINTS.MD) return 'sm';
  if (width < MATERIAL3_MOBILE_BREAKPOINTS.LG) return 'md';
  if (width < MATERIAL3_MOBILE_BREAKPOINTS.XL) return 'lg';
  if (width < MATERIAL3_MOBILE_BREAKPOINTS.XXL) return 'xl';
  return 'xxl';
}

/**
 * Determines if the current viewport is mobile-sized
 */
export function isMobileViewport(): boolean {
  const size = getViewportSize();
  return size === 'xs' || size === 'sm';
}

/**
 * Determines if the current viewport is tablet-sized
 */
export function isTabletViewport(): boolean {
  const size = getViewportSize();
  return size === 'md' || size === 'lg';
}

/**
 * Gets touch-optimized spacing based on viewport size
 */
export function getTouchOptimizedSpacing(baseSpacing: string): string {
  const size = getViewportSize();
  
  switch (size) {
    case 'xs':
      return MATERIAL3_MOBILE_SPACING.SM;
    case 'sm':
      return MATERIAL3_MOBILE_SPACING.MD;
    case 'md':
      return MATERIAL3_MOBILE_SPACING.LG;
    default:
      return baseSpacing;
  }
}

/**
 * Gets touch-optimized component size
 */
export function getTouchOptimizedSize(component: 'button' | 'input' | 'icon'): number {
  const isMobile = isMobileViewport();
  
  switch (component) {
    case 'button':
      return isMobile ? MATERIAL3_TOUCH_TARGETS.STANDARD : MATERIAL3_TOUCH_TARGETS.MINIMUM;
    case 'input':
      return isMobile ? MATERIAL3_TOUCH_TARGETS.LARGE : MATERIAL3_TOUCH_TARGETS.STANDARD;
    case 'icon':
      return isMobile ? 24 : 20;
    default:
      return MATERIAL3_TOUCH_TARGETS.STANDARD;
  }
}

/**
 * Creates CSS media queries for Material 3 mobile breakpoints
 */
export function createMobileMediaQuery(breakpoint: keyof typeof MATERIAL3_MOBILE_BREAKPOINTS): string {
  const value = MATERIAL3_MOBILE_BREAKPOINTS[breakpoint];
  return `@media (min-width: ${value}px)`;
}

/**
 * Creates CSS for touch-optimized interactions
 */
export function createTouchOptimizedCSS(): string {
  return `
    /* Touch-optimized tap targets */
    .touch-target {
      min-height: ${MATERIAL3_TOUCH_TARGETS.MINIMUM}px;
      min-width: ${MATERIAL3_TOUCH_TARGETS.MINIMUM}px;
    }
    
    .touch-target-large {
      min-height: ${MATERIAL3_TOUCH_TARGETS.LARGE}px;
      min-width: ${MATERIAL3_TOUCH_TARGETS.LARGE}px;
    }
    
    /* Touch feedback */
    .touch-feedback {
      transition: transform 150ms cubic-bezier(0.4, 0.0, 0.2, 1);
    }
    
    .touch-feedback:active {
      transform: scale(${MATERIAL3_TOUCH_FEEDBACK.PRESS_SCALE});
    }
    
    /* Hover effects for touch devices */
    @media (hover: hover) {
      .touch-feedback:hover {
        transform: scale(${MATERIAL3_TOUCH_FEEDBACK.HOVER_SCALE});
      }
    }
    
    /* Disable hover effects on touch devices */
    @media (hover: none) {
      .touch-feedback:hover {
        transform: none;
      }
    }
  `;
}

/**
 * Handles device orientation changes with smooth transitions
 */
export function handleOrientationChange(callback: (orientation: 'portrait' | 'landscape') => void): () => void {
  if (typeof window === 'undefined') return () => {};
  
  const handleChange = () => {
    const orientation = isPortraitOrientation() ? 'portrait' : 'landscape';
    callback(orientation);
  };
  
  // Listen for orientation change events
  window.addEventListener('orientationchange', handleChange);
  window.addEventListener('resize', handleChange);
  
  // Return cleanup function
  return () => {
    window.removeEventListener('orientationchange', handleChange);
    window.removeEventListener('resize', handleChange);
  };
}

/**
 * Creates ripple effect for touch feedback
 */
export function createRippleEffect(element: HTMLElement, event: TouchEvent | MouseEvent): void {
  const rect = element.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = (event as MouseEvent).clientX - rect.left - size / 2;
  const y = (event as MouseEvent).clientY - rect.top - size / 2;
  
  const ripple = document.createElement('span');
  ripple.style.cssText = `
    position: absolute;
    border-radius: 50%;
    background: currentColor;
    opacity: ${MATERIAL3_TOUCH_FEEDBACK.TOUCH_OPACITY};
    width: ${size}px;
    height: ${size}px;
    left: ${x}px;
    top: ${y}px;
    animation: ripple ${MATERIAL3_TOUCH_FEEDBACK.RIPPLE_DURATION} ease-out;
    pointer-events: none;
  `;
  
  element.appendChild(ripple);
  
  // Remove ripple after animation
  setTimeout(() => {
    if (ripple.parentNode) {
      ripple.parentNode.removeChild(ripple);
    }
  }, 600);
}

// CSS keyframes for ripple animation
export const RIPPLE_KEYFRAMES = `
  @keyframes ripple {
    0% {
      transform: scale(0);
      opacity: ${MATERIAL3_TOUCH_FEEDBACK.TOUCH_OPACITY};
    }
    100% {
      transform: scale(1);
      opacity: 0;
    }
  }
`;