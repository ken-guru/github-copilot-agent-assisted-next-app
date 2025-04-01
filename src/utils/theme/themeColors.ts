'use client';

import { useTheme } from '../../hooks/useTheme';

// Color set interface for typed color objects
export interface ColorSet {
  background: string;
  text: string;
  border: string;
}

// Theme-aware color sets with both light and dark variants
export interface ThemeColorSet {
  light: ColorSet;
  dark: ColorSet;
}

// Internal HSL colors with dark mode consideration
// Each color has a light and dark mode variation defined in the same group
export const themeColorSets: ThemeColorSet[] = [
  // Green - Hue: 120
  {
    light: {
      background: 'hsl(120, 60%, 95%)',
      text: 'hsl(120, 60%, 25%)',
      border: 'hsl(120, 60%, 35%)'
    },
    dark: {
      background: 'hsl(120, 60%, 20%)',
      text: 'hsl(120, 60%, 85%)',
      border: 'hsl(120, 60%, 40%)'
    }
  },
  // Blue - Hue: 210
  {
    light: {
      background: 'hsl(210, 100%, 95%)',
      text: 'hsl(210, 100%, 30%)',
      border: 'hsl(210, 83%, 45%)'
    },
    dark: {
      background: 'hsl(210, 100%, 20%)',
      text: 'hsl(210, 100%, 85%)',
      border: 'hsl(210, 83%, 50%)'
    }
  },
  // Orange - Hue: 30
  {
    light: {
      background: 'hsl(30, 100%, 95%)',
      text: 'hsl(30, 100%, 30%)',
      border: 'hsl(30, 100%, 45%)'
    },
    dark: {
      background: 'hsl(30, 100%, 20%)',
      text: 'hsl(30, 100%, 85%)',
      border: 'hsl(30, 100%, 50%)'
    }
  },
  // Purple - Hue: 280
  {
    light: {
      background: 'hsl(280, 100%, 95%)',
      text: 'hsl(280, 100%, 30%)',
      border: 'hsl(280, 67%, 45%)'
    },
    dark: {
      background: 'hsl(280, 100%, 20%)',
      text: 'hsl(280, 100%, 85%)',
      border: 'hsl(280, 67%, 50%)'
    }
  },
  // Red - Hue: 0
  {
    light: {
      background: 'hsl(0, 100%, 95%)',
      text: 'hsl(0, 100%, 30%)',
      border: 'hsl(0, 100%, 40%)'
    },
    dark: {
      background: 'hsl(0, 100%, 20%)',
      text: 'hsl(0, 100%, 85%)',
      border: 'hsl(0, 100%, 45%)'
    }
  },
  // Cyan - Hue: 180
  {
    light: {
      background: 'hsl(180, 100%, 95%)',
      text: 'hsl(180, 100%, 20%)',
      border: 'hsl(180, 100%, 30%)'
    },
    dark: {
      background: 'hsl(180, 100%, 20%)',
      text: 'hsl(180, 100%, 85%)',
      border: 'hsl(180, 100%, 35%)'
    }
  },
  // Amber - Hue: 45
  {
    light: {
      background: 'hsl(45, 100%, 95%)',
      text: 'hsl(45, 100%, 30%)',
      border: 'hsl(45, 100%, 40%)'
    },
    dark: {
      background: 'hsl(45, 100%, 20%)',
      text: 'hsl(45, 100%, 85%)',
      border: 'hsl(45, 100%, 45%)'
    }
  },
  // Light-green - Hue: 90
  {
    light: {
      background: 'hsl(90, 100%, 95%)',
      text: 'hsl(90, 100%, 25%)',
      border: 'hsl(90, 100%, 35%)'
    },
    dark: {
      background: 'hsl(90, 100%, 20%)',
      text: 'hsl(90, 100%, 85%)',
      border: 'hsl(90, 100%, 40%)'
    }
  },
  // Indigo - Hue: 240
  {
    light: {
      background: 'hsl(240, 100%, 95%)',
      text: 'hsl(240, 100%, 25%)',
      border: 'hsl(240, 100%, 40%)'
    },
    dark: {
      background: 'hsl(240, 100%, 20%)',
      text: 'hsl(240, 100%, 85%)',
      border: 'hsl(240, 100%, 45%)'
    }
  },
  // Pink - Hue: 330
  {
    light: {
      background: 'hsl(330, 100%, 95%)',
      text: 'hsl(330, 100%, 30%)',
      border: 'hsl(330, 100%, 40%)'
    },
    dark: {
      background: 'hsl(330, 100%, 20%)',
      text: 'hsl(330, 100%, 85%)',
      border: 'hsl(330, 100%, 45%)'
    }
  },
  // Brown - Hue: 20
  {
    light: {
      background: 'hsl(20, 20%, 95%)',
      text: 'hsl(20, 20%, 25%)',
      border: 'hsl(20, 20%, 35%)'
    },
    dark: {
      background: 'hsl(20, 20%, 20%)',
      text: 'hsl(20, 20%, 85%)',
      border: 'hsl(20, 20%, 40%)'
    }
  },
  // Teal - Hue: 165
  {
    light: {
      background: 'hsl(165, 100%, 95%)',
      text: 'hsl(165, 100%, 25%)',
      border: 'hsl(165, 100%, 30%)'
    },
    dark: {
      background: 'hsl(165, 100%, 20%)',
      text: 'hsl(165, 100%, 85%)',
      border: 'hsl(165, 100%, 35%)'
    }
  },
  // Lavender - Hue: 260
  {
    light: {
      background: 'hsl(260, 67%, 95%)',
      text: 'hsl(260, 67%, 30%)',
      border: 'hsl(260, 67%, 40%)'
    },
    dark: {
      background: 'hsl(260, 67%, 20%)',
      text: 'hsl(260, 67%, 85%)',
      border: 'hsl(260, 67%, 45%)'
    }
  },
  // Mint - Hue: 140
  {
    light: {
      background: 'hsl(140, 60%, 95%)',
      text: 'hsl(140, 60%, 25%)',
      border: 'hsl(140, 60%, 35%)'
    },
    dark: {
      background: 'hsl(140, 60%, 20%)',
      text: 'hsl(140, 60%, 85%)',
      border: 'hsl(140, 60%, 40%)'
    }
  },
  // Coral - Hue: 16
  {
    light: {
      background: 'hsl(16, 100%, 95%)',
      text: 'hsl(16, 100%, 30%)',
      border: 'hsl(16, 100%, 40%)'
    },
    dark: {
      background: 'hsl(16, 100%, 20%)',
      text: 'hsl(16, 100%, 85%)',
      border: 'hsl(16, 100%, 45%)'
    }
  },
  // Magenta - Hue: 300
  {
    light: {
      background: 'hsl(300, 100%, 95%)',
      text: 'hsl(300, 100%, 30%)',
      border: 'hsl(300, 100%, 40%)'
    },
    dark: {
      background: 'hsl(300, 100%, 20%)',
      text: 'hsl(300, 100%, 85%)',
      border: 'hsl(300, 100%, 45%)'
    }
  },
  // Turquoise - Hue: 175
  {
    light: {
      background: 'hsl(175, 100%, 95%)',
      text: 'hsl(175, 100%, 25%)',
      border: 'hsl(175, 100%, 35%)'
    },
    dark: {
      background: 'hsl(175, 100%, 20%)',
      text: 'hsl(175, 100%, 85%)',
      border: 'hsl(175, 100%, 40%)'
    }
  },
  // Gold - Hue: 50
  {
    light: {
      background: 'hsl(50, 100%, 95%)',
      text: 'hsl(50, 100%, 25%)',
      border: 'hsl(50, 100%, 35%)'
    },
    dark: {
      background: 'hsl(50, 100%, 20%)',
      text: 'hsl(50, 100%, 85%)',
      border: 'hsl(50, 100%, 45%)'
    }
  },
  // Slate - Hue: 210
  {
    light: {
      background: 'hsl(210, 30%, 95%)',
      text: 'hsl(210, 30%, 25%)',
      border: 'hsl(210, 30%, 40%)'
    },
    dark: {
      background: 'hsl(210, 30%, 20%)',
      text: 'hsl(210, 30%, 85%)',
      border: 'hsl(210, 30%, 45%)'
    }
  }
];

