export interface ColorSet {
  light: {
    background: string;
    text: string;
    border: string;
  };
  dark: {
    background: string;
    text: string;
    border: string;
  };
}

// Internal HSL colors with dark mode consideration
// Each color has a light and dark mode variation defined in the same group
export const internalActivityColors: ColorSet[] = [
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
  // Purple - Hue: 270
  {
    light: {
      background: 'hsl(270, 60%, 95%)',
      text: 'hsl(270, 60%, 30%)',
      border: 'hsl(270, 60%, 45%)'
    },
    dark: {
      background: 'hsl(270, 60%, 20%)',
      text: 'hsl(270, 60%, 85%)',
      border: 'hsl(270, 60%, 50%)'
    }
  },
  // Red - Hue: 0
  {
    light: {
      background: 'hsl(0, 100%, 95%)',
      text: 'hsl(0, 100%, 30%)',
      border: 'hsl(0, 100%, 45%)'
    },
    dark: {
      background: 'hsl(0, 100%, 20%)',
      text: 'hsl(0, 100%, 85%)',
      border: 'hsl(0, 100%, 50%)'
    }
  },
  // Teal - Hue: 180
  {
    light: {
      background: 'hsl(180, 60%, 95%)',
      text: 'hsl(180, 60%, 25%)',
      border: 'hsl(180, 60%, 35%)'
    },
    dark: {
      background: 'hsl(180, 60%, 20%)',
      text: 'hsl(180, 60%, 85%)',
      border: 'hsl(180, 60%, 40%)'
    }
  },
  // Pink - Hue: 330
  {
    light: {
      background: 'hsl(330, 100%, 95%)',
      text: 'hsl(330, 100%, 30%)',
      border: 'hsl(330, 100%, 45%)'
    },
    dark: {
      background: 'hsl(330, 100%, 20%)',
      text: 'hsl(330, 100%, 85%)',
      border: 'hsl(330, 100%, 50%)'
    }
  },
  // Amber - Hue: 45
  {
    light: {
      background: 'hsl(45, 100%, 95%)',
      text: 'hsl(45, 100%, 30%)',
      border: 'hsl(45, 100%, 45%)'
    },
    dark: {
      background: 'hsl(45, 100%, 20%)',
      text: 'hsl(45, 100%, 85%)',
      border: 'hsl(45, 100%, 50%)'
    }
  }
];

/**
 * Checks if the dark mode is enabled either through system preference or manual setting
 */
export function isDarkMode(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  
  // First check for manual preference via class
  const htmlElement = document.documentElement;
  if (htmlElement.classList.contains('dark')) {
    return true;
  }
  
  // Then check for system preference if no manual setting
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * Gets the next available color set for an activity
 * @param index The color index to use
 * @returns Object with ColorSet and index
 */
export function getNextAvailableColorSet(index: number): { colors: ColorSet; index: number } {
  // Use modulo to ensure we always have a valid index even if we run out of colors
  const colorIndex = index % internalActivityColors.length;
  const colorSet = internalActivityColors[colorIndex];
  
  // Ensure we have a valid ColorSet to return
  if (colorSet) {
    return {
      colors: colorSet,
      index: colorIndex
    };
  }
  
  // Fallback to the first color or default if nothing is available
  return {
    colors: internalActivityColors[0] || {
      light: {
        background: '#f0f0f0',
        text: '#000000',
        border: '#cccccc'
      },
      dark: {
        background: '#303030',
        text: '#ffffff',
        border: '#505050'
      }
    },
    index: 0
  };
}

/**
 * Validates if the theme has all the necessary color variables defined
 */
export function validateThemeColors(): boolean {
  // List of required CSS variables
  const requiredColorVariables = [
    '--primary',
    '--secondary',
    '--accent',
    '--background',
    '--foreground',
    '--border-color',
    '--error',
    '--success'
  ];
  
  // Check if CSS variables exist
  if (typeof window !== 'undefined') {
    const style = getComputedStyle(document.documentElement);
    
    return requiredColorVariables.every(variable => {
      const value = style.getPropertyValue(variable);
      return value && value.trim() !== '';
    });
  }
  
  // In SSR environment, assume everything is fine
  return true;
}
