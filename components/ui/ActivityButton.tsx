import React from 'react';
import type { Activity } from '@components/feature/ActivityManager';
import type { TimelineEntry } from '@components/feature/Timeline';

/**
 * Props for the ActivityButton component
 * 
 * @interface ActivityButtonProps
 */
export interface ActivityButtonProps {
  /** The activity to display in this button */
  activity: Activity;
  
  /** Whether this activity has been completed */
  isCompleted: boolean;
  
  /** Whether this activity is currently active/selected */
  isActive: boolean;
  
  /** 
   * Handler for when the activity button is clicked
   * 
   * @returns {void}
   */
  onClick: () => void;
  
  /**
   * Handler for when the remove button is clicked
   * 
   * @returns {void}
   */
  onRemove: () => void;
  
  /** Whether the button is disabled */
  disabled: boolean;
  
  /** Array of timeline entries to calculate activity duration */
  timelineEntries?: TimelineEntry[];
  
  /** 
   * Current elapsed time in seconds (not used directly in the component but 
   * kept for API compatibility) 
   */
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  elapsedTime = 0  // Parameter kept for API compatibility but not used
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
  
  // Get background and text colors from activity if available
  const style = activity.colors ? {
    backgroundColor: activity.colors.light?.background,
    color: activity.colors.light?.text,
    borderColor: activity.colors.light?.border
  } : undefined;
  
  return (
    <div
      style={style}
      onClick={onClick}
      data-testid={`activity-button-${activity.id}`}
    >
      <div>
        <span>
          {activity.name}
          
          {/* Show status badges */}
          {isActive && (
            <span data-testid="current-badge">
              Current
            </span>
          )}
          {isCompleted && (
            <span data-testid="completed-badge">
              Done
            </span>
          )}
        </span>
        
        {/* Show duration if available */}
        {(isCompleted || isActive) && timelineEntries.length > 0 && (
          <span data-testid="activity-duration">
            {getDuration()}
          </span>
        )}
      </div>
      
      <div>
        {/* Delete button */}
        {!isActive && (
          <button onClick={(e) => {
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
