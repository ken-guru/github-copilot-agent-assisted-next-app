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

        // Register new service worker
        const swUrl = '/service-worker.js';
        const registration = await navigator.serviceWorker.register(swUrl);
        
        console.log('Service Worker registered with scope:', registration.scope);
        
        // Force update if needed
        if (registration.installing) {
          registration.installing.addEventListener('statechange', (event) => {
            if ((event.target as ServiceWorker).state === 'activated') {
              // Force reload once activated to ensure latest version is used
              window.location.reload();
            }
          });
        }
        
        setStatus('registered');

        // Check for updates every hour
        setInterval(async () => {
          try {
            await registration.update();
            console.log('Service worker checked for updates');
          } catch (error) {
            console.error('Error checking for service worker updates:', error);
          }
        }, 60 * 60 * 1000);

      } catch (error) {
        console.error('Error during service worker registration:', error);
        setErrorMessage(error instanceof Error ? error.message : 'Unknown error');
        setStatus('error');
      }
    };

    // Register when the window loads to avoid competing for resources
    window.addEventListener('load', registerServiceWorker);

    // Clean up
    return () => {
      window.removeEventListener('load', registerServiceWorker);
    };
  }, []);

  return { status, errorMessage };
}
