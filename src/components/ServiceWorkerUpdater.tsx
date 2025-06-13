import React, { useEffect, useState } from 'react';

/**
 * ServiceWorkerUpdater Component
 * 
 * Monitors for service worker updates and provides a notification
 * when an update is available with options to update or dismiss.
 */
const ServiceWorkerUpdater: React.FC = () => {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [waitingServiceWorker, setWaitingServiceWorker] = useState<ServiceWorker | null>(null);
  
  // Debug logging function - this will appear in the Cypress test logs
  const debugLog = (message: string) => {
    console.log(`[ServiceWorkerUpdater] ${message}`);
  };

  // Expose functions to window for testing with Cypress
  useEffect(() => {
    // Create a namespace for our component
    if (typeof window !== 'undefined') {
      window.ServiceWorkerUpdaterAPI = {
        setUpdateAvailable: (value: boolean) => {
          debugLog(`Setting updateAvailable to ${value} via test API`);
          setUpdateAvailable(value);
        },
      };
    }

    // Clean up on unmount
    return () => {
      if (typeof window !== 'undefined') {
        delete window.ServiceWorkerUpdaterAPI;
      }
    };
  }, []);

  useEffect(() => {
    debugLog('Component mounted, setting up service worker listeners');
    
    // Function to handle service worker registration
    const handleServiceWorker = async () => {
      if ('serviceWorker' in navigator) {
        try {
          // Get the registration
          const registration = await navigator.serviceWorker.getRegistration();
          
          if (!registration) {
            debugLog('No service worker registration found');
            return;
          }
          
          debugLog('Service worker registration found');
          
          // Check if there's already a waiting service worker
          if (registration.waiting) {
            debugLog('Waiting service worker detected');
            setUpdateAvailable(true);
            setWaitingServiceWorker(registration.waiting);
          }
          
          // Listen for new updates
          const handleUpdateFound = () => {
            const newWorker = registration.installing;
            
            if (!newWorker) return;
            
            debugLog('New installing service worker detected');
            
            // Listen for state changes on the installing worker
            newWorker.addEventListener('statechange', () => {
              debugLog(`Service worker state changed: ${newWorker.state}`);
              
              // If the new service worker is installed (waiting)
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                debugLog('Service worker installed and waiting to activate');
                setUpdateAvailable(true);
                setWaitingServiceWorker(newWorker);
              }
            });
          };
          
          // Listen for updates
          registration.addEventListener('updatefound', handleUpdateFound);
          debugLog('Added updatefound event listener');
          
          // Cleanup function
          return () => {
            registration.removeEventListener('updatefound', handleUpdateFound);
            debugLog('Removed updatefound event listener');
          };
        } catch (error) {
          console.error('Error checking for service worker updates:', error);
        }
      }
    };
    
    handleServiceWorker();

    // Listen for custom serviceWorkerUpdateAvailable event (used in Cypress tests)
    const handleCustomUpdateEvent = (event: Event) => {
      debugLog('Received custom serviceWorkerUpdateAvailable event');
      
      // Type assertion for custom event
      const customEvent = event as CustomEvent;
      
      setUpdateAvailable(true);
      debugLog(`Update message: ${customEvent.detail?.message || 'New version available'}`);
    };

    // Add event listener for the custom event
    window.addEventListener('serviceWorkerUpdateAvailable', handleCustomUpdateEvent);
    debugLog('Added custom event listener for serviceWorkerUpdateAvailable');

    // Clean up the event listener
    return () => {
      window.removeEventListener('serviceWorkerUpdateAvailable', handleCustomUpdateEvent);
      debugLog('Removed custom event listener for serviceWorkerUpdateAvailable');
    };
  }, []);
  
  // Handle update button click
  const handleUpdate = () => {
    debugLog('Update button clicked');
    
    if (waitingServiceWorker) {
      // Instruct the waiting service worker to take control
      debugLog('Sending SKIP_WAITING message to waiting service worker');
      waitingServiceWorker.postMessage({ type: 'SKIP_WAITING' });
      
      // Once the service worker takes control, refresh the page
      const handleControllerChange = () => {
        debugLog('Service worker controller changed, reloading page');
        // Create a custom event that Cypress can detect instead of actually reloading
        window.dispatchEvent(new CustomEvent('appReloadTriggered'));
        // Only do the actual reload if not in a test environment
        if (!window.Cypress) {
          window.location.reload();
        }
      };
      
      navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);
    } else {
      // If for some reason the waiting worker isn't available, just reload
      debugLog('No waiting service worker, reloading page directly');
      // Create a custom event that Cypress can detect instead of actually reloading
      window.dispatchEvent(new CustomEvent('appReloadTriggered'));
      // Only do the actual reload if not in a test environment
      if (!window.Cypress) {
        window.location.reload();
      }
    }
  };
  
  // Handle dismiss button click
  const handleDismiss = () => {
    debugLog('Dismiss button clicked');
    setUpdateAvailable(false);
  };
  
  // Don't render anything if no update is available
  if (!updateAvailable) {
    debugLog('No update available, not rendering notification');
    return null;
  }
  
  debugLog('Rendering update notification');
  
  return (
    <div data-testid="update-notification" 
      className="update-notification"
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: '#4CAF50',
        color: 'white',
        padding: '15px',
        borderRadius: '5px',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
        zIndex: 1000
      }}
    >
      <p style={{ margin: '0 0 10px 0' }}>
        Update available! Reload to apply the latest changes.
      </p>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={handleUpdate}
          data-testid="update-button"
          style={{
            backgroundColor: '#FFFFFF',
            color: '#4CAF50',
            border: 'none',
            padding: '8px 15px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Update Now
        </button>
        <button onClick={handleDismiss}
          data-testid="dismiss-button"
          style={{
            backgroundColor: 'transparent',
            color: 'white',
            border: '1px solid white',
            padding: '8px 15px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};

// Add TypeScript interface for the global API
declare global {
  interface Window {
    Cypress?: unknown;
    ServiceWorkerUpdaterAPI?: {
      setUpdateAvailable: (value: boolean) => void;
    };
  }
}

export default ServiceWorkerUpdater;