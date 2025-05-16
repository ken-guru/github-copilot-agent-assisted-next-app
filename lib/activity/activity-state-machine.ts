/**
 * Activity State Machine
 * 
 * This module implements a state machine for managing activity states.
 * Activities can transition through defined states:
 * - PENDING: Initial state for newly created activities
 * - RUNNING: Activity is currently in progress
 * - COMPLETED: Activity has been completed
 * - REMOVED: Activity has been removed
 * 
 * Valid transitions:
 * - PENDING -> RUNNING -> COMPLETED
 * - PENDING -> RUNNING -> REMOVED
 * - PENDING -> REMOVED
 */

export type ActivityStateType = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'REMOVED';

export interface ActivityState {
  id: string;
  state: ActivityStateType;
  startedAt?: number;
  completedAt?: number;
  removedAt?: number;
}

export class ActivityStateMachine {
  private states: Map<string, ActivityState>;
  private currentActivityId: string | null;

  constructor() {
    this.states = new Map();
    this.currentActivityId = null;
  }

  /**
   * Get all activity states
   */
  getAllStates(): ActivityState[] {
    return Array.from(this.states.values());
  }
  
  /**
   * Get state for a specific activity
   */
  getState(activityId: string): ActivityState | undefined {
    return this.states.get(activityId);
  }
  
  /**
   * Add a new activity in PENDING state
   */
  addActivity(activityId: string): void {
    if (!this.states.has(activityId)) {
      this.states.set(activityId, {
        id: activityId,
        state: 'PENDING'
      });
    }
  }
  
  /**
   * Start an activity (transition to RUNNING)
   * @returns False if transition is not valid
   */
  startActivity(activityId: string): boolean {
    const state = this.states.get(activityId);
    
    // Can only start activities in PENDING state
    if (!state || state.state !== 'PENDING') {
      return false;
    }
    
    // Can't start if another activity is running
    if (this.currentActivityId !== null && this.currentActivityId !== activityId) {
      return false;
    }
    
    // Update state
    this.states.set(activityId, {
      ...state,
      state: 'RUNNING',
      startedAt: Date.now()
    });
    
    this.currentActivityId = activityId;
    return true;
  }
  
  /**
   * Complete an activity (transition to COMPLETED)
   * @returns False if transition is not valid
   */
  completeActivity(activityId: string): boolean {
    const state = this.states.get(activityId);
    
    // Can only complete activities in RUNNING state
    if (!state || state.state !== 'RUNNING') {
      return false;
    }
    
    // Must be the current activity
    if (this.currentActivityId !== activityId) {
      return false;
    }
    
    // Update state
    this.states.set(activityId, {
      ...state,
      state: 'COMPLETED',
      completedAt: Date.now()
    });
    
    this.currentActivityId = null;
    return true;
  }
  
  /**
   * Remove an activity (transition to REMOVED)
   * @returns False if transition is not valid
   */
  removeActivity(activityId: string): boolean {
    const state = this.states.get(activityId);
    
    // Can only remove activities in PENDING or RUNNING state
    if (!state || (state.state !== 'PENDING' && state.state !== 'RUNNING')) {
      return false;
    }
    
    // If removing the current activity, clear currentActivityId
    if (this.currentActivityId === activityId) {
      this.currentActivityId = null;
    }
    
    // Update state
    this.states.set(activityId, {
      ...state,
      state: 'REMOVED',
      removedAt: Date.now()
    });
    
    return true;
  }
  
  /**
   * Check if there is a currently running activity
   */
  hasRunningActivity(): boolean {
    return this.currentActivityId !== null;
  }
  
  /**
   * Get currently running activity ID
   */
  getRunningActivityId(): string | null {
    return this.currentActivityId;
  }
  
  /**
   * Get all activity IDs in a specific state
   */
  getActivitiesInState(state: ActivityStateType): string[] {
    const result: string[] = [];
    for (const [id, activityState] of this.states.entries()) {
      if (activityState.state === state) {
        result.push(id);
      }
    }
    return result;
  }
  
  /**
   * Check if all activities are completed according to business rules
   * 
   * Logic:
   * 1. If any activity is currently running, not completed
   * 2. If there are available activities (not removed), all must be completed
   * 3. If all activities are removed, at least one must have been completed
   */
  isCompleted(): boolean {
    // If any activity is running, not completed
    if (this.currentActivityId !== null) {
      return false;
    }
    
    const allActivityIds = Array.from(this.states.keys());
    
    // No activities at all
    if (allActivityIds.length === 0) {
      return false;
    }
    
    const completedActivityIds = this.getActivitiesInState('COMPLETED');
    const removedActivityIds = this.getActivitiesInState('REMOVED');
    const pendingActivityIds = this.getActivitiesInState('PENDING');
    
    // If we have pending activities, not completed
    if (pendingActivityIds.length > 0) {
      return false;
    }
    
    // If everything is removed and nothing completed, not completed
    if (removedActivityIds.length === allActivityIds.length && completedActivityIds.length === 0) {
      return false;
    }
    
    // Either some are completed, or all were removed but some were completed first
    return true;
  }
}
