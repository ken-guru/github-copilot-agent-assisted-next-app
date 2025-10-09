import { TimelineEntry } from '@/types';

interface CalculateTimeSpansProps {
  entries: TimelineEntry[];
  totalDuration: number;
  allActivitiesCompleted: boolean;
  timeLeft: number;
  nowMs?: number;
}

interface TimeSpanItem {
  type: 'activity' | 'gap';
  entry?: TimelineEntry;
  duration: number;
  height: number;
}

interface CalculateTimeSpansResult {
  items: TimeSpanItem[];
  totalGapsDuration: number;
}

function calculateTimeSpans({
  entries,
  totalDuration,
  allActivitiesCompleted,
  timeLeft,
  nowMs,
}: CalculateTimeSpansProps): CalculateTimeSpansResult {
  const now = typeof nowMs === 'number' ? nowMs : Date.now();
  let totalGapsDuration = 0;
  const items: TimeSpanItem[] = [];
  let previousEndTime: number | undefined = undefined;

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    if (!entry) continue; // Skip undefined entries
    
    const currentStartTime = entry.startTime;
    const currentEndTime = entry.endTime;

    // Check if this is a break entry (both activityId and activityName are null)
    const isBreakEntry = entry.activityId === null && entry.activityName === null;

    // Calculate gap duration (only for gaps between activities, not for break entries)
    let gapDuration = 0;
    if (previousEndTime && !isBreakEntry) {
      gapDuration = Math.max(0, currentStartTime - previousEndTime);
      totalGapsDuration += gapDuration;
    }

    if (gapDuration > 0) {
      const gapHeight = (gapDuration / totalDuration) * 100;
      items.push({
        type: 'gap',
        duration: gapDuration,
        height: gapHeight,
      });
    }

    // If this is a break entry, treat it as a gap
    if (isBreakEntry) {
      let breakDuration: number;
      if (currentEndTime) {
        breakDuration = currentEndTime - currentStartTime;
      } else {
        breakDuration = now - currentStartTime;
      }

      const breakHeight = (breakDuration / totalDuration) * 100;
      items.push({
        type: 'gap',
        duration: breakDuration,
        height: breakHeight,
      });
      totalGapsDuration += breakDuration;

      // Update previousEndTime for break entries too
      if (currentEndTime !== undefined && currentEndTime !== null) {
        previousEndTime = currentEndTime;
      }
    } else {
      // Calculate activity duration for regular activities
      let activityDuration: number;
      if (currentEndTime) {
        activityDuration = currentEndTime - currentStartTime;
      } else {
        activityDuration = now - currentStartTime;
      }

      const activityHeight = (activityDuration / totalDuration) * 100;
      items.push({
        type: 'activity',
        entry: entry,
        duration: activityDuration,
        height: activityHeight,
      });

      // Only assign currentEndTime to previousEndTime if it's defined
      if (currentEndTime !== undefined && currentEndTime !== null) {
        previousEndTime = currentEndTime;
      }
    }
  }

  // Add ongoing break if last activity is completed
  if (entries.length > 0) {
    const lastEntry = entries[entries.length - 1];
    if (lastEntry && lastEntry.endTime) {
      const ongoingBreakDuration = now - lastEntry.endTime;
      if (ongoingBreakDuration > 0) {
        const breakHeight = (ongoingBreakDuration / totalDuration) * 100;
        items.push({
          type: 'gap',
          duration: ongoingBreakDuration,
          height: breakHeight,
        });
        totalGapsDuration += ongoingBreakDuration;
      }
    }
  }

  // Handle remaining time if all activities are completed
  if (allActivitiesCompleted && timeLeft > 0) {
    const remainingHeight = (timeLeft / totalDuration) * 100;
    items.push({
      type: 'gap',
      duration: timeLeft,
      height: remainingHeight,
    });
  }

  return {
    items,
    totalGapsDuration,
  };
}

export { calculateTimeSpans };