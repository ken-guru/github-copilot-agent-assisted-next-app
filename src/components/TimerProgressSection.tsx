import React from 'react';
import { TimelineEntry } from '@/types';
import ProgressBar from './ProgressBar';

interface TimerProgressSectionProps {
  entries: TimelineEntry[];
  totalDuration: number;
  elapsedTime: number;
  timerActive: boolean;
}

/**
 * Memoized timer progress section that only re-renders when timer-related props change.
 * This component is completely isolated from activity management state to prevent
 * timer updates from affecting other UI components like forms.
 */
const TimerProgressSection = React.memo<TimerProgressSectionProps>(({
  entries,
  totalDuration,
  elapsedTime,
  timerActive
}) => {
  return (
    <div className="flex-shrink-0 mb-3">
      <ProgressBar 
        entries={entries}
        totalDuration={totalDuration}
        elapsedTime={elapsedTime}
        timerActive={timerActive}
      />
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison to ensure we only re-render when timer-related props change
  return (
    prevProps.totalDuration === nextProps.totalDuration &&
    prevProps.elapsedTime === nextProps.elapsedTime &&
    prevProps.timerActive === nextProps.timerActive &&
    prevProps.entries === nextProps.entries
  );
});

TimerProgressSection.displayName = 'TimerProgressSection';

export default TimerProgressSection;
