import React, { useEffect, useState } from 'react';
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
   * Optional - if not provided, the component will just hide the notification
   */
  onDismiss?: () => void;
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
  const [updateAvailable, setUpdateAvailable] = useState<boolean>(false);

  // Debug logging function
  const debugLog = (message: string) => {
    console.log(`[ServiceWorkerUpdater] ${message}`);
  };

  // Handle the update button click
  const handleUpdate = () => {
    debugLog('Update button clicked');
    
    // For testing purposes, emit a custom event instead of actually reloading
    if (typeof window !== 'undefined' && window.Cypress) {
      window.dispatchEvent(new CustomEvent('appReloadTriggered'));
    } else {
      // Call the parent's onUpdate handler for actual updates
      onUpdate();
    }
  };

  // Listen for service worker update events
  useEffect(() => {
    const handleServiceWorkerUpdate = () => {
      debugLog('Service worker update event received');
      setUpdateAvailable(true);
    };

    const handleCypressUpdate = (event: CustomEvent) => {
      debugLog(`Cypress test event received: updateAvailable=${event.detail.updateAvailable}`);
      setUpdateAvailable(event.detail.updateAvailable);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('serviceWorkerUpdateAvailable', handleServiceWorkerUpdate);
      window.addEventListener('cypressServiceWorkerUpdate', handleCypressUpdate as EventListener);
      
      return () => {
        window.removeEventListener('serviceWorkerUpdateAvailable', handleServiceWorkerUpdate);
        window.removeEventListener('cypressServiceWorkerUpdate', handleCypressUpdate as EventListener);
      };
    }
  }, []);

  // Expose functions to window for testing with Cypress
  useEffect(() => {
    // Only create API if it doesn't already exist (preserves Cypress setup)
    if (typeof window !== 'undefined' && !window.ServiceWorkerUpdaterAPI) {
      debugLog('Setting up ServiceWorkerUpdaterAPI');
      window.ServiceWorkerUpdaterAPI = {
        setUpdateAvailable: (value: boolean) => {
          debugLog(`Update availability set to ${value} via test API`);
          setUpdateAvailable(value);
          
          if (value) {
            // Also dispatch the event for consistency
            window.dispatchEvent(new CustomEvent('serviceWorkerUpdateAvailable', {
              detail: { message: 'A new version is available. Please refresh to update.' }
            }));
          }
        }
      };
    } else if (typeof window !== 'undefined' && window.ServiceWorkerUpdaterAPI) {
      debugLog('ServiceWorkerUpdaterAPI already exists (likely from Cypress), using existing one');
    }

    // Clean up only if we created the API
    return () => {
      if (typeof window !== 'undefined' && window.ServiceWorkerUpdaterAPI) {
        debugLog('Component cleanup - ServiceWorkerUpdaterAPI might be cleaned up by Cypress');
        // Don't delete the API in cleanup as it might be managed by Cypress
      }
    };
  }, []);

  // Don't render if update is not available
  if (!updateAvailable) {
    return null;
  }

  return (
    <Toast
      show={true}
      className="toast show position-fixed bottom-0 end-0 m-3 bg-success text-white"
      style={{ maxWidth: '350px', zIndex: 1080 }}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      data-testid="update-notification"
    >
      <Toast.Header className="toast-header bg-success text-white px-3 py-2" closeButton={false}>
        <div className="d-flex align-items-center">
          <i className="bi bi-arrow-clockwise me-2" data-testid="update-icon"></i>
          <strong className="h6 mb-0 fw-bold" data-testid="update-title">Update available</strong>
        </div>
      </Toast.Header>
      <Toast.Body className="toast-body px-3 pb-3">
        <p className="mb-0 small" data-testid="update-message">
          A new version of this application is available.
        </p>
        <div className="d-flex gap-2 mt-2" data-testid="button-container">
          <button 
            onClick={handleUpdate}
            className="btn btn-light btn-sm me-2"
            type="button"
            data-testid="update-button"
          >
            Update Now
          </button>
          <button 
            onClick={() => {
              setUpdateAvailable(false);
              onDismiss?.();
            }}
            className="btn btn-outline-light btn-sm"
            type="button"
            data-testid="dismiss-button"
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
    Cypress?: unknown;
  }
}

export default ServiceWorkerUpdater;
