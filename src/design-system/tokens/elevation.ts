/**
 * Material 3 Elevation Tokens
 * Comprehensive elevation system with shadows, surface tints, and z-index management
 */

/**
 * Material 3 Elevation Levels
 * Six levels of elevation with corresponding shadows and surface tints
 */
export interface Material3ElevationLevel {
  level: number;
  shadow: string;
  surfaceTint: number; // Opacity of surface tint (0-1)
  zIndex: number;
}

/**
 * Material 3 Elevation Scale
 */
export const Material3Elevation = {
  level0: {
    level: 0,
    shadow: 'none',
    surfaceTint: 0,
    zIndex: 0
  },
  level1: {
    level: 1,
    shadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15)',
    surfaceTint: 0.05,
    zIndex: 1
  },
  level2: {
    level: 2,
    shadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.3), 0px 2px 6px 2px rgba(0, 0, 0, 0.15)',
    surfaceTint: 0.08,
    zIndex: 2
  },
  level3: {
    level: 3,
    shadow: '0px 1px 3px 0px rgba(0, 0, 0, 0.3), 0px 4px 8px 3px rgba(0, 0, 0, 0.15)',
    surfaceTint: 0.11,
    zIndex: 3
  },
  level4: {
    level: 4,
    shadow: '0px 2px 3px 0px rgba(0, 0, 0, 0.3), 0px 6px 10px 4px rgba(0, 0, 0, 0.15)',
    surfaceTint: 0.12,
    zIndex: 4
  },
  level5: {
    level: 5,
    shadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.3), 0px 8px 12px 6px rgba(0, 0, 0, 0.15)',
    surfaceTint: 0.14,
    zIndex: 5
  }
} as const;

/**
 * Z-index scale for layering
 */
export const Material3ZIndex = {
  // Base layers
  base: 0,
  raised: 1,
  
  // Component layers
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  
  // Overlay layers
  backdrop: 1040,
  drawer: 1050,
  modal: 1060,
  popover: 1070,
  tooltip: 1080,
  
  // Top layers
  notification: 1090,
  alert: 1100,
  
  // System layers
  debug: 9999
} as const;

/**
 * Component elevation mapping
 */
export const Material3ComponentElevation = {
  // Surface components
  card: Material3Elevation.level1,
  sheet: Material3Elevation.level1,
  
  // Interactive components
  button: Material3Elevation.level0,
  buttonPressed: Material3Elevation.level1,
  fab: Material3Elevation.level3,
  fabPressed: Material3Elevation.level4,
  
  // Navigation components
  navigationBar: Material3Elevation.level2,
  navigationRail: Material3Elevation.level0,
  navigationDrawer: Material3Elevation.level1,
  
  // Container components
  appBar: Material3Elevation.level0,
  appBarScrolled: Material3Elevation.level2,
  searchBar: Material3Elevation.level3,
  
  // Overlay components
  dialog: Material3Elevation.level3,
  menu: Material3Elevation.level2,
  modalBottomSheet: Material3Elevation.level1,
  standardBottomSheet: Material3Elevation.level1,
  
  // Notification components
  snackbar: Material3Elevation.level3,
  banner: Material3Elevation.level1,
  
  // Input components
  textField: Material3Elevation.level0,
  textFieldFocused: Material3Elevation.level1
} as const;

/**
 * Elevation utilities
 */
