import { useState, useCallback, useRef } from 'react';
import { ActivityStateMachine, ActivityState } from '@lib/activity/activity-state-machine';

// Determine if we're in a test environment
const isTestEnvironment = process && process.env && process.env.NODE_ENV === 'test';

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
  // New methods for the state machine
  getCurrentActivity: () => ActivityState | null;
  isCompleted: () => boolean;
  getActivityState: (activityId: string) => ActivityState | undefined;
}

/**
 * Hook to manage activities tracking state using ActivityStateMachine
 * This hook is responsible for tracking which activities exist,
 * which have been started, completed, or removed.
 */
export function useActivitiesTracking(): UseActivitiesTrackingResult {
  // State machine to manage activity states
  const stateMachine = useRef(new ActivityStateMachine());
  
  // Activity sets for tracking
  const [activities, setActivities] = useState<Set<string>>(new Set());
  const [allActivityIds, setAllActivityIds] = useState<Set<string>>(new Set());
  const [startedActivityIds, setStartedActivityIds] = useState<Set<string>>(new Set());
  
  // For compatibility with older code that expects arrays
  const [completedActivityIds, setCompletedActivityIds] = useState<string[]>([]);
  const [removedActivityIds, setRemovedActivityIds] = useState<string[]>([]);
  
  // Flag to track if we've actually started any activity
  const [hasActuallyStartedActivity, setHasActuallyStartedActivity] = useState(false);
  
  /**
   * Add a new activity
   */
  const addActivity = useCallback((activityId: string) => {
    // Update state machine
    stateMachine.current.addActivity(activityId);
    
    // Update React state
    setActivities(activities => {
      const newActivities = new Set(activities);
      newActivities.add(activityId);
      return newActivities;
    });
    
    setAllActivityIds(ids => {
      const newIds = new Set(ids);
      newIds.add(activityId);
      return newIds;
    });
  }, []);
  
  /**
   * Start an activity
   */
  const startActivity = useCallback((activityId: string) => {
    // Update state machine
    const success = stateMachine.current.startActivity(activityId);
    
    if (success) {
      // Update React state
      setStartedActivityIds(ids => {
        const newIds = new Set(ids);
        newIds.add(activityId);
        return newIds;
      });
      
      // Mark that we've started at least one activity
      setHasActuallyStartedActivity(true);
      
      // Log for debugging
      if (!isTestEnvironment) {
        console.log(`Started activity: ${activityId}`);
      }
    } else {
      console.warn(`Failed to start activity: ${activityId}`);
    }
  }, []);
  
  /**
   * Complete an activity
   */
  const completeActivity = useCallback((activityId: string) => {
    // Update state machine
    const success = stateMachine.current.completeActivity(activityId);
    
    if (success) {
      // Update React state
      setCompletedActivityIds(ids => {
        if (!ids.includes(activityId)) {
          return [...ids, activityId];
        }
        return ids;
      });
      
      // Log for debugging
      if (!isTestEnvironment) {
        console.log(`Completed activity: ${activityId}`);
      }
    } else {
      console.warn(`Failed to complete activity: ${activityId}`);
    }
  }, []);
  
  /**
   * Remove an activity
   */
  const removeActivity = useCallback((activityId: string) => {
    // Update state machine
    const success = stateMachine.current.removeActivity(activityId);
    
    if (success) {
      // Update React state
      setRemovedActivityIds(ids => {
        if (!ids.includes(activityId)) {
          return [...ids, activityId];
        }
        return ids;
      });
      
      // Log for debugging
      if (!isTestEnvironment) {
        console.log(`Removed activity: ${activityId}`);
      }
    } else {
      console.warn(`Failed to remove activity: ${activityId}`);
    }
  }, []);
  
  /**
   * Reset all activities
   */
  const resetActivities = useCallback(() => {
    // Create a new state machine
    stateMachine.current = new ActivityStateMachine();
    
    // Reset all React state
    setActivities(new Set());
    setAllActivityIds(new Set());
    setStartedActivityIds(new Set());
    setCompletedActivityIds([]);
    setRemovedActivityIds([]);
    setHasActuallyStartedActivity(false);
    
    // Log for debugging
    if (!isTestEnvironment) {
      console.log('Reset all activities');
    }
  }, []);
  
  /**
   * Get currently running activity state
   */
  const getCurrentActivity = useCallback((): ActivityState | null => {
    const runningId = stateMachine.current.getRunningActivityId();
    if (runningId) {
      const state = stateMachine.current.getState(runningId);
      return state || null;
    }
    return null;
  }, []);
  
  /**
   * Check if all activities are completed
   */
  const isCompleted = useCallback((): boolean => {
    return stateMachine.current.isCompleted();
  }, []);
  
  /**
   * Get state for specific activity
   */
  const getActivityState = useCallback((activityId: string): ActivityState | undefined => {
    return stateMachine.current.getState(activityId);
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
    resetActivities,
    getCurrentActivity,
    isCompleted,
    getActivityState
  };
}
