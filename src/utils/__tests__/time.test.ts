import { formatTimeHuman } from '../timeUtils';

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
