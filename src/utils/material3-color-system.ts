/**
 * Material 3 Expressive Dynamic Color System
 * Implements dynamic color generation with tonal palette support, semantic color roles,
 * theme-aware adaptation, and accessibility compliance
 */

import { Material3CSSProperties } from '../types/material3-tokens';

/**
 * Color space conversion utilities
 */
export interface HSLColor {
  h: number; // Hue (0-360)
  s: number; // Saturation (0-100)
  l: number; // Lightness (0-100)
}

export interface RGBColor {
  r: number; // Red (0-255)
  g: number; // Green (0-255)
  b: number; // Blue (0-255)
}

export interface HCTColor {
  h: number; // Hue (0-360)
  c: number; // Chroma (0-100+)
  t: number; // Tone (0-100)
}

/**
 * Material 3 color roles for semantic color application
 */
export type Material3ColorRole = 
  | 'primary' | 'onPrimary' | 'primaryContainer' | 'onPrimaryContainer'
  | 'secondary' | 'onSecondary' | 'secondaryContainer' | 'onSecondaryContainer'
  | 'tertiary' | 'onTertiary' | 'tertiaryContainer' | 'onTertiaryContainer'
  | 'error' | 'onError' | 'errorContainer' | 'onErrorContainer'
  | 'surface' | 'onSurface' | 'surfaceVariant' | 'onSurfaceVariant'
  | 'surfaceContainerLowest' | 'surfaceContainerLow' | 'surfaceContainer'
  | 'surfaceContainerHigh' | 'surfaceContainerHighest'
  | 'background' | 'onBackground'
  | 'outline' | 'outlineVariant'
  | 'inverseSurface' | 'inverseOnSurface' | 'inversePrimary'
  | 'shadow' | 'scrim';

/**
 * Theme mode for color adaptation
 */
export type ThemeMode = 'light' | 'dark' | 'auto';

/**
 * Interface state for contextual color application
 */
export type InterfaceState = 'default' | 'hover' | 'focus' | 'pressed' | 'disabled' | 'selected';

/**
 * Tonal palette configuration
 */
export interface TonalPalette {
  0: string;   // Pure black
  10: string;  // Very dark
  20: string;  // Dark
  30: string;  // Medium dark
  40: string;  // Medium
  50: string;  // Neutral
  60: string;  // Medium light
  70: string;  // Light
  80: string;  // Very light
  90: string;  // Extremely light
  95: string;  // Near white
  99: string;  // Almost white
  100: string; // Pure white
}

/**
 * Dynamic color scheme configuration
 */
export interface DynamicColorScheme {
  primary: TonalPalette;
  secondary: TonalPalette;
  tertiary: TonalPalette;
  neutral: TonalPalette;
  neutralVariant: TonalPalette;
  error: TonalPalette;
}

/**
 * Color contrast validation result
 */
export interface ContrastValidationResult {
  ratio: number;
  wcagAA: boolean;
  wcagAAA: boolean;
  recommendation?: string;
}

/**
 * Convert hex color to RGB
 */
export function hexToRgb(hex: string): RGBColor | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Convert RGB to hex
 */
