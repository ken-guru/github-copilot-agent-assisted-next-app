/**
 * Session data extraction and preparation utilities
 * @see .kiro/specs/shareable-session-summary/design.md
 */

import { TimelineEntry } from '@/types';
import { 
  SessionSummaryData, 
  ActivitySummary, 
  SkippedActivity, 
  SharedTimelineEntry 
} from '@/types/session-sharing';
import { getActivities } from '@/utils/activity-storage';

/**
 * Props interface matching Summary component for data extraction
 */
export interface SummaryDataProps {
  entries?: TimelineEntry[];
  totalDuration: number;
  elapsedTime: number;
  allActivitiesCompleted?: boolean;
  isTimeUp?: boolean;
  skippedActivityIds?: string[];
}

/**
 * Extract shareable session data from Summary component props
 */
export function extractSessionData(props: SummaryDataProps): SessionSummaryData {
  const {
    entries = [],
    totalDuration,
    elapsedTime,
    isTimeUp = false,
    skippedActivityIds = []
  } = props;

  // Calculate session metrics
  const stats = calculateActivityStats(entries);
  const overtime = calculateOvertime(entries, totalDuration);
  const activityTimes = calculateActivityTimes(entries);
  
  // Get activity data for skipped activities
  const skippedActivities = extractSkippedActivities(skippedActivityIds);
  
  // Convert timeline entries to shareable format
  const timelineEntries = convertTimelineEntries(entries);
  
  // Determine session type
  const sessionType = isTimeUp ? 'timeUp' : 'completed';
  
  const sessionData: SessionSummaryData = {
    plannedTime: totalDuration,
    timeSpent: elapsedTime,
    overtime,
    idleTime: stats.idleTime,
    activities: activityTimes,
    skippedActivities,
    timelineEntries,
    completedAt: new Date().toISOString(),
    sessionType,
  };

  return sessionData;
}

/**
 * Calculate activity statistics from timeline entries
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
 * Calculate overtime from timeline entries
 */
function calculateOvertime(entries: TimelineEntry[], totalDuration: number): number {
  if (!entries || entries.length === 0) return 0;
  
  const firstStart = entries[0]?.startTime;
  if (!firstStart) return 0;
  
  const lastEntry = entries[entries.length - 1];
  const lastEnd = lastEntry?.endTime ?? Date.now();
  const totalTimeUsed = Math.round((lastEnd - firstStart) / 1000);
  
  return Math.max(0, totalTimeUsed - totalDuration);
}/*
*
 * Calculate activity times from timeline entries
 */
function calculateActivityTimes(entries: TimelineEntry[]): ActivitySummary[] {
  if (!entries || entries.length === 0) return [];
  
  const activityMap = new Map<string, { duration: number; name: string; colorIndex: number }>();
  const seenActivityIds = new Set<string>();
  const activityTimes: ActivitySummary[] = [];
  
  // Sort entries by startTime to ensure chronological order
  const sortedEntries = [...entries].sort((a, b) => a.startTime - b.startTime);
  
  // Calculate total durations
  for (const entry of sortedEntries) {
    if (entry.activityId && entry.activityName) {
      const endTime = entry.endTime ?? Date.now();
      const duration = Math.round((endTime - entry.startTime) / 1000);
      
      // Extract color index from colors or use default
      const colorIndex = extractColorIndex(entry);
      
      if (activityMap.has(entry.activityId)) {
        const existing = activityMap.get(entry.activityId)!;
        existing.duration += duration;
      } else {
        activityMap.set(entry.activityId, {
          duration,
          name: entry.activityName,
          colorIndex
        });
      }
      
      // Track first appearance of each activity
      if (!seenActivityIds.has(entry.activityId)) {
        seenActivityIds.add(entry.activityId);
        activityTimes.push({ 
          id: entry.activityId, 
          ...activityMap.get(entry.activityId)! 
        });
      }
    }
  }
  
  // Update durations in activityTimes with final values
  return activityTimes.map(activity => ({
    ...activity,
    duration: activityMap.get(activity.id)!.duration
  }));
}/**

 * Extract color index from timeline entry colors
 */
function extractColorIndex(entry: TimelineEntry): number {
  // Try to match colors to known color indices
  // This is a simplified approach - in a real implementation you might want
  // to maintain a mapping of colors to indices
  if (!entry.colors) return 0;
  
  // For now, return a default color index
  // This could be enhanced to map actual colors to indices
  return 0;
}

/**
 * Extract skipped activities information
 */
function extractSkippedActivities(skippedActivityIds: string[]): SkippedActivity[] {
  if (!skippedActivityIds || skippedActivityIds.length === 0) {
    return [];
  }
  
  try {
    const allActivities = getActivities();
    const activityMap = new Map<string, string>();
    
    for (const activity of allActivities) {
      activityMap.set(activity.id, activity.name);
    }
    
    return skippedActivityIds.map(id => ({
      id,
      name: activityMap.get(id) || id // Fallback to ID if name not found
    }));
  } catch {
    // If we can't get activities from storage, return basic info
    return skippedActivityIds.map(id => ({
      id,
      name: id
    }));
  }
}

/**
 * Convert timeline entries to shareable format
 */
function convertTimelineEntries(entries: TimelineEntry[]): SharedTimelineEntry[] {
  if (!entries || entries.length === 0) return [];
  
  return entries.map(entry => ({
    id: entry.id,
    activityId: entry.activityId,
    activityName: entry.activityName || entry.title || null,
    startTime: entry.startTime,
    endTime: entry.endTime || null,
    colorIndex: extractColorIndex(entry)
  }));
}