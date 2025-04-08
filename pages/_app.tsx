import React, { useEffect } from 'react';
import type { AppProps } from 'next/app';
import { LoadingProvider, useLoading } from '../contexts/LoadingContext';
import { SplashScreen } from '../components/splash/SplashScreen';
import '../styles/globals.css';
import '../src/app/globals.css'; // Import the App Router's CSS to get button/input styling

// AppContent separated to use hooks inside
const AppContent = ({ Component, pageProps }: AppProps) => {
  const { setIsLoading } = useLoading();
  
  useEffect(() => {
    // Simulate application initialization
    const initApp = async () => {
      // Add any actual initialization logic here
      // For example: load user preferences, check auth state, preload critical data
      
      // For demo purposes, using a timeout to simulate loading
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    };
    
    initApp();
  }, [setIsLoading]);
  
  return (
    <>
      <SplashScreen minimumDisplayTime={2000} />
      <Component {...pageProps} />
    </>
  );
};

// Main App component with providers
export default function App(appProps: AppProps) {
  return (
    <LoadingProvider>
      <AppContent {...appProps} />
    </LoadingProvider>
  );
}
