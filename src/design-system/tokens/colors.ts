/**
 * Material 3 Color Tokens
 * Comprehensive color system with semantic naming and dynamic theming support
 */

/**
 * Material 3 Color Roles
 * Primary, secondary, tertiary, and neutral color roles
 */
export interface Material3ColorScheme {
  // Primary colors
  primary: string;
  onPrimary: string;
  primaryContainer: string;
  onPrimaryContainer: string;
  
  // Secondary colors
  secondary: string;
  onSecondary: string;
  secondaryContainer: string;
  onSecondaryContainer: string;
  
  // Tertiary colors
  tertiary: string;
  onTertiary: string;
  tertiaryContainer: string;
  onTertiaryContainer: string;
  
  // Error colors
  error: string;
  onError: string;
  errorContainer: string;
  onErrorContainer: string;
  
  // Surface colors
  surface: string;
  onSurface: string;
  surfaceVariant: string;
  onSurfaceVariant: string;
  surfaceDim: string;
  surfaceBright: string;
  surfaceContainerLowest: string;
  surfaceContainerLow: string;
  surfaceContainer: string;
  surfaceContainerHigh: string;
  surfaceContainerHighest: string;
  
  // Outline colors
  outline: string;
  outlineVariant: string;
  
  // Other colors
  background: string;
  onBackground: string;
  inverseSurface: string;
  inverseOnSurface: string;
  inversePrimary: string;
  shadow: string;
  scrim: string;
  surfaceTint: string;
}

/**
 * Light theme color scheme
 */
export const lightColorScheme: Material3ColorScheme = {
  // Primary colors - Purple
  primary: 'rgb(103, 80, 164)',
  onPrimary: 'rgb(255, 255, 255)',
  primaryContainer: 'rgb(234, 221, 255)',
  onPrimaryContainer: 'rgb(33, 0, 94)',
  
  // Secondary colors - Purple variant
  secondary: 'rgb(98, 91, 113)',
  onSecondary: 'rgb(255, 255, 255)',
  secondaryContainer: 'rgb(232, 222, 248)',
  onSecondaryContainer: 'rgb(29, 25, 43)',
  
  // Tertiary colors - Pink
  tertiary: 'rgb(125, 82, 96)',
  onTertiary: 'rgb(255, 255, 255)',
  tertiaryContainer: 'rgb(255, 216, 228)',
  onTertiaryContainer: 'rgb(50, 16, 29)',
  
  // Error colors
  error: 'rgb(186, 26, 26)',
  onError: 'rgb(255, 255, 255)',
  errorContainer: 'rgb(255, 218, 214)',
  onErrorContainer: 'rgb(65, 0, 2)',
  
  // Surface colors
  surface: 'rgb(254, 247, 255)',
  onSurface: 'rgb(28, 27, 31)',
  surfaceVariant: 'rgb(231, 224, 236)',
  onSurfaceVariant: 'rgb(73, 69, 79)',
  surfaceDim: 'rgb(222, 216, 225)',
  surfaceBright: 'rgb(254, 247, 255)',
  surfaceContainerLowest: 'rgb(255, 255, 255)',
  surfaceContainerLow: 'rgb(247, 242, 250)',
  surfaceContainer: 'rgb(243, 237, 247)',
  surfaceContainerHigh: 'rgb(236, 230, 240)',
  surfaceContainerHighest: 'rgb(230, 224, 233)',
  
  // Outline colors
  outline: 'rgb(121, 116, 126)',
  outlineVariant: 'rgb(202, 196, 208)',
  
  // Other colors
  background: 'rgb(254, 247, 255)',
  onBackground: 'rgb(28, 27, 31)',
  inverseSurface: 'rgb(49, 48, 51)',
  inverseOnSurface: 'rgb(245, 239, 247)',
  inversePrimary: 'rgb(208, 188, 255)',
  shadow: 'rgb(0, 0, 0)',
  scrim: 'rgb(0, 0, 0)',
  surfaceTint: 'rgb(103, 80, 164)'
};

/**
 * Dark theme color scheme
 */
