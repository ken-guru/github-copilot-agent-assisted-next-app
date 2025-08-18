import { z } from 'zod';
import DOMPurify from 'dompurify';

/**
 * UUID v4 validation schema
 */
export const UUIDSchema = z.string().uuid('Invalid UUID format');

/**
 * Session data validation schemas
 */
export const ActivitySummarySchema = z.object({
  id: z.string().min(1, 'Activity ID is required'),
  name: z.string().min(1, 'Activity name is required').max(100, 'Activity name too long'),
  duration: z.number().min(0, 'Duration must be non-negative'),
  colorIndex: z.number().min(0, 'Color index must be non-negative').max(20, 'Invalid color index'),
});

export const SkippedActivitySchema = z.object({
  id: z.string().min(1, 'Activity ID is required'),
  name: z.string().min(1, 'Activity name is required').max(100, 'Activity name too long'),
});

export const SharedTimelineEntrySchema = z.object({
  id: z.string().min(1, 'Timeline entry ID is required'),
  activityId: z.string().nullable(),
  activityName: z.string().nullable(),
  startTime: z.number().min(0, 'Start time must be non-negative'),
  endTime: z.number().nullable(),
  colorIndex: z.number().min(0).max(20).optional(),
});

export const SessionSummaryDataSchema = z.object({
  plannedTime: z.number().min(0, 'Planned time must be non-negative'),
  timeSpent: z.number().min(0, 'Time spent must be non-negative'),
  overtime: z.number().min(0, 'Overtime must be non-negative'),
  idleTime: z.number().min(0, 'Idle time must be non-negative'),
  activities: z.array(ActivitySummarySchema).max(50, 'Too many activities'),
  skippedActivities: z.array(SkippedActivitySchema).max(50, 'Too many skipped activities'),
  timelineEntries: z.array(SharedTimelineEntrySchema).max(200, 'Too many timeline entries'),
  completedAt: z.string().datetime('Invalid completion timestamp'),
  sessionType: z.enum(['completed', 'timeUp'], { message: 'Invalid session type' }),
  originalSessionId: UUIDSchema.optional(),
  derivedSessionIds: z.array(UUIDSchema).max(10, 'Too many derived sessions').optional(),
});

export const SessionMetadataSchema = z.object({
  id: UUIDSchema,
  createdAt: z.string().datetime('Invalid creation timestamp'),
  expiresAt: z.string().datetime('Invalid expiration timestamp'),
  version: z.string().min(1, 'Version is required'),
  userAgent: z.string().max(500, 'User agent too long').optional(),
});

/**
 * API request/response schemas
 */
export const ShareSessionRequestSchema = z.object({
  sessionData: SessionSummaryDataSchema,
  csrfToken: z.string().optional(),
});

export const ShareSessionResponseSchema = z.object({
  shareId: UUIDSchema,
  shareUrl: z.string().url('Invalid share URL'),
  expiresAt: z.string().datetime('Invalid expiration timestamp'),
});

export const DuplicateSessionRequestSchema = z.object({
  sourceSessionId: UUIDSchema,
  newSessionData: SessionSummaryDataSchema,
  csrfToken: z.string().optional(),
});

/**
 * Input sanitization utilities
 */
export class InputSanitizer {
  /**
   * Sanitize HTML content to prevent XSS attacks
   */
  static sanitizeHtml(input: string): string {
    return DOMPurify.sanitize(input, {
      ALLOWED_TAGS: [], // No HTML tags allowed
      ALLOWED_ATTR: [], // No attributes allowed
      KEEP_CONTENT: true, // Keep text content
    });
  }

  /**
   * Sanitize activity name with length limits
   */
  static sanitizeActivityName(name: string): string {
    const sanitized = this.sanitizeHtml(name.trim());
    return sanitized.slice(0, 100); // Enforce max length
  }

