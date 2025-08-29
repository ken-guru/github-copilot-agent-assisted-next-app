/**
 * Unit tests for Material 3 Expressive Dynamic Color System
 */

import {
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  getRelativeLuminance,
  getContrastRatio,
  validateColorContrast,
  generateTonalPalette,
  generateDynamicColorScheme,
  getSemanticColorRoles,
  getContextualColor,
  generateColorCSSProperties,
  validateColorSchemeAccessibility,
  useMaterial3Color,
  type HSLColor,
  type RGBColor,
  type TonalPalette,
  type DynamicColorScheme,
  type ContrastValidationResult,
  type InterfaceState,
  type Material3ColorRole
} from '../material3-color-system';

describe('Color Conversion Utilities', () => {
  describe('hexToRgb', () => {
    it('should convert hex to RGB correctly', () => {
      expect(hexToRgb('#ff0000')).toEqual({ r: 255, g: 0, b: 0 });
      expect(hexToRgb('#00ff00')).toEqual({ r: 0, g: 255, b: 0 });
      expect(hexToRgb('#0000ff')).toEqual({ r: 0, g: 0, b: 255 });
      expect(hexToRgb('#ffffff')).toEqual({ r: 255, g: 255, b: 255 });
      expect(hexToRgb('#000000')).toEqual({ r: 0, g: 0, b: 0 });
    });

    it('should handle hex without # prefix', () => {
      expect(hexToRgb('ff0000')).toEqual({ r: 255, g: 0, b: 0 });
    });

    it('should return null for invalid hex', () => {
      expect(hexToRgb('invalid')).toBeNull();
      expect(hexToRgb('#gggggg')).toBeNull();
    });
  });

  describe('rgbToHex', () => {
    it('should convert RGB to hex correctly', () => {
      expect(rgbToHex({ r: 255, g: 0, b: 0 })).toBe('#ff0000');
      expect(rgbToHex({ r: 0, g: 255, b: 0 })).toBe('#00ff00');
      expect(rgbToHex({ r: 0, g: 0, b: 255 })).toBe('#0000ff');
      expect(rgbToHex({ r: 255, g: 255, b: 255 })).toBe('#ffffff');
      expect(rgbToHex({ r: 0, g: 0, b: 0 })).toBe('#000000');
    });

    it('should handle decimal values by rounding', () => {
      expect(rgbToHex({ r: 255.7, g: 0.3, b: 0.8 })).toBe('#ff0001');
    });
  });

  describe('rgbToHsl and hslToRgb', () => {
    it('should convert RGB to HSL correctly', () => {
      const red = rgbToHsl({ r: 255, g: 0, b: 0 });
      expect(red.h).toBe(0);
      expect(red.s).toBe(100);
      expect(red.l).toBe(50);

      const white = rgbToHsl({ r: 255, g: 255, b: 255 });
      expect(white.h).toBe(0);
      expect(white.s).toBe(0);
      expect(white.l).toBe(100);

      const black = rgbToHsl({ r: 0, g: 0, b: 0 });
      expect(black.h).toBe(0);
      expect(black.s).toBe(0);
      expect(black.l).toBe(0);
    });

    it('should convert HSL to RGB correctly', () => {
      const red = hslToRgb({ h: 0, s: 100, l: 50 });
      expect(red.r).toBe(255);
      expect(red.g).toBe(0);
      expect(red.b).toBe(0);

      const white = hslToRgb({ h: 0, s: 0, l: 100 });
      expect(white.r).toBe(255);
      expect(white.g).toBe(255);
      expect(white.b).toBe(255);

      const black = hslToRgb({ h: 0, s: 0, l: 0 });
      expect(black.r).toBe(0);
      expect(black.g).toBe(0);
      expect(black.b).toBe(0);
    });

    it('should maintain consistency in round-trip conversions', () => {
      const originalRgb = { r: 128, g: 64, b: 192 };
      const hsl = rgbToHsl(originalRgb);
      const convertedRgb = hslToRgb(hsl);
      
      // Allow for small rounding differences
      expect(Math.abs(convertedRgb.r - originalRgb.r)).toBeLessThanOrEqual(1);
      expect(Math.abs(convertedRgb.g - originalRgb.g)).toBeLessThanOrEqual(1);
      expect(Math.abs(convertedRgb.b - originalRgb.b)).toBeLessThanOrEqual(1);
    });
  });
});

