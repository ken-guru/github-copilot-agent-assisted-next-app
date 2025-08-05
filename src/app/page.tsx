'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingProvider, useLoading } from '@/contexts/loading';
import TimeSetup from '@/components/TimeSetup';
import ConfirmationDialog, { ConfirmationDialogRef } from '@/components/ConfirmationDialog';
import resetService from '@/utils/resetService';

// Main application content with loading context
function AppContent() {
  const { setIsLoading } = useLoading();
  const router = useRouter();
  const resetDialogRef = useRef<ConfirmationDialogRef>(null);

  // Initialize app and hide loading screen after initialization is complete
  useEffect(() => {
    const initApp = async () => {
      // Add any actual initialization logic here
      // For example: load user preferences, check auth state, preload critical data
      
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
  
  const handleTimeSet = (durationInSeconds: number) => {
    // Navigate to timer page with duration as query parameter
    router.push(`/timer?t=${durationInSeconds}`);
  };
  
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
          <div className="d-flex justify-content-center align-items-start flex-grow-1 p-4">
            <TimeSetup onTimeSet={handleTimeSet} />
          </div>
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
