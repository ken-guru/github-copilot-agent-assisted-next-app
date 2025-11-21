import { useState, useCallback, useRef, useEffect } from 'react';

interface UseTimerStateProps {
  totalDuration: number;
  isCompleted?: boolean;
}

export function useTimerState({ totalDuration, isCompleted = false }: UseTimerStateProps) {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Derived state
  const isTimeUp = elapsedTime >= totalDuration;

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setTimerActive(false);
  }, []);

  const extendDuration = useCallback(() => {
    // No-op: isTimeUp will automatically update when totalDuration changes
  }, []);

  useEffect(() => {
    if (isCompleted && timerActive) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      stopTimer();
    }
  }, [isCompleted, timerActive, stopTimer]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startTimer = useCallback(() => {
    if (!timerActive && !isCompleted) {
      setTimerActive(true);
      const startTime = Date.now() - elapsedTime * 1000;

      timerRef.current = setInterval(() => {
        const currentElapsed = Math.floor((Date.now() - startTime) / 1000);
        setElapsedTime(currentElapsed);

        // We don't need to check for isTimeUp here to stop the timer
        // The timer continues even if time is up (overtime)
      }, 1000);
    }
  }, [timerActive, isCompleted, elapsedTime]);

  const resetTimer = useCallback(() => {
    stopTimer();
    setElapsedTime(0);
  }, [stopTimer]);

  return {
    elapsedTime,
    isTimeUp,
    timerActive,
    startTimer,
    stopTimer,
    resetTimer,
    extendDuration
  };
}