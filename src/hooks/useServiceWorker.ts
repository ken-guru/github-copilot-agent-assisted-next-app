import { useEffect, useState } from 'react';

// Update check interval (30 minutes)
const UPDATE_CHECK_INTERVAL = 30 * 60 * 1000;

type ServiceWorkerStatus = 
  | 'pending'
  | 'registering'
  | 'registered'
  | 'error'
  | 'unsupported';

export function useServiceWorker() {
  const [status, setStatus] = useState<ServiceWorkerStatus>('pending');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  // Function to manually update cache
  const updateCache = async () => {
    if (registration?.active) {
      registration.active.postMessage({ type: 'UPDATE_CACHE' });
    }
  };

  // Function to clear old caches
  const clearOldCaches = async () => {
    if (registration?.active) {
      registration.active.postMessage({ type: 'CLEAR_OLD_CACHES' });
    }
  };

  useEffect(() => {
    // Check if service workers are supported
    if (!('serviceWorker' in navigator)) {
      console.log('Service workers are not supported by this browser');
      setStatus('unsupported');
      return;
    }

    // Declare interval in useEffect scope so cleanup can access it
    let updateInterval: NodeJS.Timeout | null = null;

    const registerServiceWorker = async () => {
      try {
        setStatus('registering');
        
        // Check if service worker is already registered
        const existingRegistration = await navigator.serviceWorker.getRegistration();
        
        const swUrl = '/service-worker.js';
        let registration: ServiceWorkerRegistration;
        
        if (existingRegistration) {
          // Update existing registration instead of unregistering
          console.log('Updating existing service worker registration');
          await existingRegistration.update();
          registration = existingRegistration;
        } else {
          // Register new service worker
          console.log('Registering new service worker');
          registration = await navigator.serviceWorker.register(swUrl);
        }
        
        console.log('Service Worker registered with scope:', registration.scope);
        setRegistration(registration);
        
        // Handle service worker updates without forcing page reload
        if (registration.waiting) {
          console.log('New service worker is waiting, will activate on next visit');
        }
        
        if (registration.installing) {
          registration.installing.addEventListener('statechange', (event) => {
            const worker = event.target as ServiceWorker;
            if (worker.state === 'installed') {
              console.log('Service worker installed and ready');
            }
          });
        }
        
        setStatus('registered');

        // Listen for service worker messages
        navigator.serviceWorker.addEventListener('message', (event) => {
          if (event.data.type === 'CACHE_UPDATED') {
            console.log('Service worker cache updated:', event.data.message);
          }
        });

        // Check for updates periodically but don't be too aggressive  
        updateInterval = setInterval(async () => {
          try {
            await registration.update();
            console.log('Service worker checked for updates');
          } catch (error) {
            console.error('Error checking for service worker updates:', error);
          }
        }, UPDATE_CHECK_INTERVAL); // Check every 30 minutes

      } catch (error) {
        console.error('Error during service worker registration:', error);
        setErrorMessage(error instanceof Error ? error.message : 'Unknown error');
        setStatus('error');
      }
    };

    // Register when the window loads to avoid competing for resources
    window.addEventListener('load', registerServiceWorker);

    // Cleanup function - now properly clears the interval
    return () => {
      window.removeEventListener('load', registerServiceWorker);
      if (updateInterval) {
        clearInterval(updateInterval);
      }
    };
  }, []);

  return { 
    status, 
    errorMessage, 
    updateCache, 
    clearOldCaches 
  };
}
