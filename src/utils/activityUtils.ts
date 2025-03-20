import { ActivityStateMachine } from './activityStateMachine';

/**
 * @deprecated Use ActivityStateMachine.isCompleted() instead.
 * 
 * Determines if all activities are considered completed based on the current state
 * 
 * Logic rules:
 * 1. If any activity is currently running, not completed
 * 2. If there are available activities (not removed), all must be started and completed
 * 3. If all activities are removed, at least one must have been started and completed
 */
export function isActivitiesCompleted(params: {
  currentActivityRunning: boolean;
  activities: Set<string>;
  allActivityIds: Set<string>;
  startedActivityIds: Set<string>;
  completedActivityIds: string[];
  removedActivityIds: string[];
}): boolean {
  const {
    currentActivityRunning,
    allActivityIds,
    startedActivityIds,
    completedActivityIds,
    removedActivityIds
  } = params;
  
  // Create a temporary state machine to evaluate completion state
  const stateMachine = new ActivityStateMachine();
  
  // If there are no activities, we're not completed
  if (allActivityIds.size === 0) {
    return false;
  }
  
  // Add all activities to the state machine
  for (const id of allActivityIds) {
    try {
      stateMachine.addActivity(id);
      
      // If the activity was started, transition it to RUNNING
      if (startedActivityIds.has(id)) {
        stateMachine.startActivity(id);
        
        // If the activity was completed, transition it to COMPLETED
        if (completedActivityIds.includes(id)) {
          stateMachine.completeActivity(id);
        }
      }
      
      // If the activity was removed, transition it to REMOVED
      if (removedActivityIds.includes(id)) {
        // Only PENDING or RUNNING activities can be removed
        const state = stateMachine.getActivityState(id);
        if (state && (state.state === 'PENDING' || state.state === 'RUNNING')) {
          stateMachine.removeActivity(id);
        }
      }
    } catch (error) {
      console.warn(`Error in isActivitiesCompleted: ${error}`);
    }
  }
  
  // If there's a current activity running, we're not completed
  if (currentActivityRunning) {
    return false;
  }
  
  // Special case: if all activities are removed without any being started,
  // we should consider it not completed
  if (removedActivityIds.length === allActivityIds.size && startedActivityIds.size === 0) {
    return false;
  }
  
  // Use the state machine to determine if all activities are completed
  return stateMachine.isCompleted();
}