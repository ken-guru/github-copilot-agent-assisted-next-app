/**
 * Time manipulation utilities for testing
 * 
 * These utilities provide standardized ways to handle time-related
 * operations in tests and components.
 */

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
 * Utility to format seconds into a human-readable time string (HH:MM:SS)
 * 
 * @param totalSeconds - Number of seconds to format
 * @returns Formatted time string
 */
export function formatTime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  return [hours, minutes, seconds]
    .map(v => v.toString().padStart(2, '0'))
    .join(':');
}

/**
 * Utility to format milliseconds into a human-readable time string (HH:MM:SS)
 * 
 * @param milliseconds - Number of milliseconds to format
 * @returns Formatted time string
 */
export function formatTimeFromMs(milliseconds: number): string {
  return formatTime(Math.floor(milliseconds / 1000));
}

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