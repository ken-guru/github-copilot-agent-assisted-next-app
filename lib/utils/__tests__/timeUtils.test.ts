import { formatTime, formatTimeFromMs, calculateDurationInSeconds } from '../timeUtils';

describe('timeUtils', () => {
  describe('formatTime', () => {
    it('formats seconds to MM:SS by default', () => {
      expect(formatTime(65)).toBe('01:05');
      expect(formatTime(3661)).toBe('61:01');
      expect(formatTime(0)).toBe('00:00');
    });

    it('formats seconds to HH:MM:SS when includeHours is true', () => {
      expect(formatTime(65, { includeHours: true })).toBe('00:01:05');
      expect(formatTime(3661, { includeHours: true })).toBe('01:01:01');
      expect(formatTime(0, { includeHours: true })).toBe('00:00:00');
      expect(formatTime(36000, { includeHours: true })).toBe('10:00:00');
    });

    it('handles padding option correctly', () => {
      expect(formatTime(65, { padWithZeros: false })).toBe('1:05');
      expect(formatTime(3661, { padWithZeros: false })).toBe('61:01');
      expect(formatTime(65, { includeHours: true, padWithZeros: false })).toBe('0:1:05');
    });

    it('handles negative values by using absolute value', () => {
      expect(formatTime(-65)).toBe('01:05');
      expect(formatTime(-3661, { includeHours: true })).toBe('01:01:01');
    });
  });

  describe('formatTimeFromMs', () => {
    it('converts milliseconds to seconds and formats appropriately', () => {
      expect(formatTimeFromMs(65000)).toBe('01:05');
      expect(formatTimeFromMs(65500)).toBe('01:05'); // floors to 65 seconds
      expect(formatTimeFromMs(65000, { includeHours: true })).toBe('00:01:05');
    });
  });

  describe('calculateDurationInSeconds', () => {
    it('calculates the duration between two timestamps in seconds', () => {
      expect(calculateDurationInSeconds(1000, 66000)).toBe(65);
      expect(calculateDurationInSeconds(1000, 3662000)).toBe(3661);
    });

    it('handles timestamps in reverse order', () => {
      expect(calculateDurationInSeconds(66000, 1000)).toBe(-65);
    });
  });
});