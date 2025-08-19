/**
 * API route for duplicating sessions with relationship tracking
 * POST /api/sessions/duplicate
 * 
 * @see .kiro/specs/shareable-session-summary/design.md
 * @see .kiro/specs/shareable-session-summary/requirements.md
 */

import { NextRequest, NextResponse } from 'next/server';
import { put, head } from '@vercel/blob';
import { 
  validateSessionForSharing,
  DuplicateSessionRequestSchema,
  rateLimiters,
  getClientIP,
  applySecurityHeaders,
  SECURITY_CONFIG,
  RateLimitError,
} from '@/utils/security';
import { generateSessionSharingId, generateShareUrl } from '@/utils/uuid';
import type { 
  DuplicateSessionRequest, 
  DuplicateSessionResponse, 
  SessionSharingError,
  StoredSession,
  SessionMetadata,
  SessionSummaryData,
} from '@/types/session-sharing';

/**
 * POST /api/sessions/duplicate
 * Create a linked duplicate of an existing session
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const headers = new Headers();
  applySecurityHeaders(headers);

  try {
    // Rate limiting check
    const clientIP = getClientIP(request);
    const rateLimitResult = await rateLimiters.duplicateSession.checkLimit(clientIP);
    
    if (!rateLimitResult.allowed) {
      const resetDate = new Date(rateLimitResult.resetTime);
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          message: 'Too many duplication requests. Please try again later.',
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
            'X-RateLimit-Limit': SECURITY_CONFIG.DUPLICATE_RATE_LIMIT.toString(),
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
    const validationResult = DuplicateSessionRequestSchema.safeParse(requestBody);
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

    const { sourceSessionId, newSessionData } = validationResult.data as DuplicateSessionRequest;

    // Validate source session exists and is not expired
    const sourceSession = await validateSourceSession(sourceSessionId);
    if (!sourceSession) {
      return NextResponse.json(
        {
          error: 'Source session not found',
          message: 'The source session does not exist or has expired',
          code: 'SOURCE_SESSION_NOT_FOUND',
        } satisfies SessionSharingError,
        { status: 404, headers }
      );
    }

    // Validate relationship constraints
    const relationshipValidation = await validateSessionRelationships(sourceSessionId, newSessionData);
    if (!relationshipValidation.valid) {
      return NextResponse.json(
        {
          error: 'Relationship validation failed',
          message: relationshipValidation.error || 'Invalid session relationship',
          code: 'RELATIONSHIP_VALIDATION_ERROR',
        } satisfies SessionSharingError,
        { status: 400, headers }
      );
    }

    // Validate and sanitize session data
    let validatedSessionData: SessionSummaryData;
    try {
      validatedSessionData = validateSessionForSharing(newSessionData);
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

    // Set relationship data
    validatedSessionData.originalSessionId = sourceSessionId;
    
    // Generate new session ID
    const newSessionId = generateSessionSharingId();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + SECURITY_CONFIG.SESSION_EXPIRY_MS);

    // Create session metadata
    const metadata: SessionMetadata = {
      id: newSessionId,
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

    // Store the new session
    try {
      await put(`sessions/${newSessionId}.json`, JSON.stringify(storedSession), {
        access: 'public',
        addRandomSuffix: false,
      });

      console.log(`Duplicate session ${newSessionId} created from ${sourceSessionId}:`, {
        newSessionId,
        sourceSessionId,
        clientIP: clientIP.slice(0, 8) + '***',
        timestamp: now.toISOString(),
      });

    } catch (error) {
      console.error('Failed to store duplicate session in Vercel Blob:', error);
      
      return NextResponse.json(
        {
          error: 'Storage failed',
          message: 'Failed to store session data. Please try again.',
          code: 'STORAGE_ERROR',
        } satisfies SessionSharingError,
        { status: 500, headers }
      );
    }

    // Update source session to include this as a derived session
    await updateSourceSessionDerivatives(sourceSessionId, newSessionId);

    // Generate share URL
    const baseUrl = request.nextUrl.origin;
    const shareUrl = generateShareUrl(baseUrl, newSessionId);

    // Prepare response
    const response: DuplicateSessionResponse = {
      shareId: newSessionId,
      shareUrl,
      expiresAt: expiresAt.toISOString(),
    };

    // Add success headers
    headers.set('X-Session-Id', newSessionId);
    headers.set('X-Source-Session-Id', sourceSessionId);
    headers.set('X-Expires-At', expiresAt.toISOString());

    return NextResponse.json(response, { 
      status: 201, 
      headers: {
        ...Object.fromEntries(headers.entries()),
        'X-RateLimit-Limit': SECURITY_CONFIG.DUPLICATE_RATE_LIMIT.toString(),
        'X-RateLimit-Remaining': (rateLimitResult.remaining - 1).toString(),
      },
    });

  } catch (error) {
    // Log error for monitoring (without sensitive data)
    console.error('Unexpected error in session duplication:', {
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
 * Validate that source session exists and is not expired
 */
async function validateSourceSession(sourceSessionId: string): Promise<StoredSession | null> {
  try {
    const sourceSessionUrl = `sessions/${sourceSessionId}.json`;
    
    // Check if session exists
    try {
      await head(sourceSessionUrl);
    } catch {
      return null; // Session doesn't exist
    }
    
    // Retrieve session data
    const response = await fetch(`https://blob.vercel-storage.com/${sourceSessionUrl}`);
    
    if (!response.ok) {
      return null;
    }

    const sessionText = await response.text();
    const storedSession: StoredSession = JSON.parse(sessionText);
    
    // Check if session is expired
    const now = new Date();
    const expiresAt = new Date(storedSession.metadata.expiresAt);
    
    if (now > expiresAt) {
      return null; // Session expired
    }
    
    return storedSession;
  } catch (error) {
    console.error('Error validating source session:', error);
    return null;
  }
}

