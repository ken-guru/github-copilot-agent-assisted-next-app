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
      {/* Title row */}
      <span 
        className={isCompleted ? styles.completedActivityName : styles.activityName}
        style={colors ? { color: colors.text } : undefined}
      >
        {name}
      </span>

      {/* Status area with timer */}
      <div className={styles.activityStatus}>
        {isRunning && (
          <span className={styles.runningIndicator}>
            <span>Active</span>
            <span className={styles.timerDisplay}>{formatTime(elapsedTime)}</span>
          </span>
        )}
      </div>
      
      {/* Action buttons row */}
      <div className={styles.buttonGroup}>
        <div>
          {isCompleted ? (
            <span 
              className={styles.completedTag}
              style={colors ? {
                color: colors.text,
                borderColor: colors.border
              } : undefined}
            >
              Completed
            </span>
          ) : (
            <button
              onClick={handleClick}
              className={isRunning ? styles.stopButton : styles.startButton}
              disabled={isCompleted}
            >
              {isRunning ? 'Complete' : 'Start'}
            </button>
          )}
        </div>
        {!isCompleted && (
          <button
            onClick={handleRemove}
            className={styles.removeButton}
            disabled={isInUse}
            title={isInUse ? "Can't remove while activity is in use" : "Remove activity"}
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
};

export default ActivityButton;
export { ActivityButton };