'use client';
import { useEffect } from 'react';
import { ThemeProvider } from '@contexts/theme';
import ServiceWorkerUpdater from '@components/ui/ServiceWorkerUpdater';

// Add TypeScript interface for the global window object
declare global {
  interface Window {
    Cypress?: unknown;
  }
}

interface LayoutClientProps {
  children: React.ReactNode;
}

export function LayoutClient({ children }: LayoutClientProps) {
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
                // New content is available, dispatch update event for ServiceWorkerUpdater
                window.dispatchEvent(new CustomEvent('serviceWorkerUpdateAvailable', {
                  detail: { message: 'A new version is available. Please refresh to update.' }
                }));
              }
            });
          }
        });
      });
    }

    // Listen for custom update events (for testing) - no longer needed since ServiceWorkerUpdater handles this
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
            // For testing purposes, emit a custom event instead of actually reloading
            if (typeof window !== 'undefined' && window.Cypress) {
              window.dispatchEvent(new CustomEvent('appReloadTriggered'));
            } else {
              window.location.reload();
            }
          });
        }
      });
    } else if (typeof window !== 'undefined' && window.Cypress) {
      // For testing when service worker is not available
      window.dispatchEvent(new CustomEvent('appReloadTriggered'));
    }
  };

  return (
    <ThemeProvider>
      {/* Service worker update notifications - always render the component */}
      <ServiceWorkerUpdater 
        onUpdate={handleUpdate} 
      />
      
      {children}
    </ThemeProvider>
  );
}