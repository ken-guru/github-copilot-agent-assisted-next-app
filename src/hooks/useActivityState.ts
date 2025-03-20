import { useState, useCallback, useMemo } from 'react';
import { Activity } from '../components/ActivityManager';
import { isActivitiesCompleted } from '../utils/activityUtils';

/**
 * Custom hook for managing activity state
 */
export const useActivityState = (onActivitiesCompleted?: () => void) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [currentActivityId, setCurrentActivityId] = useState<string | null>(null);
  const [completedActivityIds, setCompletedActivityIds] = useState<string[]>([]);
  const [allActivityIds, setAllActivityIds] = useState<Set<string>>(new Set());
  const [removedActivityIds, setRemovedActivityIds] = useState<string[]>([]);
  
  // Define handleActivitySelect early to avoid circular reference
  const handleActivitySelect = useCallback((activity: Activity | null, justAdd: boolean = false) => {
    if (activity) {
      if (justAdd) {
        setActivities(prev => {
          // Check if activity with this ID already exists
          const exists = prev.some(a => a.id === activity.id);
          if (!exists) {
            return [...prev, activity];
          }
          return prev;
        });
        
        setAllActivityIds(prev => {
          const newSet = new Set(prev);
          newSet.add(activity.id);
          return newSet;
        });
      } else {
        setCurrentActivityId(activity.id);
      }
    } else {
      // Complete current activity and check if all activities are completed
      if (currentActivityId) {
        setCompletedActivityIds(prev => [...prev, currentActivityId]);
        setCurrentActivityId(null);
        
        // Check after state update if all activities are completed
        setTimeout(() => {
          const isCompleted = isActivitiesCompleted({
            completedActivityIds: [...completedActivityIds, currentActivityId!],
            allActivityIds,
            removedActivityIds
          });
          
          if (isCompleted && onActivitiesCompleted) {
            onActivitiesCompleted();
          }
        }, 0);
      }
    }
  }, [currentActivityId, completedActivityIds, allActivityIds, removedActivityIds, onActivitiesCompleted]);
  
  const addActivity = useCallback((activity: Activity) => {
    setActivities(prev => [...prev, activity]);
    setAllActivityIds(prev => {
      const newSet = new Set(prev);
      newSet.add(activity.id);
      return newSet;
    });
  }, []);
  
  const removeActivity = useCallback((id: string) => {
    setActivities(prev => prev.filter(activity => activity.id !== id));
    setRemovedActivityIds(prev => [...prev, id]);
    
    // Check if the activity being removed is the current one
    if (currentActivityId === id) {
      setCurrentActivityId(null);
    }
    
    // Remove from completed if it's there
    setCompletedActivityIds(prev => prev.filter(activityId => activityId !== id));
    
    // Check after state update if all activities are completed
    setTimeout(() => {
      const isCompleted = isActivitiesCompleted({
        completedActivityIds,
        allActivityIds,
        removedActivityIds: [...removedActivityIds, id]
      });
      
      if (isCompleted && onActivitiesCompleted) {
        onActivitiesCompleted();
      }
    }, 0);
  }, [currentActivityId, completedActivityIds, allActivityIds, removedActivityIds, onActivitiesCompleted]);
  
  const resetActivityTracking = useCallback(() => {
    setActivities([]);
    setCurrentActivityId(null);
    setCompletedActivityIds([]);
    setAllActivityIds(new Set());
    setRemovedActivityIds([]);
  }, []);
  
  // Initialize with default activities if needed
  const initializeActivities = useCallback((defaultActivities: Activity[] = []) => {
    // Reset everything first
    resetActivityTracking();
    
    // Then add each default activity
    defaultActivities.forEach(activity => {
      handleActivitySelect(activity, true);
    });
  }, [resetActivityTracking, handleActivitySelect]);
  
  // Compute if all activities are completed
  const areActivitiesCompleted = useMemo(() => {
    return isActivitiesCompleted({
      completedActivityIds,
      allActivityIds,
      removedActivityIds
    });
  }, [completedActivityIds, allActivityIds, removedActivityIds]);
  
  return {
    activities,
    currentActivityId,
    completedActivityIds,
    initializeActivities,
    handleActivitySelect,
    addActivity,
    removeActivity,
    resetActivityTracking,
    areActivitiesCompleted
  };
};

export default useActivityState;