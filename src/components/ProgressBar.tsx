import React, { useState, useEffect } from 'react';
import { useViewport } from '../hooks/useViewport';
import styles from './ProgressBar.module.css';

interface ProgressBarProps {
  elapsedTime: number;
  totalDuration: number;
  isActive: boolean;
  className?: string;
  labelPosition?: 'top' | 'inside' | 'none';
  showPercentage?: boolean;
}

export default function ProgressBar({
  elapsedTime,
  totalDuration,
  isActive,
  className = '',
  labelPosition = 'none',
  showPercentage = false,
}: ProgressBarProps) {
  const { isMobile, hasTouch } = useViewport();
  const [lastProgress, setLastProgress] = useState<number>(0);
  const [showFadingAnimation, setShowFadingAnimation] = useState<boolean>(false);
  
  // Calculate the progress percentage (capped at 100%) when active
  const progressPercentage = isActive ? Math.min(100, (elapsedTime / totalDuration) * 100) : 0;
  
  // Detect significant progress changes to trigger animations
  useEffect(() => {
    const currentProgress = Math.round(progressPercentage);
    if (Math.abs(currentProgress - lastProgress) >= 5) {
      // Progress changed by at least 5%, trigger animation
      setShowFadingAnimation(true);
      const timer = setTimeout(() => {
        setShowFadingAnimation(false);
      }, 1500); // Animation duration
      
      // Update last progress
      setLastProgress(currentProgress);
      
      return () => clearTimeout(timer);
    }
  }, [progressPercentage, lastProgress]);
  
  // Calculate color based on progress percentage for smooth transition
  const calculateProgressColor = (): string => {
    // Define the color thresholds with their respective HSL hue values
    const thresholds = [
      { threshold: 50, hue: '--progress-green-hue' },
      { threshold: 70, hue: '--progress-yellow-hue' },
      { threshold: 90, hue: '--progress-orange-hue' },
      { threshold: 100, hue: '--progress-red-hue' },
    ];
    
    // Find the appropriate color for the current progress
    let currentHueVar = '--progress-green-hue';
    
    for (const { threshold, hue } of thresholds) {
      if (progressPercentage >= threshold) {
        currentHueVar = hue;
      }
    }
    
    // Interpolate color hue based on progress
    return `hsl(var(${currentHueVar}), var(--progress-saturation), var(--progress-lightness))`;
  };
  
  // Combine CSS classes based on viewport and touch capability
  const containerClasses = [
    styles.progressBarContainer,
    !isActive ? styles.inactiveBar : '',
    isMobile ? styles.mobileProgressBarContainer : '',
    hasTouch ? styles.touchFriendly : '',
    className,
  ].filter(Boolean).join(' ');
  
  // Text label classes
  const labelClasses = [
    styles.textLabel,
    hasTouch ? styles.largeIndicator : '',
  ].filter(Boolean).join(' ');
  
  const labelContainerClasses = [
    styles.labelContainer,
    showFadingAnimation ? styles.fadingLabel : '',
  ].filter(Boolean).join(' ');
  
  // Render progress bar component
  const progressBarComponent = (
    <div
      className={containerClasses}
      role="progressbar"
      aria-valuenow={Math.round(progressPercentage)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Progress towards total duration"
    >
      <div 
        className={styles.progressFill} 
        style={{
          width: `${progressPercentage}%`,
          backgroundColor: calculateProgressColor()
        }}
      />
      
      {showPercentage && (
        <div className={labelContainerClasses}>
          <span className={labelClasses}>
            {Math.round(progressPercentage)}%
          </span>
        </div>
      )}
    </div>
  );
  
  // Return the progress bar based on label position
  if (labelPosition === 'top') {
    return (
      <div className={styles.progressWithLabel}>
        {/* Can add label component here in the future */}
        {progressBarComponent}
      </div>
    );
  } else {
    return progressBarComponent;
  }
}