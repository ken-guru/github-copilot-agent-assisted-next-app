/**
 * Material 3 Design Tokens Index
 * Central export for all design token systems
 */

// Export all token systems
export { Material3Colors } from './colors';
export { Material3Typography } from './typography';
export { Material3SpacingSystem } from './spacing';
export { Material3ElevationSystem } from './elevation';

// Export motion tokens from existing system
export { 
  Material3Duration,
  Material3Easing,
  Material3Performance
} from '../utils/motion';

// Re-export types for convenience
export type { Material3ColorScheme, ExtendedColorPalette } from './colors';
export type { Material3TypeScale, TypographyToken } from './typography';
export type { ResponsiveSpacingScale } from './spacing';
export type { Material3ElevationLevel } from './elevation';

// Import for re-export
import { Material3Colors } from './colors';
import { Material3Typography } from './typography';
import { Material3SpacingSystem } from './spacing';
import { Material3ElevationSystem } from './elevation';

/**
 * Complete Material 3 token system
 */
export interface Material3TokenSystem {
  colors: {
    light: any;
    dark: any;
    lightExtended: any;
    darkExtended: any;
    utils: any;
  };
  typography: {
    scale: any;
    weights: any;
    breakpoints: any;
    utils: any;
  };
  spacing: {
    base: any;
    semantic: any;
    responsive: any;
    grid: any;
    components: any;
    utils: any;
  };
  elevation: {
    levels: any;
    zIndex: any;
    components: any;
    transitions: any;
    utils: any;
  };
  motion: {
    duration: any;
    easing: any;
    performance: any;
  };
}

/**
 * Utility functions for token management
 */
export class Material3TokenUtils {
  /**
   * Generate complete CSS custom properties
   */
  static generateAllCSSVariables(
    isDark: boolean = false,
    prefix: string = '--md'
  ): Record<string, string> {
    const { Material3Colors } = require('./colors');
    const { Material3Typography } = require('./typography');
    const { Material3SpacingSystem } = require('./spacing');
    const { Material3ElevationSystem } = require('./elevation');

    const variables: Record<string, string> = {};

    // Color variables
    const colorScheme = isDark ? Material3Colors.dark : Material3Colors.light;
    const extendedColors = isDark ? Material3Colors.darkExtended : Material3Colors.lightExtended;
    Object.assign(variables, Material3Colors.generateCSSVariables(colorScheme, extendedColors, prefix));

    // Typography variables
    Object.assign(variables, Material3Typography.utils.generateCSSVariables(Material3Typography.scale, `${prefix}-type`));

    // Spacing variables
    Object.assign(variables, Material3SpacingSystem.utils.generateCSSVariables(Material3SpacingSystem.base, `${prefix}-space`));

    // Elevation variables
    Object.assign(variables, Material3ElevationSystem.utils.generateCSSVariables(Material3ElevationSystem.levels, `${prefix}-elevation`));

    return variables;
  }

  /**
   * Apply CSS variables to document root
   */
  static applyCSSVariables(
    variables: Record<string, string>,
    element: HTMLElement = document.documentElement
  ): void {
    Object.entries(variables).forEach(([property, value]) => {
      element.style.setProperty(property, value);
    });
  }

  /**
   * Create theme toggle functionality
   */
  static createThemeToggle(
    onThemeChange?: (isDark: boolean) => void
  ): {
    isDark: boolean;
    toggle: () => void;
    setTheme: (isDark: boolean) => void;
  } {
    let isDark = false;

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      isDark = savedTheme === 'dark';
    } else {
      // Check system preference
      isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    const setTheme = (dark: boolean) => {
      isDark = dark;
      const variables = this.generateAllCSSVariables(isDark);
      this.applyCSSVariables(variables);
      
      // Save preference
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      
      // Update document class
      document.documentElement.classList.toggle('dark', isDark);
      
      onThemeChange?.(isDark);
    };

    const toggle = () => {
      setTheme(!isDark);
    };

    // Initialize theme
    setTheme(isDark);

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        setTheme(e.matches);
      }
    });

    return {
      get isDark() { return isDark; },
      toggle,
      setTheme
    };
  }

  /**
   * Validate token consistency
   */
  static validateTokens(): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Add validation logic here
    // This is a placeholder for comprehensive token validation

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Get token value by path
   */
  static getTokenValue(path: string, isDark: boolean = false): string | undefined {
    const { Material3Colors } = require('./colors');
    const { Material3Typography } = require('./typography');
    const { Material3SpacingSystem } = require('./spacing');
    const { Material3ElevationSystem } = require('./elevation');

    const tokens = {
      colors: isDark ? Material3Colors.dark : Material3Colors.light,
      typography: Material3Typography.scale,
      spacing: Material3SpacingSystem.base,
      elevation: Material3ElevationSystem.levels
    };

    const pathParts = path.split('.');
    let current: any = tokens;

    for (const part of pathParts) {
      if (current && typeof current === 'object' && part in current) {
        current = current[part];
      } else {
        return undefined;
      }
    }

    return typeof current === 'string' || typeof current === 'number' 
      ? current.toString() 
      : undefined;
  }
}

/**
 * Default export with complete token system
 */
export const Material3Tokens = {
  colors: Material3Colors,
  typography: Material3Typography,
  spacing: Material3SpacingSystem,
  elevation: Material3ElevationSystem,
  utils: Material3TokenUtils
};