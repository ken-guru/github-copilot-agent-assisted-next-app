import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useLoading } from '../../contexts/LoadingContext';
import { isDarkTheme } from '../../src/utils/theme';
import styles from './SplashScreen.module.css';

export interface SplashScreenProps {
  /**
   * Minimum time to display the splash screen in milliseconds
   * @default 1000
   */
  minimumDisplayTime?: number;
}

/**
 * SplashScreen component displayed during initial app loading
 */
const SplashScreen: React.FC<SplashScreenProps> = ({
  minimumDisplayTime = 1000 
}: SplashScreenProps) => {
  const { isLoading } = useLoading();
  const [shouldDisplay, setShouldDisplay] = useState(true);
  const [displayStartTime] = useState(Date.now());
  const [isDarkMode] = useState(isDarkTheme());

  useEffect(() => {
    // If not loading, calculate if minimum display time has passed
    if (!isLoading) {
      const currentTime = Date.now();
      const elapsedTime = currentTime - displayStartTime;
      
      if (elapsedTime < minimumDisplayTime) {
        // Wait for the remaining time before hiding
        const timeout = setTimeout(() => {
          setShouldDisplay(false);
        }, minimumDisplayTime - elapsedTime);
        
        // Cleanup timeout if component unmounts
        return () => clearTimeout(timeout);
      } else {
        // Minimum time has already passed, hide immediately
        setShouldDisplay(false);
      }
    }
  }, [isLoading, minimumDisplayTime, displayStartTime]);

  // Don't render anything if we shouldn't display
  if (!shouldDisplay) {
    return null;
  }

  return (
    <div 
      className={styles.splashScreen} 
      role="status" 
      aria-live="polite"
      aria-label="Application is loading"
      data-testid="splash-screen"
    >
      <div className={styles.logoContainer}>
        <Image
          src={isDarkMode ? "/images/splash/splash-logo-dark.webp" : "/images/splash/splash-logo.webp"}
          alt="Application logo"
          width={250}
          height={250}
          className={styles.logo}
          style={{ height: 'auto' }} // Maintain aspect ratio
        />
        <div className={styles.loadingIndicator} data-testid="loading-indicator">
          <div className={styles.loadingDot}></div>
          <div className={styles.loadingDot}></div>
          <div className={styles.loadingDot}></div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
