import { useEffect, useState } from 'react';
import { useGlobalTimer } from '@/contexts/GlobalTimerContext';
import { computeProgress, type ProgressMetrics } from '@/utils/timerProgress';

/**
 * Returns live timer progress (elapsed, remaining, percent) while a session is active.
 * Uses a lightweight 1s interval to update consumers without forcing global context re-renders.
 */
export function useGlobalTimerProgress(tickMs: number = 1000): ProgressMetrics {
  const { sessionStartTime, totalDuration, isTimerRunning, currentBreakStartTime } = useGlobalTimer();
  const [now, setNow] = useState<number>(() => Date.now());

  useEffect(() => {
    // Start ticking only when a session is active or in a break state
    if (!sessionStartTime || totalDuration <= 0 || (!isTimerRunning && !currentBreakStartTime)) {
      return; // no ticking needed
    }

    const id = setInterval(() => {
      setNow(Date.now());
    }, Math.max(250, tickMs));

    return () => clearInterval(id);
  }, [sessionStartTime, totalDuration, isTimerRunning, currentBreakStartTime, tickMs]);

  return computeProgress(sessionStartTime, totalDuration, now);
}

export default useGlobalTimerProgress;
