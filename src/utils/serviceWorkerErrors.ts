/**
 * Helper function to safely get error message from unknown error type
 * @param error Any error value from catch block
 * @returns A string representation of the error
 */
export function getErrorMessage(error: unknown): string {
  if (error === null) {
    return 'null';
  }
  if (error === undefined) {
    return 'undefined';
  }
  if (typeof error === 'string') {
    return error;
  }
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
    return error.message;
  }
  return String(error);
}

/**
 * Environment-aware logging function
 * @param message Message to log
 * @param level Log level (log, warn, error)
 */
export function swLog(message: string, level: 'log' | 'warn' | 'error' = 'log'): void {
  // Always log errors and warnings
  const isImportant = level === 'error' || level === 'warn';

  // Only log in development mode or if it's important
  if (process.env.NODE_ENV !== 'production' || isImportant) {
    console[level](message);
  }
}
