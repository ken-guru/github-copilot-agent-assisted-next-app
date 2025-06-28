import React, { useEffect } from 'react';
import { Toast } from 'react-bootstrap';

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
    <Toast
      show={true}
      className="toast show position-fixed bottom-0 end-0 m-3 bg-success text-white"
      style={{ maxWidth: '350px', zIndex: 1080 }}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      data-testid="sw-update-notification"
    >
      <Toast.Header className="toast-header bg-success text-white px-3 py-2" closeButton={false}>
        <div className="d-flex align-items-center">
          <i className="bi bi-arrow-clockwise me-2" data-testid="sw-update-icon"></i>
          <strong className="h6 mb-0 fw-bold" data-testid="sw-update-title">Update Available</strong>
        </div>
      </Toast.Header>
      <Toast.Body className="toast-body px-3 pb-3">
        <p className="mb-0 small" data-testid="sw-update-message">
          A new version of this application is available.
        </p>
        <div className="d-flex gap-2 mt-2" data-testid="sw-button-container">
          <button 
            onClick={onUpdate}
            className="btn btn-light btn-sm me-2"
            type="button"
            data-testid="sw-update-button"
          >
            Update Now
          </button>
          <button 
            onClick={onDismiss}
            className="btn btn-outline-light btn-sm"
            type="button"
            data-testid="sw-dismiss-button"
          >
            Later
          </button>
        </div>
      </Toast.Body>
    </Toast>
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
