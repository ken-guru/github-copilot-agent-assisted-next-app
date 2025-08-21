'use client';
import { useState, useEffect, useRef } from 'react';
import { LoadingProvider, useLoading } from '@/contexts/loading';
import TimeSetup from '@/components/TimeSetup';
import ActivityManager from '@/components/ActivityManager';
import Timeline from '@/components/Timeline';
import Summary from '@/components/Summary';
import ConfirmationDialog, { ConfirmationDialogRef } from '@/components/ConfirmationDialog';
import { useActivityState } from '@/hooks/useActivityState';
import { useTimerState } from '@/hooks/useTimerState';
import resetService from '@/utils/resetService';
import { loadSessionSnapshot, saveSessionSnapshot, clearSessionSnapshot } from '@/utils/session-storage';

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
  removedActivityIds,
    allActivitiesCompleted,
    handleActivitySelect,
    handleActivityRemoval,
  restoreActivity,
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

  // Initialize app and hide loading screen after initialization is complete
  useEffect(() => {
    const initApp = async () => {
      // Attempt to resume previous session state from localStorage
      const snap = loadSessionSnapshot();
      if (snap && snap.timeSet) {
        setTotalDuration(snap.totalDuration);
        setTimeSet(true);
        // Rehydrate timeline entries by selecting activities in recorded order
        // Ensure activities are registered first; ActivityManager will add on mount
        // So we defer handleActivitySelect until after first paint
        setTimeout(() => {
          // Replay timeline: select/complete based on entries
          snap.timelineEntries.forEach((entry, idx) => {
            // We only need to set current activity equal to last running entry
            // Earlier entries will render in Timeline component from entries state
            if (idx === snap.timelineEntries.length - 1 && entry.endTime == null) {
              // Select current running activity by id/name
              // Minimal synthetic object to trigger selection without altering colors
              handleActivitySelect({ id: String(entry.activityId), name: String(entry.activityName || ''), colorIndex: 0, createdAt: new Date().toISOString(), isActive: true } as any, false);
            }
          });
        }, 0);
      }
      // Add any actual initialization logic here
      // For example: load user preferences, preload critical data
      
      // For demo purposes, using a timeout to simulate loading
      setTimeout(() => {
        setIsLoading(false);
      }, 800);
    };
    
    initApp();
  }, [setIsLoading]);
  
  // Set up the dialog callback for resetService
  useEffect(() => {
    resetService.setDialogCallback((message) => {
      return new Promise((resolve) => {
        const handleConfirm = () => {
          resolve(true);
        };
        
        const handleCancel = () => {
          resolve(false);
        };
        
        // Store these in component state so they can be used by the dialog
        setDialogActions({
          message,
          onConfirm: handleConfirm,
          onCancel: handleCancel
        });
        
        // Show the dialog
        resetDialogRef.current?.showDialog();
      });
    });
    
    return () => {
      // Clean up by removing the callback on unmount
      resetService.setDialogCallback(null);
    };
  }, []);
  
  // Store dialog action handlers in state so they're stable across renders
  const [dialogActions, setDialogActions] = useState({
    message: 'Are you sure you want to reset the application? All progress will be lost.',
    onConfirm: () => {},
    onCancel: () => {}
  });
  
  // Register all reset callbacks
  useEffect(() => {
    const unregisterCallbacks = resetService.registerResetCallback(() => {
      setTimeSet(false);
      setTotalDuration(0);
      resetActivities();
      resetTimer();
  clearSessionSnapshot();
    });
    
    // Clean up on component unmount
    return unregisterCallbacks;
  }, [resetActivities, resetTimer]);
  
  const handleTimeSet = (durationInSeconds: number) => {
    setTotalDuration(durationInSeconds);
    setTimeSet(true);
  };
  
  const handleExtendDuration = () => {
    if (elapsedTime <= totalDuration) {
      // Normal case: just add 1 minute
      setTotalDuration(totalDuration + 60);
    } else {
      // Overtime case: set duration to elapsed time + 1 minute
      setTotalDuration(elapsedTime + 60);
    }
    // Clear the time up state
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
  
  const processedEntries = timelineEntries.map(entry => ({
    ...entry,
    endTime: entry.endTime === undefined ? null : entry.endTime
  }));

  // Persist session snapshot on key state changes
  useEffect(() => {
    try {
      if (!timeSet) return;
      const snapshot = {
        timeSet,
        totalDuration,
        timerActive,
        currentActivityId: currentActivity?.id ?? null,
        timelineEntries: processedEntries
      };
      saveSessionSnapshot(snapshot);
    } catch {
      // ignore
    }
  }, [timeSet, totalDuration, timerActive, currentActivity?.id, processedEntries]);
  
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
                  onActivityRestore={restoreActivity}
                  currentActivityId={currentActivity?.id || null} 
                  completedActivityIds={completedActivityIds}
                  removedActivityIds={removedActivityIds}
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
                skippedActivityIds={removedActivityIds}
                onReset={handleReset}
              />
            </div>
          )}
        </div>
      </main>
    </>
  );
}

// Main Home component that provides the LoadingContext
export default function Home() {
  return (
    <LoadingProvider initialLoadingState={false}>
      <AppContent />
    </LoadingProvider>
  );
}
