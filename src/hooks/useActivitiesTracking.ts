import { useState, useCallback } from 'react';
import { Activity } from '@/components/ActivityManager';

export interface UseActivitiesTrackingResult {
  activities: Set<string>;
  allActivityIds: Set<string>;
  startedActivityIds: Set<string>;
  completedActivityIds: string[];
  removedActivityIds: string[];
  hasActuallyStartedActivity: boolean;
  addActivity: (activityId: string) => void;
  startActivity: (activityId: string) => void;
  completeActivity: (activityId: string) => void;
  removeActivity: (activityId: string) => void;
  resetActivities: () => void;
}

/**
 * Hook to manage activities tracking state
 * This hook is responsible for tracking which activities exist,
 * which have been started, completed, or removed.
 */
export function useActivitiesTracking(): UseActivitiesTrackingResult {
  const [activities, setActivities] = useState<Set<string>>(new Set());
  const [completedActivityIds, setCompletedActivityIds] = useState<string[]>([]);
  const [removedActivityIds, setRemovedActivityIds] = useState<string[]>([]);
  const [hasActuallyStartedActivity, setHasActuallyStartedActivity] = useState(false);
  const [startedActivityIds, setStartedActivityIds] = useState<Set<string>>(new Set());
  const [allActivityIds, setAllActivityIds] = useState<Set<string>>(new Set());

  const addActivity = useCallback((activityId: string) => {
    setActivities(prev => new Set(prev).add(activityId));
    setAllActivityIds(prev => new Set(prev).add(activityId));
  }, []);

  const startActivity = useCallback((activityId: string) => {
    setStartedActivityIds(prev => {
      const newSet = new Set(prev);
      newSet.add(activityId);
      return newSet;
    });
    setHasActuallyStartedActivity(true);
  }, []);

  const completeActivity = useCallback((activityId: string) => {
    // Check if this activity has been started using Set.has() method
    const hasStarted = startedActivityIds.has(activityId);
    
    if (hasStarted) {
      // If it was started, add to completed activities
      setCompletedActivityIds(prev => {
        if (!prev.includes(activityId)) {
          return [...prev, activityId];
        }
        return prev;
      });
    }
    
    // Always remove from active activities when completing
    setActivities(prev => {
      const newActivities = new Set(prev);
      newActivities.delete(activityId);
      return newActivities;
    });
  }, [startedActivityIds]);

  const removeActivity = useCallback((activityId: string) => {
    setRemovedActivityIds(prev => [...prev, activityId]);
    setActivities(prev => {
      const newActivities = new Set(prev);
      newActivities.delete(activityId);
      return newActivities;
    });
    // Don't modify startedActivityIds or hasActuallyStartedActivity on removal
    // This preserves the history of which activities were started
  }, []);

  const resetActivities = useCallback(() => {
    setActivities(new Set());
    setCompletedActivityIds([]);
    setRemovedActivityIds([]);
    setStartedActivityIds(new Set());
    setAllActivityIds(new Set());
    setHasActuallyStartedActivity(false);
  }, []);

  return {
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
    resetActivities
  };
}