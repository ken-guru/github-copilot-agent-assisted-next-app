import { getThemeColors, getRandomColorSet, getNextColorSet, themeColorSets } from '../themeColors';

// Helper to reset internal state of the functions
const resetColorState = () => {
  // Call the functions enough times to clear any internal state
  for (let i = 0; i < 100; i++) {
    getRandomColorSet(false);
    getNextColorSet(false);
  }
};

describe('Theme Colors', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Ensure clean state before each test
    resetColorState();
  });
  
  describe('getThemeColors', () => {
    test('returns light theme colors when isDarkMode is false', () => {
      const colors = getThemeColors(false);
      expect(colors.length).toEqual(themeColorSets.length);
      
      // Each color should be from the light theme set
      colors.forEach((color, index) => {
        expect(color).toEqual(themeColorSets[index].light);
      });
    });
    
    test('returns dark theme colors when isDarkMode is true', () => {
      const colors = getThemeColors(true);
      expect(colors.length).toEqual(themeColorSets.length);
      
      // Each color should be from the dark theme set
      colors.forEach((color, index) => {
        expect(color).toEqual(themeColorSets[index].dark);
      });
    });
  });
  
  describe('getRandomColorSet', () => {
    test('returns a valid color set for light theme', () => {
      const color = getRandomColorSet(false);
      
      expect(color).toHaveProperty('background');
      expect(color).toHaveProperty('text');
      expect(color).toHaveProperty('border');
      
      // It should match one of the light theme color sets
      const lightColors = themeColorSets.map(set => set.light);
      expect(lightColors).toContainEqual(color);
    });
    
    test('returns a valid color set for dark theme', () => {
      const color = getRandomColorSet(true);
      
      expect(color).toHaveProperty('background');
      expect(color).toHaveProperty('text');
      expect(color).toHaveProperty('border');
      
      // It should match one of the dark theme color sets
      const darkColors = themeColorSets.map(set => set.dark);
      expect(darkColors).toContainEqual(color);
    });
    
    test('has finite unique colors and eventually repeats', () => {
      // Reset state completely to start fresh
      resetColorState();
      
      // We'll collect colors until we find repeats
      const seenColors = new Map();
      const uniqueColors = new Set();
      let firstRepeat = null;
      let firstRepeatIndex = -1;
      
      // Generate enough colors to guarantee we'll see a repeat
      // The exact cycle doesn't matter - we just need to verify there is cycling
      for (let i = 0; i < 500 && !firstRepeat; i++) {
        const color = getRandomColorSet(false);
        const colorKey = `${color.background}-${color.text}-${color.border}`;
        
        if (seenColors.has(colorKey)) {
          firstRepeat = color;
          firstRepeatIndex = i;
          break;
        }
        
        seenColors.set(colorKey, i);
        uniqueColors.add(colorKey);
      }
      
      // Basic verification: we should find a repeat within a reasonable number of calls
      expect(firstRepeat).not.toBeNull();
      expect(firstRepeatIndex).toBeGreaterThan(0);
      
      // This is the core behavior we care about: 
      // 1. It should provide a reasonable number of unique colors
      expect(uniqueColors.size).toBeGreaterThan(5);
      
      // 2. It should have a finite set of colors (not generate unlimited unique values)
      expect(uniqueColors.size).toBeLessThan(500);
      
      // 3. After enough calls, we should see the same color again (cycle behavior)
      // No specific order or cycle length is assumed - just that cycling happens
    });
  });
  
  describe('getNextColorSet', () => {
    test('returns color at specific index when provided', () => {
      const specificIndex = 2;
      const color = getNextColorSet(false, specificIndex);
      
      expect(color).toEqual(themeColorSets[specificIndex].light);
    });
    
    test('returns colors in sequence when no index provided', () => {
      // Reset state completely
      resetColorState();
      
      // Get several colors in sequence and verify uniqueness
      const colors = [];
      const colorKeys = new Set();
      const maxColors = 100; // Large enough to guarantee we see a cycle
      let cycleDetected = false;
      let firstRepeatIndex = -1;
      
      for (let i = 0; i < maxColors && !cycleDetected; i++) {
        const color = getNextColorSet(false);
        const colorKey = `${color.background}-${color.text}-${color.border}`;
        
        if (colorKeys.has(colorKey)) {
          cycleDetected = true;
          firstRepeatIndex = i;
          break;
        }
        
        colors.push(color);
        colorKeys.add(colorKey);
      }
      
      // Verify that we detected a cycle
      expect(cycleDetected).toBe(true);
      expect(firstRepeatIndex).toBeGreaterThan(0);
      
      // Verify that we have multiple unique colors
      expect(colorKeys.size).toBeGreaterThan(1);
      
      // The key test: verify that after detecting a cycle, the next color 
      // matches one we've already seen (proving the cycling behavior)
      const cycleLength = firstRepeatIndex;
      const nextColor = getNextColorSet(false);
      const nextColorKey = `${nextColor.background}-${nextColor.text}-${nextColor.border}`;
      
      expect(colorKeys.has(nextColorKey)).toBe(true);
    });
    
    test('handles invalid indices gracefully', () => {
      // Negative index
      const colorNegative = getNextColorSet(false, -1);
      expect(colorNegative).toHaveProperty('background');
      
      // Index beyond array bounds
      const colorTooLarge = getNextColorSet(false, themeColorSets.length + 10);
      expect(colorTooLarge).toHaveProperty('background');
    });
  });
});