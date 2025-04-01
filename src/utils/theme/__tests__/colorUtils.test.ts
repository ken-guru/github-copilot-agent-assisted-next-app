import { 
  parseHSL, 
  createHSL, 
  adjustLightness, 
  adjustSaturation,
  hslToRgb, 
  rgbToHsl, 
  getLuminance,
  getContrastRatio,
  validateContrast
} from '../colorUtils';

describe('Color Utilities', () => {
  describe('parseHSL', () => {
    test('parses valid HSL string', () => {
      expect(parseHSL('hsl(120, 60%, 50%)')).toEqual([120, 60, 50]);
      expect(parseHSL('hsl(0, 0%, 0%)')).toEqual([0, 0, 0]);
      expect(parseHSL('hsl(359, 100%, 100%)')).toEqual([359, 100, 100]);
    });

    test('handles spaces in HSL string', () => {
      expect(parseHSL('hsl(120,60%,50%)')).toEqual([120, 60, 50]);
      expect(parseHSL('hsl( 120 , 60% , 50% )')).toEqual([120, 60, 50]);
    });

    test('throws error for invalid HSL format', () => {
      expect(() => parseHSL('not-hsl')).toThrow('Invalid HSL color format');
      expect(() => parseHSL('rgb(120, 60, 50)')).toThrow('Invalid HSL color format');
      expect(() => parseHSL('hsl(120, 60, 50)')).toThrow('Invalid HSL color format');
    });
  });

  describe('createHSL', () => {
    test('creates valid HSL string', () => {
      expect(createHSL(120, 60, 50)).toBe('hsl(120, 60%, 50%)');
      expect(createHSL(0, 0, 0)).toBe('hsl(0, 0%, 0%)');
      expect(createHSL(359, 100, 100)).toBe('hsl(359, 100%, 100%)');
    });
  });

  describe('adjustLightness', () => {
    test('adjusts lightness positively', () => {
      expect(adjustLightness('hsl(120, 60%, 50%)', 10)).toBe('hsl(120, 60%, 60%)');
      expect(adjustLightness('hsl(120, 60%, 95%)', 10)).toBe('hsl(120, 60%, 100%)');
    });

    test('adjusts lightness negatively', () => {
      expect(adjustLightness('hsl(120, 60%, 50%)', -10)).toBe('hsl(120, 60%, 40%)');
      expect(adjustLightness('hsl(120, 60%, 5%)', -10)).toBe('hsl(120, 60%, 0%)');
    });

    test('clamps lightness between 0 and 100', () => {
      expect(adjustLightness('hsl(120, 60%, 95%)', 20)).toBe('hsl(120, 60%, 100%)');
      expect(adjustLightness('hsl(120, 60%, 5%)', -20)).toBe('hsl(120, 60%, 0%)');
    });
  });

  describe('adjustSaturation', () => {
    test('adjusts saturation positively', () => {
      expect(adjustSaturation('hsl(120, 60%, 50%)', 10)).toBe('hsl(120, 70%, 50%)');
      expect(adjustSaturation('hsl(120, 95%, 50%)', 10)).toBe('hsl(120, 100%, 50%)');
    });

    test('adjusts saturation negatively', () => {
      expect(adjustSaturation('hsl(120, 60%, 50%)', -10)).toBe('hsl(120, 50%, 50%)');
      expect(adjustSaturation('hsl(120, 5%, 50%)', -10)).toBe('hsl(120, 0%, 50%)');
    });

    test('clamps saturation between 0 and 100', () => {
      expect(adjustSaturation('hsl(120, 95%, 50%)', 20)).toBe('hsl(120, 100%, 50%)');
      expect(adjustSaturation('hsl(120, 5%, 50%)', -20)).toBe('hsl(120, 0%, 50%)');
    });
  });

  describe('hslToRgb', () => {
    test('converts HSL to RGB', () => {
      // Black
      expect(hslToRgb(0, 0, 0)).toEqual([0, 0, 0]);
      // White
      expect(hslToRgb(0, 0, 100)).toEqual([255, 255, 255]);
      // Red
      expect(hslToRgb(0, 100, 50)).toEqual([255, 0, 0]);
      // Green
      expect(hslToRgb(120, 100, 50)).toEqual([0, 255, 0]);
      // Blue
      expect(hslToRgb(240, 100, 50)).toEqual([0, 0, 255]);
    });

    test('handles grayscale conversion', () => {
      // Gray (50%)
      expect(hslToRgb(0, 0, 50)).toEqual([128, 128, 128]);
    });
  });

  describe('rgbToHsl', () => {
    test('converts RGB to HSL', () => {
      // Black
      expect(rgbToHsl(0, 0, 0)).toEqual([0, 0, 0]);
      // White
      expect(rgbToHsl(255, 255, 255)).toEqual([0, 0, 100]);
      // Red
      expect(rgbToHsl(255, 0, 0)).toEqual([0, 100, 50]);
      // Green
      expect(rgbToHsl(0, 255, 0)).toEqual([120, 100, 50]);
      // Blue
      expect(rgbToHsl(0, 0, 255)).toEqual([240, 100, 50]);
    });

    test('handles grayscale conversion', () => {
      // Gray (50%)
      const result = rgbToHsl(128, 128, 128);
      expect(result[1]).toBe(0); // Saturation should be 0
      expect(result[2]).toBeCloseTo(50, 0); // Lightness should be ~50%
    });
  });

  describe('getLuminance', () => {
    test('calculates luminance correctly', () => {
      // Black (luminance 0)
      expect(getLuminance(0, 0, 0)).toBe(0);
      // White (luminance 1)
      expect(getLuminance(255, 255, 255)).toBe(1);
      // Middle gray has luminance ~0.21
      expect(getLuminance(128, 128, 128)).toBeCloseTo(0.21, 1);
      // Red is less luminous than green
      expect(getLuminance(255, 0, 0)).toBeLessThan(getLuminance(0, 255, 0));
    });
  });

  describe('getContrastRatio', () => {
    test('calculates contrast ratio between colors', () => {
      // White on black (maximum contrast 21:1)
      const whiteOnBlack = getContrastRatio('hsl(0, 0%, 100%)', 'hsl(0, 0%, 0%)');
      expect(whiteOnBlack).toBeCloseTo(21, 0);

      // Black on white (same as white on black)
      const blackOnWhite = getContrastRatio('hsl(0, 0%, 0%)', 'hsl(0, 0%, 100%)');
      expect(blackOnWhite).toBeCloseTo(21, 0);

      // Dark text on light background (good contrast)
      const darkOnLight = getContrastRatio('hsl(0, 0%, 10%)', 'hsl(0, 0%, 90%)');
      expect(darkOnLight).toBeGreaterThan(10);

      // Low contrast example
      const lowContrast = getContrastRatio('hsl(210, 100%, 60%)', 'hsl(210, 100%, 40%)');
      expect(lowContrast).toBeLessThan(3);
    });
  });

  describe('validateContrast', () => {
    test('validates WCAG AA requirements', () => {
      // Good contrast (passes AA)
      expect(validateContrast('hsl(0, 0%, 100%)', 'hsl(0, 0%, 0%)')).toBe(true);
      expect(validateContrast('hsl(0, 0%, 98%)', 'hsl(0, 0%, 30%)')).toBe(true);
      
      // Poor contrast (fails AA)
      expect(validateContrast('hsl(210, 100%, 60%)', 'hsl(210, 100%, 40%)')).toBe(false);
      expect(validateContrast('hsl(30, 80%, 70%)', 'hsl(30, 80%, 50%)')).toBe(false);
    });

    test('validates WCAG AAA requirements', () => {
      // Good contrast (passes AAA)
      expect(validateContrast('hsl(0, 0%, 100%)', 'hsl(0, 0%, 0%)', 'AAA')).toBe(true);
      
      // Passes AA but fails AAA
      const mediumContrast = 'hsl(0, 0%, 95%)';
      const mediumText = 'hsl(0, 0%, 40%)';
      
      // This might pass AA but fail AAA
      expect(validateContrast(mediumContrast, mediumText)).toBe(true);
      expect(validateContrast(mediumContrast, mediumText, 'AAA')).toBe(false);
    });
  });
});