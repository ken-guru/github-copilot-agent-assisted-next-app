/**
 * Security utilities for the shareable session summary feature
 */

// Validation utilities
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
} from './validation';

// Rate limiting utilities
export {
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
} from './rateLimiting';

// CSRF protection utilities
export {
  generateCSRFToken,
  isValidCSRFToken,
  csrfTokenStore,
  withCSRFProtection,
  CSRFError,
  generateSessionId,
  CSRFTokenManager,
} from './csrf';

// Import types and functions for internal use
import { 
  MemoryRateLimiter, 
  getClientIP, 
  RateLimitError 
} from './rateLimiting';
import { 
  generateSessionId, 
  withCSRFProtection 
} from './csrf';

/**
 * Security configuration constants
 */
export const SECURITY_CONFIG = {
  // Session expiration
  SESSION_EXPIRY_DAYS: 90,
  SESSION_EXPIRY_MS: 90 * 24 * 60 * 60 * 1000,
  
  // Size limits
  MAX_SESSION_SIZE: 1024 * 1024, // 1MB
  MAX_ACTIVITY_COUNT: 50,
  MAX_TIMELINE_ENTRIES: 200,
  MAX_DERIVED_SESSIONS: 10,
  
  // Rate limiting
  SHARE_RATE_LIMIT: 10, // per hour
  RETRIEVE_RATE_LIMIT: 100, // per hour
  DUPLICATE_RATE_LIMIT: 20, // per hour
  
  // Storage quotas
  MAX_QUOTA_PER_IP: 10 * 1024 * 1024, // 10MB per IP per day
  
  // Security headers
  SECURITY_HEADERS: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self';",
  },
} as const;

/**
 * Utility function to apply security headers to responses
 */
export function applySecurityHeaders(headers: Headers): void {
  Object.entries(SECURITY_CONFIG.SECURITY_HEADERS).forEach(([key, value]) => {
    headers.set(key, value);
  });
}

/**
 * Comprehensive security validation for API requests
 */
export async function validateSecureRequest(
  request: Request,
  options: {
    requireCSRF?: boolean;
    rateLimiter?: MemoryRateLimiter;
    maxSize?: number;
    sessionId?: string;
  } = {}
): Promise<void> {
  const { requireCSRF = false, rateLimiter, maxSize, sessionId } = options;

  // Check request size if specified
  if (maxSize && request.headers.get('content-length')) {
    const contentLength = parseInt(request.headers.get('content-length') || '0');
    if (contentLength > maxSize) {
      throw new Error(`Request too large: ${contentLength} bytes (max: ${maxSize})`);
    }
  }

  // Apply rate limiting if specified
  if (rateLimiter) {
    const clientIP = getClientIP(request);
    const result = await rateLimiter.checkLimit(clientIP);
    if (!result.allowed) {
      throw new RateLimitError('Rate limit exceeded', result.resetTime, new Date(result.resetTime).toISOString());
    }
  }

  // CSRF protection for state-changing operations
  if (requireCSRF && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)) {
    const csrfSessionId = sessionId || generateSessionId();
    await withCSRFProtection(request, csrfSessionId, async () => {});
  }
}