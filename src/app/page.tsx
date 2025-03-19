'use client';
import { useState, useEffect } from 'react';
import TimeSetup from '@/components/TimeSetup';
import ActivityManager from '@/components/ActivityManager';
import Timeline from '@/components/Timeline';
import Summary from '@/components/Summary';
import ProgressBar from '@/components/ProgressBar';
import ThemeToggle from '@/components/ThemeToggle';
import { useActivityState } from '@/hooks/useActivityState';
import { useAppState } from '@/hooks/useAppState';
import { useTimerState } from '@/hooks/useTimerState';
import styles from './page.module.css';

export default function Home() {
  const [totalDuration, setTotalDuration] = useState(0);
  
  // Use the new AppState hook for managing the overall application flow
  const {
    currentState,
    moveToPlanning,
    moveToActivity,
    moveToCompleted,
    reset: resetAppState,
    isSetupState,
    isPlanningState,
    isActivityState,
    isCompletedState
  } = useAppState({
    onTimerStart: () => {
      if (!timerActive) startTimer();
    }
  });
  
  const {
    currentActivity,
    timelineEntries,
    completedActivityIds,
    allActivitiesCompleted,
    handleActivitySelect,
    handleActivityRemoval,
    resetActivities,
  } = useActivityState();
  
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
    // Transition from Setup to Planning state
    moveToPlanning();
  };
  
  const handleStartActivity = () => {
    // Transition from Planning to Activity state
    moveToActivity();
  };
  
  // Handle completion of all activities
  const handleActivitiesCompleted = () => {
    if (allActivitiesCompleted && isActivityState) {
      moveToCompleted();
    }
  };
  
  // Check if activities are completed when allActivitiesCompleted changes
  // or when the app state changes to Activity
  useEffect(() => {
    if (allActivitiesCompleted && isActivityState) {
      moveToCompleted();
    }
  }, [allActivitiesCompleted, isActivityState, moveToCompleted]);
  
  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset the application? All progress will be lost.')) {
      setTotalDuration(0);
      resetActivities();
      resetTimer();
      
      // Only reset app state if we're in the Completed state
      // otherwise we'll throw an error
      if (isCompletedState) {
        resetAppState();
      } else {
        // Force reset by refreshing the page if not in Completed state
        window.location.reload();
      }
    }
  };
  
  const handleStartNew = () => {
    setTotalDuration(0);
    resetActivities();
    resetTimer();
    resetAppState();
  };
  
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
              {!isSetupState && (
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
        
        {/* SETUP STATE */}
        {isSetupState && (
          <div className={styles.setupGrid}>
            <TimeSetup onTimeSet={handleTimeSet} />
          </div>
        )}
        
        {/* PLANNING STATE */}
        {isPlanningState && (
          <div className={styles.planningGrid || styles.activityGrid}>
            <div>
              <h2>Planning Phase</h2>
              <p>Add and arrange your activities for this session</p>
              <ActivityManager 
                onActivitySelect={handleActivitySelect} 
                onActivityRemove={handleActivityRemoval}
                currentActivityId={null} 
                completedActivityIds={[]}
                timelineEntries={[]}
                planningMode={true}
                isTimeUp={false}
                elapsedTime={0}
                onStartActivities={handleStartActivity}
              />
            </div>
          </div>
        )}
        
        {/* ACTIVITY STATE */}
        {isActivityState && (
          <div className={styles.activityGrid}>
            <div className={styles.progressContainer}>
              <ProgressBar 
                entries={processedEntries}
                totalDuration={totalDuration}
                elapsedTime={elapsedTime}
                timerActive={timerActive}
              />
            </div>
            <div>
              <ActivityManager 
                onActivitySelect={handleActivitySelect} 
                onActivityRemove={handleActivityRemoval}
                currentActivityId={currentActivity?.id || null} 
                completedActivityIds={completedActivityIds}
                timelineEntries={processedEntries}
                planningMode={false}
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
        
        {/* COMPLETED STATE */}
        {isCompletedState && (
          <div className={styles.completedGrid}>
            <div className={styles.summaryContainer}>
              <Summary 
                entries={processedEntries}
                totalDuration={totalDuration} 
                elapsedTime={elapsedTime}
                allActivitiesCompleted={allActivitiesCompleted}
              />
              <button 
                className={styles.startNewButton || styles.button} 
                onClick={handleStartNew}
              >
                Start New
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
