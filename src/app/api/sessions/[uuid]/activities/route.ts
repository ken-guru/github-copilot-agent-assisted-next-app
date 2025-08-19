import { NextRequest, NextResponse } from 'next/server';
import { head } from '@vercel/blob';
import { validateUUID } from '@/utils/uuid';
import { rateLimiters, getClientIP } from '@/utils/security/rateLimiting';
import { StoredSession } from '@/types/session-sharing';

export async function GET(
  request: NextRequest,
  { params }: { params: { uuid: string } }
) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    const rateLimitResult = await rateLimiters.retrieveSession.checkLimit(clientIP);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    // Validate UUID format
    if (!validateUUID(params.uuid)) {
      return NextResponse.json(
        { error: 'Invalid session ID format' },
        { status: 400 }
      );
    }

    // Check if session exists
    const sessionUrl = `sessions/${params.uuid}.json`;
    
    try {
      await head(sessionUrl, {
        token: process.env.BLOB_READ_WRITE_TOKEN
      });
    } catch {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    // Fetch session data from Vercel Blob
    let storedSession: StoredSession;
    try {
      const response = await fetch(`https://blob.vercel-storage.com/${sessionUrl}`);
      
      if (!response.ok) {
        throw new Error(`Blob fetch failed: ${response.status}`);
      }

      const sessionDataText = await response.text();
      storedSession = JSON.parse(sessionDataText) as StoredSession;

      // Check if session is expired
      const now = new Date();
      const expiresAt = new Date(storedSession.metadata.expiresAt);
      
      if (now > expiresAt) {
        return NextResponse.json(
          { error: 'Session has expired' },
          { status: 410 }
        );
      }

      // Extract activities for duplication
      const activities = storedSession.sessionData.activities.map(activity => ({
        id: activity.id,
        name: activity.name,
        colorIndex: activity.colorIndex,
        duration: activity.duration
      }));

      return NextResponse.json({
        activities,
        sessionId: params.uuid,
        totalActivities: activities.length
      });

    } catch (error) {
      console.error('Failed to retrieve session from Vercel Blob:', error);
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

  } catch (error) {
    console.error('Error fetching session activities:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}