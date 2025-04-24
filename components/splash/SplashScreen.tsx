import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useLoading } from '../../contexts/LoadingContext';
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

// Create a script that will run AFTER hydration is complete
// We DO NOT want to modify the DOM until React hydration is done
const earlyThemeScript = `
  (function() {
    // Create a function to safely apply theme after hydration
    function applyThemeWhenSafe() {
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
        
        // Instead of modifying document directly, dispatch a custom event
        // This allows React components to react appropriately
        window.dispatchEvent(new CustomEvent('themedetected', { 
          detail: { isDark: isDark } 
        }));
      } catch(e) {
        // Silently fail
      }
    }
    
    // Wait for next tick to ensure hydration is complete
    setTimeout(applyThemeWhenSafe, 0);
  })();
`;

// REMOVED: direct DOM manipulation during module initialization
// We'll handle all theme changes through React's state system instead

export const SplashScreen = ({ 
  minimumDisplayTime = 1000 
}: SplashScreenProps) => {
  const { isLoading } = useLoading();
  const [shouldDisplay, setShouldDisplay] = useState(true);
  // Use a ref for values that don't affect rendering
  const displayStartTimeRef = React.useRef(Date.now());
  
  // CRITICAL: Always initialize with FALSE on both server and client for consistent hydration
  const [isDarkMode, setIsDarkMode] = useState(false);
  // Track if we've completed hydration
  const hydrationComplete = React.useRef(false);
  
  // Handle theme change event and initialization after hydration
  useEffect(() => {
    // Mark hydration as complete
    hydrationComplete.current = true;
    
    // Listen for theme detection from our script
    const handleThemeDetected = (event: CustomEvent<{isDark: boolean}>) => {
      setIsDarkMode(event.detail.isDark);
    };
    
    // Add event listener with type assertion
    window.addEventListener('themedetected', handleThemeDetected as EventListener);
    
    // Inject the script that will safely detect theme after hydration
    const script = document.createElement('script');
    script.innerHTML = earlyThemeScript;
    document.head.appendChild(script);
    
    return () => {
      window.removeEventListener('themedetected', handleThemeDetected as EventListener);
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);
  
  useEffect(() => {
    if (!isLoading) {
      const currentTime = Date.now();
      const elapsedTime = currentTime - displayStartTimeRef.current;
      
      if (elapsedTime >= minimumDisplayTime) {
        // If minimum time has passed, hide splash screen immediately
        setShouldDisplay(false);
      } else {
        // Otherwise, wait for the remaining time
        const remainingTime = minimumDisplayTime - elapsedTime;
        const timer = setTimeout(() => {
          setShouldDisplay(false);
        }, remainingTime);
        
        return () => clearTimeout(timer);
      }
    }
  }, [isLoading, minimumDisplayTime]);
  
  if (!shouldDisplay) {
    return null;
  }
  
  return (
    <div 
      className={styles.splashScreen} 
      data-testid="splash-screen"
      role="status"
      aria-live="polite"
      aria-label="Application is loading"
      style={{
        backgroundColor: isDarkMode ? 'var(--bg-primary-dark, #121212)' : 'var(--bg-primary, #ffffff)'
      }}
    >
      <div className={styles.logoContainer}>
        <Image
          src="/images/splash/splash-logo.webp"
          alt="Application logo"
          width={250}
          height={250}
          priority
          className={styles.logo}
        />
        
        <div className={styles.loadingIndicator} data-testid="loading-indicator">
          <div className={styles.loadingDot} style={{
            backgroundColor: isDarkMode ? 'var(--accent-color-dark, #30a9de)' : 'var(--accent-color, #0070f3)'
          }}></div>
          <div className={styles.loadingDot} style={{
            backgroundColor: isDarkMode ? 'var(--accent-color-dark, #30a9de)' : 'var(--accent-color, #0070f3)'
          }}></div>
          <div className={styles.loadingDot} style={{
            backgroundColor: isDarkMode ? 'var(--accent-color-dark, #30a9de)' : 'var(--accent-color, #0070f3)'
          }}></div>
        </div>
      </div>
    </div>
  );
};
