import { useState, useEffect, useRef } from 'react';
import { formatTime } from '@/utils/timeUtils';

export function useTimeDisplay(totalDuration: number, elapsedTime: number, isActive: boolean) {
  const [displayTime, setDisplayTime] = useState('');
  const [isCountingUp, setIsCountingUp] = useState(false);
  
  // Use refs to track the latest values inside the interval callback
  const elapsedTimeRef = useRef(elapsedTime);
  const totalDurationRef = useRef(totalDuration);
  
  // Update refs when props change
  useEffect(() => {
    elapsedTimeRef.current = elapsedTime;
    totalDurationRef.current = totalDuration;
  }, [elapsedTime, totalDuration]);

  useEffect(() => {
    // When inactive, just show the total duration
    if (!isActive) {
      setDisplayTime(formatTime(totalDuration));
      return;
    }
    
    const updateDisplay = () => {
      // Calculate remaining time in seconds
      const remainingTime = totalDurationRef.current - elapsedTimeRef.current;
      
      // Determine if we should count up (when in overtime)
      const shouldCountUp = remainingTime < 0;
      setIsCountingUp(shouldCountUp);
      
      // Format the absolute time value for display
      setDisplayTime(formatTime(Math.abs(remainingTime)));
    };

    // Initial update
    updateDisplay();
    
    // Update the display every second
    const interval = setInterval(updateDisplay, 1000);
    
    return () => clearInterval(interval);
  }, [isActive]); // Only re-run when active state changes

  return {
    displayTime,
    isCountingUp
  };
}