export function rgbToHex(rgb: RGBColor): string {
  const toHex = (c: number) => {
    const hex = Math.round(Math.max(0, Math.min(255, c))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
}

/**
 * Convert RGB to HSL
 */
export function rgbToHsl(rgb: RGBColor): HSLColor {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
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
 * Convert HSL to RGB
 */
export function hslToRgb(hsl: HSLColor): RGBColor {
  const h = hsl.h / 360;
  const s = hsl.s / 100;
  const l = hsl.l / 100;

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };

  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

/**
 * Calculate relative luminance for contrast calculations
 */
export function getRelativeLuminance(rgb: RGBColor): number {
  const sRGB = [rgb.r, rgb.g, rgb.b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
}

/**
 * Calculate contrast ratio between two colors
 */
export function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  if (!rgb1 || !rgb2) return 1;
  
  const lum1 = getRelativeLuminance(rgb1);
  const lum2 = getRelativeLuminance(rgb2);
  
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Validate color contrast for accessibility compliance
 */
export function validateColorContrast(
  foreground: string, 
  background: string,
  isLargeText: boolean = false
): ContrastValidationResult {
  const ratio = getContrastRatio(foreground, background);
  const minRatioAA = isLargeText ? 3 : 4.5;
  const minRatioAAA = isLargeText ? 4.5 : 7;
  
  const result: ContrastValidationResult = {
    ratio,
    wcagAA: ratio >= minRatioAA,
    wcagAAA: ratio >= minRatioAAA
  };
  
  if (!result.wcagAA) {
    result.recommendation = `Contrast ratio ${ratio.toFixed(2)} is below WCAG AA minimum of ${minRatioAA}. Consider using a darker foreground or lighter background.`;
  } else if (!result.wcagAAA) {
    result.recommendation = `Contrast ratio ${ratio.toFixed(2)} meets WCAG AA but not AAA standards. Consider improving contrast for better accessibility.`;
  }
  
  return result;
}

/**
 * Generate a tonal palette from a base color
 */
export function generateTonalPalette(baseColor: string): TonalPalette {
  const rgb = hexToRgb(baseColor);
  if (!rgb) throw new Error('Invalid base color');
  
  const hsl = rgbToHsl(rgb);
  
  // Generate tonal variations by adjusting lightness
  const tones = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 99, 100];
  const palette: Record<number, string> = {};
  
  tones.forEach(tone => {
    if (tone === 0) {
      palette[tone] = '#000000';
    } else if (tone === 100) {
      palette[tone] = '#ffffff';
    } else {
      const adjustedHsl: HSLColor = {
        h: hsl.h,
        s: Math.max(0, hsl.s - (Math.abs(tone - 50) * 0.5)),
        l: tone
      };
      
      const adjustedRgb = hslToRgb(adjustedHsl);
      palette[tone] = rgbToHex(adjustedRgb);
    }
  });
  
  return palette as TonalPalette;
}

/**
 * Generate a complete dynamic color scheme from a seed color
 */
export function generateDynamicColorScheme(seedColor: string): DynamicColorScheme {
  const seedRgb = hexToRgb(seedColor);
  if (!seedRgb) throw new Error('Invalid seed color');
  
  const seedHsl = rgbToHsl(seedRgb);
  
  // Generate harmonious color variations
  const primaryHue = seedHsl.h;
  const secondaryHue = (primaryHue + 60) % 360;
  const tertiaryHue = (primaryHue + 120) % 360;
  const neutralHue = (primaryHue + 180) % 360;
  
  // Create base colors for each palette
  const primaryBase = rgbToHex(hslToRgb({ h: primaryHue, s: seedHsl.s, l: 50 }));
  const secondaryBase = rgbToHex(hslToRgb({ h: secondaryHue, s: Math.max(20, seedHsl.s * 0.6), l: 50 }));
  const tertiaryBase = rgbToHex(hslToRgb({ h: tertiaryHue, s: Math.max(30, seedHsl.s * 0.8), l: 50 }));
  const neutralBase = rgbToHex(hslToRgb({ h: neutralHue, s: Math.min(15, seedHsl.s * 0.2), l: 50 }));
  const neutralVariantBase = rgbToHex(hslToRgb({ h: neutralHue, s: Math.min(25, seedHsl.s * 0.3), l: 50 }));
  
  // Error palette uses standard Material 3 error color
  const errorBase = '#ba1a1a';
  
  return {
    primary: generateTonalPalette(primaryBase),
    secondary: generateTonalPalette(secondaryBase),
    tertiary: generateTonalPalette(tertiaryBase),
    neutral: generateTonalPalette(neutralBase),
    neutralVariant: generateTonalPalette(neutralVariantBase),
    error: generateTonalPalette(errorBase)
  };
}

/**
 * Get semantic color roles from a dynamic color scheme
 */
export function getSemanticColorRoles(
  scheme: DynamicColorScheme, 
  mode: ThemeMode = 'light'
): Record<Material3ColorRole, string> {
  const isDark = mode === 'dark';
  
  // Helper function to safely get color from palette
  const getColor = (palette: TonalPalette, tone: number): string => {
    return palette[tone as keyof TonalPalette] || palette[50] || '#000000';
  };
  
  return {
    // Primary colors
    primary: getColor(scheme.primary, isDark ? 80 : 40),
    onPrimary: getColor(scheme.primary, isDark ? 20 : 100),
    primaryContainer: getColor(scheme.primary, isDark ? 30 : 90),
    onPrimaryContainer: getColor(scheme.primary, isDark ? 90 : 10),
    
    // Secondary colors
    secondary: getColor(scheme.secondary, isDark ? 80 : 40),
    onSecondary: getColor(scheme.secondary, isDark ? 20 : 100),
    secondaryContainer: getColor(scheme.secondary, isDark ? 30 : 90),
    onSecondaryContainer: getColor(scheme.secondary, isDark ? 90 : 10),
    
    // Tertiary colors
    tertiary: getColor(scheme.tertiary, isDark ? 80 : 40),
    onTertiary: getColor(scheme.tertiary, isDark ? 20 : 100),
    tertiaryContainer: getColor(scheme.tertiary, isDark ? 30 : 90),
    onTertiaryContainer: getColor(scheme.tertiary, isDark ? 90 : 10),
    
    // Error colors
    error: getColor(scheme.error, isDark ? 80 : 40),
    onError: getColor(scheme.error, isDark ? 20 : 100),
    errorContainer: getColor(scheme.error, isDark ? 30 : 90),
    onErrorContainer: getColor(scheme.error, isDark ? 90 : 10),
    
    // Surface colors
    surface: getColor(scheme.neutral, isDark ? 10 : 99),
    onSurface: getColor(scheme.neutral, isDark ? 90 : 10),
    surfaceVariant: getColor(scheme.neutralVariant, isDark ? 30 : 90),
    onSurfaceVariant: getColor(scheme.neutralVariant, isDark ? 80 : 30),
    surfaceContainerLowest: getColor(scheme.neutral, isDark ? 0 : 100),
    surfaceContainerLow: getColor(scheme.neutral, isDark ? 10 : 95),
    surfaceContainer: getColor(scheme.neutral, isDark ? 20 : 90),
    surfaceContainerHigh: getColor(scheme.neutral, isDark ? 30 : 80),
    surfaceContainerHighest: getColor(scheme.neutral, isDark ? 40 : 70),
    
    // Background colors
    background: getColor(scheme.neutral, isDark ? 10 : 99),
    onBackground: getColor(scheme.neutral, isDark ? 90 : 10),
    
    // Outline colors
    outline: getColor(scheme.neutralVariant, isDark ? 60 : 50),
    outlineVariant: getColor(scheme.neutralVariant, isDark ? 30 : 80),
    
    // Inverse colors
    inverseSurface: getColor(scheme.neutral, isDark ? 90 : 20),
    inverseOnSurface: getColor(scheme.neutral, isDark ? 20 : 95),
    inversePrimary: getColor(scheme.primary, isDark ? 40 : 80),
    
    // Shadow and scrim
    shadow: getColor(scheme.neutral, 0),
    scrim: getColor(scheme.neutral, 0)
  };
}

/**
 * Apply contextual color variations for different interface states
 */
export function getContextualColor(
  baseColor: string,
  state: InterfaceState,
  colorRole: Material3ColorRole = 'primary'
): string {
  const rgb = hexToRgb(baseColor);
  if (!rgb) return baseColor;
  
  const hsl = rgbToHsl(rgb);
  
  switch (state) {
    case 'hover':
      // Slightly lighter/darker based on lightness
      return rgbToHex(hslToRgb({
        ...hsl,
        l: Math.max(0, Math.min(100, hsl.l + (hsl.l > 50 ? -5 : 5)))
      }));
      
    case 'focus':
      // Increase saturation and adjust lightness
      return rgbToHex(hslToRgb({
        ...hsl,
        s: Math.min(100, hsl.s + 10),
        l: Math.max(0, Math.min(100, hsl.l + (hsl.l > 50 ? -3 : 3)))
      }));
      
    case 'pressed':
      // Darker/lighter with reduced saturation
      return rgbToHex(hslToRgb({
        ...hsl,
        s: Math.max(0, hsl.s - 5),
        l: Math.max(0, Math.min(100, hsl.l + (hsl.l > 50 ? -10 : 10)))
      }));
      
    case 'disabled':
      // Desaturated and lighter
      return rgbToHex(hslToRgb({
        ...hsl,
        s: Math.max(0, hsl.s * 0.3),
        l: Math.max(0, Math.min(100, hsl.l + (hsl.l > 50 ? 10 : -10)))
      }));
      
    case 'selected':
      // Enhanced saturation
      return rgbToHex(hslToRgb({
        ...hsl,
        s: Math.min(100, hsl.s + 15),
        l: Math.max(0, Math.min(100, hsl.l + (hsl.l > 50 ? -2 : 2)))
      }));
      
    default:
      return baseColor;
  }
}

/**
 * Generate CSS custom properties for a dynamic color scheme
 */
export function generateColorCSSProperties(
  scheme: DynamicColorScheme,
  mode: ThemeMode = 'light'
): Record<string, string> {
  const semanticColors = getSemanticColorRoles(scheme, mode);
  const properties: Record<string, string> = {};
  
  // Map semantic colors to CSS custom properties
  Object.entries(semanticColors).forEach(([role, color]) => {
    const cssProperty = Material3CSSProperties.colors[role as keyof typeof Material3CSSProperties.colors];
    if (cssProperty) {
      properties[cssProperty] = color;
    }
  });
  
  return properties;
}

/**
 * Apply dynamic color scheme to the document
 */
export function applyDynamicColorScheme(
  scheme: DynamicColorScheme,
  mode: ThemeMode = 'light'
): void {
  const properties = generateColorCSSProperties(scheme, mode);
  const root = document.documentElement;
  
  Object.entries(properties).forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });
  
  // Update theme mode class
  root.classList.remove('light', 'dark');
  if (mode !== 'auto') {
    root.classList.add(mode);
  }
}

/**
 * Create theme-aware color adaptation utility
 */
export function createThemeAwareColorAdapter(
  lightScheme: DynamicColorScheme,
  darkScheme: DynamicColorScheme
) {
  let currentMode: ThemeMode = 'auto';
  
  const updateTheme = (mode: ThemeMode = 'auto') => {
    currentMode = mode;
    
    let effectiveMode: 'light' | 'dark' = 'light';
    
    if (mode === 'auto') {
      effectiveMode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } else {
      effectiveMode = mode;
    }
    
    const scheme = effectiveMode === 'dark' ? darkScheme : lightScheme;
    applyDynamicColorScheme(scheme, effectiveMode);
  };
  
  // Listen for system theme changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const handleSystemThemeChange = () => {
    if (currentMode === 'auto') {
      updateTheme('auto');
    }
  };
  
  mediaQuery.addEventListener('change', handleSystemThemeChange);
  
  // Initial theme application
  updateTheme();
  
  return {
    setTheme: updateTheme,
    getCurrentMode: () => currentMode,
    cleanup: () => mediaQuery.removeEventListener('change', handleSystemThemeChange)
  };
}

