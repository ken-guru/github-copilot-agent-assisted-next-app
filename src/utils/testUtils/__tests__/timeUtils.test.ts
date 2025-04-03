import { 
  mockDateNow, 
  formatTime, 
  formatTimeHHMMSS,
  calculateDurationInSeconds,
  createTimerMock
} from '../timeUtils';

describe('Time Utilities', () => {
  describe('mockDateNow', () => {
    it('should mock Date.now to return the specified timestamp', () => {
      const mockTimestamp = 1612345678000;
      const cleanup = mockDateNow(mockTimestamp);
      
      expect(Date.now()).toBe(mockTimestamp);
      
      cleanup();
      
      // After cleanup, Date.now should return the current time
      const now = Date.now();
      // We can't know the exact timestamp, but it should be close to the current time
      expect(now).toBeGreaterThan(mockTimestamp);
    });
  });
  
  describe('formatTime', () => {
    it('should format seconds into HH:MM:SS format', () => {
      expect(formatTime(0)).toBe('00:00:00');
      expect(formatTime(30)).toBe('00:00:30');
      expect(formatTime(90)).toBe('00:01:30');
      expect(formatTime(3600)).toBe('01:00:00');
      expect(formatTime(3661)).toBe('01:01:01');
      expect(formatTime(36000)).toBe('10:00:00');
      expect(formatTime(86399)).toBe('23:59:59');
    });
  });
  
  describe('formatTimeFromMs', () => {
    it('should format milliseconds into HH:MM:SS format', () => {
      expect(formatTimeHHMMSS(Math.floor(0/1000))).toBe('00:00:00');
      expect(formatTimeHHMMSS(Math.floor(30000/1000))).toBe('00:00:30');
      expect(formatTimeHHMMSS(Math.floor(90000/1000))).toBe('00:01:30');
      expect(formatTimeHHMMSS(Math.floor(3600000/1000))).toBe('01:00:00');
      expect(formatTimeHHMMSS(Math.floor(3661000/1000))).toBe('01:01:01');
      expect(formatTimeHHMMSS(Math.floor(36000000/1000))).toBe('10:00:00');
      expect(formatTimeHHMMSS(Math.floor(86399000/1000))).toBe('23:59:59');
    });
    
    it('should round down to the nearest second', () => {
      expect(formatTimeHHMMSS(Math.floor(999/1000))).toBe('00:00:00');
      expect(formatTimeHHMMSS(Math.floor(1000/1000))).toBe('00:00:01');
      expect(formatTimeHHMMSS(Math.floor(1999/1000))).toBe('00:00:01');
      expect(formatTimeHHMMSS(Math.floor(59999/1000))).toBe('00:00:59');
    });
  });
  
  describe('calculateDurationInSeconds', () => {
    it('should calculate duration between two timestamps in seconds', () => {
      expect(calculateDurationInSeconds(1000, 2000)).toBe(1);
      expect(calculateDurationInSeconds(1000, 61000)).toBe(60);
      expect(calculateDurationInSeconds(1000, 3601000)).toBe(3600);
    });
    
    it('should handle timestamps with partial seconds', () => {
      expect(calculateDurationInSeconds(1000, 1999)).toBe(0);
      expect(calculateDurationInSeconds(1000, 2001)).toBe(1);
    });
    
    it('should handle negative durations', () => {
      expect(calculateDurationInSeconds(2000, 1000)).toBe(-1);
    });
  });
  
  describe('createTimerMock', () => {
    it('should mock setTimeout and allow advancing time', () => {
      const { advanceTimers, cleanup, getRunningTimers } = createTimerMock();
      
      // Set up a callback to track if it was called
      const callback = jest.fn();
      setTimeout(callback, 1000);
      
      // Verify timer is registered
      expect(getRunningTimers()).toBe(1);
      expect(callback).not.toHaveBeenCalled();
      
      // Advance time but not enough to trigger the callback
      advanceTimers(500);
      expect(callback).not.toHaveBeenCalled();
      
      // Advance time enough to trigger the callback
      advanceTimers(500);
      expect(callback).toHaveBeenCalledTimes(1);
      
      // Verify timer is no longer registered
      expect(getRunningTimers()).toBe(0);
      
      cleanup();
    });
    
    it('should handle multiple timers', () => {
      const { advanceTimers, cleanup } = createTimerMock();
      
      const callback1 = jest.fn();
      const callback2 = jest.fn();
      const callback3 = jest.fn();
      
      setTimeout(callback1, 1000);
      setTimeout(callback2, 2000);
      setTimeout(callback3, 3000);
      
      // Advance to trigger first timer
      advanceTimers(1000);
      expect(callback1).toHaveBeenCalledTimes(1);
      expect(callback2).not.toHaveBeenCalled();
      expect(callback3).not.toHaveBeenCalled();
      
      // Advance to trigger second timer
      advanceTimers(1000);
      expect(callback1).toHaveBeenCalledTimes(1);
      expect(callback2).toHaveBeenCalledTimes(1);
      expect(callback3).not.toHaveBeenCalled();
      
      // Advance to trigger third timer
      advanceTimers(1000);
      expect(callback1).toHaveBeenCalledTimes(1);
      expect(callback2).toHaveBeenCalledTimes(1);
      expect(callback3).toHaveBeenCalledTimes(1);
      
      cleanup();
    });
    
    it('should handle cleared timeouts', () => {
      const { advanceTimers, cleanup } = createTimerMock();
      
      const callback = jest.fn();
      const timerId = setTimeout(callback, 1000);
      
      // Clear the timeout
      clearTimeout(timerId);
      
      // Advance time
      advanceTimers(1000);
      
      // Callback should not have been called
      expect(callback).not.toHaveBeenCalled();
      
      cleanup();
    });
  });
});