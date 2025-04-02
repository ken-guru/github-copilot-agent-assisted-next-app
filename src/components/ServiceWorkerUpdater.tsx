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
  
  useEffect(() => {
    // Function to handle service worker registration
    const handleServiceWorker = async () => {
      if ('serviceWorker' in navigator) {
        try {
          // Get the registration
          const registration = await navigator.serviceWorker.getRegistration();
          
          if (!registration) return;
          
          // Check if there's already a waiting service worker
          if (registration.waiting) {
            setUpdateAvailable(true);
            setWaitingServiceWorker(registration.waiting);
          }
          
          // Listen for new updates
          const handleUpdateFound = () => {
            const newWorker = registration.installing;
            
            if (!newWorker) return;
            
            // Listen for state changes on the installing worker
            newWorker.addEventListener('statechange', () => {
              // If the new service worker is installed (waiting)
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setUpdateAvailable(true);
                setWaitingServiceWorker(newWorker);
              }
            });
          };
          
          // Listen for updates
          registration.addEventListener('updatefound', handleUpdateFound);
          
          // Cleanup function
          return () => {
            registration.removeEventListener('updatefound', handleUpdateFound);
          };
        } catch (error) {
          console.error('Error checking for service worker updates:', error);
        }
      }
    };
    
    handleServiceWorker();
  }, []);
  
  // Handle update button click
  const handleUpdate = () => {
    if (waitingServiceWorker) {
      // Instruct the waiting service worker to take control
      waitingServiceWorker.postMessage({ type: 'SKIP_WAITING' });
      
      // Once the service worker takes control, refresh the page
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });
    } else {
      // If for some reason the waiting worker isn't available, just reload
      window.location.reload();
    }
  };
  
  // Handle dismiss button click
  const handleDismiss = () => {
    setUpdateAvailable(false);
  };
  
  // Don't render anything if no update is available
  if (!updateAvailable) return null;
  
  return (
    <div 
      data-testid="update-notification" 
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
        <button 
          onClick={handleUpdate}
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
        <button 
          onClick={handleDismiss}
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

export default ServiceWorkerUpdater;