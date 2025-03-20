import React, { useState, useRef, useEffect } from 'react';
import { Activity } from './ActivityManager';
import { TimelineEntry } from '../hooks/useTimelineEntries';
import { formatTime } from '@/utils/timeUtils';
import styles from './ActivityButton.module.css';

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
const ActivityButton: React.FC<ActivityButtonProps> = ({
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
  
  // Generate a testId-safe activity name
  const safeActivityName = name.toLowerCase().replace(/\s+/g, '-');
  
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
      className={isCompleted ? styles.completedActivityItem : styles.activityItem}
      style={colors ? {
        backgroundColor: colors.background,
        borderColor: colors.border
      } : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
          {isRunning && !isPendingCompletion && (
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
          
          {/* Iteration prompt */}
          {showIterationPrompt && !isPendingCompletion && (
            <div className={styles.iterationPrompt}>
              <span className={styles.iterationQuestion}>Continue to iterate?</span>
              <div className={styles.iterationActions}>
                <button
                  onClick={() => handleIterationResponse(true)}
                  className={styles.iterationButton}
                  aria-label="Yes"
                >
                  Yes
                </button>
                <button
                  onClick={() => handleIterationResponse(false)}
                  className={styles.iterationButton}
                  aria-label="No"
                >
                  No
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Action buttons */}
        {!isCompleted && !showIterationPrompt && (
          <div className={styles.activityActions}>
            {isPendingCompletion ? (
              // Show cancel button and progress during pending completion
              <div className={styles.completionDelayContainer}>
                <div 
                  className={styles.completionProgressBar}
                  style={{ width: `${completionProgress}%` }}
                  data-testid={`completion-progress-${safeActivityName}`}
                ></div>
                <button
                  onClick={cancelCompletionDelay}
                  className={styles.cancelCompletionButton}
                  title="Cancel completion"
                  aria-label="Cancel completion"
                  data-testid={`cancel-completion-${safeActivityName}`}
                >
                  <svg className={styles.buttonIcon} viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                  </svg>
                </button>
              </div>
            ) : (
              <button
                onClick={handleClick}
                className={isRunning ? styles.stopButton : styles.startButton}
                disabled={isCompleted}
                title={isRunning ? "Complete" : "Start"}
                aria-label={isRunning ? "Complete" : "Start"}
                data-testid={isRunning ? `complete-activity-${safeActivityName}` : `start-activity-${safeActivityName}`}
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
            )}
            {onRemove && !isPendingCompletion && (
              <button
                onClick={handleRemove}
                className={styles.removeButton}
                disabled={isInTimeline}
                title={isInTimeline ? "Can't remove while activity is in use" : "Remove activity"}
                aria-label="Remove"
                data-testid={`remove-activity-${safeActivityName}`}
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