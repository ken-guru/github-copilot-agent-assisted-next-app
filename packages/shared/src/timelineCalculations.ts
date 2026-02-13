/**
 * Timeline Calculations
 * Shared utility functions for time and duration calculations
 */

/**
 * Calculates progress as a percentage
 */
export const calculateProgress = (
  startTime: number,
  duration: number,
  currentTime: number
): number => {
  const elapsed = currentTime - startTime;
  return Math.min(Math.max((elapsed / duration) * 100, 0), 100);
};

/**
 * Formats duration in milliseconds to human-readable string
 */
export const formatDuration = (ms: number): string => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  }
  return `${seconds}s`;
};

/**
 * Formats time in milliseconds to MM:SS format
 */
export const formatTime = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};
