import { useState, useCallback, useEffect, useMemo } from 'react';
import { Activity } from '@/components/ActivityManager';
import { generateUniqueId } from '@/utils/timeUtils';
import { getNextAvailableColorSet } from '@/utils/colors';

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
  const [hasActuallyStartedActivity, setHasActuallyStartedActivity] = useState(false);
  const [startedActivityIds, setStartedActivityIds] = useState<Set<string>>(new Set());
  const [allActivityIds, setAllActivityIds] = useState<Set<string>>(new Set());

  const handleActivitySelect = useCallback((activity: Activity | null) => {
    if (activity) {
      setActivities(prev => new Set(prev).add(activity.id));
      setAllActivityIds(prev => new Set(prev).add(activity.id));
    }

    if (currentActivity) {
      // Only mark as completed if actually started
      if (startedActivityIds.has(currentActivity.id)) {
        setCompletedActivityIds(prev => [...prev, currentActivity.id]);
      }
      
      setActivities(prev => {
        const newActivities = new Set(prev);
        newActivities.delete(currentActivity.id);
        return newActivities;
      });

      // Update timeline entry with end time
      if (timelineEntries.length > 0) {
        const lastEntry = timelineEntries[timelineEntries.length - 1];
        if (!lastEntry.endTime) {
          setTimelineEntries(prev => {
            const updatedEntries = [...prev];
            updatedEntries[prev.length - 1] = {
              ...lastEntry,
              endTime: Date.now()
            };
            return updatedEntries;
          });
        }
      }
    }

    setCurrentActivity(activity);

    if (activity && (!currentActivity || currentActivity.id !== activity.id)) {
      const newEntry: TimelineEntry = {
        id: Date.now().toString(),
        activityId: activity.id,
        activityName: activity.name,
        startTime: Date.now(),
        endTime: null,
        colors: getNextAvailableColorSet()
      };
      setTimelineEntries(prev => [...prev, newEntry]);
      
      setStartedActivityIds(prev => {
        const newSet = new Set(prev);
        newSet.add(activity.id);
        return newSet;
      });
      setHasActuallyStartedActivity(true);

      if (timelineEntries.length === 0) {
        onTimerStart?.();
      }
    }
  }, [currentActivity, timelineEntries, onTimerStart, startedActivityIds]);

  const handleActivityRemoval = useCallback((activityId: string) => {
    const activityInTimeline = timelineEntries.some(entry => entry.activityId === activityId);
    if (activityInTimeline) {
      return;
    }

    if (currentActivity?.id === activityId) {
      setCurrentActivity(null);
    }

    setRemovedActivityIds(prev => [...prev, activityId]);
    setActivities(prev => {
      const newActivities = new Set(prev);
      newActivities.delete(activityId);
      return newActivities;
    });

    // Don't modify startedActivityIds or hasActuallyStartedActivity on removal
    // This preserves the history of which activities were started
  }, [currentActivity, timelineEntries]);

  useEffect(() => {
    let isCompleted = false;
    
    // Mark as completed when:
    // 1. No current activities in the set
    // 2. No current activity running
    // 3. If any activities are available (not removed):
    //    - All available activities must be started and completed
    //    - All unstarted activities must be removed
    // 4. If NO activities are available:
    //    - At least one activity must have been started and completed
    if (activities.size === 0 && !currentActivity) {
      // Get all non-removed activities
      const availableActivityIds = Array.from(allActivityIds)
        .filter(id => !removedActivityIds.includes(id));

      // Check completion state based on remaining activities
      if (availableActivityIds.length > 0) {
        // There are remaining activities - they all must be started and completed
        isCompleted = availableActivityIds.every(id => 
          startedActivityIds.has(id) && completedActivityIds.includes(id)
        );
      } else {
        // No remaining activities - we're done if at least one was started and completed
        isCompleted = hasActuallyStartedActivity;
      }
    }

    if (!isCompleted && !currentActivity) {
      // Check if every activity is either completed or removed
      const allHandled = Array.from(allActivityIds).every(id =>
        completedActivityIds.includes(id) || removedActivityIds.includes(id)
      );
      
      // If all are handled and at least one is completed, pull the trigger on done
      if (allHandled && completedActivityIds.length > 0) {
        isCompleted = true;
      }
    }

    setAllActivitiesCompleted(isCompleted);
  }, [
    currentActivity, 
    activities, 
    completedActivityIds,
    removedActivityIds,
    startedActivityIds,
    allActivityIds,
    hasActuallyStartedActivity
  ]);

  const checkActivitiesCompleted = useCallback(() => {
    const activityArray = Array.from(activities);
    const handledIds = new Set([...completedActivityIds, ...removedActivityIds]);
    
    // We're done when:
    // 1. We have handled some activities (to avoid marking as complete when we haven't started)
    // 2. No activities are currently tracked
    // 3. No activity is currently running
    if (handledIds.size > 0 && activityArray.length === 0 && !currentActivity) {
      setAllActivitiesCompleted(true);
      return true;
    }

    return false;
  }, [activities, completedActivityIds, removedActivityIds, currentActivity]);

  const resetActivities = useCallback(() => {
    setActivities(new Set());
    setTimelineEntries([]);
    setCompletedActivityIds([]);
    setRemovedActivityIds([]);
    setCurrentActivity(null);
    setStartedActivityIds(new Set());
    setAllActivityIds(new Set());
    setHasActuallyStartedActivity(false);
  }, []);

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