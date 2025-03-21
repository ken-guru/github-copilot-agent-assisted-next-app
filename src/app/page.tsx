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
import { Activity } from '@/components/ActivityManager';
import styles from './page.module.css';

export default function Home() {
  const [totalDuration, setTotalDuration] = useState(0);
  const [showResetFeedback, setShowResetFeedback] = useState(false);
  
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
    initializeActivities,
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

  const normalizeActivityId = (name: string): string => {
    return name.toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  };
  
  const handleStartActivity = (activities: Activity[]) => {
    // Normalize activity IDs before initializing
    const normalizedActivities = activities.map(activity => ({
      ...activity,
      id: activity.name ? normalizeActivityId(activity.name) : activity.id
    }));
    
    // Initialize activities with the ordered activities from the Planning state
    if (normalizedActivities && normalizedActivities.length > 0) {
      initializeActivities(normalizedActivities);
    }
    
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
    // Show visual feedback first
    setShowResetFeedback(true);
    
    // Wait for animation to complete, then reset state
    setTimeout(() => {
      setTotalDuration(0);
      resetActivities();
      resetTimer();
      resetAppState();
      setShowResetFeedback(false);
    }, 800);
  };
  
  const processedEntries = timelineEntries.map(entry => ({
    ...entry,
    endTime: entry.endTime === undefined ? null : entry.endTime
  }));
  
  return (
    <div className={styles.container}>
      {/* Reset feedback overlay - shows when starting a new session */}
      {showResetFeedback && (
        <div className={styles.resetFeedbackOverlay} data-testid="reset-feedback">
          <div className={styles.resetFeedbackContent}>
            <svg className={styles.checkmarkIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
            <p>Starting new session...</p>
          </div>
        </div>
      )}
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
              <h2>Session Complete!</h2>
              
              <div className={styles.completionSuccess} data-testid="completion-message">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                  <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
                All activities have been completed successfully!
              </div>
              
              <Summary 
                entries={processedEntries}
                totalDuration={totalDuration} 
                elapsedTime={elapsedTime}
                allActivitiesCompleted={allActivitiesCompleted}
              />
              
              <button 
                className={styles.startNewButton}
                onClick={handleStartNew}
                data-testid="start-new-session"
              >
                <span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 5v14M5 12h14"></path>
                  </svg>
                  Start New Session
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
