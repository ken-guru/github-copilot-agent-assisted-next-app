import { useEffect, useState } from 'react';

type ServiceWorkerStatus = 
  | 'pending'
  | 'registering'
  | 'registered'
  | 'error'
  | 'unsupported';

export function useServiceWorker() {
  const [status, setStatus] = useState<ServiceWorkerStatus>('pending');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // Check if service workers are supported
    if (!('serviceWorker' in navigator)) {
      console.log('Service workers are not supported by this browser');
      setStatus('unsupported');
      return;
    }

    const registerServiceWorker = async () => {
      try {
        setStatus('registering');
        
        // Unregister any existing service workers first to ensure clean state
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const registration of registrations) {
          await registration.unregister();
        }
        
        // Register the service worker from the public directory
        const registration = await navigator.serviceWorker.register('/service-worker.js');
        console.log('Service worker registration successful with scope:', registration.scope);
        
        // Setup update handling
        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          if (installingWorker == null) {
            return;
          }
          
          installingWorker.onstatechange = () => {
            if (installingWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                console.log('New content is available; please refresh.');
                // Optionally trigger a notification to the user
              } else {
                console.log('Content is cached for offline use.');
              }
            }
          };
        };
        
        setStatus('registered');
      } catch (error) {
        console.error('Service worker registration failed:', error);
        setStatus('error');
        setErrorMessage(error instanceof Error ? error.message : 'Unknown error');
      }
    };

    registerServiceWorker();

    // Cleanup function
    return () => {
      // Nothing to clean up for service worker registration
    };
  }, []);

  return {
    status,
    errorMessage,
    isRegistered: status === 'registered',
    isError: status === 'error',
    isUnsupported: status === 'unsupported',
    isPending: status === 'pending' || status === 'registering'
  };
}