describe('Contrast and Accessibility', () => {
  describe('getRelativeLuminance', () => {
    it('should calculate relative luminance correctly', () => {
      const whiteLuminance = getRelativeLuminance({ r: 255, g: 255, b: 255 });
      const blackLuminance = getRelativeLuminance({ r: 0, g: 0, b: 0 });
      
      expect(whiteLuminance).toBeCloseTo(1, 2);
      expect(blackLuminance).toBeCloseTo(0, 2);
      expect(whiteLuminance).toBeGreaterThan(blackLuminance);
    });
  });

  describe('getContrastRatio', () => {
    it('should calculate contrast ratio correctly', () => {
      const whiteBlackRatio = getContrastRatio('#ffffff', '#000000');
      expect(whiteBlackRatio).toBeCloseTo(21, 0); // Maximum contrast ratio

      const sameColorRatio = getContrastRatio('#ff0000', '#ff0000');
      expect(sameColorRatio).toBe(1); // Same color has ratio of 1
    });

    it('should handle invalid colors gracefully', () => {
      const invalidRatio = getContrastRatio('invalid', '#000000');
      expect(invalidRatio).toBe(1);
    });
  });

  describe('validateColorContrast', () => {
    it('should validate WCAG AA compliance correctly', () => {
      const highContrast = validateColorContrast('#000000', '#ffffff');
      expect(highContrast.wcagAA).toBe(true);
      expect(highContrast.wcagAAA).toBe(true);
      expect(highContrast.ratio).toBeCloseTo(21, 0);

      const lowContrast = validateColorContrast('#888888', '#999999');
      expect(lowContrast.wcagAA).toBe(false);
      expect(lowContrast.wcagAAA).toBe(false);
      expect(lowContrast.recommendation).toContain('below WCAG AA minimum');
    });

    it('should handle large text requirements', () => {
      const mediumContrast = validateColorContrast('#666666', '#ffffff', true);
      // This should pass AA for large text (3:1) but might not pass for normal text (4.5:1)
      expect(typeof mediumContrast.wcagAA).toBe('boolean');
    });
  });
});

describe('Tonal Palette Generation', () => {
  describe('generateTonalPalette', () => {
    it('should generate a complete tonal palette', () => {
      const palette = generateTonalPalette('#6750a4');
      
      // Check that all tones are present
      const expectedTones = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 99, 100];
      expectedTones.forEach(tone => {
        expect(palette[tone as keyof TonalPalette]).toBeDefined();
        expect(typeof palette[tone as keyof TonalPalette]).toBe('string');
        expect(palette[tone as keyof TonalPalette]).toMatch(/^#[0-9a-f]{6}$/i);
      });

      // Check that tone 0 is darkest and tone 100 is lightest
      expect(palette[0]).toBe('#000000');
      expect(palette[100]).toBe('#ffffff');
    });

    it('should throw error for invalid base color', () => {
      expect(() => generateTonalPalette('invalid')).toThrow('Invalid base color');
    });
  });
});