export class Material3ElevationUtils {
  /**
   * Apply elevation to element
   */
  static applyElevation(
    element: HTMLElement, 
    elevation: Material3ElevationLevel,
    surfaceTintColor: string = 'rgb(103, 80, 164)'
  ): void {
    element.style.boxShadow = elevation.shadow;
    element.style.zIndex = elevation.zIndex.toString();
    
    // Apply surface tint if elevation > 0
    if (elevation.level > 0 && elevation.surfaceTint > 0) {
      const tintOverlay = this.createSurfaceTint(surfaceTintColor, elevation.surfaceTint);
      element.style.position = 'relative';
      
      // Create or update tint overlay
      let overlay = element.querySelector('.elevation-tint') as HTMLElement;
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'elevation-tint';
        overlay.style.position = 'absolute';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.right = '0';
        overlay.style.bottom = '0';
        overlay.style.pointerEvents = 'none';
        overlay.style.borderRadius = 'inherit';
        element.appendChild(overlay);
      }
      
      overlay.style.backgroundColor = tintOverlay;
    }
  }

  /**
   * Create surface tint color with opacity
   */
  static createSurfaceTint(color: string, opacity: number): string {
    // Extract RGB values from color string
    const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (rgbMatch) {
      const [, r, g, b] = rgbMatch;
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
    
    // Fallback for hex colors
    if (color.startsWith('#')) {
      const hex = color.slice(1);
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
    
    return `rgba(103, 80, 164, ${opacity})`; // Fallback primary color
  }

  /**
   * Animate elevation change
   */
  static animateElevation(
    element: HTMLElement,
    fromElevation: Material3ElevationLevel,
    toElevation: Material3ElevationLevel,
    duration: number = 200,
    easing: string = 'cubic-bezier(0.2, 0, 0, 1)'
  ): Promise<void> {
    return new Promise((resolve) => {
      // Set transition
      element.style.transition = `box-shadow ${duration}ms ${easing}, transform ${duration}ms ${easing}`;
      
      // Apply new elevation
      this.applyElevation(element, toElevation);
      
      // Clean up transition after animation
      setTimeout(() => {
        element.style.transition = '';
        resolve();
      }, duration);
    });
  }

  /**
   * Generate CSS custom properties for elevation
   */
  static generateCSSVariables(
    elevationScale: typeof Material3Elevation,
    prefix: string = '--md-elevation'
  ): Record<string, string> {
    const variables: Record<string, string> = {};

    Object.entries(elevationScale).forEach(([key, elevation]) => {
      variables[`${prefix}-${key}-shadow`] = elevation.shadow;
      variables[`${prefix}-${key}-surface-tint`] = elevation.surfaceTint.toString();
      variables[`${prefix}-${key}-z-index`] = elevation.zIndex.toString();
    });

    return variables;
  }

  /**
   * Get elevation by component and state
   */
  static getComponentElevation(
    component: keyof typeof Material3ComponentElevation,
    state?: 'hover' | 'focus' | 'pressed' | 'dragged'
  ): Material3ElevationLevel {
    const baseElevation = Material3ComponentElevation[component];
    
    // Apply state-based elevation changes
    if (state) {
      const stateModifiers = {
        hover: 1,
        focus: 1,
        pressed: -1,
        dragged: 2
      };
      
      const modifier = stateModifiers[state];
      const newLevel = Math.max(0, Math.min(5, baseElevation.level + modifier));
      
      // Create new elevation level based on calculation
      return this.createCustomElevation(newLevel);
    }
    
    return baseElevation;
  }

  /**
   * Create custom elevation
   */
  static createCustomElevation(
    level: number,
    customShadow?: string,
    customTint?: number
  ): Material3ElevationLevel {
    const clampedLevel = Math.max(0, Math.min(5, level));
    const baseElevation = Material3Elevation[`level${clampedLevel}` as keyof typeof Material3Elevation];
    
    return {
      level: clampedLevel,
      shadow: customShadow || baseElevation.shadow,
      surfaceTint: customTint !== undefined ? customTint : baseElevation.surfaceTint,
      zIndex: baseElevation.zIndex
    };
  }
}

/**
 * Elevation transitions and animations
 */
export const Material3ElevationTransitions = {
  // Standard elevation change
  standard: {
    duration: 200,
    easing: 'cubic-bezier(0.2, 0, 0, 1)'
  },
  
  // Quick elevation change
  quick: {
    duration: 100,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
  },
  
  // Slow elevation change
  slow: {
    duration: 300,
    easing: 'cubic-bezier(0.0, 0, 0.2, 1)'
  },
  
  // Emphasized elevation change
  emphasized: {
    duration: 250,
    easing: 'cubic-bezier(0.2, 0, 0, 1)'
  }
} as const;

/**
 * Accessibility considerations for elevation
 */
export const Material3ElevationA11y = {
  // Minimum contrast ratios for elevated surfaces
  contrastRequirements: {
    level1: 3,    // AA standard
    level2: 3,
    level3: 4.5,  // AA enhanced
    level4: 4.5,
    level5: 4.5
  },
  
  // Focus indicators for elevated components
  focusIndicator: {
    offset: '2px',
    width: '2px',
    style: 'solid',
    color: 'var(--md-primary)'
  },
  
  // Reduced motion considerations
  respectsReducedMotion: true,
  fallbackElevation: Material3Elevation.level1
};

/**
 * Default export with complete elevation system
 */
export const Material3ElevationSystem = {
  levels: Material3Elevation,
  zIndex: Material3ZIndex,
  components: Material3ComponentElevation,
  transitions: Material3ElevationTransitions,
  utils: Material3ElevationUtils,
  a11y: Material3ElevationA11y
};