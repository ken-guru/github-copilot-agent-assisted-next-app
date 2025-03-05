import { useEffect, useState } from 'react';
import { Activity } from './ActivityManager';
import styles from './Timeline.module.css';

export interface TimelineEntry {
  id: string;
  activityId: string | null;
  activityName: string | null;
  startTime: number; // timestamp in milliseconds
  endTime: number | null; // timestamp in milliseconds or null if ongoing
}

interface TimelineProps {
  entries: TimelineEntry[];
  totalDuration: number; // in seconds
  elapsedTime: number; // in seconds
}

export default function Timeline({ entries, totalDuration, elapsedTime }: TimelineProps) {
  const [timeLeft, setTimeLeft] = useState(totalDuration - elapsedTime);
  const isOvertime = timeLeft < 0;

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

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.heading}>Timeline</h2>
        <div className={`${styles.timeDisplay} ${isOvertime ? styles.timeDisplayOvertime : ''}`}>
          {isOvertime ? 'Overtime: ' : 'Time Left: '}
          {formatTime(timeLeft)}
        </div>
      </div>

      {entries.length === 0 ? (
        <div className={styles.emptyState}>No activities started yet</div>
      ) : (
        <div className={styles.entriesList}>
          {entries.map((entry) => (
            <div key={entry.id} className={styles.entry}>
              <div className={styles.entryHeader}>
                <div>
                  <span className={entry.activityId ? styles.activityName : styles.idleActivity}>
                    {entry.activityName || 'Break'}
                  </span>
                  <div className={styles.timeInfo}>
                    {new Date(entry.startTime).toLocaleTimeString()} 
                    {entry.endTime ? 
                      ` - ${new Date(entry.endTime).toLocaleTimeString()}` : 
                      ' - ongoing'}
                  </div>
                </div>
                <div className={styles.durationInfo}>
                  Duration: {formatTime(calculateDuration(entry))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {isOvertime && (
        <div className={styles.warningMessage}>
          <strong>Warning:</strong> You've exceeded the planned time!
        </div>
      )}
    </div>
  );
}