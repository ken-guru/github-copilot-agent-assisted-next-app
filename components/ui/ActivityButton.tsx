import React from 'react';
import styles from './ActivityButton.module.css';
import type { Activity } from '@components/feature/ActivityManager';
import type { TimelineEntry } from '@components/feature/Timeline';

export interface ActivityButtonProps {
  activity: Activity;
  isCompleted: boolean;
  isActive: boolean;
  onClick: () => void;
  onRemove: () => void;
  disabled: boolean;
  timelineEntries?: TimelineEntry[];
  elapsedTime?: number;
}

export function ActivityButton({
  activity,
  isCompleted,
  isActive,
  onClick,
  onRemove,
  disabled,
  timelineEntries = [],
  elapsedTime = 0
}: ActivityButtonProps) {
  // Calculate the duration of this activity from timeline entries
  const getDuration = () => {
    let totalDuration = 0;
    
    timelineEntries.forEach(entry => {
      if (entry.activityId === activity.id) {
        const endTime = entry.endTime || Date.now();
        totalDuration += endTime - entry.startTime;
      }
    });
    
    return formatDuration(Math.floor(totalDuration / 1000));
  };
  
  // Format seconds into a readable duration string
  const formatDuration = (seconds: number) => {
    if (seconds < 60) {
      return `${seconds}s`;
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      return `${hours}h ${minutes}m`;
    }
  };
  
  // Determine button states and styles based on activity state
  const className = isCompleted
    ? styles.completedActivityItem
    : styles.activityItem;
  
  // Get background and text colors from activity if available
  const style = activity.colors ? {
    backgroundColor: activity.colors.light?.background,
    color: activity.colors.light?.text,
    borderColor: activity.colors.light?.border
  } : undefined;
  
  return (
    <div 
      className={className}
      style={style}
      onClick={onClick}
      data-testid={`activity-button-${activity.id}`}
    >
      <div className={styles.activityInfo}>
        <span className={styles.activityName}>
          {activity.name}
          
          {/* Show status badges */}
          {isActive && (
            <span className={`${styles.badge} ${styles.badgeCurrent}`} data-testid="current-badge">
              Current
            </span>
          )}
          {isCompleted && (
            <span className={`${styles.badge} ${styles.badgeCompleted}`} data-testid="completed-badge">
              Done
            </span>
          )}
        </span>
        
        {/* Show duration if available */}
        {(isCompleted || isActive) && timelineEntries.length > 0 && (
          <span className={styles.duration} data-testid="activity-duration">
            {getDuration()}
          </span>
        )}
      </div>
      
      <div className={styles.actions}>
        {/* Delete button */}
        {!isActive && (
          <button 
            className={`${styles.button} ${styles.deleteButton}`}
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            disabled={disabled}
            data-testid="delete-button"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
