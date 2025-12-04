"use client";

import React, { useMemo, useEffect, useState } from 'react';
import styles from './Timeline.module.css';
import { calculateTimeSpans } from '@/utils/time/timelineCalculations';
import { formatTimeHuman } from '@/utils/time';
import { useThemeReactive } from '@/hooks/useThemeReactive';

/**
 * Represents an entry in the timeline
 */
export interface TimelineEntry {
  /**
   * Unique identifier for the timeline entry
   */
  id: string;
  
  /**
   * The ID of the associated activity, or null if this is a break
   */
  activityId: string | null;
  
  /**
   * The name of the associated activity, or null if this is a break
   */
  activityName: string | null;
  
  /**
   * Timestamp when this activity/break started (in milliseconds)
   */
  startTime: number;
  
  /**
   * Timestamp when this activity/break ended (in milliseconds), or null if ongoing
   */
  endTime?: number | null;
  
  /**
   * Color scheme for the timeline entry visualization, can be a direct color set
   * or a theme-aware color set with light and dark variants
   */
  colors?: {
    background: string;
    text: string;
    border: string;
  } | {
    light: { background: string, text: string, border: string },
    dark: { background: string, text: string, border: string }
  };
}

/**
 * Props for the Timeline component
 */
interface TimelineProps {
  /**
   * Array of timeline entries to visualize
   */
  entries: TimelineEntry[];
  
  /**
   * Total planned duration in seconds
   */
  totalDuration: number;
  
  /**
   * Time elapsed since the first activity started (in seconds)
   */
  elapsedTime: number;
  
  /**
   * Whether the allocated time has been fully used
   * @default false
   */
  isTimeUp?: boolean;
  
  /**
   * Whether the timer is currently active
   * @default false
   */
  timerActive?: boolean;
  
  /**
   * Whether all planned activities have been completed
   * @default false
   */
  allActivitiesCompleted?: boolean;
  /** Hide the internal header (title + time) when embedding inside a Card */
  hideHeader?: boolean;
}

function calculateTimeIntervals(duration: number): { interval: number; count: number } {
  const totalSeconds = Math.floor(duration / 1000);
  
  // Logic for determining appropriate interval based on total duration
  if (totalSeconds <= 60) {
    return { interval: 10, count: Math.floor(totalSeconds / 10) };
  } else if (totalSeconds <= 300) {
    return { interval: 30, count: Math.floor(totalSeconds / 30) };
  } else if (totalSeconds <= 900) {
    return { interval: 60, count: Math.floor(totalSeconds / 60) };
  } else if (totalSeconds <= 1800) {
    return { interval: 300, count: Math.floor(totalSeconds / 300) };
  } else if (totalSeconds <= 3600) {
    return { interval: 600, count: Math.floor(totalSeconds / 600) };
  } else if (totalSeconds <= 7200) {
    return { interval: 1200, count: Math.floor(totalSeconds / 1200) };
  } else {
    return { interval: 1800, count: Math.floor(totalSeconds / 1800) };
  }
}

function getThemeAppropriateColor(colors: {
  light?: { background: string, text: string, border: string },
  dark?: { background: string, text: string, border: string }
} | { background: string, text: string, border: string }, theme: 'light' | 'dark'): { background: string, text: string, border: string } {
  // If colors is already in the final format, return it directly
  if (colors && typeof colors === 'object' && 'background' in colors) {
    return colors;
  }
  
  // Otherwise, check if it's a color set with light/dark variants
  if (colors && typeof colors === 'object' && 'light' in colors && 'dark' in colors) {
    const variant = theme === 'dark' ? colors.dark : colors.light;
    if (variant) {
      return variant;
    }
  }
  
  // Default fallback
  return {
    background: 'var(--background-muted)',
    text: 'var(--foreground)',
    border: 'var(--border-color)'
  };
}

