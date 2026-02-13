/**
 * Activity State Machine
 * Shared business logic for managing activity state transitions
 * 
 * Valid transitions:
 * - PENDING -> RUNNING -> COMPLETED
 * - PENDING -> RUNNING -> REMOVED
 * - PENDING -> REMOVED
 */

import type { ActivityState, ActivityStateType } from '@mr-timely/types';

export class ActivityStateMachine {
  private states: Map<string, ActivityState>;
  private currentActivityId: string | null;

  constructor() {
    this.states = new Map<string, ActivityState>();
    this.currentActivityId = null;
  }

  /**
   * Restores an activity from REMOVED back to PENDING state
   */
  restoreActivity(id: string): void {
    const activity = this.states.get(id);

    if (!activity) {
      throw new Error(`Activity with ID ${id} not found`);
    }

    if (activity.state !== 'REMOVED') {
      throw new Error(`Cannot restore activity ${id} from ${activity.state} state`);
    }

    this.states.set(id, {
      ...activity,
      state: 'PENDING',
      removedAt: undefined
    });
  }

  /**
   * Adds a new activity in PENDING state
   */
  addActivity(id: string, throwOnExisting: boolean = true): boolean {
    if (this.states.has(id)) {
      if (throwOnExisting) {
        throw new Error(`Activity with ID ${id} already exists`);
      }
      return false;
    }

    this.states.set(id, {
      id,
      state: 'PENDING'
    });
    return true;
  }

  /**
   * Transitions an activity to RUNNING state
   * Automatically completes any currently running activity
   */
  startActivity(id: string): void {
    const activity = this.states.get(id);
    
    if (!activity) {
      throw new Error(`Activity with ID ${id} not found`);
    }
    
    if (activity.state !== 'PENDING') {
      throw new Error(`Cannot start activity ${id} from ${activity.state} state`);
    }

    // If there's a current activity in RUNNING state, complete it first
    if (this.currentActivityId && this.currentActivityId !== id) {
      const currentActivity = this.states.get(this.currentActivityId);
      if (currentActivity && currentActivity.state === 'RUNNING') {
        this.completeActivity(this.currentActivityId);
      }
    }

    // Update the activity state
    this.states.set(id, {
      ...activity,
      state: 'RUNNING',
      startedAt: Date.now()
    });
    
    // Set as current activity
    this.currentActivityId = id;
  }

  /**
   * Transitions an activity to COMPLETED state
   */
  completeActivity(id: string): void {
    const activity = this.states.get(id);
    
    if (!activity) {
      throw new Error(`Activity with ID ${id} not found`);
    }
    
    if (activity.state !== 'RUNNING') {
      throw new Error(`Cannot complete activity ${id} from ${activity.state} state`);
    }

    // Update the activity state
    this.states.set(id, {
      ...activity,
      state: 'COMPLETED',
      completedAt: Date.now()
    });
    
    // Clear current activity if it was the one completed
    if (this.currentActivityId === id) {
      this.currentActivityId = null;
    }
  }

  /**
   * Transitions an activity to REMOVED state
   */
  removeActivity(id: string): void {
    const activity = this.states.get(id);
    
    if (!activity) {
      throw new Error(`Activity with ID ${id} not found`);
    }
    
    // Allow removal from PENDING or RUNNING states only
    if (activity.state !== 'PENDING' && activity.state !== 'RUNNING') {
      throw new Error(`Cannot remove activity ${id} from ${activity.state} state`);
    }

    // Update the activity state
    this.states.set(id, {
      ...activity,
      state: 'REMOVED',
      removedAt: Date.now()
    });
    
    // Clear current activity if it was the one removed
    if (this.currentActivityId === id) {
      this.currentActivityId = null;
    }
  }

  /**
   * Resets the state machine
   */
  reset(): void {
    this.states.clear();
    this.currentActivityId = null;
  }

  /**
   * Checks if all activities are completed
   */
  isCompleted(): boolean {
    const pending = this.getActivitiesByState('PENDING');
    const running = this.getActivitiesByState('RUNNING');
    const completed = this.getActivitiesByState('COMPLETED');

    // If there are pending or running activities, not completed
    if (pending.length > 0 || running.length > 0) {
      return false;
    }

    // Must have at least one activity
    const allActivities = this.getAllActivities();
    if (allActivities.length === 0) {
      return false;
    }

    // Must have at least one completed activity
    if (completed.length === 0) {
      return false;
    }

    return true;
  }

  /**
   * Checks if any activity has been started
   */
  hasStartedAny(): boolean {
    for (const activity of this.states.values()) {
      if (activity.startedAt) {
        return true;
      }
    }
    return false;
  }

  /**
   * Gets the current running activity
   */
  getCurrentActivity(): ActivityState | null {
    if (!this.currentActivityId) {
      return null;
    }
    
    return this.states.get(this.currentActivityId) || null;
  }

  /**
   * Gets an activity state by ID
   */
  getActivityState(id: string): ActivityState | undefined {
    return this.states.get(id);
  }

  /**
   * Gets all activities in a specific state
   */
  getActivitiesByState(state: ActivityStateType): ActivityState[] {
    const result: ActivityState[] = [];
    
    for (const activity of this.states.values()) {
      if (activity.state === state) {
        result.push(activity);
      }
    }
    
    return result;
  }

  /**
   * Gets all activities
   */
  getAllActivities(): ActivityState[] {
    return Array.from(this.states.values());
  }
}
