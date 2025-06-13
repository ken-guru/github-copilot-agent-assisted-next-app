import React, { useEffect } from 'react';

/**
 * Props for the ServiceWorkerUpdater component
 */
interface ServiceWorkerUpdaterProps {
  /**
   * Callback function triggered when the user clicks the update button
   * This should handle the service worker update process
   */
  onUpdate: () => void;
  
  /**
   * Callback function triggered when the user dismisses the update notification
   * This should handle hiding the notification or setting a delay for the reminder
   */
  onDismiss: () => void;
}

/**
 * ServiceWorkerUpdater Component
 * 
 * Displays a notification when a service worker update is available
 * with options to update or dismiss.
 */
const ServiceWorkerUpdater: React.FC<ServiceWorkerUpdaterProps> = ({
  onUpdate,
  onDismiss
}) => {
  // Debug logging function
  const debugLog = (message: string) => {
    console.log(`[ServiceWorkerUpdater] ${message}`);
  };

  // Expose functions to window for testing with Cypress
  useEffect(() => {
    // Create a namespace for our component
    if (typeof window !== 'undefined') {
      window.ServiceWorkerUpdaterAPI = {
        setUpdateAvailable: (value: boolean) => {
          debugLog(`Update availability set to ${value} via test API`);
          if (value) {
            onUpdate();
          } else {
            onDismiss();
          }
        }
      };
    }

    // Clean up on unmount
    return () => {
      if (typeof window !== 'undefined' && window.ServiceWorkerUpdaterAPI) {
        delete window.ServiceWorkerUpdaterAPI;
      }
    };
  }, [onUpdate, onDismiss]);

  return (
    <div className={styles.updateNotification} role="alert" data-testid="sw-update-notification">
      <div className={styles.updateContent}>
        <div className={styles.updateMessage}>
          <strong>Update Available</strong>
          <p>A new version of this application is available.</p>
        </div>
        <div className={styles.updateActions}>
          <button 
            onClick={onUpdate}
            className={styles.updateButton}
            data-testid="sw-update-button"
          >
            Update Now
          </button>
          <button 
            onClick={onDismiss}
            className={styles.dismissButton}
            data-testid="sw-dismiss-button"
          >
            Later
          </button>
        </div>
      </div>
    </div>
  );
};

// Add TypeScript interface for the global window object
declare global {
  interface Window {
    ServiceWorkerUpdaterAPI?: {
      setUpdateAvailable: (value: boolean) => void;
    };
  }
}

export default ServiceWorkerUpdater;
