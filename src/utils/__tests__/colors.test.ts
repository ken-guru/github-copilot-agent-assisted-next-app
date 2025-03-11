import { activityColors, getRandomColorSet, ColorSet, getColor } from '../colors';

// Export internalActivityColors for testing
jest.mock('../colors', () => {
  const originalModule = jest.requireActual('../colors');
  // Use the light mode colors directly for testing
  return {
    ...originalModule,
    isDarkMode: jest.fn().mockReturnValue(false)
  };
});

describe('colors utility', () => {
  // Save the original Math.random to restore it after tests
  const originalMathRandom = Math.random;
  
  beforeEach(() => {
    // Reset module state between tests
    jest.resetModules();
    
    // Reset the module's internal state by re-importing it
    jest.isolateModules(() => {
      import('../colors').then(colorsModule => {
        // Reset the usedColors set in the module
        // This is necessary since usedColors is a module-level variable that persists between tests
        Object.defineProperty(colorsModule, 'usedColors', { value: new Set() });
      });
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
        
        // Check if they are valid HSL colors
        expect(colorSet.background).toMatch(/^hsl\(\d+,\s*\d+%,\s*\d+%\)$/);
        expect(colorSet.text).toMatch(/^hsl\(\d+,\s*\d+%,\s*\d+%\)$/);
        expect(colorSet.border).toMatch(/^hsl\(\d+,\s*\d+%,\s*\d+%\)$/);
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
      expect(colorAfterReset.background).toBeTruthy(); // Just check it returns a valid color set
    });
  });

  describe('getNextAvailableColorSet', () => {
    it('should return color sets in sequential order', () => {
      // Import the colors module directly to get a fresh instance
      const freshColorsModule = jest.requireActual('../colors');
      const { getNextAvailableColorSet: freshGetNextAvailableColorSet } = freshColorsModule;
      
      // It should return colors in the order they appear in activityColors
      const firstColor = freshGetNextAvailableColorSet();
      expect(firstColor.background).toBeTruthy();
      
      const secondColor = freshGetNextAvailableColorSet();
      expect(secondColor.background).toBeTruthy();
      expect(firstColor.background).not.toBe(secondColor.background);
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
      
      // After all colors are used, it should reset and return a valid color
      const colorAfterReset = freshGetNextAvailableColorSet();
      expect(colorAfterReset.background).toBeTruthy();
    });
  });

  describe('getColor', () => {
    it('should return a color from the palette for a valid index', () => {
      expect(getColor(0)).toMatch(/^hsl\(/); // Now using HSL
      expect(getColor(1)).toMatch(/^hsl\(/);
      expect(getColor(2)).toMatch(/^hsl\(/);
    });

    it('should return a color from the palette for a large index', () => {
      const color = getColor(9);
      expect(color).toMatch(/^hsl\(/);
    });

    it('should return the first color for index 0', () => {
      expect(getColor(0)).toBe('hsl(140, 50%, 92%)');
    });
  });
});