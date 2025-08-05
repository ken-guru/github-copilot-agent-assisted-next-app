'use client';
import { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { LoadingProvider, useLoading } from '@/contexts/loading';
import ActivityManager from '@/components/ActivityManager';
import Timeline from '@/components/Timeline';
import ConfirmationDialog, { ConfirmationDialogRef } from '@/components/ConfirmationDialog';
import { useActivityState } from '@/hooks/useActivityState';
import { useTimerState } from '@/hooks/useTimerState';
import resetService from '@/utils/resetService';

// Timer page content with loading context
function TimerPageContent() {
  const { setIsLoading } = useLoading();
  const searchParams = useSearchParams();
  const router = useRouter();
  const resetDialogRef = useRef<ConfirmationDialogRef>(null);
  
  // Parse time parameter from URL (defaults to 60 seconds)
  const getTimeFromParams = useCallback(() => {
    const timeParam = searchParams.get('t');
    if (!timeParam) return 60; // Default to 1 minute
    
    const parsedTime = parseInt(timeParam, 10);
    if (isNaN(parsedTime) || parsedTime <= 0) {
      return 60; // Default to 1 minute for invalid/negative values
    }
    
    return parsedTime;
  }, [searchParams]);

  const [totalDuration, setTotalDuration] = useState(getTimeFromParams);
  
  // Update total duration when URL parameter changes
  useEffect(() => {
    setTotalDuration(getTimeFromParams());
  }, [getTimeFromParams]);
  
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
    timerActive,
    startTimer,
    resetTimer,
    extendDuration: clearTimeUpState,
  } = useTimerState({
    totalDuration,
    isCompleted: allActivitiesCompleted
  });

  // Navigate to summary when all activities are completed
  useEffect(() => {
    if (allActivitiesCompleted) {
      router.push('/summary');
    }
  }, [allActivitiesCompleted, router]);

  // Initialize app and hide loading screen
  useEffect(() => {
    const initApp = async () => {
      setTimeout(() => {
        setIsLoading(false);
      }, 200);
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
  
  // Store dialog action handlers in state
  const [dialogActions, setDialogActions] = useState({
    message: 'Are you sure you want to reset the application? All progress will be lost.',
    onConfirm: () => {},
    onCancel: () => {}
  });
  
  // Register reset callbacks
  useEffect(() => {
    const unregisterCallbacks = resetService.registerResetCallback(() => {
      resetActivities();
      resetTimer();
      // Navigate back to setup after reset
      router.push('/');
    });
    
    return unregisterCallbacks;
  }, [resetActivities, resetTimer, router]);
  
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
  
  const processedEntries = timelineEntries.map(entry => ({
    ...entry,
    endTime: entry.endTime === undefined ? null : entry.endTime
  }));
  
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
          <div className="row flex-grow-1 g-3 px-3 pt-3 pb-3 overflow-x-hidden overflow-y-auto">
            <div className="col-lg-5 d-flex flex-column overflow-x-hidden overflow-y-auto">
              <ActivityManager 
                onActivitySelect={handleActivitySelect} 
                onActivityRemove={handleActivityRemoval}
                currentActivityId={currentActivity?.id || null} 
                completedActivityIds={completedActivityIds}
                timelineEntries={processedEntries}
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
        </div>
      </main>
    </>
  );
}

// Main Timer page component with LoadingProvider
export default function TimerPage() {
  return (
    <LoadingProvider initialLoadingState={false}>
      <Suspense fallback={<div>Loading...</div>}>
        <TimerPageContent />
      </Suspense>
    </LoadingProvider>
  );
}
