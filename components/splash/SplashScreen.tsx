import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useLoading } from '../../contexts/LoadingContext';

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
      
      // Also apply to document body background to prevent any white flash
      document.body.style.backgroundColor = isDark ? 
        'var(--bg-primary-dark, #121212)' : 
        'var(--bg-primary, #ffffff)';
    } catch(e) {
      // Silently fail
    }
  })();
`;

// Try to apply theme immediately during module initialization
// This helps with subsequent navigations in the SPA
if (typeof document !== 'undefined') {
  try {
    if (isDarkTheme()) {
      document.documentElement.classList.add('dark-mode');
      document.documentElement.classList.remove('light-mode');
    } else {
      document.documentElement.classList.add('light-mode');
      document.documentElement.classList.remove('dark-mode');
    }
  } catch {
    // Silently fail
  }
}

export const SplashScreen = ({ 
  minimumDisplayTime = 1000 
}: SplashScreenProps) => {
  const { isLoading } = useLoading();
  const [shouldDisplay, setShouldDisplay] = useState(true);
  const [displayStartTime] = useState(Date.now());
  const [isDarkMode] = useState(isDarkTheme());
  
  // Inject the early theme script on first render
  useEffect(() => {
    // Only run once on initial mount
    const script = document.createElement('script');
    script.innerHTML = earlyThemeScript;
    document.head.appendChild(script);
    
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);
  
  useEffect(() => {
    if (!isLoading) {
      const currentTime = Date.now();
      const elapsedTime = currentTime - displayStartTime;
      
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
  }, [isLoading, minimumDisplayTime, displayStartTime]);
  
  if (!shouldDisplay) {
    return null;
  }
  
  return (
    <div data-testid="splash-screen"
      role="status"
      aria-live="polite"
      aria-label="Application is loading"
      style={{
        backgroundColor: isDarkMode ? 'var(--bg-primary-dark, #121212)' : 'var(--bg-primary, #ffffff)'
      }}
    >
      <div>
        <Image src="/images/splash/splash-logo.webp"
          alt="Application logo"
          width={250}
          height={250}
          priority
          
        />
        
        <div data-testid="loading-indicator">
          <div style={{
            backgroundColor: isDarkMode ? 'var(--accent-color-dark, #30a9de)' : 'var(--accent-color, #0070f3)'
          }}></div>
          <div style={{
            backgroundColor: isDarkMode ? 'var(--accent-color-dark, #30a9de)' : 'var(--accent-color, #0070f3)'
          }}></div>
          <div style={{
            backgroundColor: isDarkMode ? 'var(--accent-color-dark, #30a9de)' : 'var(--accent-color, #0070f3)'
          }}></div>
        </div>
      </div>
    </div>
  );
};
