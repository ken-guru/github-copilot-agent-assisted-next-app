import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { put, head } from '@vercel/blob';
import { InputSanitizer } from '@/utils/security/validation';
import { rateLimiters, getClientIP } from '@/utils/security/rateLimiting';
import { SessionMetadata, StoredSession } from '@/types/session-sharing';

// Validation schema for duplication request
const DuplicateSessionSchema = z.object({
  sourceSessionId: z.string().uuid('Invalid source session UUID'),
  newSessionData: z.object({
    plannedTime: z.number().min(0),
    timeSpent: z.number().min(0),
    overtime: z.number().min(0),
    idleTime: z.number().min(0),
    activities: z.array(z.object({
      id: z.string(),
      name: z.string().max(100),
      duration: z.number().min(0),
      colorIndex: z.number().min(0).max(11)
    })),
    skippedActivities: z.array(z.object({
      id: z.string(),
      name: z.string().max(100)
    })),
    timelineEntries: z.array(z.object({
      id: z.string(),
      activityId: z.string().nullable(),
      activityName: z.string().nullable(),
      startTime: z.number(),
      endTime: z.number().nullable(),
      colorIndex: z.number().min(0).max(11).optional()
    })),
    completedAt: z.string(),
    sessionType: z.enum(['completed', 'timeUp']),
    originalSessionId: z.string().uuid().optional(),
    derivedSessionIds: z.array(z.string().uuid()).optional()
  })
});

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    const rateLimitResult = await rateLimiters.duplicateSession.checkLimit(clientIP);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = DuplicateSessionSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validationResult.error.message },
        { status: 400 }
      );
    }

    const { sourceSessionId, newSessionData } = validationResult.data;

    // Validate source session exists and is not expired
    const sourceSessionUrl = `sessions/${sourceSessionId}.json`;
    
    try {
      const sourceSessionResponse = await head(sourceSessionUrl, {
        token: process.env.BLOB_READ_WRITE_TOKEN
      });
      
      if (!sourceSessionResponse) {
        return NextResponse.json(
          { error: 'Source session not found or expired' },
          { status: 404 }
        );
      }
    } catch (error) {
      console.error('Error checking source session:', error);
      return NextResponse.json(
        { error: 'Source session not found or expired' },
        { status: 404 }
      );
    }

    // Validate relationship constraints
    if (newSessionData.originalSessionId) {
      // Prevent circular references
      if (newSessionData.originalSessionId === sourceSessionId) {
        return NextResponse.json(
          { error: 'Cannot create circular session reference' },
          { status: 400 }
        );
      }

      // Check chain depth (prevent excessive linking)
      const chainDepth = await calculateChainDepth(newSessionData.originalSessionId);
      if (chainDepth >= 5) { // Maximum chain depth of 5
        return NextResponse.json(
          { error: 'Maximum session chain depth exceeded' },
          { status: 400 }
        );
      }
    }

    // Generate new UUID for the duplicated session
    const newSessionId = crypto.randomUUID();
    
    // Sanitize session data
    const sanitizedData = InputSanitizer.sanitizeSessionData(newSessionData) as typeof newSessionData;
    
    // Set original session ID to source session
    sanitizedData.originalSessionId = sourceSessionId;
    
    // Create session metadata
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000); // 90 days
    
    const metadata: SessionMetadata = {
      id: newSessionId,
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      version: '1.0',
      userAgent: request.headers.get('user-agent') || undefined
    };

    // Create stored session object
    const storedSession: StoredSession = {
      sessionData: sanitizedData,
      metadata
    };

    // Store the new session
    const sessionUrl = `sessions/${newSessionId}.json`;
    await put(sessionUrl, JSON.stringify(storedSession), {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN
    });

    // Update source session to include this as a derived session
    await updateSourceSessionDerivatives(sourceSessionId, newSessionId);

    // Generate shareable URL
    const baseUrl = request.nextUrl.origin;
    const shareUrl = `${baseUrl}/shared/${newSessionId}`;

    return NextResponse.json({
      shareId: newSessionId,
      shareUrl,
      expiresAt: expiresAt.toISOString()
    });

  } catch (error) {
    console.error('Error in session duplication:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Calculate the chain depth of session relationships
 */
async function calculateChainDepth(sessionId: string, visited = new Set<string>()): Promise<number> {
  if (visited.has(sessionId)) {
    return 0; // Circular reference detected, return 0 to prevent infinite recursion
  }
  
  visited.add(sessionId);
  
  try {
    const sessionUrl = `sessions/${sessionId}.json`;
    const response = await fetch(`${process.env.BLOB_READ_WRITE_TOKEN}/${sessionUrl}`);
    
    if (!response.ok) {
      return 0;
    }
    
    const storedSession: StoredSession = await response.json();
    
    if (storedSession.sessionData.originalSessionId) {
      return 1 + await calculateChainDepth(storedSession.sessionData.originalSessionId, visited);
    }
    
    return 0;
  } catch {
    return 0;
  }
}

/**
 * Update source session to include new derived session ID
 */
async function updateSourceSessionDerivatives(sourceSessionId: string, newSessionId: string): Promise<void> {
  try {
    const sourceSessionUrl = `sessions/${sourceSessionId}.json`;
    
    // Fetch current source session
    const response = await fetch(`${process.env.BLOB_READ_WRITE_TOKEN}/${sourceSessionUrl}`);
    if (!response.ok) {
      console.warn('Could not update source session derivatives');
      return;
    }
    
    const storedSession: StoredSession = await response.json();
    
    // Add new session ID to derivatives
    if (!storedSession.sessionData.derivedSessionIds) {
      storedSession.sessionData.derivedSessionIds = [];
    }
    
    if (!storedSession.sessionData.derivedSessionIds.includes(newSessionId)) {
      storedSession.sessionData.derivedSessionIds.push(newSessionId);
    }
    
    // Update the stored session
    await put(sourceSessionUrl, JSON.stringify(storedSession), {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN
    });
    
  } catch (error) {
    console.error('Error updating source session derivatives:', error);
    // Don't fail the main operation if this fails
  }
}