import React from 'react';
import { Activity } from './ActivityManager';
import { TimelineEntry } from '@/types';
import { formatTime } from '@/utils/timeUtils';
// import styles from './ActivityButton.module.css';

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

  // Build CSS classes
  const buttonClasses = [
    // styles.activityButton,
    // isRunning && styles.isRunning,
    // isCompleted && styles.isCompleted
  ].filter(Boolean).join(' ');

  return (
    <button
      type="button"
      // className={buttonClasses}
      onClick={handleClick}
      // style={{
      //   backgroundColor: colors.background,
      //   color: colors.text,
      //   border: `2px solid ${colors.border}`,
      // }}
      data-testid={`activity-button-${id}`}
      aria-pressed={isRunning}
      aria-label={`${name}${isCompleted ? ' (Completed)' : ''}${isRunning ? ' (Running)' : ''}`}
    >
      <div /* className={styles.activityInfo} */>
        <span /* className={styles.activityName} */>{name}</span>
        {elapsedTime > 0 && (
          <span /* className={styles.elapsedTime} */>
            {formatTime(elapsedTime)}
          </span>
        )}
      </div>
      {onRemove && !isInUse && (
        <button 
          type="button"
          // className={styles.removeButton}
          onClick={handleRemove}
          aria-label={`Remove ${name}`}
          data-testid={`remove-button-${id}`}
        >
          &times;
        </button>
      )}
    </button>
  );
};

export default ActivityButton;
export { ActivityButton };