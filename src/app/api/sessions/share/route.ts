/**
 * API route for sharing session summaries
 * POST /api/sessions/share
 * 
 * @see .kiro/specs/shareable-session-summary/design.md
 * @see .kiro/specs/shareable-session-summary/requirements.md
 */

import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { 
  validateSessionForSharing,
  ShareSessionRequestSchema,
  rateLimiters,
  getClientIP,
  storageQuotaTracker,
  duplicateDetector,
  applySecurityHeaders,
  SECURITY_CONFIG,
  RateLimitError,
} from '@/utils/security';
import { generateSessionSharingId, generateShareUrl } from '@/utils/uuid';
import type { 
  ShareSessionRequest, 
  ShareSessionResponse, 
  SessionSharingError,
  StoredSession,
  SessionMetadata,
} from '@/types/session-sharing';

/**
 * POST /api/sessions/share
 * Create a shareable session summary
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const headers = new Headers();
  applySecurityHeaders(headers);

  try {
    // Rate limiting check
    const clientIP = getClientIP(request);
    const rateLimitResult = await rateLimiters.shareSession.checkLimit(clientIP);
    
    if (!rateLimitResult.allowed) {
      const resetDate = new Date(rateLimitResult.resetTime);
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          message: 'Too many share requests. Please try again later.',
          code: 'RATE_LIMIT_EXCEEDED',
          details: {
            resetTime: resetDate.toISOString(),
            remaining: rateLimitResult.remaining,
          },
        } satisfies SessionSharingError,
        { 
          status: 429,
          headers: {
            ...Object.fromEntries(headers.entries()),
            'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString(),
            'X-RateLimit-Limit': SECURITY_CONFIG.SHARE_RATE_LIMIT.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': resetDate.toISOString(),
          },
        }
      );
    }

    // Parse and validate request body
    let requestBody: unknown;
    try {
      requestBody = await request.json();
    } catch {
      return NextResponse.json(
        {
          error: 'Invalid JSON',
          message: 'Request body must be valid JSON',
          code: 'INVALID_JSON',
        } satisfies SessionSharingError,
        { status: 400, headers }
      );
    }

    // Validate request schema
    const validationResult = ShareSessionRequestSchema.safeParse(requestBody);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          message: 'Invalid request data',
          code: 'VALIDATION_ERROR',
          details: {
            issues: validationResult.error.issues.map(issue => ({
              path: issue.path.join('.'),
              message: issue.message,
            })),
          },
        } satisfies SessionSharingError,
        { status: 400, headers }
      );
    }

    const { sessionData } = validationResult.data as ShareSessionRequest;

    // Validate and sanitize session data
    let validatedSessionData;
    try {
      validatedSessionData = validateSessionForSharing(sessionData);
    } catch (error) {
      return NextResponse.json(
        {
          error: 'Session validation failed',
          message: error instanceof Error ? error.message : 'Invalid session data',
          code: 'SESSION_VALIDATION_ERROR',
        } satisfies SessionSharingError,
        { status: 400, headers }
      );
    }

    // Check for duplicate sessions
    if (duplicateDetector.checkDuplicate(clientIP, validatedSessionData)) {
      return NextResponse.json(
        {
          error: 'Duplicate session',
          message: 'This session has been shared recently. Please wait before sharing again.',
          code: 'DUPLICATE_SESSION',
        } satisfies SessionSharingError,
        { status: 409, headers }
      );
    }

    // Calculate session data size for storage quota
    const sessionDataString = JSON.stringify(validatedSessionData);
    const sessionDataSize = Buffer.byteLength(sessionDataString, 'utf8');

    // Check storage quota
    if (!storageQuotaTracker.checkQuota(clientIP, sessionDataSize)) {
      const remainingQuota = storageQuotaTracker.getRemainingQuota(clientIP);
      return NextResponse.json(
        {
          error: 'Storage quota exceeded',
          message: 'Daily storage quota exceeded for your IP address',
          code: 'STORAGE_QUOTA_EXCEEDED',
          details: {
            remainingQuota,
            requestedSize: sessionDataSize,
          },
        } satisfies SessionSharingError,
        { status: 413, headers }
      );
    }

    // Generate unique session ID
    const sessionId = generateSessionSharingId();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + SECURITY_CONFIG.SESSION_EXPIRY_MS);

    // Create session metadata
    const metadata: SessionMetadata = {
      id: sessionId,
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      version: '1.0.0',
      userAgent: request.headers.get('user-agent')?.slice(0, 500) || undefined,
    };

    // Prepare data for storage
    const storedSession: StoredSession = {
      sessionData: validatedSessionData,
      metadata,
    };

    // Store in Vercel Blob
    try {
      const blobResult = await put(`sessions/${sessionId}.json`, JSON.stringify(storedSession), {
        access: 'public',
        addRandomSuffix: false,
      });

      console.log(`Session ${sessionId} stored successfully:`, {
        url: blobResult.url,
        size: sessionDataSize,
        clientIP: clientIP.slice(0, 8) + '***', // Log partial IP for privacy
        timestamp: now.toISOString(),
      });

    } catch (error) {
      console.error('Failed to store session in Vercel Blob:', error);
      
      return NextResponse.json(
        {
          error: 'Storage failed',
          message: 'Failed to store session data. Please try again.',
          code: 'STORAGE_ERROR',
        } satisfies SessionSharingError,
        { status: 500, headers }
      );
    }

    // Generate share URL
    const baseUrl = request.nextUrl.origin;
    const shareUrl = generateShareUrl(baseUrl, sessionId);

    // Prepare response
    const response: ShareSessionResponse = {
      shareId: sessionId,
      shareUrl,
      expiresAt: expiresAt.toISOString(),
    };

    // Add success headers
    headers.set('X-Session-Id', sessionId);
    headers.set('X-Expires-At', expiresAt.toISOString());

    return NextResponse.json(response, { 
      status: 201, 
      headers: {
        ...Object.fromEntries(headers.entries()),
        'X-RateLimit-Limit': SECURITY_CONFIG.SHARE_RATE_LIMIT.toString(),
        'X-RateLimit-Remaining': (rateLimitResult.remaining - 1).toString(),
      },
    });

  } catch (error) {
    // Log error for monitoring (without sensitive data)
    console.error('Unexpected error in session sharing:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get('user-agent')?.slice(0, 100),
    });

    // Handle rate limit errors specifically
    if (error instanceof RateLimitError) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          message: error.message,
          code: 'RATE_LIMIT_EXCEEDED',
          details: {
            resetTime: error.resetDate,
          },
        } satisfies SessionSharingError,
        { 
          status: 429,
          headers: {
            ...Object.fromEntries(headers.entries()),
            'Retry-After': Math.ceil((error.resetTime - Date.now()) / 1000).toString(),
          },
        }
      );
    }

    // Generic error response
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'An unexpected error occurred. Please try again.',
        code: 'INTERNAL_ERROR',
      } satisfies SessionSharingError,
      { status: 500, headers }
    );
  }
}

/**
 * Handle unsupported HTTP methods
 */
export async function GET(): Promise<NextResponse> {
  const headers = new Headers();
  applySecurityHeaders(headers);
  
  return NextResponse.json(
    {
      error: 'Method not allowed',
      message: 'This endpoint only supports POST requests',
      code: 'METHOD_NOT_ALLOWED',
    } satisfies SessionSharingError,
    { 
      status: 405, 
      headers: {
        ...Object.fromEntries(headers.entries()),
        'Allow': 'POST',
      },
    }
  );
}

export async function PUT(): Promise<NextResponse> {
  return GET();
}

export async function DELETE(): Promise<NextResponse> {
  return GET();
}

export async function PATCH(): Promise<NextResponse> {
  return GET();
}