export interface ColorSet {
  background: string;
  text: string;
  border: string;
}

// Internal HSL colors with dark mode consideration
// Each color has a light and dark mode variation defined in the same group
export const internalActivityColors: {
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
export const isDarkMode = () => {
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

// Convert HSL to RGB for contrast calculations
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [255 * f(0), 255 * f(8), 255 * f(4)];
}

// Calculate relative luminance for RGB values
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

// Calculate contrast ratio between two HSL colors
export function getContrastRatio(hsl1: string, hsl2: string): number {
  const parseHSL = (hsl: string) => {
    const match = hsl.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
    if (!match) throw new Error('Invalid HSL color format');
    return [Number(match[1]), Number(match[2]), Number(match[3])];
  };

  const [h1, s1, l1] = parseHSL(hsl1);
  const [h2, s2, l2] = parseHSL(hsl2);

  const rgb1 = hslToRgb(h1, s1, l1);
  const rgb2 = hslToRgb(h2, s2, l2);

  const l1lum = getLuminance(...rgb1);
  const l2lum = getLuminance(...rgb2);

  const lighter = Math.max(l1lum, l2lum);
  const darker = Math.min(l1lum, l2lum);

  return (lighter + 0.05) / (darker + 0.05);
}

// Validate color combination meets WCAG contrast requirements
export function validateContrast(
  background: string, 
  text: string, 
  wcagLevel: 'AA' | 'AAA' = 'AA'
): boolean {
  const ratio = getContrastRatio(background, text);
  // WCAG 2.1 Level AA requires:
  // - 4.5:1 for normal text
  // - 3:1 for large text
  // Level AAA requires:
  // - 7:1 for normal text
  // - 4.5:1 for large text
  const minRatio = wcagLevel === 'AA' ? 4.5 : 7;
  return ratio >= minRatio;
}

// Validate theme colors
export function validateThemeColors(): void {
  if (typeof window === 'undefined') return;

  const isDark = document.documentElement.classList.contains('dark-mode');
  const vars = getComputedStyle(document.documentElement);
  
  try {
    // Handle potentially missing or malformed CSS variables in test environment
    const background = vars.getPropertyValue('--background').trim() || 'hsl(220, 20%, 98%)';
    const foreground = vars.getPropertyValue('--foreground').trim() || 'hsl(220, 15%, 12%)';
    const backgroundMuted = vars.getPropertyValue('--background-muted').trim() || 'hsl(220, 20%, 94%)';
    const foregroundMuted = vars.getPropertyValue('--foreground-muted').trim() || 'hsl(220, 10%, 35%)';

    // Only log if we're in a browser environment
    if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'test') {
      console.group(`Theme Contrast Validation (${isDark ? 'Dark' : 'Light'} Mode)`);
      console.log('Main contrast ratio:', getContrastRatio(background, foreground));
      console.log('Muted contrast ratio:', getContrastRatio(backgroundMuted, foregroundMuted));
      console.groupEnd();
    }
  } catch (error) {
    // Silently handle errors in test environment
    if (process.env.NODE_ENV !== 'test') {
      console.error('Error validating theme colors:', error);
    }
  }
}