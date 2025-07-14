/**
 * Time manipulation utilities for testing
 * 
 * These utilities provide standardized ways to handle time-related
 * operations in tests and components.
 */

import { 
  formatTime as mainFormatTime, 
  formatTimeFromMs as mainFormatTimeFromMs,
  calculateDurationInSeconds
} from '../timeUtils';

/**
 * Formats a time in seconds to a "MM:SS" string format
 * This is a test utility wrapper around the main formatTime function
 * 
 * @param seconds - The number of seconds to format
 * @returns A string in "MM:SS" format
 * 
 * @example
 * formatTimeMMSS(65) // Returns "01:05"
 * formatTimeMMSS(3661) // Returns "61:01" (no hour limit)
 */
export function formatTimeMMSS(seconds: number): string {
  return mainFormatTime(seconds);
}

/**
 * Formats a time in seconds to a "HH:MM:SS" string format
 * This is a test utility wrapper around the main formatTime function
 * 
 * @param seconds - The number of seconds to format
 * @returns A string in "HH:MM:SS" format
 * 
 * @example
 * formatTimeHHMMSS(65) // Returns "00:01:05"
 * formatTimeHHMMSS(3661) // Returns "01:01:01"
 */
export function formatTimeHHMMSS(seconds: number): string {
  return mainFormatTime(seconds, { includeHours: true });
}

/**
 * Re-export formatTime from main utils
 */
export const formatTime = (seconds: number) => mainFormatTime(seconds, { includeHours: true });

/**
 * Formats milliseconds to a formatted time string
 * This is a test utility re-export of the main formatTimeFromMs function
 * 
 * @param milliseconds - Number of milliseconds to format
 * @returns Formatted time string in "MM:SS" format
 */
export { mainFormatTimeFromMs as formatTimeFromMs };

/**
 * Re-export calculateDurationInSeconds from main utils
 */
export { calculateDurationInSeconds };

/**
 * Mocks the Date.now function to return a specific timestamp
 * Useful for testing time-dependent code with deterministic values
 * 
 * @param mockTimestamp - The timestamp to return from Date.now()
 * @returns A cleanup function to restore the original Date.now
 * 
 * @example
 * const cleanup = mockDateNow(1612345678000);
 * console.log(Date.now()); // 1612345678000
 * cleanup(); // Restores original Date.now
 */
export function mockDateNow(mockTimestamp: number): () => void {
  const originalNow = Date.now;
  Date.now = jest.fn(() => mockTimestamp);
  
  return () => {
    Date.now = originalNow;
  };
}

/**
 * Creates a mock for timers that can be manually advanced in tests
 * 
 * @returns An object with functions to control the timers
 * - advanceTimers: Advance all timers by the specified milliseconds
 * - cleanup: Restore original timer functions
 * - getRunningTimers: Get the number of currently running timers
 */
export function createTimerMock() {
  // Store timers with their creation time and callbacks
  type TimerCallback = (...args: unknown[]) => void;
  
  const timers: { 
    id: number; 
    callback: TimerCallback; 
    delay: number; 
    createdAt: number;
  }[] = [];
  
  // Store original timer functions
  const originalSetTimeout = global.setTimeout;
  const originalClearTimeout = global.clearTimeout;
  
  // Mock current time
  let currentTime = Date.now();
  let nextTimerId = 1;
  
  // Create a mock version with proper typing
  const mockSetTimeout = function(callback: TimerCallback, delay: number): number {
    const id = nextTimerId++;
    timers.push({ 
      id, 
      callback, 
      delay, 
      createdAt: currentTime 
    });
    return id;
  };
  
  // Add mocking capabilities to our function
  const mockedSetTimeout = jest.fn(mockSetTimeout) as unknown as typeof global.setTimeout;
  global.setTimeout = mockedSetTimeout;
  
  // Create a mock clearTimeout with proper typing
  const mockClearTimeout = function(id: number | NodeJS.Timeout): void {
    const index = timers.findIndex(timer => timer.id === id);
    if (index !== -1) {
      timers.splice(index, 1);
    }
  };
  
  // Add mocking capabilities to our function
  const mockedClearTimeout = jest.fn(mockClearTimeout) as unknown as typeof global.clearTimeout;
  global.clearTimeout = mockedClearTimeout;
  
  // Advance timers by specified milliseconds
  const advanceTimers = (ms: number) => {
    // Increment current mock time
    currentTime += ms;
    
    // Find timers that should be triggered
    // Work with a copy to avoid mutation during iteration
    const timersCopy = [...timers];
    
    timersCopy.forEach(timer => {
      // Calculate if timer should fire (elapsed time >= delay)
      if (currentTime - timer.createdAt >= timer.delay) {
        // Find the timer in the original array and remove it
        const index = timers.findIndex(t => t.id === timer.id);
        if (index !== -1) {
          const timerToExecute = timers.splice(index, 1)[0];
          // Execute the callback if it exists
          if (timerToExecute && typeof timerToExecute.callback === 'function') {
            timerToExecute.callback();
          }
        }
      }
    });
  };
  
  // Cleanup function to restore original timer functions
  const cleanup = () => {
    global.setTimeout = originalSetTimeout;
    global.clearTimeout = originalClearTimeout;
  };
  
  // Return the number of running timers
  const getRunningTimers = () => {
    return timers.length;
  };
  
  return { advanceTimers, cleanup, getRunningTimers };
}