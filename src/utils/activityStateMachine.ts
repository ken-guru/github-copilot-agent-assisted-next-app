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
    this.states = new Map<string, ActivityState>();
    this.currentActivityId = null;
  }

  /**
   * Adds a new activity in PENDING state
   * @param id Unique identifier for the activity
   * @throws Error if activity with this ID already exists
   */
  addActivity(id: string): void {
    if (this.states.has(id)) {
      throw new Error(`Activity with ID ${id} already exists`);
    }

    this.states.set(id, {
      id,
      state: 'PENDING'
    });
  }

  /**
   * Transitions an activity to RUNNING state
   * @param id Unique identifier for the activity
   * @throws Error if activity doesn't exist or transition is invalid
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
   * @param id Unique identifier for the activity
   * @throws Error if activity doesn't exist or transition is invalid
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
   * @param id Unique identifier for the activity
   * @throws Error if activity doesn't exist or transition is invalid
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
   * Activities are considered completed when:
   * 1. There are no PENDING or RUNNING activities
   * 2. At least one activity has been COMPLETED
   * 3. All other activities are either COMPLETED or REMOVED
   * @returns Boolean indicating if all activities are completed
   */
  isCompleted(): boolean {
    // Get all activities by state
    const pending = this.getActivitiesByState('PENDING');
    const running = this.getActivitiesByState('RUNNING');
    const completed = this.getActivitiesByState('COMPLETED');
    const removed = this.getActivitiesByState('REMOVED');

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

    // Every activity must be either COMPLETED or REMOVED
    const totalHandled = completed.length + removed.length;
    return totalHandled === allActivities.length;
  }

  /**
   * Checks if any activity has been started
   * @returns Boolean indicating if any activity has been started
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
   * @returns Currently running activity or null
   */
  getCurrentActivity(): ActivityState | null {
    if (!this.currentActivityId) {
      return null;
    }
    
    return this.states.get(this.currentActivityId) || null;
  }

  /**
   * Gets an activity state by ID
   * @param id Activity ID
   * @returns ActivityState or undefined if not found
   */
  getActivityState(id: string): ActivityState | undefined {
    return this.states.get(id);
  }

  /**
   * Gets all activities in a specific state
   * @param state Activity state to filter by
   * @returns Array of activities in the specified state
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
   * @returns Array of all activities
   */
  getAllActivities(): ActivityState[] {
    return Array.from(this.states.values());
  }
}