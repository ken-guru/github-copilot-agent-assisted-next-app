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
          message: `Amazing! You finished ${earlierBy} earlier than planned!`,
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
    // Round to nearest whole second
    seconds = Math.round(seconds);
    
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
      idleTime: 0,
      activeTime: 0
    };
    
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      const endTime = entry.endTime ?? Date.now();
      // Round to nearest whole second
      const duration = Math.round((endTime - entry.startTime) / 1000);
      
      if (entry.activityId) {
        stats.activeTime += duration;
      } else {
        stats.idleTime += duration;
      }
    }
    
    return stats;
  };

  const calculateOvertime = () => {
    // Calculate overtime - any time spent beyond the planned duration, minimum 0
    const overtime = Math.max(0, elapsedTime - totalDuration);
    return Math.round(overtime); // Round to nearest whole second
  };

  const calculateActivityTimes = () => {
    if (!entries || entries.length === 0) return [];
    
    const activityTimes: { id: string; name: string; duration: number; colors?: TimelineEntry['colors'] }[] = [];
    const activityMap = new Map<string, { duration: number; name: string; colors?: TimelineEntry['colors'] }>();
    
    for (const entry of entries) {
      if (entry.activityId && entry.activityName) {
        const endTime = entry.endTime ?? Date.now();
        const duration = Math.round((endTime - entry.startTime) / 1000);
        
        if (activityMap.has(entry.activityId)) {
          const existing = activityMap.get(entry.activityId)!;
          existing.duration += duration;
        } else {
          activityMap.set(entry.activityId, {
            duration,
            name: entry.activityName,
            colors: entry.colors
          });
        }
      }
    }
    
    activityMap.forEach((value, id) => {
      activityTimes.push({ id, ...value });
    });
    
    return activityTimes.sort((a, b) => b.duration - a.duration);
  };

  const status = getStatusMessage();
  const stats = calculateActivityStats();
  
  if (!allActivitiesCompleted || !stats) return null;
  
  const overtime = calculateOvertime();

  const activityTimes = calculateActivityTimes();

  return (
    <div className={`${styles.container}`}>
      {status && (
        <div className={`${styles.statusMessage} ${status.className}`}>
          {status.message}
        </div>
      )}
      
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Planned Time</div>
          <div className={styles.statValue}>{formatDuration(totalDuration)}</div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Spent Time</div>
          <div className={styles.statValue}>{formatDuration(elapsedTime)}</div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Idle Time</div>
          <div className={styles.statValue}>{formatDuration(stats.idleTime)}</div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Overtime</div>
          <div className={styles.statValue}>{formatDuration(overtime)}</div>
        </div>
      </div>

      {activityTimes.length > 0 && (
        <div className={styles.activityList}>
          <h3 className={styles.activityListHeading}>Time Spent per Activity</h3>
          {activityTimes.map(activity => (
            <div 
              key={activity.id}
              className={styles.activityItem}
              style={activity.colors ? {
                backgroundColor: activity.colors.background,
                borderColor: activity.colors.border
              } : undefined}
            >
              <span 
                className={styles.activityName}
                style={activity.colors ? { color: activity.colors.text } : undefined}
              >
                {activity.name}
              </span>
              <span className={styles.activityTime}>
                {formatDuration(activity.duration)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}