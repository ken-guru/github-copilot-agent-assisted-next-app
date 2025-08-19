/**
 * Client-side utilities for activity duplication from shared sessions
 */

import { duplicateActivitiesFromSession } from '../activity-storage';
import type { ActivityDuplicationData } from '@/types/session-sharing';

/**
 * Fetch activities from a shared session for duplication
 * @param sessionId UUID of the shared session
 * @returns Promise with activity duplication data
 */
export async function fetchActivitiesForDuplication(sessionId: string): Promise<ActivityDuplicationData> {
  const response = await fetch(`/api/sessions/${sessionId}/activities`);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(errorData.message || `Failed to fetch activities: ${response.status}`);
  }
  
  return response.json();
}

/**
 * Complete activity duplication workflow
 * @param sessionId UUID of the shared session
 * @returns Promise that resolves when duplication is complete
 */
export async function duplicateActivitiesWorkflow(sessionId: string): Promise<void> {
  try {
    // Fetch activities from the shared session
    const duplicationData = await fetchActivitiesForDuplication(sessionId);
    
    // Update local storage with duplicated activities
    duplicateActivitiesFromSession(
      duplicationData.activities,
      duplicationData.originalSessionId
    );
    
    // Navigate to main app
    window.location.href = '/';
  } catch (error) {
    console.error('Error in activity duplication workflow:', error);
    throw error;
  }
}

/**
 * Handle activity duplication with user feedback
 * @param sessionId UUID of the shared session
 * @param onSuccess Optional success callback
 * @param onError Optional error callback
 */
export async function handleActivityDuplication(
  sessionId: string,
  onSuccess?: () => void,
  onError?: (error: Error) => void
): Promise<void> {
  try {
    await duplicateActivitiesWorkflow(sessionId);
    onSuccess?.();
  } catch (error) {
    const errorMessage = error instanceof Error ? error : new Error('Unknown error occurred');
    onError?.(errorMessage);
  }
}