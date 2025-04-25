import { useEffect, useState, useRef } from 'react';
import { useViewport } from '../hooks/useViewport';
import styles from './OvertimeIndicator.module.css';

// Utility for formatting duration
const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

interface OvertimeIndicatorProps {
  isOvertime: boolean;
  overtimeDuration: number; // in seconds
}

/**
 * OvertimeIndicator - A component that displays when the user is in overtime
 * Enhanced for mobile with haptic feedback and improved visibility
 * 
 * @param {boolean} isOvertime - Whether the user is currently in overtime
 * @param {number} overtimeDuration - The duration of overtime in seconds
 * @returns {JSX.Element | null} - The overtime indicator or null if not in overtime
 */
const OvertimeIndicator = ({ isOvertime, overtimeDuration }: OvertimeIndicatorProps): JSX.Element | null => {
  const [visible, setVisible] = useState(false);
  const { isMobile, hasTouch } = useViewport();
  const wasOvertimeBefore = useRef(false);
  
  // Add animation delay for better user experience
  useEffect(() => {
    if (isOvertime) {
      setVisible(true);
      
      // Trigger haptic feedback when entering overtime
      if (!wasOvertimeBefore.current && hasTouch) {
        try {
          // Check if vibration API is available
          if (navigator.vibrate) {
            // Vibrate pattern: 200ms, pause 100ms, vibrate 200ms
            navigator.vibrate([200, 100, 200]);
          }
        } catch (err) {
          // Silently fail if vibration API is not available or fails
          console.log('Vibration not supported');
        }
      }
    } else {
      const timeout = setTimeout(() => setVisible(false), 300);
      return () => clearTimeout(timeout);
    }
    
    wasOvertimeBefore.current = isOvertime;
  }, [isOvertime, hasTouch]);
  
  if (!visible) return null;
  
  const formattedOvertime = formatDuration(overtimeDuration);
  
  // Apply different classes based on viewport
  const containerClasses = [
    styles.overtimeIndicator,
    isOvertime ? styles.pulsing : '',
    isMobile ? styles.mobile : '',
    isMobile ? styles.banner : '',
    isMobile && isOvertime ? styles.intensePulsing : '',
  ].filter(Boolean).join(' ');
  
  const durationClasses = [
    styles.duration,
    isMobile ? styles.mobileDuration : '',
  ].filter(Boolean).join(' ');
  
  return (
    <div 
      className={containerClasses}
      data-testid="overtime-indicator"
      aria-live="polite"
      role="alert"
    >
      <span className={styles.label}>OVERTIME</span>
      <span 
        className={durationClasses}
        data-testid="overtime-duration"
      >
        {formattedOvertime}
      </span>
    </div>
  );
};

export default OvertimeIndicator;
