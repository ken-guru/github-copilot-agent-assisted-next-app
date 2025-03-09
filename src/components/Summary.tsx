import React from 'react';
import styles from './Summary.module.css';
import { TimelineEntry } from './Timeline';

interface SummaryProps {
  entries?: TimelineEntry[];
  totalDuration: number;
  elapsedTime: number;
  timerActive?: boolean;
  allActivitiesCompleted?: boolean;
}

export default function Summary({ 
  entries = [], 
  totalDuration, 
  elapsedTime, 
  timerActive = false,
  allActivitiesCompleted = false
}: SummaryProps) {
  const getStatusMessage = () => {
    if (timerActive) {
      const remainingTime = totalDuration - elapsedTime;
      if (remainingTime < 0) {
        return {
          message: "You've gone over the allocated time!",
          className: styles.statusMessageLate
        };
      } else if (remainingTime === 0) {
        return {
          message: "Time's up!",
          className: styles.statusMessageOnTime
        };
      } else {
        return {
          message: "You're doing great, keep going!",
          className: styles.statusMessageEarly
        };
      }
    } else if (allActivitiesCompleted) {
      const timeDiff = elapsedTime - totalDuration;
      const threshold = 60; // 60 seconds threshold for "on time"
      
      if (Math.abs(timeDiff) <= threshold) {
        return {
          message: "Great job! You completed everything right on schedule!",
          className: styles.statusMessageOnTime
        };
      } else if (timeDiff < -threshold) {
        const earlierBy = formatDuration(Math.abs(timeDiff));
        return {
          message: `Well done! You finished ${earlierBy} ahead of schedule!`,
          className: styles.statusMessageEarly
        };
      } else {
        const laterBy = formatDuration(timeDiff);
        return {
          message: `You took ${laterBy} more than planned`,
          className: styles.statusMessageLate
        };
      }
    }
    return null;
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
  };

  const calculateActivityStats = () => {
    if (!entries || entries.length === 0) return null;

    const stats = {
      activeTime: 0,
      idleTime: 0,
      activities: new Map<string, number>()
    };

    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      // Check if endTime exists, otherwise use current time for ongoing activities
      const endTime = entry.endTime ?? Date.now();
      const duration = endTime - entry.startTime;
      
      if (entry.activityId) {
        stats.activeTime += duration / 1000;
        const activityTime = stats.activities.get(entry.activityName || '') || 0;
        stats.activities.set(entry.activityName || '', activityTime + duration / 1000);
      } else {
        stats.idleTime += duration / 1000;
      }
    }

    return stats;
  };

  const status = getStatusMessage();
  const stats = calculateActivityStats();

  if (!status && !stats) return null;

  return (
    <div className={`${styles.container}`}>
      {status && (
        <div className={`${styles.statusMessage} ${status.className}`}>
          {status.message}
        </div>
      )}
      {allActivitiesCompleted && stats && (
        <div className={styles.summary}>
          <h2>Activity Summary</h2>
          <div className={styles.stats}>
            <div>
              <span>Total Time:</span>
              <span>{formatDuration(elapsedTime)}</span>
            </div>
            <div>
              <span>Planned Time:</span>
              <span>{formatDuration(totalDuration)}</span>
            </div>
            <div>
              <span>Active Time:</span>
              <span>{formatDuration(stats.activeTime)}</span>
            </div>
            <div>
              <span>Idle Time:</span>
              <span>{formatDuration(stats.idleTime)}</span>
            </div>
          </div>
          <div className={styles.activities}>
            {Array.from(stats.activities).map(([name, duration]) => (
              <div key={name}>
                <span>{name}</span>
                <span>{formatDuration(duration)}</span>
              </div>
            ))}
            {stats.idleTime > 0 && (
              <div>
                <span>Breaks/Idle time</span>
                <span>{formatDuration(stats.idleTime)}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}