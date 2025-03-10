import { renderHook, act } from '@testing-library/react';
import { useTimerState } from '../useTimerState';

describe('useTimerState', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useTimerState({ totalDuration: 60 }));
    
    expect(result.current.elapsedTime).toBe(0);
    expect(result.current.isTimeUp).toBe(false);
    expect(result.current.timerActive).toBe(false);
  });
  
  it('should start timer when startTimer is called', () => {
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
      jest.advanceTimersByTime(10000); // 10 seconds
    });
    
    expect(result.current.elapsedTime).toBe(10);
  });
  
  it('should stop updating time when stopTimer is called', () => {
    const { result } = renderHook(() => useTimerState({ totalDuration: 60 }));
    
    act(() => {
      result.current.startTimer();
      jest.advanceTimersByTime(10000); // 10 seconds
    });
    
    act(() => {
      result.current.stopTimer();
    });
    
    const elapsedAtStop = result.current.elapsedTime;
    
    // Try to advance time more
    act(() => {
      jest.advanceTimersByTime(10000);
    });
    
    // Time should be frozen at the stop point
    expect(result.current.elapsedTime).toBe(elapsedAtStop);
    expect(result.current.timerActive).toBe(false);
  });
  
  it('should mark time as up when elapsed time exceeds total duration', () => {
    const { result } = renderHook(() => useTimerState({ totalDuration: 30 }));
    
    act(() => {
      result.current.startTimer();
      jest.advanceTimersByTime(31000); // 31 seconds
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
      jest.advanceTimersByTime(10000);
    });
    
    rerender({ isCompleted: true });
    
    expect(result.current.timerActive).toBe(false);
  });

  describe('reset functionality', () => {
    it('should reset timer state when resetTimer is called', () => {
      const { result } = renderHook(() => useTimerState({ totalDuration: 60 }));
      
      act(() => {
        result.current.startTimer();
        jest.advanceTimersByTime(10000);
      });
      
      expect(result.current.elapsedTime).toBe(10);
      expect(result.current.timerActive).toBe(true);
      
      act(() => {
        result.current.resetTimer();
      });
      
      expect(result.current.elapsedTime).toBe(0);
      expect(result.current.isTimeUp).toBe(false);
      expect(result.current.timerActive).toBe(false);
    });

    it('should allow starting timer after reset', () => {
      const { result } = renderHook(() => useTimerState({ totalDuration: 60 }));
      
      act(() => {
        result.current.startTimer();
        jest.advanceTimersByTime(10000);
      });
      
      act(() => {
        result.current.resetTimer();
      });
      
      act(() => {
        result.current.startTimer();
        jest.advanceTimersByTime(5000);
      });
      
      expect(result.current.elapsedTime).toBe(5);
      expect(result.current.timerActive).toBe(true);
    });
  });
});