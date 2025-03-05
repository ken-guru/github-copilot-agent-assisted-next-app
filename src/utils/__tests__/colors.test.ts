import { activityColors, getRandomColorSet, getNextAvailableColorSet, ColorSet } from '../colors';

describe('colors utility', () => {
  // Save the original Math.random to restore it after tests
  const originalMathRandom = Math.random;
  
  beforeEach(() => {
    // Reset module state between tests
    jest.resetModules();
    
    // Reset the module's internal state by re-importing it
    jest.isolateModules(() => {
      const colorsModule = require('../colors');
      // Reset the usedColors set in the module
      // This is necessary since usedColors is a module-level variable that persists between tests
      Object.defineProperty(colorsModule, 'usedColors', { value: new Set() });
    });
  });
  
  afterEach(() => {
    // Restore original Math.random
    Math.random = originalMathRandom;
  });

  describe('activityColors', () => {
    it('should contain a list of color sets', () => {
      expect(Array.isArray(activityColors)).toBe(true);
      expect(activityColors.length).toBeGreaterThan(0);
    });

    it('should have proper color set structure', () => {
      activityColors.forEach(colorSet => {
        expect(colorSet).toHaveProperty('background');
        expect(colorSet).toHaveProperty('text');
        expect(colorSet).toHaveProperty('border');
        
        // Check if they are valid hex colors
        expect(colorSet.background).toMatch(/^#[0-9A-F]{6}$/i);
        expect(colorSet.text).toMatch(/^#[0-9A-F]{6}$/i);
        expect(colorSet.border).toMatch(/^#[0-9A-F]{6}$/i);
      });
    });
  });

  describe('getRandomColorSet', () => {
    it('should return a color set', () => {
      const colorSet = getRandomColorSet();
      expect(colorSet).toHaveProperty('background');
      expect(colorSet).toHaveProperty('text');
      expect(colorSet).toHaveProperty('border');
    });

    it('should return different colors until all are used', () => {
      // Import the colors module directly to get a fresh instance
      const freshColorsModule = jest.requireActual('../colors');
      const { getRandomColorSet: freshGetRandomColorSet } = freshColorsModule;
      
      // Mock Math.random to make it predictable
      let mockRandomIndex = 0;
      Math.random = jest.fn().mockImplementation(() => mockRandomIndex / activityColors.length);
      
      const usedColors = new Set<string>();
      
      // Get colors until we've used all colors
      for (let i = 0; i < activityColors.length; i++) {
        mockRandomIndex = i;
        const colorSet = freshGetRandomColorSet();
        const colorKey = `${colorSet.background}-${colorSet.text}-${colorSet.border}`;
        
        // Each color should be unique until we've used all colors
        expect(usedColors.has(colorKey)).toBe(false);
        usedColors.add(colorKey);
      }
      
      // After all colors are used, it should reset and start returning colors again
      mockRandomIndex = 0;
      const colorAfterReset = freshGetRandomColorSet();
      expect(colorAfterReset).toEqual(activityColors[0]);
    });
  });

  describe('getNextAvailableColorSet', () => {
    it('should return color sets in sequential order', () => {
      // Import the colors module directly to get a fresh instance
      const freshColorsModule = jest.requireActual('../colors');
      const { getNextAvailableColorSet: freshGetNextAvailableColorSet } = freshColorsModule;
      
      // It should return colors in the order they appear in activityColors
      const firstColor = freshGetNextAvailableColorSet();
      expect(firstColor).toEqual(activityColors[0]);
      
      const secondColor = freshGetNextAvailableColorSet();
      expect(secondColor).toEqual(activityColors[1]);
    });
    
    it('should reset after all colors are used', () => {
      // Import the colors module directly to get a fresh instance
      const freshColorsModule = jest.requireActual('../colors');
      const { getNextAvailableColorSet: freshGetNextAvailableColorSet } = freshColorsModule;
      
      // Use up all colors
      const usedColors: ColorSet[] = [];
      for (let i = 0; i < activityColors.length; i++) {
        usedColors.push(freshGetNextAvailableColorSet());
      }
      
      // Verify all colors were used exactly once
      activityColors.forEach(colorSet => {
        const matchingColors = usedColors.filter(
          used => used.background === colorSet.background && 
                 used.text === colorSet.text &&
                 used.border === colorSet.border
        );
        expect(matchingColors.length).toBe(1);
      });
      
      // After all colors are used, it should reset and return the first color
      const colorAfterReset = freshGetNextAvailableColorSet();
      expect(colorAfterReset).toEqual(activityColors[0]);
    });
  });
});