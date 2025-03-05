import { useEffect, useState } from 'react';
import { Activity } from './ActivityManager';
import styles from './Timeline.module.css';
import { ColorSet } from '../utils/colors';

export interface TimelineEntry {
  id: string;
  activityId: string | null;
  activityName: string | null;
  startTime: number; // timestamp in milliseconds
  endTime: number | null; // timestamp in milliseconds or null if ongoing
  colors?: ColorSet;
  isLeftoverTime?: boolean;
}

interface TimelineProps {
  entries: TimelineEntry[];
  totalDuration: number; // in seconds
  elapsedTime: number; // in seconds
  allActivitiesCompleted?: boolean;
  timerActive?: boolean;
}

export default function Timeline({ 
  entries, 
  totalDuration, 
  elapsedTime, 
  allActivitiesCompleted,
  timerActive = false
}: TimelineProps) {
  const [timeLeft, setTimeLeft] = useState(totalDuration - elapsedTime);
  const isOvertime = timeLeft < 0;

  // Calculate the actual time span needed for all activities
  const calculateActualTimeSpan = () => {
    if (entries.length === 0) return totalDuration;
    
    const lastEntry = entries[entries.length - 1];
    const lastEndTime = lastEntry.endTime || Date.now();
    const timeSpanNeeded = Math.round((lastEndTime - entries[0].startTime) / 1000);
    
    return Math.max(totalDuration, timeSpanNeeded);
  };

  // Format time as mm:ss or hh:mm:ss if hours > 0
  const formatTime = (seconds: number): string => {
    const absSeconds = Math.abs(seconds);
    const hours = Math.floor(absSeconds / 3600);
    const minutes = Math.floor((absSeconds % 3600) / 60);
    const secs = absSeconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    setTimeLeft(totalDuration - elapsedTime);
  }, [totalDuration, elapsedTime]);

  // Calculate duration for a timeline entry
  const calculateDuration = (entry: TimelineEntry): number => {
    const end = entry.endTime || Date.now();
    return Math.round((end - entry.startTime) / 1000);
  };

  // Calculate position and height for timeline entries
  const calculateEntryStyle = (entry: TimelineEntry) => {
    const startOffset = Math.round((entry.startTime - entries[0].startTime) / 1000);
    const duration = calculateDuration(entry);
    const actualTimeSpan = calculateActualTimeSpan();
    
    const top = (startOffset / actualTimeSpan) * 100;
    const height = (duration / actualTimeSpan) * 100;

    return {
      top: `${Math.min(top, 98)}%`,
      height: `${Math.min(height, 100 - top)}%`
    };
  };

  // Format time info more concisely
  const formatTimeInfo = (entry: TimelineEntry) => {
    const startTime = new Date(entry.startTime);
    const endTime = entry.endTime ? new Date(entry.endTime) : null;
    
    const formatHourMin = (date: Date) => {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return endTime ? 
      `${formatHourMin(startTime)} - ${formatHourMin(endTime)}` : 
      `${formatHourMin(startTime)} - ongoing`;
  };

  // Add leftover time entry if all activities are completed with time remaining
  const displayedEntries = [...entries];
  if (allActivitiesCompleted && timeLeft > 0 && entries.length > 0) {
    const lastEntry = entries[entries.length - 1];
    if (lastEntry.endTime) {
      displayedEntries.push({
        id: 'leftover',
        activityId: null,
        activityName: 'Time Remaining',
        startTime: lastEntry.endTime,
        endTime: lastEntry.endTime + (timeLeft * 1000),
        isLeftoverTime: true
      });
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.heading}>Timeline</h2>
        <div className={`${styles.timeDisplay} ${isOvertime ? styles.timeDisplayOvertime : ''} ${!timerActive ? styles.timeDisplayInactive : ''}`}>
          {!timerActive ? (
            `Timer ready: ${formatTime(totalDuration)}`
          ) : (
            `${isOvertime ? 'Overtime: ' : 'Time Left: '} ${formatTime(timeLeft)}`
          )}
        </div>
      </div>

      <div className={`${styles.timelineContainer} ${displayedEntries.length > 0 && styles.hasEntries}`}>
        <div className={styles.timelineRuler}>
          <div className={styles.timelineRulerLine} />
        </div>
        
        {displayedEntries.length === 0 ? (
          <div className={styles.emptyState}>No activities started yet</div>
        ) : (
          <div className={styles.entriesList}>
            {displayedEntries.map((entry) => {
              const style = calculateEntryStyle(entry);
              const isShort = parseFloat(style.height) < 10;
              
              return (
                <div
                  key={entry.id}
                  className={`${styles.entry} ${!entry.activityId ? styles.idleActivity : ''} ${isShort ? styles.shortEntry : ''} ${entry.isLeftoverTime ? styles.leftoverTime : ''}`}
                  style={style}
                >
                  <div 
                    className={styles.entryIndicator}
                    style={entry.colors ? {
                      color: entry.colors.text,
                      backgroundColor: entry.colors.background,
                      borderColor: entry.colors.border
                    } : undefined}
                  />
                  <div 
                    className={styles.entryContent}
                    style={entry.colors ? {
                      backgroundColor: entry.colors.background
                    } : undefined}
                  >
                    <div className={styles.entryHeader}>
                      <span 
                        className={styles.activityName}
                        style={entry.colors ? { color: entry.colors.text } : undefined}
                      >
                        {entry.activityName || 'Break'}
                      </span>
                      <span 
                        className={styles.durationInfo}
                        style={entry.colors ? { color: entry.colors.text } : undefined}
                      >
                        {formatTime(calculateDuration(entry))}
                      </span>
                    </div>
                    <div 
                      className={styles.timeInfo}
                      style={entry.colors ? { color: entry.colors.text } : undefined}
                    >
                      {formatTimeInfo(entry)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {isOvertime && (
        <div className={styles.warningMessage}>
          <strong>Warning:</strong> You've exceeded the planned time!
        </div>
      )}
    </div>
  );
}