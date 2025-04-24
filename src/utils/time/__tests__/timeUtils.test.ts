import { 
  formatTime, 
  formatTimeMMSS, 
  formatTimeFromMs, 
  calculateDurationInSeconds
} from '../index';

describe('formatTime', () => {
  it('formats seconds to MM:SS by default', () => {
    expect(formatTime(65)).toBe('01:05');
    expect(formatTime(3661)).toBe('61:01');
  });

  it('formats seconds to HH:MM:SS when includeHours is true', () => {
    expect(formatTime(65, { includeHours: true })).toBe('00:01:05');
    expect(formatTime(3661, { includeHours: true })).toBe('01:01:01');
  });

  it('handles zero padding correctly', () => {
    expect(formatTime(65, { padWithZeros: true })).toBe('01:05');
    expect(formatTime(65, { padWithZeros: false })).toBe('1:05');
    // Note: seconds are always zero-padded for aesthetic consistency
  });

  it('handles negative values by using absolute values', () => {
    expect(formatTime(-65)).toBe('01:05');
    expect(formatTime(-3661, { includeHours: true })).toBe('01:01:01');
  });

  it('handles zero seconds', () => {
    expect(formatTime(0)).toBe('00:00');
    expect(formatTime(0, { includeHours: true })).toBe('00:00:00');
  });
});

describe('formatTimeMMSS', () => {
  it('formats seconds to MM:SS format', () => {
    expect(formatTimeMMSS(65)).toBe('01:05');
    expect(formatTimeMMSS(3661)).toBe('61:01');
  });

  it('handles zero seconds', () => {
    expect(formatTimeMMSS(0)).toBe('00:00');
  });

  it('handles negative values by using absolute values', () => {
    expect(formatTimeMMSS(-65)).toBe('01:05');
  });
});

describe('formatTimeFromMs', () => {
  it('converts milliseconds to formatted time string', () => {
    expect(formatTimeFromMs(65000)).toBe('01:05');
    expect(formatTimeFromMs(3661000)).toBe('61:01');
  });

  it('supports format options', () => {
    expect(formatTimeFromMs(65000, { includeHours: true })).toBe('00:01:05');
    expect(formatTimeFromMs(3661000, { includeHours: true })).toBe('01:01:01');
  });

  it('handles fractional seconds by flooring', () => {
    expect(formatTimeFromMs(65500)).toBe('01:05'); // 65.5 seconds floors to 65
  });
});

describe('calculateDurationInSeconds', () => {
  it('calculates duration between two timestamps in seconds', () => {
    expect(calculateDurationInSeconds(1000, 2000)).toBe(1);
    expect(calculateDurationInSeconds(1000, 65000)).toBe(64);
  });

  it('handles negative durations', () => {
    // This tests the current implementation, which doesn't specifically handle negative cases
    expect(calculateDurationInSeconds(2000, 1000)).toBe(-1);
  });

  it('floors decimal results', () => {
    expect(calculateDurationInSeconds(1000, 2500)).toBe(1); // 1.5 seconds floored to 1
  });
});
