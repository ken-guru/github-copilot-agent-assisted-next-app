/**
 * Application type definitions
 */

/**
 * Represents a timeline entry for activities
 * This is the comprehensive interface with all possible fields
 * Some fields are optional depending on usage context
 */
export interface TimelineEntry {
  /** Unique identifier for the timeline entry */
  id: string;
  
  /** ID of the associated activity, or null if this is a break */
  activityId: string | null;
  
  /** Display name of the activity, or null if this is a break */
  activityName?: string | null;
  
  /** Legacy/alternative field: title of the entry (some components use this instead of activityName) */
  title?: string;
  
  /** Legacy/alternative field: description of the entry */
  description?: string;
  
  /** Timestamp when the activity started */
  startTime: number;
  
  /** Timestamp when the activity ended, null if ongoing */
  endTime?: number | null;
  
  /** Visual styling colors for the entry
   * Can be a direct color set or a theme-aware set with light/dark variants
   */
  colors?: {
    /** Background color for the timeline entry */
    background: string;
    /** Text color for the timeline entry */
    text: string;
    /** Border color for the timeline entry */
    border: string;
  } | {
    light: {
      background: string;
      text: string;
      border: string;
    };
    dark: {
      background: string;
      text: string;
      border: string;
    };
  };
}

/**
 * Type guard to check if a timeline entry represents a break.
 * Break entries have both activityId and activityName set to null.
 * 
 * @param entry - The timeline entry to check
 * @returns true if the entry is a break, false otherwise
 */
export function isBreakEntry(entry: TimelineEntry | null | undefined): boolean {
  if (!entry) return false;
  return entry.activityId === null && entry.activityName === null;
}