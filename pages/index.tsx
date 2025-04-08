// Import necessary components and utilities
import { useState, useEffect } from 'react';
import AppRouterHome from '../src/app/page';
import { Geist, Geist_Mono } from "next/font/google";
import { UpdateNotification } from "@/components/UpdateNotification";
import { setUpdateHandler } from "../src/utils/serviceWorkerRegistration";
import Head from 'next/head';

// Import globals.css
import "../src/app/globals.css";

// Set up fonts (matching the App Router layout)
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * Enhanced service worker registration with special handling for Next.js hybrid routing
 * This implementation addresses offline functionality by:
 * 1. Using separate caches for app shell and dynamic content
 * 2. Explicitly communicating with the service worker about critical assets
 * 3. Handling service worker lifecycle events properly
 * 4. Ensuring the root path is cached with multiple variations for hybrid routing
 */
function registerServiceWorker() {
  if (typeof window === 'undefined') {
    return; // SSR check
  }
  if (typeof navigator === 'undefined' || !navigator || !('serviceWorker' in navigator)) {
    console.log('Service workers are not supported in this browser');
    return;
  }

  // Check if we're in development mode
  const isDevelopment = process.env.NODE_ENV === 'development' || 
                       window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1';
  
  try {
    // Helper function to extract critical paths from the current page
    function extractCriticalPaths() {
      const paths = new Set(['/']);
      
      // Extract all script src attributes
      document.querySelectorAll('script[src]').forEach(script => {
        const src = script.getAttribute('src');
        if (src && (src.startsWith('/') || src.startsWith(window.location.origin))) {
          paths.add(src.startsWith('/') ? src : new URL(src).pathname);
        }
      });
      
      // Extract all stylesheet href attributes
      document.querySelectorAll('link[rel="stylesheet"][href]').forEach(link => {
        const href = link.getAttribute('href');
        if (href && (href.startsWith('/') || href.startsWith(window.location.origin))) {
          paths.add(href.startsWith('/') ? href : new URL(href).pathname);
        }
      });
      
      // Check for image sources
      document.querySelectorAll('img[src]').forEach(img => {
        const src = img.getAttribute('src');
        if (src && (src.startsWith('/') || src.startsWith(window.location.origin))) {
          paths.add(src.startsWith('/') ? src : new URL(src).pathname);
        }
      });
      
      return Array.from(paths);
    }
    
    // Cache critical assets after service worker is activated
    function cacheCurrentPageAssets(registration) {
      const criticalPaths = extractCriticalPaths();
      console.log('Critical paths for current page:', criticalPaths);
      
      // Send message to service worker to cache these paths
      if (registration.active) {
        registration.active.postMessage({
          type: 'CACHE_URLS',
          urls: criticalPaths
        });
      }
    }
    
    // Handle service worker messages
    function setupMessageHandlers() {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data.type === 'SERVICE_WORKER_ACTIVATED') {
          console.log('Received service worker activation message:', event.data.message);
          
          // Get the current registration and cache assets now that it's active
          navigator.serviceWorker.ready.then(registration => {
            cacheCurrentPageAssets(registration);
          });
        }
      });
    }
    
    // Setup message handlers before registration
    setupMessageHandlers();
    
    // Unregister any existing service worker first to ensure clean registration
    navigator.serviceWorker.getRegistration().then((registration) => {
      if (registration) {
        console.log('Unregistering existing service worker');
        registration.unregister().then(() => {
          console.log('Service worker unregistered successfully');
          performRegistration();
        });
      } else {
        performRegistration();
      }
    });

    function performRegistration() {
      // Register service worker with explicit path
      navigator.serviceWorker.register('/service-worker.js', {
        // Ensure consistent scope
        scope: '/'
      })
        .then(registration => {
          console.log('Service worker registered successfully with scope:', registration.scope);
          
          // If service worker is already active, cache current page assets
          if (registration.active) {
            cacheCurrentPageAssets(registration);
          }
          
          // Record current dynamic assets for offline use
          captureRuntimeAssets();
          
          // Listen for new service worker installation
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              console.log('New service worker state:', newWorker.state);
              
              newWorker.addEventListener('statechange', () => {
                console.log('Service worker state changed to:', newWorker.state);
                
                // When the service worker is installed
                if (newWorker.state === 'installed') {
                  if (navigator.serviceWorker.controller) {
                    // New content is available
                    const message = 'A new version is available. Please refresh to update.';
                    console.log(message);
                    
                    // Dispatch event for update notification
                    if (window.dispatchEvent) {
                      window.dispatchEvent(new CustomEvent('serviceWorkerUpdateAvailable', { 
                        detail: { message } 
                      }));
                    }
                    
                    // Tell the service worker to skip waiting
                    newWorker.postMessage({ type: 'SKIP_WAITING' });
                  } else {
                    // First-time install
                    console.log('Service worker installed for the first time. Content is cached for offline use.');
                    // Force the service worker to activate and take control
                    newWorker.postMessage({ type: 'SKIP_WAITING' });
                  }
                }
                
                // When the service worker is activated
                if (newWorker.state === 'activated') {
                  console.log('Service worker activated and in control');
                  // Re-capture runtime assets to ensure they're cached
                  captureRuntimeAssets();
                  // Cache critical assets for the current page
                  cacheCurrentPageAssets(registration);
                }
              });
            }
          });
        })
        .catch(error => {
          console.error('Service worker registration failed:', error);
        });
    }
    
    /**
     * Captures runtime-generated Next.js assets for offline use
     * This function scans the DOM for critical CSS and JS assets
     * and ensures they are fetched and cached by the service worker
     */
    function captureRuntimeAssets() {
      // Wait for the page to be fully loaded
      if (document.readyState === 'complete' || document.readyState === 'interactive') {
        performCapture();
      } else {
        window.addEventListener('DOMContentLoaded', performCapture);
      }
      
      function performCapture() {
        console.log('Capturing runtime assets for offline use');
        
        // Find all script tags and gather their sources
        const scriptSources = Array.from(document.querySelectorAll('script[src]'))
          .map(script => script.getAttribute('src'))
          .filter(Boolean);
          
        // Find all link tags with rel=stylesheet and gather their href values
        const styleSources = Array.from(document.querySelectorAll('link[rel="stylesheet"][href]'))
          .map(link => link.getAttribute('href'))
          .filter(Boolean);
          
        // Combine all sources
        const allSources = [...scriptSources, ...styleSources];
        
        // Prefetch each resource to ensure it's cached by the service worker
        allSources.forEach(source => {
          // Only prefetch same-origin resources
          if (source && (source.startsWith('/') || source.startsWith(window.location.origin))) {
            console.log('Prefetching for offline use:', source);
            fetch(source).catch(err => console.log(`Prefetch failed for ${source}:`, err));
          }
        });
        
        // Also capture dynamically loaded Next.js chunks (look for patterns in the DOM)
        const dynamicChunks = [];
        const nextElements = document.querySelectorAll('[id^="_next"]');
        nextElements.forEach(el => {
          // Process element to find potential asset references
          const elHtml = el.outerHTML;
          const matches = elHtml.match(/\/_next\/static\/[^"']+/g);
          if (matches) {
            dynamicChunks.push(...matches);
          }
        });
        
        // Deduplicate and prefetch dynamic chunks
        [...new Set(dynamicChunks)].forEach(chunk => {
          console.log('Prefetching dynamic chunk:', chunk);
          fetch(chunk).catch(err => console.log(`Dynamic chunk prefetch failed for ${chunk}:`, err));
        });
        
        // Special handling for hybrid routing - ensure the root path is cached
        fetch('/').catch(err => console.log('Failed to cache root path:', err));
      }
    }
  } catch (error) {
    console.error('Service worker registration error:', error);
  }
}

export default function PageRouterIndex() {
  const [updateMessage, setUpdateMessage] = useState<string | null>(null);

  // Register service worker for offline functionality
  useEffect(() => {
    // Set up update handler before registering service worker
    setUpdateHandler((message) => {
      setUpdateMessage(message);
    });

    // Handle custom update event
    const handleUpdateAvailable = (event: CustomEvent) => {
      if (event.detail?.message) {
        setUpdateMessage(event.detail.message);
      }
    };

    // Add event listener for custom update event
    window.addEventListener('serviceWorkerUpdateAvailable', handleUpdateAvailable as EventListener);

    // Register service worker with direct path access
    registerServiceWorker();

    // Clean up handler on unmount
    return () => {
      setUpdateHandler(null);
      window.removeEventListener('serviceWorkerUpdateAvailable', handleUpdateAvailable as EventListener);
    };
  }, []);

  return (
    <>
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
      </Head>
      <div className={`${geistSans.variable} ${geistMono.variable}`}>
        {updateMessage && (
          <UpdateNotification
            message={updateMessage}
            onDismiss={() => setUpdateMessage(null)}
          />
        )}
        <main>
          <AppRouterHome />
        </main>
      </div>
    </>
  );
}