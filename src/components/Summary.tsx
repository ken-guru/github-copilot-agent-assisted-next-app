import React, { useEffect, useState } from 'react';
import { useViewport } from '../hooks/useViewport';
import styles from './Summary.module.css';
import mobileStyles from './Summary.mobile.module.css';
import { TimelineEntry } from './Timeline';
import { isDarkMode, ColorSet, internalActivityColors } from '../utils/colors';

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
  isTimeUp = false 
}: SummaryProps) {
  // Add state to track current theme mode
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>(
    typeof window !== 'undefined' && isDarkMode() ? 'dark' : 'light'
  );
  
  // Get viewport information for responsive adaptations
  const { isMobile, hasTouch } = useViewport();

  // Function to get the theme-appropriate color for an activity
  const getThemeAppropriateColor = (colors: TimelineEntry['colors']) => {
    if (!colors) return undefined;

    // Extract hue from current color
    const hue = extractHueFromHsl(colors.background);
    
    // Find the closest matching color set in internalActivityColors
    const closestColorSet = findClosestColorSet(hue, colors);
    
    // Return the appropriate theme version
    return currentTheme === 'dark' ? closestColorSet.dark : closestColorSet.light;
  };

  // Helper to extract hue from HSL color
  const extractHueFromHsl = (hslColor: string): number => {
    try {
      const hueMatch = hslColor.match(/hsl\(\s*(\d+)/);
      return hueMatch ? parseInt(hueMatch[1], 10) : 0;
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
        message: "Time's up! Review your completed activities below.",
        className: isMobile ? mobileStyles.mobileStatusMessageLate : styles.statusMessageLate
      };
    }

    if (timerActive) {
      const remainingTime = totalDuration - elapsedTime;
      if (remainingTime < 0) {
        return {
          message: "You've gone over the allocated time!",
          className: isMobile ? mobileStyles.mobileStatusMessageLate : styles.statusMessageLate
        };
      } else if (remainingTime === 0) {
        return {
          message: "Time's up!",
          className: isMobile ? mobileStyles.mobileStatusMessageLate : styles.statusMessageLate
        };
      } else {
        return {
          message: "You're doing great, keep going!",
          className: isMobile ? mobileStyles.mobileStatusMessageEarly : styles.statusMessageEarly
        };
      }
    } else if (allActivitiesCompleted) {
      const timeDiff = elapsedTime - totalDuration;
      
      if (timeDiff > 0) {
        const laterBy = formatDuration(timeDiff);
        return {
          message: `You took ${laterBy} more than planned`,
          className: isMobile ? mobileStyles.mobileStatusMessageLate : styles.statusMessageLate
        };
      } else {
        const earlierBy = formatDuration(Math.abs(timeDiff));
        return {
          message: `Amazing! You finished ${earlierBy} earlier than planned!`,
          className: isMobile ? mobileStyles.mobileStatusMessageEarly : styles.statusMessageEarly
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

  // Sort entries chronologically for consistent display
  const sortedEntries = [...(entries || [])].sort((a, b) => a.startTime - b.startTime);
  
  const stats = calculateActivityStats();
  const overtime = calculateOvertime();
  const { activeTime = 0, idleTime = 0 } = stats || { activeTime: 0, idleTime: 0 };
  
  const statusMessage = getStatusMessage();
  
  // Get appropriate class names based on viewport
  const getSummaryClass = () => {
    return isMobile ? mobileStyles.mobileSummary : styles.summaryContainer;
  };
  
  const getStatsClass = () => {
    return isMobile ? mobileStyles.mobileStats : styles.statsContainer;
  };
  
  const getStatItemClass = () => {
    return isMobile ? mobileStyles.mobileStatItem : styles.statItem;
  };
  
  const getStatLabelClass = () => {
    return isMobile ? mobileStyles.mobileStatLabel : styles.statLabel;
  };
  
  const getStatValueClass = () => {
    return isMobile ? mobileStyles.mobileStatValue : styles.statValue;
  };
  
  const getSectionTitleClass = () => {
    return isMobile ? mobileStyles.mobileSectionTitle : styles.sectionTitle;
  };
  
  const getActivityListClass = () => {
    return isMobile ? mobileStyles.mobileActivityList : styles.activitiesList;
  };
  
  const getActivityItemClass = () => {
    return isMobile ? mobileStyles.mobileActivityItem : styles.activityItem;
  };
  
  const getActivityNameClass = () => {
    return isMobile ? mobileStyles.mobileActivityName : styles.activityName;
  };
  
  const getActivityDetailsClass = () => {
    return isMobile ? mobileStyles.mobileActivityDetails : styles.activityDetails;
  };
  
  const getActivityTimeClass = () => {
    return isMobile ? mobileStyles.mobileActivityTime : styles.activityTime;
  };
  
  const getDurationClass = () => {
    return isMobile ? mobileStyles.mobileDuration : styles.duration;
  };
  
  const getNoActivitiesClass = () => {
    return isMobile ? mobileStyles.mobileNoActivities : styles.noActivities;
  };
  
  return (
    <div className={getSummaryClass()} data-testid="summary-container">
      {statusMessage && (
        <div 
          className={statusMessage.className}
          data-testid="status-message"
        >
          {statusMessage.message}
        </div>
      )}
      
      <div className={getStatsClass()} data-testid="stats-container">
        <div className={getStatItemClass()}>
          <div className={getStatLabelClass()}>Active Time</div>
          <div className={getStatValueClass()} data-testid="active-time">
            {formatDuration(activeTime)}
          </div>
        </div>
        
        <div className={getStatItemClass()}>
          <div className={getStatLabelClass()}>Idle Time</div>
          <div className={getStatValueClass()} data-testid="idle-time">
            {formatDuration(idleTime)}
          </div>
        </div>
        
        <div className={getStatItemClass()}>
          <div className={getStatLabelClass()}>Overtime</div>
          <div className={getStatValueClass()} data-testid="overtime-duration">
            {formatDuration(overtime)}
          </div>
        </div>
      </div>
      
      <h2 className={getSectionTitleClass()}>Activities</h2>
      
      {sortedEntries.length > 0 ? (
        <div className={getActivityListClass()} data-testid="activity-list">
          {sortedEntries.map((entry, index) => {
            const themeColors = getThemeAppropriateColor(entry.colors);
            const activityDuration = entry.endTime 
              ? Math.round((entry.endTime - entry.startTime) / 1000)
              : 0;
            
            return (
              <div 
                key={entry.id} 
                className={getActivityItemClass()}
                style={{
                  borderLeft: `4px solid ${themeColors?.border || '#ccc'}`,
                }}
                data-testid={`activity-item-${index}`}
              >
                <div className={isMobile ? mobileStyles.mobileActivityHeader : ''}>
                  <h3 className={getActivityNameClass()}>{entry.activityName}</h3>
                </div>
                
                <div className={getActivityDetailsClass()}>
                  <div className={getActivityTimeClass()}>
                    <span>
                      {new Date(entry.startTime).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                      {' → '}
                      {entry.endTime ? new Date(entry.endTime).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : 'In progress'}
                    </span>
                    
                    <span className={getDurationClass()} data-testid={`duration-${index}`}>
                      ({formatDuration(activityDuration)})
                    </span>
                  </div>
                </div>
                
                {isMobile && (
                  <div className={mobileStyles.mobileProgressIndicator}>
                    <div 
                      className={mobileStyles.mobileProgressFill}
                      style={{
                        width: `${Math.min(100, (activityDuration / totalDuration) * 100)}%`,
                        backgroundColor: themeColors?.border || '#ccc'
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className={getNoActivitiesClass()}>
          No activities have been recorded yet.
        </div>
      )}
    </div>
  );
}