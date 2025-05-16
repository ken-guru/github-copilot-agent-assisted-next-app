import { useState, useCallback, useRef, useEffect } from 'react';

interface UseTimerStateProps {
  totalDuration: number;
  isCompleted?: boolean;
}

export function useTimerState({ totalDuration, isCompleted = false }: UseTimerStateProps) {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [timerActive, setTimerActive] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setTimerActive(false);
  }, []);

  useEffect(() => {
    if (isCompleted) {
      stopTimer();
    }
  }, [isCompleted, stopTimer]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    setTimerActive(true);
    const startTime = Date.now() - elapsedTime * 1000;
    
    timerRef.current = setInterval(() => {
      const currentElapsed = Math.floor((Date.now() - startTime) / 1000);
      setElapsedTime(currentElapsed);
      
      if (currentElapsed >= totalDuration) {
        setIsTimeUp(true);
      }
    }, 1000);
  }, [elapsedTime, totalDuration]);

  const resetTimer = useCallback(() => {
    stopTimer();
    setElapsedTime(0);
    setIsTimeUp(false);
  }, [stopTimer]);

  return {
    elapsedTime,
    isTimeUp,
    timerActive,
    startTimer,
    stopTimer,
    resetTimer
  };
}
