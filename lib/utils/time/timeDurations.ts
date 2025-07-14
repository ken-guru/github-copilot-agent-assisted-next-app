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
