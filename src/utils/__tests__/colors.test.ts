import { getContrastRatio, validateContrast } from '../colors';

describe('Color Utilities', () => {
  describe('getContrastRatio', () => {
    it('should calculate contrast ratio correctly', () => {
      // White background with black text (maximum contrast)
      const whiteBlackRatio = getContrastRatio(
        'hsl(0, 0%, 100%)',
        'hsl(0, 0%, 0%)'
      );
      expect(whiteBlackRatio).toBeCloseTo(21, 0); // Maximum contrast ratio is 21:1

      // Light mode background with text
      const lightModeRatio = getContrastRatio(
        'hsl(220, 20%, 98%)', // Light background
        'hsl(220, 15%, 12%)' // Dark text
      );
      expect(lightModeRatio).toBeGreaterThanOrEqual(4.5); // WCAG AA minimum

      // Dark mode background with text
      const darkModeRatio = getContrastRatio(
        'hsl(220, 15%, 12%)', // Dark background
        'hsl(220, 10%, 95%)' // Light text
      );
      expect(darkModeRatio).toBeGreaterThanOrEqual(4.5); // WCAG AA minimum
    });
  });

  describe('validateContrast', () => {
    it('should validate WCAG AA compliance', () => {
      // Test light mode colors
      expect(validateContrast(
        'hsl(220, 20%, 98%)', // Light background
        'hsl(220, 15%, 12%)', // Dark text
        'AA'
      )).toBe(true);

      // Test dark mode colors
      expect(validateContrast(
        'hsl(220, 15%, 12%)', // Dark background
        'hsl(220, 10%, 95%)', // Light text
        'AA'
      )).toBe(true);

      // Test muted text combinations
      expect(validateContrast(
        'hsl(220, 20%, 94%)', // Light muted background
        'hsl(220, 10%, 35%)', // Adjusted muted text to be darker for better contrast
        'AA'
      )).toBe(true);
    });

    it('should validate WCAG AAA compliance', () => {
      // Test light mode colors with stricter requirements
      expect(validateContrast(
        'hsl(220, 20%, 98%)', // Light background
        'hsl(220, 15%, 12%)', // Dark text
        'AAA'
      )).toBe(true);

      // Test dark mode colors with stricter requirements
      expect(validateContrast(
        'hsl(220, 15%, 12%)', // Dark background
        'hsl(220, 10%, 95%)', // Light text
        'AAA'
      )).toBe(true);
    });
  });
});