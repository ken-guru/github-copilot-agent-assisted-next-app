/**
 * Session sharing utilities
 * Centralized exports for all session sharing functionality
 */

// Type definitions
export type {
  ActivitySummary,
  SkippedActivity,
  SharedTimelineEntry,
  SessionSummaryData,
  SessionMetadata,
  StoredSession,
  ShareSessionRequest,
  ShareSessionResponse,
  GetSessionResponse,
  DuplicateSessionRequest,
  DuplicateSessionResponse,
  ActivityDuplicationData,
  SessionSharingError,
  ShareSessionControlsProps,
  SharedSummaryProps,
  SharedSessionPageProps,
  SessionSharingState,
  SessionSharingContext,
} from '../../types/session-sharing';

// UUID utilities
export {
  generateUUID,
  validateUUID,
  isValidUUID,
  generateSessionSharingId,
  validateSessionSharingId,
  extractUUIDFromShareUrl,
  generateShareUrl,
  SessionRelationshipUtils,
} from '../uuid';

// Security and validation utilities
export {
  UUIDSchema,
  ActivitySummarySchema,
  SkippedActivitySchema,
  SharedTimelineEntrySchema,
  SessionSummaryDataSchema,
  SessionMetadataSchema,
  ShareSessionRequestSchema,
  ShareSessionResponseSchema,
  DuplicateSessionRequestSchema,
  InputSanitizer,
  ContentFilter,
  SizeValidator,
  validateSessionForSharing,
  MemoryRateLimiter,
  RATE_LIMIT_CONFIGS,
  rateLimiters,
  getClientIP,
  withRateLimit,
  RateLimitError,
  StorageQuotaTracker,
  storageQuotaTracker,
  DuplicateDetector,
  duplicateDetector,
  generateCSRFToken,
  isValidCSRFToken,
  csrfTokenStore,
  withCSRFProtection,
  CSRFError,
  CSRFTokenManager,
  SECURITY_CONFIG,
  applySecurityHeaders,
  validateSecureRequest,
} from '../security';

/**
 * Utility constants for session sharing
 */
export const SESSION_SHARING_CONSTANTS = {
  // URL patterns
  SHARE_URL_PATTERN: '/shared/{uuid}',
  
  // Expiration
  DEFAULT_EXPIRY_DAYS: 90,
  DEFAULT_EXPIRY_MS: 90 * 24 * 60 * 60 * 1000,
  
  // Limits
  MAX_CHAIN_DEPTH: 5,
  MAX_ACTIVITIES_PER_SESSION: 50,
  MAX_TIMELINE_ENTRIES: 200,
  
  // Schema version for future migrations
  CURRENT_SCHEMA_VERSION: '1.0.0',
} as const;

/**
 * Helper function to create session metadata
 */
export function createSessionMetadata(
  sessionId: string,
  userAgent?: string
): SessionMetadata {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + SESSION_SHARING_CONSTANTS.DEFAULT_EXPIRY_MS);

  return {
    id: validateSessionSharingId(sessionId),
    createdAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
    version: SESSION_SHARING_CONSTANTS.CURRENT_SCHEMA_VERSION,
    userAgent: userAgent?.slice(0, 500), // Truncate to prevent abuse
  };
}

/**
 * Helper function to check if a session has expired
 */
export function isSessionExpired(metadata: SessionMetadata): boolean {
  const now = new Date();
  const expiresAt = new Date(metadata.expiresAt);
  return now > expiresAt;
}

/**
 * Helper function to calculate time until expiration
 */
export function getTimeUntilExpiration(metadata: SessionMetadata): number {
  const now = new Date();
  const expiresAt = new Date(metadata.expiresAt);
  return Math.max(0, expiresAt.getTime() - now.getTime());
}

/**
 * Helper function to format expiration time for display
 */
export function formatExpirationTime(metadata: SessionMetadata): string {
  const timeUntil = getTimeUntilExpiration(metadata);
  
  if (timeUntil === 0) {
    return 'Expired';
  }
  
  const days = Math.floor(timeUntil / (24 * 60 * 60 * 1000));
  const hours = Math.floor((timeUntil % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  
  if (days > 0) {
    return `${days} day${days === 1 ? '' : 's'} remaining`;
  } else if (hours > 0) {
    return `${hours} hour${hours === 1 ? '' : 's'} remaining`;
  } else {
    return 'Less than 1 hour remaining';
  }
}

// Re-export types from main types index for convenience
import type { SessionMetadata } from '../../types/session-sharing';
import { validateSessionSharingId } from '../uuid';