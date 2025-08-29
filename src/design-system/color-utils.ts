/**
 * Material 3 Dynamic Color Utilities
 * 
 * This module provides utilities for working with Material 3's dynamic color system,
 * including tonal palette generation, color manipulation, and theme-aware color selection.
 * 
 * Based on Material Design 3 color specifications and HCT color space:
 * https://m3.material.io/styles/color/system/overview
 */

import { Material3ColorRole, Material3TonalPalette, Material3ColorScheme } from './types';

/**
 * Convert hex color to RGB values
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1]!, 16),
    g: parseInt(result[2]!, 16),
    b: parseInt(result[3]!, 16)
  } : null;
}

/**
 * Convert RGB values to hex color
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

/**
 * Convert RGB to HSL color space
 */
export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;
  
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (diff !== 0) {
    s = l > 0.5 ? diff / (2 - max - min) : diff / (max + min);

    switch (max) {
      case r:
        h = (g - b) / diff + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / diff + 2;
        break;
      case b:
        h = (r - g) / diff + 4;
        break;
    }
    h /= 6;
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

/**
 * Convert HSL to RGB color space
 */
export function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
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
 * Calculate relative luminance for a given RGB color
 */
export function getLuminance(r: number, g: number, b: number): number {
  const toLinear = (value: number): number => {
    value /= 255;
    return value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
  };

  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

/**
 * Calculate contrast ratio between two colors
 */
export function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  if (!rgb1 || !rgb2) return 1;

  const l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
  
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if a color meets WCAG contrast requirements
 */
export function meetsContrastRequirement(
  foreground: string, 
  background: string, 
  level: 'AA' | 'AAA' = 'AA',
  size: 'normal' | 'large' = 'normal'
): boolean {
  const ratio = getContrastRatio(foreground, background);
  
  if (level === 'AAA') {
    return size === 'large' ? ratio >= 4.5 : ratio >= 7;
  }
  
  return size === 'large' ? ratio >= 3 : ratio >= 4.5;
}

/**
 * Generate a tonal palette from a source color
 */
export function generateTonalPalette(sourceColor: string): Material3TonalPalette {
  const rgb = hexToRgb(sourceColor);
  if (!rgb) throw new Error('Invalid source color');

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const palette: Material3TonalPalette = {};

  // Define tone values for Material 3
  const tones = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 99, 100];
  
  tones.forEach(tone => {
    let lightness: number;
    
    if (tone === 0) {
      lightness = 0;
    } else if (tone === 100) {
      lightness = 100;
    } else {
      // Calculate lightness based on tone
      lightness = tone;
    }
    
    const adjustedHsl = {
      h: hsl.h,
      s: tone === 0 || tone === 100 ? 0 : Math.max(10, hsl.s * (1 - Math.abs(tone - 50) / 100)),
      l: lightness
    };
    
    const adjustedRgb = hslToRgb(adjustedHsl.h, adjustedHsl.s, adjustedHsl.l);
    palette[tone as keyof Material3TonalPalette] = rgbToHex(adjustedRgb.r, adjustedRgb.g, adjustedRgb.b);
  });

  return palette;
}

/**
 * Generate a complete Material 3 color scheme from a source color
 */
export function generateColorScheme(
  sourceColor: string,
  mode: 'light' | 'dark' = 'light'
): Material3ColorScheme {
  const primaryPalette = generateTonalPalette(sourceColor);
  
  // Generate secondary palette (shift hue by 60 degrees)
  const primaryRgb = hexToRgb(sourceColor);
  if (!primaryRgb) throw new Error('Invalid source color');
  
  const primaryHsl = rgbToHsl(primaryRgb.r, primaryRgb.g, primaryRgb.b);
  const secondaryHue = (primaryHsl.h + 60) % 360;
  const secondaryRgb = hslToRgb(secondaryHue, primaryHsl.s * 0.6, primaryHsl.l);
  const secondaryColor = rgbToHex(secondaryRgb.r, secondaryRgb.g, secondaryRgb.b);
  const secondaryPalette = generateTonalPalette(secondaryColor);
  
  // Generate tertiary palette (shift hue by 120 degrees)
  const tertiaryHue = (primaryHsl.h + 120) % 360;
  const tertiaryRgb = hslToRgb(tertiaryHue, primaryHsl.s * 0.8, primaryHsl.l);
  const tertiaryColor = rgbToHex(tertiaryRgb.r, tertiaryRgb.g, tertiaryRgb.b);
  const tertiaryPalette = generateTonalPalette(tertiaryColor);
  
  // Generate neutral palettes
  const neutralRgb = hslToRgb(primaryHsl.h, 5, 50);
  const neutralColor = rgbToHex(neutralRgb.r, neutralRgb.g, neutralRgb.b);
  const neutralPalette = generateTonalPalette(neutralColor);
  
  const neutralVariantRgb = hslToRgb(primaryHsl.h, 10, 50);
  const neutralVariantColor = rgbToHex(neutralVariantRgb.r, neutralVariantRgb.g, neutralVariantRgb.b);
  const neutralVariantPalette = generateTonalPalette(neutralVariantColor);

  if (mode === 'light') {
    return {
      primary: primaryPalette[40]!,
      onPrimary: primaryPalette[100]!,
      primaryContainer: primaryPalette[90]!,
      onPrimaryContainer: primaryPalette[10]!,
      
      secondary: secondaryPalette[40]!,
      onSecondary: secondaryPalette[100]!,
      secondaryContainer: secondaryPalette[90]!,
      onSecondaryContainer: secondaryPalette[10]!,
      
      tertiary: tertiaryPalette[40]!,
      onTertiary: tertiaryPalette[100]!,
      tertiaryContainer: tertiaryPalette[90]!,
      onTertiaryContainer: tertiaryPalette[10]!,
      
      surface: neutralPalette[99]!,
      onSurface: neutralPalette[10]!,
      surfaceVariant: neutralVariantPalette[90]!,
      onSurfaceVariant: neutralVariantPalette[30]!,
      
      background: neutralPalette[99]!,
      onBackground: neutralPalette[10]!,
      
      outline: neutralVariantPalette[50]!,
      outlineVariant: neutralVariantPalette[80]!,
      
      inverseSurface: neutralPalette[20]!,
      inverseOnSurface: neutralPalette[95]!,
      inversePrimary: primaryPalette[80]!
    };
  } else {
    return {
      primary: primaryPalette[80]!,
      onPrimary: primaryPalette[20]!,
      primaryContainer: primaryPalette[30]!,
      onPrimaryContainer: primaryPalette[90]!,
      
      secondary: secondaryPalette[80]!,
      onSecondary: secondaryPalette[20]!,
      secondaryContainer: secondaryPalette[30]!,
      onSecondaryContainer: secondaryPalette[90]!,
      
      tertiary: tertiaryPalette[80]!,
      onTertiary: tertiaryPalette[20]!,
      tertiaryContainer: tertiaryPalette[30]!,
      onTertiaryContainer: tertiaryPalette[90]!,
      
      surface: neutralPalette[10]!,
      onSurface: neutralPalette[90]!,
      surfaceVariant: neutralVariantPalette[30]!,
      onSurfaceVariant: neutralVariantPalette[80]!,
      
      background: neutralPalette[10]!,
      onBackground: neutralPalette[90]!,
      
      outline: neutralVariantPalette[60]!,
      outlineVariant: neutralVariantPalette[30]!,
      
      inverseSurface: neutralPalette[90]!,
      inverseOnSurface: neutralPalette[20]!,
      inversePrimary: primaryPalette[40]!
    };
  }
}

/**
 * Apply a color scheme to CSS custom properties
 */
export function applyColorScheme(scheme: Material3ColorScheme, prefix: string = '--m3-color'): void {
  const root = document.documentElement;
  
  Object.entries(scheme).forEach(([key, value]) => {
    const kebabKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
    root.style.setProperty(`${prefix}-${kebabKey}`, value as string);
  });
}

/**
 * Get the current theme mode
 */
export function getCurrentTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  
  // Check for explicit theme setting
  const htmlElement = document.documentElement;
  if (htmlElement.classList.contains('dark') || htmlElement.classList.contains('dark-mode')) {
    return 'dark';
  }
  
  if (htmlElement.getAttribute('data-theme') === 'dark') {
    return 'dark';
  }
  
  // Check system preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  
  return 'light';
}

