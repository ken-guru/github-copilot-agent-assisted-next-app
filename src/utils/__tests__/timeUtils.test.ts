import { formatTime } from '../timeUtils';

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