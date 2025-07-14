'use client';
import { useState, useEffect } from 'react';
import { ThemeProvider } from '@contexts/theme';
import ServiceWorkerUpdater from '@components/ui/ServiceWorkerUpdater'; // This will need to be updated when the component is moved

interface LayoutClientProps {
  children: React.ReactNode;
}

export function LayoutClient({ children }: LayoutClientProps) {
  const [updateAvailable, setUpdateAvailable] = useState<boolean>(false);

  // Handle service worker updates
  useEffect(() => {
    // Expose ServiceWorkerUpdaterAPI for Cypress tests immediately
    if (typeof window !== 'undefined') {
      window.ServiceWorkerUpdaterAPI = {
        setUpdateAvailable: (value: boolean) => {
          console.log('[ServiceWorkerUpdaterAPI] setUpdateAvailable called with:', value);
          setUpdateAvailable(value);
        }
      };
      console.log('[ServiceWorkerUpdaterAPI] API exposed on window');

      // Listen for custom Cypress event fallback
      const handleCypressUpdate = (event: CustomEvent) => {
        console.log('[ServiceWorkerUpdaterAPI] Custom event received:', event.type, event.detail);
        if (event.detail && event.detail.updateAvailable !== undefined) {
          setUpdateAvailable(event.detail.updateAvailable);
        } else {
          setUpdateAvailable(true);
        }
      };
      window.addEventListener('cypressServiceWorkerUpdate', handleCypressUpdate as EventListener);
      window.addEventListener('serviceWorkerUpdateAvailable', handleCypressUpdate as EventListener);

      // Clean up listeners on unmount
      return () => {
        window.removeEventListener('cypressServiceWorkerUpdate', handleCypressUpdate as EventListener);
        window.removeEventListener('serviceWorkerUpdateAvailable', handleCypressUpdate as EventListener);
      };
    }

    // Service worker update detection
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
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
      {/* Service worker update notifications - always mounted, visibility controlled by prop */}
      <ServiceWorkerUpdater 
        onUpdate={handleUpdate} 
        onDismiss={() => setUpdateAvailable(false)}
        show={updateAvailable}
      />
      {/* Main content */}
      <main className="app-container">
        {children}
      </main>
      {/* Additional global components here */}
      {/* Global scripts for performance monitoring, etc. */}
      <script 
        dangerouslySetInnerHTML={{ 
          __html: `
            // Performance monitoring
            if (window.performance) {
              window.addEventListener('load', () => {
                setTimeout(() => {
                  const timing = window.performance.timing;
                  const loadTime = timing.loadEventEnd - timing.navigationStart;
                  console.log('Page load time:', loadTime, 'ms');
                }, 0);
              });
            }
          `
        }}
      />
    </ThemeProvider>
  );
}
