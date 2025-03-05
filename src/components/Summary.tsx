import { Activity } from './ActivityManager';
import { TimelineEntry } from './Timeline';
import styles from './Summary.module.css';

interface SummaryProps {
  entries: TimelineEntry[];
  totalDuration: number; // in seconds
  elapsedTime: number; // in seconds
  allActivitiesCompleted: boolean;
}

interface ActivitySummary {
  activityId: string | null;
  activityName: string | null;
  totalDuration: number; // in seconds
}

export default function Summary({ entries, totalDuration, elapsedTime, allActivitiesCompleted }: SummaryProps) {
  if (!allActivitiesCompleted) {
    return null;
  }

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}m ${secs}s`;
  };

  // Calculate activity summaries
  const activitySummaries: ActivitySummary[] = entries.reduce((acc: ActivitySummary[], entry) => {
    const duration = entry.endTime 
      ? Math.round((entry.endTime - entry.startTime) / 1000) 
      : 0;

    const existingActivity = acc.find(a => a.activityId === entry.activityId);
    
    if (existingActivity) {
      existingActivity.totalDuration += duration;
    } else {
      acc.push({
        activityId: entry.activityId,
        activityName: entry.activityName,
        totalDuration: duration
      });
    }
    
    return acc;
  }, []);

  // Sort by duration (descending)
  activitySummaries.sort((a, b) => b.totalDuration - a.totalDuration);

  // Calculate total idle time (null activityId)
  const idleTime = activitySummaries.find(a => a.activityId === null)?.totalDuration || 0;

  // Calculate time deviation from plan
  const timeDeviation = elapsedTime - totalDuration;
  const onTime = Math.abs(timeDeviation) < 60; // within 1 minute of plan
  const early = timeDeviation < -60;
  const late = timeDeviation > 60;

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Activity Summary</h2>
      
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Total Time</div>
          <div className={styles.statValue}>{formatTime(elapsedTime)}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Planned Time</div>
          <div className={styles.statValue}>{formatTime(totalDuration)}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Active Time</div>
          <div className={styles.statValue}>{formatTime(elapsedTime - idleTime)}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Idle Time</div>
          <div className={styles.statValue}>{formatTime(idleTime)}</div>
        </div>
      </div>
      
      {/* Time status message */}
      <div className={`${styles.statusMessage} 
        ${onTime ? styles.statusMessageOnTime : ''}
        ${early ? styles.statusMessageEarly : ''}
        ${late ? styles.statusMessageLate : ''}
      `}>
        {onTime && <p>Great job! You completed everything right on schedule!</p>}
        {early && <p>Amazing! You finished {formatTime(Math.abs(timeDeviation))} earlier than planned!</p>}
        {late && <p>You took {formatTime(timeDeviation)} more than planned, but you got everything done!</p>}
      </div>
      
      <h3 className={styles.sectionHeading}>Activity Breakdown</h3>
      <div className={styles.activityList}>
        {activitySummaries
          .filter(summary => summary.activityId !== null)
          .map((summary, index) => (
            <div 
              key={summary.activityId || index} 
              className={styles.activityItem}
            >
              <span className={styles.activityName}>{summary.activityName}</span>
              <span>{formatTime(summary.totalDuration)}</span>
            </div>
          ))}
        
        {idleTime > 0 && (
          <div className={styles.activityItem}>
            <span className={styles.idleTime}>Breaks/Idle time</span>
            <span>{formatTime(idleTime)}</span>
          </div>
        )}
      </div>
    </div>
  );
}