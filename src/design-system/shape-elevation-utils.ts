/**
 * Material 3 Shape and Elevation Utilities
 * 
 * This module provides utilities for working with Material 3 shapes and elevation,
 * including programmatic manipulation and component integration.
 * 
 * Based on Material Design 3 specifications:
 * https://m3.material.io/styles/shape/overview
 * https://m3.material.io/styles/elevation/overview
 */

import { Material3ShapeSize, Material3ShapeExpressive, Material3ElevationLevel } from './types';

/**
 * Shape utility functions
 */
export const ShapeUtils = {
  /**
   * Get the CSS class name for a shape size
   */
  getShapeClass(size: Material3ShapeSize): string {
    return `m3-shape-${size}`;
  },

  /**
   * Get the CSS class name for an expressive shape
   */
  getExpressiveShapeClass(size: Material3ShapeExpressive): string {
    return `m3-shape-${size}`;
  },

  /**
   * Get the CSS custom property name for a shape
   */
  getShapeProperty(size: Material3ShapeSize | Material3ShapeExpressive): string {
    return `--m3-shape-corner-${size}`;
  },

  /**
   * Apply a shape to an element
   */
  applyShape(element: HTMLElement, size: Material3ShapeSize | Material3ShapeExpressive): void {
    if (typeof window === 'undefined') return;
    
    // Remove existing shape classes
    element.classList.forEach(className => {
      if (className.startsWith('m3-shape-')) {
        element.classList.remove(className);
      }
    });
    
    // Add new shape class
    const className = size.includes('expressive') 
      ? this.getExpressiveShapeClass(size as Material3ShapeExpressive)
      : this.getShapeClass(size as Material3ShapeSize);
    element.classList.add(className);
  },

  /**
   * Get component-specific shape class
   */
  getComponentShape(component: 'button' | 'card' | 'dialog' | 'sheet' | 'chip' | 'fab', expressive: boolean = false): string {
    const suffix = expressive ? '-expressive' : '';
    return `m3-shape-${component}${suffix}`;
  },

  /**
   * Create asymmetric shape
   */
  createAsymmetricShape(corners: [string, string, string, string]): string {
    return corners.join(' ');
  },

  /**
   * Generate responsive shape classes
   */
  getResponsiveShapeClass(baseSize: 'sm' | 'md' | 'lg'): string {
    return `m3-shape-responsive-${baseSize}`;
  }
};

/**
 * Elevation utility functions
 */
export const ElevationUtils = {
  /**
   * Get the CSS class name for an elevation level
   */
  getElevationClass(level: Material3ElevationLevel): string {
    return `m3-elevation-${level}`;
  },

  /**
   * Get the CSS custom property name for an elevation level
   */
  getElevationProperty(level: Material3ElevationLevel): string {
    return `--m3-elevation-level${level}`;
  },

  /**
   * Apply elevation to an element
   */
  applyElevation(element: HTMLElement, level: Material3ElevationLevel): void {
    if (typeof window === 'undefined') return;
    
    // Remove existing elevation classes
    element.classList.forEach(className => {
      if (className.startsWith('m3-elevation-')) {
        element.classList.remove(className);
      }
    });
    
    // Add new elevation class
    element.classList.add(this.getElevationClass(level));
  },

  /**
   * Get component-specific elevation class
   */
  getComponentElevation(
    component: 'surface' | 'card' | 'button' | 'fab' | 'dialog' | 'modal' | 'navigation' | 'menu',
    state?: 'hovered' | 'pressed' | 'dragged' | 'scrolled'
  ): string {
    const baseClass = `m3-elevation-${component}`;
    return state ? `${baseClass}-${state}` : baseClass;
  },

  /**
   * Enable interactive elevation for an element
   */
  makeInteractive(element: HTMLElement): void {
    if (typeof window === 'undefined') return;
    element.classList.add('m3-elevation-interactive');
  },

  /**
   * Enable focusable elevation for an element
   */
  makeFocusable(element: HTMLElement): void {
    if (typeof window === 'undefined') return;
    element.classList.add('m3-elevation-focusable');
  },

  /**
   * Enable pressable elevation for an element
   */
  makePressable(element: HTMLElement): void {
    if (typeof window === 'undefined') return;
    element.classList.add('m3-elevation-pressable');
  },

  /**
   * Enable draggable elevation for an element
   */
  makeDraggable(element: HTMLElement): void {
    if (typeof window === 'undefined') return;
    element.classList.add('m3-elevation-draggable');
    element.setAttribute('draggable', 'true');
  },

  /**
   * Animate elevation change
   */
  animateElevation(
    element: HTMLElement, 
    fromLevel: Material3ElevationLevel, 
    toLevel: Material3ElevationLevel,
    duration: number = 200
  ): Promise<void> {
    return new Promise((resolve) => {
      if (typeof window === 'undefined') {
        resolve();
        return;
      }

      // Apply transition
      element.style.transition = `box-shadow ${duration}ms var(--m3-motion-easing-standard)`;
      
      // Remove old elevation
      element.classList.remove(this.getElevationClass(fromLevel));
      
      // Add new elevation
      element.classList.add(this.getElevationClass(toLevel));
      
      // Resolve after animation
      setTimeout(() => {
        element.style.transition = '';
        resolve();
      }, duration);
    });
  }
};

