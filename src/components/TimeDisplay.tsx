import React, { useState, useEffect } from 'react';
import { useInterval } from '../utils/eventListenerUtils';

/**
 * TimeDisplay Component
 * 
 * Displays the current time in a 24-hour format (HH:MM:SS).
 * Updates every second automatically.
 * Uses direct Date methods to ensure correct time formatting.
 */
const TimeDisplay: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<string>('');
  
  // Store the state setter globally for testing purposes
  if (typeof window !== 'undefined') {
    (global as any).updateTimeState = setCurrentTime;
  }
  
  // Update the current time using Date object methods
  const updateTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    
    setCurrentTime(`${hours}:${minutes}:${seconds}`);
  };
  
  // Store the callback globally for testing purposes
  if (typeof window !== 'undefined') {
    (global as any).intervalCallback = updateTime;
  }
  
  // Initialize time when component mounts
  useEffect(() => {
    updateTime();
    
    // Cleanup function to remove global reference when unmounting
    return () => {
      if (typeof window !== 'undefined') {
        delete (global as any).intervalCallback;
        delete (global as any).updateTimeState;
      }
    };
  }, []);
  
  // Update time every second using our custom hook for interval
  useInterval(updateTime, 1000);
  
  return (
    <div className="time-display">
      <span data-testid="time-display">{currentTime}</span>
    </div>
  );
};

export default TimeDisplay;