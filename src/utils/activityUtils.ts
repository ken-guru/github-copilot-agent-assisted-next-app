/**
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
  hasActuallyStartedActivity: boolean;
}): boolean {
  const {
    currentActivityRunning,
    activities,
    allActivityIds,
    startedActivityIds,
    completedActivityIds,
    removedActivityIds,
    hasActuallyStartedActivity
  } = params;
  
  // If an activity is running, we're not completed
  if (currentActivityRunning) return false;
  
  // If there are still activities in the set, we're not completed
  if (activities.size > 0) return false;
  
  // Get all non-removed activities
  const availableActivityIds = Array.from(allActivityIds)
    .filter(id => !removedActivityIds.includes(id));

  // If there are available activities, they all must be started and completed
  if (availableActivityIds.length > 0) {
    return availableActivityIds.every(id => 
      startedActivityIds.has(id) && completedActivityIds.includes(id)
    );
  } 
    
  // No remaining activities - we're done if at least one was started and completed
  if (hasActuallyStartedActivity && completedActivityIds.length > 0) {
    return true;
  }
  
  // Check if every activity is either completed or removed
  const allHandled = Array.from(allActivityIds).every(id =>
    completedActivityIds.includes(id) || removedActivityIds.includes(id)
  );
  
  // If all are handled and at least one is completed, we're done
  return allHandled && completedActivityIds.length > 0;
}