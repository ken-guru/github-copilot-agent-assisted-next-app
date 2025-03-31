/**
 * Unified time utilities for formatting and converting time values.
 * Consolidates functionality from previous time.ts and timeUtils.ts files.
 */

/**
 * Formats milliseconds into a human-readable time string (H:MM:SS or M:SS format)
 * @param milliseconds - Time in milliseconds
 * @returns Formatted time string
 */
export function formatTimeHuman(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Formats seconds into a MM:SS format
 * @param seconds - Time in seconds (can be negative)
 * @returns Formatted time string in MM:SS format
 */
export function formatTime(seconds: number): string {
  const absSeconds = Math.abs(seconds);
  const minutes = Math.floor(absSeconds / 60);
  const remainingSeconds = absSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

/**
 * Formats milliseconds into a MM:SS.mmm format with millisecond precision
 * @param milliseconds - Time in milliseconds
 * @returns Formatted time string with millisecond precision
 */
export function formatTimeWithMilliseconds(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const ms = milliseconds % 1000;
  
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(ms).padStart(3, '0')}`;
}

/**
 * Formats milliseconds into a MM:SS format
 * @param milliseconds - Time in milliseconds
 * @returns Formatted time string in MM:SS format
 */
export function formatTimeFromMilliseconds(milliseconds: number): string {
  return formatTime(Math.floor(milliseconds / 1000));
}

/**
 * Formats seconds into a MM:SS format (alias for formatTime)
 * @param seconds - Time in seconds
 * @returns Formatted time string in MM:SS format
 */
export function formatTimeFromSeconds(seconds: number): string {
  return formatTime(seconds);
}

/**
 * Converts milliseconds to seconds
 * @param milliseconds - Time in milliseconds
 * @returns Time in seconds (can include decimal points)
 */
export function convertMillisecondsToSeconds(milliseconds: number): number {
  return milliseconds / 1000;
}

/**
 * Converts seconds to milliseconds
 * @param seconds - Time in seconds
 * @returns Time in milliseconds
 */
export function convertSecondsToMilliseconds(seconds: number): number {
  return seconds * 1000;
}