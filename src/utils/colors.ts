export interface ColorSet {
  background: string;
  text: string;
  border: string;
}

export const activityColors: ColorSet[] = [
  // Original 6 colors
  {
    background: '#E8F5E9', // Light green
    text: '#1B5E20',      // Dark green
    border: '#2E7D32'     // Medium green
  },
  {
    background: '#E3F2FD', // Light blue
    text: '#0D47A1',      // Dark blue
    border: '#1976D2'     // Medium blue
  },
  {
    background: '#FFF3E0', // Light orange
    text: '#E65100',      // Dark orange
    border: '#F57C00'     // Medium orange
  },
  {
    background: '#F3E5F5', // Light purple
    text: '#4A148C',      // Dark purple
    border: '#7B1FA2'     // Medium purple
  },
  {
    background: '#FFEBEE', // Light red
    text: '#B71C1C',      // Dark red
    border: '#C62828'     // Medium red
  },
  {
    background: '#E0F7FA', // Light cyan
    text: '#006064',      // Dark cyan
    border: '#00838F'     // Medium cyan
  },
  // Adding 6 more colors to reach at least 12
  {
    background: '#FFF8E1', // Light amber
    text: '#FF6F00',      // Dark amber
    border: '#FFA000'     // Medium amber
  },
  {
    background: '#F1F8E9', // Light light-green
    text: '#33691E',      // Dark light-green
    border: '#558B2F'     // Medium light-green
  },
  {
    background: '#E8EAF6', // Light indigo
    text: '#1A237E',      // Dark indigo
    border: '#303F9F'     // Medium indigo
  },
  {
    background: '#FCE4EC', // Light pink
    text: '#880E4F',      // Dark pink
    border: '#C2185B'     // Medium pink
  },
  {
    background: '#EFEBE9', // Light brown
    text: '#3E2723',      // Dark brown
    border: '#5D4037'     // Medium brown
  },
  {
    background: '#E0F2F1', // Light teal
    text: '#004D40',      // Dark teal
    border: '#00796B'     // Medium teal
  }
];

// Define dark mode variants of the colors
export const darkModeActivityColors: ColorSet[] = [
  // Dark mode versions of the original 6 colors
  {
    background: '#1B5E20', // Dark green
    text: '#E8F5E9',      // Light green
    border: '#2E7D32'     // Medium green
  },
  {
    background: '#0D47A1', // Dark blue
    text: '#E3F2FD',      // Light blue
    border: '#1976D2'     // Medium blue
  },
  {
    background: '#E65100', // Dark orange
    text: '#FFF3E0',      // Light orange
    border: '#F57C00'     // Medium orange
  },
  {
    background: '#4A148C', // Dark purple
    text: '#F3E5F5',      // Light purple
    border: '#7B1FA2'     // Medium purple
  },
  {
    background: '#B71C1C', // Dark red
    text: '#FFEBEE',      // Light red
    border: '#C62828'     // Medium red
  },
  {
    background: '#006064', // Dark cyan
    text: '#E0F7FA',      // Light cyan
    border: '#00838F'     // Medium cyan
  },
  // Dark mode versions of the additional 6 colors
  {
    background: '#FF6F00', // Dark amber
    text: '#FFF8E1',      // Light amber
    border: '#FFA000'     // Medium amber
  },
  {
    background: '#33691E', // Dark light-green
    text: '#F1F8E9',      // Light light-green
    border: '#558B2F'     // Medium light-green
  },
  {
    background: '#1A237E', // Dark indigo
    text: '#E8EAF6',      // Light indigo
    border: '#303F9F'     // Medium indigo
  },
  {
    background: '#880E4F', // Dark pink
    text: '#FCE4EC',      // Light pink
    border: '#C2185B'     // Medium pink
  },
  {
    background: '#3E2723', // Dark brown
    text: '#EFEBE9',      // Light brown
    border: '#5D4037'     // Medium brown
  },
  {
    background: '#004D40', // Dark teal
    text: '#E0F2F1',      // Light teal
    border: '#00796B'     // Medium teal
  }
];

const usedColors = new Set<number>();

export function getRandomColorSet(darkMode = false): ColorSet {
  // If all colors are used, reset the used colors
  if (usedColors.size === activityColors.length) {
    usedColors.clear();
  }

  // Get available color indices
  const availableIndices = activityColors
    .map((_, index) => index)
    .filter(index => !usedColors.has(index));

  // Pick a random available color
  const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
  usedColors.add(randomIndex);

  const colors = darkMode ? darkModeActivityColors : activityColors;
  return colors[randomIndex];
}

export function getNextAvailableColorSet(darkMode = false): ColorSet {
  // If all colors are used, reset the used colors
  if (usedColors.size === activityColors.length) {
    usedColors.clear();
  }

  // Get the first available color index
  const availableIndex = activityColors
    .map((_, index) => index)
    .find(index => !usedColors.has(index)) || 0;

  usedColors.add(availableIndex);
  
  const colors = darkMode ? darkModeActivityColors : activityColors;
  return colors[availableIndex];
}