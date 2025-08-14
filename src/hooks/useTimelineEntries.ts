import { useState, useCallback } from 'react';
import { Activity } from '@/types/activity';
import { getNextAvailableColorSet } from '@/utils/colors';
import { TimelineEntry } from '@/types';

export interface UseTimelineEntriesResult {
  timelineEntries: TimelineEntry[];
  addTimelineEntry: (activity: Activity) => void;
  completeCurrentTimelineEntry: () => void;
  resetTimelineEntries: () => void;
  restoreTimelineEntries: (entries: TimelineEntry[]) => void;
}

/**
 * Hook to manage timeline entries
 * This hook is responsible for tracking activities over time
 */
export function useTimelineEntries(): UseTimelineEntriesResult {
  const [timelineEntries, setTimelineEntries] = useState<TimelineEntry[]>([]);

  const addTimelineEntry = useCallback((activity: Activity) => {
    const newEntry: TimelineEntry = {
      id: Date.now().toString(),
      activityId: activity.id,
      activityName: activity.name,
      startTime: Date.now(),
      endTime: null,
  colors: getNextAvailableColorSet(activity.colorIndex || 0)
    };
    
    setTimelineEntries(prev => [...prev, newEntry]);
  }, []);

  const completeCurrentTimelineEntry = useCallback(() => {
    if (timelineEntries.length === 0) return;

    const lastEntry = timelineEntries[timelineEntries.length - 1];
    // Check if lastEntry exists and has no endTime
    if (lastEntry && !lastEntry.endTime) {
      setTimelineEntries(prev => {
        const updatedEntries = [...prev];
        if (prev.length > 0) {
          updatedEntries[prev.length - 1] = {
            ...lastEntry,
            endTime: Date.now(),
            // Ensure required fields are present
            id: lastEntry.id || `entry-${Date.now()}`,
            startTime: lastEntry.startTime,
            activityId: lastEntry.activityId || null,
            activityName: lastEntry.activityName || null
          };
        }
        return updatedEntries;
      });
    }
  }, [timelineEntries]);

  const resetTimelineEntries = useCallback(() => {
    setTimelineEntries([]);
  }, []);

  const restoreTimelineEntries = useCallback((entries: TimelineEntry[]) => {
    setTimelineEntries(entries);
  }, []);

  return {
    timelineEntries,
    addTimelineEntry,
    completeCurrentTimelineEntry,
    resetTimelineEntries,
    restoreTimelineEntries
  };
}