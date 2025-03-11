export interface ColorSet {
  background: string;
  text: string;
  border: string;
}

// Internal HSL colors with dark mode consideration
// Each color has a light and dark mode variation defined in the same group
const internalActivityColors: {
  light: ColorSet;
  dark: ColorSet;
}[] = [
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
  }
];

// Get appropriate color set based on theme
const isDarkMode = () => {
  if (typeof window !== 'undefined') {
    return document.documentElement.classList.contains('dark-mode') ||
      (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches &&
       !document.documentElement.classList.contains('light-mode'));
  }
  return false;
};

// Export a function that returns theme-appropriate colors instead of a static array
export function getActivityColors(): ColorSet[] {
  return internalActivityColors.map(colorSet => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      return colorSet.light; // Default to light mode during SSR
    }
    
    // Return the appropriate color set based on dark mode state
    return isDarkMode() ? colorSet.dark : colorSet.light;
  });
}

const usedColors = new Set<number>();

/**
 * Get a random color set
 * @returns A random ColorSet
 */
export function getRandomColorSet(): ColorSet {
  if (usedColors.size === internalActivityColors.length) {
    usedColors.clear();
  }
  
  const availableIndices = Array.from({ length: internalActivityColors.length }, (_, i) => i)
    .filter(index => !usedColors.has(index));
    
  const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
  usedColors.add(randomIndex);
  
  const colors = getActivityColors();
  return colors[randomIndex];
}

/**
 * Get the next available color set
 * @param specificIndex Optional specific index to use (overrides the next available logic)
 * @returns A ColorSet
 */
export function getNextAvailableColorSet(specificIndex?: number): ColorSet {
  const colors = getActivityColors();
  
  if (specificIndex !== undefined && specificIndex >= 0 && specificIndex < colors.length) {
    // Return the specific color index requested
    return colors[specificIndex];
  }
  
  if (usedColors.size === colors.length) {
    usedColors.clear();
  }
  
  const availableIndex = Array.from({ length: colors.length }, (_, i) => i)
    .find(index => !usedColors.has(index)) || 0;
  usedColors.add(availableIndex);
  
  return colors[availableIndex];
}

// Convert colorPalette to HSL
const colorPalette = [
  'hsl(140, 50%, 92%)', // Light Green
  'hsl(210, 100%, 95%)', // Light Blue
  'hsl(340, 100%, 95%)', // Light Pink
  'hsl(54, 100%, 95%)', // Light Yellow
  'hsl(0, 0%, 96%)', // Light Gray
  'hsl(260, 60%, 95%)', // Light Purple
  'hsl(174, 60%, 95%)', // Light Teal
  'hsl(14, 100%, 95%)', // Light Orange
  'hsl(0, 100%, 95%)', // Light Red
];

export const getColor = (index: number) => {
  const safeIndex = index % colorPalette.length;
  return colorPalette[safeIndex];
};