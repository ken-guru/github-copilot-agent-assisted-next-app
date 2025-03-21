import React, { useState, useRef, useEffect } from 'react';
import { Activity } from './ActivityManager';
import { TimelineEntry } from '../hooks/useTimelineEntries';
import { formatTime } from '@/utils/timeUtils';
import styles from './ActivityButton.module.css';

interface IconProps {
  className?: string;
}

// Icon components
const PlayIcon: React.FC<IconProps> = ({ className }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M4 3.5L12 8L4 12.5V3.5Z" fill="currentColor"/>
  </svg>
);

const CheckIcon: React.FC<IconProps> = ({ className }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M13.5 4.5L6 12L2.5 8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const TrashIcon: React.FC<IconProps> = ({ className }) => (
  <svg width="16" height="16" viewBox="0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M2 4H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M5 4V3C5 2.44772 5.44772 2 6 2H10C10.5523 2 11 2.44772 11 3V4" stroke="currentColor" strokeWidth="2"/>
    <path d="M12 4V13C12 13.5523 11.5523 14 11 14H5C4.44772 14 4 13.5523 4 13V4" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

interface ActivityButtonProps {
  activity: Activity;
  isCompleted: boolean;
  isRunning: boolean;
  onSelect: (activity: Activity) => void;
  onRemove?: (id: string) => void;
  timelineEntries?: TimelineEntry[];
  elapsedTime?: number;
  isInTimeline?: boolean; // New prop to explicitly indicate if activity is in timeline
}

/**
 * ActivityButton component for displaying and interacting with activity items
 */
export const ActivityButton: React.FC<ActivityButtonProps> = ({
  activity,
  isCompleted,
  isRunning,
  onSelect,
  onRemove,
  timelineEntries = [],
  elapsedTime = 0,
  isInTimeline = false, // Default to false
}) => {
  const { id, name, colors } = activity;
  const [isHovered, setIsHovered] = useState(false);
  
  // States for completion delay feature
  const [isPendingCompletion, setIsPendingCompletion] = useState(false);
  const [completionProgress, setCompletionProgress] = useState(0);
  const completionTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // State for iteration prompt
  const [showIterationPrompt, setShowIterationPrompt] = useState(false);
  const iterationPromptTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  const handleClick = () => {
    // If it's currently running and clicked, start the completion delay
    if (isRunning) {
      startCompletionDelay();
    } else {
      // Otherwise just select the activity as before
      onSelect(activity);
    }
  };
  
  const startCompletionDelay = () => {
    const COMPLETION_DELAY_MS = 3000; // 3 seconds
    const PROGRESS_INTERVAL_MS = 30; // Update progress every 30ms
    const startTime = Date.now();
    
    // Set initial state
    setIsPendingCompletion(true);
    setCompletionProgress(0);
    
    // Start the progress update interval
    const intervalId = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / COMPLETION_DELAY_MS * 100, 100);
      
      setCompletionProgress(progress);
      
      if (progress >= 100) {
        clearInterval(intervalId);
        completeActivity();
      }
    }, PROGRESS_INTERVAL_MS);
    
    // Store the reference to clear it if needed
    completionTimerRef.current = intervalId;
  };
  
  const cancelCompletionDelay = () => {
    if (completionTimerRef.current) {
      clearInterval(completionTimerRef.current);
      completionTimerRef.current = null;
    }
    setIsPendingCompletion(false);
    setCompletionProgress(0);
  };
  
  const completeActivity = () => {
    // Clean up first
    cancelCompletionDelay();
    // Then complete the activity
    onSelect(activity);
    // Show iteration prompt
    showIterationPromptWithTimeout();
  };
  
  const showIterationPromptWithTimeout = () => {
    setShowIterationPrompt(true);
    
    // Auto-dismiss after 5 seconds
    const ITERATION_PROMPT_TIMEOUT = 5000;
    iterationPromptTimerRef.current = setTimeout(() => {
      setShowIterationPrompt(false);
    }, ITERATION_PROMPT_TIMEOUT);
  };
  
  const handleIterationResponse = (shouldIterate: boolean) => {
    // Clear the auto-dismiss timeout
    if (iterationPromptTimerRef.current) {
      clearTimeout(iterationPromptTimerRef.current);
      iterationPromptTimerRef.current = null;
    }
    
    // Hide the prompt
    setShowIterationPrompt(false);
    
    // If user wants to iterate, start the activity again
    if (shouldIterate) {
      onSelect(activity);
    }
  };
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (completionTimerRef.current) {
        clearInterval(completionTimerRef.current);
      }
      if (iterationPromptTimerRef.current) {
        clearTimeout(iterationPromptTimerRef.current);
      }
    };
  }, []);
  
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRemove && !isInTimeline) {
      onRemove(id);
    }
  };
  
  return (
    <div 
      className={styles.activityContainer}
      data-testid={`activity-${id}`}
      style={{
        backgroundColor: activity.colors?.background,
        borderColor: activity.colors?.border,
        color: activity.colors?.text
      }}
    >
      <div className={`${styles.activityContent} ${isCompleted ? styles.completedActivityItem : styles.activityItem}`}>
        <span className={isCompleted ? styles.completedActivityName : styles.activityName}>
          {activity.name}
        </span>
        {isRunning && (
          <div className={styles.timerDisplay}>
            {formatTime(elapsedTime)}
          </div>
        )}
      </div>
      <div className={styles.activityActions}>
        {isPendingCompletion && (
          <div className={styles.completionProgressContainer}>
            <div 
              className={styles.completionProgressBar}
              style={{ width: `${completionProgress}%` }}
              data-testid={`completion-progress-${id}`}
            />
            <button
              type="button"
              onClick={cancelCompletionDelay}
              className={styles.cancelButton}
              aria-label="Cancel completion"
            >
              Cancel
            </button>
          </div>
        )}
        {showIterationPrompt ? (
          <div className={styles.iterationPrompt}>
            <span className={styles.iterationQuestion}>Continue to iterate?</span>
            <div className={styles.iterationActions}>
              <button
                type="button"
                onClick={() => handleIterationResponse(true)}
                className={styles.iterationButton}
                aria-label="Yes"
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => handleIterationResponse(false)}
                className={styles.iterationButton}
                aria-label="No"
              >
                No
              </button>
            </div>
          </div>
        ) : (
          <>
            {!isCompleted && (
              <button
                type="button"
                onClick={handleClick}
                className={isRunning ? styles.runningButton : styles.startButton}
                aria-label={isRunning ? 'Complete' : 'Start'}
                data-testid={isRunning ? `complete-activity-${activity.id}` : `start-activity-${activity.id}`}
              >
                {isRunning ? <CheckIcon className={styles.buttonIcon} /> : <PlayIcon className={styles.buttonIcon} />}
              </button>
            )}
            {onRemove && (
              <button
                type="button"
                onClick={handleRemove}
                className={styles.removeButton}
                disabled={isInTimeline}
                aria-disabled={isInTimeline}
                aria-label="Remove"
                data-testid={`remove-activity-${activity.id}`}
              >
                <TrashIcon className={styles.buttonIcon} />
              </button>
            )}
            {isCompleted && (
              <div className={styles.completedTag} aria-label="Completed">
                <CheckIcon className={styles.checkIcon} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ActivityButton;