// Cache to track used color indexes
const usedColorIndexes = new Set<number>();

/**
 * React hook to get theme-appropriate colors
 * @returns An object with color utility functions
 */
export function useThemeColors() {
  const { isDarkMode } = useTheme();
  
  /**
   * Get theme-appropriate colors for the current theme
   * @returns An array of ColorSets for the current theme
   */
  const getThemeColors = (): ColorSet[] => {
    return themeColorSets.map(colorSet => {
      return isDarkMode ? colorSet.dark : colorSet.light;
    });
  };
  
  /**
   * Get a random color set appropriate for the current theme
   * @returns A random ColorSet
   */
  const getRandomColorSet = (): ColorSet => {
    const colors = getThemeColors();
    
    if (usedColorIndexes.size === colors.length) {
      usedColorIndexes.clear();
    }
    
    const availableIndices = Array.from({ length: colors.length }, (_, i) => i)
      .filter(index => !usedColorIndexes.has(index));
      
    const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    usedColorIndexes.add(randomIndex);
    
    return colors[randomIndex];
  };
  
  /**
   * Get the next available color set
   * @param specificIndex Optional specific index to use (overrides the next available logic)
   * @returns A ColorSet
   */
  const getNextColorSet = (specificIndex?: number): ColorSet => {
    const colors = getThemeColors();
    
    if (specificIndex !== undefined && specificIndex >= 0 && specificIndex < colors.length) {
      // Return the specific color index requested
      return colors[specificIndex];
    }
    
    if (usedColorIndexes.size === colors.length) {
      usedColorIndexes.clear();
    }
    
    const availableIndex = Array.from({ length: colors.length }, (_, i) => i)
      .find(index => !usedColorIndexes.has(index)) || 0;
    usedColorIndexes.add(availableIndex);
    
    return colors[availableIndex];
  };
  
  return {
    getThemeColors,
    getRandomColorSet,
    getNextColorSet,
    isDarkMode
  };
}

