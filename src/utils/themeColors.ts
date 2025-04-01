'use client';

import { getIsDarkMode } from '../hooks/useTheme';

// Color set interface for typed color objects
export interface ColorSet {
  background: string;
  text: string;
  border: string;
}

// Theme-aware color sets with both light and dark variants
export interface ThemeColorSet {
  light: ColorSet;
  dark: ColorSet;
}

// Internal HSL colors with dark mode consideration
// Each color has a light and dark mode variation defined in the same group
export const themeColorSets: ThemeColorSet[] = [
  // Green - Hue: 120
  {
    light: {
      background: 'hsl(120, 60%, 95%)',
      text: 'hsl(120, 60%, 25%)',
      border: 'hsl(120, 60%, 35%)'
    },
    dark: {
      background: 'hsl(120, 60%, 20%)',
      text: 'hsl(120, 60%, 85%)',
      border: 'hsl(120, 60%, 40%)'
    }
  },
  // Blue - Hue: 210
  {
    light: {
      background: 'hsl(210, 100%, 95%)',
      text: 'hsl(210, 100%, 30%)',
      border: 'hsl(210, 83%, 45%)'
    },
    dark: {
      background: 'hsl(210, 100%, 20%)',
      text: 'hsl(210, 100%, 85%)',
      border: 'hsl(210, 83%, 50%)'
    }
  },
  // Orange - Hue: 30
  {
    light: {
      background: 'hsl(30, 100%, 95%)',
      text: 'hsl(30, 100%, 30%)',
      border: 'hsl(30, 100%, 45%)'
    },
    dark: {
      background: 'hsl(30, 100%, 20%)',
      text: 'hsl(30, 100%, 85%)',
      border: 'hsl(30, 100%, 50%)'
    }
  },
  // Purple - Hue: 280
  {
    light: {
      background: 'hsl(280, 100%, 95%)',
      text: 'hsl(280, 100%, 30%)',
      border: 'hsl(280, 67%, 45%)'
    },
    dark: {
      background: 'hsl(280, 100%, 20%)',
      text: 'hsl(280, 100%, 85%)',
      border: 'hsl(280, 67%, 50%)'
    }
  },
  // Red - Hue: 0
  {
    light: {
      background: 'hsl(0, 100%, 95%)',
      text: 'hsl(0, 100%, 30%)',
      border: 'hsl(0, 100%, 40%)'
    },
    dark: {
      background: 'hsl(0, 100%, 20%)',
      text: 'hsl(0, 100%, 85%)',
      border: 'hsl(0, 100%, 45%)'
    }
  },
  // Cyan - Hue: 180
  {
    light: {
      background: 'hsl(180, 100%, 95%)',
      text: 'hsl(180, 100%, 20%)',
      border: 'hsl(180, 100%, 30%)'
    },
    dark: {
      background: 'hsl(180, 100%, 20%)',
      text: 'hsl(180, 100%, 85%)',
      border: 'hsl(180, 100%, 35%)'
    }
  },
  // Amber - Hue: 45
  {
    light: {
      background: 'hsl(45, 100%, 95%)',
      text: 'hsl(45, 100%, 30%)',
      border: 'hsl(45, 100%, 40%)'
    },
    dark: {
      background: 'hsl(45, 100%, 20%)',
      text: 'hsl(45, 100%, 85%)',
      border: 'hsl(45, 100%, 45%)'
    }
  },
  // Light-green - Hue: 90
  {
    light: {
      background: 'hsl(90, 100%, 95%)',
      text: 'hsl(90, 100%, 25%)',
      border: 'hsl(90, 100%, 35%)'
    },
    dark: {
      background: 'hsl(90, 100%, 20%)',
      text: 'hsl(90, 100%, 85%)',
      border: 'hsl(90, 100%, 40%)'
    }
  },
  // Indigo - Hue: 240
  {
    light: {
      background: 'hsl(240, 100%, 95%)',
      text: 'hsl(240, 100%, 25%)',
      border: 'hsl(240, 100%, 40%)'
    },
    dark: {
      background: 'hsl(240, 100%, 20%)',
      text: 'hsl(240, 100%, 85%)',
      border: 'hsl(240, 100%, 45%)'
    }
  },
  // Pink - Hue: 330
  {
    light: {
      background: 'hsl(330, 100%, 95%)',
      text: 'hsl(330, 100%, 30%)',
      border: 'hsl(330, 100%, 40%)'
    },
    dark: {
      background: 'hsl(330, 100%, 20%)',
      text: 'hsl(330, 100%, 85%)',
      border: 'hsl(330, 100%, 45%)'
    }
  },
  // Brown - Hue: 20
  {
    light: {
      background: 'hsl(20, 20%, 95%)',
      text: 'hsl(20, 20%, 25%)',
      border: 'hsl(20, 20%, 35%)'
    },
    dark: {
      background: 'hsl(20, 20%, 20%)',
      text: 'hsl(20, 20%, 85%)',
      border: 'hsl(20, 20%, 40%)'
    }
  },
  // Teal - Hue: 165
  {
    light: {
      background: 'hsl(165, 100%, 95%)',
      text: 'hsl(165, 100%, 25%)',
      border: 'hsl(165, 100%, 30%)'
    },
    dark: {
      background: 'hsl(165, 100%, 20%)',
      text: 'hsl(165, 100%, 85%)',
      border: 'hsl(165, 100%, 35%)'
    }
  }
];

