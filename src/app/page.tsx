'use client';
import { useState } from 'react';
import TimeSetup from '@/components/TimeSetup';
import ActivityManager from '@/components/ActivityManager';
import Timeline from '@/components/Timeline';
import Summary from '@/components/Summary';
import ProgressBar from '@/components/ProgressBar';
import ThemeToggle from '@/components/ThemeToggle';
import { useActivityState } from '@/hooks/useActivityState';
import { useTimerState } from '@/hooks/useTimerState';
import styles from './page.module.css';

export default function Home() {
  const [timeSet, setTimeSet] = useState(false);
  const [totalDuration, setTotalDuration] = useState(0);
  
  const {
    currentActivity,
    timelineEntries,
    completedActivityIds,
    allActivitiesCompleted,
    handleActivitySelect,
    handleActivityRemoval,
    resetActivities,
  } = useActivityState({
    onTimerStart: () => {
      if (!timerActive) startTimer();
    }
  });
  
  const {
    elapsedTime,
    isTimeUp,
    timerActive,
    startTimer,
    resetTimer,
  } = useTimerState({
    totalDuration,
    isCompleted: allActivitiesCompleted
  });
  
  const handleTimeSet = (durationInSeconds: number) => {
    setTotalDuration(durationInSeconds);
    setTimeSet(true);
  };
  
  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset the application? All progress will be lost.')) {
      setTimeSet(false);
      setTotalDuration(0);
      resetActivities();
      resetTimer();
    }
  };
  
  const appState = !timeSet 
    ? 'setup' 
    : allActivitiesCompleted 
      ? 'completed' 
      : 'activity';
  
  const processedEntries = timelineEntries.map(entry => ({
    ...entry,
    endTime: entry.endTime === undefined ? null : entry.endTime
  }));
  
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>Mr. Timely</h1>
            <ThemeToggle />
            <div className={styles.resetButtonContainer}>
              {appState !== 'setup' && (
                <button 
                  className={styles.resetButton} 
                  onClick={handleReset}
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </header>

        {appState === 'setup' && (
          <div className={styles.setupGrid}>
            <TimeSetup onTimeSet={handleTimeSet} />
          </div>
        )}
        
        {appState === 'activity' && (
          <div className={styles.activityGrid}>
            <div>
              <ActivityManager 
                onActivitySelect={handleActivitySelect} 
                onActivityRemove={handleActivityRemoval}
                currentActivityId={currentActivity?.id || null} 
                completedActivityIds={completedActivityIds}
                timelineEntries={processedEntries}
                isTimeUp={isTimeUp}
                elapsedTime={elapsedTime}
              />
            </div>
            <div className={styles.timelineContainer}>
              <Timeline 
                entries={processedEntries}
                totalDuration={totalDuration} 
                elapsedTime={elapsedTime}
                allActivitiesCompleted={allActivitiesCompleted}
                timerActive={timerActive}
                isTimeUp={isTimeUp}
              />
            </div>
          </div>
        )}
        
        {appState === 'completed' && (
          <div className={styles.completedGrid}>
            <div className={styles.summaryContainer}>
              <Summary 
                entries={processedEntries}
                totalDuration={totalDuration} 
                elapsedTime={elapsedTime}
                allActivitiesCompleted={allActivitiesCompleted}
              />
            </div>
          </div>
        )}

        {/* Progress bar always visible and fixed to bottom in mobile view */}
        <div className={styles.progressContainer}>
          <ProgressBar 
            entries={processedEntries}
            totalDuration={totalDuration}
            elapsedTime={elapsedTime}
            timerActive={timerActive}
          />
        </div>
      </div>
    </div>
  );
}
