'use client';
import { useState, useEffect, useRef } from 'react';
import { LoadingProvider, useLoading } from '@contexts/loading';
import { SplashScreen } from '@/components/splash/SplashScreen';
import TimeSetup from '@/components/TimeSetup';
import ActivityManager from '@/components/ActivityManager';
import Timeline from '@/components/Timeline';
import Summary from '@/components/Summary';
import ProgressBar from '@/components/ProgressBar';
import ThemeToggle from '@/components/ThemeToggle';
import { OfflineIndicator } from '@/components/OfflineIndicator';
import ConfirmationDialog, { ConfirmationDialogRef } from '@/components/ConfirmationDialog';
import { useActivityState } from '@/hooks/useActivityState';
import { useTimerState } from '@/hooks/useTimerState';
import resetService from '@/utils/resetService';

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
  } = useTimerState({
    totalDuration,
    isCompleted: allActivitiesCompleted
  });

  // Initialize app and hide splash screen after initialization is complete
  useEffect(() => {
    const initApp = async () => {
      // Add any actual initialization logic here
      // For example: load user preferences, check auth state, preload critical data
      
      // For demo purposes, using a timeout to simulate loading
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
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
    });
    
    // Clean up on component unmount
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
    <div className="app-root">
      <SplashScreen minimumDisplayTime={500} />
      
      {/* Skip navigation link for accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      
      {/* Confirmation Dialog */}
      <ConfirmationDialog ref={resetDialogRef}
        message={dialogActions.message}
        confirmText="Reset"
        cancelText="Cancel"
        onConfirm={dialogActions.onConfirm}
        onCancel={dialogActions.onCancel}
      />
      
      <div className="app-wrapper">
        {/* Application Header - Persistent across all states */}
        <header className="app-header">
          <div className="header-content">
            <h1 className="app-title">Mr. Timely</h1>
            <div></div> {/* Spacer for grid layout */}
            <div className="header-controls">
              <ThemeToggle />
              {appState !== 'setup' && (
                <button onClick={handleReset}>
                  Reset
                </button>
              )}
            </div>
          </div>
        </header>
        
        {/* Offline Indicator - Conditional */}
        <OfflineIndicator />
        
        {/* Main content area with id for skip link */}
        <main id="main-content">
          {/* Setup State Layout */}
          {appState === 'setup' && (
            <div className="setup-layout">
              <div className="setup-container">
                <div className="setup-content">
                  <TimeSetup onTimeSet={handleTimeSet} />
                </div>
              </div>
            </div>
          )}
          
          {/* Activity State Layout */}
          {appState === 'activity' && (
            <div className="activity-layout">
              {/* Progress bar area - conditional visibility */}
              <div className="progress-area" data-testid="progress-container">
                <ProgressBar entries={processedEntries}
                  totalDuration={totalDuration}
                  elapsedTime={elapsedTime}
                  timerActive={timerActive}
                />
              </div>
              
              {/* Main activity content area */}
              <div className="activity-content">
                <div className="activity-manager-area">
                  <ActivityManager onActivitySelect={handleActivitySelect} 
                    onActivityRemove={handleActivityRemoval}
                    currentActivityId={currentActivity?.id || null} 
                    completedActivityIds={completedActivityIds}
                    timelineEntries={processedEntries}
                    isTimeUp={isTimeUp}
                    elapsedTime={elapsedTime}
                  />
                </div>
                <div className="timeline-area">
                  <Timeline entries={processedEntries}
                    totalDuration={totalDuration} 
                    elapsedTime={elapsedTime}
                    allActivitiesCompleted={allActivitiesCompleted}
                    timerActive={timerActive}
                    isTimeUp={isTimeUp}
                  />
                </div>
              </div>
            </div>
          )}
          
          {/* Completed State Layout */}
          {appState === 'completed' && (
            <div className="completed-layout">
              <div className="completed-container">
                <div className="completed-content">
                  <Summary entries={processedEntries}
                    totalDuration={totalDuration} 
                    elapsedTime={elapsedTime}
                    allActivitiesCompleted={allActivitiesCompleted}
                  />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// Main Home component that provides the LoadingContext
export default function Home() {
  return (
    <LoadingProvider initialLoadingState={true}>
      <AppContent />
    </LoadingProvider>
  );
}