/**
 * Validate session relationship constraints
 */
async function validateSessionRelationships(
  sourceSessionId: string, 
  newSessionData: SessionSummaryData
): Promise<{ valid: boolean; error?: string }> {
  // Prevent circular references
  if (newSessionData.originalSessionId === sourceSessionId) {
    return {
      valid: false,
      error: 'Cannot create circular session reference'
    };
  }

  // Check if the new session already has an original session ID that conflicts
  if (newSessionData.originalSessionId && newSessionData.originalSessionId !== sourceSessionId) {
    return {
      valid: false,
      error: 'Session already has a different original session ID'
    };
  }

  // Check chain depth to prevent excessive linking
  const chainDepth = await calculateChainDepth(sourceSessionId);
  if (chainDepth >= SECURITY_CONFIG.MAX_DERIVED_SESSIONS) {
    return {
      valid: false,
      error: `Maximum session chain depth exceeded (max: ${SECURITY_CONFIG.MAX_DERIVED_SESSIONS})`
    };
  }

  // Validate derived sessions count
  if (newSessionData.derivedSessionIds && newSessionData.derivedSessionIds.length > SECURITY_CONFIG.MAX_DERIVED_SESSIONS) {
    return {
      valid: false,
      error: `Too many derived sessions (max: ${SECURITY_CONFIG.MAX_DERIVED_SESSIONS})`
    };
  }

  return { valid: true };
}

/**
 * Calculate the chain depth of session relationships with circular reference protection
 */
async function calculateChainDepth(sessionId: string, visited = new Set<string>()): Promise<number> {
  // Prevent infinite recursion from circular references
  if (visited.has(sessionId)) {
    return 0;
  }
  
  visited.add(sessionId);
  
  try {
    const sessionUrl = `sessions/${sessionId}.json`;
    
    // Check if session exists
    try {
      await head(sessionUrl);
    } catch {
      return 0; // Session doesn't exist
    }
    
    // Retrieve session data
    const response = await fetch(`https://blob.vercel-storage.com/${sessionUrl}`);
    
    if (!response.ok) {
      return 0;
    }
    
    const sessionText = await response.text();
    const storedSession: StoredSession = JSON.parse(sessionText);
    
    // Check if session is expired
    const now = new Date();
    const expiresAt = new Date(storedSession.metadata.expiresAt);
    
    if (now > expiresAt) {
      return 0; // Expired session doesn't count in chain
    }
    
    // If this session has an original session, continue the chain
    if (storedSession.sessionData.originalSessionId) {
      return 1 + await calculateChainDepth(storedSession.sessionData.originalSessionId, visited);
    }
    
    return 0; // This is the root session
  } catch (error) {
    console.error('Error calculating chain depth:', error);
    return 0;
  }
}

/**
 * Update source session to include new derived session ID with proper error handling
 */
async function updateSourceSessionDerivatives(sourceSessionId: string, newSessionId: string): Promise<void> {
  try {
    const sourceSessionUrl = `sessions/${sourceSessionId}.json`;
    
    // Check if session exists
    try {
      await head(sourceSessionUrl);
    } catch {
      console.warn(`Could not find source session ${sourceSessionId} for derivative update`);
      return;
    }
    
    // Fetch current source session
    const response = await fetch(`https://blob.vercel-storage.com/${sourceSessionUrl}`);
    if (!response.ok) {
      console.warn(`Could not fetch source session ${sourceSessionId} for derivative update`);
      return;
    }
    
    const sessionText = await response.text();
    const storedSession: StoredSession = JSON.parse(sessionText);
    
    // Initialize derivedSessionIds array if it doesn't exist
    if (!storedSession.sessionData.derivedSessionIds) {
      storedSession.sessionData.derivedSessionIds = [];
    }
    
    // Add new session ID to derivatives if not already present
    if (!storedSession.sessionData.derivedSessionIds.includes(newSessionId)) {
      storedSession.sessionData.derivedSessionIds.push(newSessionId);
      
      // Enforce maximum derived sessions limit
      if (storedSession.sessionData.derivedSessionIds.length > SECURITY_CONFIG.MAX_DERIVED_SESSIONS) {
        console.warn(`Source session ${sourceSessionId} exceeds maximum derived sessions limit`);
        // Remove oldest derived sessions to maintain limit
        storedSession.sessionData.derivedSessionIds = storedSession.sessionData.derivedSessionIds.slice(-SECURITY_CONFIG.MAX_DERIVED_SESSIONS);
      }
    }
    
    // Update the stored session
    await put(sourceSessionUrl, JSON.stringify(storedSession), {
      access: 'public',
      addRandomSuffix: false,
    });
    
    console.log(`Updated source session ${sourceSessionId} with new derivative ${newSessionId}`);
    
  } catch (error) {
    console.error('Error updating source session derivatives:', error);
    // Don't fail the main operation if this fails - it's a non-critical update
  }
}

/**
 * Cleanup orphaned session relationships (utility function for maintenance)
 */
export async function cleanupOrphanedSessions(): Promise<void> {
  // This function would be called by a maintenance job
  // Implementation would scan for sessions with broken relationship references
  // and clean them up to maintain data integrity
  console.log('Orphaned session cleanup would be implemented here for production use');
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