describe('Dynamic Color Scheme Generation', () => {
  describe('generateDynamicColorScheme', () => {
    it('should generate a complete color scheme', () => {
      const scheme = generateDynamicColorScheme('#6750a4');
      
      // Check that all palettes are present
      expect(scheme.primary).toBeDefined();
      expect(scheme.secondary).toBeDefined();
      expect(scheme.tertiary).toBeDefined();
      expect(scheme.neutral).toBeDefined();
      expect(scheme.neutralVariant).toBeDefined();
      expect(scheme.error).toBeDefined();

      // Check that each palette has all required tones
      Object.values(scheme).forEach(palette => {
        expect(palette[0]).toBeDefined();
        expect(palette[50]).toBeDefined();
        expect(palette[100]).toBeDefined();
      });
    });

    it('should create harmonious color relationships', () => {
      const scheme = generateDynamicColorScheme('#6750a4');
      
      // Primary and secondary should be different
      expect(scheme.primary[50]).not.toBe(scheme.secondary[50]);
      expect(scheme.primary[50]).not.toBe(scheme.tertiary[50]);
      
      // Error should use standard Material 3 error color
      expect(scheme.error[40]).toBeDefined();
    });

    it('should throw error for invalid seed color', () => {
      expect(() => generateDynamicColorScheme('invalid')).toThrow('Invalid seed color');
    });
  });

  describe('getSemanticColorRoles', () => {
    it('should generate semantic color roles for light theme', () => {
      const scheme = generateDynamicColorScheme('#6750a4');
      const lightRoles = getSemanticColorRoles(scheme, 'light');
      
      // Check that all required roles are present
      expect(lightRoles.primary).toBeDefined();
      expect(lightRoles.onPrimary).toBeDefined();
      expect(lightRoles.surface).toBeDefined();
      expect(lightRoles.onSurface).toBeDefined();
      expect(lightRoles.background).toBeDefined();
      expect(lightRoles.onBackground).toBeDefined();

      // Check that colors are valid hex codes
      Object.values(lightRoles).forEach(color => {
        expect(color).toMatch(/^#[0-9a-f]{6}$/i);
      });
    });

    it('should generate different colors for dark theme', () => {
      const scheme = generateDynamicColorScheme('#6750a4');
      const lightRoles = getSemanticColorRoles(scheme, 'light');
      const darkRoles = getSemanticColorRoles(scheme, 'dark');
      
      // Primary colors should be different between themes
      expect(lightRoles.primary).not.toBe(darkRoles.primary);
      expect(lightRoles.surface).not.toBe(darkRoles.surface);
      expect(lightRoles.background).not.toBe(darkRoles.background);
    });
  });
});

describe('Contextual Color Application', () => {
  describe('getContextualColor', () => {
    const baseColor = '#6750a4';

    it('should return base color for default state', () => {
      const defaultColor = getContextualColor(baseColor, 'default');
      expect(defaultColor).toBe(baseColor);
    });

    it('should generate different colors for different states', () => {
      const hoverColor = getContextualColor(baseColor, 'hover');
      const focusColor = getContextualColor(baseColor, 'focus');
      const pressedColor = getContextualColor(baseColor, 'pressed');
      const disabledColor = getContextualColor(baseColor, 'disabled');
      const selectedColor = getContextualColor(baseColor, 'selected');

      // All state colors should be different from base
      expect(hoverColor).not.toBe(baseColor);
      expect(focusColor).not.toBe(baseColor);
      expect(pressedColor).not.toBe(baseColor);
      expect(disabledColor).not.toBe(baseColor);
      expect(selectedColor).not.toBe(baseColor);

      // All state colors should be valid hex codes
      [hoverColor, focusColor, pressedColor, disabledColor, selectedColor].forEach(color => {
        expect(color).toMatch(/^#[0-9a-f]{6}$/i);
      });
    });

    it('should handle invalid base color gracefully', () => {
      const result = getContextualColor('invalid', 'hover');
      expect(result).toBe('invalid');
    });
  });
});

describe('CSS Properties Generation', () => {
  describe('generateColorCSSProperties', () => {
    it('should generate CSS custom properties', () => {
      const scheme = generateDynamicColorScheme('#6750a4');
      const properties = generateColorCSSProperties(scheme, 'light');
      
      // Check that properties are generated
      expect(Object.keys(properties).length).toBeGreaterThan(0);
      
      // Check that property names start with --md-sys-color
      Object.keys(properties).forEach(property => {
        expect(property).toMatch(/^--md-sys-color-/);
      });

      // Check that property values are valid hex colors
      Object.values(properties).forEach(value => {
        expect(value).toMatch(/^#[0-9a-f]{6}$/i);
      });
    });

    it('should generate different properties for different themes', () => {
      const scheme = generateDynamicColorScheme('#6750a4');
      const lightProperties = generateColorCSSProperties(scheme, 'light');
      const darkProperties = generateColorCSSProperties(scheme, 'dark');
      
      // Should have same number of properties
      expect(Object.keys(lightProperties).length).toBe(Object.keys(darkProperties).length);
      
      // Should have different values for at least some properties
      const primaryProperty = '--md-sys-color-primary';
      expect(lightProperties[primaryProperty]).not.toBe(darkProperties[primaryProperty]);
    });
  });
});

describe('Accessibility Validation', () => {
  describe('validateColorSchemeAccessibility', () => {
    it('should validate color scheme accessibility', () => {
      const scheme = generateDynamicColorScheme('#6750a4');
      const validation = validateColorSchemeAccessibility(scheme, 'light');
      
      // Check that validation results are returned
      expect(Object.keys(validation).length).toBeGreaterThan(0);
      
      // Check that each validation result has required properties
      Object.values(validation).forEach(result => {
        expect(result.ratio).toBeDefined();
        expect(typeof result.wcagAA).toBe('boolean');
        expect(typeof result.wcagAAA).toBe('boolean');
      });

      // Check specific color pairs
      expect(validation['primary-onPrimary']).toBeDefined();
      expect(validation['surface-onSurface']).toBeDefined();
      expect(validation['background-onBackground']).toBeDefined();
    });

    it('should identify accessibility issues', () => {
      const scheme = generateDynamicColorScheme('#6750a4');
      const validation = validateColorSchemeAccessibility(scheme, 'light');
      
      // At least some color pairs should meet WCAG AA
      const wcagAAResults = Object.values(validation).filter(result => result.wcagAA);
      expect(wcagAAResults.length).toBeGreaterThan(0);
    });
  });
});

describe('React Hook Integration', () => {
  describe('useMaterial3Color', () => {
    it('should return color utility object', () => {
      const colorUtil = useMaterial3Color('primary');
      
      expect(colorUtil.color).toBeDefined();
      expect(colorUtil.cssProperty).toBeDefined();
      expect(typeof colorUtil.getContextualColor).toBe('function');
      expect(typeof colorUtil.validateContrast).toBe('function');
    });

    it('should return correct CSS property', () => {
      const colorUtil = useMaterial3Color('primary');
      expect(colorUtil.cssProperty).toBe('--md-sys-color-primary');
      
      const secondaryUtil = useMaterial3Color('secondary');
      expect(secondaryUtil.cssProperty).toBe('--md-sys-color-secondary');
    });

    it('should generate contextual colors', () => {
      const colorUtil = useMaterial3Color('primary');
      const hoverColor = colorUtil.getContextualColor('hover');
      const focusColor = colorUtil.getContextualColor('focus');
      
      expect(hoverColor).toBeDefined();
      expect(focusColor).toBeDefined();
      expect(hoverColor).not.toBe(focusColor);
    });

    it('should validate contrast', () => {
      const colorUtil = useMaterial3Color('primary');
      const validation = colorUtil.validateContrast('#ffffff');
      
      expect(validation.ratio).toBeDefined();
      expect(typeof validation.wcagAA).toBe('boolean');
      expect(typeof validation.wcagAAA).toBe('boolean');
    });
  });
});

describe('Edge Cases and Error Handling', () => {
  it('should handle extreme color values', () => {
    // Test with pure black
    const blackScheme = generateDynamicColorScheme('#000000');
    expect(blackScheme.primary).toBeDefined();
    
    // Test with pure white
    const whiteScheme = generateDynamicColorScheme('#ffffff');
    expect(whiteScheme.primary).toBeDefined();
  });

  it('should handle color conversion edge cases', () => {
    // Test with grayscale colors
    const grayRgb = { r: 128, g: 128, b: 128 };
    const grayHsl = rgbToHsl(grayRgb);
    expect(grayHsl.s).toBe(0); // Grayscale should have 0 saturation
    
    const convertedBack = hslToRgb(grayHsl);
    expect(convertedBack.r).toBeCloseTo(grayRgb.r, 0);
    expect(convertedBack.g).toBeCloseTo(grayRgb.g, 0);
    expect(convertedBack.b).toBeCloseTo(grayRgb.b, 0);
  });

  it('should maintain color consistency across operations', () => {
    const originalColor = '#6750a4';
    const scheme = generateDynamicColorScheme(originalColor);
    const roles = getSemanticColorRoles(scheme, 'light');
    
    // All generated colors should be valid
    Object.values(roles).forEach(color => {
      expect(color).toMatch(/^#[0-9a-f]{6}$/i);
      expect(hexToRgb(color)).not.toBeNull();
    });
  });
});