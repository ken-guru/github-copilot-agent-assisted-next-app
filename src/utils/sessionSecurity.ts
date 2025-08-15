/**
 * Security utilities for session data validation and sanitization
 */

import { PersistedSession, SESSION_PERSISTENCE_VERSION } from '@/types/session';
import { Activity } from '@/types/activity';
import { TimelineEntry } from '@/types';

/**
 * Validates and sanitizes activity data
 */
export function sanitizeActivity(activity: Activity): Activity {
  return {
    id: String(activity.id).trim(),
    name: String(activity.name).trim().substring(0, 100), // Limit name length
    colorIndex: Math.max(0, Math.min(11, Number(activity.colorIndex) || 0)), // Ensure valid color index
    createdAt: activity.createdAt,
    isActive: Boolean(activity.isActive)
  };
}

/**
 * Validates and sanitizes timeline entry data
 */
export function sanitizeTimelineEntry(entry: TimelineEntry): TimelineEntry {
  return {
    id: String(entry.id).trim(),
    activityId: String(entry.activityId).trim(),
    activityName: String(entry.activityName).trim().substring(0, 100),
    startTime: Number(entry.startTime) || 0,
    endTime: entry.endTime !== null ? Number(entry.endTime) || null : null
  };
}

/**
 * Validates session data structure and content
 */
export function validateSessionData(session: unknown): session is PersistedSession {
  if (!session || typeof session !== 'object') {
    return false;
  }

  const s = session as Record<string, unknown>;

  // Required fields validation
  if (
    typeof s.id !== 'string' ||
    typeof s.startTime !== 'string' ||
    typeof s.totalDuration !== 'number' ||
    typeof s.elapsedTime !== 'number' ||
    typeof s.timerActive !== 'boolean' ||
    typeof s.lastSaved !== 'string' ||
    typeof s.version !== 'number'
  ) {
    return false;
  }

  // Array fields validation
  if (
    !Array.isArray(s.activities) ||
    !Array.isArray(s.completedActivityIds) ||
    !Array.isArray(s.removedActivityIds) ||
    !Array.isArray(s.timelineEntries) ||
    !Array.isArray(s.activityStates)
  ) {
    return false;
  }

  // currentActivityId can be string or null
  if (s.currentActivityId !== null && typeof s.currentActivityId !== 'string') {
    return false;
  }

  // Version check for compatibility
  if (s.version !== SESSION_PERSISTENCE_VERSION) {
    return false;
  }

  return true;
}

/**
 * Sanitizes complete session data
 */
export function sanitizeSessionData(session: PersistedSession): PersistedSession {
  return {
    id: String(session.id).trim(),
    startTime: session.startTime,
    totalDuration: Math.max(0, Number(session.totalDuration) || 0),
    elapsedTime: Math.max(0, Number(session.elapsedTime) || 0),
    currentActivityId: session.currentActivityId ? String(session.currentActivityId).trim() : null,
    timerActive: Boolean(session.timerActive),
    activities: session.activities.map(sanitizeActivity),
    completedActivityIds: session.completedActivityIds.map(id => String(id).trim()),
    removedActivityIds: session.removedActivityIds.map(id => String(id).trim()),
    timelineEntries: session.timelineEntries.map(sanitizeTimelineEntry),
    activityStates: session.activityStates, // ActivityStates are already type-safe from state machine
    lastSaved: session.lastSaved,
    version: session.version
  };
}

/**
 * Security headers for API responses (future use)
 */
export const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin'
} as const;
