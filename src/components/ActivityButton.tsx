import React from 'react';
import { Activity } from './ActivityManager';
import { TimelineEntry } from '../hooks/useTimelineEntries';
import { formatTimeFromSeconds } from '@/utils/timeUtils';
import { IconButton } from '@/components/common';
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
              <span className={styles.timerDisplay}>{formatTimeFromSeconds(elapsedTime)}</span>
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
            <IconButton
              icon={isRunning ? "check" : "play"}
              label={isRunning ? "Complete" : "Start"}
              onClick={handleClick}
              className={isRunning ? styles.stopButton : styles.startButton}
              disabled={isCompleted}
              testId={`${isRunning ? 'complete' : 'start'}-activity-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
            />
            
            {onRemove && (
              <IconButton
                icon="close"
                label="Remove"
                onClick={handleRemove}
                className={styles.removeButton}
                disabled={isInUse}
                title={isInUse ? "Can't remove while activity is in use" : "Remove activity"}
                testId={`remove-activity-${name.toLowerCase().replace(/\s+/g, '-')}`}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityButton;
export { ActivityButton };