/**
 * API route for retrieving shared session summaries
 * GET /api/sessions/[uuid]
 * 
 * @see .kiro/specs/shareable-session-summary/design.md
 * @see .kiro/specs/shareable-session-summary/requirements.md
 */

import { NextRequest, NextResponse } from 'next/server';
import { head, del } from '@vercel/blob';
import { 
  rateLimiters,
  getClientIP,
  applySecurityHeaders,
  SECURITY_CONFIG,
  RateLimitError,
} from '@/utils/security';
import { validateSessionSharingId } from '@/utils/uuid';
import type { 
  GetSessionResponse, 
  SessionSharingError,
  StoredSession,
} from '@/types/session-sharing';

/**
 * GET /api/sessions/[uuid]
 * Retrieve a shared session summary by UUID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { uuid: string } }
): Promise<NextResponse> {
  const headers = new Headers();
  applySecurityHeaders(headers);

  try {
    // Rate limiting check
    const clientIP = getClientIP(request);
    const rateLimitResult = await rateLimiters.retrieveSession.checkLimit(clientIP);
    
    if (!rateLimitResult.allowed) {
      const resetDate = new Date(rateLimitResult.resetTime);
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          message: 'Too many retrieval requests. Please try again later.',
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
            'X-RateLimit-Limit': SECURITY_CONFIG.RETRIEVE_RATE_LIMIT.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': resetDate.toISOString(),
          },
        }
      );
    }

    // Validate UUID parameter
    let sessionId: string;
    try {
      sessionId = validateSessionSharingId(params.uuid);
    } catch {
      // Log access attempt with invalid UUID for security monitoring
      console.log('Invalid UUID access attempt:', {
        uuid: params.uuid?.slice(0, 10) + '***', // Log partial UUID for privacy
        clientIP: clientIP.slice(0, 8) + '***',
        timestamp: new Date().toISOString(),
        userAgent: request.headers.get('user-agent')?.slice(0, 100),
      });

      return NextResponse.json(
        {
          error: 'Invalid session ID',
          message: 'The provided session ID is not valid',
          code: 'INVALID_SESSION_ID',
        } satisfies SessionSharingError,
        { status: 400, headers }
      );
    }

    // Construct blob path
    const blobPath = `sessions/${sessionId}.json`;

    // Check if session exists and get metadata
    let blobExists = false;
    try {
      await head(blobPath);
      blobExists = true;
    } catch {
      // Blob doesn't exist or is inaccessible
      blobExists = false;
    }

    if (!blobExists) {
      // Log access attempt to non-existent session for security monitoring
      console.log('Session not found:', {
        sessionId: sessionId.slice(0, 8) + '***',
        clientIP: clientIP.slice(0, 8) + '***',
        timestamp: new Date().toISOString(),
        userAgent: request.headers.get('user-agent')?.slice(0, 100),
      });

      return NextResponse.json(
        {
          error: 'Session not found',
          message: 'The requested session does not exist or has been removed',
          code: 'SESSION_NOT_FOUND',
        } satisfies SessionSharingError,
        { status: 404, headers }
      );
    }

    // Retrieve session data from Vercel Blob
    let storedSession: StoredSession;
    try {
      const response = await fetch(`https://blob.vercel-storage.com/${blobPath}`);
      
      if (!response.ok) {
        throw new Error(`Blob fetch failed: ${response.status}`);
      }

      const sessionDataText = await response.text();
      storedSession = JSON.parse(sessionDataText) as StoredSession;
    } catch (error) {
      console.error('Failed to retrieve session from Vercel Blob:', {
        sessionId: sessionId.slice(0, 8) + '***',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      });

      return NextResponse.json(
        {
          error: 'Retrieval failed',
          message: 'Failed to retrieve session data. Please try again.',
          code: 'RETRIEVAL_ERROR',
        } satisfies SessionSharingError,
        { status: 500, headers }
      );
    }

    // Validate session structure
    if (!storedSession || !storedSession.sessionData || !storedSession.metadata) {
      console.error('Invalid session structure:', {
        sessionId: sessionId.slice(0, 8) + '***',
        hasSessionData: !!storedSession?.sessionData,
        hasMetadata: !!storedSession?.metadata,
        timestamp: new Date().toISOString(),
      });

      return NextResponse.json(
        {
          error: 'Invalid session data',
          message: 'The session data is corrupted or invalid',
          code: 'INVALID_SESSION_DATA',
        } satisfies SessionSharingError,
        { status: 500, headers }
      );
    }

    // Check if session has expired
    const now = new Date();
    const expiresAt = new Date(storedSession.metadata.expiresAt);
    
    if (now > expiresAt) {
      // Log expired session access for monitoring
      console.log('Expired session access:', {
        sessionId: sessionId.slice(0, 8) + '***',
        expiresAt: storedSession.metadata.expiresAt,
        clientIP: clientIP.slice(0, 8) + '***',
        timestamp: now.toISOString(),
      });

      // Attempt to clean up expired session (fire and forget)
      try {
        await del(blobPath);
        console.log('Expired session cleaned up:', {
          sessionId: sessionId.slice(0, 8) + '***',
          timestamp: now.toISOString(),
        });
      } catch (cleanupError) {
        // Log cleanup failure but don't fail the request
        console.warn('Failed to cleanup expired session:', {
          sessionId: sessionId.slice(0, 8) + '***',
          error: cleanupError instanceof Error ? cleanupError.message : 'Unknown error',
          timestamp: now.toISOString(),
        });
      }

      return NextResponse.json(
        {
          error: 'Session expired',
          message: 'This session has expired and is no longer available',
          code: 'SESSION_EXPIRED',
          details: {
            expiresAt: storedSession.metadata.expiresAt,
          },
        } satisfies SessionSharingError,
        { status: 410, headers }
      );
    }

    // Log successful access for security monitoring
    console.log('Session accessed successfully:', {
      sessionId: sessionId.slice(0, 8) + '***',
      clientIP: clientIP.slice(0, 8) + '***',
      timestamp: now.toISOString(),
      userAgent: request.headers.get('user-agent')?.slice(0, 100),
      expiresAt: storedSession.metadata.expiresAt,
    });

    // Prepare response
    const response: GetSessionResponse = {
      sessionData: storedSession.sessionData,
      metadata: storedSession.metadata,
    };

    // Add success headers
    headers.set('X-Session-Id', sessionId);
    headers.set('X-Expires-At', storedSession.metadata.expiresAt);
    headers.set('X-Created-At', storedSession.metadata.createdAt);
    headers.set('Cache-Control', 'public, max-age=300, s-maxage=300'); // 5 minute cache

    return NextResponse.json(response, { 
      status: 200, 
      headers: {
        ...Object.fromEntries(headers.entries()),
        'X-RateLimit-Limit': SECURITY_CONFIG.RETRIEVE_RATE_LIMIT.toString(),
        'X-RateLimit-Remaining': (rateLimitResult.remaining - 1).toString(),
      },
    });

  } catch (error) {
    // Log error for monitoring (without sensitive data)
    console.error('Unexpected error in session retrieval:', {
      uuid: params.uuid?.slice(0, 10) + '***',
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
export async function POST(): Promise<NextResponse> {
  const headers = new Headers();
  applySecurityHeaders(headers);
  
  return NextResponse.json(
    {
      error: 'Method not allowed',
      message: 'This endpoint only supports GET requests',
      code: 'METHOD_NOT_ALLOWED',
    } satisfies SessionSharingError,
    { 
      status: 405, 
      headers: {
        ...Object.fromEntries(headers.entries()),
        'Allow': 'GET',
      },
    }
  );
}

export async function PUT(): Promise<NextResponse> {
  return POST();
}

export async function DELETE(): Promise<NextResponse> {
  return POST();
}

export async function PATCH(): Promise<NextResponse> {
  return POST();
}