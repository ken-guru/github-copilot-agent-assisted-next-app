import type { TimelineEntry } from '@components/feature/Timeline';

interface CalculateTimeSpansProps {
  entries: TimelineEntry[];
  totalDuration: number;
  allActivitiesCompleted: boolean;
  timeLeft: number;
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
}: CalculateTimeSpansProps): CalculateTimeSpansResult {
  let totalGapsDuration = 0;
  const items: TimeSpanItem[] = [];
  let previousEndTime: number | undefined = undefined;

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const currentStartTime = entry.startTime;
    const currentEndTime = entry.endTime;

    // Calculate gap duration
    let gapDuration = 0;
    if (previousEndTime) {
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

    // Calculate activity duration
    let activityDuration: number;
    if (currentEndTime) {
      activityDuration = currentEndTime - currentStartTime;
    } else {
      activityDuration = Date.now() - currentStartTime;
    }

    const activityHeight = (activityDuration / totalDuration) * 100;

    // Add activity to the list
    items.push({
      type: 'activity',
      entry,
      duration: activityDuration,
      height: activityHeight,
    });

    previousEndTime = currentEndTime || Date.now();
  }

  // Calculate remaining gap at the end if all activities are completed and there's time left
  if (allActivitiesCompleted && previousEndTime && timeLeft > 0) {
    const remainingGapDuration = timeLeft;
    totalGapsDuration += remainingGapDuration;

    const remainingGapHeight = (remainingGapDuration / totalDuration) * 100;

    if (remainingGapHeight > 0) {
      items.push({
        type: 'gap',
        duration: remainingGapDuration,
        height: remainingGapHeight,
      });
    }
  }

  return {
    items,
    totalGapsDuration,
  };
}

export { calculateTimeSpans };
