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

import { ActivityState, ActivityStatusType } from '@/types/activities';

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
      state: 'PENDING',
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
   * 2. At least one activity has been COMPLETED, or all activities have been REMOVED
   * @returns Boolean indicating if all activities are completed
   */
  isCompleted(): boolean {
    // Get all activities
    const activities = Array.from(this.states.values());
    
    // If there are no activities, we're not completed
    if (activities.length === 0) {
      return false;
    }

    // Check if any activities are still PENDING or RUNNING
    const hasIncompleteActivities = activities.some(
      activity => activity.state === 'PENDING' || activity.state === 'RUNNING'
    );
    if (hasIncompleteActivities) {
      return false;
    }

    // All activities must be either COMPLETED or REMOVED
    const isAllCompletedOrRemoved = activities.every(
      activity => activity.state === 'COMPLETED' || activity.state === 'REMOVED'
    );

    // We're completed if we either have at least one COMPLETED activity,
    // or if all activities have been REMOVED
    const hasCompletedActivity = activities.some(
      activity => activity.state === 'COMPLETED'
    );
    const allActivitiesRemoved = activities.every(
      activity => activity.state === 'REMOVED'
    );

    return isAllCompletedOrRemoved && (hasCompletedActivity || allActivitiesRemoved);
  }

  /**
   * Checks if any activity has been started
   * @returns Boolean indicating if any activity has been started
   */
  hasStartedAny(): boolean {
    return Array.from(this.states.values()).some(
      activity => activity.startedAt !== undefined
    );
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
  getActivitiesByState(state: ActivityStatusType): ActivityState[] {
    return Array.from(this.states.values()).filter(
      activity => activity.state === state
    );
  }

  /**
   * Gets all activities
   * @returns Array of all activities
   */
  getAllActivities(): ActivityState[] {
    return Array.from(this.states.values());
  }
}