export const darkColorScheme: Material3ColorScheme = {
  // Primary colors
  primary: 'rgb(208, 188, 255)',
  onPrimary: 'rgb(54, 44, 118)',
  primaryContainer: 'rgb(78, 55, 148)',
  onPrimaryContainer: 'rgb(234, 221, 255)',
  
  // Secondary colors
  secondary: 'rgb(204, 194, 220)',
  onSecondary: 'rgb(50, 47, 65)',
  secondaryContainer: 'rgb(74, 69, 88)',
  onSecondaryContainer: 'rgb(232, 222, 248)',
  
  // Tertiary colors
  tertiary: 'rgb(225, 187, 200)',
  onTertiary: 'rgb(73, 37, 50)',
  tertiaryContainer: 'rgb(99, 59, 72)',
  onTertiaryContainer: 'rgb(255, 216, 228)',
  
  // Error colors
  error: 'rgb(255, 180, 171)',
  onError: 'rgb(105, 0, 5)',
  errorContainer: 'rgb(147, 0, 10)',
  onErrorContainer: 'rgb(255, 218, 214)',
  
  // Surface colors
  surface: 'rgb(16, 14, 19)',
  onSurface: 'rgb(230, 224, 233)',
  surfaceVariant: 'rgb(73, 69, 79)',
  onSurfaceVariant: 'rgb(202, 196, 208)',
  surfaceDim: 'rgb(16, 14, 19)',
  surfaceBright: 'rgb(54, 52, 59)',
  surfaceContainerLowest: 'rgb(11, 10, 14)',
  surfaceContainerLow: 'rgb(24, 22, 27)',
  surfaceContainer: 'rgb(28, 26, 31)',
  surfaceContainerHigh: 'rgb(38, 36, 42)',
  surfaceContainerHighest: 'rgb(49, 47, 53)',
  
  // Outline colors
  outline: 'rgb(147, 143, 153)',
  outlineVariant: 'rgb(73, 69, 79)',
  
  // Other colors
  background: 'rgb(16, 14, 19)',
  onBackground: 'rgb(230, 224, 233)',
  inverseSurface: 'rgb(230, 224, 233)',
  inverseOnSurface: 'rgb(49, 48, 51)',
  inversePrimary: 'rgb(103, 80, 164)',
  shadow: 'rgb(0, 0, 0)',
  scrim: 'rgb(0, 0, 0)',
  surfaceTint: 'rgb(208, 188, 255)'
};

/**
 * Extended color palette for additional UI needs
 */
export interface ExtendedColorPalette {
  // Success colors
  success: string;
  onSuccess: string;
  successContainer: string;
  onSuccessContainer: string;
  
  // Warning colors
  warning: string;
  onWarning: string;
  warningContainer: string;
  onWarningContainer: string;
  
  // Info colors
  info: string;
  onInfo: string;
  infoContainer: string;
  onInfoContainer: string;
  
  // Custom colors
  surface1: string;
  surface2: string;
  surface3: string;
  surface4: string;
  surface5: string;
}

export const lightExtendedColors: ExtendedColorPalette = {
  // Success colors - Green
  success: 'rgb(0, 135, 81)',
  onSuccess: 'rgb(255, 255, 255)',
  successContainer: 'rgb(157, 248, 152)',
  onSuccessContainer: 'rgb(0, 44, 13)',
  
  // Warning colors - Orange
  warning: 'rgb(230, 81, 0)',
  onWarning: 'rgb(255, 255, 255)',
  warningContainer: 'rgb(255, 220, 198)',
  onWarningContainer: 'rgb(99, 25, 0)',
  
  // Info colors - Blue
  info: 'rgb(0, 102, 204)',
  onInfo: 'rgb(255, 255, 255)',
  infoContainer: 'rgb(212, 227, 255)',
  onInfoContainer: 'rgb(0, 28, 58)',
  
  // Surface elevation tints
  surface1: 'rgb(248, 242, 251)',
  surface2: 'rgb(244, 237, 248)',
  surface3: 'rgb(240, 231, 246)',
  surface4: 'rgb(238, 229, 244)',
  surface5: 'rgb(236, 226, 243)'
};

