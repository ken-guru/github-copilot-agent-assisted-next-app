/**
 * Shared session page route
 * /shared/[uuid]
 * 
 * Server-side rendered page for viewing shared session summaries
 * @see .kiro/specs/shareable-session-summary/design.md
 * @see .kiro/specs/shareable-session-summary/requirements.md
 */

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SharedSummaryClient from '@/components/SharedSummaryClient';
import { validateSessionSharingId } from '@/utils/uuid';
import type { 
  SharedSessionPageProps, 
  GetSessionResponse
} from '@/types/session-sharing';

/**
 * Generate metadata for shared session pages
 */
export async function generateMetadata({ 
  params 
}: SharedSessionPageProps): Promise<Metadata> {
  try {
    // Validate UUID format first
    const sessionId = validateSessionSharingId(params.uuid);
    
    // Fetch session data for metadata generation
    const sessionData = await fetchSessionData(sessionId);
    
    if (!sessionData) {
      return {
        title: 'Session Not Found - Mr. Timely',
        description: 'The requested session could not be found.',
        robots: 'noindex, nofollow',
      };
    }

    const { sessionData: data } = sessionData;
    
    // Calculate basic stats for description
    const activityCount = data.activities.length;
    const totalTime = Math.round(data.timeSpent / 60); // Convert to minutes
    const completedDate = new Date(data.completedAt).toLocaleDateString();
    
    return {
      title: `Shared Session Summary - ${completedDate} - Mr. Timely`,
      description: `View a shared time tracking session with ${activityCount} activities and ${totalTime} minutes of tracked time. Completed on ${completedDate}.`,
      openGraph: {
        title: `Time Tracking Session - ${completedDate}`,
        description: `${activityCount} activities, ${totalTime} minutes tracked`,
        type: 'website',
        siteName: 'Mr. Timely',
      },
      twitter: {
        card: 'summary',
        title: `Time Tracking Session - ${completedDate}`,
        description: `${activityCount} activities, ${totalTime} minutes tracked`,
      },
      robots: 'noindex, nofollow', // Don't index shared sessions for privacy
    };
  } catch {
    // If anything fails, return basic metadata
    return {
      title: 'Shared Session - Mr. Timely',
      description: 'View a shared time tracking session summary.',
      robots: 'noindex, nofollow',
    };
  }
}

/**
 * Fetch session data from API
 */
async function fetchSessionData(sessionId: string): Promise<GetSessionResponse | null> {
  try {
    // Construct the full URL for the API call
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000'
        : 'https://mr-timely.vercel.app'; // Fallback to production URL

    const response = await fetch(`${baseUrl}/api/sessions/${sessionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mr. Timely SSR/1.0',
      },
      // Add cache control for server-side fetching
      next: { 
        revalidate: 300, // Revalidate every 5 minutes
        tags: [`session-${sessionId}`]
      },
    });

    if (!response.ok) {
      // Log the error for debugging but don't expose details
      console.error('Failed to fetch session data:', {
        sessionId: sessionId.slice(0, 8) + '***',
        status: response.status,
        statusText: response.statusText,
        timestamp: new Date().toISOString(),
      });
      return null;
    }

    const data: GetSessionResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching session data:', {
      sessionId: sessionId.slice(0, 8) + '***',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    });
    return null;
  }
}

/**
 * Shared session page component
 */
export default async function SharedSessionPage({ 
  params 
}: SharedSessionPageProps) {
  let sessionId: string;
  
  // Validate UUID format
  try {
    sessionId = validateSessionSharingId(params.uuid);
  } catch {
    // Invalid UUID format - show 404
    notFound();
  }

  // Fetch session data
  const sessionResponse = await fetchSessionData(sessionId);
  
  if (!sessionResponse) {
    // Session not found, expired, or error occurred - show 404
    notFound();
    return null; // This won't be reached in production, but helps with testing
  }

  const { sessionData, metadata } = sessionResponse;

  // Handle activity duplication callback
  const handleDuplicateActivities = () => {
    // This is a no-op for server-side rendering
    // The actual functionality is handled client-side in SharedSummary component
    console.log('Activity duplication initiated for session:', sessionId.slice(0, 8) + '***');
  };

  return (
    <div className="container-fluid py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-10 col-xl-8">
          <SharedSummaryClient
            sessionData={sessionData}
            sharedAt={metadata.createdAt}
            expiresAt={metadata.expiresAt}
            onDuplicateActivities={handleDuplicateActivities}
          />
        </div>
      </div>
    </div>
  );
}