// Cache to track used color indexes
const usedColorIndexes = new Set<number>();

/**
 * Get theme-appropriate colors for the current theme
 * @returns An array of ColorSets for the current theme
 */
export function getThemeColors(): ColorSet[] {
  const isDark = getIsDarkMode();
  
  return themeColorSets.map(colorSet => {
    return isDark ? colorSet.dark : colorSet.light;
  });
}

/**
 * Get a random color set appropriate for the current theme
 * @returns A random ColorSet
 */
export function getRandomColorSet(): ColorSet {
  const colors = getThemeColors();
  
  if (usedColorIndexes.size === colors.length) {
    usedColorIndexes.clear();
  }
  
  const availableIndices = Array.from({ length: colors.length }, (_, i) => i)
    .filter(index => !usedColorIndexes.has(index));
    
  const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
  usedColorIndexes.add(randomIndex);
  
  return colors[randomIndex];
}

/**
 * Get the next available color set
 * @param specificIndex Optional specific index to use (overrides the next available logic)
 * @returns A ColorSet
 */
export function getNextColorSet(specificIndex?: number): ColorSet {
  const colors = getThemeColors();
  
  if (specificIndex !== undefined && specificIndex >= 0 && specificIndex < colors.length) {
    // Return the specific color index requested
    return colors[specificIndex];
  }
  
  if (usedColorIndexes.size === colors.length) {
    usedColorIndexes.clear();
  }
  
  const availableIndex = Array.from({ length: colors.length }, (_, i) => i)
    .find(index => !usedColorIndexes.has(index)) || 0;
  usedColorIndexes.add(availableIndex);
  
  return colors[availableIndex];
}

/**
 * Parse an HSL color string into its components
 * @param hsl HSL color string in the format 'hsl(h, s%, l%)'
 * @returns [hue, saturation, lightness] values
 */
export function parseHSL(hsl: string): [number, number, number] {
  const regex = /hsl\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)/;
  const match = hsl.match(regex);
  
  if (!match) {
    throw new Error(`Invalid HSL color format: ${hsl}`);
  }
  
  return [
    parseInt(match[1], 10),
    parseInt(match[2], 10),
    parseInt(match[3], 10)
  ];
}

/**
 * Create an HSL color string from components
 * @param h Hue (0-360)
 * @param s Saturation (0-100)
 * @param l Lightness (0-100)
 * @returns HSL color string
 */
export function createHSL(h: number, s: number, l: number): string {
  return `hsl(${h}, ${s}%, ${l}%)`;
}

/**
 * Adjust the lightness of an HSL color
 * @param hsl HSL color string
 * @param amount Amount to adjust lightness (-100 to 100)
 * @returns New HSL color string
 */
export function adjustLightness(hsl: string, amount: number): string {
  const [h, s, l] = parseHSL(hsl);
  const newL = Math.max(0, Math.min(100, l + amount));
  return createHSL(h, s, newL);
}

/**
 * Adjust the saturation of an HSL color
 * @param hsl HSL color string
 * @param amount Amount to adjust saturation (-100 to 100)
 * @returns New HSL color string
 */
export function adjustSaturation(hsl: string, amount: number): string {
  const [h, s, l] = parseHSL(hsl);
  const newS = Math.max(0, Math.min(100, s + amount));
  return createHSL(h, newS, l);
}

/**
 * Convert HSL to RGB values
 * @param h Hue (0-360)
 * @param s Saturation (0-100)
 * @param l Lightness (0-100)
 * @returns [r, g, b] values (0-255)
 */
