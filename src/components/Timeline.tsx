import { useState, useEffect, useMemo, useRef, TouchEvent } from 'react';
import { useViewport } from '../hooks/useViewport';
import styles from './Timeline.module.css';
import mobileStyles from './Timeline.mobile.module.css';
import { calculateTimeSpans } from '@/utils/timelineCalculations';
import { formatTimeHuman } from '@/utils/time';
import { isDarkMode, ColorSet, internalActivityColors } from '../utils/colors';

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

interface PinchState {
  isPinching: boolean;
  initialDistance: number;
  scale: number;
}

export default function Timeline({ entries, totalDuration, elapsedTime: initialElapsedTime, isTimeUp = false, timerActive = false, allActivitiesCompleted = false }: TimelineProps) {
  const hasEntries = entries.length > 0;
  const [currentElapsedTime, setCurrentElapsedTime] = useState(initialElapsedTime);
  
  // Add state to track current theme mode
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>(
    typeof window !== 'undefined' && isDarkMode() ? 'dark' : 'light'
  );
  
  // Function to get the theme-appropriate color for an activity
  const getThemeAppropriateColor = (colors?: TimelineEntry['colors']) => {
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
  
  // Add mobile-specific state and refs
  const { isMobile, hasTouch } = useViewport();
  const timelineRef = useRef<HTMLDivElement>(null);
  const [selectedEntry, setSelectedEntry] = useState<TimelineEntry | null>(null);
  const [pinchState, setPinchState] = useState<PinchState>({
    isPinching: false,
    initialDistance: 0,
    scale: 1
  });
  const [showZoomControls, setShowZoomControls] = useState(false);
  
  // Modified scale for mobile zoom (higher values for easier viewing)
  const [zoomScale, setZoomScale] = useState(1);
  
  // Handle touch events for pinch zoom
  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    if (!hasTouch) return;
    
    // Only handle multi-touch events for pinch
    if (e.touches.length === 2) {
      e.preventDefault(); // Prevent default browser behavior
      
      // Calculate initial distance between two touch points
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const initialDistance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      
      setPinchState({
        isPinching: true,
        initialDistance,
        scale: zoomScale // Start from current scale
      });
    }
  };
  
  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (!pinchState.isPinching || e.touches.length !== 2) return;
    
    e.preventDefault();
    
    // Calculate new distance between touch points
    const touch1 = e.touches[0];
    const touch2 = e.touches[1];
    const currentDistance = Math.hypot(
      touch2.clientX - touch1.clientX,
      touch2.clientY - touch1.clientY
    );
    
    // Calculate new scale based on distance change
    // Limit scale between 0.5 and 3
    const newScale = Math.min(
      Math.max(
        pinchState.scale * (currentDistance / pinchState.initialDistance),
        0.5
      ), 
      3
    );
    
    setZoomScale(newScale);
    setShowZoomControls(true);
  };
  
  const handleTouchEnd = () => {
    if (pinchState.isPinching) {
      setPinchState({
        isPinching: false,
        initialDistance: 0,
        scale: zoomScale
      });
      
      // Hide zoom controls after a delay
      setTimeout(() => {
        setShowZoomControls(false);
      }, 3000);
    }
  };
  
  // Handle zoom controls
  const handleZoomIn = () => {
    setZoomScale(prevScale => Math.min(prevScale + 0.2, 3));
    setShowZoomControls(true);
    
    // Hide zoom controls after a delay
    setTimeout(() => {
      setShowZoomControls(false);
    }, 3000);
  };
  
  const handleZoomOut = () => {
    setZoomScale(prevScale => Math.max(prevScale - 0.2, 0.5));
    setShowZoomControls(true);
    
    // Hide zoom controls after a delay
    setTimeout(() => {
      setShowZoomControls(false);
    }, 3000);
  };
  
  // Handle showing entry details
  const showEntryDetails = (entry: TimelineEntry) => {
    if (isMobile) {
      setSelectedEntry(entry);
    }
  };
  
  // Format duration for display in detail overlay
  const formatDuration = (startTime: number, endTime: number) => {
    const durationMs = endTime - startTime;
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Get appropriate style class based on viewport
  const getTimelineClass = () => {
    return isMobile ? mobileStyles.mobileTimeline : styles.timeline;
  };
  
  const getVisualizationClass = () => {
    return isMobile ? mobileStyles.mobileVisualization : styles.visualization;
  };
  
  const getTimeMarkerClass = (isOvertimeMarker: boolean) => {
    return isMobile 
      ? `${mobileStyles.mobileTimeMarker} ${isOvertimeMarker ? styles.overtimeMarker : ''}`
      : `${styles.timeMarker} ${isOvertimeMarker ? styles.overtimeMarker : ''}`;
  };
  
  const getTimelineEntryClass = (isBreak: boolean) => {
    return isMobile
      ? `${mobileStyles.mobileTimelineEntry} ${isBreak ? mobileStyles.mobileBreakEntry : ''}`
      : `${styles.timelineEntry} ${isBreak ? styles.breakEntry : ''}`;
  };
  
  const getLabelClass = () => {
    return isMobile ? mobileStyles.mobileLabel : styles.label;
  };
  
  const getCurrentTimeIndicatorClass = () => {
    return isMobile
      ? `${styles.currentTimeIndicator} ${mobileStyles.mobileCurrentTimeIndicator} ${mobileStyles.mobileCentered}`
      : styles.currentTimeIndicator;
  };
  
  // Adjust the styled component renderings to use these class getters
  const visualEntries = useMemo(() => {
    return timeSpansData.items.map(item => {
      const isBreak = item.type === 'gap';
      return {
        id: item.entry ? item.entry.id : `gap-${item.duration}-${Math.random()}`,
        activityName: item.entry ? item.entry.activityName : '',
        position: item.startTime / effectiveDuration * 100,
        height: item.duration / effectiveDuration * 100,
        isBreak,
        colors: isBreak ? { background: 'transparent', border: 'transparent' } : undefined,
      };
    });
  }, [timeSpansData.items, effectiveDuration]);
  
  return (
    <div 
      className={getTimelineClass()} 
      data-testid="timeline-container"
      ref={timelineRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ 
        transform: isMobile ? `scale(${zoomScale})` : 'none',
        transformOrigin: 'center center'
      }}
    >
      <div className={getVisualizationClass()} data-testid="timeline-visualization">
        {/* Time markers */}
        {timeMarkers.map(({ time, position, label, isOvertimeMarker }) => (
          <div
            key={time}
            className={getTimeMarkerClass(isOvertimeMarker)}
            style={{ top: `${position}%` }}
            data-testid="time-marker"
          >
            {label}
          </div>
        ))}
        
        {/* Current time indicator */}
        {timerActive && (
          <div 
            className={getCurrentTimeIndicatorClass()}
            style={{ top: `${currentTimePosition}%` }}
            data-testid="current-time-indicator"
          />
        )}
        
        {/* Timeline entries */}
        {visualEntries.map((entry) => (
          <div
            key={entry.id}
            className={getTimelineEntryClass(!!entry.isBreak)}
            style={{
              top: `${entry.position}%`,
              height: `${entry.height}%`,
              backgroundColor: entry.isBreak ? 'transparent' : entry.colors?.background,
              borderColor: entry.colors?.border,
            }}
            onClick={() => showEntryDetails(entry)}
            data-testid={`timeline-entry-${entry.id}`}
          >
            <span className={getLabelClass()} data-testid={`timeline-label-${entry.id}`}>
              {entry.activityName}
            </span>
          </div>
        ))}
        
        {/* Overtime section background */}
        {isOvertime && (
          <div 
            className={styles.overtimeSection}
            style={{ 
              top: `${plannedDurationPosition}%`,
              height: `${100 - plannedDurationPosition}%`
            }}
            data-testid="overtime-ruler-section"
          />
        )}
        
        {/* Overtime indicator line */}
        {isOvertime && (
          <div 
            className={styles.overtimeDivider}
            style={{ top: `${plannedDurationPosition}%` }}
            title="Original planned duration"
          />
        )}
      </div>
      
      {/* Mobile zoom controls */}
      {isMobile && (hasTouch || showZoomControls) && (
        <div 
          className={mobileStyles.mobileZoomControls}
          data-testid="zoom-controls"
          style={{ opacity: showZoomControls ? 1 : 0 }}
        >
          <button 
            className={mobileStyles.mobileZoomButton}
            onClick={handleZoomOut}
            aria-label="Zoom out"
            data-testid="zoom-out-button"
          >
            -
          </button>
          <button 
            className={mobileStyles.mobileZoomButton}
            onClick={handleZoomIn}
            aria-label="Zoom in"
            data-testid="zoom-in-button"
          >
            +
          </button>
        </div>
      )}
      
      {/* Mobile entry detail overlay */}
      {isMobile && selectedEntry && (
        <div className={mobileStyles.mobileDetailOverlay} data-testid="detail-overlay">
          <div className={mobileStyles.mobileDetailCard}>
            <div className={mobileStyles.mobileDetailHeader}>
              <h3 className={mobileStyles.mobileDetailTitle}>{selectedEntry.activityName}</h3>
              <button 
                className={mobileStyles.mobileCloseButton}
                onClick={() => setSelectedEntry(null)}
                aria-label="Close details"
                data-testid="close-overlay-button"
              >
                ×
              </button>
            </div>
            
            <div className={mobileStyles.mobileDetailContent}>
              <div className={mobileStyles.mobileDetailItem}>
                <div className={mobileStyles.mobileDetailLabel}>Start Time</div>
                <div className={mobileStyles.mobileDetailValue}>
                  {new Date(selectedEntry.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              
              <div className={mobileStyles.mobileDetailItem}>
                <div className={mobileStyles.mobileDetailLabel}>End Time</div>
                <div className={mobileStyles.mobileDetailValue}>
                  {selectedEntry.endTime 
                    ? new Date(selectedEntry.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : 'In progress'}
                </div>
              </div>
              
              <div className={mobileStyles.mobileDetailItem}>
                <div className={mobileStyles.mobileDetailLabel}>Duration</div>
                <div className={mobileStyles.mobileDetailValue}>
                  {selectedEntry.endTime 
                    ? formatDuration(selectedEntry.startTime, selectedEntry.endTime)
                    : 'Ongoing'}
                </div>
              </div>
              
              {selectedEntry.isBreak && (
                <div className={mobileStyles.mobileDetailItem}>
                  <div className={mobileStyles.mobileDetailLabel}>Type</div>
                  <div className={mobileStyles.mobileDetailValue}>Break Time</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}