import { useState, useCallback } from 'react';
import { Activity } from '@components/feature/ActivityManager'; // Updated import path
import { useActivitiesTracking } from './use-activities-tracking';
import { useTimelineEntries } from './use-timeline-entries';
import { ActivityState } from '@lib/activity/activity-state-machine';

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
    getCurrentActivity,
    isCompleted,
    getActivityState
  } = useActivitiesTracking();
  
  const {
    timelineEntries,
    addTimelineEntry,
    resetTimeline
  } = useTimelineEntries();
  
  /**
   * Select and start a new activity
   */
  const selectActivity = useCallback((activity: Activity) => {
    const activityId = activity.id;
    
    // Add to tracking if not exists
    if (!activities.has(activityId)) {
      addActivity(activityId);
    }
    
    // Start the activity
    startActivity(activityId);
    
    // Add timeline entry
    addTimelineEntry({
      activityId,
      startTime: Date.now(),
      title: activity.name,
      description: ''
    });
    
    // Set as current activity
    setCurrentActivity(activity);
    
    // Call the onTimerStart callback if provided
    if (onTimerStart) {
      onTimerStart();
    }
  }, [activities, addActivity, startActivity, addTimelineEntry, setCurrentActivity, onTimerStart]);
  
  /**
   * Mark current activity as completed
   */
  const finishCurrentActivity = useCallback(() => {
    if (currentActivity) {
      const activityId = currentActivity.id;
      
      // Mark as completed in tracking
      completeActivity(activityId);
      
      // Clear current activity
      setCurrentActivity(null);
      
      // Check if all activities are completed
      setAllActivitiesCompleted(isCompleted());
    }
  }, [currentActivity, completeActivity, setCurrentActivity, isCompleted]);
  
  /**
   * Remove an activity from tracking
   */
  const deleteActivity = useCallback((activityId: string) => {
    // Remove from tracking
    removeActivity(activityId);
    
    // If it was the current activity, clear it
    if (currentActivity && currentActivity.id === activityId) {
      setCurrentActivity(null);
    }
    
    // Check if all activities are completed
    setAllActivitiesCompleted(isCompleted());
  }, [currentActivity, removeActivity, isCompleted]);
  
  /**
   * Reset all state
   */
  const resetActivities = useCallback(() => {
    resetActivityTracking();
    resetTimeline();
    setCurrentActivity(null);
    setAllActivitiesCompleted(false);
  }, [resetActivityTracking, resetTimeline]);
  
  return {
    // State
    activities,
    currentActivity,
    allActivitiesCompleted,
    hasActuallyStartedActivity,
    timelineEntries,
    allActivityIds,
    startedActivityIds,
    completedActivityIds,
    removedActivityIds,
    
    // Actions
    selectActivity,
    finishCurrentActivity,
    deleteActivity,
    resetActivities,
    
    // Raw access to activity state
    getCurrentActivity,
    getActivityState
  };
}
