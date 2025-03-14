import React from 'react';
import { Activity } from './ActivityManager';
import { TimelineEntry } from '../hooks/useTimelineEntries';
import { formatTime } from '@/utils/timeUtils';
import styles from './ActivityManager.module.css';

interface ActivityButtonProps {
  activity: Activity;
  isCompleted: boolean;
  isRunning: boolean;
  onSelect: (activity: Activity) => void;
  onRemove?: (id: string) => void;
  timelineEntries?: TimelineEntry[];
  elapsedTime?: number;
}

/**
 * ActivityButton component for displaying and interacting with activity items
 */
const ActivityButton: React.FC<ActivityButtonProps> = ({
  activity,
  isCompleted,
  isRunning,
  onSelect,
  onRemove,
  timelineEntries = [],
  elapsedTime = 0,
}) => {
  const { id, name, colors } = activity;
  const isInUse = timelineEntries?.some(entry => entry.activityId === id);
  
  const handleClick = () => {
    onSelect(activity);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRemove) {
      onRemove(id);
    }
  };

  return (
    <div 
      className={isCompleted ? styles.completedActivityItem : styles.activityItem}
      style={colors ? {
        backgroundColor: colors.background,
        borderColor: colors.border
      } : undefined}
    >
      {/* Title */}
      <span 
        className={isCompleted ? styles.completedActivityName : styles.activityName}
        style={colors ? { color: colors.text } : undefined}
      >
        {name}
      </span>

      {/* Right side content grouped together */}
      <div className={styles.activityRightContent}>
        {/* Status */}
        <div className={styles.activityStatus}>
          {isRunning && (
            <span className={styles.runningIndicator}>
              <span className={styles.timerDisplay}>{formatTime(elapsedTime)}</span>
            </span>
          )}
          {isCompleted && (
            <span 
              className={styles.completedTag}
              style={colors ? {
                color: colors.text,
                borderColor: colors.border
              } : undefined}
              title="Completed"
              aria-label="Completed"
            >
              <svg className={styles.checkIcon} viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
            </span>
          )}
        </div>
        
        {/* Action buttons */}
        {!isCompleted && (
        <div className={styles.activityActions}>
            <button
              onClick={handleClick}
              className={isRunning ? styles.stopButton : styles.startButton}
              disabled={isCompleted}
              title={isRunning ? "Complete" : "Start"}
              aria-label={isRunning ? "Complete" : "Start"}
              data-testid={`${isRunning ? 'complete' : 'start'}-activity-${name.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {isRunning ? (
                <svg className={styles.buttonIcon} viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
              ) : (
                <svg className={styles.buttonIcon} viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
            {onRemove && (
              <button
                onClick={handleRemove}
                className={styles.removeButton}
                disabled={isInUse}
                title={isInUse ? "Can't remove while activity is in use" : "Remove activity"}
                aria-label="Remove"
                data-testid={`remove-activity-${name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <svg className={styles.buttonIcon} viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityButton;
export { ActivityButton };