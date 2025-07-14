/**
 * Re-export types for backwards compatibility with test files
 */

export type { TimelineEntry } from '@hooks/use-timeline-entries';

// Legacy compatibility - export the same interface with old properties added
export interface LegacyTimelineEntry {
  id: string;
  activityId: string;
  title: string;
  description: string;
  startTime: number;
  endTime?: number;
  activityName?: string; // Legacy property for backwards compatibility
  colors?: {
    background?: string;
    text?: string;
    border?: string;
  };
}
