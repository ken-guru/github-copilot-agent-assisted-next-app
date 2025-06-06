import { useState, useEffect } from 'react';
import { formatTime } from '@lib/time';

export function useTimeDisplay(totalDuration: number, elapsedTime: number, isActive: boolean) {
  const [displayTime, setDisplayTime] = useState('');
  const [isCountingUp, setIsCountingUp] = useState(false);
  
  useEffect(() => {
    const updateDisplay = () => {
      // Calculate remaining time in seconds
      const remainingTime = totalDuration - elapsedTime;
      
      // Determine if we should count up (when in overtime)
      const shouldCountUp = remainingTime < 0;
      setIsCountingUp(shouldCountUp);
      
      // Format the absolute time value for display
      setDisplayTime(formatTime(Math.abs(remainingTime)));
    };

    // Initial update
    updateDisplay();
    
    let interval: NodeJS.Timeout | null = null;
    if (isActive) {
      // Update the display every second
      interval = setInterval(updateDisplay, 1000);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [totalDuration, elapsedTime, isActive]);
  
  return {
    displayTime,
    isCountingUp
  };
}
