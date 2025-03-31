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
  // Group 1: formatTimeHuman tests
  describe('formatTimeHuman', () => {
    it('formats milliseconds into seconds correctly', () => {
      expect(formatTimeHuman(3000)).toBe('0:03');
      expect(formatTimeHuman(45000)).toBe('0:45');
    });

    it('formats milliseconds into minutes and seconds correctly', () => {
      expect(formatTimeHuman(60000)).toBe('1:00');
      expect(formatTimeHuman(90000)).toBe('1:30');
      expect(formatTimeHuman(120000)).toBe('2:00');
      expect(formatTimeHuman(185000)).toBe('3:05');
    });

    it('formats milliseconds into hours, minutes, and seconds correctly', () => {
      expect(formatTimeHuman(3600000)).toBe('1:00:00');
      expect(formatTimeHuman(3661000)).toBe('1:01:01');
      expect(formatTimeHuman(7325000)).toBe('2:02:05');
    });

    it('handles zero and negative values correctly', () => {
      expect(formatTimeHuman(0)).toBe('0:00');
      // Negative values should be treated as positive for display purposes
      expect(formatTimeHuman(-3000)).toBe('0:03');
    });

    it('handles edge cases correctly', () => {
      expect(formatTimeHuman(59999)).toBe('0:59'); // Just under 1 minute
      expect(formatTimeHuman(3599999)).toBe('59:59'); // Just under 1 hour
    });
  });

  // Group 2: formatTime tests
  describe('formatTime', () => {
    it('formats positive time values correctly', () => {
      expect(formatTime(0)).toBe('00:00');
      expect(formatTime(5)).toBe('00:05');
      expect(formatTime(65)).toBe('01:05');
      expect(formatTime(3600)).toBe('60:00');
    });

    it('formats negative time values correctly (absolute value)', () => {
      expect(formatTime(-5)).toBe('00:05');
      expect(formatTime(-65)).toBe('01:05');
      expect(formatTime(-3600)).toBe('60:00');
    });

    it('handles edge cases correctly', () => {
      expect(formatTime(59)).toBe('00:59'); // Just under 1 minute
      expect(formatTime(3599)).toBe('59:59'); // Just under 1 hour
    });
  });

  // Group 3: formatTimeWithMilliseconds tests
  describe('formatTimeWithMilliseconds', () => {
    it('formats milliseconds with precision correctly', () => {
      expect(formatTimeWithMilliseconds(0)).toBe('00:00.000');
      expect(formatTimeWithMilliseconds(1234)).toBe('00:01.234');
      expect(formatTimeWithMilliseconds(60500)).toBe('01:00.500');
      expect(formatTimeWithMilliseconds(185123)).toBe('03:05.123');
    });

    it('handles negative values correctly (absolute value)', () => {
      expect(formatTimeWithMilliseconds(-1234)).toBe('00:01.234');
    });

    it('handles large values correctly', () => {
      expect(formatTimeWithMilliseconds(3661789)).toBe('61:01.789');
    });
  });

  // Group 4: formatTimeFromMilliseconds tests
  describe('formatTimeFromMilliseconds', () => {
    it('converts and formats milliseconds to MM:SS format', () => {
      expect(formatTimeFromMilliseconds(0)).toBe('00:00');
      expect(formatTimeFromMilliseconds(5000)).toBe('00:05');
      expect(formatTimeFromMilliseconds(65000)).toBe('01:05');
      expect(formatTimeFromMilliseconds(3600000)).toBe('60:00');
    });

    it('handles negative values correctly (absolute value)', () => {
      expect(formatTimeFromMilliseconds(-5000)).toBe('00:05');
    });

    it('truncates milliseconds correctly', () => {
      expect(formatTimeFromMilliseconds(5499)).toBe('00:05'); // Truncates to 5 seconds
      expect(formatTimeFromMilliseconds(5500)).toBe('00:05'); // Truncates to 5 seconds
    });
  });

  // Group 5: formatTimeFromSeconds tests
  describe('formatTimeFromSeconds', () => {
    it('formats seconds to MM:SS format correctly', () => {
      expect(formatTimeFromSeconds(0)).toBe('00:00');
      expect(formatTimeFromSeconds(5)).toBe('00:05');
      expect(formatTimeFromSeconds(65)).toBe('01:05');
      expect(formatTimeFromSeconds(3600)).toBe('60:00');
    });

    it('should be an alias for formatTime', () => {
      expect(formatTimeFromSeconds(123)).toBe(formatTime(123));
      expect(formatTimeFromSeconds(-45)).toBe(formatTime(-45));
    });
  });

  // Group 6: Conversion functions tests
  describe('Time Conversion Functions', () => {
    describe('convertMillisecondsToSeconds', () => {
      it('converts milliseconds to seconds correctly', () => {
        expect(convertMillisecondsToSeconds(0)).toBe(0);
        expect(convertMillisecondsToSeconds(1000)).toBe(1);
        expect(convertMillisecondsToSeconds(1500)).toBe(1.5);
        expect(convertMillisecondsToSeconds(60000)).toBe(60);
      });

      it('handles negative values correctly', () => {
        expect(convertMillisecondsToSeconds(-1000)).toBe(-1);
        expect(convertMillisecondsToSeconds(-1500)).toBe(-1.5);
      });
    });

    describe('convertSecondsToMilliseconds', () => {
      it('converts seconds to milliseconds correctly', () => {
        expect(convertSecondsToMilliseconds(0)).toBe(0);
        expect(convertSecondsToMilliseconds(1)).toBe(1000);
        expect(convertSecondsToMilliseconds(1.5)).toBe(1500);
        expect(convertSecondsToMilliseconds(60)).toBe(60000);
      });

      it('handles negative values correctly', () => {
        expect(convertSecondsToMilliseconds(-1)).toBe(-1000);
        expect(convertSecondsToMilliseconds(-1.5)).toBe(-1500);
      });
    });
  });
});