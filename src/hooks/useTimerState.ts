import { useState, useEffect, useRef, useCallback } from 'react';

interface UseTimerStateProps {
  totalDuration: number;
  isCompleted?: boolean;
}

export function useTimerState({ totalDuration, isCompleted = false }: UseTimerStateProps) {
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerStopped, setTimerStopped] = useState(false);
  const [timerActive, setTimerActive] = useState(false);
  const finalElapsedTimeRef = useRef(0);

  // Start the timer
  const startTimer = useCallback(() => {
    if (!timerActive) {
      setStartTime(Date.now());
      setTimerActive(true);
    }
  }, [timerActive]);

  // Stop the timer
  const stopTimer = useCallback(() => {
    if (timerActive && !timerStopped) {
      setTimerStopped(true);
      finalElapsedTimeRef.current = elapsedTime;
    }
  }, [timerActive, timerStopped, elapsedTime]);

  // Update elapsed time when timer is running
  useEffect(() => {
    if (!startTime || timerStopped || !timerActive) return;

    const timer = setInterval(() => {
      const now = Date.now();
      setElapsedTime(Math.floor((now - startTime) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime, timerStopped, timerActive]);

  // Stop timer when activities are completed
  useEffect(() => {
    if (isCompleted) {
      stopTimer();
    }
  }, [isCompleted, stopTimer]);

  const displayedElapsedTime = timerStopped ? finalElapsedTimeRef.current : elapsedTime;
  const timeLeft = totalDuration - displayedElapsedTime;
  const isTimeUp = timeLeft < 0 || isCompleted;

  return {
    elapsedTime: displayedElapsedTime,
    timeLeft,
    isTimeUp,
    timerActive,
    timerStopped,
    startTimer,
    stopTimer
  };
}