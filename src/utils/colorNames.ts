/**
 * Color names and utilities for the activity color system
 * Maps colorIndex to human-readable names and provides visual helpers
 */

// Map colorIndex to human-readable color names
export const COLOR_NAMES = [
  'Green',      // 0 - Hue: 120
  'Blue',       // 1 - Hue: 210  
  'Orange',     // 2 - Hue: 30
  'Purple',     // 3 - Hue: 280
  'Red',        // 4 - Hue: 0
  'Cyan',       // 5 - Hue: 180
  'Amber',      // 6 - Hue: 45
  'Light Green', // 7 - Hue: 90
  'Indigo',     // 8 - Hue: 240
  'Pink',       // 9 - Hue: 330
  'Brown',      // 10 - Hue: 20
  'Teal'        // 11 - Hue: 165
];

// Map colorIndex to emoji for visual representation
export const COLOR_EMOJIS = [
  '🟢', // Green
  '🔵', // Blue  
  '🟠', // Orange
  '🟣', // Purple
  '🔴', // Red
  '🔵', // Cyan (using blue circle)
  '🟡', // Amber (using yellow circle)
  '🟢', // Light Green
  '🟣', // Indigo (using purple circle)
  '🩷', // Pink
  '🟤', // Brown
  '🔵'  // Teal (using blue circle)
];

/**
 * Get the display name for a color index
 */
export function getColorName(colorIndex: number): string {
  return COLOR_NAMES[colorIndex] || `Color ${colorIndex}`;
}

/**
 * Get the emoji for a color index
 */
export function getColorEmoji(colorIndex: number): string {
  return COLOR_EMOJIS[colorIndex] || '⚫';
}

/**
 * Get both emoji and name for display
 */
export function getColorDisplay(colorIndex: number): string {
  return `${getColorEmoji(colorIndex)} ${getColorName(colorIndex)}`;
}

/**
 * Get all available color options for selection
 */
export function getColorOptions(): Array<{ value: number; label: string; name: string; emoji: string }> {
  return COLOR_NAMES.map((name, index) => ({
    value: index,
    label: getColorDisplay(index),
    name,
    emoji: getColorEmoji(index)
  }));
}
