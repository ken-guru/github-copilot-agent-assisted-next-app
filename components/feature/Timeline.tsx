import React, { useMemo, useEffect, useState } from 'react';
import styles from './Timeline.module.css';
import { calculateTimeSpans } from '@lib/time/timelineCalculations';
import { formatTimeHuman } from '@lib/time';
import { isDarkMode } from '@lib/utils/colors';
import type { ColorSet } from '@lib/utils/colors';

export interface TimelineEntry {
  id: string;
  activityId: string | null;
  activityName: string | null;
  startTime: number;
  endTime?: number | null;
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

function getThemeAppropriateColor(colors: any) {
  // If colors is already in the final format, return it directly
  if (colors && typeof colors === 'object' && 'background' in colors) {
    return colors;
  }
  
  // Otherwise, check if it's a ColorSet with light/dark variants
  if (colors && typeof colors === 'object' && 'light' in colors && 'dark' in colors) {
    const isDark = typeof window !== 'undefined' && isDarkMode();
    return isDark ? colors.dark : colors.light;
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
  allActivitiesCompleted = false 
}: TimelineProps) {
  const [currentElapsedTime, setCurrentElapsedTime] = useState(initialElapsedTime);
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>(
    typeof window !== 'undefined' && isDarkMode() ? 'dark' : 'light'
  );
  
  const hasEntries = entries && entries.length > 0;
  
  // Effect to listen for theme changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Function to handle theme changes
    const handleThemeChange = () => {
      setCurrentTheme(isDarkMode() ? 'dark' : 'light');
    };
    
    // Initial check
    handleThemeChange();
    
    // Set up MutationObserver to watch for class changes on document.documentElement
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === 'attributes' && 
          mutation.attributeName === 'class'
        ) {
          handleThemeChange();
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    
    // Also listen for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', handleThemeChange);
    
    // Clean up
    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener('change', handleThemeChange);
    };
  }, []);
  
  // Update current elapsed time when prop changes
  useEffect(() => {
    setCurrentElapsedTime(initialElapsedTime);
  }, [initialElapsedTime]);
  
  // Single interval effect for all time-based updates
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    
    const updateTime = () => {
      if (hasEntries) {
        const elapsed = Math.floor((Date.now() - entries[0].startTime) / 1000);
        setCurrentElapsedTime(elapsed);
      }
    };

    // Only run timer if we need real-time updates
    const hasOngoingBreak = hasEntries && entries[entries.length - 1]?.endTime != null;
    if ((timerActive && hasEntries) || hasOngoingBreak) {
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
  const currentTimeLeft = totalDuration * 1000 - (hasEntries && entries[0].startTime ? Date.now() - entries[0].startTime : 0);
  const timeSpansData = calculateTimeSpans({
    entries,
    totalDuration: effectiveDuration,
    allActivitiesCompleted,
    timeLeft: currentTimeLeft,
  });
  
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
    
    // Get theme-appropriate colors using the theme detection
    const themeColors = item.entry?.colors ? 
      getThemeAppropriateColor(item.entry.colors) : 
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
      <div className={styles.header}>
        <h2 className={styles.heading}>Timeline</h2>
        <div 
          className={`${styles.timeDisplay} ${isTimeUp ? styles.timeDisplayOvertime : ''}`}
          data-testid="time-display"
        >
          {timeDisplay}
        </div>
      </div>
      
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
                          {formatTimeHuman(item.duration)}
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
