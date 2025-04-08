'use client';

import React, { useEffect } from 'react';
import AppRouterHome from '../src/app/page';
import { Geist, Geist_Mono } from 'next/font/google';
import Head from 'next/head';
import { LoadingProvider, useLoading } from '../contexts/LoadingContext';
import { SplashScreen } from '../components/splash/SplashScreen';
import '../src/app/globals.css';
import '../styles/globals.css';

// Register service worker for offline functionality
import { registerServiceWorker, setUpdateHandler } from '../src/utils/serviceWorkerRegistration';
import { UpdateNotification } from '../src/components/UpdateNotification';

// Initialize fonts for consistency with App Router
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Bridge content with hooks
function BridgeContent() {
  const { setIsLoading } = useLoading();
  const [updateMessage, setUpdateMessage] = React.useState<string | null>(null);

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

    // Register service worker
    registerServiceWorker();

    // Initialize app and hide splash screen after initialization is complete
    const initApp = async () => {
      // Add any actual initialization logic here
      // For example: load user preferences, check auth state, preload critical data
      
      // For demo purposes, using a timeout to simulate loading
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    };
    
    initApp();

    // Clean up handlers on unmount
    return () => {
      setUpdateHandler(null);
      window.removeEventListener('serviceWorkerUpdateAvailable', handleUpdateAvailable as EventListener);
    };
  }, [setIsLoading]);

  return (
    <>
      <SplashScreen minimumDisplayTime={2000} />
      {updateMessage && (
        <UpdateNotification
          message={updateMessage}
          onDismiss={() => setUpdateMessage(null)}
        />
      )}
      <AppRouterHome />
    </>
  );
}

// Main bridge component that sets up providers
export default function HomePageBridge() {
  return (
    <>
      <Head>
        <title>Mr. Timely</title>
        <meta name="description" content="Track your time and activities with Mr. Timely" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
      </Head>
      
      <div className={`${geistSans.variable} ${geistMono.variable}`}>
        <LoadingProvider initialLoadingState={true}>
          <BridgeContent />
        </LoadingProvider>
      </div>
    </>
  );
}
