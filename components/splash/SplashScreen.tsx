import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useLoading } from '../../contexts/LoadingContext';
import styles from './SplashScreen.module.css';

interface SplashScreenProps {
  minimumDisplayTime?: number;
}

export const SplashScreen = ({ 
  minimumDisplayTime = 1000 
}: SplashScreenProps) => {
  const { isLoading } = useLoading();
  const [shouldDisplay, setShouldDisplay] = useState(true);
  const [displayStartTime] = useState(Date.now());
  
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
    <div 
      className={styles.splashScreen} 
      data-testid="splash-screen"
      role="status"
      aria-live="polite"
      aria-label="Application is loading"
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
          <div className={styles.loadingDot}></div>
          <div className={styles.loadingDot}></div>
          <div className={styles.loadingDot}></div>
        </div>
      </div>
    </div>
  );
};
