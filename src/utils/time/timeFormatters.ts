import { TimeFormatOptions } from './types';

/**
 * Formats a time in seconds to a string format
 * 
 * @param seconds - The number of seconds to format
 * @param options - Formatting options
 * @returns A formatted time string - either "MM:SS" or "HH:MM:SS" based on options
 * 
 * @example
 * formatTime(65) // Returns "01:05"
 * formatTime(65, { includeHours: true }) // Returns "00:01:05"
 * formatTime(3661, { includeHours: true }) // Returns "01:01:01"
 * formatTime(3661) // Returns "61:01" (no hour limit in MM:SS format)
 * formatTime(65, { padWithZeros: false }) // Returns "1:05"
 */
export function formatTime(
  seconds: number,
  options: TimeFormatOptions = {}
): string {
  const { includeHours = false, padWithZeros = true } = options;
  const absSeconds = Math.abs(seconds);
  
  let hours = 0;
  let minutes = 0;
  let remainingSeconds = 0;
  
  if (includeHours) {
    hours = Math.floor(absSeconds / 3600);
    minutes = Math.floor((absSeconds % 3600) / 60);
    remainingSeconds = absSeconds % 60;
  } else {
    minutes = Math.floor(absSeconds / 60);
    remainingSeconds = absSeconds % 60;
  }
  
  const format = (num: number): string => {
    return padWithZeros ? String(num).padStart(2, '0') : String(num);
  };
  
  // Always pad seconds with zeros, even when padWithZeros is false
  // This matches the expected test behavior
  const formattedSeconds = padWithZeros ? 
    String(remainingSeconds).padStart(2, '0') : 
    remainingSeconds < 10 ? 
      `0${remainingSeconds}` : 
      String(remainingSeconds);
  
  if (includeHours) {
    return `${format(hours)}:${format(minutes)}:${formattedSeconds}`;
  }
  
  return `${format(minutes)}:${formattedSeconds}`;
}

/**
 * Formats a time in seconds to a "MM:SS" string format (e.g. "05:30" for 330 seconds)
 * 
 * @param seconds - The number of seconds to format
 * @returns A string in "MM:SS" format
 * 
 * @example
 * formatTimeMMSS(65) // Returns "01:05"
 * formatTimeMMSS(3661) // Returns "61:01" (no hour limit)
 * 
 * @deprecated Use formatTime(seconds) instead
 */
export function formatTimeMMSS(seconds: number): string {
  return formatTime(seconds);
}
