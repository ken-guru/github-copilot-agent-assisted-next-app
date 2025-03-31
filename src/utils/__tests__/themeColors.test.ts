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
} from '../themeColors';

describe('Color utility functions', () => {
  describe('parseHSL', () => {
    it('should parse valid HSL strings', () => {
      expect(parseHSL('hsl(120, 50%, 50%)')).toEqual([120, 50, 50]);
      expect(parseHSL('hsl(0, 0%, 0%)')).toEqual([0, 0, 0]);
      expect(parseHSL('hsl(360, 100%, 100%)')).toEqual([360, 100, 100]);
      // Test with various spacing
      expect(parseHSL('hsl(120,50%,50%)')).toEqual([120, 50, 50]);
      expect(parseHSL('hsl( 120 , 50% , 50% )')).toEqual([120, 50, 50]);
    });

    it('should throw an error for invalid HSL strings', () => {
      expect(() => parseHSL('rgb(255, 0, 0)')).toThrow();
      expect(() => parseHSL('hsl(120, 50, 50)')).toThrow();
      expect(() => parseHSL('hsl(120%, 50%, 50%)')).toThrow();
      expect(() => parseHSL('not a color')).toThrow();
    });
  });

  describe('createHSL', () => {
    it('should create valid HSL strings', () => {
      expect(createHSL(120, 50, 50)).toBe('hsl(120, 50%, 50%)');
      expect(createHSL(0, 0, 0)).toBe('hsl(0, 0%, 0%)');
      expect(createHSL(360, 100, 100)).toBe('hsl(360, 100%, 100%)');
    });
  });

  describe('adjustLightness', () => {
    it('should increase lightness correctly', () => {
      expect(adjustLightness('hsl(120, 50%, 50%)', 10)).toBe('hsl(120, 50%, 60%)');
      expect(adjustLightness('hsl(120, 50%, 95%)', 10)).toBe('hsl(120, 50%, 100%)');
    });

    it('should decrease lightness correctly', () => {
      expect(adjustLightness('hsl(120, 50%, 50%)', -10)).toBe('hsl(120, 50%, 40%)');
      expect(adjustLightness('hsl(120, 50%, 5%)', -10)).toBe('hsl(120, 50%, 0%)');
    });

    it('should clamp lightness values to 0-100', () => {
      expect(adjustLightness('hsl(120, 50%, 95%)', 20)).toBe('hsl(120, 50%, 100%)');
      expect(adjustLightness('hsl(120, 50%, 5%)', -20)).toBe('hsl(120, 50%, 0%)');
    });
  });

  describe('adjustSaturation', () => {
    it('should increase saturation correctly', () => {
      expect(adjustSaturation('hsl(120, 50%, 50%)', 10)).toBe('hsl(120, 60%, 50%)');
      expect(adjustSaturation('hsl(120, 95%, 50%)', 10)).toBe('hsl(120, 100%, 50%)');
    });

    it('should decrease saturation correctly', () => {
      expect(adjustSaturation('hsl(120, 50%, 50%)', -10)).toBe('hsl(120, 40%, 50%)');
      expect(adjustSaturation('hsl(120, 5%, 50%)', -10)).toBe('hsl(120, 0%, 50%)');
    });

    it('should clamp saturation values to 0-100', () => {
      expect(adjustSaturation('hsl(120, 95%, 50%)', 20)).toBe('hsl(120, 100%, 50%)');
      expect(adjustSaturation('hsl(120, 5%, 50%)', -20)).toBe('hsl(120, 0%, 50%)');
    });
  });

  describe('hslToRgb', () => {
    it('should convert HSL to RGB correctly', () => {
      // Red
      expect(hslToRgb(0, 100, 50)).toEqual([255, 0, 0]);
      // Green
      expect(hslToRgb(120, 100, 50)).toEqual([0, 255, 0]);
      // Blue
      expect(hslToRgb(240, 100, 50)).toEqual([0, 0, 255]);
      // White
      expect(hslToRgb(0, 0, 100)).toEqual([255, 255, 255]);
      // Black
      expect(hslToRgb(0, 0, 0)).toEqual([0, 0, 0]);
      // Gray
      expect(hslToRgb(0, 0, 50)).toEqual([127.5, 127.5, 127.5]);
    });
  });

  describe('rgbToHsl', () => {
    it('should convert RGB to HSL correctly', () => {
      // Red
      expect(rgbToHsl(255, 0, 0)).toEqual([0, 100, 50]);
      // Green
      expect(rgbToHsl(0, 255, 0)).toEqual([120, 100, 50]);
      // Blue
      expect(rgbToHsl(0, 0, 255)).toEqual([240, 100, 50]);
      // White
      expect(rgbToHsl(255, 255, 255)).toEqual([0, 0, 100]);
      // Black
      expect(rgbToHsl(0, 0, 0)).toEqual([0, 0, 0]);
      // Gray
      const [h, s, l] = rgbToHsl(128, 128, 128);
      expect(h).toEqual(0);
      expect(s).toEqual(0);
      expect(l).toEqual(50);
    });

    it('should handle edge cases correctly', () => {
      // Yellow (mix of red and green)
      expect(rgbToHsl(255, 255, 0)).toEqual([60, 100, 50]);
      // Cyan (mix of green and blue)
      expect(rgbToHsl(0, 255, 255)).toEqual([180, 100, 50]);
      // Magenta (mix of red and blue)
      expect(rgbToHsl(255, 0, 255)).toEqual([300, 100, 50]);
    });
  });

  describe('getLuminance', () => {
    it('should calculate luminance correctly', () => {
      // White has luminance of 1
      expect(getLuminance(255, 255, 255)).toBeCloseTo(1, 5);
      // Black has luminance of 0
      expect(getLuminance(0, 0, 0)).toBeCloseTo(0, 5);
      // Middle gray has luminance of ~0.2158
      expect(getLuminance(128, 128, 128)).toBeCloseTo(0.2158, 3);
      // Pure red
      expect(getLuminance(255, 0, 0)).toBeCloseTo(0.2126, 3);
      // Pure green
      expect(getLuminance(0, 255, 0)).toBeCloseTo(0.7152, 3);
      // Pure blue
      expect(getLuminance(0, 0, 255)).toBeCloseTo(0.0722, 3);
    });
  });

  describe('getContrastRatio', () => {
    it('should calculate contrast ratio correctly', () => {
      // White on black (maximum contrast: 21:1)
      const whiteOnBlack = getContrastRatio('hsl(0, 0%, 100%)', 'hsl(0, 0%, 0%)');
      expect(whiteOnBlack).toBeCloseTo(21, 0);

      // Black on white (maximum contrast: 21:1)
      const blackOnWhite = getContrastRatio('hsl(0, 0%, 0%)', 'hsl(0, 0%, 100%)');
      expect(blackOnWhite).toBeCloseTo(21, 0);

      // Medium gray on black (~5:1)
      const grayOnBlack = getContrastRatio('hsl(0, 0%, 50%)', 'hsl(0, 0%, 0%)');
      expect(grayOnBlack).toBeGreaterThan(3);
      expect(grayOnBlack).toBeLessThan(6);

      // Same color (minimum contrast: 1:1)
      const sameColor = getContrastRatio('hsl(120, 50%, 50%)', 'hsl(120, 50%, 50%)');
      expect(sameColor).toBeCloseTo(1, 5);
    });
  });

  describe('validateContrast', () => {
    it('should validate AA contrast correctly', () => {
      // High contrast - passes AA
      expect(validateContrast('hsl(0, 0%, 100%)', 'hsl(0, 0%, 0%)', 'AA')).toBe(true);
      expect(validateContrast('hsl(0, 0%, 0%)', 'hsl(0, 0%, 100%)', 'AA')).toBe(true);
      
      // Medium contrast - passes AA
      expect(validateContrast('hsl(0, 0%, 90%)', 'hsl(0, 0%, 10%)', 'AA')).toBe(true);
      
      // Low contrast - fails AA
      expect(validateContrast('hsl(0, 0%, 60%)', 'hsl(0, 0%, 40%)', 'AA')).toBe(false);
      expect(validateContrast('hsl(120, 50%, 50%)', 'hsl(120, 50%, 70%)', 'AA')).toBe(false);
    });

    it('should validate AAA contrast correctly', () => {
      // For debugging - log the actual ratio calculated
      const testRatio = getContrastRatio('hsl(0, 0%, 80%)', 'hsl(0, 0%, 20%)');
      
      // High contrast - passes AAA
      expect(validateContrast('hsl(0, 0%, 100%)', 'hsl(0, 0%, 0%)', 'AAA')).toBe(true);
      
      // This test was adjusted to reflect the actual contrast ratio calculated (~7.87)
      // which exceeds the AAA threshold of 7.0
      expect(validateContrast('hsl(0, 0%, 80%)', 'hsl(0, 0%, 20%)', 'AAA')).toBe(true);
      
      // Low contrast - fails AAA
      expect(validateContrast('hsl(0, 0%, 60%)', 'hsl(0, 0%, 40%)', 'AAA')).toBe(false);
    });
  });
});