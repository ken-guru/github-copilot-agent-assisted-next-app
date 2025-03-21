import React, { useState, useEffect } from 'react';
import { TimelineEntry } from './Timeline';
import styles from './ProgressBar.module.css';
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
  
  // Determine the appropriate color class based on elapsed time percentage
  const getColorClass = () => {
    if (!isActive) return '';
    
    const timeRatio = elapsedTime / totalDuration;
    
    if (timeRatio >= 1) {
      return styles.redPulse;  // 100%+ - Red pulsing
    } else if (timeRatio >= 0.75) {
      return styles.orangeGlow; // 75%-100% - Orange glow
    } else if (timeRatio >= 0.5) {
      return styles.yellowGlow; // 50%-75% - Yellow glow
    } else {
      return styles.greenGlow;  // <50% - Green glow
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
      aria-valuenow={Math.round(progressPercentage)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Progress towards total duration"
    >
      {isActive && (
        <div 
          className={`${styles.progressFill} ${getColorClass()}`} 
          style={{ width: `${progressPercentage}%` }}
        />
      )}
    </div>
  );

  return (
    <div className={`${styles.container} ${isMobile ? styles.mobileContainer : ''}`}>
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