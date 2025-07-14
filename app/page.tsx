

"use client";
import type { Activity } from '../components/feature/ActivityManager';
import { useState, useEffect, useRef } from 'react';
import { LoadingProvider, useLoading } from '../contexts/loading';
import { SplashScreen } from '../components/splash/SplashScreen';
import TimeSetup from '../components/TimeSetup';
import ActivityManager from '../components/ActivityManager';
import Timeline from '../components/Timeline';
import Summary from '../components/Summary';
import ProgressBar from '../components/ProgressBar';
import ThemeToggle from '../components/ThemeToggle';
import { OfflineIndicator } from '../components/OfflineIndicator';
import ConfirmationDialog, { ConfirmationDialogRef } from '../components/ConfirmationDialog';
import { useActivityState } from '../hooks/use-activity-state';
import { useTimerState } from '../hooks/use-timer-state';
import resetService from '../lib/utils/resetService';
import styles from './page.module.css';

function AppContent() {
  const { setIsLoading } = useLoading();
  const [timeSet, setTimeSet] = useState(false);
  const [totalDuration, setTotalDuration] = useState(0);
  const resetDialogRef = useRef<ConfirmationDialogRef>(null);
  
  const {
    currentActivity,
    timelineEntries,
    completedActivityIds,
    allActivitiesCompleted,
    selectActivity,
    deleteActivity,
    resetActivities,
  } = useActivityState({
    onTimerStart: () => {
      if (!timerActive) startTimer();
    }
  });

  // Adapter for ActivityManager's expected signature
  // Adapter for ActivityManager's expected signature
  const handleActivitySelect = (activity: Activity | null) => {
    if (activity) {
      selectActivity(activity);
    }
  };
  
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

  useEffect(() => {
    const initApp = async () => {
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    };
    initApp();
  }, [setIsLoading]);

  useEffect(() => {
    resetService.setDialogCallback((message) => {
      return new Promise((resolve) => {
        const handleConfirm = () => {
          resolve(true);
        };
        const handleCancel = () => {
          resolve(false);
        };
        setDialogActions({
          message,
          onConfirm: handleConfirm,
          onCancel: handleCancel
        });
        resetDialogRef.current?.showDialog();
      });
    });
    return () => {
      resetService.setDialogCallback(null);
    };
  }, []);

  const [dialogActions, setDialogActions] = useState({
    message: 'Are you sure you want to reset the application? All progress will be lost.',
    onConfirm: () => {},
    onCancel: () => {}
  });

  useEffect(() => {
    const unregisterCallbacks = resetService.registerResetCallback(() => {
      setTimeSet(false);
      setTotalDuration(0);
      resetActivities();
      resetTimer();
    });
    return unregisterCallbacks;
  }, [resetActivities, resetTimer]);

  const handleTimeSet = (durationInSeconds: number) => {
    setTotalDuration(durationInSeconds);
    setTimeSet(true);
  };

  const handleReset = async () => {
    await resetService.reset();
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
    <>
      <SplashScreen minimumDisplayTime={500} />
      <div className={`${styles.layout} ${styles.container}`}>
        <ConfirmationDialog
          ref={resetDialogRef}
          message={dialogActions.message}
          confirmText="Reset"
          cancelText="Cancel"
          onConfirm={dialogActions.onConfirm}
          onCancel={dialogActions.onCancel}
        />
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
          <OfflineIndicator />
          {timeSet && !allActivitiesCompleted && (
            <div className={styles.progressContainer} data-testid="progress-container">
              <ProgressBar 
                entries={processedEntries}
                totalDuration={totalDuration}
                elapsedTime={elapsedTime}
                timerActive={timerActive}
              />
            </div>
          )}
          {appState === 'setup' && (
            <div className={styles.setupGrid}>
              <TimeSetup onTimeSet={handleTimeSet} />
            </div>
          )}
          {appState === 'activity' && (
            <div className={styles.activityGrid}>
              <ActivityManager 
                onActivitySelect={handleActivitySelect} 
                onActivityRemove={deleteActivity}
                currentActivityId={currentActivity?.id || null} 
                completedActivityIds={completedActivityIds}
                timelineEntries={processedEntries}
                isTimeUp={isTimeUp}
                elapsedTime={elapsedTime}
              />
              <Timeline 
                entries={processedEntries}
                totalDuration={totalDuration} 
                elapsedTime={elapsedTime}
                allActivitiesCompleted={allActivitiesCompleted}
                timerActive={timerActive}
                isTimeUp={isTimeUp}
              />
            </div>
          )}
          {appState === 'completed' && (
            <div className={styles.completedGrid}>
              <Summary 
                entries={processedEntries}
                totalDuration={totalDuration} 
                elapsedTime={elapsedTime}
                allActivitiesCompleted={allActivitiesCompleted}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default function Home() {
  return (
    <LoadingProvider initialLoadingState={true}>
      <AppContent />
    </LoadingProvider>
  );
}
