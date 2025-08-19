/**
 * Session sharing utilities
 * @see .kiro/specs/shareable-session-summary/design.md
 */

// Export extraction utilities
export {
  extractSessionData,
  type SummaryDataProps,
} from './extraction';

// Export serialization utilities
export {
  serializeSessionData,
  deserializeSessionData,
  isSessionExpired,
  sessionToJSON,
  sessionFromJSON,
  SerializationError,
} from './serialization';

// Re-export types for convenience
export type {
  SessionSummaryData,
  ActivitySummary,
  SkippedActivity,
  SharedTimelineEntry,
  SessionMetadata,
  StoredSession,
} from '@/types/session-sharing';