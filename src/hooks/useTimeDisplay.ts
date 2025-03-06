import { useState, useEffect } from 'react';
import { formatTime } from '@/utils/timeUtils';

export function useTimeDisplay(totalDuration: number, elapsedTime: number, isActive: boolean) {
  const [displayTime, setDisplayTime] = useState('');
  const [isCountingUp, setIsCountingUp] = useState(false);

  useEffect(() => {
    if (!isActive) {
      setDisplayTime(formatTime(totalDuration * 1000));
      return;
    }

    const remainingTime = totalDuration - elapsedTime;
    setIsCountingUp(remainingTime < 0);

    const updateTime = () => {
      const now = Date.now();
      const timeDiff = Math.abs(remainingTime);
      setDisplayTime(formatTime(timeDiff * 1000));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [totalDuration, elapsedTime, isActive]);

  return {
    displayTime,
    isCountingUp
  };
}