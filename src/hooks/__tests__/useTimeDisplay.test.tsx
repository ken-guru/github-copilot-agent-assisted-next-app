import { renderHook, act } from '@testing-library/react';
import { useTimeDisplay } from '../useTimeDisplay';

describe('useTimeDisplay', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should show total duration when inactive', () => {
    const { result } = renderHook(() => useTimeDisplay(120, 0, false));
    expect(result.current.displayTime).toBe('02:00');
    expect(result.current.isCountingUp).toBe(false);
  });

  it('should show remaining time when active', () => {
    const { result } = renderHook(() => useTimeDisplay(120, 10, true));
    expect(result.current.displayTime).toBe('01:50');
    expect(result.current.isCountingUp).toBe(false);
  });

  it('should handle negative remaining time (overtime)', () => {
    const { result } = renderHook(() => useTimeDisplay(120, 150, true));
    expect(result.current.displayTime).toBe('00:30');
    expect(result.current.isCountingUp).toBe(true);
  });

  it('should update display time every second when active', () => {
    const { result } = renderHook(() => useTimeDisplay(120, 10, true));
    
    expect(result.current.displayTime).toBe('01:50');
    
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    
    expect(result.current.displayTime).toBe('01:50');
  });
});