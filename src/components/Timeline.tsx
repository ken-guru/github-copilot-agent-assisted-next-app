"use client";

import React, { useMemo, useEffect, useState } from 'react';
import { Card, Badge } from 'react-bootstrap';
import styles from './Timeline.module.css';
import { calculateTimeSpans } from '@/utils/timelineCalculations';
import { formatTimeHuman } from '@/utils/time';
import { isDarkMode, ColorSet, internalActivityColors } from '../utils/colors';
import { TimelineEntry } from '@/types';

interface TimelineProps {
  entries: TimelineEntry[];
  totalDuration: number;
  elapsedTime: number;
  timerActive?: boolean;
  allActivitiesCompleted?: boolean;
  showCounter?: boolean;
}

function calculateTimeIntervals(duration: number): { interval: number; count: number } {
  const totalSeconds = Math.floor(duration / 1000);
  
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

export default function Timeline({ entries, totalDuration, elapsedTime: initialElapsedTime, timerActive = false, allActivitiesCompleted = false, showCounter = true }: TimelineProps) {
  const hasEntries = entries.length > 0;
  const [currentElapsedTime, setCurrentElapsedTime] = useState(initialElapsedTime);
  
  // Add state to track current theme mode
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>(
    typeof window !== 'undefined' && isDarkMode() ? 'dark' : 'light'
  );
  
  // Function to get the theme-appropriate color for an activity
  const getThemeAppropriateColor = (colors?: TimelineEntry['colors']) => {
    if (!colors) return undefined;
    
    // If we already have theme-specific colors, use those directly
    if ('light' in colors && 'dark' in colors) {
      return currentTheme === 'dark' ? colors.dark : colors.light;
    }
    
    // Otherwise, extract hue from current color and find closest theme-aware color
    // Type assertion needed for TypeScript since we've confirmed it's a ColorSet
    const colorSet = colors as ColorSet;
    const hue = extractHueFromHsl(colorSet.background);
    
    // Find the closest matching color set in internalActivityColors
    const closestColorSet = findClosestColorSet(hue, colorSet);
    
    // Return the appropriate theme version with null checks
    if (!closestColorSet) {
      return {
        background: 'var(--background-muted)',
        text: 'var(--foreground)',
        border: 'var(--border-color)'
      };
    }
    
    return currentTheme === 'dark' 
      ? closestColorSet.dark 
      : closestColorSet.light;
  };
  
  // Helper to extract hue from HSL color
  const extractHueFromHsl = (hslColor: string | undefined): number => {
    if (!hslColor) return 0;
    
    try {
      const hueMatch = hslColor.match(/hsl\(\s*(\d+)/);
      if (hueMatch && hueMatch[1]) {
        return parseInt(hueMatch[1], 10);
      }
      return 0;
    } catch {
      // Fallback for non-HSL colors or parsing errors
      return 0;
    }
  };
  
  // Find the closest color set by hue
  const findClosestColorSet = (hue: number, originalColors: ColorSet) => {
    // If we can't determine hue from the color, use a fallback
    if (hue === 0 && !originalColors.background.includes('hsl(0')) {
      // Default to blue if we can't determine the hue
      return internalActivityColors[1]; // Blue color set
    }
    
    // Find the closest matching hue in our color sets
    let closestMatch = internalActivityColors[0];
    let smallestDiff = 360;
    
    internalActivityColors.forEach(colorSet => {
      const lightColorHue = extractHueFromHsl(colorSet.light.background);
      const hueDiff = Math.abs(lightColorHue - hue);
      
      // Handle hue circle wraparound (e.g., 350 is closer to 10 than 300)
      const wrappedHueDiff = Math.min(hueDiff, 360 - hueDiff);
      
      if (wrappedHueDiff < smallestDiff) {
        smallestDiff = wrappedHueDiff;
        closestMatch = colorSet;
      }
    });
    
    return closestMatch;
  };
  
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
      if (hasEntries && entries.length > 0 && entries[0]) {
        const firstEntry = entries[0];
        if (firstEntry.startTime) {
          const elapsed = Math.floor((Date.now() - firstEntry.startTime) / 1000);
          setCurrentElapsedTime(elapsed);
        }
      }
    };

  // Only run timer if explicitly active and there are entries.
  // Intentionally NOT ticking for mere presence of an ongoing entry when timerActive is false
  // to guarantee that shared/static views remain frozen.
  if (timerActive && hasEntries) {
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
  // Use currentElapsedTime to avoid wall-clock drift for static/shared views
  const currentTimeLeft = (totalDuration - currentElapsedTime) * 1000;
  
  // Compute a snapshot 'now' based on the first entry start + currentElapsedTime
  const snapshotNow = hasEntries && entries[0]?.startTime
    ? entries[0]!.startTime + currentElapsedTime * 1000
    : undefined;

  const timeSpansData = calculateTimeSpans({
    entries,
    totalDuration: effectiveDuration,
    allActivitiesCompleted,
    timeLeft: currentTimeLeft,
    nowMs: snapshotNow,
  });
  
  const calculateEntryStyle = (item: { type: 'activity' | 'gap'; entry?: TimelineEntry; duration: number; height: number } | undefined) => {
    if (!item) {
      return {
        height: '0%',
        backgroundColor: 'transparent',
      };
    }
    
    const style: React.CSSProperties = {
      height: `${item.height ?? 0}%`,
      minHeight: (item.height ?? 0) < 5 ? '2rem' : undefined // Minimum height for very short entries
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
    <Card className="border h-100 d-flex flex-column w-100">
      <Card.Header className="card-header-consistent">
        <h5 className="mb-0">Timeline</h5>
        {showCounter && (
          <Badge bg="secondary" className="ms-2 text-nowrap" data-testid="time-display">
            {timeDisplay}
          </Badge>
        )}
      </Card.Header>
        
        <Card.Body className="p-0 flex-grow-1 d-flex flex-column overflow-hidden">
          <div className={`${styles.timelineContainer} timeline-container position-relative`}>
            <div className={`${styles.timelineRuler} timeline-ruler`}>
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
                  className={`${styles.timeMarker} ${isOvertimeMarker ? styles.overtimeMarker : ''} position-absolute small text-muted`}
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
            
            <div className={`${styles.entriesContainer} entries-container`}>
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
                      <div key={item.entry!.id} className={`${styles.timelineEntry} timeline-entry d-flex flex-column border rounded`} style={style}>
                        <div className={styles.entryContent}>
                          <div className={styles.entryHeader}>
                            <span
                              className={`${styles.activityName} fw-medium`}
                              data-testid="timeline-activity-name"
                            >
                              {item.entry!.activityName}
                            </span>
                            <span className={`${styles.timeInfo} time-info small text-nowrap`}>
                              {formatTimeHuman(item.duration)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className={`${styles.noEntries} text-muted fst-italic text-center`}>
                    No activities started yet
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card.Body>
    </Card>
  );
}