export default function Timeline({ 
  entries, 
  totalDuration, 
  elapsedTime: initialElapsedTime, 
  isTimeUp = false, 
  timerActive = false, 
  allActivitiesCompleted = false,
  hideHeader = false,
}: TimelineProps) {
  // React to theme changes to ensure entry colors update live
  const { theme } = useThemeReactive();
  const [currentElapsedTime, setCurrentElapsedTime] = useState(initialElapsedTime);
  
  const hasEntries = entries && entries.length > 0;
  
  // Update current elapsed time when prop changes
  useEffect(() => {
    setCurrentElapsedTime(initialElapsedTime);
  }, [initialElapsedTime]);
  
  // Single interval effect for all time-based updates
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    
    const updateTime = () => {
      if (hasEntries && entries.length > 0) {
        const firstEntry = entries[0];
        if (firstEntry) {
          const elapsed = Math.floor((Date.now() - firstEntry.startTime) / 1000);
          setCurrentElapsedTime(elapsed);
        }
      }
    };

    // Only run timer if we need real-time updates
    // We update when the timer is active, or when the last entry is ongoing (no endTime yet)
    const hasOngoingEntry = hasEntries && entries[entries.length - 1]?.endTime == null;
    if ((timerActive && hasEntries) || hasOngoingEntry) {
      updateTime(); // Initial update
      timeoutId = setInterval(updateTime, 1000);
    }
    
    return () => {
      if (timeoutId) {
        clearInterval(timeoutId);
        timeoutId = null;
      }
    };
  }, [timerActive, hasEntries, entries]);

  // Calculate time remaining display
  const timeLeft = totalDuration - currentElapsedTime;
  const isOvertime = timeLeft < 0;
  const timeDisplay = timerActive 
    ? `${isOvertime ? 'Overtime: ' : 'Time Left: '}${formatTimeHuman(Math.abs(timeLeft) * 1000)}`
    : `Timer ready: ${formatTimeHuman(totalDuration * 1000)}`;

  // Calculate effective duration for timeline - dynamically adjust if in overtime
  const effectiveDuration = useMemo(() => {
    if (isOvertime) {
      // Use actual elapsed time if it exceeds planned duration
      return Math.max(totalDuration, currentElapsedTime) * 1000;
    }
    return totalDuration * 1000;
  }, [totalDuration, currentElapsedTime, isOvertime]);
  
  // Generate time markers based on effective duration
  const timeMarkers = useMemo(() => {
    const { interval, count } = calculateTimeIntervals(effectiveDuration);
    return Array.from({ length: count + 1 }, (_, i) => {
      const milliseconds = i * interval * 1000;
      // Calculate position percentage based on effective duration
      const position = (milliseconds / effectiveDuration) * 100;
      // Determine if this marker is in the overtime section
      const isOvertimeMarker = milliseconds > totalDuration * 1000;
      
      return {
        time: milliseconds,
        position,
        label: formatTimeHuman(milliseconds),
        isOvertimeMarker
      };
    });
  }, [effectiveDuration, totalDuration]);
  
  // Calculate position percentage of the original planned duration
  const plannedDurationPosition = useMemo(() => {
    if (isOvertime) {
      return (totalDuration * 1000 / effectiveDuration) * 100;
    }
    return 100;
  }, [totalDuration, effectiveDuration, isOvertime]);
  
  // Calculate data for timeline entries
  // Compute remaining time based on the currentElapsedTime rather than wall-clock time.
  // This ensures shared/archived sessions render correctly without drifting over time.
  const currentTimeLeft = (totalDuration - currentElapsedTime) * 1000;
  const timeSpansData = calculateTimeSpans({
    entries,
    totalDuration: effectiveDuration,
    allActivitiesCompleted,
    timeLeft: currentTimeLeft,
  });
  
  type ItemEntry = TimelineEntry | { id: string; activityId: string | null; activityName?: string | null; startTime: number; endTime?: number | null; colors?: { background: string; text: string; border: string } | { light: { background: string; text: string; border: string }; dark: { background: string; text: string; border: string } } };
  type Item = { type: 'activity' | 'gap'; entry?: ItemEntry; duration: number; height: number };
  const calculateEntryStyle = (item: Item) => {
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
    
    // Get theme-appropriate colors using the theme detection
    const themeColors = item.entry?.colors ? 
      getThemeAppropriateColor(item.entry.colors, theme) : 
      undefined;
    
    // Use theme-appropriate colors or fallback to defaults
    const colors = themeColors || {
      background: 'var(--background-muted)',
      text: 'var(--foreground)',
      border: 'var(--border-color)'
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
      {!hideHeader && (
        <div className={styles.header}>
          <h2 className={styles.heading}>Timeline</h2>
          <div 
            className={`${styles.timeDisplay} ${isTimeUp ? styles.timeDisplayOvertime : ''}`}
            data-testid="time-display"
          >
            {timeDisplay}
          </div>
        </div>
      )}
      
      <div className={styles.timelineContainer}>
        <div className={styles.timelineRuler}>
          {/* Add overtime background to the ruler */}
          {isOvertime && (
            <div 
              className={styles.overtimeRulerSection}
              style={{ 
                top: `${plannedDurationPosition}%`,
                height: `${100 - plannedDurationPosition}%`
              }}
              data-testid="overtime-ruler-section"
            />
          )}
          
          {timeMarkers.map(({ time, position, label, isOvertimeMarker }) => (
            <div
              key={time}
              className={`${styles.timeMarker} ${isOvertimeMarker ? styles.overtimeMarker : ''}`}
              style={{ top: `${position}%` }}
              data-testid="time-marker"
            >
              {label}
            </div>
          ))}
          
          {/* Overtime indicator line */}
          {isOvertime && (
            <div 
              className={styles.overtimeDivider}
              style={{ top: `${plannedDurationPosition}%` }}
              title="Original planned duration"
            />
          )}
        </div>
        
        <div className={styles.entriesContainer}>
          {/* Overtime background section */}
          {isOvertime && (
            <div 
              className={styles.overtimeSection}
              style={{ 
                top: `${plannedDurationPosition}%`,
                height: `${100 - plannedDurationPosition}%`
              }}
              data-testid="overtime-section"
            />
          )}
          
          <div className={styles.timeGuides}>
            {timeMarkers.map(({ time, position, isOvertimeMarker }) => (
              <div
                key={time}
                className={`${styles.timeGuide} ${isOvertimeMarker ? styles.overtimeGuide : ''}`}
                style={{ top: `${position}%` }}
              />
            ))}
            
            {/* Overtime divider guide */}
            {isOvertime && (
              <div 
                className={styles.overtimeDividerGuide}
                style={{ top: `${plannedDurationPosition}%` }}
              />
            )}
          </div>
          
          <div className={styles.entriesWrapper}>
            {hasEntries ? (
              timeSpansData.items.map((item, index: number) => {
                const typedItem = item as Item;
                const style = calculateEntryStyle(typedItem);
                
                if (typedItem.type === 'gap') {
                  if (allActivitiesCompleted && index === timeSpansData.items.length - 1) {
                    return (
                      <div
                        key="remaining"
                        className={styles.timeGap}
                        style={style}
                      >
                        <span>Time Remaining ({formatTimeHuman(typedItem.duration)})</span>
                      </div>
                    );
                  }
                  return (
                    <div
                      key={`gap-${index}`}
                      className={styles.timeGap}
                      style={style}
                    >
                      <span>Break ({formatTimeHuman(typedItem.duration)})</span>
                    </div>
                  );
                }
                return (
                  <div key={typedItem.entry!.id} className={styles.timelineEntry} style={style}>
                    <div className={styles.entryContent}>
                      <div className={styles.entryHeader}>
                        <span
                          className={styles.activityName}
                          data-testid="timeline-activity-name"
                        >
                          {typedItem.entry!.activityName}
                        </span>
                        <span className={styles.timeInfo}>
                          {formatTimeHuman(typedItem.duration)}
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
          <strong>Warning:</strong> You&apos;ve exceeded the planned time!
        </div>
      )}
    </div>
  );
}