export const darkExtendedColors: ExtendedColorPalette = {
  // Success colors
  success: 'rgb(122, 219, 112)',
  onSuccess: 'rgb(0, 57, 10)',
  successContainer: 'rgb(0, 83, 25)',
  onSuccessContainer: 'rgb(157, 248, 152)',
  
  // Warning colors
  warning: 'rgb(255, 183, 134)',
  onWarning: 'rgb(128, 45, 0)',
  warningContainer: 'rgb(159, 64, 0)',
  onWarningContainer: 'rgb(255, 220, 198)',
  
  // Info colors
  info: 'rgb(166, 200, 255)',
  onInfo: 'rgb(0, 30, 66)',
  infoContainer: 'rgb(0, 82, 158)',
  onInfoContainer: 'rgb(212, 227, 255)',
  
  // Surface elevation tints
  surface1: 'rgb(22, 20, 25)',
  surface2: 'rgb(27, 25, 30)',
  surface3: 'rgb(33, 31, 38)',
  surface4: 'rgb(35, 33, 40)',
  surface5: 'rgb(37, 35, 42)'
};

/**
 * Color utilities for dynamic color generation
 */
export class Material3ColorUtils {
  /**
   * Generate dynamic color scheme from a seed color
   */
  static generateColorScheme(seedColor: string, isDark: boolean = false): Material3ColorScheme {
    // This is a simplified implementation
    // In a real app, you'd use Google's Material Color Utilities
    const base = isDark ? darkColorScheme : lightColorScheme;
    return {
      ...base,
      primary: seedColor,
      surfaceTint: seedColor
    };
  }

  /**
   * Convert RGB string to HSL values
   */
  static rgbToHsl(rgb: string): { h: number; s: number; l: number } {
    const match = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (!match) return { h: 0, s: 0, l: 0 };

    const [, rStr, gStr, bStr] = match;
    const r = Number(rStr);
    const g = Number(gStr);
    const b = Number(bStr);
    
    const max = Math.max(r, g, b) / 255;
    const min = Math.min(r, g, b) / 255;
    const diff = max - min;
    const sum = max + min;
    const l = sum / 2;

    let h = 0;
    let s = 0;

    if (diff !== 0) {
      s = l > 0.5 ? diff / (2 - sum) : diff / sum;
      
      switch (max) {
        case r / 255:
          h = ((g - b) / 255) / diff + (g < b ? 6 : 0);
          break;
        case g / 255:
          h = ((b - r) / 255) / diff + 2;
          break;
        case b / 255:
          h = ((r - g) / 255) / diff + 4;
          break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  }

  /**
   * Convert HSL values to RGB string
   */
  static hslToRgb(h: number, s: number, l: number): string {
    h /= 360;
    s /= 100;
    l /= 100;

    const hue2rgb = (p: number, q: number, t: number): number => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`;
  }

  /**
   * Apply alpha to a color
   */
  static withAlpha(color: string, alpha: number): string {
    const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (!match) return color;

    const [, r, g, b] = match;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  /**
   * Lighten or darken a color
   */
  static adjustLightness(color: string, amount: number): string {
    const { h, s, l } = this.rgbToHsl(color);
    const newL = Math.max(0, Math.min(100, l + amount));
    return this.hslToRgb(h, s, newL);
  }

  /**
   * Get color with state overlay
   */
  static withStateOverlay(
    baseColor: string, 
    overlayColor: string, 
    state: 'hover' | 'focus' | 'pressed' | 'dragged'
  ): string {
    const overlayAlpha = {
      hover: 0.08,
      focus: 0.12,
      pressed: 0.12,
      dragged: 0.16
    };

    // Simplified overlay blend - in practice, you'd use proper color blending
    return this.withAlpha(overlayColor, overlayAlpha[state]);
  }
}

/**
 * CSS custom properties generator
 */
export function generateCSSVariables(
  colorScheme: Material3ColorScheme,
  extendedColors: ExtendedColorPalette,
  prefix: string = '--md'
): Record<string, string> {
  const variables: Record<string, string> = {};

  // Material 3 color scheme
  Object.entries(colorScheme).forEach(([key, value]) => {
    variables[`${prefix}-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`] = value;
  });

  // Extended colors
  Object.entries(extendedColors).forEach(([key, value]) => {
    variables[`${prefix}-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`] = value;
  });

  return variables;
}

/**
 * Default export with complete color system
 */
export const Material3Colors = {
  light: lightColorScheme,
  dark: darkColorScheme,
  lightExtended: lightExtendedColors,
  darkExtended: darkExtendedColors,
  utils: Material3ColorUtils,
  generateCSSVariables
};