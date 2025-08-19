/**
 * API route for extracting activities from shared sessions
 * GET /api/sessions/[uuid]/activities
 */

import { NextRequest, NextResponse } from 'next/server';
import { head } from '@vercel/blob';
import { validateUUID } from '@/utils/uuid';
import { 
  rateLimiters,
  getClientIP,
  applySecurityHeaders,
} from '@/utils/security';
import type { StoredSession, ActivityDuplicationData } from '@/types/session-sharing';

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
      return NextResponse.json(
        { error: 'Rate limit exceeded', message: 'Too many requests. Please try again later.' },
        { status: 429, headers }
      );
    }

    const sessionId = params.uuid;

    // Validate UUID format
    if (!validateUUID(sessionId)) {
      return NextResponse.json(
        { error: 'Invalid session ID', message: 'The provided session ID is not valid.' },
        { status: 400, headers }
      );
    }

    // Construct blob path
    const blobPath = `sessions/${sessionId}.json`;

    // Check if session exists
    let blobExists = false;
    try {
      await head(blobPath);
      blobExists = true;
    } catch {
      blobExists = false;
    }

    if (!blobExists) {
      return NextResponse.json(
        { error: 'Session not found', message: 'The requested session could not be found.' },
        { status: 404, headers }
      );
    }

    // Retrieve session from Vercel Blob
    let storedSession: StoredSession;
    try {
      const response = await fetch(`https://blob.vercel-storage.com/${blobPath}`);
      
      if (!response.ok) {
        throw new Error(`Blob fetch failed: ${response.status}`);
      }

      const sessionDataText = await response.text();
      storedSession = JSON.parse(sessionDataText) as StoredSession;
    } catch (error) {
      console.error('Error retrieving session:', error);
      return NextResponse.json(
        { error: 'Session not found', message: 'The requested session could not be found.' },
        { status: 404, headers }
      );
    }

    // Check if session has expired
    const now = new Date();
    const expiresAt = new Date(storedSession.metadata.expiresAt);
    if (now > expiresAt) {
      return NextResponse.json(
        { error: 'Session expired', message: 'This session has expired and is no longer available.' },
        { status: 410, headers }
      );
    }

    // Extract activities for duplication
    const activities = storedSession.sessionData.activities.map(activity => ({
      id: activity.id,
      name: activity.name,
      colorIndex: activity.colorIndex,
      duration: activity.duration
    }));

    const duplicationData: ActivityDuplicationData = {
      activities,
      originalSessionId: sessionId,
      duplicatedAt: new Date().toISOString()
    };

    return NextResponse.json(duplicationData, { headers });

  } catch (error) {
    console.error('Error in activities extraction:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'An unexpected error occurred.' },
      { status: 500, headers }
    );
  }
}