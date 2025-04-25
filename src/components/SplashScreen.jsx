import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import styles from './SplashScreen.module.css';

// Import theme utility
import { createThemeStyles } from '../utils/themeSync';

const SplashScreen = ({ children, minimumDisplayTime = 2000 }) => {
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  
  // Theme-aware styles that work during both SSR and CSR
  const dotStyle = createThemeStyles({
    backgroundColor: {
      light: '--accent-color',
      dark: '--accent-color-dark',
      fallback: '#0070f3'
    }
  });
  
  const containerStyle = createThemeStyles({
    backgroundColor: {
      light: '--bg-primary',
      dark: '--bg-primary-dark',
      fallback: '#ffffff'
    }
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, minimumDisplayTime);

    return () => clearTimeout(timer);
  }, [minimumDisplayTime]);

  if (!loading) {
    return <>{children}</>;
  }

  return (
    <div
      className={styles.splashScreen}
      data-testid="splash-screen"
      role="status"
      aria-live="polite"
      aria-label="Application is loading"
      style={containerStyle}
    >
      <div className={styles.logoContainer}>
        <img
          src="/logo.svg"
          alt="Application Logo"
          className={styles.logo}
        />
        <div className={styles.loadingIndicator} data-testid="loading-indicator">
          <div
            className={styles.loadingDot}
            style={dotStyle}
          />
          <div
            className={styles.loadingDot}
            style={dotStyle}
          />
          <div
            className={styles.loadingDot}
            style={dotStyle}
          />
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
