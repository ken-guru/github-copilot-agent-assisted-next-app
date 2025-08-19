/**
 * Client-side utilities for activity duplication from shared sessions
 */
import { ActivitySummary } from '@/types/session-sharing';
import { duplicateActivitiesFromSession } from '@/utils/activity-storage';

export interface ActivityDuplicationData {
  activities: ActivitySummary[];
  originalSessionId: string;
  duplicatedAt: string;
}

export interface DuplicationResult {
  success: boolean;
  error?: string;
  redirectUrl?: string;
}

/**
 * Extract activities from shared session data for duplication
 * @param sessionData Session data from shared session
 * @returns Array of ActivitySummary objects
 */
export function extractActivitiesForDuplication(sessionData: unknown): ActivitySummary[] {
  const data = sessionData as { activities?: unknown[] };
  
  if (!data?.activities || !Array.isArray(data.activities)) {
    throw new Error('Invalid session data: missing activities');
  }

  return data.activities.map((activity: unknown) => {
    const act = activity as Record<string, unknown>;
    return {
      id: act.id as string,
      name: act.name as string,
      duration: act.duration as number,
      colorIndex: act.colorIndex as number
    };
  });
}

/**
 * Duplicate activities from a shared session to local storage
 * @param sessionData Session data containing activities to duplicate
 * @param originalSessionId UUID of the original shared session
 * @returns Promise resolving to duplication result
 */
export async function duplicateActivitiesFromSharedSession(
  sessionData: unknown,
  originalSessionId: string
): Promise<DuplicationResult> {
  try {
    // Validate inputs
    if (!sessionData) {
      return {
        success: false,
        error: 'Invalid session data provided'
      };
    }

    if (!originalSessionId || typeof originalSessionId !== 'string') {
      return {
        success: false,
        error: 'Invalid session ID provided'
      };
    }

    // Extract activities
    const activities = extractActivitiesForDuplication(sessionData);
    
    if (activities.length === 0) {
      return {
        success: false,
        error: 'No activities found in shared session'
      };
    }

    // Duplicate activities to local storage
    duplicateActivitiesFromSession(activities, originalSessionId);

    return {
      success: true,
      redirectUrl: '/' // Redirect to main app
    };

  } catch (error) {
    console.error('Error duplicating activities:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to duplicate activities'
    };
  }
}

/**
 * Create a shareable session from duplicated activities
 * This is called when a user completes a session that was duplicated from another session
 * @param sessionData New session data to share
 * @param originalSessionId UUID of the session this was duplicated from
 * @returns Promise resolving to share result
 */
export async function createLinkedSharedSession(
  sessionData: unknown,
  originalSessionId: string
): Promise<{ success: boolean; shareUrl?: string; error?: string }> {
  try {
    const response = await fetch('/api/sessions/duplicate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sourceSessionId: originalSessionId,
        newSessionData: sessionData
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create linked session');
    }

    const result = await response.json();
    
    return {
      success: true,
      shareUrl: result.shareUrl
    };

  } catch (error) {
    console.error('Error creating linked shared session:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create linked session'
    };
  }
}

/**
 * Check if current activities were duplicated from a shared session
 * @returns Object with duplication status and original session ID
 */
export function getDuplicationStatus(): {
  isDuplicated: boolean;
  originalSessionId: string | null;
  duplicatedAt: string | null;
} {
  try {
    const originalSessionId = localStorage.getItem('originalSessionId');
    const duplicatedAt = localStorage.getItem('activitiesDuplicatedAt');
    
    return {
      isDuplicated: originalSessionId !== null,
      originalSessionId,
      duplicatedAt
    };
  } catch {
    return {
      isDuplicated: false,
      originalSessionId: null,
      duplicatedAt: null
    };
  }
}

/**
 * Clear duplication tracking information
 * Called when user manually resets activities or creates new ones
 */
export function clearDuplicationTracking(): void {
  try {
    localStorage.removeItem('originalSessionId');
    localStorage.removeItem('activitiesDuplicatedAt');
  } catch {
    // Silently fail if localStorage is not available
  }
}

/**
 * Handle activity duplication from shared session page
 * @param sessionId UUID of the shared session
 * @param onSuccess Success callback function
 * @param onError Error callback function
 */
export async function handleActivityDuplication(
  sessionId: string,
  onSuccess: () => void,
  onError: (error: Error) => void
): Promise<void> {
  try {
    // Fetch session data
    const response = await fetch(`/api/sessions/${sessionId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch session data');
    }
    
    const { sessionData } = await response.json();
    
    // Duplicate activities
    const result = await duplicateActivitiesFromSharedSession(sessionData, sessionId);
    
    if (result.success) {
      onSuccess();
      
      // Navigate to main app after a short delay
      setTimeout(() => {
        window.location.href = result.redirectUrl || '/';
      }, 1500);
    } else {
      throw new Error(result.error || 'Failed to duplicate activities');
    }
    
  } catch (error) {
    onError(error instanceof Error ? error : new Error('Unknown error occurred'));
  }
}