import React, { useState, useEffect } from 'react';
import styles from './splash/SplashScreen.module.css';

interface SplashScreenProps {
  children: React.ReactNode;
  minimumDisplayTime?: number;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ 
  children, 
  minimumDisplayTime = 2000 
}) => {
  const [loading, setLoading] = useState(true);
  
  // Use a consistent style object with camelCase properties for React
  // Always use the same base variables regardless of theme to ensure SSR consistency
  const splashScreenStyle = {
    backgroundColor: 'var(--bg-primary, #ffffff)'
  };
  
  const loadingDotStyle = {
    backgroundColor: 'var(--accent-color, #0070f3)'
  };
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, minimumDisplayTime);
    
    return () => clearTimeout(timer);
  }, [minimumDisplayTime]);
  
  if (loading) {
    return (
      <div
        className={styles.splashScreen}
        data-testid="splash-screen"
        role="status"
        aria-live="polite"
        aria-label="Application is loading"
        style={splashScreenStyle}
      >
        <div className={styles.logoContainer || styles.splashContent}>
          <img src="/logo.png" alt="App Logo" className={styles.logo} />
          <div className={styles.loadingIndicator} data-testid="loading-indicator">
            <div 
              className={`SplashScreen-module__loadingDot ${styles.loadingDot}`} 
              style={loadingDotStyle}
            ></div>
            <div 
              className={`SplashScreen-module__loadingDot ${styles.loadingDot}`} 
              style={loadingDotStyle}
            ></div>
            <div 
              className={`SplashScreen-module__loadingDot ${styles.loadingDot}`} 
              style={loadingDotStyle}
            ></div>
          </div>
        </div>
      </div>
    );
  }
  
  // When loading is complete, render children
  return <>{children}</>;
};

export default SplashScreen;
