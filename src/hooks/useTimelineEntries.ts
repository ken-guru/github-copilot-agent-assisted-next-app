import { useState, useCallback } from 'react';
import { Activity } from '@/components/ActivityManager';
import { getNextAvailableColorSet } from '@/utils/colors';

export interface TimelineEntry {
  id: string;
  activityId: string | null;
  activityName: string | null;
  startTime: number;
  endTime: number | null;
  colors?: {
    background: string;
    border: string;
    text: string;
  };
}

export interface UseTimelineEntriesResult {
  timelineEntries: TimelineEntry[];
  addTimelineEntry: (activity: Activity) => void;
  completeCurrentTimelineEntry: () => void;
  resetTimelineEntries: () => void;
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
      colors: activity.colors || getNextAvailableColorSet(activity.colorIndex || 0)
    };
    
    setTimelineEntries(prev => [...prev, newEntry]);
  }, []);

  const completeCurrentTimelineEntry = useCallback(() => {
    if (timelineEntries.length === 0) return;

    const lastEntry = timelineEntries[timelineEntries.length - 1];
    if (!lastEntry.endTime) {
      setTimelineEntries(prev => {
        const updatedEntries = [...prev];
        updatedEntries[prev.length - 1] = {
          ...lastEntry,
          endTime: Date.now()
        };
        return updatedEntries;
      });
    }
  }, [timelineEntries]);

  const resetTimelineEntries = useCallback(() => {
    setTimelineEntries([]);
  }, []);

  return {
    timelineEntries,
    addTimelineEntry,
    completeCurrentTimelineEntry,
    resetTimelineEntries
  };
}