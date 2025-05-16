import React, { useState, useEffect, useMemo } from 'react';
import styles from './ProgressBar.module.css';
import { formatTimeHuman } from '@lib/time';
import type { TimelineEntry } from './Timeline';

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
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  // Calculate progress percentage
  const progressPercentage = Math.min(100, (elapsedTime / totalDuration) * 100);
  
  // Is the progress bar active?
  const isActive = entries.length > 0;
  
  // Calculate progress color based on percentage
  const progressColor = useMemo(() => {
    return calculateProgressColor(progressPercentage);
  }, [progressPercentage]);

  // Helper function to calculate color based on progress percentage
  function calculateProgressColor(timeRatio: number): string {
    // Constants for color hue values
    const GREEN_HUE = 142;
    const YELLOW_HUE = 48;
    const ORANGE_HUE = 25;
    const RED_HUE = 0;
    const DEFAULT_SATURATION = "85%";
    const DEFAULT_LIGHTNESS = "45%";
    
    // Helper function to interpolate between two values
    const interpolateValue = (ratio: number, min: number, max: number) => {
      return min + (max - min) * ratio;
    };
    
    // Color transitions based on progress
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
    <div className={styles.timeMarkers}>
      <span className={styles.timeMarker}>0:00</span>
      <span className={styles.timeMarker}>{formatTimeHuman(Math.floor(totalDuration / 2) * 1000)}</span>
      <span className={styles.timeMarker}>{formatTimeHuman(totalDuration * 1000)}</span>
    </div>
  );

  // Render progress bar component
  const progressBarComponent = (
    <div 
      className={`${styles.progressBarContainer} ${!isActive ? styles.inactiveBar : ''}`}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progressPercentage}
    >
      <div 
        className={styles.progressBar} 
        style={{ width: `${progressPercentage}%`, backgroundColor: progressColor }}
        data-testid="progress-indicator"
      />
    </div>
  );

  // Main container - adjust layout for mobile devices
  return (
    <div className={`${styles.container} ${isMobile ? styles.mobileContainer : ''}`}>
      {progressBarComponent}
      {timeMarkersComponent}
    </div>
  );
}
