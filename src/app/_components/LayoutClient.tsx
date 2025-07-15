'use client';
import { useState, useEffect } from 'react';
import { ThemeProvider } from '@/contexts/theme';
import ServiceWorkerUpdater from '@/components/ui/ServiceWorkerUpdater'; // This will need to be updated when the component is moved

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
      {/* Service worker update notifications */}
      {updateAvailable && (
        <ServiceWorkerUpdater 
          onUpdate={handleUpdate} 
          onDismiss={() => setUpdateAvailable(false)}
        />
      )}
      
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
