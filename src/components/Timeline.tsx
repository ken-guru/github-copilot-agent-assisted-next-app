import React, { useMemo, useEffect, useState } from 'react';
import styles from './Timeline.module.css';
import { useTheme } from '@/contexts/ThemeContext';
import ProgressBar from './ProgressBar';
import { calculateTimeSpans } from '@/utils/timelineCalculations';
import { formatTimeHuman } from '@/utils/time'; // Import formatTimeHuman

export interface TimelineEntry {
  id: string;
  activityId: string | null;
  activityName: string | null;
  startTime: number;
  endTime?: number; // Make endTime optional to support active entries
  colors?: {
    background: string;
    text: string;
    border: string;
  };
}

interface TimelineProps {
  entries: TimelineEntry[];
  totalDuration: number;
  elapsedTime: number;
  isTimeUp?: boolean;
  timerActive?: boolean;
  allActivitiesCompleted?: boolean;
}

function calculateTimeIntervals(totalDuration: number): { interval: number; count: number } {
  const totalSeconds = Math.floor(totalDuration / 1000);
  
  if (totalSeconds <= 60) { // 1 minute or less
    return { interval: 10, count: Math.ceil(totalSeconds / 10) }; // 10-second intervals
  } else if (totalSeconds <= 300) { // 5 minutes or less
    return { interval: 30, count: Math.ceil(totalSeconds / 30) }; // 30-second intervals
  } else if (totalSeconds <= 600) { // 10 minutes or less
    return { interval: 60, count: Math.ceil(totalSeconds / 60) }; // 1-minute intervals
  } else if (totalSeconds <= 3600) { // 1 hour or less
    return { interval: 300, count: Math.ceil(totalSeconds / 300) }; // 5-minute intervals
  } else if (totalSeconds <= 7200) { // 2 hours or less
    return { interval: 600, count: Math.ceil(totalSeconds / 600) }; // 10-minute intervals
  } else {
    return { interval: 1800, count: Math.ceil(totalSeconds / 1800) }; // 30-minute intervals
  }
}

// Update the helper function to handle undefined endTime
function getGapDuration(currentStartTime: number, previousEndTime: number | undefined): number {
  if (!previousEndTime) return 0;
  return Math.max(0, currentStartTime - previousEndTime);
}

export default function Timeline({ entries, totalDuration, elapsedTime, isTimeUp = false, timerActive = false, allActivitiesCompleted = false }: TimelineProps) {
  const { isDarkMode } = useTheme();
  const hasEntries = entries.length > 0;
  const [now, setNow] = useState(Date.now());
  
  // Update 'now' every second when there's an active entry
  useEffect(() => {
    if (!hasEntries || !entries[entries.length - 1]?.endTime) {
      const interval = setInterval(() => setNow(Date.now()), 1000);
      return () => clearInterval(interval);
    }
  }, [hasEntries, entries]);

  // Calculate time remaining display
  const timeLeft = totalDuration - elapsedTime;
  const isOvertime = timeLeft < 0;
  const timeDisplay = timerActive 
    ? `${isOvertime ? 'Overtime: ' : 'Time Left: '}${formatTimeHuman(Math.abs(timeLeft) * 1000)}`
    : `Timer ready: ${formatTimeHuman(totalDuration * 1000)}`;

  const timeMarkers = useMemo(() => {
    const { interval, count } = calculateTimeIntervals(totalDuration * 1000);
    return Array.from({ length: count + 1 }, (_, i) => {
      const milliseconds = i * interval * 1000;
      return {
        time: milliseconds,
        position: (milliseconds / (totalDuration * 1000)) * 100,
        label: formatTimeHuman(milliseconds)
      };
    });
  }, [totalDuration]);

  const timeSpansData = useMemo(() => {
    return calculateTimeSpans({
      entries,
      totalDuration,
      now,
      allActivitiesCompleted,
      timeLeft,
    });
  }, [entries, totalDuration, now, allActivitiesCompleted, timeLeft]);

  const calculateEntryStyle = (item: { type: 'activity' | 'gap'; entry?: TimelineEntry; duration: number; height: number }) => {
    const style: React.CSSProperties = {
      height: `${item.height}%`,
      minHeight: item.height < 5 ? '2rem' : undefined // Minimum height for very short entries
    };

    if (item.type === 'gap') {
      return {
        ...style,
        backgroundColor: 'var(--background-muted)',
        borderColor: 'var(--border)',
        color: 'var(--foreground-muted)',
      };
    }

    const colors = item.entry?.colors || {
      background: 'var(--background-muted)',
      text: 'var(--text-secondary)',
      border: 'var(--border)'
    };

    return {
      ...style,
      backgroundColor: colors.background,
      borderColor: colors.border,
      color: colors.text,
    };
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.heading}>Timeline</h2>
        <div 
          className={`${styles.timeDisplay} ${isTimeUp ? styles.timeDisplayOvertime : ''}`}
          data-testid="time-display"
        >
          {timeDisplay}
        </div>
      </div>
      
      <ProgressBar
        entries={entries}
        totalDuration={totalDuration}
        elapsedTime={elapsedTime}
        timerActive={hasEntries}
        isDarkMode={isDarkMode}
      />

      <div className={styles.timelineContainer}>
        <div className={styles.timelineRuler}>
          {timeMarkers.map(({ time, position, label }) => (
            <div
              key={time}
              className={styles.timeMarker}
              style={{ top: `${position}%` }}
            >
              {label}
            </div>
          ))}
        </div>
        
        <div className={styles.entriesContainer}>
          <div className={styles.timeGuides}>
            {timeMarkers.map(({ time, position }) => (
              <div
                key={time}
                className={styles.timeGuide}
                style={{ top: `${position}%` }}
              />
            ))}
          </div>

          <div className={styles.entriesWrapper}>
            {hasEntries ? (
              timeSpansData.items.map((item, index) => {
                const style = calculateEntryStyle(item);
                
                if (item.type === 'gap') {
                  if (allActivitiesCompleted && index === timeSpansData.items.length - 1) {
                    return (
                      <div
                        key="remaining"
                        className={styles.timeGap}
                        style={style}
                      >
                        <span>Time Remaining ({formatTimeHuman(item.duration)})</span>
                      </div>
                    );
                  }
                  return (
                    <div
                      key={`gap-${index}`}
                      className={styles.timeGap}
                      style={style}
                    >
                      <span>Break ({formatTimeHuman(item.duration)})</span>
                    </div>
                  );
                }

                return (
                  <div key={item.entry!.id} className={styles.timelineEntry} style={style}>
                    <div className={styles.entryContent}>
                      <div className={styles.entryHeader}>
                        <span
                          className={styles.activityName}
                          data-testid="timeline-activity-name"
                        >
                          {item.entry!.activityName}
                        </span>
                        <span className={styles.timeInfo}>
                          {formatTimeHuman(item.duration)} {/* Use formatTimeHuman */}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className={styles.noEntries}>
                No activities started yet
              </div>
            )}
          </div>
        </div>
      </div>
      
      {isTimeUp && hasEntries && (
        <div className={styles.warningMessage} data-testid="overtime-warning">
          <strong>Warning:</strong> You've exceeded the planned time!
        </div>
      )}
    </div>
  );
}