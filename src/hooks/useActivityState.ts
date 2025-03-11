import { useState, useCallback, useEffect } from 'react';
import { Activity } from '@/components/ActivityManager';
import { useActivitiesTracking } from './useActivitiesTracking';
import { useTimelineEntries, TimelineEntry } from './useTimelineEntries';
import { isActivitiesCompleted } from '@/utils/activityUtils';

export { TimelineEntry } from './useTimelineEntries';

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
    resetActivities: resetActivityTracking
  } = useActivitiesTracking();

  const {
    timelineEntries,
    addTimelineEntry,
    completeCurrentTimelineEntry,
    resetTimelineEntries
  } = useTimelineEntries();

  const handleActivitySelect = useCallback((activity: Activity | null) => {
    if (activity) {
      addActivity(activity.id);
    }

    if (currentActivity) {
      completeActivity(currentActivity.id);
      completeCurrentTimelineEntry();
    }

    setCurrentActivity(activity);

    if (activity && (!currentActivity || currentActivity.id !== activity.id)) {
      addTimelineEntry(activity);
      startActivity(activity.id);
      
      if (timelineEntries.length === 0) {
        onTimerStart?.();
      }
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
    const activityInTimeline = timelineEntries.some(entry => entry.activityId === activityId);
    if (activityInTimeline) {
      return;
    }

    if (currentActivity?.id === activityId) {
      setCurrentActivity(null);
    }

    removeActivity(activityId);
  }, [currentActivity, timelineEntries, removeActivity]);

  // Check if all activities are completed
  useEffect(() => {
    const isCompleted = isActivitiesCompleted({
      currentActivityRunning: currentActivity !== null,
      activities,
      allActivityIds,
      startedActivityIds,
      completedActivityIds,
      removedActivityIds,
      hasActuallyStartedActivity
    });

    setAllActivitiesCompleted(isCompleted);
  }, [
    currentActivity,
    activities,
    allActivityIds,
    startedActivityIds,
    completedActivityIds,
    removedActivityIds,
    hasActuallyStartedActivity
  ]);

  const checkActivitiesCompleted = useCallback(() => {
    const handledIds = new Set([...completedActivityIds, ...removedActivityIds]);
    
    if (handledIds.size > 0 && activities.size === 0 && !currentActivity) {
      setAllActivitiesCompleted(true);
      return true;
    }

    return false;
  }, [activities, completedActivityIds, removedActivityIds, currentActivity]);

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
    resetActivities
  };
}