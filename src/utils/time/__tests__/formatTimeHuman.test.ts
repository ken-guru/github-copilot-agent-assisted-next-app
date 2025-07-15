import { formatTimeHuman } from '../index';

describe('formatTimeHuman', () => {
  describe('hour-inclusive cases', () => {
    it('should format time with hours, minutes, and seconds', () => {
      expect(formatTimeHuman(3661000)).toBe('1:01:01'); // 1 hour, 1 minute, 1 second
    });

    it('should format time with multiple hours', () => {
      expect(formatTimeHuman(7323000)).toBe('2:02:03'); // 2 hours, 2 minutes, 3 seconds
    });

    it('should pad minutes and seconds with leading zeros when hours present', () => {
      expect(formatTimeHuman(3609000)).toBe('1:00:09'); // 1 hour, 0 minutes, 9 seconds
      expect(formatTimeHuman(3660000)).toBe('1:01:00'); // 1 hour, 1 minute, 0 seconds
    });

    it('should handle exactly 1 hour', () => {
      expect(formatTimeHuman(3600000)).toBe('1:00:00'); // exactly 1 hour
    });
  });

  describe('minute-only cases', () => {
    it('should format time with minutes and seconds only when under 1 hour', () => {
      expect(formatTimeHuman(61000)).toBe('1:01'); // 1 minute, 1 second
      expect(formatTimeHuman(125000)).toBe('2:05'); // 2 minutes, 5 seconds
    });

    it('should handle exactly 1 minute', () => {
      expect(formatTimeHuman(60000)).toBe('1:00'); // exactly 1 minute
    });

    it('should pad seconds with leading zero in minute format', () => {
      expect(formatTimeHuman(69000)).toBe('1:09'); // 1 minute, 9 seconds
    });

    it('should handle seconds only when under 1 minute', () => {
      expect(formatTimeHuman(30000)).toBe('0:30'); // 30 seconds
      expect(formatTimeHuman(5000)).toBe('0:05'); // 5 seconds
    });
  });

  describe('edge cases', () => {
    it('should handle zero milliseconds', () => {
      expect(formatTimeHuman(0)).toBe('0:00');
    });

    it('should handle very small values', () => {
      expect(formatTimeHuman(500)).toBe('0:00'); // Less than 1 second, rounds down
      expect(formatTimeHuman(999)).toBe('0:00'); // Less than 1 second, rounds down
    });

    it('should handle large values', () => {
      expect(formatTimeHuman(359999000)).toBe('99:59:59'); // 99 hours, 59 minutes, 59 seconds
    });

    it('should handle negative values by treating as zero', () => {
      expect(formatTimeHuman(-1000)).toBe('0:00'); // Negative values become 0
    });

    it('should handle fractional milliseconds', () => {
      expect(formatTimeHuman(1500.7)).toBe('0:01'); // 1.5 seconds rounds down to 1
      expect(formatTimeHuman(2999.9)).toBe('0:02'); // 2.999 seconds rounds down to 2
    });
  });

  describe('specific duration validation', () => {
    it('should correctly format common durations', () => {
      expect(formatTimeHuman(1000)).toBe('0:01'); // 1 second
      expect(formatTimeHuman(30000)).toBe('0:30'); // 30 seconds
      expect(formatTimeHuman(90000)).toBe('1:30'); // 1 minute 30 seconds
      expect(formatTimeHuman(600000)).toBe('10:00'); // 10 minutes
      expect(formatTimeHuman(3900000)).toBe('1:05:00'); // 1 hour 5 minutes
    });
  });
});
