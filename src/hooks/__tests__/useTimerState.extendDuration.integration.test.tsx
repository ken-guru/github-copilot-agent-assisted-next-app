import { renderHook, act } from '@testing-library/react';
import { useTimerState } from '../useTimerState';

describe('useTimerState - extendDuration integration scenarios', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  describe('Issue #262 scenarios', () => {
    it('should handle scenario 1: 2 minutes duration, 1:10 spent, press +1 min → 3 minutes with 1:10 spent', () => {
      const { result } = renderHook(() => useTimerState({ totalDuration: 120 })); // 2 minutes
      
      // Start timer and advance to 1 minute 10 seconds
      act(() => {
        result.current.startTimer();
        jest.advanceTimersByTime(70000); // 1 minute 10 seconds
      });
      
      // Check initial state
      expect(result.current.elapsedTime).toBe(70);
      expect(result.current.isTimeUp).toBe(false);
      
      // This test verifies that extendDuration clears isTimeUp state
      // In the actual implementation, the parent component (page.tsx) 
      // handles updating the totalDuration prop
      act(() => {
        result.current.extendDuration();
      });
      
      // Verify timer continues running normally
      act(() => {
        jest.advanceTimersByTime(10000); // 10 more seconds
      });
      
      expect(result.current.elapsedTime).toBe(80); // 1:20 total
      expect(result.current.isTimeUp).toBe(false);
    });

    it('should handle scenario 2: 1 minute duration, 1:15 spent (overtime), press +1 min', () => {
      const { result, rerender } = renderHook(
        ({ totalDuration }) => useTimerState({ totalDuration }),
        { initialProps: { totalDuration: 60 } } // 1 minute
      );
      
      // Start timer and advance to 1 minute 15 seconds (overtime)
      act(() => {
        result.current.startTimer();
        jest.advanceTimersByTime(75000); // 1 minute 15 seconds
      });
      
      // Check overtime state
      expect(result.current.elapsedTime).toBe(75);
      expect(result.current.isTimeUp).toBe(true);
      
      // Extend duration (clears isTimeUp) and simulate prop update
      act(() => {
        result.current.extendDuration();
        // Simulate parent component updating totalDuration to elapsedTime + 60
        rerender({ totalDuration: 75 + 60 }); // 135 seconds = 2:15
      });
      
      // Verify overtime state is cleared
      expect(result.current.isTimeUp).toBe(false);
      
      // Verify timer continues running
      act(() => {
        jest.advanceTimersByTime(5000); // 5 more seconds
      });
      
      expect(result.current.elapsedTime).toBe(80); // 1:20 total
      expect(result.current.isTimeUp).toBe(false);
    });

    it('should handle scenario 3: 2 minutes duration, 0 seconds spent, press +1 min → 3 minutes with 0 spent', () => {
      const { result } = renderHook(() => useTimerState({ totalDuration: 120 })); // 2 minutes
      
      // Start timer but don't advance time
      act(() => {
        result.current.startTimer();
      });
      
      // Check initial state
      expect(result.current.elapsedTime).toBe(0);
      expect(result.current.isTimeUp).toBe(false);
      
      // Extend duration
      act(() => {
        result.current.extendDuration();
      });
      
      // Verify state remains good
      expect(result.current.isTimeUp).toBe(false);
      
      // Verify timer continues normally
      act(() => {
        jest.advanceTimersByTime(30000); // 30 seconds
      });
      
      expect(result.current.elapsedTime).toBe(30);
      expect(result.current.isTimeUp).toBe(false);
    });

    it('should work correctly when extending duration multiple times', () => {
      const { result } = renderHook(() => useTimerState({ totalDuration: 30 })); // 30 seconds
      
      // Start timer and go into overtime
      act(() => {
        result.current.startTimer();
        jest.advanceTimersByTime(45000); // 45 seconds (15s overtime)
      });
      
      expect(result.current.isTimeUp).toBe(true);
      
      // First extension
      act(() => {
        result.current.extendDuration();
      });
      
      expect(result.current.isTimeUp).toBe(false);
      
      // Advance more time to go into overtime again
      act(() => {
        jest.advanceTimersByTime(30000); // 30 more seconds
      });
      
      expect(result.current.elapsedTime).toBe(75);
      // Note: Whether isTimeUp becomes true depends on the updated totalDuration
      // This test focuses on extendDuration's ability to clear the state
      
      // Second extension
      act(() => {
        result.current.extendDuration();
      });
      
      expect(result.current.isTimeUp).toBe(false);
    });

    it('should not interfere with timer active state', () => {
      const { result } = renderHook(() => useTimerState({ totalDuration: 60 }));
      
      // Start timer
      act(() => {
        result.current.startTimer();
        jest.advanceTimersByTime(70000); // 70 seconds (overtime)
      });
      
      expect(result.current.timerActive).toBe(true);
      expect(result.current.isTimeUp).toBe(true);
      
      // Extend duration
      act(() => {
        result.current.extendDuration();
      });
      
      // Timer should still be active
      expect(result.current.timerActive).toBe(true);
      expect(result.current.isTimeUp).toBe(false);
      
      // Timer should continue running
      act(() => {
        jest.advanceTimersByTime(5000); // 5 more seconds
      });
      
      expect(result.current.elapsedTime).toBe(75);
      expect(result.current.timerActive).toBe(true);
    });
  });
});
