import { useState, useCallback, useEffect } from 'react';
import { Activity } from '@/types/activity';
import { getNextAvailableColorSet } from '@/utils/colors';
import { TimelineEntry } from '@/types';

const TIMELINE_STORAGE_KEY = 'timeline_entries_v1';

export interface UseTimelineEntriesResult {
  timelineEntries: TimelineEntry[];
  addTimelineEntry: (activity: Activity) => void;
  completeCurrentTimelineEntry: () => void;
  resetTimelineEntries: () => void;
}

// Helper functions for localStorage
const loadTimelineEntriesFromStorage = (): TimelineEntry[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(TIMELINE_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch (error) {
    console.warn('Failed to load timeline entries from localStorage:', error);
  }
  
  return [];
};

const saveTimelineEntriesToStorage = (entries: TimelineEntry[]) => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(TIMELINE_STORAGE_KEY, JSON.stringify(entries));
  } catch (error) {
    console.warn('Failed to save timeline entries to localStorage:', error);
  }
};

/**
 * Hook to manage timeline entries with localStorage persistence
 * This hook is responsible for tracking activities over time
 */
export function useTimelineEntries(): UseTimelineEntriesResult {
  const [timelineEntries, setTimelineEntries] = useState<TimelineEntry[]>(() => {
    return loadTimelineEntriesFromStorage();
  });

  // Save to localStorage whenever timeline entries change
  useEffect(() => {
    saveTimelineEntriesToStorage(timelineEntries);
  }, [timelineEntries]);

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
    // Clear localStorage when resetting
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(TIMELINE_STORAGE_KEY);
      } catch (error) {
        console.warn('Failed to clear timeline entries from localStorage:', error);
      }
    }
  }, []);

  return {
    timelineEntries,
    addTimelineEntry,
    completeCurrentTimelineEntry,
    resetTimelineEntries
  };
}