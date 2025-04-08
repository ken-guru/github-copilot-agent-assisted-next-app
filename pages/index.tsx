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

// Custom service worker registration function to ensure proper path resolution
function registerServiceWorker() {
  if (typeof window === 'undefined') {
    return; // SSR check
  }
  if (typeof navigator === 'undefined' || !navigator || !('serviceWorker' in navigator)) {
    console.log('Service workers are not supported in this browser');
    return;
  }
  
  try {
    // Use explicit path to ensure proper resolution
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('Service worker registered from Pages Router');
        
        // Listen for new service worker installation
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New content is available
                const message = 'A new version is available. Please refresh to update.';
                console.log(message);
                // Use the update handler from imported module
                if (window.dispatchEvent) {
                  window.dispatchEvent(new CustomEvent('serviceWorkerUpdateAvailable', { 
                    detail: { message } 
                  }));
                }
              }
            });
          }
        });
      })
      .catch(error => {
        console.error('Service worker registration failed', error);
      });
  } catch (error) {
    console.error('Service worker registration error', error);
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