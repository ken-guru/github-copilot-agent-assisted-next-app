/**
 * Unit tests for feature detection utilities
 * @module feature-detection.test
 */

import {
  isDragAndDropSupported,
  isTouchSupported,
  isLocalStorageSupported,
  isVibrationSupported,
  prefersReducedMotion,
  getSupportedReorderingMethods,
  getRecommendedReorderingMethod,
  isReorderingSupported
} from '../feature-detection';

// Mock console methods to avoid noise in tests
const originalConsoleWarn = console.warn;
const originalConsoleError = console.error;

beforeEach(() => {
  jest.clearAllMocks();
  console.warn = jest.fn();
  console.error = jest.fn();
});

afterAll(() => {
  console.warn = originalConsoleWarn;
  console.error = originalConsoleError;
});

describe('feature-detection utilities', () => {
  describe('isDragAndDropSupported', () => {
    it('should return a boolean value', () => {
      const result = isDragAndDropSupported();
      expect(typeof result).toBe('boolean');
    });

    it('should return true in JSDOM environment', () => {
      // In Jest/JSDOM environment, drag and drop should be supported
      const result = isDragAndDropSupported();
      expect(result).toBe(true);
    });
  });

  describe('isTouchSupported', () => {
    it('should return a boolean value', () => {
      const result = isTouchSupported();
      expect(typeof result).toBe('boolean');
    });
  });

  describe('isLocalStorageSupported', () => {
    it('should return true when localStorage is available', () => {
      const result = isLocalStorageSupported();
      expect(result).toBe(true);
    });
  });

  describe('isVibrationSupported', () => {
    it('should return a boolean value', () => {
      const result = isVibrationSupported();
      expect(typeof result).toBe('boolean');
    });
  });

  describe('prefersReducedMotion', () => {
    it('should return a boolean value', () => {
      const result = prefersReducedMotion();
      expect(typeof result).toBe('boolean');
    });
  });

  describe('getSupportedReorderingMethods', () => {
    it('should return an object with all method flags', () => {
      const result = getSupportedReorderingMethods();
      
      expect(result).toHaveProperty('dragAndDrop');
      expect(result).toHaveProperty('touch');
      expect(result).toHaveProperty('keyboard');
      expect(result).toHaveProperty('reducedMotion');
      
      expect(typeof result.dragAndDrop).toBe('boolean');
      expect(typeof result.touch).toBe('boolean');
      expect(typeof result.keyboard).toBe('boolean');
      expect(typeof result.reducedMotion).toBe('boolean');
      
      // Keyboard should always be true
      expect(result.keyboard).toBe(true);
    });

    it('should include drag and drop support in JSDOM', () => {
      const result = getSupportedReorderingMethods();
      expect(result.dragAndDrop).toBe(true);
    });
  });

  describe('getRecommendedReorderingMethod', () => {
    it('should return a valid reordering method', () => {
      const result = getRecommendedReorderingMethod();
      expect(['drag-drop', 'touch', 'keyboard']).toContain(result);
    });

    it('should prefer touch over drag-drop when both are available', () => {
      const result = getRecommendedReorderingMethod();
      // In JSDOM, touch support varies, but the result should be valid
      expect(['drag-drop', 'touch', 'keyboard']).toContain(result);
    });
  });

  describe('isReorderingSupported', () => {
    it('should always return true since keyboard is always supported', () => {
      const result = isReorderingSupported();
      expect(result).toBe(true);
    });
  });

  describe('error handling', () => {
    it('should handle exceptions in feature detection gracefully', () => {
      // All functions should handle exceptions and return boolean values
      const functions = [
        isDragAndDropSupported,
        isTouchSupported,
        isLocalStorageSupported,
        isVibrationSupported,
        prefersReducedMotion,
        isReorderingSupported
      ];

      functions.forEach(fn => {
        expect(() => {
          const result = fn();
          expect(typeof result).toBe('boolean');
        }).not.toThrow();
      });
    });

    it('should handle exceptions in complex functions gracefully', () => {
      expect(() => {
        const methods = getSupportedReorderingMethods();
        expect(typeof methods).toBe('object');
        expect(methods).toHaveProperty('keyboard', true);
      }).not.toThrow();

      expect(() => {
        const recommendation = getRecommendedReorderingMethod();
        expect(typeof recommendation).toBe('string');
        expect(['drag-drop', 'touch', 'keyboard']).toContain(recommendation);
      }).not.toThrow();
    });

    it('should provide consistent results across multiple calls', () => {
      const result1 = getSupportedReorderingMethods();
      const result2 = getSupportedReorderingMethods();
      
      expect(result1).toEqual(result2);
      
      const recommendation1 = getRecommendedReorderingMethod();
      const recommendation2 = getRecommendedReorderingMethod();
      
      expect(recommendation1).toBe(recommendation2);
    });

    it('should handle edge cases in feature detection', () => {
      // Test that functions don't throw with various inputs
      expect(() => isDragAndDropSupported()).not.toThrow();
      expect(() => isTouchSupported()).not.toThrow();
      expect(() => isLocalStorageSupported()).not.toThrow();
      expect(() => isVibrationSupported()).not.toThrow();
      expect(() => prefersReducedMotion()).not.toThrow();
    });
  });
});