  /**
   * Sanitize session data by cleaning all string fields
   */
  static sanitizeSessionData(data: unknown): unknown {
    if (typeof data === 'string') {
      return this.sanitizeHtml(data);
    }
    
    if (Array.isArray(data)) {
      return data.map(item => this.sanitizeSessionData(item));
    }
    
    if (data && typeof data === 'object') {
      const sanitized: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(data)) {
        sanitized[key] = this.sanitizeSessionData(value);
      }
      return sanitized;
    }
    
    return data;
  }

  /**
   * Validate and sanitize UUID
   */
  static validateUUID(uuid: string): string {
    const result = UUIDSchema.safeParse(uuid);
    if (!result.success) {
      throw new Error('Invalid UUID format');
    }
    return result.data;
  }
}

/**
 * Content filtering utilities
 */
export class ContentFilter {
  private static readonly BLOCKED_PATTERNS = [
    /javascript:/i,
    /data:/i,
    /vbscript:/i,
    /<script/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
    /on\w+\s*=/i, // Event handlers like onclick=
  ];

  /**
   * Check if content contains potentially malicious patterns
   */
  static containsMaliciousContent(content: string): boolean {
    return this.BLOCKED_PATTERNS.some(pattern => pattern.test(content));
  }

  /**
   * Validate content is safe for storage and display
   */
  static validateContent(content: string): void {
    if (this.containsMaliciousContent(content)) {
      throw new Error('Content contains potentially malicious patterns');
    }
  }
}

/**
 * Size validation utilities
 */
export class SizeValidator {
  static readonly MAX_SESSION_SIZE = 1024 * 1024; // 1MB
  static readonly MAX_ACTIVITY_COUNT = 50;
  static readonly MAX_TIMELINE_ENTRIES = 200;
  static readonly MAX_DERIVED_SESSIONS = 10;

  /**
   * Validate session data size
   */
  static validateSessionSize(data: unknown): void {
    const serialized = JSON.stringify(data);
    
    // Use Buffer.byteLength in Node.js environment, TextEncoder in browser
    let sizeInBytes: number;
    if (typeof Buffer !== 'undefined') {
      sizeInBytes = Buffer.byteLength(serialized, 'utf8');
    } else if (typeof TextEncoder !== 'undefined') {
      sizeInBytes = new TextEncoder().encode(serialized).length;
    } else {
      // Fallback: approximate size (not exact but good enough for validation)
      sizeInBytes = serialized.length * 2; // Rough estimate for UTF-8
    }
    
    if (sizeInBytes > this.MAX_SESSION_SIZE) {
      throw new Error(`Session data too large: ${sizeInBytes} bytes (max: ${this.MAX_SESSION_SIZE})`);
    }
  }

  /**
   * Validate activity count limits
   */
  static validateActivityLimits(activities: unknown[], skippedActivities: unknown[]): void {
    if (activities.length > this.MAX_ACTIVITY_COUNT) {
      throw new Error(`Too many activities: ${activities.length} (max: ${this.MAX_ACTIVITY_COUNT})`);
    }
    
    if (skippedActivities.length > this.MAX_ACTIVITY_COUNT) {
      throw new Error(`Too many skipped activities: ${skippedActivities.length} (max: ${this.MAX_ACTIVITY_COUNT})`);
    }
  }
}

/**
 * Comprehensive validation function for session sharing
 */
export function validateSessionForSharing(data: unknown): z.infer<typeof SessionSummaryDataSchema> {
  // First sanitize the data to remove any malicious content
  const sanitizedData = InputSanitizer.sanitizeSessionData(data);

  // Then validate the schema
  const validationResult = SessionSummaryDataSchema.safeParse(sanitizedData);
  if (!validationResult.success) {
    throw new Error(`Validation failed: ${validationResult.error.message}`);
  }

  const sessionData = validationResult.data;

  // Validate size constraints
  SizeValidator.validateSessionSize(sessionData);
  SizeValidator.validateActivityLimits(sessionData.activities, sessionData.skippedActivities);

  // Validate content safety after sanitization
  sessionData.activities.forEach(activity => {
    ContentFilter.validateContent(activity.name);
  });
  
  sessionData.skippedActivities.forEach(activity => {
    ContentFilter.validateContent(activity.name);
  });

  return sessionData;
}