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

  const handleActivitySelect = useCallback((activity: Activity | null) => {
    if (activity) {
      setActivities(prev => new Set(prev).add(activity.id));
    }

    if (currentActivity) {
      setCompletedActivityIds(prev => {
        const newCompleted = [...prev, currentActivity.id];
        setActivities(prevActivities => {
          const newActivities = new Set(prevActivities);
          newActivities.delete(currentActivity.id);
          
          // Check completion inline after state updates
          if (newActivities.size === 0 && !activity) {
            setAllActivitiesCompleted(true);
          }
          
          return newActivities;
        });
        return newCompleted;
      });
      
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
        colors: activity.colors
      };
      setTimelineEntries(prev => [...prev, newEntry]);
      
      if (timelineEntries.length === 0) {
        onTimerStart?.();
      }
    }
  }, [currentActivity, timelineEntries, onTimerStart]);

  const handleActivityRemoval = useCallback((activityId: string) => {
    // Check if this activity appears in the timeline
    const activityInTimeline = timelineEntries.some(entry => entry.activityId === activityId);
    if (activityInTimeline) {
      return; // Don't allow removal of activities that are in the timeline
    }

    if (currentActivity?.id === activityId) {
      setCurrentActivity(null);
    }

    setRemovedActivityIds(prev => {
      const newRemoved = [...prev, activityId];
      setActivities(prevActivities => {
        const newActivities = new Set(prevActivities);
        newActivities.delete(activityId);
        
        // Check completion inline after state updates
        if (newActivities.size === 0 && !currentActivity) {
          setAllActivitiesCompleted(true);
        }
        
        return newActivities;
      });
      return newRemoved;
    });
  }, [currentActivity, timelineEntries]);

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