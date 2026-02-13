/**
 * Activity State Types
 * Core state machine types for activity management
 */
export type ActivityStateType = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'REMOVED';

/**
 * Activity Interface
 * Represents a trackable activity with state management
 */
export interface Activity {
  id: string;
  name: string;
  description?: string;
  state: ActivityStateType;
  colors: ColorSet;
  startTime?: number;
  endTime?: number;
  createdAt: string;
}

/**
 * Color Set for Activity Visualization
 */
export interface ColorSet {
  primary: string;
  secondary: string;
  border: string;
  text: string;
}

/**
 * Activity State for State Machine
 */
export interface ActivityState {
  id: string;
  state: ActivityStateType;
  startedAt?: number;
  completedAt?: number;
  removedAt?: number;
}

/**
 * Timeline Entry Interface
 */
export interface TimelineEntry {
  id: string;
  activityId: string;
  activityName: string;
  startTime: number;
  endTime?: number;
  colors: ColorSet;
}
