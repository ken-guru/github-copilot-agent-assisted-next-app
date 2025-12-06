"use client";

import React from 'react';
import styles from './Summary.module.css';
import type { TimelineEntry } from '@/types';
import { useThemeReactive } from '@/hooks/useThemeReactive';

/**
 * Props interface for the Summary component
 */
interface SummaryProps {
  /**
   * Timeline entries to analyze and display in the summary
   */
  entries?: TimelineEntry[];
  
  /**
   * Total planned duration in seconds
   */
  totalDuration: number;
  
  /**
   * Elapsed time in seconds since the timer started
   */
  elapsedTime: number;
  
  /**
   * Whether the timer is currently active
   * @default false
   */
  timerActive?: boolean;
  
  /**
   * Whether all planned activities have been completed
   * @default false
   */
  allActivitiesCompleted?: boolean;
  
  /**
   * Whether the allocated time has been fully used
   * @default false
   */
  isTimeUp?: boolean;
}

export default function Summary({ 
  entries = [], 
  totalDuration, 
  elapsedTime, 
  timerActive = false,
  allActivitiesCompleted = false,
  isTimeUp = false
}: SummaryProps) {
  // React to theme changes using dedicated hook for reliable updates
  const { theme: currentTheme } = useThemeReactive();

  // Capture current timestamp for calculations
  // Use state to store the current time, updated via effect
  const [currentTime, setCurrentTime] = React.useState(0);
  
  // Initialize and update current time when component mounts or dependencies change
  React.useEffect(() => {
    // Capturing timestamp for pure render calculations
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentTime(Date.now());
  }, [entries, elapsedTime]);

  // Function to get the theme-appropriate color for an activity
  const getThemeAppropriateColor = (colors: TimelineEntry['colors']) => {
    if (!colors) return undefined;
    
    // If colors is already in the format with background/text/border directly
    if ('background' in colors && 'text' in colors && 'border' in colors) {
      return {
        background: colors.background,
        text: colors.text,
        border: colors.border
      };
    }
    
    // If colors has light/dark variants
    if ('light' in colors && 'dark' in colors) {
      const themeColors = currentTheme === 'dark' ? colors.dark : colors.light;
      if (themeColors) {
        return {
          background: themeColors.background,
          text: themeColors.text,
          border: themeColors.border
        };
      }
    }
    
    // Default fallback
    return {
      background: 'var(--background-muted)',
      text: 'var(--foreground)',
      border: 'var(--border-color)'
    };
  };
  
  // No need for manual observers here; useThemeReactive handles reactivity

  const getStatusMessage = () => {
    // First check if time is up, this should take precedence
    if (isTimeUp) {
      return {
        message: "Time's up! Review your completed activities below.",
        className: styles.statusMessageLate
      };
    }

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
          className: styles.statusMessageLate
        };
      } else {
        return {
          message: "You're doing great, keep going!",
          className: styles.statusMessageEarly
        };
      }
    } else if (allActivitiesCompleted) {
      const timeDiff = elapsedTime - totalDuration;
      
      if (timeDiff > 0) {
        const laterBy = formatDuration(timeDiff);
        return {
          message: `You took ${laterBy} more than planned`,
          className: styles.statusMessageLate
        };
      } else {
        const earlierBy = formatDuration(Math.abs(timeDiff));
        return {
          message: `Amazing! You finished ${earlierBy} earlier than planned!`,
          className: styles.statusMessageEarly
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

  const calculateActivityStats = (currentTime: number) => {
    if (!entries || entries.length === 0) return null;
    
    const stats = {
      idleTime: 0,
      activeTime: 0
    };
    
    let lastEndTime: number | null = null;
    
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      if (!entry) continue; // Skip undefined entries
      
      const endTime = entry.endTime ?? currentTime;
      
      // Calculate break time between activities
      if (lastEndTime && entry.startTime > lastEndTime) {
        stats.idleTime += Math.round((entry.startTime - lastEndTime) / 1000);
      }
      
      // Calculate activity duration
      const duration = Math.round((endTime - entry.startTime) / 1000);
      
      if (entry.activityId) {
        stats.activeTime += duration;
      } else {
        stats.idleTime += duration;
      }
      
      lastEndTime = endTime;
    }
    
    return stats;
  };

  const calculateOvertime = () => {
    return Math.max(0, elapsedTime - totalDuration);
  };

  const calculateActivityTimes = (currentTime: number) => {
    if (!entries || entries.length === 0) return [];
    
    const activityTimes: { id: string; name: string; duration: number; colors?: TimelineEntry['colors'] }[] = [];
    const activityMap = new Map<string, { duration: number; name: string; colors?: TimelineEntry['colors'] }>();
    const seenActivityIds = new Set<string>(); // Track order of first appearance
    
    // Sort entries by startTime to ensure chronological order
    const sortedEntries = [...entries].sort((a, b) => a.startTime - b.startTime);
    
    // First pass: Calculate total durations
    for (const entry of sortedEntries) {
      if (entry.activityId && entry.activityName) {
        const endTime = entry.endTime ?? currentTime;
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
        
        // Track first appearance of each activity
        if (!seenActivityIds.has(entry.activityId)) {
          seenActivityIds.add(entry.activityId);
          activityTimes.push({ 
            id: entry.activityId, 
            ...activityMap.get(entry.activityId)! 
          });
        }
      }
    }
    
    // Update durations in activityTimes with final values
    return activityTimes.map(activity => ({
      ...activity,
      duration: activityMap.get(activity.id)!.duration
    }));
  };

  const status = getStatusMessage();
  const stats = calculateActivityStats(currentTime);
  
  // Early return modified to handle isTimeUp case
  if ((!allActivitiesCompleted && !isTimeUp) || !stats) {
    return null;
  }
  
  const overtime = calculateOvertime();
  const activityTimes = calculateActivityTimes(currentTime);

  return (
    <div className={`${styles.container}`} data-testid="summary">
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
          {activityTimes.map((activity) => {
            // Get theme-appropriate colors
            const themeColors = activity.colors ? 
              getThemeAppropriateColor(activity.colors) : 
              undefined;
            
            return (
              <div 
                key={activity.id}
                className={styles.activityItem}
                data-testid={`activity-summary-item-${activity.id}`}
                style={themeColors ? {
                  backgroundColor: themeColors.background,
                  borderColor: themeColors.border
                } : undefined}
              >
                <span 
                  className={styles.activityName}
                  data-testid={`activity-name-${activity.id}`}
                  style={themeColors ? { color: themeColors.text } : undefined}
                >
                  {activity.name}
                </span>
                <span className={styles.activityTime}>
                  {formatDuration(activity.duration)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
