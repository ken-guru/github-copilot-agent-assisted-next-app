export interface ColorSet {
  background: string;
  text: string;
  border: string;
}

// Convert HSL to hex color
function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

// Parse HSL string and convert to hex
function convertHslToHex(hslString: string): string {
  const match = hslString.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
  if (!match) return '#000000';
  const [, h, s, l] = match.map(Number);
  return hslToHex(h, s, l);
}

// Internal HSL colors
const internalActivityColors: ColorSet[] = [
  // Green - Hue: 120
  {
    background: 'hsl(120, 60%, 95%)',
    text: 'hsl(120, 60%, 25%)',
    border: 'hsl(120, 60%, 35%)'
  },
  // Blue - Hue: 210
  {
    background: 'hsl(210, 100%, 95%)',
    text: 'hsl(210, 100%, 30%)',
    border: 'hsl(210, 83%, 45%)'
  },
  // Orange - Hue: 30
  {
    background: 'hsl(30, 100%, 95%)',
    text: 'hsl(30, 100%, 30%)',
    border: 'hsl(30, 100%, 45%)'
  },
  // Purple - Hue: 280
  {
    background: 'hsl(280, 100%, 95%)',
    text: 'hsl(280, 100%, 30%)',
    border: 'hsl(280, 67%, 45%)'
  },
  // Red - Hue: 0
  {
    background: 'hsl(0, 100%, 95%)',
    text: 'hsl(0, 100%, 30%)',
    border: 'hsl(0, 100%, 40%)'
  },
  // Cyan - Hue: 180
  {
    background: 'hsl(180, 100%, 95%)',
    text: 'hsl(180, 100%, 20%)',
    border: 'hsl(180, 100%, 30%)'
  },
  // Amber - Hue: 45
  {
    background: 'hsl(45, 100%, 95%)',
    text: 'hsl(45, 100%, 30%)',
    border: 'hsl(45, 100%, 40%)'
  },
  // Light-green - Hue: 90
  {
    background: 'hsl(90, 100%, 95%)',
    text: 'hsl(90, 100%, 25%)',
    border: 'hsl(90, 100%, 35%)'
  },
  // Indigo - Hue: 240
  {
    background: 'hsl(240, 100%, 95%)',
    text: 'hsl(240, 100%, 25%)',
    border: 'hsl(240, 100%, 40%)'
  },
  // Pink - Hue: 330
  {
    background: 'hsl(330, 100%, 95%)',
    text: 'hsl(330, 100%, 30%)',
    border: 'hsl(330, 100%, 40%)'
  },
  // Brown - Hue: 20
  {
    background: 'hsl(20, 20%, 95%)',
    text: 'hsl(20, 20%, 25%)',
    border: 'hsl(20, 20%, 35%)'
  },
  // Teal - Hue: 165
  {
    background: 'hsl(165, 100%, 95%)',
    text: 'hsl(165, 100%, 25%)',
    border: 'hsl(165, 100%, 30%)'
  }
];

// Convert internal HSL colors to hex for external use
export const activityColors: ColorSet[] = internalActivityColors.map(color => ({
  background: convertHslToHex(color.background),
  text: convertHslToHex(color.text),
  border: convertHslToHex(color.border)
}));

// Define dark mode variants
const internalDarkModeActivityColors: ColorSet[] = internalActivityColors.map(color => {
  const hueMatch = color.background.match(/hsl\((\d+),/);
  const hue = hueMatch ? parseInt(hueMatch[1]) : 0;
  
  return {
    background: `hsl(${hue}, 70%, 25%)`,
    text: `hsl(${hue}, 70%, 90%)`,
    border: `hsl(${hue}, 70%, 40%)`
  };
});

export const darkModeActivityColors: ColorSet[] = internalDarkModeActivityColors.map(color => ({
  background: convertHslToHex(color.background),
  text: convertHslToHex(color.text),
  border: convertHslToHex(color.border)
}));

const usedColors = new Set<number>();

export function getRandomColorSet(darkMode = false): ColorSet {
  if (usedColors.size === activityColors.length) {
    usedColors.clear();
  }
  
  const availableIndices = activityColors
    .map((_, index) => index)
    .filter(index => !usedColors.has(index));
    
  const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
  usedColors.add(randomIndex);
  
  const colors = darkMode ? darkModeActivityColors : activityColors;
  return colors[randomIndex];
}

export function getNextAvailableColorSet(darkMode = false): ColorSet {
  if (usedColors.size === activityColors.length) {
    usedColors.clear();
  }
  
  const availableIndex = activityColors
    .map((_, index) => index)
    .find(index => !usedColors.has(index)) || 0;
  usedColors.add(availableIndex);
  
  const colors = darkMode ? darkModeActivityColors : activityColors;
  return colors[availableIndex];
}

const colorPalette = [
  '#E8F5E9', // Light Green
  '#E3F2FD', // Light Blue
  '#FCE4EC', // Light Pink
  '#FFF9C4', // Light Yellow
  '#F5F5F5', // Light Gray
  '#EDE7F6', // Light Purple
  '#E0F2F1', // Light Teal
  '#FBE9E7', // Light Orange
  '#FFCDD2', // Light Red
];

export const getColor = (index: number) => {
  const safeIndex = index % colorPalette.length;
  return colorPalette[safeIndex];
};