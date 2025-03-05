import { useState, useCallback } from 'react';
import { Activity } from '@/components/ActivityManager';

export interface TimelineEntry {
  id: string;
  activityId: string | null;
  activityName: string | null;
  startTime: number;
  endTime: number | null;
  colors?: {
    background: string;
    border: string;
    text: string;
  };
}

export interface UseActivityStateProps {
  onTimerStart?: () => void;
}

export function useActivityState({ onTimerStart }: UseActivityStateProps = {}) {
  const [currentActivity, setCurrentActivity] = useState<Activity | null>(null);
  const [timelineEntries, setTimelineEntries] = useState<TimelineEntry[]>([]);
  const [activities, setActivities] = useState<Set<string>>(new Set());
  const [completedActivityIds, setCompletedActivityIds] = useState<string[]>([]);
  const [removedActivityIds, setRemovedActivityIds] = useState<string[]>([]);
  const [allActivitiesCompleted, setAllActivitiesCompleted] = useState(false);

  // Check completion status of activities
  const checkActivitiesCompleted = useCallback(() => {
    const activityArray = Array.from(activities);
    const handledActivities = new Set([...completedActivityIds, ...removedActivityIds]);
    const trackedActivities = new Set([...activityArray, ...completedActivityIds, ...removedActivityIds]);
    
    // Consider all activities completed if:
    // 1. All tracked activities have been either completed or removed
    // 2. We have no remaining activities but have handled some in the past
    if (activityArray.length === 0 && handledActivities.size > 0) {
      // Make sure all activities that were ever tracked are handled
      const allTrackedHandled = Array.from(trackedActivities).every(id => 
        handledActivities.has(id)
      );
      
      if (allTrackedHandled) {
        setAllActivitiesCompleted(true);
        return true;
      }
    }

    // If we still have activities, they must all be handled and no activity running
    if (activityArray.length > 0) {
      const allHandled = activityArray.every(id => handledActivities.has(id));
      
      if (allHandled && !currentActivity) {
        setAllActivitiesCompleted(true);
        return true;
      }
    }

    return false;
  }, [activities, completedActivityIds, removedActivityIds, currentActivity]);

  const handleActivitySelect = useCallback((activity: Activity | null) => {
    // If this is an activity (not null), track it
    if (activity) {
      setActivities(prev => new Set(prev).add(activity.id));
    }

    if (currentActivity) {
      // Mark the current activity as completed when setting to null or switching to another activity
      setCompletedActivityIds(prev => [...prev, currentActivity.id]);
      // Remove it from active activities since it's completed
      setActivities(prev => {
        const newActivities = new Set(prev);
        newActivities.delete(currentActivity.id);
        return newActivities;
      });
      
      if (timelineEntries.length > 0) {
        const lastEntry = timelineEntries[timelineEntries.length - 1];
        if (!lastEntry.endTime) {
          const updatedEntries = [...timelineEntries];
          updatedEntries[timelineEntries.length - 1] = {
            ...lastEntry,
            endTime: Date.now()
          };
          setTimelineEntries(updatedEntries);
        }
      }
    }

    setCurrentActivity(activity);
    
    // Only add timeline entry if we're actually starting an activity
    if (activity && (!currentActivity || currentActivity.id !== activity.id)) {
      const newEntry: TimelineEntry = {
        id: Date.now().toString(),
        activityId: activity.id,
        activityName: activity.name,
        startTime: Date.now(),
        endTime: null,
        colors: activity.colors
      };
      setTimelineEntries(prev => [...prev, newEntry]);
      
      // Call onTimerStart if this is the first activity
      if (timelineEntries.length === 0) {
        onTimerStart?.();
      }
    }

    // Check completion status after state updates
    setTimeout(checkActivitiesCompleted, 0);
  }, [currentActivity, timelineEntries, onTimerStart, checkActivitiesCompleted]);

  const handleActivityRemoval = useCallback((activityId: string) => {
    // Complete the current activity if it's being removed
    if (currentActivity?.id === activityId) {
      setCurrentActivity(null);
      setCompletedActivityIds(prev => [...prev, activityId]);
      
      if (timelineEntries.length > 0) {
        const lastEntry = timelineEntries[timelineEntries.length - 1];
        if (!lastEntry.endTime) {
          const updatedEntries = [...timelineEntries];
          updatedEntries[timelineEntries.length - 1] = {
            ...lastEntry,
            endTime: Date.now()
          };
          setTimelineEntries(updatedEntries);
        }
      }
    }

    // Remove from activities and mark as removed
    setActivities(prev => {
      const newActivities = new Set(prev);
      newActivities.delete(activityId);
      return newActivities;
    });
    setRemovedActivityIds(prev => [...prev, activityId]);

    // Check completion status after state updates
    setTimeout(checkActivitiesCompleted, 0);
  }, [currentActivity, timelineEntries, checkActivitiesCompleted]);

  return {
    currentActivity,
    timelineEntries,
    activities,
    completedActivityIds,
    allActivitiesCompleted,
    handleActivitySelect,
    handleActivityRemoval,
    checkActivitiesCompleted
  };
}