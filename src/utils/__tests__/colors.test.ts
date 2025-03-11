import { ColorSet, getRandomColorSet, getNextAvailableColorSet, getActivityColors, getColor } from '../colors';

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

  describe('getActivityColors', () => {
    it('should return an array of color sets', () => {
      const colors = getActivityColors();
      expect(Array.isArray(colors)).toBe(true);
      expect(colors.length).toBeGreaterThan(0);
    });

    it('should have proper color set structure', () => {
      const colors = getActivityColors();
      colors.forEach(colorSet => {
        expect(colorSet).toHaveProperty('background');
        expect(colorSet).toHaveProperty('text');
        expect(colorSet).toHaveProperty('border');
      });
    });
  });

  describe('getRandomColorSet', () => {
    let freshGetRandomColorSet: typeof getRandomColorSet;
    
    beforeEach(async () => {
      // Reset module to clear usedColors Set
      jest.resetModules();
      const colorsModule = await import('../colors');
      freshGetRandomColorSet = colorsModule.getRandomColorSet;
    });

    it('should return a color set with proper structure', () => {
      const colorSet = freshGetRandomColorSet();
      expect(colorSet).toHaveProperty('background');
      expect(colorSet).toHaveProperty('text');
      expect(colorSet).toHaveProperty('border');
    });

    it('should return different colors until all are used', () => {
      const colors = getActivityColors();
      const usedColorSets = new Set<string>();
      
      // Get colors until we've used all colors
      for (let i = 0; i < colors.length; i++) {
        const colorSet = freshGetRandomColorSet();
        const colorKey = `${colorSet.background}-${colorSet.text}-${colorSet.border}`;
        expect(usedColorSets.has(colorKey)).toBe(false); // Should not repeat until all are used
        usedColorSets.add(colorKey);
      }
    });

    it('should reset after all colors are used', () => {
      const colors = getActivityColors();
      const firstRound: ColorSet[] = [];
      
      // Use all colors once
      for (let i = 0; i < colors.length; i++) {
        firstRound.push(freshGetRandomColorSet());
      }

      // Get one more color - should be from the reset pool
      const nextColor = freshGetRandomColorSet();
      expect(nextColor).toBeDefined();
    });
  });

  describe('getNextAvailableColorSet', () => {
    let freshGetNextAvailableColorSet: typeof getNextAvailableColorSet;
    
    beforeEach(async () => {
      // Reset module to clear usedColors Set
      jest.resetModules();
      const colorsModule = await import('../colors');
      freshGetNextAvailableColorSet = colorsModule.getNextAvailableColorSet;
    });

    it('should return a color set with proper structure', () => {
      const colorSet = freshGetNextAvailableColorSet();
      expect(colorSet).toHaveProperty('background');
      expect(colorSet).toHaveProperty('text');
      expect(colorSet).toHaveProperty('border');
    });

    it('should return specific color set when index provided', () => {
      const firstColor = freshGetNextAvailableColorSet(0);
      const secondColor = freshGetNextAvailableColorSet(1);
      expect(firstColor).not.toEqual(secondColor);
    });

    it('should reset after all colors are used', () => {
      const colors = getActivityColors();
      // Use up all colors
      const usedColors: ColorSet[] = [];
      for (let i = 0; i < colors.length; i++) {
        usedColors.push(freshGetNextAvailableColorSet());
      }
      
      // Get one more color - should start over
      const nextColor = freshGetNextAvailableColorSet();
      expect(nextColor).toEqual(usedColors[0]);
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