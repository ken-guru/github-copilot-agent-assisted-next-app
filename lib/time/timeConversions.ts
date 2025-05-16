import { formatTime } from './timeFormatters';
import { TimeFormatOptions } from './types';

/**
 * Formats milliseconds to a formatted time string
 * 
 * @param milliseconds - Number of milliseconds to format
 * @param options - Formatting options
 * @returns Formatted time string
 */
export function formatTimeFromMs(
  milliseconds: number,
  options: TimeFormatOptions = {}
): string {
  return formatTime(Math.floor(milliseconds / 1000), options);
}