// Non-hook version for use in non-React contexts
// Note: This should be used carefully as it won't automatically respond to theme changes
export function getThemeColors(isDarkMode: boolean): ColorSet[] {
  return themeColorSets.map(colorSet => {
    return isDarkMode ? colorSet.dark : colorSet.light;
  });
}

/**
 * Get a random color set based on provided dark mode state
 * @param isDarkMode Whether dark mode is active
 * @returns A random ColorSet
 */
export function getRandomColorSet(isDarkMode: boolean): ColorSet {
  const colors = getThemeColors(isDarkMode);
  
  if (usedColorIndexes.size === colors.length) {
    usedColorIndexes.clear();
  }
  
  const availableIndices = Array.from({ length: colors.length }, (_, i) => i)
    .filter(index => !usedColorIndexes.has(index));
    
  const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
  usedColorIndexes.add(randomIndex);
  
  return colors[randomIndex];
}

/**
 * Get the next available color set based on provided dark mode state
 * @param isDarkMode Whether dark mode is active
 * @param specificIndex Optional specific index to use
 * @returns A ColorSet
 */
export function getNextColorSet(isDarkMode: boolean, specificIndex?: number): ColorSet {
  const colors = getThemeColors(isDarkMode);
  
  if (specificIndex !== undefined && specificIndex >= 0 && specificIndex < colors.length) {
    // Return the specific color index requested
    return colors[specificIndex];
  }
  
  if (usedColorIndexes.size === colors.length) {
    usedColorIndexes.clear();
  }
  
  const availableIndex = Array.from({ length: colors.length }, (_, i) => i)
    .find(index => !usedColorIndexes.has(index)) || 0;
  usedColorIndexes.add(availableIndex);
  
  return colors[availableIndex];
}