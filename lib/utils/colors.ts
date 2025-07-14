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
    const hasDarkClass = document.documentElement.classList.contains('dark-mode');
    const hasDarkAttribute = document.documentElement.getAttribute('data-theme') === 'dark';
    const hasSystemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const hasLightClass = document.documentElement.classList.contains('light-mode');
    const hasLightAttribute = document.documentElement.getAttribute('data-theme') === 'light';
    
    // Check for explicit dark mode settings first, then system preference if no explicit light mode
    return hasDarkClass || hasDarkAttribute || (hasSystemDark && !hasLightClass && !hasLightAttribute);
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
  
  // Make sure we always have a valid index
  const randomIndex = availableIndices.length > 0 
    ? availableIndices[Math.floor(Math.random() * availableIndices.length)] ?? 0
    : 0;
    
  usedColors.add(randomIndex);
  
  const colors = getActivityColors();
  // Get the color at index or fallback  
  const colorAtIndex: ColorSet | undefined = 
    (randomIndex >= 0 && randomIndex < colors.length) ? colors[randomIndex] : undefined;
  
  // Provide default if undefined
  return colorAtIndex || (colors[0] || {
    background: '#f0f0f0',
    text: '#000000',
    border: '#cccccc'
  });
}

/**
 * Get the next available color set
 * @param specificIndex Optional specific index to use (overrides the next available logic)
 * @returns A ColorSet
 */
