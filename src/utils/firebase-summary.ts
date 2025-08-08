// src/utils/firebase-summary.ts
// Utility for writing activity summaries to Firebase Realtime Database
import { getFirebaseDatabase } from './firebase';
import { ref, set, push } from 'firebase/database';
import { Activity } from '../types/activity';

export interface ActivitySummary {
  userId: string; // For future multi-user support
  timestamp: string; // ISO string
  activities: Activity[];
  totalDuration: number;
  elapsedTime: number;
  overtime: number;
}

/**
 * Writes an activity summary to Firebase Realtime Database
 * @param summary ActivitySummary object
 * @returns Promise<void>
 */
export async function writeActivitySummary(summary: ActivitySummary): Promise<void> {
  // Debug log: called with summary
  // eslint-disable-next-line no-console
  console.log('[writeActivitySummary] called', summary);
  const db = getFirebaseDatabase();
  // Store under /summaries/{userId}/auto-generated-key
  const summaryRef = ref(db, `summaries/${summary.userId}`);
  try {
    await push(summaryRef, summary);
    // eslint-disable-next-line no-console
    console.log('[writeActivitySummary] successfully pushed summary');
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[writeActivitySummary] error:', err);
    throw err;
  }
}
