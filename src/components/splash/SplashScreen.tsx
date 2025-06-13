import React, { useState, useEffect } from 'react';
import { useLoading } from '@contexts/loading';

interface SplashScreenProps {
  minimumDisplayTime?: number;
  testMode?: boolean; // Add for testing purposes
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ 
  minimumDisplayTime = 1000,
  testMode = false
}) => {
  const { isLoading } = useLoading();
  const [shouldShow, setShouldShow] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    let fadeTimer: NodeJS.Timeout;
    const splashTimer: NodeJS.Timeout = setTimeout(() => {
      // If the app is no longer loading, begin fade out
      if (!isLoading) {
        setFadeOut(true);
        
        // After fade animation completes, fully hide the splash screen
        // But skip actual DOM removal in test mode
        if (!testMode) {
          fadeTimer = setTimeout(() => {
            setShouldShow(false);
          }, 500); // Matching the CSS transition duration
        }
      }
    }, minimumDisplayTime);

    // If loading state changes after minimum time has elapsed
    if (!isLoading && !fadeOut) {
      setFadeOut(true);
      
      // Skip actual DOM removal in test mode
      if (!testMode) {
        fadeTimer = setTimeout(() => {
          setShouldShow(false);
        }, 500);
      }
    }

    return () => {
      clearTimeout(splashTimer);
      clearTimeout(fadeTimer);
    };
  }, [isLoading, minimumDisplayTime, fadeOut, testMode]);

  if (!shouldShow) {
    return null;
  }

  return (
    <div data-testid="splash-screen">
      <div>
        <h1>Mr. Timely</h1>
        <div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  );
};
