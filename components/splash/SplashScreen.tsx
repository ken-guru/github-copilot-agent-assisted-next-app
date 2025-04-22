import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useLoading } from '../../contexts/LoadingContext';
import styles from './SplashScreen.module.css';
import { isDarkTheme } from './SplashScreenTheme';

interface SplashScreenProps {
  minimumDisplayTime?: number;
}

export const SplashScreen = ({ 
  minimumDisplayTime = 1000 
}: SplashScreenProps) => {
  const { isLoading } = useLoading();
  const [shouldDisplay, setShouldDisplay] = useState(true);
  const [displayStartTime] = useState(Date.now());
  const [isDarkMode] = useState(isDarkTheme());
  
  useEffect(() => {
    if (!isLoading) {
      const currentTime = Date.now();
      const elapsedTime = currentTime - displayStartTime;
      
      if (elapsedTime >= minimumDisplayTime) {
        setShouldDisplay(false);
      } else {
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
