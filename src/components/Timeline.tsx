import React, { useMemo, useEffect, useState } from 'react';
import { Container, Row, Col, ListGroup, Badge } from 'react-bootstrap'; // Added react-bootstrap
import { calculateTimeSpans } from '@/utils/timelineCalculations';
import { formatTimeHuman } from '@/utils/time';
// import { isDarkMode, ColorSet, internalActivityColors } from '../utils/colors'; // Removed isDarkMode and related color utils
import { TimelineEntry } from '@/types';

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

export default function Timeline({ entries, totalDuration, elapsedTime: initialElapsedTime, isTimeUp = false, timerActive = false, allActivitiesCompleted = false }: TimelineProps) {
  const hasEntries = entries.length > 0;
  const [currentElapsedTime, setCurrentElapsedTime] = useState(initialElapsedTime);

  useEffect(() => {
    setCurrentElapsedTime(initialElapsedTime);
  }, [initialElapsedTime]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    const updateCurrentTime = () => {
      if (timerActive) {
        const lastEntry = hasEntries ? entries[entries.length - 1] : null;

        if (lastEntry && lastEntry.endTime === null) { // Last activity is ongoing
          // If there's an ongoing activity, currentElapsedTime should reflect time since overall start.
          if (entries[0]?.startTime) {
            setCurrentElapsedTime(Math.floor((Date.now() - entries[0].startTime) / 1000));
          }
        } else if (lastEntry && lastEntry.endTime !== null && !allActivitiesCompleted) { // Last activity ended, ongoing break
          // If there's an ongoing break, currentElapsedTime reflects time since overall start.
          if (entries[0]?.startTime) {
            setCurrentElapsedTime(Math.floor((Date.now() - entries[0].startTime) / 1000));
          } else {
            // Fallback if no absolute start, e.g. timer started but no entries yet, or only breaks recorded.
            // This case might need more specific handling based on desired behavior.
            // For now, if timer is active and there was a last entry (even if it ended),
            // we assume the timer continues from the overall initialElapsedTime plus time since then.
            // This part is tricky without a definitive session start time if entries[0].startTime is not available.
            // A simple increment might be misleading if initialElapsedTime wasn't 0.
            // Let's rely on entries[0].startTime for now for ongoing breaks.
          }
        } else if (!hasEntries && timerActive && totalDuration > currentElapsedTime) { // Timer is active, but no entries yet (e.g. initial countdown)
            // This was: setCurrentElapsedTime(prev => prev + 1);
            // More accurately, if initialElapsedTime is the *start* of the countdown (e.g. 0)
            // and totalDuration is set, we want to count up from initialElapsedTime.
            // This useEffect is for *updating* an already established currentElapsedTime.
            // The initial value is set by the prop. If the timer is running with no entries,
            // it implies a countdown from totalDuration, or an empty timer running up.
            // Let's assume initialElapsedTime is correctly passed as 0 if it's a fresh timer.
            setCurrentElapsedTime(prev => prev + 1); // Increment from whatever initialElapsedTime was.
        }
      }
    };

    if (timerActive) {
      const lastEntry = hasEntries ? entries[entries.length - 1] : null;
      // Condition for interval: timer is active AND
      // ( (there's a last entry AND it's ongoing) OR
      //   (there's a last entry AND it ended BUT not all activities are completed -> ongoing break) OR
      //   (there are no entries AND totalDuration > currentElapsedTime -> initial countdown/empty timer running)
      // )
      if (
        (lastEntry && lastEntry.endTime === null) ||
        (lastEntry && lastEntry.endTime !== null && !allActivitiesCompleted) ||
        (!hasEntries && totalDuration > currentElapsedTime) 
      ) {
        intervalId = setInterval(updateCurrentTime, 1000);
        updateCurrentTime(); // Initial call to set time immediately if conditions met
      }
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [timerActive, hasEntries, entries, allActivitiesCompleted, initialElapsedTime, totalDuration, currentElapsedTime]); // Added currentElapsedTime to dependencies

  const timeLeft = totalDuration - currentElapsedTime;
  const isOvertime = timeLeft < 0;
  
  // Updated timeDisplay to include total duration in overtime case
  const timeDisplay = timerActive
    ? isOvertime
      ? `Overtime: ${formatTimeHuman(Math.abs(timeLeft) * 1000)} / ${formatTimeHuman(totalDuration * 1000)}`
      : `Time Left: ${formatTimeHuman(timeLeft * 1000)}`
    : `Timer ready: ${formatTimeHuman(totalDuration * 1000)}`;

  const effectiveDuration = useMemo(() => {
    if (isOvertime) {
      return Math.max(totalDuration, currentElapsedTime) * 1000;
    }
    return totalDuration * 1000;
  }, [totalDuration, currentElapsedTime, isOvertime]);

  const timeMarkers = useMemo(() => {
    const { interval, count } = calculateTimeIntervals(effectiveDuration);
    return Array.from({ length: count + 1 }, (_, i) => {
      const milliseconds = i * interval * 1000;
      const position = (milliseconds / effectiveDuration) * 100;
      const isOvertimeMarker = milliseconds > totalDuration * 1000;
      return {
        time: milliseconds,
        position,
        label: formatTimeHuman(milliseconds),
        isOvertimeMarker
      };
    });
  }, [effectiveDuration, totalDuration]);

  const plannedDurationPosition = useMemo(() => {
    if (isOvertime) {
      return (totalDuration * 1000 / effectiveDuration) * 100;
    }
    return 100;
  }, [totalDuration, effectiveDuration, isOvertime]);

  const firstEntry = hasEntries && entries.length > 0 ? entries[0] : undefined;
  const firstEntryStartTime = firstEntry ? firstEntry.startTime : undefined;
  const currentTimeLeft = totalDuration * 1000 - (firstEntryStartTime ? Date.now() - firstEntryStartTime : 0);

  const timeSpansData = calculateTimeSpans({
    entries,
    totalDuration: effectiveDuration,
    allActivitiesCompleted,
    timeLeft: currentTimeLeft,
  });

  // Simplified calculateEntryStyle - direct color usage or fallback
  // This will need further refinement to map to Bootstrap variants if activity-specific colors are kept.
  const calculateEntryStyle = (item: { type: 'activity' | 'gap'; entry?: TimelineEntry; duration: number; height: number } | undefined) => {
    if (!item) {
      return {
        height: '0%',
        backgroundColor: 'transparent',
        variant: 'light', // Default Bootstrap variant
      };
    }

    const style: { height: string; minHeight?: string; backgroundColor?: string; borderColor?: string; color?: string; variant?: string } = {
      height: `${item.height ?? 0}%`,
      minHeight: (item.height ?? 0) < 5 ? '2rem' : undefined,
    };

    if (item.type === 'gap') {
      style.backgroundColor = '#f8f9fa'; // Bootstrap 'light' bg
      style.borderColor = '#dee2e6';   // Bootstrap default border
      style.color = '#6c757d';         // Bootstrap 'secondary' text
      style.variant = 'light';
      return style;
    }

    // Use direct colors if available (from TimelineEntry.colors)
    // This part is a placeholder for proper Bootstrap variant mapping.
    // For now, it assumes 'colors' contains { background, text, border }
    const entryColors = item.entry?.colors as { background: string; text: string; border: string; } | undefined;

    if (entryColors) {
      style.backgroundColor = entryColors.background;
      style.borderColor = entryColors.border;
      style.color = entryColors.text;
      // No direct variant mapping here yet, would need logic to map hex/hsl to Bootstrap variants
    } else {
      // Default styling if no colors provided
      style.backgroundColor = '#e9ecef'; // Bootstrap 'secondary' bg or similar
      style.borderColor = '#ced4da';
      style.color = '#495057';
      style.variant = 'secondary'; // Default if no colors
    }
    return style;
  };

  return (
    <Container fluid className="p-3">
      <Row className="mb-3 align-items-center">
        <Col>
          <h2>Timeline</h2>
        </Col>
        <Col md="auto">
          <div data-testid="time-display" className="text-end">
            <Badge bg={isOvertime ? "danger" : "primary"}>{timeDisplay}</Badge>
          </div>
        </Col>
      </Row>
      
      <Row>
        {/* Ruler Column - using position relative for markers */}
        <Col md={2} className="position-relative border-end" style={{ minHeight: '400px' /* Ensure ruler has height */ }}>
          {isOvertime && (
            <div 
              className="bg-warning opacity-25 position-absolute w-100"
              style={{ 
                top: `${plannedDurationPosition}%`,
                height: `${100 - plannedDurationPosition}%`,
                left: 0,
              }}
              data-testid="overtime-ruler-section"
            />
          )}
          {timeMarkers.map(({ time, position, label }) => (
            <div 
              key={time}
              className="position-absolute w-100 text-muted small"
              style={{ top: `${position}%`, transform: 'translateY(-50%)', paddingLeft: '5px' }}
              data-testid="time-marker"
            >
              {label}
            </div>
          ))}
          {/* Current time marker */}
          {timerActive && hasEntries && !isOvertime && (
            <div
              className="position-absolute w-100"
              style={{
                top: `${(currentElapsedTime * 1000 / effectiveDuration) * 100}%`,
                left: 0,
                height: '2px',
                backgroundColor: 'var(--bs-danger)', // Bootstrap danger color for emphasis
                transform: 'translateY(-1px)',
                zIndex: 10,
              }}
              data-testid="current-time-indicator"
            >
              <Badge pill bg="danger" className="position-absolute top-0 start-100 translate-middle-y ms-1">
                Now
              </Badge>
            </div>
          )}
        </Col>

        {/* Entries Column */}
        <Col md={10}>
          <ListGroup variant="flush" data-testid="timeline-entries-list">
            {hasEntries ? (
              timeSpansData.items.map((item, index) => {
                const itemStyle = calculateEntryStyle(item);
                if (item.type === 'activity' && item.entry) {
                  const activity = item.entry;
                  return (
                    <ListGroup.Item
                      key={activity.id || `activity-${index}`}
                      // variant={itemStyle.variant as any} // Apply variant if determined
                      style={{ 
                        backgroundColor: itemStyle.backgroundColor, 
                        borderColor: itemStyle.borderColor,
                        color: itemStyle.color,
                        minHeight: itemStyle.minHeight,
                        // Height is now controlled by the wrapper div for activities
                      }}
                      className="p-2 d-flex justify-content-between align-items-center"
                    >
                      <div style={{ height: `${item.height}%`, width: '100%' }} className="d-flex justify-content-between align-items-center">
                        <span data-testid="timeline-activity-name" className="fw-bold">{activity.activityName}</span>
                        <Badge bg="secondary" pill>
                          {formatTimeHuman(item.duration)}
                        </Badge>
                      </div>
                    </ListGroup.Item>
                  );
                } else if (item.type === 'gap') {
                  return (
                    <ListGroup.Item 
                      key={`gap-${index}`} 
                      variant="light" // Gaps are styled as 'light'
                      className="p-2 d-flex justify-content-between align-items-center"
                      style={{
                        // backgroundColor: itemStyle.backgroundColor, // Use variant for background
                        // borderColor: itemStyle.borderColor,
                        // color: itemStyle.color,
                        minHeight: itemStyle.minHeight,
                        // Height is now controlled by the wrapper div for gaps
                      }}
                    >
                      <div style={{ height: `${item.height}%`, width: '100%' }} className="d-flex justify-content-between align-items-center">
                        <span className="fst-italic">Break</span> {/* Changed from "Gap" to "Break" */}
                        <Badge bg="info" pill> {/* Using 'info' for breaks, can be adjusted */}
                          {formatTimeHuman(item.duration)}
                        </Badge>
                      </div>
                    </ListGroup.Item>
                  );
                }
                return null;
              })
            ) : (
              <ListGroup.Item className="text-center p-3">
                No activities planned yet
              </ListGroup.Item>
            )}
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
}