import React, { useEffect, useState } from 'react';
import { TimelineEntry } from '@/types';
import { isDarkMode, ColorSet, internalActivityColors } from '../utils/colors';
import styles from './Summary.module.css';

interface SummaryProps {
  entries?: TimelineEntry[];
  totalDuration: number;
  elapsedTime: number;
  timerActive?: boolean;
  allActivitiesCompleted?: boolean;
  isTimeUp?: boolean; // Add this prop to handle time-up state
}

export default function Summary({ 
  entries = [], 
  totalDuration, 
  elapsedTime, 
  timerActive = false,
  allActivitiesCompleted = false,
  isTimeUp = false // Add this prop to handle time-up state
}: SummaryProps) {
  // Add state to track current theme mode
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>(
    typeof window !== 'undefined' && isDarkMode() ? 'dark' : 'light'
  );

  // Function to get the theme-appropriate color for an activity
  const getThemeAppropriateColor = (colors: TimelineEntry['colors']) => {
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

  const getStatusMessage = () => {
    // First check if time is up, this should take precedence
    if (isTimeUp) {
      return {
        message: "Time's up! Review your completed activities below."
      };
    }

    if (timerActive) {
      const remainingTime = totalDuration - elapsedTime;
      if (remainingTime < 0) {
        return {
          message: "You've gone over the allocated time!"
        };
      } else if (remainingTime === 0) {
        return {
          message: "Time's up!"
        };
      } else {
        return {
          message: "You're doing great, keep going!"
        };
      }
    } else if (allActivitiesCompleted) {
      const timeDiff = elapsedTime - totalDuration;
      
      if (timeDiff > 0) {
        const laterBy = formatDuration(timeDiff);
        return {
          message: `You took ${laterBy} more than planned`
        };
      } else {
        const earlierBy = formatDuration(Math.abs(timeDiff));
        return {
          message: `Amazing! You finished ${earlierBy} earlier than planned!`
        };
      }
    }
    return null;
  };

  const formatDuration = (seconds: number): string => {
    // Round to nearest whole second
    seconds = Math.round(seconds);
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
  };

  const calculateActivityStats = () => {
    if (!entries || entries.length === 0) return null;
    
    const stats = {
      idleTime: 0,
      activeTime: 0
    };
    
    let lastEndTime: number | null = null;
    
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      // Skip if entry is undefined
      if (!entry) continue;
      
      const endTime = entry.endTime ?? Date.now();
      
      // Calculate break time between activities
      if (lastEndTime && entry.startTime > lastEndTime) {
        stats.idleTime += Math.round((entry.startTime - lastEndTime) / 1000);
      }
      
      // Calculate activity duration
      const duration = Math.round((endTime - entry.startTime) / 1000);
      
      if (entry.activityId) {
        stats.activeTime += duration;
      } else {
        stats.idleTime += duration;
      }
      
      lastEndTime = endTime;
    }
    
    return stats;
  };

  const calculateOvertime = () => {
    if (!entries || entries.length === 0) return 0;
    
    // Get the timestamp of the first activity start
    const firstStart = entries[0]?.startTime;
    if (!firstStart) return 0;
    
    // Calculate total time from first activity to last completion or now
    const lastEntry = entries[entries.length - 1];
    const lastEnd = lastEntry?.endTime ?? Date.now();
    const totalTimeUsed = Math.round((lastEnd - firstStart) / 1000);
    
    // Calculate overtime as any time spent beyond the planned duration
    const overtime = Math.max(0, totalTimeUsed - totalDuration);
    return overtime;
  };

  const calculateActivityTimes = () => {
    if (!entries || entries.length === 0) return [];
    
    const activityTimes: { id: string; name: string; duration: number; colors?: TimelineEntry['colors'] }[] = [];
    const activityMap = new Map<string, { duration: number; name: string; colors?: TimelineEntry['colors'] }>();
    const seenActivityIds = new Set<string>(); // Track order of first appearance
    
    // Sort entries by startTime to ensure chronological order
    const sortedEntries = [...entries].sort((a, b) => a.startTime - b.startTime);
    
    // First pass: Calculate total durations
    for (const entry of sortedEntries) {
      if (entry.activityId && entry.activityName) {
        const endTime = entry.endTime ?? Date.now();
        const duration = Math.round((endTime - entry.startTime) / 1000);
        
        if (activityMap.has(entry.activityId)) {
          const existing = activityMap.get(entry.activityId)!;
          existing.duration += duration;
        } else {
          activityMap.set(entry.activityId, {
            duration,
            name: entry.activityName,
            colors: entry.colors
          });
        }
        
        // Track first appearance of each activity
        if (!seenActivityIds.has(entry.activityId)) {
          seenActivityIds.add(entry.activityId);
          activityTimes.push({ 
            id: entry.activityId, 
            ...activityMap.get(entry.activityId)! 
          });
        }
      }
    }
    
    // Update durations in activityTimes with final values
    return activityTimes.map(activity => ({
      ...activity,
      duration: activityMap.get(activity.id)!.duration
    }));
  };

  const status = getStatusMessage();
  const stats = calculateActivityStats();
  
  // Early return modified to handle isTimeUp case
  if ((!allActivitiesCompleted && !isTimeUp) || !stats) {
    return null;
  }
  
  const overtime = calculateOvertime();
  const activityTimes = calculateActivityTimes();

  const getStatusType = (): 'success' | 'warning' | 'error' | 'info' => {
    if (isTimeUp) return 'warning';
    if (timerActive) {
      const remainingTime = totalDuration - elapsedTime;
      if (remainingTime < 0) return 'error';
      return 'info';
    }
    if (allActivitiesCompleted) {
      const timeDiff = elapsedTime - totalDuration;
      return timeDiff > 0 ? 'warning' : 'success';
    }
    return 'info';
  };

  return (
    <div className={styles.summary} data-testid="summary" data-theme={currentTheme}>
      {status && (
        <div 
          className={styles.statusMessage} 
          data-status={getStatusType()}
          role="alert"
          aria-live="polite"
        >
          {status.message}
        </div>
      )}
      
      <div className={styles.metricsGrid} role="group" aria-label="Time metrics">
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Planned Time</span>
          <span className={styles.metricValue}>{formatDuration(totalDuration)}</span>
        </div>
        
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Spent Time</span>
          <span className={styles.metricValue}>{formatDuration(elapsedTime)}</span>
        </div>
        
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Idle Time</span>
          <span className={styles.metricValue}>{formatDuration(stats.idleTime)}</span>
        </div>
        
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Overtime</span>
          <span className={styles.metricValue}>{formatDuration(overtime)}</span>
        </div>
      </div>

      {activityTimes.length > 0 ? (
        <section className={styles.activitiesSection} aria-labelledby="activities-heading">
          <h3 id="activities-heading" className={styles.activitiesHeading}>
            Time Spent per Activity
          </h3>
          <ul className={styles.activitiesList} role="list">
            {activityTimes.map((activity) => {
              // Get theme-appropriate colors
              const themeColors = activity.colors ? 
                getThemeAppropriateColor(activity.colors) || activity.colors : 
                undefined;
              
              return (
                <li 
                  key={activity.id}
                  className={styles.activityItem}
                  data-testid={`activity-summary-item-${activity.id}`}
                  data-has-colors={!!themeColors}
                  style={themeColors ? {
                    backgroundColor: (themeColors as ColorSet).background,
                    borderColor: (themeColors as ColorSet).border
                  } : undefined}
                >
                  {themeColors && (
                    <div 
                      className={styles.colorIndicator}
                      style={{ backgroundColor: (themeColors as ColorSet).border }}
                      aria-hidden="true"
                    />
                  )}
                  <span 
                    className={styles.activityName}
                    data-testid={`activity-name-${activity.id}`}
                    style={themeColors ? { color: (themeColors as ColorSet).text } : undefined}
                  >
                    {activity.name}
                  </span>
                  <span className={styles.activityDuration}>
                    {formatDuration(activity.duration)}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      ) : (
        <div className={styles.emptyState}>
          <div className={styles.emptyStateIcon} aria-hidden="true">📊</div>
          <p>No activities completed yet</p>
        </div>
      )}
    </div>
  );
}