export function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [255 * f(0), 255 * f(8), 255 * f(4)];
}

/**
 * Convert RGB to HSL values
 * @param r Red (0-255)
 * @param g Green (0-255)
 * @param b Blue (0-255)
 * @returns [h, s, l] values (h: 0-360, s: 0-100, l: 0-100)
 */
export function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h *= 60;
  }

  return [Math.round(h), Math.round(s * 100), Math.round(l * 100)];
}

/**
 * Calculate relative luminance for RGB values (WCAG formula)
 * @param r Red (0-255)
 * @param g Green (0-255)
 * @param b Blue (0-255)
 * @returns Relative luminance (0-1)
 */
export function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate contrast ratio between two colors
 * @param color1 First color (any valid CSS color)
 * @param color2 Second color (any valid CSS color)
 * @returns Contrast ratio (1-21)
 */
export function getContrastRatio(color1: string, color2: string): number {
  const [h1, s1, l1] = parseHSL(color1);
  const [h2, s2, l2] = parseHSL(color2);

  const rgb1 = hslToRgb(h1, s1, l1);
  const rgb2 = hslToRgb(h2, s2, l2);

  const l1lum = getLuminance(...rgb1);
  const l2lum = getLuminance(...rgb2);

  const lighter = Math.max(l1lum, l2lum);
  const darker = Math.min(l1lum, l2lum);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if a color combination meets WCAG contrast requirements
 * @param background Background color
 * @param text Text color
 * @param wcagLevel WCAG compliance level ('AA' or 'AAA')
 * @returns boolean indicating if the combination passes the contrast check
 */
export function validateContrast(
  background: string, 
  text: string, 
  wcagLevel: 'AA' | 'AAA' = 'AA'
): boolean {
  const ratio = getContrastRatio(background, text);
  // WCAG 2.1 Level AA requires:
  // - 4.5:1 for normal text
  // - 3:1 for large text
  // Level AAA requires:
  // - 7:1 for normal text
  // - 4.5:1 for large text
  const minRatio = wcagLevel === 'AA' ? 4.5 : 7.0;
  return ratio >= minRatio;
}

/**
 * Validate theme colors for accessibility
 * @returns Object with validation results
 */
export function validateThemeColors(): { valid: boolean, issues: string[] } {
  const issues: string[] = [];
  
  if (typeof window === 'undefined') {
    return { valid: true, issues: [] }; // Skip validation during SSR
  }
  
  const isDark = getIsDarkMode();
  const vars = getComputedStyle(document.documentElement);
  
  try {
    // Get CSS variables
    const background = vars.getPropertyValue('--background').trim() || 'hsl(220, 20%, 98%)';
    const foreground = vars.getPropertyValue('--foreground').trim() || 'hsl(220, 15%, 12%)';
    const backgroundMuted = vars.getPropertyValue('--background-muted').trim() || 'hsl(220, 20%, 94%)';
    const foregroundMuted = vars.getPropertyValue('--foreground-muted').trim() || 'hsl(220, 10%, 35%)';
    
    // Check main contrast
    const mainRatio = getContrastRatio(background, foreground);
    if (mainRatio < 4.5) {
      issues.push(`Main contrast ratio is ${mainRatio.toFixed(2)}:1, which is below the AA standard of 4.5:1`);
    }
    
    // Check muted contrast
    const mutedRatio = getContrastRatio(backgroundMuted, foregroundMuted);
    if (mutedRatio < 4.5) {
      issues.push(`Muted contrast ratio is ${mutedRatio.toFixed(2)}:1, which is below the AA standard of 4.5:1`);
    }
    
    // Only log if not in test environment
    if (process.env.NODE_ENV !== 'test') {
      console.group(`Theme Contrast Validation (${isDark ? 'Dark' : 'Light'} Mode)`);
      console.log('Main contrast ratio:', mainRatio.toFixed(2) + ':1');
      console.log('Muted contrast ratio:', mutedRatio.toFixed(2) + ':1');
      console.groupEnd();
    }
    
    return {
      valid: issues.length === 0,
      issues
    };
  } catch (error) {
    // Silently handle errors in test environment
    if (process.env.NODE_ENV !== 'test') {
      console.error('Error validating theme colors:', error);
    }
    
    return {
      valid: false,
      issues: [`Error validating theme colors: ${error}`]
    };
  }
}