/**
 * Validate entire color scheme for accessibility
 */
export function validateColorSchemeAccessibility(
  scheme: DynamicColorScheme,
  mode: ThemeMode = 'light'
): Record<string, ContrastValidationResult> {
  const semanticColors = getSemanticColorRoles(scheme, mode);
  const results: Record<string, ContrastValidationResult> = {};
  
  // Define color pairs that need to meet contrast requirements
  const colorPairs: Array<[string, string, boolean?]> = [
    ['primary', 'onPrimary'],
    ['primaryContainer', 'onPrimaryContainer'],
    ['secondary', 'onSecondary'],
    ['secondaryContainer', 'onSecondaryContainer'],
    ['tertiary', 'onTertiary'],
    ['tertiaryContainer', 'onTertiaryContainer'],
    ['error', 'onError'],
    ['errorContainer', 'onErrorContainer'],
    ['surface', 'onSurface'],
    ['surfaceVariant', 'onSurfaceVariant'],
    ['background', 'onBackground'],
    ['inverseSurface', 'inverseOnSurface']
  ];
  
  colorPairs.forEach(([bg, fg, isLargeText = false]) => {
    const bgColor = semanticColors[bg as Material3ColorRole];
    const fgColor = semanticColors[fg as Material3ColorRole];
    
    if (bgColor && fgColor) {
      results[`${bg}-${fg}`] = validateColorContrast(fgColor, bgColor, isLargeText);
    }
  });
  
  return results;
}

/**
 * Get Material 3 color utility for React components
 */
export function useMaterial3Color(
  colorRole: Material3ColorRole,
  state: InterfaceState = 'default'
): {
  color: string;
  cssProperty: string;
  getContextualColor: (newState: InterfaceState) => string;
  validateContrast: (backgroundColor: string) => ContrastValidationResult;
} {
  const cssProperty = Material3CSSProperties.colors[colorRole];
  const baseColor = `var(${cssProperty})`;
  
  return {
    color: baseColor,
    cssProperty,
    getContextualColor: (newState: InterfaceState) => {
      // In a real implementation, this would get the computed color value
      // For now, return the CSS variable with state modifier
      return `var(${cssProperty}-${newState}, ${baseColor})`;
    },
    validateContrast: (backgroundColor: string) => {
      // In a real implementation, this would get the computed color values
      // For now, return a placeholder validation
      return {
        ratio: 4.5,
        wcagAA: true,
        wcagAAA: false
      };
    }
  };
}