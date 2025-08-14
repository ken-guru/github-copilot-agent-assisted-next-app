/**
 * Types for session persistence and recovery functionality
 */

import { Activity } from './activity';
import { TimelineEntry } from './index';
import { ActivityState } from '@/utils/activityStateMachine';

/**
 * Interface for persisted session data
 * Contains all necessary state to restore a timer session
 */
export interface PersistedSession {
  /** Unique identifier for the session */
  id: string;
  
  /** ISO timestamp when the session was started */
  startTime: string;
  
  /** Total session duration in seconds */
  totalDuration: number;
  
  /** Elapsed time in seconds when session was saved */
  elapsedTime: number;
  
  /** ID of the currently active activity, null if none */
  currentActivityId: string | null;
  
  /** Whether the timer was active when session was saved */
  timerActive: boolean;
  
  /** Array of all activities in the session */
  activities: Activity[];
  
  /** Array of completed activity IDs */
  completedActivityIds: string[];
  
  /** Array of removed activity IDs */
  removedActivityIds: string[];
  
  /** Timeline entries showing activity history */
  timelineEntries: TimelineEntry[];
  
  /** Activity state machine states for all activities */
  activityStates: ActivityState[];
  
  /** ISO timestamp when the session was last saved */
  lastSaved: string;
  
  /** Version of the persistence format for future compatibility */
  version: number;
}

/**
 * Options for session persistence behavior
 */
export interface SessionPersistenceOptions {
  /** How often to save session data (in milliseconds) */
  saveInterval?: number;
  
  /** Maximum age of session to consider for recovery (in milliseconds) */
  maxRecoveryAge?: number;
  
  /** Whether to automatically save on activity changes */
  autoSaveOnActivity?: boolean;
  
  /** Storage key prefix for session data */
  storageKeyPrefix?: string;
}

/**
 * Result of session recovery detection
 */
export interface SessionRecoveryInfo {
  /** Whether a recoverable session was found */
  hasRecoverableSession: boolean;
  
  /** The persisted session data, if available */
  session?: PersistedSession;
  
  /** Formatted description of the session for display */
  description?: string;
  
  /** Time elapsed in the session for display */
  timeElapsed?: string;
  
  /** Current activity name for display */
  currentActivityName?: string;
}

/**
 * Storage interface for session persistence
 * Allows for different storage implementations (IndexedDB, localStorage)
 */
export interface SessionStorage {
  /** Save session data */
  saveSession(session: PersistedSession): Promise<void>;
  
  /** Load the most recent session */
  loadSession(): Promise<PersistedSession | null>;
  
  /** Delete session data */
  clearSession(): Promise<void>;
  
  /** Check if storage is available */
  isAvailable(): boolean;
  
  /** Get storage implementation name for debugging */
  getStorageType(): string;
}

/**
 * Current version of the persistence format
 */
export const SESSION_PERSISTENCE_VERSION = 1;

/**
 * Default options for session persistence
 */
export const DEFAULT_PERSISTENCE_OPTIONS: Required<SessionPersistenceOptions> = {
  saveInterval: 10000, // 10 seconds
  maxRecoveryAge: 4 * 60 * 60 * 1000, // 4 hours
  autoSaveOnActivity: true,
  storageKeyPrefix: 'mr-timely-session'
};