/**
 * Combined surface utilities that handle both shape and elevation
 */
export const SurfaceUtils = {
  /**
   * Create a complete surface with shape and elevation
   */
  createSurface(
    element: HTMLElement,
    config: {
      shape?: Material3ShapeSize | Material3ShapeExpressive;
      elevation?: Material3ElevationLevel;
      component?: 'card' | 'dialog' | 'modal' | 'sheet' | 'fab';
      expressive?: boolean;
      interactive?: boolean;
    }
  ): void {
    if (typeof window === 'undefined') return;

    const { shape, elevation, component, expressive = false, interactive = false } = config;

    if (component) {
      // Apply component-specific surface class
      const suffix = expressive ? '-expressive' : '';
      element.classList.add(`m3-surface-${component}${suffix}`);
    } else {
      // Apply individual shape and elevation
      if (shape) {
        ShapeUtils.applyShape(element, shape);
      }
      if (elevation !== undefined) {
        ElevationUtils.applyElevation(element, elevation);
      }
    }

    if (interactive) {
      ElevationUtils.makeInteractive(element);
    }
  },

  /**
   * Get combined surface class name
   */
  getSurfaceClass(
    component: 'card' | 'dialog' | 'modal' | 'sheet' | 'fab',
    variant?: 'elevated' | 'expressive'
  ): string {
    const baseClass = `m3-surface-${component}`;
    return variant ? `${baseClass}-${variant}` : baseClass;
  },

  /**
   * Apply surface state
   */
  applySurfaceState(
    element: HTMLElement,
    state: 'hover' | 'focus' | 'pressed' | 'dragged'
  ): void {
    if (typeof window === 'undefined') return;

    // Remove existing state classes
    element.classList.forEach(className => {
      if (className.includes('-hovered') || className.includes('-pressed') || className.includes('-dragged')) {
        element.classList.remove(className);
      }
    });

    // Apply new state
    if (state === 'hover') {
      element.classList.add('m3-elevation-interactive');
    } else if (state === 'focus') {
      element.classList.add('m3-elevation-focusable');
    } else if (state === 'pressed') {
      element.classList.add('m3-elevation-pressable');
    } else if (state === 'dragged') {
      element.classList.add('m3-elevation-draggable');
    }
  }
};

/**
 * Animation utilities for shapes and elevation
 */
export const AnimationUtils = {
  /**
   * Animate shape morph
   */
  morphShape(
    element: HTMLElement,
    fromShape: Material3ShapeSize,
    toShape: Material3ShapeSize,
    duration: number = 300
  ): Promise<void> {
    return new Promise((resolve) => {
      if (typeof window === 'undefined') {
        resolve();
        return;
      }

      // Enable morph animation
      element.classList.add('m3-shape-morph');
      
      // Apply transition
      element.style.transition = `border-radius ${duration}ms var(--m3-motion-easing-emphasized)`;
      
      // Change shape
      ShapeUtils.applyShape(element, toShape);
      
      // Resolve after animation
      setTimeout(() => {
        element.style.transition = '';
        element.classList.remove('m3-shape-morph');
        resolve();
      }, duration);
    });
  },

  /**
   * Animate elevation float
   */
  floatElement(element: HTMLElement, enable: boolean = true): void {
    if (typeof window === 'undefined') return;

    if (enable) {
      element.classList.add('m3-elevation-float');
    } else {
      element.classList.remove('m3-elevation-float');
    }
  },

  /**
   * Start elevation pulse animation
   */
  pulseElevation(element: HTMLElement, enable: boolean = true): void {
    if (typeof window === 'undefined') return;

    if (enable) {
      element.classList.add('m3-elevation-pulse');
    } else {
      element.classList.remove('m3-elevation-pulse');
    }
  }
};

