export interface ColorSet {
  background: string;
  text: string;
  border: string;
}

export const activityColors: ColorSet[] = [
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
  }
];

const usedColors = new Set<number>();

export function getRandomColorSet(): ColorSet {
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

  return activityColors[randomIndex];
}

export function getNextAvailableColorSet(): ColorSet {
  // If all colors are used, reset the used colors
  if (usedColors.size === activityColors.length) {
    usedColors.clear();
  }

  // Get the first available color index
  const availableIndex = activityColors
    .map((_, index) => index)
    .find(index => !usedColors.has(index)) || 0;

  usedColors.add(availableIndex);
  return activityColors[availableIndex];
}