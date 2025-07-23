'use client';
import { useEffect } from 'react';
import Script from 'next/script';
import { ThemeProvider } from '@/contexts/theme';
import ServiceWorkerUpdater from '@/components/ui/ServiceWorkerUpdater';
import Navigation from '@/components/Navigation';
import { OfflineIndicator } from '@/components/OfflineIndicator';

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
      console.log('[LayoutClient] Setting up service worker update detection');
      
      // Check for existing service worker with updates
      navigator.serviceWorker.ready.then((registration) => {
        console.log('[LayoutClient] Service worker ready, setting up update listeners');
        
        // Check if there's already a waiting worker
        if (registration.waiting) {
          console.log('[LayoutClient] Found waiting service worker on load');
          window.dispatchEvent(new CustomEvent('serviceWorkerUpdateAvailable', {
            detail: { message: 'A new version is available. Please refresh to update.' }
          }));
        }
        
        // Listen for new updates
        registration.addEventListener('updatefound', () => {
          console.log('[LayoutClient] Service worker update found');
          const newWorker = registration.installing;
          
          if (newWorker) {
            const handleStateChange = () => {
              console.log('[LayoutClient] New worker state:', newWorker.state);
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('[LayoutClient] New content available, dispatching update event');
                // New content is available, dispatch update event for ServiceWorkerUpdater
                window.dispatchEvent(new CustomEvent('serviceWorkerUpdateAvailable', {
                  detail: { message: 'A new version is available. Please refresh to update.' }
                }));
                newWorker.removeEventListener('statechange', handleStateChange);
              }
            };
            
            newWorker.addEventListener('statechange', handleStateChange);
          }
        });
      }).catch(error => {
        console.error('[LayoutClient] Service worker ready failed:', error);
      });
      
      // Also listen for controller changes to detect when SW takes control
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('[LayoutClient] Service worker controller changed');
      });
    }
  }, []);
  
  // Handle updating the service worker
  const handleUpdate = () => {
    console.log('[LayoutClient] Update requested');
    
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        if (registration.waiting) {
          console.log('[LayoutClient] Sending SKIP_WAITING message to service worker');
          // Send message to waiting service worker with correct format
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          
          // Reload page when the new service worker takes over
          const handleControllerChange = () => {
            console.log('[LayoutClient] Service worker controller changed');
            navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
            
            // For testing purposes, emit a custom event instead of actually reloading
            if (typeof window !== 'undefined' && window.Cypress) {
              window.dispatchEvent(new CustomEvent('appReloadTriggered'));
            } else {
              window.location.reload();
            }
          };
          
          navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);
        } else {
          console.log('[LayoutClient] No waiting service worker found, reloading directly');
          // No waiting worker, just reload
          if (typeof window !== 'undefined' && window.Cypress) {
            window.dispatchEvent(new CustomEvent('appReloadTriggered'));
          } else {
            window.location.reload();
          }
        }
      }).catch(error => {
        console.error('[LayoutClient] Service worker ready failed:', error);
      });
    } else if (typeof window !== 'undefined' && window.Cypress) {
      // For testing when service worker is not available
      window.dispatchEvent(new CustomEvent('appReloadTriggered'));
    }
  };

  return (
    <ThemeProvider>
      {/* Bootstrap JavaScript for responsive navigation */}
      <Script 
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"
        strategy="afterInteractive"
      />
      
      {/* Service worker update notifications - always render the component */}
      <ServiceWorkerUpdater 
        onUpdate={handleUpdate} 
      />
      
      {/* Global offline indicator - visible across all app states */}
      <OfflineIndicator />
      
      {/* Main navigation */}
      <Navigation />
      
      {children}
    </ThemeProvider>
  );
}