/**
 * Toggle between light and dark themes
 */
export function toggleTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  
  const htmlElement = document.documentElement;
  const currentTheme = getCurrentTheme();
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  
  // Remove existing theme classes
  htmlElement.classList.remove('light', 'dark', 'light-mode', 'dark-mode');
  htmlElement.removeAttribute('data-theme');
  
  // Apply new theme
  if (newTheme === 'dark') {
    htmlElement.classList.add('dark-mode');
    htmlElement.setAttribute('data-theme', 'dark');
  } else {
    htmlElement.classList.add('light-mode');
    htmlElement.setAttribute('data-theme', 'light');
  }
  
  return newTheme;
}

/**
 * Get a CSS custom property value
 */
export function getCSSCustomProperty(property: string): string {
  if (typeof window === 'undefined') return '';
  
  return getComputedStyle(document.documentElement)
    .getPropertyValue(property)
    .trim();
}

/**
 * Set a CSS custom property value
 */
export function setCSSCustomProperty(property: string, value: string): void {
  if (typeof window === 'undefined') return;
  
  document.documentElement.style.setProperty(property, value);
}

/**
 * Get a Material 3 color by role
 */
export function getMaterial3Color(role: Material3ColorRole): string {
  const cssVar = `--m3-color-${role.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
  return getCSSCustomProperty(cssVar);
}

/**
 * Validate color accessibility for Material 3 roles
 */
export function validateColorAccessibility(scheme: Material3ColorScheme): {
  valid: boolean;
  issues: string[];
} {
  const issues: string[] = [];
  
  // Check primary color combinations
  if (!meetsContrastRequirement(scheme.onPrimary, scheme.primary)) {
    issues.push('Primary color combination does not meet WCAG AA contrast requirements');
  }
  
  if (!meetsContrastRequirement(scheme.onPrimaryContainer, scheme.primaryContainer)) {
    issues.push('Primary container color combination does not meet WCAG AA contrast requirements');
  }
  
  // Check secondary color combinations
  if (!meetsContrastRequirement(scheme.onSecondary, scheme.secondary)) {
    issues.push('Secondary color combination does not meet WCAG AA contrast requirements');
  }
  
  if (!meetsContrastRequirement(scheme.onSecondaryContainer, scheme.secondaryContainer)) {
    issues.push('Secondary container color combination does not meet WCAG AA contrast requirements');
  }
  
  // Check tertiary color combinations
  if (!meetsContrastRequirement(scheme.onTertiary, scheme.tertiary)) {
    issues.push('Tertiary color combination does not meet WCAG AA contrast requirements');
  }
  
  if (!meetsContrastRequirement(scheme.onTertiaryContainer, scheme.tertiaryContainer)) {
    issues.push('Tertiary container color combination does not meet WCAG AA contrast requirements');
  }
  
  // Check surface color combinations
  if (!meetsContrastRequirement(scheme.onSurface, scheme.surface)) {
    issues.push('Surface color combination does not meet WCAG AA contrast requirements');
  }
  
  if (!meetsContrastRequirement(scheme.onSurfaceVariant, scheme.surfaceVariant)) {
    issues.push('Surface variant color combination does not meet WCAG AA contrast requirements');
  }
  
  // Check background color combinations
  if (!meetsContrastRequirement(scheme.onBackground, scheme.background)) {
    issues.push('Background color combination does not meet WCAG AA contrast requirements');
  }
  
  return {
    valid: issues.length === 0,
    issues
  };
}

/**
 * Color utility constants
 */
export const COLOR_UTILS = {
  // Material 3 color roles
  ROLES: [
    'primary', 'onPrimary', 'primaryContainer', 'onPrimaryContainer',
    'secondary', 'onSecondary', 'secondaryContainer', 'onSecondaryContainer',
    'tertiary', 'onTertiary', 'tertiaryContainer', 'onTertiaryContainer',
    'surface', 'onSurface', 'surfaceVariant', 'onSurfaceVariant',
    'background', 'onBackground', 'outline', 'outlineVariant',
    'inverseSurface', 'inverseOnSurface', 'inversePrimary'
  ] as const,
  
  // Tonal palette tones
  TONES: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 99, 100] as const,
  
  // WCAG contrast levels
  CONTRAST_LEVELS: {
    AA_NORMAL: 4.5,
    AA_LARGE: 3,
    AAA_NORMAL: 7,
    AAA_LARGE: 4.5
  } as const
} as const;