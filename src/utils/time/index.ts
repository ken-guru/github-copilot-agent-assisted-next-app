/**
 * Time formatting and manipulation utilities
 * 
 * This is a barrel file that re-exports all time utility functions and types
 * for backwards compatibility with code that imports from the original timeUtils.ts
 */

// Re-export all functions and types
export * from './types';
export * from './timeFormatters';
export * from './timeConversions';
export * from './timeDurations';

// Standalone utility function for human-readable time formatting
function formatTimeHuman(milliseconds: number): string {
  // Handle negative values and edge cases
  if (milliseconds < 0) {
    milliseconds = 0;
  }
  
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export { formatTimeHuman };
