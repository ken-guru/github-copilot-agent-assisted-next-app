import { ActivityStateMachine } from './activity-state-machine';

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
  
  // If any activity is running, not completed
  if (currentActivityRunning) {
    return false;
  }

  // No activities at all
  if (allActivityIds.size === 0) {
    return false;
  }
  
  // Check completion state
  const availableActivityIds = Array.from(allActivityIds)
    .filter(id => !removedActivityIds.includes(id));
    
  // If we have activities that weren't removed
  if (availableActivityIds.length > 0) {
    // All activities must be started and completed
    for (const id of availableActivityIds) {
      if (!startedActivityIds.has(id) || !completedActivityIds.includes(id)) {
        return false;
      }
    }
    
    return true;
  }
  
  // All activities were removed, at least one must have been started and completed
  return startedActivityIds.size > 0 && completedActivityIds.length > 0;
}
