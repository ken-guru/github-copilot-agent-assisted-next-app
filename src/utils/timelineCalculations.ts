import { TimelineEntry } from '@/components/Timeline';

interface CalculateTimeSpansProps {
  entries: TimelineEntry[];
  totalDuration: number;
  now: number;
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
  totalTimeSpan: number;
  items: TimeSpanItem[];
}

function getGapDuration(currentStartTime: number, previousEndTime: number | undefined): number {
  if (!previousEndTime) return 0;
  return Math.max(0, currentStartTime - previousEndTime);
}

export function calculateTimeSpans({
  entries,
  totalDuration,
  now,
  allActivitiesCompleted,
  timeLeft,
}: CalculateTimeSpansProps): CalculateTimeSpansResult {
  const hasEntries = entries.length > 0;
  if (!hasEntries) return { totalTimeSpan: 0, items: [] };

  // Get the actual time used by entries
  const lastEntry = entries[entries.length - 1];
  const lastEndTime = lastEntry.endTime || now;
  const firstStartTime = entries[0].startTime;
  const actualDuration = lastEndTime - firstStartTime;

  // Use totalDuration for scaling to maintain consistent proportions
  const totalTimeSpan = totalDuration * 1000;

  const items: TimeSpanItem[] = entries.reduce((acc: TimeSpanItem[], entry, index) => {
    // If there's a previous entry, check for a gap
    if (index > 0) {
      const previousEntry = entries[index - 1];
      const gapDuration = getGapDuration(entry.startTime, previousEntry.endTime);

      if (gapDuration > 0) {
        acc.push({
          type: 'gap',
          duration: gapDuration,
          height: (gapDuration / totalTimeSpan) * 100,
        });
      }
    }

    // Add the activity itself, using current time for active entries
    const currentDuration = (entry.endTime === undefined ? now : entry.endTime) - entry.startTime;

    const height = (currentDuration / totalTimeSpan) * 100;
    // console.log(`Entry ${entry.activityName} - Duration: ${currentDuration}, Height: ${height}`);

    acc.push({
      type: 'activity',
      entry,
      duration: currentDuration,
      height,
    });

    return acc;
  }, []);

  // Add remaining time entry if all activities are completed and there is time left
  if (allActivitiesCompleted && timeLeft > 0) {
    const height = (timeLeft * 1000 / totalTimeSpan) * 100;
    console.log(`Remaining Time - Duration: ${timeLeft * 1000}, Height: ${height}`);
    items.push({
      type: 'gap',
      duration: timeLeft * 1000,
      height,
    });
  }

  return { totalTimeSpan, items };
}