import { useState, useCallback, useRef } from 'react';
import { ActivityStateMachine, ActivityState } from '@/utils/activityStateMachine';

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
  const stateMachine = useRef(new ActivityStateMachine()).current;
  
  // Local state for compatibility with existing API
  const [activities, setActivities] = useState<Set<string>>(new Set());
  const [completedActivityIds, setCompletedActivityIds] = useState<string[]>([]);
  const [removedActivityIds, setRemovedActivityIds] = useState<string[]>([]);
  const [hasActuallyStartedActivity, setHasActuallyStartedActivity] = useState(false);
  const [startedActivityIds, setStartedActivityIds] = useState<Set<string>>(new Set());
  const [allActivityIds, setAllActivityIds] = useState<Set<string>>(new Set());
  
  // Helper to update local state from state machine
  const updateLocalStateFromMachine = useCallback(() => {
    // Get all activities in various states
    const pendingActivities = stateMachine.getActivitiesByState('PENDING');
    const runningActivities = stateMachine.getActivitiesByState('RUNNING');
    const completedActivities = stateMachine.getActivitiesByState('COMPLETED');
    const removedActivities = stateMachine.getActivitiesByState('REMOVED');
    
    // Update activity collections
    const activeIds = new Set([
      ...pendingActivities.map(a => a.id),
      ...runningActivities.map(a => a.id)
    ]);
    setActivities(activeIds);
    
    // Update allActivityIds
    const allIds = new Set([
      ...pendingActivities.map(a => a.id),
      ...runningActivities.map(a => a.id),
      ...completedActivities.map(a => a.id),
      ...removedActivities.map(a => a.id)
    ]);
    setAllActivityIds(allIds);
    
    // Update startedActivityIds
    const startedIds = new Set([
      ...runningActivities.map(a => a.id),
      ...completedActivities.map(a => a.id),
      ...removedActivities.filter(a => a.startedAt).map(a => a.id)
    ]);
    setStartedActivityIds(startedIds);
    
    // Update completedActivityIds
    setCompletedActivityIds(completedActivities.map(a => a.id));
    
    // Update removedActivityIds
    setRemovedActivityIds(removedActivities.map(a => a.id));
    
    // Update hasActuallyStartedActivity
    setHasActuallyStartedActivity(stateMachine.hasStartedAny());
  }, [stateMachine]);
  
  const addActivity = useCallback((activityId: string) => {
    try {
      // Use the modified addActivity method with throwOnExisting=false in non-test environments
      // This will prevent errors from being thrown when adding duplicate activities
      const added = stateMachine.addActivity(
        activityId, 
        isTestEnvironment // Only throw errors in test environments
      );
      
      // If activity was added (wasn't a duplicate), update local state
      if (added) {
        updateLocalStateFromMachine();
      }
    } catch (error) {
      if (!isTestEnvironment) {
        console.warn(`Failed to add activity ${activityId}:`, error);
      }
    }
  }, [stateMachine, updateLocalStateFromMachine]);
  
  const startActivity = useCallback((activityId: string) => {
    try {
      const currentState = stateMachine.getActivityState(activityId);
      
      // If activity is already in the desired state or can't be started, just return
      if (currentState?.state === 'RUNNING' || 
          currentState?.state === 'COMPLETED' ||
          currentState?.state === 'REMOVED') {
        if (!isTestEnvironment) {
          console.warn(`Cannot start activity ${activityId} from ${currentState.state} state`);
        }
        return;
      }
      
      // Add the activity if it doesn't exist yet
      if (!currentState) {
        try {
          stateMachine.addActivity(activityId);
        } catch (error) {
          if (!isTestEnvironment) {
            console.warn(`Failed to add activity ${activityId} before starting:`, error);
          }
          return;
        }
      }
      
      stateMachine.startActivity(activityId);
      updateLocalStateFromMachine();
    } catch (error) {
      if (!isTestEnvironment) {
        console.warn(`Failed to start activity ${activityId}:`, error);
      }
      
      // If activity doesn't exist yet, add it first and try again
      if (error instanceof Error && error.message.includes('not found')) {
        try {
          stateMachine.addActivity(activityId);
          stateMachine.startActivity(activityId);
          updateLocalStateFromMachine();
        } catch (innerError) {
          if (!isTestEnvironment) {
            console.error(`Failed to add and start activity ${activityId}:`, innerError);
          }
        }
      }
    }
  }, [stateMachine, updateLocalStateFromMachine]);
  
  const completeActivity = useCallback((activityId: string) => {
    try {
      // Get current state of the activity
      const activityState = stateMachine.getActivityState(activityId);
      
      if (!activityState) {
        // If activity doesn't exist yet, add it first
        try {
          stateMachine.addActivity(activityId);
        } catch (error) {
          if (!isTestEnvironment) {
            console.warn(`Failed to add activity ${activityId} before completing:`, error);
          }
        }
      }
      
      // Try to get the activity state again after potentially adding it
      const updatedState = stateMachine.getActivityState(activityId);
      if (!updatedState) {
        if (!isTestEnvironment) {
          console.warn(`Cannot complete non-existent activity ${activityId}`);
        }
        return;
      }
      
      // If activity is already completed, just return
      if (updatedState.state === 'COMPLETED') {
        return;
      }
      
      // If activity is PENDING, start it first to maintain the valid transition
      if (updatedState.state === 'PENDING') {
        try {
          stateMachine.startActivity(activityId);
        } catch (error) {
          if (!isTestEnvironment) {
            console.warn(`Failed to start activity ${activityId} before completing:`, error);
          }
          return;
        }
      }
      
      // Only complete if in RUNNING state and make sure to update state immediately
      if (updatedState.state === 'RUNNING' || stateMachine.getActivityState(activityId)?.state === 'RUNNING') {
        try {
          stateMachine.completeActivity(activityId);
          updateLocalStateFromMachine(); // Update state immediately after completion
        } catch (error) {
          if (!isTestEnvironment) {
            console.warn(`Failed to complete activity ${activityId}:`, error);
          }
        }
      }
      
      updateLocalStateFromMachine(); // Final state update
    } catch (error) {
      if (!isTestEnvironment) {
        console.warn(`Error in completeActivity for ${activityId}:`, error);
      }
    }
  }, [stateMachine, updateLocalStateFromMachine]);
  
  const removeActivity = useCallback((activityId: string) => {
    try {
      const activityState = stateMachine.getActivityState(activityId);
      
      if (!activityState) {
        if (!isTestEnvironment) {
          console.warn(`Cannot remove non-existent activity ${activityId}`);
        }
        return;
      }
      
      // Only PENDING or RUNNING activities can be removed
      if (activityState.state === 'PENDING' || activityState.state === 'RUNNING') {
        stateMachine.removeActivity(activityId);
        updateLocalStateFromMachine(); // Update state immediately after removal
      }
    } catch (error) {
      if (!isTestEnvironment) {
        console.warn(`Failed to remove activity ${activityId}:`, error);
      }
    }
  }, [stateMachine, updateLocalStateFromMachine]);

  const resetActivities = useCallback(() => {
    stateMachine.reset();
    updateLocalStateFromMachine();
  }, [stateMachine, updateLocalStateFromMachine]);
  
  // New methods that directly use the state machine
  const getCurrentActivity = useCallback(() => {
    return stateMachine.getCurrentActivity();
  }, [stateMachine]);
  
  const isCompleted = useCallback(() => {
    return stateMachine.isCompleted();
  }, [stateMachine]);
  
  const getActivityState = useCallback((activityId: string) => {
    return stateMachine.getActivityState(activityId);
  }, [stateMachine]);
  
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
    // New methods
    getCurrentActivity,
    isCompleted,
    getActivityState
  };
}