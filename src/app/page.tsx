'use client';
import { useState, useEffect, useRef } from 'react';
import { LoadingProvider, useLoading } from '@/contexts/loading';
import TimeSetup from '@/components/TimeSetup';
import ActivityManager from '@/components/ActivityManager';
import Timeline from '@/components/Timeline';
import Summary from '@/components/Summary';
import ConfirmationDialog, { ConfirmationDialogRef } from '@/components/ConfirmationDialog';
import SessionRecoveryAlert from '@/components/SessionRecoveryAlert';
import { useActivityState } from '@/hooks/useActivityState';
import { useTimerState } from '@/hooks/useTimerState';
import { useSessionPersistence } from '@/hooks/useSessionPersistence';
import { SessionRecoveryInfo } from '@/types/session';
import resetService from '@/utils/resetService';

// Main application content with loading context
function AppContent() {
  const { setIsLoading } = useLoading();
  const [timeSet, setTimeSet] = useState(false);
  const [totalDuration, setTotalDuration] = useState(0);
  const resetDialogRef = useRef<ConfirmationDialogRef>(null);
  
  // Session recovery state
  const [showRecoveryAlert, setShowRecoveryAlert] = useState(false);
  const [recoveryInfo, setRecoveryInfo] = useState<SessionRecoveryInfo | null>(null);
  
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
    getAllActivityStates,
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

  // Session persistence hook for auto-save and recovery  
  // For now, simplify by using activity states instead of full activities
  const sessionState = timeSet ? {
    timeSet,
    totalDuration,
    elapsedTime,
    timerActive,
    currentActivity,
    timelineEntries,
    completedActivityIds,
    removedActivityIds,
    allActivitiesCompleted,
    activities: [], // Simplified for now - ActivityStates contain the essential data
    activityStates: getAllActivityStates ? getAllActivityStates() : [],
  } : null;

  const {
    isPersistenceAvailable,
    clearSession,
    checkRecoverableSession,
    loadSessionForRecovery,
  } = useSessionPersistence(sessionState, {
    saveInterval: 10000, // Auto-save every 10 seconds
  });

  // Initialize app and check for recoverable session
  useEffect(() => {
    const initApp = async () => {
      // Check for recoverable session before showing loading screen
      if (isPersistenceAvailable) {
        const sessionRecoveryInfo = await checkRecoverableSession();
        
        if (sessionRecoveryInfo.hasRecoverableSession) {
          setRecoveryInfo(sessionRecoveryInfo);
          setShowRecoveryAlert(true);
          setIsLoading(false); // Show recovery alert instead of loading
          return;
        }
      }
      
      // For demo purposes, using a timeout to simulate loading
      setTimeout(() => {
        setIsLoading(false);
      }, 800);
    };
    
    initApp();
  }, [setIsLoading, isPersistenceAvailable, checkRecoverableSession]);
  
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
  
  // Session recovery handlers
  const handleRecoverSession = async () => {
    try {
      const sessionData = await loadSessionForRecovery();
      if (sessionData) {
        // Restore session state
        setTimeSet(true); // If we have session data, time was set
        setTotalDuration(sessionData.totalDuration);
        // Note: Full activity state and timeline restoration would need to be implemented
        // in the activity hooks to properly restore the complete session state
        console.log('Session recovered with duration:', sessionData.totalDuration);
      }
      setShowRecoveryAlert(false);
    } catch (error) {
      console.error('Failed to recover session:', error);
      // Handle recovery error - maybe show a toast or alert
    }
  };
  
  const handleStartFresh = async () => {
    await clearSession();
    setShowRecoveryAlert(false);
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
      <main className="container-fluid d-flex flex-column overflow-x-hidden overflow-y-auto" style={{ height: 'calc(100vh - var(--navbar-height))' }}>
        {/* Session Recovery Alert */}
        {showRecoveryAlert && recoveryInfo && (
          <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-md-6">
                  <SessionRecoveryAlert
                    recoveryInfo={recoveryInfo}
                    onRecover={handleRecoverSession}
                    onStartFresh={handleStartFresh}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        
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
