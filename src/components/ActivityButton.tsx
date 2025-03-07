import React from 'react';
import { Activity } from './ActivityManager';
import { TimelineEntry } from '../hooks/useActivityState';
import styles from './ActivityManager.module.css';

interface ActivityButtonProps {
  activity: Activity;
  isCompleted: boolean;
  isRunning: boolean;
  onSelect: (activity: Activity) => void;
  onRemove?: (id: string) => void;
  timelineEntries?: TimelineEntry[];
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
      key={id} 
      className={isCompleted ? styles.completedActivityItem : styles.activityItem}
      style={colors ? {
        backgroundColor: colors.background,
        borderColor: colors.border
      } : undefined}
    >
      <span 
        className={isCompleted ? styles.completedActivityName : styles.activityName}
        style={colors ? { color: colors.text } : undefined}
      >
        {name}
      </span>
      <div className={styles.buttonGroup}>
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
        {!isCompleted && (
          <button
            onClick={handleRemove}
            className={styles.removeButton}
            disabled={isInUse}
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