'use client';
import { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LoadingProvider, useLoading } from '@/contexts/loading';
import Summary from '@/components/Summary';
import ConfirmationDialog, { ConfirmationDialogRef } from '@/components/ConfirmationDialog';
import { useActivityState } from '@/hooks/useActivityState';
import { useTimerState } from '@/hooks/useTimerState';
import resetService from '@/utils/resetService';

// Summary page content with loading context
function SummaryPageContent() {
  const { setIsLoading } = useLoading();
  const router = useRouter();
  const searchParams = useSearchParams();
  const resetDialogRef = useRef<ConfirmationDialogRef>(null);
  
  // Parse time parameter from URL (defaults to 60 seconds if not provided)
  const getTimeFromParams = useCallback(() => {
    const timeParam = searchParams.get('t');
    if (!timeParam) return 60; // Default to 1 minute
    
    const parsedTime = parseInt(timeParam, 10);
    if (isNaN(parsedTime) || parsedTime <= 0) {
      return 60; // Default to 1 minute for invalid/negative values
    }
    
    return parsedTime;
  }, [searchParams]);

  const [totalDuration] = useState(getTimeFromParams);
  
  const {
    timelineEntries,
    allActivitiesCompleted,
    resetActivities,
  } = useActivityState();
  
  const {
    elapsedTime,
    isTimeUp,
    resetTimer,
  } = useTimerState({
    totalDuration,
    isCompleted: allActivitiesCompleted
  });

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
  
  const handleReset = async () => {
    await resetService.reset();
  };

  const handleReturnToSetup = () => {
    router.push('/');
  };
  
  const processedEntries = timelineEntries.map(entry => ({
    ...entry,
    endTime: entry.endTime === undefined ? null : entry.endTime
  }));

  // Check if this is an empty state (no timeline entries with activities)
  const isEmpty = timelineEntries.length === 0 || !timelineEntries.some(entry => entry.activityId);
  
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
          {isEmpty ? (
            // Empty state for direct access to summary
            <div className="d-flex justify-content-center align-items-center flex-grow-1 p-4">
              <div className="text-center">
                <h2 className="mb-3">No Activities Completed</h2>
                <p className="mb-4">
                  You haven&apos;t completed any activities yet. Start by setting up your timer and running some activities.
                </p>
                <button 
                  className="btn btn-primary"
                  onClick={handleReturnToSetup}
                >
                  Return to Setup
                </button>
              </div>
            </div>
          ) : (
            // Normal summary view with data
            <div className="d-flex justify-content-center flex-grow-1 p-4">
              <Summary 
                entries={processedEntries}
                totalDuration={totalDuration} 
                elapsedTime={elapsedTime}
                allActivitiesCompleted={allActivitiesCompleted}
                isTimeUp={isTimeUp}
                onReset={handleReset}
              />
            </div>
          )}
        </div>
      </main>
    </>
  );
}

// Main Summary page component with LoadingProvider
export default function SummaryPage() {
  return (
    <LoadingProvider initialLoadingState={false}>
      <Suspense fallback={<div>Loading...</div>}>
        <SummaryPageContent />
      </Suspense>
    </LoadingProvider>
  );
}
