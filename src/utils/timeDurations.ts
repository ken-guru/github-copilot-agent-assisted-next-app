/**
 * Time duration calculation utilities
 */

/**
 * Utility to calculate duration in seconds between two timestamps
 * 
 * @param startTime - Start timestamp in milliseconds
 * @param endTime - End timestamp in milliseconds
 * @returns Duration in seconds
 */
export function calculateDurationInSeconds(startTime: number, endTime: number): number {
  return Math.floor((endTime - startTime) / 1000);
}

/**
 * Utility to calculate duration in minutes between two timestamps
 * 
 * @param startTime - Start timestamp in milliseconds
 * @param endTime - End timestamp in milliseconds
 * @returns Duration in minutes
 */
export function calculateDurationInMinutes(startTime: number, endTime: number): number {
  return Math.floor((endTime - startTime) / 60000);
}

/**
 * Utility to calculate duration in hours between two timestamps
 * 
 * @param startTime - Start timestamp in milliseconds
 * @param endTime - End timestamp in milliseconds
 * @returns Duration in hours
 */
export function calculateDurationInHours(startTime: number, endTime: number): number {
  return Math.floor((endTime - startTime) / 3600000);
}
