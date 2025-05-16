import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

export interface TimelineEntry {
  id: string;
  activityId: string;
  startTime: number;
  endTime?: number;
  title: string;
  description: string;
}

interface NewTimelineEntry {
  activityId: string;
  startTime: number;
  title: string;
  description: string;
}

export interface UseTimelineEntriesResult {
  timelineEntries: TimelineEntry[];
  addTimelineEntry: (entry: NewTimelineEntry) => void;
  resetTimeline: () => void;
}

/**
 * Hook to manage timeline entries
 */
export function useTimelineEntries(): UseTimelineEntriesResult {
  const [timelineEntries, setTimelineEntries] = useState<TimelineEntry[]>([]);
  
  const addTimelineEntry = useCallback((entry: NewTimelineEntry) => {
    const newEntry: TimelineEntry = {
      id: uuidv4(),
      activityId: entry.activityId,
      startTime: entry.startTime,
      title: entry.title,
      description: entry.description,
    };
    
    setTimelineEntries(entries => [...entries, newEntry]);
  }, []);
  
  const resetTimeline = useCallback(() => {
    setTimelineEntries([]);
  }, []);
  
  return {
    timelineEntries,
    addTimelineEntry,
    resetTimeline
  };
}
