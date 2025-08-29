/**
 * @jest-environment jsdom
 */

import {
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  getLuminance,
  getContrastRatio,
  meetsContrastRequirement,
  generateTonalPalette,
  generateColorScheme,
  applyColorScheme,
  getCurrentTheme,
  toggleTheme,
  getCSSCustomProperty,
  setCSSCustomProperty,
  getMaterial3Color,
  validateColorAccessibility,
  COLOR_UTILS
} from '../color-utils';

describe('Material 3 Color Utilities', () => {
  beforeEach(() => {
    // Reset DOM and styles before each test
    document.documentElement.className = '';
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.style.cssText = '';
  });

  describe('Color conversion utilities', () => {
    test('hexToRgb converts hex colors to RGB', () => {
      expect(hexToRgb('#ff0000')).toEqual({ r: 255, g: 0, b: 0 });
      expect(hexToRgb('#00ff00')).toEqual({ r: 0, g: 255, b: 0 });
      expect(hexToRgb('#0000ff')).toEqual({ r: 0, g: 0, b: 255 });
      expect(hexToRgb('#ffffff')).toEqual({ r: 255, g: 255, b: 255 });
      expect(hexToRgb('#000000')).toEqual({ r: 0, g: 0, b: 0 });
      expect(hexToRgb('invalid')).toBeNull();
    });

    test('rgbToHex converts RGB values to hex', () => {
      expect(rgbToHex(255, 0, 0)).toBe('#ff0000');
      expect(rgbToHex(0, 255, 0)).toBe('#00ff00');
      expect(rgbToHex(0, 0, 255)).toBe('#0000ff');
      expect(rgbToHex(255, 255, 255)).toBe('#ffffff');
      expect(rgbToHex(0, 0, 0)).toBe('#000000');
    });

    test('rgbToHsl converts RGB to HSL', () => {
      const red = rgbToHsl(255, 0, 0);
      expect(red.h).toBeCloseTo(0);
      expect(red.s).toBeCloseTo(100);
      expect(red.l).toBeCloseTo(50);

      const green = rgbToHsl(0, 255, 0);
      expect(green.h).toBeCloseTo(120);
      expect(green.s).toBeCloseTo(100);
      expect(green.l).toBeCloseTo(50);

      const blue = rgbToHsl(0, 0, 255);
      expect(blue.h).toBeCloseTo(240);
      expect(blue.s).toBeCloseTo(100);
      expect(blue.l).toBeCloseTo(50);
    });

    test('hslToRgb converts HSL to RGB', () => {
      const red = hslToRgb(0, 100, 50);
      expect(red.r).toBe(255);
      expect(red.g).toBe(0);
      expect(red.b).toBe(0);

      const green = hslToRgb(120, 100, 50);
      expect(green.r).toBe(0);
      expect(green.g).toBe(255);
      expect(green.b).toBe(0);

      const blue = hslToRgb(240, 100, 50);
      expect(blue.r).toBe(0);
      expect(blue.g).toBe(0);
      expect(blue.b).toBe(255);
    });
  });

  describe('Accessibility utilities', () => {
    test('getLuminance calculates relative luminance', () => {
      expect(getLuminance(255, 255, 255)).toBeCloseTo(1, 2); // White
      expect(getLuminance(0, 0, 0)).toBeCloseTo(0, 2); // Black
      expect(getLuminance(255, 0, 0)).toBeGreaterThan(0); // Red
    });

    test('getContrastRatio calculates contrast ratio between colors', () => {
      const whiteBlackRatio = getContrastRatio('#ffffff', '#000000');
      expect(whiteBlackRatio).toBeCloseTo(21, 0); // Perfect contrast

      const sameColorRatio = getContrastRatio('#ff0000', '#ff0000');
      expect(sameColorRatio).toBe(1); // Same color
    });

    test('meetsContrastRequirement validates WCAG compliance', () => {
      // High contrast should pass all levels
      expect(meetsContrastRequirement('#ffffff', '#000000', 'AA')).toBe(true);
      expect(meetsContrastRequirement('#ffffff', '#000000', 'AAA')).toBe(true);

      // Low contrast should fail
      expect(meetsContrastRequirement('#cccccc', '#ffffff', 'AA')).toBe(false);
      expect(meetsContrastRequirement('#cccccc', '#ffffff', 'AAA')).toBe(false);
    });
  });

  describe('Tonal palette generation', () => {
    test('generateTonalPalette creates Material 3 tonal palette', () => {
      const palette = generateTonalPalette('#0070f3');
      
      // Should have all required tones
      expect(palette).toHaveProperty('0');
      expect(palette).toHaveProperty('10');
      expect(palette).toHaveProperty('20');
      expect(palette).toHaveProperty('30');
      expect(palette).toHaveProperty('40');
      expect(palette).toHaveProperty('50');
      expect(palette).toHaveProperty('60');
      expect(palette).toHaveProperty('70');
      expect(palette).toHaveProperty('80');
      expect(palette).toHaveProperty('90');
      expect(palette).toHaveProperty('95');
      expect(palette).toHaveProperty('99');
      expect(palette).toHaveProperty('100');

      // Tone 0 should be black, tone 100 should be white
      expect(palette[0]).toBe('#000000');
      expect(palette[100]).toBe('#ffffff');
    });

    test('generateTonalPalette throws error for invalid color', () => {
      expect(() => generateTonalPalette('invalid')).toThrow('Invalid source color');
    });
  });

  describe('Color scheme generation', () => {
    test('generateColorScheme creates complete light color scheme', () => {
      const scheme = generateColorScheme('#0070f3', 'light');
      
      // Should have all required properties
      expect(scheme).toHaveProperty('primary');
      expect(scheme).toHaveProperty('onPrimary');
      expect(scheme).toHaveProperty('primaryContainer');
      expect(scheme).toHaveProperty('onPrimaryContainer');
      expect(scheme).toHaveProperty('secondary');
      expect(scheme).toHaveProperty('onSecondary');
      expect(scheme).toHaveProperty('secondaryContainer');
      expect(scheme).toHaveProperty('onSecondaryContainer');
      expect(scheme).toHaveProperty('tertiary');
      expect(scheme).toHaveProperty('onTertiary');
      expect(scheme).toHaveProperty('tertiaryContainer');
      expect(scheme).toHaveProperty('onTertiaryContainer');
      expect(scheme).toHaveProperty('surface');
      expect(scheme).toHaveProperty('onSurface');
      expect(scheme).toHaveProperty('surfaceVariant');
      expect(scheme).toHaveProperty('onSurfaceVariant');
      expect(scheme).toHaveProperty('background');
      expect(scheme).toHaveProperty('onBackground');
      expect(scheme).toHaveProperty('outline');
      expect(scheme).toHaveProperty('outlineVariant');
      expect(scheme).toHaveProperty('inverseSurface');
      expect(scheme).toHaveProperty('inverseOnSurface');
      expect(scheme).toHaveProperty('inversePrimary');

      // All values should be valid hex colors
      Object.values(scheme).forEach(color => {
        expect(color).toMatch(/^#[0-9a-f]{6}$/i);
      });
    });

    test('generateColorScheme creates complete dark color scheme', () => {
      const scheme = generateColorScheme('#0070f3', 'dark');
      
      // Should have all required properties (same as light)
      expect(Object.keys(scheme)).toHaveLength(23);
      
      // All values should be valid hex colors
      Object.values(scheme).forEach(color => {
        expect(color).toMatch(/^#[0-9a-f]{6}$/i);
      });
    });
  });

  describe('Theme utilities', () => {
    test('getCurrentTheme detects theme from DOM', () => {
      // Default should be light
      expect(getCurrentTheme()).toBe('light');

      // Test dark class
      document.documentElement.classList.add('dark');
      expect(getCurrentTheme()).toBe('dark');
      document.documentElement.classList.remove('dark');

      // Test dark-mode class
      document.documentElement.classList.add('dark-mode');
      expect(getCurrentTheme()).toBe('dark');
      document.documentElement.classList.remove('dark-mode');

      // Test data-theme attribute
      document.documentElement.setAttribute('data-theme', 'dark');
      expect(getCurrentTheme()).toBe('dark');
    });

    test('toggleTheme switches between light and dark', () => {
      // Start with light theme
      expect(getCurrentTheme()).toBe('light');

      // Toggle to dark
      const newTheme = toggleTheme();
      expect(newTheme).toBe('dark');
      expect(getCurrentTheme()).toBe('dark');

      // Toggle back to light
      const lightTheme = toggleTheme();
      expect(lightTheme).toBe('light');
      expect(getCurrentTheme()).toBe('light');
    });

    test('applyColorScheme sets CSS custom properties', () => {
      const scheme = generateColorScheme('#0070f3', 'light');
      applyColorScheme(scheme);

      // Check that properties are set
      expect(document.documentElement.style.getPropertyValue('--m3-color-primary')).toBeTruthy();
      expect(document.documentElement.style.getPropertyValue('--m3-color-on-primary')).toBeTruthy();
      expect(document.documentElement.style.getPropertyValue('--m3-color-surface')).toBeTruthy();
    });
  });

  describe('CSS property utilities', () => {
    test('setCSSCustomProperty and getCSSCustomProperty work together', () => {
      const testProperty = '--test-property';
      const testValue = '#ff0000';

      setCSSCustomProperty(testProperty, testValue);
      expect(getCSSCustomProperty(testProperty)).toBe(testValue);
    });

    test('getMaterial3Color retrieves Material 3 color values', () => {
      // Set a test color
      setCSSCustomProperty('--m3-color-primary', '#0070f3');
      
      // Should return the color value
      expect(getMaterial3Color('primary')).toBe('#0070f3');
    });
  });

  describe('Color scheme validation', () => {
    test('validateColorAccessibility checks WCAG compliance', () => {
      const highContrastScheme = generateColorScheme('#0070f3', 'light');
      const validation = validateColorAccessibility(highContrastScheme);
      
      expect(validation).toHaveProperty('valid');
      expect(validation).toHaveProperty('issues');
      expect(Array.isArray(validation.issues)).toBe(true);
    });
  });

  describe('Color utility constants', () => {
    test('COLOR_UTILS contains expected constants', () => {
      expect(COLOR_UTILS.ROLES).toContain('primary');
      expect(COLOR_UTILS.ROLES).toContain('secondary');
      expect(COLOR_UTILS.ROLES).toContain('surface');

      expect(COLOR_UTILS.TONES).toContain(0);
      expect(COLOR_UTILS.TONES).toContain(50);
      expect(COLOR_UTILS.TONES).toContain(100);

      expect(COLOR_UTILS.CONTRAST_LEVELS.AA_NORMAL).toBe(4.5);
      expect(COLOR_UTILS.CONTRAST_LEVELS.AAA_NORMAL).toBe(7);
    });
  });

  describe('Edge cases and error handling', () => {
    test('handles invalid hex colors gracefully', () => {
      expect(hexToRgb('not-a-color')).toBeNull();
      expect(hexToRgb('')).toBeNull();
      expect(hexToRgb('#zzz')).toBeNull();
    });

    test('handles extreme RGB values', () => {
      expect(rgbToHex(300, -10, 500)).toBe('#2bf7f4'); // JavaScript bitwise operations handle overflow
    });

    test('works in server-side rendering context', () => {
      // Mock missing window object
      const originalWindow = global.window;
      // @ts-expect-error - Intentionally testing server-side context
      delete global.window;

      expect(getCurrentTheme()).toBe('light');
      
      // Restore window
      global.window = originalWindow;
    });
  });
});