export function getNextAvailableColorSet(specificIndex?: number): ColorSet {
  const colors = getActivityColors();
  
  // Try to get specific index if provided
  if (specificIndex !== undefined && specificIndex >= 0 && specificIndex < colors.length) {
    const specificColor = colors[specificIndex];
    if (specificColor) {
      return specificColor;
    }
  }
  
  // Reset used colors if all are used
  if (usedColors.size === colors.length) {
    usedColors.clear();
  }
  
  // Find the next available index
  const availableIndex = Array.from({ length: colors.length }, (_, i) => i)
    .find(i => !usedColors.has(i)) || 0;
  
  usedColors.add(availableIndex);
  
  // Get the color at the available index
  const colorAtIndex: ColorSet | undefined = 
    (availableIndex >= 0 && availableIndex < colors.length) ? colors[availableIndex] : undefined;
  
  // Provide default if undefined
  return colorAtIndex || (colors[0] || {
    background: '#f0f0f0',
    text: '#000000',
    border: '#cccccc'
  });
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
  // Convert RGB values to sRGB
  const srgb = [r, g, b].map(c => {
    const value = c / 255;
    return value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
  });
  
  // Ensure sRGB values are always numbers
  const rs = srgb[0] || 0;
  const gs = srgb[1] || 0;
  const bs = srgb[2] || 0;
  
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

// Calculate contrast ratio between two HSL colors
export function getContrastRatio(hsl1: string, hsl2: string): number {
  const parseHSL = (hsl: string): [number, number, number] => {
    try {
      // Skip parsing if empty string
      if (!hsl || hsl.trim() === '') {
        return [0, 0, 50]; // Default to medium gray
      }
      
      // Handle hex colors
      if (hsl.startsWith('#')) {
        // Safely process the hex color
        // We need to initialize these variables here, but they will be reassigned based on parsing
        // This must remain a `let` declaration as the values are modified
        let r = 0, g = 0, b = 0;
        
        if (hsl.length === 4) { // #RGB format
          // Extract and duplicate each hex digit
          const hexR = hsl.charAt(1);
          const hexG = hsl.charAt(2);
          const hexB = hsl.charAt(3);
          
          if (hexR && hexG && hexB) {
            r = parseInt(hexR + hexR, 16);
            g = parseInt(hexG + hexG, 16);
            b = parseInt(hexB + hexB, 16);
          }
        } else { // #RRGGBB format
          const hexR = hsl.substring(1, 3);
          const hexG = hsl.substring(3, 5); 
          const hexB = hsl.substring(5, 7);
          
          if (hexR && hexG && hexB) {
            r = parseInt(hexR, 16);
            g = parseInt(hexG, 16);
            b = parseInt(hexB, 16);
          }
        }
        
        // Convert RGB to HSL (approximation)
        r /= 255;
        g /= 255;
        b /= 255;
        
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        // These values will be reassigned in the conditional logic below, so they must remain `let`
        // eslint-disable-next-line prefer-const
        let h = 0, s = 0, l = (max + min) / 2;
        
        if (max !== min) {
          const d = max - min;
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
          
          if (max === r) {
            h = (g - b) / d + (g < b ? 6 : 0);
          } else if (max === g) {
            h = (b - r) / d + 2;
          } else if (max === b) {
            h = (r - g) / d + 4;
          }
          
          h *= 60;
        }
        
        return [h, s * 100, l * 100];
      }
      
      // Handle rgb/rgba format
      if (hsl.startsWith('rgb')) {
        const rgbMatch = hsl.match(/rgba?\((\d+)[,\s]+(\d+)[,\s]+(\d+)/);
        if (rgbMatch && rgbMatch[1] && rgbMatch[2] && rgbMatch[3]) {
          const r = parseInt(rgbMatch[1], 10) / 255;
          const g = parseInt(rgbMatch[2], 10) / 255;
          const b = parseInt(rgbMatch[3], 10) / 255;
          
          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          // These values will be reassigned in the conditional logic below, so they must remain `let`
          // eslint-disable-next-line prefer-const
          let h = 0, s = 0, l = (max + min) / 2;
          
          if (max !== min) {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            
            if (max === r) {
              h = (g - b) / d + (g < b ? 6 : 0);
            } else if (max === g) {
              h = (b - r) / d + 2;
            } else if (max === b) {
              h = (r - g) / d + 4;
            }
            
            h *= 60;
          }
          
          return [h, s * 100, l * 100];
        }
      }
      
      // Support multiple HSL formats: hsl(120, 60%, 95%), hsl(120,60%,95%), hsl(120 60% 95%)
      const match = hsl.match(/hsl\((\d+)[,\s]+(\d+)%[,\s]+(\d+)%\)/);
      if (!match || !match[1] || !match[2] || !match[3]) {
        return [0, 0, 50]; // Default to medium gray
      }
      
      return [Number(match[1]), Number(match[2]), Number(match[3])];
    } catch {
      return [0, 0, 50]; // Default to medium gray on any error
    }
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

// Validate contrast ratio between two colors
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
  // Skip all validation and logging in production
  if (process.env.NODE_ENV === 'production') {
    return;
  }
  
  try {
    // Get theme colors
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);
    
    // Get base colors
    const background = computedStyle.getPropertyValue('--background').trim() || '#ffffff';
    const foreground = computedStyle.getPropertyValue('--foreground').trim() || '#000000';
    const backgroundMuted = computedStyle.getPropertyValue('--background-muted').trim() || '#f5f5f5';
    const foregroundMuted = computedStyle.getPropertyValue('--foreground-muted').trim() || '#6b7280';

    // Only log in development environment
    if (process.env.NODE_ENV === 'development') {
      console.group('Theme Contrast Validation (' + (isDarkMode() ? 'Dark' : 'Light') + ' Mode)');
      // Safely try to calculate contrast ratios - these may fail if the variables aren't CSS colors
      try {
        if (background && foreground) {
          console.log('Main contrast ratio:', getContrastRatio(background, foreground));
        }
        if (backgroundMuted && foregroundMuted) {
          console.log('Muted contrast ratio:', getContrastRatio(backgroundMuted, foregroundMuted));
        }
      } catch {
        console.log('Could not calculate contrast ratios with current theme values.');
      }
      console.groupEnd();
    }
  } catch (error) {
    // Silently handle errors in test environment
    if (process.env.NODE_ENV !== 'test') {
      console.error('Error validating theme colors:', error);
    }
  }
}