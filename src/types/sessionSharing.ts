export interface ActivitySummary {
  id: string;
  name: string;
  duration: number; // seconds
  colorIndex: number;
  colors?: {
    background: string;
    text: string;
    border: string;
  } | {
    light: { background: string; text: string; border: string };
    dark: { background: string; text: string; border: string };
  };
}

export interface SkippedActivity {
  id: string;
  name: string;
}

export interface SharedTimelineEntry {
  id: string;
  activityId: string | null;
  activityName: string | null;
  startTime: number; // epoch ms
  endTime: number | null; // epoch ms or null
  colorIndex?: number;
  colors?: {
    background: string;
    text: string;
    border: string;
  } | {
    light: { background: string; text: string; border: string };
    dark: { background: string; text: string; border: string };
  };
}

export type SessionType = 'completed' | 'timeUp';

export interface SessionSummaryData {
  plannedTime: number; // seconds
  timeSpent: number; // seconds
  overtime: number; // seconds
  idleTime: number; // seconds

  activities: ActivitySummary[];
  skippedActivities: SkippedActivity[];
  timelineEntries: SharedTimelineEntry[];

  completedAt: string; // ISO
  sessionType: SessionType;

  originalSessionId?: string;
  derivedSessionIds?: string[];
}

export interface SessionMetadata {
  id: string; // uuid
  createdAt: string; // ISO
  expiresAt: string; // ISO
  version: string;
  userAgent?: string;
}

export interface StoredSession {
  sessionData: SessionSummaryData;
  metadata: SessionMetadata;
}
