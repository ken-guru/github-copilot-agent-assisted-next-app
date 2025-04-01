/**
 * Utilities for color manipulation, contrast calculation, and accessibility validation
 */

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
  
  // Special case for grayscale (saturation = 0)
  if (s === 0) {
    const gray = Math.round(l * 255);
    return [gray, gray, gray]; // Return rounded integers
  }
  
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    
  // Return rounded integer values for RGB
  return [
    Math.round(255 * f(0)),
    Math.round(255 * f(8)),
    Math.round(255 * f(4))
  ];
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
 * @param color1 First color (HSL format)
 * @param color2 Second color (HSL format)
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
 * @param background Background color (HSL format)
 * @param text Text color (HSL format)
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
 * Validate theme colors for accessibility based on CSS variables
 * @returns Object with validation results
 */
export function validateThemeColors(): { valid: boolean, issues: string[] } {
  const issues: string[] = [];
  
  if (typeof window === 'undefined') {
    return { valid: true, issues: [] }; // Skip validation during SSR
  }
  
  const isDark = document.documentElement.classList.contains('dark-mode');
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