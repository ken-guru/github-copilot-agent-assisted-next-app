'use client';
import { useState, useEffect } from 'react';
import { ThemeProvider } from '@contexts/theme';
import ServiceWorkerUpdater from './ServiceWorkerUpdater';

interface LayoutClientProps {
  children: React.ReactNode;
}

export function LayoutClient({ children }: LayoutClientProps) {
  const [updateAvailable, setUpdateAvailable] = useState<boolean>(false);
  
  // Handle service worker updates
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      // Listen for service worker updates
      navigator.serviceWorker.ready.then((registration) => {
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New content is available, show update prompt
                setUpdateAvailable(true);
              }
            });
          }
        });
      });
    }
  }, []);
  
  // Handle updating the service worker
  const handleUpdate = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        if (registration.waiting) {
          // Send message to waiting service worker
          registration.waiting.postMessage('skipWaiting');
          
          // Reload page when the new service worker takes over
          navigator.serviceWorker.addEventListener('controllerchange', () => {
            window.location.reload();
          });
        }
      });
    }
  };

  return (
    <ThemeProvider>
      {/* Include the ServiceWorkerUpdater component */}
      <ServiceWorkerUpdater />
      
      {/* Legacy update notification - can eventually be removed once tests are updated */}
      {updateAvailable && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          right: '20px',
          backgroundColor: '#333',
          color: 'white',
          padding: '10px',
          borderRadius: '5px',
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>A new version is available</span>
          <button onClick={handleUpdate}
            style={{
              backgroundColor: '#007bff',
              border: 'none',
              color: 'white',
              padding: '5px 10px',
              borderRadius: '3px',
              cursor: 'pointer'
            }}
          >
            Update
          </button>
        </div>
      )}
      {children}
    </ThemeProvider>
  );
}