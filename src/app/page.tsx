'use client';
import { useState, useEffect, useRef } from 'react';
import { writeActivitySummary } from '../utils/firebase-summary';
import { Activity } from '../types/activity';
import resetService from '../utils/resetService';
import { useLoading, LoadingProvider } from '../contexts/LoadingContext';
import { useActivityState } from '../hooks/useActivityState';
import { useTimerState } from '../hooks/useTimerState';
import ConfirmationDialog, { ConfirmationDialogRef } from '../components/ConfirmationDialog';
import ActivityManager from '../components/ActivityManager';
import Timeline from '../components/Timeline';
import Summary from '../components/Summary';
import TimeSetup from '../components/TimeSetup';

// Main application content with loading context
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
    extendDuration: clearTimeUpState,
  } = useTimerState({
    totalDuration,
    isCompleted: allActivitiesCompleted
  });
  const [dialogActions, setDialogActions] = useState({
    message: 'Are you sure you want to reset the application? All progress will be lost.',
    onConfirm: () => {},
    onCancel: () => {}
  });

  useEffect(() => {
    const initApp = async () => {
      setTimeout(() => {
        setIsLoading(false);
      }, 800);
    };
    initApp();
  }, [setIsLoading]);

  useEffect(() => {
    resetService.setDialogCallback((message: string) => {
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
    // eslint-disable-next-line no-console
    console.log('[AppContent] handleTimeSet called', { durationInSeconds });
    setTotalDuration(durationInSeconds);
    setTimeSet(true);
  };

  const handleExtendDuration = () => {
    if (elapsedTime <= totalDuration) {
      setTotalDuration(totalDuration + 60);
    } else {
      setTotalDuration(elapsedTime + 60);
    }
    clearTimeUpState();
  };

  const handleReset = async () => {
    await resetService.reset();
  };

  const appState = !timeSet
    ? 'setup'
    : allActivitiesCompleted
      ? 'completed'
      : 'activity';

  const processedEntries = timelineEntries.map((entry: any) => ({
    ...entry,
    endTime: entry.endTime === undefined ? null : entry.endTime
  }));

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('[AppContent] effect deps', { appState, processedEntries, totalDuration, elapsedTime });
    // Extra debug: log timer state changes
    // eslint-disable-next-line no-console
    console.log('[AppContent] timer state', { totalDuration, elapsedTime, timerActive });
    if (appState === 'completed' && processedEntries.length > 0 && totalDuration > 0 && elapsedTime > 0) {
      const activities: Activity[] = processedEntries
        .filter((e: any) => e.activityId && e.activityName)
        .map((e: any) => ({
          id: e.activityId || '',
          name: e.activityName || '',
          description: e.description || '',
          colorIndex: 0,
          createdAt: new Date(e.startTime).toISOString(),
          isActive: false,
        }));
      const summary = {
        userId: 'demo-user',
        timestamp: new Date().toISOString(),
        activities,
        totalDuration,
        elapsedTime,
        overtime: Math.max(0, elapsedTime - totalDuration),
      };
      // eslint-disable-next-line no-console
      console.log('[AppContent] useEffect writing summary', summary);
      writeActivitySummary(summary).catch((err: any) => {
        // eslint-disable-next-line no-console
        console.error('Failed to write summary to Firebase:', err);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appState, processedEntries, totalDuration, elapsedTime]);

  return (
    <>
      <main className="container-fluid d-flex flex-column overflow-x-hidden overflow-y-auto" style={{ height: 'calc(100vh - var(--navbar-height))' }}>
        {/* Confirmation Dialog */}
        <ConfirmationDialog
          ref={resetDialogRef}
          message={dialogActions.message}
          confirmText="Reset"
          cancelText="Cancel"
          onConfirm={dialogActions.onConfirm}
          onCancel={dialogActions.onCancel}
        />
        <div className="flex-grow-1 d-flex flex-column overflow-x-hidden overflow-y-auto">
          {appState === 'setup' && (
            <div className="d-flex justify-content-center align-items-start flex-grow-1 p-4">
              <TimeSetup onTimeSet={handleTimeSet} />
            </div>
          )}
          {appState === 'activity' && (
            <div className="row flex-grow-1 g-3 px-3 pt-3 pb-3 overflow-x-hidden overflow-y-auto">
              <div className="col-lg-5 d-flex flex-column overflow-x-hidden overflow-y-auto">
                <ActivityManager 
                  onActivitySelect={handleActivitySelect} 
                  onActivityRemove={handleActivityRemoval}
                  currentActivityId={currentActivity?.id || null} 
                  completedActivityIds={completedActivityIds}
                  timelineEntries={processedEntries}
                  isTimeUp={isTimeUp}
                  elapsedTime={elapsedTime}
                  totalDuration={totalDuration}
                  timerActive={timerActive}
                  onReset={handleReset}
                  onExtendDuration={handleExtendDuration}
                />
              </div>
              <div className="col-lg-7 d-none d-lg-flex flex-column overflow-hidden">
                <Timeline 
                  entries={processedEntries}
                  totalDuration={totalDuration} 
                  elapsedTime={elapsedTime}
                  allActivitiesCompleted={allActivitiesCompleted}
                  timerActive={timerActive}
                />
              </div>
            </div>
          )}
          {appState === 'completed' && (
            <div className="d-flex justify-content-center flex-grow-1 p-4">
              <Summary 
                entries={processedEntries}
                totalDuration={totalDuration} 
                elapsedTime={elapsedTime}
                allActivitiesCompleted={allActivitiesCompleted}
                onReset={handleReset}
              />
            </div>
          )}
        </div>
      </main>
    </>
  );
}
// (No code here: all logic is now inside the function and only one useEffect and one return exist)

// Main Home component that provides the LoadingContext
export default function Home() {
  return (
    <LoadingProvider initialLoadingState={false}>
      <AppContent />
    </LoadingProvider>
  );
}
