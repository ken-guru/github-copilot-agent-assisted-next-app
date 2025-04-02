/**
 * Time manipulation utilities for testing
 * 
 * These utilities provide standardized ways to handle time-related
 * operations in tests and components.
 */

import { formatTime as mainFormatTime, calculateDurationInSeconds as calcDuration } from '../timeUtils';

/**
 * More specific type for timer callback functions
 */
type TimerCallback = (...args: unknown[]) => void;

/**
 * Mocks the Date.now() function for testing
 * 
 * @param mockTimestamp - The timestamp to return when Date.now() is called
 * @returns A cleanup function to restore original behavior
 */
export function mockDateNow(mockTimestamp: number): () => void {
  const originalDateNow = Date.now;
  
  // Replace Date.now with a mock function
  Date.now = jest.fn().mockReturnValue(mockTimestamp);
  
  // Return a cleanup function
  return () => {
    Date.now = originalDateNow;
  };
}

/**
 * Formats a time in seconds to a "HH:MM:SS" string format
 * 
 * @param seconds - The number of seconds to format
 * @returns A string in "HH:MM:SS" format
 * 
 * @example
 * formatTimeHHMMSS(65) // Returns "00:01:05"
 * formatTimeHHMMSS(3661) // Returns "01:01:01"
 * 
 * @deprecated Use formatTime(seconds, { includeHours: true }) from '../timeUtils' instead
 */
export function formatTimeHHMMSS(seconds: number): string {
  return mainFormatTime(seconds, { includeHours: true });
}

/**
 * @deprecated Use formatTime(seconds, { includeHours: true }) from '../timeUtils' instead
 * This is kept for backward compatibility
 */
export const formatTime = formatTimeHHMMSS;

/**
 * Re-export the common time utilities
 */
export { calcDuration as calculateDurationInSeconds };

/**
 * Creates a mock for window.setTimeout in tests
 * 
 * @returns Object containing mock control functions
 */
export function createTimerMock() {
  // Store original functions
  const originalSetTimeout = global.setTimeout;
  const originalClearTimeout = global.clearTimeout;
  
  // Create maps to track timer IDs and callbacks
  const timeoutMap = new Map<number, { callback: TimerCallback; delay: number; startTime: number }>();
  let nextTimerId = 1;
  
  // Create the mock function with the correct signature
  const mockedSetTimeout = (callback: TimerCallback, delay: number): NodeJS.Timeout => {
    const timerId = nextTimerId++;
    timeoutMap.set(timerId, {
      callback,
      delay,
      startTime: Date.now(),
    });
    return timerId as unknown as NodeJS.Timeout;
  };
  
  // Add __promisify__ property to match setTimeout signature
  Object.defineProperty(mockedSetTimeout, '__promisify__', {
    value: (): Promise<void> => Promise.resolve(),
    configurable: true,
  });
  
  // Replace setTimeout with our mock
  global.setTimeout = mockedSetTimeout as typeof global.setTimeout;
  
  // Replace clearTimeout with a properly typed mock
  global.clearTimeout = ((timerId: NodeJS.Timeout | number | undefined): void => {
    if (timerId !== undefined) {
      timeoutMap.delete(timerId as number);
    }
  }) as typeof global.clearTimeout;
  
  // Function to advance timers
  const advanceTimers = (timeMs: number) => {
    const now = Date.now();
    const newNow = now + timeMs;
    
    // Mock Date.now to return the advanced time
    Date.now = jest.fn().mockReturnValue(newNow);
    
    // Check which timers should fire
    timeoutMap.forEach((timerData, timerId) => {
      const { callback, delay, startTime } = timerData;
      
      // If the timer should fire by now
      if (startTime + delay <= newNow) {
        // Remove from the map
        timeoutMap.delete(timerId);
        // Execute the callback
        callback();
      }
    });
  };
  
  // Cleanup function
  const cleanup = () => {
    global.setTimeout = originalSetTimeout;
    global.clearTimeout = originalClearTimeout;
    timeoutMap.clear();
  };
  
  return {
    advanceTimers,
    cleanup,
    getRunningTimers: () => timeoutMap.size,
  };
}