import { renderHook, act } from '@testing-library/react';
import { useTimerState } from '../useTimerState';

describe('useTimerState', () => {
  // Mock Date.now to control time in tests
  let dateSpy: jest.SpyInstance;
  let currentTime = 1000000;

  beforeEach(() => {
    jest.useFakeTimers();
    dateSpy = jest.spyOn(Date, 'now').mockImplementation(() => currentTime);
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
    dateSpy.mockRestore();
  });

  it('should initialize with correct default values', () => {
    const { result } = renderHook(() => useTimerState({ totalDuration: 60 }));
    
    expect(result.current.elapsedTime).toBe(0);
    expect(result.current.timeLeft).toBe(60);
    expect(result.current.isTimeUp).toBe(false);
    expect(result.current.timerActive).toBe(false);
    expect(result.current.timerStopped).toBe(false);
  });
  
  it('should start the timer when startTimer is called', () => {
    const { result } = renderHook(() => useTimerState({ totalDuration: 60 }));
    
    act(() => {
      result.current.startTimer();
    });
    
    expect(result.current.timerActive).toBe(true);
  });
  
  it('should update elapsed time as time passes', () => {
    const { result } = renderHook(() => useTimerState({ totalDuration: 60 }));
    
    act(() => {
      result.current.startTimer();
    });
    
    // Advance time by 10 seconds
    act(() => {
      currentTime += 10000; // Add 10 seconds
      jest.advanceTimersByTime(1000); // Trigger the interval callback
    });
    
    expect(result.current.elapsedTime).toBe(10);
    expect(result.current.timeLeft).toBe(50);
  });
  
  it('should stop updating time when stopTimer is called', () => {
    const { result } = renderHook(() => useTimerState({ totalDuration: 60 }));
    
    act(() => {
      result.current.startTimer();
    });
    
    // Advance time by 10 seconds
    act(() => {
      currentTime += 10000;
      jest.advanceTimersByTime(1000);
    });
    
    act(() => {
      result.current.stopTimer();
    });
    
    // Try to advance time more
    act(() => {
      currentTime += 10000;
      jest.advanceTimersByTime(1000);
    });
    
    // Time should be frozen at the stop point
    expect(result.current.elapsedTime).toBe(10);
    expect(result.current.timerStopped).toBe(true);
  });
  
  it('should mark time as up when elapsed time exceeds total duration', () => {
    const { result } = renderHook(() => useTimerState({ totalDuration: 30 }));
    
    act(() => {
      result.current.startTimer();
    });
    
    // Advance time beyond the total duration
    act(() => {
      currentTime += 31000; // 31 seconds
      jest.advanceTimersByTime(1000);
    });
    
    expect(result.current.isTimeUp).toBe(true);
  });
  
  it('should stop the timer when isCompleted becomes true', () => {
    const { result, rerender } = renderHook(
      ({ isCompleted }) => useTimerState({ totalDuration: 60, isCompleted }),
      { initialProps: { isCompleted: false } }
    );
    
    act(() => {
      result.current.startTimer();
    });
    
    // Advance time by 10 seconds
    act(() => {
      currentTime += 10000;
      jest.advanceTimersByTime(1000);
    });
    
    // Set isCompleted to true
    rerender({ isCompleted: true });
    
    expect(result.current.timerStopped).toBe(true);
    expect(result.current.isTimeUp).toBe(true);
  });
});