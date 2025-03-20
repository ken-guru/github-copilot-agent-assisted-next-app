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

  // Initialize activities with ordered activities from Planning state
  const initializeActivities = useCallback((orderedActivities: Activity[]) => {
    // Reset any existing activities
    resetActivityTracking();
    
    // Add each activity to the state machine in the specified order
    orderedActivities.forEach(activity => {
      addActivity(activity.id);
      
      // Just add the activity, don't start it yet
      handleActivitySelect(activity, true);
    });
  }, [resetActivityTracking, addActivity, handleActivitySelect]);

  const handleActivitySelect = useCallback((activity: Activity | null, justAdd: boolean = false) => {
    if (activity) {
      // Add activity to the state machine if it's not already there
      addActivity(activity.id);
      
      // If we're just adding (initializing), don't start the activity
      if (justAdd) {
        return;
      }

      // If there's a current activity, complete it first
      if (currentActivity) {
        completeActivity(currentActivity.id);
        completeCurrentTimelineEntry();
      }

      // Set new activity as current and start it
      setCurrentActivity(activity);
      addTimelineEntry(activity);
      startActivity(activity.id);
      
      // Call onTimerStart if this is the first activity in the timeline
      if (timelineEntries.length === 0) {
        onTimerStart?.();
      }
    } else if (currentActivity) {
      // If we're deselecting the current activity (completing it)
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
    // Only prevent removal of the currently running activity
    if (currentActivity?.id === activityId) {
      return; // Don't remove the currently running activity
    }

    // Remove the activity from the state machine
    removeActivity(activityId);
    setCurrentActivity(prev => prev?.id === activityId ? null : prev);
  }, [currentActivity, removeActivity]);

  // Update allActivitiesCompleted state when relevant state changes
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
    currentActivity,
    activities,
    allActivityIds,
    startedActivityIds,
    completedActivityIds,
    removedActivityIds,
    hasActuallyStartedActivity
  ]);

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
    initializeActivities,
    getCurrentActivityState,
    getActivityState
  };
}