/**
 * Responsive utilities for shape and elevation
 */
export const ResponsiveUtils = {
  /**
   * Apply responsive shape based on screen size
   */
  applyResponsiveShape(element: HTMLElement, baseSize: 'sm' | 'md' | 'lg'): void {
    if (typeof window === 'undefined') return;
    
    element.classList.add(ShapeUtils.getResponsiveShapeClass(baseSize));
  },

  /**
   * Get current breakpoint
   */
  getCurrentBreakpoint(): 'compact' | 'medium' | 'expanded' {
    if (typeof window === 'undefined') return 'medium';
    
    const width = window.innerWidth;
    if (width < 600) return 'compact';
    if (width < 1200) return 'medium';
    return 'expanded';
  },

  /**
   * Apply breakpoint-specific configuration
   */
  applyBreakpointConfig(
    element: HTMLElement,
    config: {
      compact?: { shape?: Material3ShapeSize; elevation?: Material3ElevationLevel };
      medium?: { shape?: Material3ShapeSize; elevation?: Material3ElevationLevel };
      expanded?: { shape?: Material3ShapeSize; elevation?: Material3ElevationLevel };
    }
  ): void {
    if (typeof window === 'undefined') return;

    const breakpoint = this.getCurrentBreakpoint();
    const settings = config[breakpoint];
    
    if (settings) {
      if (settings.shape) {
        ShapeUtils.applyShape(element, settings.shape);
      }
      if (settings.elevation !== undefined) {
        ElevationUtils.applyElevation(element, settings.elevation);
      }
    }
  }
};

/**
 * Accessibility utilities
 */
export const AccessibilityUtils = {
  /**
   * Enhance focus visibility for shapes and elevation
   */
  enhanceFocusVisibility(element: HTMLElement): void {
    if (typeof window === 'undefined') return;

    element.classList.add('m3-elevation-focusable');
    
    // Add focus event listeners
    element.addEventListener('focus', () => {
      element.style.outline = '2px solid var(--m3-color-primary)';
      element.style.outlineOffset = '2px';
    });
    
    element.addEventListener('blur', () => {
      element.style.outline = '';
      element.style.outlineOffset = '';
    });
  },

  /**
   * Apply high contrast mode adjustments
   */
  applyHighContrastMode(element: HTMLElement, enable: boolean = true): void {
    if (typeof window === 'undefined') return;

    if (enable) {
      element.style.border = '1px solid var(--m3-color-outline)';
    } else {
      element.style.border = '';
    }
  },

  /**
   * Check if user prefers reduced motion
   */
  prefersReducedMotion(): boolean {
    if (typeof window === 'undefined') return true;
    
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  /**
   * Apply motion preferences
   */
  applyMotionPreferences(element: HTMLElement): void {
    if (typeof window === 'undefined') return;

    if (this.prefersReducedMotion()) {
      element.style.transition = 'none';
      element.classList.add('m3-no-motion');
    }
  }
};

/**
 * Utility constants for shape and elevation
 */
export const SHAPE_ELEVATION_UTILS = {
  // Shape sizes
  SHAPE_SIZES: ['none', 'xs', 'sm', 'md', 'lg', 'xl', 'full'] as const,
  
  // Expressive shape variants
  EXPRESSIVE_SHAPES: [
    'xs-expressive', 'sm-expressive', 'md-expressive', 
    'lg-expressive', 'xl-expressive'
  ] as const,
  
  // Elevation levels
  ELEVATION_LEVELS: [0, 1, 2, 3, 4, 5] as const,
  
  // Component types
  COMPONENTS: [
    'card', 'dialog', 'modal', 'sheet', 'fab', 'button', 
    'chip', 'surface', 'navigation', 'menu'
  ] as const,
  
  // Animation durations (ms)
  ANIMATION_DURATIONS: {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500
  } as const,
  
  // Breakpoints (px)
  BREAKPOINTS: {
    COMPACT: 600,
    MEDIUM: 1200
  } as const
} as const;

/**
 * Export all utilities as a combined object
 */
export const Material3ShapeElevation = {
  Shape: ShapeUtils,
  Elevation: ElevationUtils,
  Surface: SurfaceUtils,
  Animation: AnimationUtils,
  Responsive: ResponsiveUtils,
  Accessibility: AccessibilityUtils,
  Constants: SHAPE_ELEVATION_UTILS
};