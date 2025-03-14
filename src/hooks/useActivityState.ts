import { useState, useCallback, useEffect } from 'react';
import { Activity } from '@/components/ActivityManager';
import { useActivitiesTracking } from './useActivitiesTracking';
import { useTimelineEntries } from './useTimelineEntries';
import { ActivityState } from '@/utils/activityStateMachine';

export interface UseActivityStateProps {
  onTimerStart?: () => void;
}

/**
 * Main hook for activity state management
 * Combines activity tracking and timeline entries
 */
export function useActivityState({ onTimerStart }: UseActivityStateProps = {}) {
  const [currentActivity, setCurrentActivity] = useState<Activity | null>(null);
  const [allActivitiesCompleted, setAllActivitiesCompleted] = useState(false);
  
  // Use our abstracted hooks for cleaner state management
  const {
    activities,
    allActivityIds,
    startedActivityIds,
    completedActivityIds,
    removedActivityIds,
    hasActuallyStartedActivity,
    addActivity,
    startActivity,
    completeActivity,
    removeActivity,
    resetActivities: resetActivityTracking,
    // New state machine methods
    getCurrentActivity: getCurrentActivityState,
    isCompleted: isActivitiesCompleted,
    getActivityState
  } = useActivitiesTracking();

  const {
    timelineEntries,
    addTimelineEntry,
    completeCurrentTimelineEntry,
    resetTimelineEntries
  } = useTimelineEntries();

  const handleActivitySelect = useCallback((activity: Activity | null) => {
    if (activity) {
      // Add activity to the state machine if it's not already there
      addActivity(activity.id);
      
      // If there's a current activity, complete it first
      if (currentActivity) {
        completeActivity(currentActivity.id);
        completeCurrentTimelineEntry();
      }

      setCurrentActivity(activity);
      
      // Start the new activity
      addTimelineEntry(activity);
      startActivity(activity.id);
      
      // Call onTimerStart if this is the first activity in the timeline
      if (timelineEntries.length === 0) {
        onTimerStart?.();
      }
    } else if (currentActivity) {
      // If we're deselecting the current activity, complete it
      completeActivity(currentActivity.id);
      completeCurrentTimelineEntry();
      setCurrentActivity(null);
    }
  }, [
    currentActivity, 
    timelineEntries.length, 
    addActivity, 
    completeActivity, 
    completeCurrentTimelineEntry,
    addTimelineEntry, 
    startActivity, 
    onTimerStart
  ]);

  const handleActivityRemoval = useCallback((activityId: string) => {
    // Check if this activity has already been used in the timeline
    const activityInTimeline = timelineEntries.some(entry => entry.activityId === activityId);
    if (activityInTimeline) {
      return; // Don't remove activities that are already in the timeline
    }

    // Clear current activity if it's being removed
    if (currentActivity?.id === activityId) {
      setCurrentActivity(null);
    }

    // Remove the activity from the state machine
    removeActivity(activityId);
  }, [currentActivity, timelineEntries, removeActivity]);

  // Use the state machine's isCompleted method to update allActivitiesCompleted state
  useEffect(() => {
    const checkCompleted = () => {
      if (currentActivity) {
        // If there's a current activity, we're not completed
        setAllActivitiesCompleted(false);
        return;
      }
      const isCompleted = isActivitiesCompleted();
      if (isCompleted !== allActivitiesCompleted) {
        setAllActivitiesCompleted(isCompleted);
      }
    };
    
    // Check completion status after any state changes
    checkCompleted();
  }, [
    isActivitiesCompleted,
    allActivitiesCompleted,
    currentActivity, // Add currentActivity as a dependency
    activities,
    allActivityIds,
    startedActivityIds,
    completedActivityIds,
    removedActivityIds,
    hasActuallyStartedActivity
  ]);

  // Simplified method that uses the state machine directly
  const checkActivitiesCompleted = useCallback(() => {
    const isCompleted = isActivitiesCompleted();
    setAllActivitiesCompleted(isCompleted);
    return isCompleted;
  }, [isActivitiesCompleted]);

  const resetActivities = useCallback(() => {
    resetActivityTracking();
    resetTimelineEntries();
    setCurrentActivity(null);
    setAllActivitiesCompleted(false);
  }, [resetActivityTracking, resetTimelineEntries]);

  // Get the current activity state from the state machine
  const getCurrentActivityStateDetails = useCallback((): ActivityState | null => {
    return getCurrentActivityState();
  }, [getCurrentActivityState]);

  return {
    currentActivity,
    timelineEntries,
    activities,
    completedActivityIds,
    allActivitiesCompleted,
    handleActivitySelect,
    handleActivityRemoval,
    checkActivitiesCompleted,
    resetActivities,
    // New method to get current activity state
    getCurrentActivityStateDetails,
    // Method to get state of a specific activity
    getActivityState
  };
}