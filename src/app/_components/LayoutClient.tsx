'use client';
import { useState, useEffect } from 'react';
import { ThemeProvider } from '@contexts/theme';
import ServiceWorkerUpdater from '@components/ui/ServiceWorkerUpdater';
import styles from './LayoutClient.module.css';

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
      <div 
        className={styles.appContainer}
        role="application"
        aria-label="Time Tracking Application"
      >
        {/* Service worker update notifications */}
        {updateAvailable && (
          <div className={styles.updateNotificationContainer}>
            <ServiceWorkerUpdater 
              onUpdate={handleUpdate} 
              onDismiss={() => setUpdateAvailable(false)}
            />
          </div>
        )}
        
        {/* Main content */}
        <main className={styles.mainContent} id="main-content">
          {children}
        </main>
        
        {/* Performance monitoring script */}
        <div className={styles.performanceScript}>
          <script dangerouslySetInnerHTML={{ 
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
        </div>
      </div>
    </ThemeProvider>
  );
}
