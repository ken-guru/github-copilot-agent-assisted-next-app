import { renderHook, act } from '@testing-library/react';
import { useTimerState } from '../useTimerState';

describe('useTimerState - Session Restoration', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should restore elapsed time from initialElapsedTime during session recovery', () => {
    // Test the scenario where session restoration provides initialElapsedTime
    const { result, rerender } = renderHook(
      ({ initialElapsedTime, shouldAutoStart }) => useTimerState({
        totalDuration: 300, // 5 minutes
        initialElapsedTime,
        shouldAutoStart
      }),
      {
        initialProps: {
          initialElapsedTime: 0,
          shouldAutoStart: false
        }
      }
    );

    // Initially should have 0 elapsed time
    expect(result.current.elapsedTime).toBe(0);
    expect(result.current.timerActive).toBe(false);

    // Simulate session restoration with elapsed time and auto-start
    rerender({
      initialElapsedTime: 120, // 2 minutes elapsed
      shouldAutoStart: true
    });

    // Should update elapsed time to restored value before timer starts
    expect(result.current.elapsedTime).toBe(120);
    
    // Timer should auto-start due to shouldAutoStart
    expect(result.current.timerActive).toBe(true);

    // Advance time to simulate timer progression from restored state
    act(() => {
      jest.advanceTimersByTime(10000); // 10 seconds
    });

    // Should show 130 seconds (120 restored + 10 elapsed)
    expect(result.current.elapsedTime).toBe(130);
  });

  it('should not update elapsed time when timer is already active', () => {
    const { result, rerender } = renderHook(
      ({ initialElapsedTime }) => useTimerState({
        totalDuration: 300,
        initialElapsedTime
      }),
      {
        initialProps: {
          initialElapsedTime: 60
        }
      }
    );

    // Start timer manually
    act(() => {
      result.current.startTimer();
    });

    expect(result.current.timerActive).toBe(true);
    expect(result.current.elapsedTime).toBe(60);

    // Try to change initialElapsedTime while timer is active
    rerender({
      initialElapsedTime: 120
    });

    // Should NOT update elapsed time when timer is active
    expect(result.current.elapsedTime).toBe(60);
  });

  it('should handle multiple session restoration attempts correctly', () => {
    const { result, rerender } = renderHook(
      ({ initialElapsedTime }) => useTimerState({
        totalDuration: 300,
        initialElapsedTime
      }),
      {
        initialProps: {
          initialElapsedTime: 0
        }
      }
    );

    expect(result.current.elapsedTime).toBe(0);

    // First restoration
    rerender({ initialElapsedTime: 60 });
    expect(result.current.elapsedTime).toBe(60);

    // Second restoration (simulate multiple recovery attempts)
    rerender({ initialElapsedTime: 90 });
    expect(result.current.elapsedTime).toBe(90);

    // Third restoration
    rerender({ initialElapsedTime: 120 });
    expect(result.current.elapsedTime).toBe(120);
  });

  it('should properly calculate timer progression after restoration', () => {
    const { result, rerender } = renderHook(
      ({ initialElapsedTime, shouldAutoStart }) => useTimerState({
        totalDuration: 300,
        initialElapsedTime,
        shouldAutoStart
      }),
      {
        initialProps: {
          initialElapsedTime: 0,
          shouldAutoStart: false
        }
      }
    );

    // Simulate session restoration with 150 seconds elapsed and auto-start
    rerender({
      initialElapsedTime: 150,
      shouldAutoStart: true
    });

    expect(result.current.elapsedTime).toBe(150);
    expect(result.current.timerActive).toBe(true);

    // Advance time by 30 seconds
    act(() => {
      jest.advanceTimersByTime(30000);
    });

    // Should show 180 seconds total
    expect(result.current.elapsedTime).toBe(180);

    // Continue for another 120 seconds to reach total duration
    act(() => {
      jest.advanceTimersByTime(120000);
    });

    // Should reach total duration and mark time as up
    expect(result.current.elapsedTime).toBe(300);
    expect(result.current.isTimeUp).toBe(true);
  });
});
