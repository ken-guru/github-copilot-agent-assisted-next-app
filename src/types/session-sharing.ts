/**
 * Session sharing type definitions
 * @see .kiro/specs/shareable-session-summary/design.md
 */

/**
 * Activity summary for shared sessions (simplified version of Activity)
 */
export interface ActivitySummary {
  id: string;
  name: string;
  duration: number; // Duration in seconds
  colorIndex: number; // For consistent theming
}

/**
 * Skipped activity information for shared sessions
 */
export interface SkippedActivity {
  id: string;
  name: string;
}

/**
 * Timeline entry for shared sessions (simplified version of TimelineEntry)
 */
export interface SharedTimelineEntry {
  id: string;
  activityId: string | null;
  activityName: string | null;
  startTime: number;
  endTime: number | null;
  colorIndex?: number; // Simplified color reference
}

/**
 * Complete session summary data for sharing
 */
export interface SessionSummaryData {
  // Core session metrics
  plannedTime: number; // Total planned duration in seconds
  timeSpent: number; // Actual time spent in seconds
  overtime: number; // Overtime in seconds
  idleTime: number; // Idle time in seconds

  // Activity breakdown
  activities: ActivitySummary[];
  skippedActivities: SkippedActivity[];

  // Timeline data (simplified for sharing)
  timelineEntries: SharedTimelineEntry[];

  // Session metadata
  completedAt: string; // ISO timestamp
  sessionType: 'completed' | 'timeUp';

  // Session relationships
  originalSessionId?: string; // UUID of session this was copied from
  derivedSessionIds?: string[]; // UUIDs of sessions copied from this one
}

/**
 * Metadata for stored sessions
 */
export interface SessionMetadata {
  id: string; // UUID
  createdAt: string; // ISO timestamp
  expiresAt: string; // ISO timestamp (90 days from creation)
  version: string; // Schema version for future migrations
  userAgent?: string; // Optional browser info for analytics
}

/**
 * Complete stored session structure for Vercel Blob
 */
export interface StoredSession {
  sessionData: SessionSummaryData;
  metadata: SessionMetadata;
}

/**
 * API request/response types
 */

/**
 * Request to share a session
 */
export interface ShareSessionRequest {
  sessionData: SessionSummaryData;
  csrfToken?: string; // CSRF protection
}

/**
 * Response from sharing a session
 */
export interface ShareSessionResponse {
  shareId: string;
  shareUrl: string;
  expiresAt: string;
}

/**
 * Request to retrieve a shared session
 */
export interface GetSessionResponse {
  sessionData: SessionSummaryData;
  metadata: SessionMetadata;
}

/**
 * Request to duplicate a session with linking
 */
export interface DuplicateSessionRequest {
  sourceSessionId: string;
  newSessionData: SessionSummaryData;
  csrfToken?: string; // CSRF protection
}

/**
 * Response from duplicating a session
 */
export interface DuplicateSessionResponse {
  shareId: string;
  shareUrl: string;
  expiresAt: string;
}

/**
 * Activity duplication data for client-side workflow
 */
export interface ActivityDuplicationData {
  activities: ActivitySummary[]; // Activity objects for local storage
  originalSessionId: string; // UUID of source session
  duplicatedAt: string; // ISO timestamp
}

/**
 * Error response structure for API endpoints
 */
export interface SessionSharingError {
  error: string;
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

/**
 * Session sharing component props
 */

/**
 * Props for ShareSessionControls component
 */
export interface ShareSessionControlsProps {
  sessionData: SessionSummaryData;
  isShared: boolean;
  shareUrl?: string;
  onMakeShareable: () => void;
  disabled?: boolean;
}

/**
 * Props for SharedSummary component
 */
export interface SharedSummaryProps {
  sessionData: SessionSummaryData;
  sharedAt: string;
  expiresAt: string;
  onDuplicateActivities: () => void;
}

/**
 * Props for SharedSessionPage component
 */
export interface SharedSessionPageProps {
  params: { uuid: string };
}

/**
 * Session sharing state for components
 */
export type SessionSharingState = 'not_shared' | 'generating' | 'shared' | 'error';

/**
 * Session sharing context type
 */
export interface SessionSharingContext {
  state: SessionSharingState;
  shareUrl?: string;
  error?: string;
  generateShareUrl: (sessionData: SessionSummaryData) => Promise<void>;
  resetState: () => void;
}