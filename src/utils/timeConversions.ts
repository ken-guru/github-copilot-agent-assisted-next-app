/**
 * Time conversion utilities
 */

/**
 * Converts milliseconds to seconds
 * 
 * @param milliseconds - The number of milliseconds to convert
 * @returns The equivalent number of seconds
 */
export function msToSeconds(milliseconds: number): number {
  return Math.floor(milliseconds / 1000);
}

/**
 * Converts seconds to milliseconds
 * 
 * @param seconds - The number of seconds to convert
 * @returns The equivalent number of milliseconds
 */
export function secondsToMs(seconds: number): number {
  return seconds * 1000;
}

/**
 * Converts minutes to seconds
 * 
 * @param minutes - The number of minutes to convert
 * @returns The equivalent number of seconds
 */
export function minutesToSeconds(minutes: number): number {
  return minutes * 60;
}

/**
 * Converts seconds to minutes
 * 
 * @param seconds - The number of seconds to convert
 * @returns The equivalent number of minutes
 */
export function secondsToMinutes(seconds: number): number {
  return seconds / 60;
}

/**
 * Converts hours to seconds
 * 
 * @param hours - The number of hours to convert
 * @returns The equivalent number of seconds
 */
export function hoursToSeconds(hours: number): number {
  return hours * 3600;
}

/**
 * Converts seconds to hours
 * 
 * @param seconds - The number of seconds to convert
 * @returns The equivalent number of hours
 */
export function secondsToHours(seconds: number): number {
  return seconds / 3600;
}
