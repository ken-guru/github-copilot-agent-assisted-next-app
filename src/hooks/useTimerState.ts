import { useState, useCallback, useRef, useEffect } from 'react';

interface UseTimerStateProps {
  totalDuration: number;
  isCompleted?: boolean;
  initialElapsedTime?: number;
  shouldAutoStart?: boolean;
}

export function useTimerState({ 
  totalDuration, 
  isCompleted = false, 
  initialElapsedTime = 0,
  shouldAutoStart = false 
}: UseTimerStateProps) {
  const [elapsedTime, setElapsedTime] = useState(initialElapsedTime);
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

  const extendDuration = useCallback(() => {
    // Clear isTimeUp state when extending duration
    setIsTimeUp(false);
  }, []);

  // Effect to update isTimeUp when totalDuration changes
  useEffect(() => {
    if (timerActive && elapsedTime >= totalDuration) {
      setIsTimeUp(true);
    } else if (timerActive && elapsedTime < totalDuration) {
      setIsTimeUp(false);
    }
  }, [totalDuration, elapsedTime, timerActive]);

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
    if (!timerActive && !isCompleted) {
      setTimerActive(true);
      const startTime = Date.now() - elapsedTime * 1000;
      
      timerRef.current = setInterval(() => {
        const currentElapsed = Math.floor((Date.now() - startTime) / 1000);
        setElapsedTime(currentElapsed);
        
        if (currentElapsed >= totalDuration) {
          setIsTimeUp(true);
        }
      }, 1000);
    }
  }, [timerActive, isCompleted, elapsedTime, totalDuration]);

  const resetTimer = useCallback(() => {
    stopTimer();
    setElapsedTime(0);
    setIsTimeUp(false);
  }, [stopTimer]);

  // Effect to auto-start timer if requested (for session restoration)
  useEffect(() => {
    if (shouldAutoStart && !timerActive && !isCompleted) {
      startTimer();
    }
  }, [shouldAutoStart, timerActive, isCompleted, startTimer]);

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