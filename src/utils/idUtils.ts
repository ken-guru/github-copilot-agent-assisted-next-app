/**
 * Utility functions for generating and managing IDs
 */

/**
 * Generates a unique ID using timestamp and random values
 * @returns A unique string ID
 */
export function generateUniqueId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

/**
 * Checks if a string is a valid UUID format
 * @param id - The string to check
 * @returns Boolean indicating if the string is a valid UUID
 */
export function isValidUuid(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}