import React from 'react';
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
  if (!timerActive || entries.length === 0 || totalDuration <= 0) {
    return null;
  }

  // Calculate the progress percentage (capped at 100%)
  const progressPercentage = Math.min(100, (elapsedTime / totalDuration) * 100);
  
  // Determine the appropriate color class based on elapsed time percentage
  const getColorClass = () => {
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

  return (
    <div className={styles.container}>
      <div 
        className={styles.progressBarContainer}
        role="progressbar"
        aria-valuenow={Math.round(progressPercentage)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Progress towards total duration"
      >
        <div 
          className={`${styles.progressFill} ${getColorClass()}`} 
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      <div className={styles.timeMarkers}>
        <span className={styles.timeMarker}>0:00</span>
        <span className={styles.timeMarker}>{formatTimeHuman(Math.floor(totalDuration / 2) * 1000)}</span>
        <span className={styles.timeMarker}>{formatTimeHuman(totalDuration * 1000)}</span>
      </div>
    </div>
  );
}