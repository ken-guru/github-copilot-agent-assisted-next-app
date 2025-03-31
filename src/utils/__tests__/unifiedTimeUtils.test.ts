// Tests for the unified time utility functions
import { 
  formatTimeHuman, 
  formatTime, 
  formatTimeWithMilliseconds, 
  formatTimeFromMilliseconds,
  formatTimeFromSeconds,
  convertMillisecondsToSeconds, 
  convertSecondsToMilliseconds 
} from '../timeUtils';

describe('Time Utility Functions', () => {
  // Tests for formatTimeHuman (original functionality)
  describe('formatTimeHuman', () => {
    it('should format time correctly for seconds', () => {
      expect(formatTimeHuman(3000)).toBe('0:03');
    });

    it('should format time correctly for minutes and seconds', () => {
      expect(formatTimeHuman(120000)).toBe('2:00');
    });

    it('should format time correctly for hours, minutes, and seconds', () => {
      expect(formatTimeHuman(3661000)).toBe('1:01:01');
    });

    it('should format time correctly for zero seconds', () => {
      expect(formatTimeHuman(0)).toBe('0:00');
    });
  });

  // Tests for formatTime (original functionality)
  describe('formatTime', () => {
    it('formats positive time values correctly', () => {
      expect(formatTime(65)).toBe('01:05');
      expect(formatTime(0)).toBe('00:00');
      expect(formatTime(3600)).toBe('60:00');
    });

    it('formats negative time values correctly', () => {
      expect(formatTime(-65)).toBe('01:05');  // Should show absolute value
      expect(formatTime(-5)).toBe('00:05');   // Should show absolute value
    });
  });

  // Tests for new utility functions
  describe('formatTimeWithMilliseconds', () => {
    it('formats time with millisecond precision', () => {
      expect(formatTimeWithMilliseconds(61123)).toBe('01:01.123');
      expect(formatTimeWithMilliseconds(123)).toBe('00:00.123');
      expect(formatTimeWithMilliseconds(0)).toBe('00:00.000');
    });
  });

  describe('formatTimeFromMilliseconds', () => {
    it('formats milliseconds to MM:SS format', () => {
      expect(formatTimeFromMilliseconds(65000)).toBe('01:05');
      expect(formatTimeFromMilliseconds(5000)).toBe('00:05');
      expect(formatTimeFromMilliseconds(0)).toBe('00:00');
    });
  });

  describe('formatTimeFromSeconds', () => {
    it('formats seconds to MM:SS format', () => {
      expect(formatTimeFromSeconds(65)).toBe('01:05');
      expect(formatTimeFromSeconds(5)).toBe('00:05');
      expect(formatTimeFromSeconds(0)).toBe('00:00');
    });
  });

  describe('conversion utilities', () => {
    it('converts milliseconds to seconds correctly', () => {
      expect(convertMillisecondsToSeconds(5000)).toBe(5);
      expect(convertMillisecondsToSeconds(5500)).toBe(5.5);
      expect(convertMillisecondsToSeconds(0)).toBe(0);
    });

    it('converts seconds to milliseconds correctly', () => {
      expect(convertSecondsToMilliseconds(5)).toBe(5000);
      expect(convertSecondsToMilliseconds(5.5)).toBe(5500);
      expect(convertSecondsToMilliseconds(0)).toBe(0);
    });
  });
});