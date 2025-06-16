import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useLoading } from '@contexts/loading';
import styles from './SplashScreen.module.css';

interface SplashScreenProps {
  minimumDisplayTime?: number;
}

// Helper function to detect dark mode based on system preference and localStorage
// Safe to use on both client and server
const isDarkTheme = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  try {
    // First check for localStorage theme setting (highest priority)
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    
    // Then check for system preference
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches;
  } catch {
    // Fallback in case of errors (e.g., localStorage blocked)
    return false;
  }
};

// Create a script that will run as soon as possible during page load
// This needs to be in a string so it executes before React hydration
const earlyThemeScript = `
  (function() {
    try {
      var isDark = false;
      
      // Check localStorage first
      var savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        isDark = savedTheme === 'dark';
      } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // Then try system preference
        isDark = true;
      }
      
      // Apply theme class immediately
      if (isDark) {
        document.documentElement.classList.add('dark-mode');
        document.documentElement.classList.remove('light-mode');
      } else {
        document.documentElement.classList.add('light-mode');
        document.documentElement.classList.remove('dark-mode');
      }
    } catch(e) {
      console.error('Error in early theme detection:', e);
    }
  })();
`;

export default function SplashScreen({ 
  minimumDisplayTime = 2000 
}: SplashScreenProps) {
  const { isLoading, setIsLoading } = useLoading();
  const [shouldRender, setShouldRender] = useState(true);
  const [scriptIncluded, setScriptIncluded] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  
  // Load timestamp when component mounts
  const [startTime] = useState<number>(Date.now());
  
  // Loading complete effect
  useEffect(() => {
    if (!isLoading && shouldRender) {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minimumDisplayTime - elapsedTime);
      
      // Start fade out animation after minimum display time
      setTimeout(() => {
        setIsExiting(true);
        // Remove from DOM after animation completes
        setTimeout(() => {
          setShouldRender(false);
        }, 500); // Match the CSS transition time
      }, remainingTime);
    }
  }, [isLoading, shouldRender, startTime, minimumDisplayTime]);
  
  // Handle automatic loading completion
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, minimumDisplayTime);
    
    return () => clearTimeout(timer);
  }, [setIsLoading, minimumDisplayTime]);
  
  // Insert early theme detection script
  useEffect(() => {
    if (!scriptIncluded && typeof document !== 'undefined') {
      const script = document.createElement('script');
      script.innerHTML = earlyThemeScript;
      document.head.appendChild(script);
      setScriptIncluded(true);
    }
  }, [scriptIncluded]);
  
  // Don't render anything if we've completed the animation
  if (!shouldRender) return null;
  
  // Determine which logo to show based on theme
  const logoSrc = isDarkTheme() ? '/images/logo-dark.svg' : '/images/logo-light.svg';
  
  return (
    <div 
      className={`${styles.splashContainer} ${isExiting ? styles.fadeOut : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="splash-title"
      aria-describedby="splash-description"
    >
      <div className={styles.splashContent}>
        <div className={styles.logoContainer}>
          <Image 
            src={logoSrc}
            alt="Application Logo"
            width={250}
            height={250}
            className={styles.logoImage}
            priority
          />
        </div>
        
        <div className={styles.loadingContainer}>
          <div className={styles.loadingDots} aria-hidden="true">
            <div className={styles.loadingDot}></div>
            <div className={styles.loadingDot}></div>
            <div className={styles.loadingDot}></div>
          </div>
          <p 
            id="splash-description" 
            className={styles.loadingText}
          >
            Loading...
          </p>
        </div>
        
        {/* Screen reader content */}
        <h1 id="splash-title" className={styles.visuallyHidden}>
          Application Loading Screen
        </h1>
        <div className={styles.visuallyHidden} aria-live="polite" aria-atomic="true">
          {isLoading ? 'Application is loading, please wait.' : 'Loading complete.'}
        </div>
      </div>
    </div>
  );
}
