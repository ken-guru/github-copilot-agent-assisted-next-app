import React, { useState, useEffect } from 'react';
import { TimelineEntry } from '@/types';
import { formatTimeHuman } from '@/utils/time';

interface ProgressBarProps {
  entries: TimelineEntry[];
  totalDuration: number; // in seconds
  elapsedTime: number; // in seconds
  timerActive?: boolean;
}

export default function ProgressBar({
  entries,
  totalDuration,
  elapsedTime,
  timerActive = false
}: ProgressBarProps) {
  // State to track if the component is being viewed on mobile
  const [isMobile, setIsMobile] = useState(false);

  // Effect to check if the device is mobile on mount and when window is resized
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.matchMedia('(max-width: 768px)').matches);
    };
    
    // Initial check
    checkIsMobile();
    
    // Add listener for window resize
    window.addEventListener('resize', checkIsMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Always render the progress bar container, even if timer is inactive
  const isActive = timerActive && entries.length > 0 && totalDuration > 0;
  
  // Calculate the progress percentage (capped at 100%) when active
  const progressPercentage = isActive ? Math.min(100, (elapsedTime / totalDuration) * 100) : 0;
  
  // Using constant values to ensure test environment consistency
  const GREEN_HUE = 142;
  const YELLOW_HUE = 48;
  const ORANGE_HUE = 25;
  const RED_HUE = 0;
  const DEFAULT_SATURATION = "85%";
  const DEFAULT_LIGHTNESS = "45%";

  // Helper function for color interpolation
  const interpolateValue = (ratio: number, start: number, end: number): number => {
    return Math.round(start + (end - start) * ratio);
  };
  
  // Calculate color based on progress percentage for smooth transition
  const calculateProgressColor = (): string => {
    if (!isActive) {
      return "transparent";
    }
    
    const timeRatio = elapsedTime / totalDuration;
    
    // At or beyond 100%
    if (timeRatio >= 1) {
      return `hsl(${RED_HUE}, ${DEFAULT_SATURATION}, ${DEFAULT_LIGHTNESS})`;
    }
    
    // Interpolate color hue based on progress
    if (timeRatio < 0.5) {
      // Between 0% and 50%: Green to Yellow
      const hue = interpolateValue(timeRatio / 0.5, GREEN_HUE, YELLOW_HUE);
      return `hsl(${hue}, ${DEFAULT_SATURATION}, ${DEFAULT_LIGHTNESS})`;
    } else if (timeRatio < 0.75) {
      // Between 50% and 75%: Yellow to Orange
      const hue = interpolateValue((timeRatio - 0.5) / 0.25, YELLOW_HUE, ORANGE_HUE);
      return `hsl(${hue}, ${DEFAULT_SATURATION}, ${DEFAULT_LIGHTNESS})`;
    } else {
      // Between 75% and 100%: Orange to Red
      const hue = interpolateValue((timeRatio - 0.75) / 0.25, ORANGE_HUE, RED_HUE);
      return `hsl(${hue}, ${DEFAULT_SATURATION}, ${DEFAULT_LIGHTNESS})`;
    }
  };

  // Render time markers component
  const timeMarkersComponent = totalDuration > 0 && (
    <div>
      <span>0:00</span>
      <span>{formatTimeHuman(Math.floor(totalDuration / 2) * 1000)}</span>
      <span>{formatTimeHuman(totalDuration * 1000)}</span>
    </div>
  );

  // Render progress bar component
  const progressBarComponent = (
    <div 
      role="progressbar"
      aria-valuenow={Math.round(progressPercentage)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Progress towards total duration"
    >
      {isActive && (
        <div 
          style={{ 
            width: `${progressPercentage}%`,
            backgroundColor: calculateProgressColor()
          }}
        />
      )}
    </div>
  );

  return (
    <div>
      {/* Render in different order based on viewport */}
      {isMobile ? (
        <>
          {timeMarkersComponent}
          {progressBarComponent}
        </>
      ) : (
        <>
          {progressBarComponent}
          {timeMarkersComponent}
        </>
      )}
    </div>
  );
}