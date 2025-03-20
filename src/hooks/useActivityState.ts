import { useState, useCallback, useEffect } from 'react';
import { Activity } from '@/components/ActivityManager';
import { useTimelineEntries } from './useTimelineEntries';
import { isActivitiesCompleted } from '@/utils/activityUtils';

export interface UseActivityStateProps {
  onTimerStart?: () => void;
}

/**
 * Main hook for activity state management
 * Combines activity tracking and timeline entries
 */
export function useActivityState({ onTimerStart }: UseActivityStateProps = {}) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [currentActivity, setCurrentActivity] = useState<Activity | null>(null);
  const [completedActivityIds, setCompletedActivityIds] = useState<string[]>([]);
  const [allActivityIds, setAllActivityIds] = useState<Set<string>>(new Set());
  const [removedActivityIds, setRemovedActivityIds] = useState<string[]>([]);
  const [startedActivityIds, setStartedActivityIds] = useState<Set<string>>(new Set());
  const [allActivitiesCompleted, setAllActivitiesCompleted] = useState(false);
  
  const {
    timelineEntries,
    addTimelineEntry,
    completeCurrentTimelineEntry,
    resetTimelineEntries
  } = useTimelineEntries();

  // Define handleActivitySelect first since it's used by other functions
  const handleActivitySelect = useCallback((activity: Activity | null, justAdd: boolean = false) => {
    if (activity) {
      if (justAdd) {
        setActivities(prev => {
          if (prev.some(a => a.id === activity.id)) return prev;
          return [...prev, activity];
        });
        
        setAllActivityIds(prev => {
          const newSet = new Set(prev);
          newSet.add(activity.id);
          return newSet;
        });
      } else {
        if (currentActivity) {
          setCompletedActivityIds(prev => [...prev, currentActivity.id]);
          completeCurrentTimelineEntry();
        }
        
        setCurrentActivity(activity);
        setStartedActivityIds(prev => {
          const newSet = new Set(prev);
          newSet.add(activity.id);
          return newSet;
        });
        addTimelineEntry(activity);
        
        if (!currentActivity && timelineEntries.length === 0) {
          onTimerStart?.();
        }
      }
    } else if (currentActivity) {
      setCompletedActivityIds(prev => [...prev, currentActivity.id]);
      completeCurrentTimelineEntry();
      setCurrentActivity(null);
      
      // Check completion status after state updates
      setTimeout(() => {
        checkActivitiesCompleted();
      }, 0);
    }
  }, [currentActivity, timelineEntries.length, addTimelineEntry, completeCurrentTimelineEntry, onTimerStart]);

  const handleActivityRemoval = useCallback((activityId: string) => {
    if (currentActivity?.id === activityId) {
      return;
    }
    
    setActivities(prev => prev.filter(a => a.id !== activityId));
    setRemovedActivityIds(prev => [...prev, activityId]);
    setCompletedActivityIds(prev => prev.filter(id => id !== activityId));
    
    setTimeout(() => {
      checkActivitiesCompleted();
    }, 0);
  }, [currentActivity]);

  // Define reset function before it's used in initializeActivities
  const resetActivities = useCallback(() => {
    setActivities([]);
    setCurrentActivity(null);
    setCompletedActivityIds([]);
    setAllActivityIds(new Set());
    setRemovedActivityIds([]);
    setStartedActivityIds(new Set());
    resetTimelineEntries();
    setAllActivitiesCompleted(false);
  }, [resetTimelineEntries]);

  // Now we can safely use resetActivities in initializeActivities
  const initializeActivities = useCallback((defaultActivities: Activity[] = []) => {
    resetActivities();
    defaultActivities.forEach(activity => {
      handleActivitySelect(activity, true);
    });
  }, [handleActivitySelect, resetActivities]);

  const checkActivitiesCompleted = useCallback(() => {
    if (currentActivity) {
      setAllActivitiesCompleted(false);
      return false;
    }
    
    if (allActivityIds.size === 0) {
      setAllActivitiesCompleted(false);
      return false;
    }
    
    // Calculate remaining activities (not removed)
    const remainingActivities = Array.from(allActivityIds).filter(
      id => !removedActivityIds.includes(id)
    );
    
    // If all activities were removed and none were started, not complete
    if (remainingActivities.length === 0 && startedActivityIds.size === 0) {
      setAllActivitiesCompleted(false);
      return false;
    }
    
    // If there are remaining activities, they must all be completed
    if (remainingActivities.length > 0) {
      const allRemaining = remainingActivities.every(
        id => completedActivityIds.includes(id)
      );
      
      // Only mark as completed if at least one activity was started
      if (allRemaining && startedActivityIds.size > 0) {
        setAllActivitiesCompleted(true);
        return true;
      }
    } else if (startedActivityIds.size > 0) {
      // If no remaining activities but some were started and completed
      setAllActivitiesCompleted(true);
      return true;
    }
    
    setAllActivitiesCompleted(false);
    return false;
  }, [currentActivity, allActivityIds, removedActivityIds, completedActivityIds, startedActivityIds]);

  useEffect(() => {
    checkActivitiesCompleted();
  }, [
    checkActivitiesCompleted,
    currentActivity, 
    activities, 
    completedActivityIds,
    allActivityIds,
    removedActivityIds,
    startedActivityIds
  ]);

  return {
    activities,
    currentActivity,
    timelineEntries,
    completedActivityIds,
    allActivitiesCompleted,
    handleActivitySelect,
    handleActivityRemoval,
    checkActivitiesCompleted,
    resetActivities,
    initializeActivities
  };
}