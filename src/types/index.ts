/**
 * Application type definitions
 */

/**
 * Represents a timeline entry for activities
 */
export interface TimelineEntry {
  /** Unique identifier for the timeline entry */
  id: string;
  /** ID of the associated activity */
  activityId: string;
  /** Display name of the activity */
  activityName: string;
  /** Timestamp when the activity started */
  startTime: number;
  /** Timestamp when the activity ended */
  endTime: number;
  /** Visual styling colors for the entry */
  colors: {
    /** Background color for the timeline entry */
    background: string;
    /** Text color for the timeline entry */
    text: string;
    /** Border color for the timeline entry */
    border: string;
  };
}