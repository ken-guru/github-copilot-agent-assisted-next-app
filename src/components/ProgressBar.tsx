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

interface SegmentData {
  width: number; // percentage of the bar
  color: {
    background: string;
    border: string;
  };
  activityName: string | null;
  duration: number; // in seconds
  isBreak: boolean;
  isCurrent: boolean;
}

const getTimeBasedState = (elapsedTime: number, totalDuration: number) => {
  if (elapsedTime >= totalDuration) {
    return { state: 'stateRed', pulsing: true };
  }

  const remainingPercentage = ((totalDuration - elapsedTime) / totalDuration) * 100;

  if (remainingPercentage > 50) {
    return { state: 'stateGreen', pulsing: false };
  } else if (remainingPercentage > 25) {
    return { state: 'stateYellow', pulsing: false };
  } else {
    return { state: 'stateOrange', pulsing: false };
  }
};

export default function ProgressBar({
  entries,
  totalDuration,
  elapsedTime,
  timerActive = false
}: ProgressBarProps) {
  if (!timerActive || entries.length === 0 || totalDuration <= 0) {
    return null;
  }

  // Calculate segments based on timeline entries
  const calculateSegments = (): SegmentData[] => {
    const segments: SegmentData[] = [];
    const now = Date.now();
    let remainingWidth = 100; // total percentage
    
    entries.forEach((entry, index) => {
      const isLast = index === entries.length - 1;
      const duration = entry.endTime 
        ? Math.round((entry.endTime - entry.startTime) / 1000)
        : Math.round((now - entry.startTime) / 1000);
      
      const isBreak = entry.activityId === null;
      const isCurrent = !entry.endTime || isLast;
      
      // Calculate this segment's width as a percentage of total duration
      const segmentWidth = Math.min(remainingWidth, (duration / totalDuration) * 100);
      remainingWidth -= segmentWidth;
      
      // Default colors for breaks and dark mode adjustments
      let background = '#d1d5db';
      let border = '#4B5563';
      
      // Override background color for break segments
      if (isBreak) {
        background = '#d1d5db';
      }
      
      // Use activity colors if available, with dark mode consideration
      if (entry.colors) {
        background = entry.colors.background;
        border = entry.colors.border;
      }
      
      segments.push({
        width: segmentWidth,
        color: {
          background,
          border
        },
        activityName: entry.activityName || (isBreak ? 'Break' : null),
        duration,
        isBreak,
        isCurrent
      });
    });
    
    // Add remaining time segment if there's still time left and not exceeded
    if (remainingWidth > 0 && elapsedTime < totalDuration) {
      const remainingTime = totalDuration - elapsedTime;
      segments.push({
        width: remainingWidth,
        color: {
          background: '#374151',
          border: '#4B5563'
        },
        activityName: 'Remaining',
        duration: remainingTime,
        isBreak: true,
        isCurrent: false
      });
    }
    
    return segments;
  };

  const segments = calculateSegments();
  const timeState = getTimeBasedState(elapsedTime, totalDuration);
  const containerClasses = [
    styles.progressBarContainer,
    styles[timeState.state],
    timeState.pulsing ? styles.statePulsing : ''
  ].filter(Boolean).join(' ');

  const remainingTime = Math.max(0, totalDuration - elapsedTime);
  const remainingTimeFormatted = formatTimeHuman(remainingTime * 1000);
  const progressPercentage = Math.min(100, (elapsedTime / totalDuration) * 100);

  return (
    <div 
      className={styles.container}
      role="complementary"
      aria-label="Progress"
    >
      <div 
        className={containerClasses}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progressPercentage}
        aria-label={`Time remaining: ${remainingTimeFormatted}`}
      >
        {segments.map((segment, index) => (
          <div
            key={index}
            className={`${styles.segment} ${segment.isBreak ? styles.breakSegment : ''} ${segment.isCurrent ? styles.currentSegment : ''}`}
            style={{
              width: `${segment.width}%`,
              backgroundColor: segment.color.background,
              borderColor: segment.color.border
            }}
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={segment.width}
            aria-label={`${segment.activityName || 'Break'}: ${formatTimeHuman(segment.duration * 1000)}`}
          >
            {segment.width > 8 && (
              <span className={styles.segmentLabel}>
                {segment.activityName}
              </span>
            )}
          </div>
        ))}
      </div>
      <div className={styles.timeMarkers}>
        <span className={styles.timeMarker}>0:00</span>
        <span className={styles.timeMarker}>{formatTimeHuman(Math.floor(totalDuration / 2) * 1000)}</span>
        <span className={styles.timeMarker}>{formatTimeHuman(totalDuration * 1000)}</span>
      </div>
    </div>
  );
}