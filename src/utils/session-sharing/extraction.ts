/**
 * Session data extraction utilities for sharing functionality
 * @see .kiro/specs/shareable-session-summary/design.md
 */

import type { TimelineEntry } from '@/types';
import type { 
  SessionSummaryData, 
  ActivitySummary, 
  SkippedActivity, 
  SharedTimelineEntry 
} from '@/types/session-sharing';
import { getActivities } from '@/utils/activity-storage';

/**
 * Extract session summary data from Summary component props
 */
export function extractSessionSummaryData(
  entries: TimelineEntry[],
  totalDuration: number,
  elapsedTime: number,
  allActivitiesCompleted: boolean,
  isTimeUp: boolean,
  skippedActivityIds: string[] = []
): SessionSummaryData {
  // Calculate activity statistics
  const stats = calculateActivityStats(entries);
  const overtime = calculateOvertime(entries, totalDuration);
  const activityTimes = calculateActivityTimes(entries);
  
  // Build activity summaries
  const activities: ActivitySummary[] = activityTimes.map(activity => ({
    id: activity.id,
    name: activity.name,
    duration: activity.duration,
    colorIndex: activity.colorIndex || 0,
  }));

  // Build skipped activities list
  const skippedActivities: SkippedActivity[] = buildSkippedActivities(skippedActivityIds);

  // Convert timeline entries to shared format
  const timelineEntries: SharedTimelineEntry[] = entries.map(entry => ({
    id: entry.id,
    activityId: entry.activityId,
    activityName: entry.activityName || entry.title || null,
    startTime: entry.startTime,
    endTime: entry.endTime || null,
    colorIndex: extractColorIndex(entry),
  }));

  // Determine session type
  const sessionType: 'completed' | 'timeUp' = isTimeUp ? 'timeUp' : 'completed';

  return {
    plannedTime: totalDuration,
    timeSpent: elapsedTime,
    overtime,
    idleTime: stats.idleTime,
    activities,
    skippedActivities,
    timelineEntries,
    completedAt: new Date().toISOString(),
    sessionType,
  };
}

/**
 * Calculate activity statistics (idle time, active time)
 */
function calculateActivityStats(entries: TimelineEntry[]): { idleTime: number; activeTime: number } {
  if (!entries || entries.length === 0) {
    return { idleTime: 0, activeTime: 0 };
  }
  
  const stats = { idleTime: 0, activeTime: 0 };
  let lastEndTime: number | null = null;
  
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    if (!entry) continue;
    
    const endTime = entry.endTime ?? Date.now();
    
    // Calculate break time between activities
    if (lastEndTime && entry.startTime > lastEndTime) {
      stats.idleTime += Math.round((entry.startTime - lastEndTime) / 1000);
    }
    
    // Calculate activity duration
    const duration = Math.round((endTime - entry.startTime) / 1000);
    
    if (entry.activityId) {
      stats.activeTime += duration;
    } else {
      stats.idleTime += duration;
    }
    
    lastEndTime = endTime;
  }
  
  return stats;
}

/**
 * Calculate overtime beyond planned duration
 */
function calculateOvertime(entries: TimelineEntry[], totalDuration: number): number {
  if (!entries || entries.length === 0) return 0;
  
  // Get the timestamp of the first activity start
  const firstStart = entries[0]?.startTime;
  if (!firstStart) return 0;
  
  // Calculate total time from first activity to last completion or now
  const lastEntry = entries[entries.length - 1];
  const lastEnd = lastEntry?.endTime ?? Date.now();
  const totalTimeUsed = Math.round((lastEnd - firstStart) / 1000);
  
  // Calculate overtime as any time spent beyond the planned duration
  return Math.max(0, totalTimeUsed - totalDuration);
}

/**
 * Calculate time spent per activity
 */
function calculateActivityTimes(entries: TimelineEntry[]): Array<{
  id: string;
  name: string;
  duration: number;
  colorIndex: number;
}> {
  if (!entries || entries.length === 0) return [];
  
  const activityTimes: Array<{
    id: string;
    name: string;
    duration: number;
    colorIndex: number;
  }> = [];
  const activityMap = new Map<string, {
    duration: number;
    name: string;
    colorIndex: number;
  }>();
  const seenActivityIds = new Set<string>();
  
  // Sort entries by startTime to ensure chronological order
  const sortedEntries = [...entries].sort((a, b) => a.startTime - b.startTime);
  
  // First pass: Calculate total durations
  for (const entry of sortedEntries) {
    if (entry.activityId && (entry.activityName || entry.title)) {
      const endTime = entry.endTime ?? Date.now();
      const duration = Math.max(0, Math.round((endTime - entry.startTime) / 1000));
      const name = entry.activityName || entry.title || 'Unknown Activity';
      const colorIndex = extractColorIndex(entry);
      
      if (activityMap.has(entry.activityId)) {
        const existing = activityMap.get(entry.activityId)!;
        existing.duration += duration;
      } else {
        activityMap.set(entry.activityId, {
          duration,
          name,
          colorIndex,
        });
      }
      
      // Track first appearance of each activity
      if (!seenActivityIds.has(entry.activityId)) {
        seenActivityIds.add(entry.activityId);
        activityTimes.push({
          id: entry.activityId,
          ...activityMap.get(entry.activityId)!,
        });
      }
    }
  }
  
  // Update durations in activityTimes with final values
  return activityTimes.map(activity => ({
    ...activity,
    duration: activityMap.get(activity.id)!.duration,
  }));
}

/**
 * Build skipped activities list with names from storage
 */
function buildSkippedActivities(skippedActivityIds: string[]): SkippedActivity[] {
  if (!skippedActivityIds || skippedActivityIds.length === 0) {
    return [];
  }

  const namesById = new Map<string, string>();
  
  try {
    const allActivities = getActivities();
    for (const activity of allActivities) {
      namesById.set(activity.id, activity.name);
    }
  } catch {
    // Ignore storage errors; fall back to id as name
  }
  
  return skippedActivityIds.map(id => ({
    id,
    name: namesById.get(id) || id,
  }));
}

/**
 * Extract color index from timeline entry colors
 * This is a simplified approach that tries to map colors back to indices
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function extractColorIndex(_entry: TimelineEntry): number {
  // For now, we'll use a simple approach and return 0 as default
  // In a more sophisticated implementation, we could try to match
  // the colors back to the original color indices from the activity storage
  return 0;
}