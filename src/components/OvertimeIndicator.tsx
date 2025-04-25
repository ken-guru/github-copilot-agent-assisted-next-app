import { useEffect, useState } from 'react';
import styles from './OvertimeIndicator.module.css';

// Import from time utilities for formatting duration
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
 * 
 * @param {boolean} isOvertime - Whether the user is currently in overtime
 * @param {number} overtimeDuration - The duration of overtime in seconds
 * @returns {JSX.Element | null} - The overtime indicator or null if not in overtime
 */
const OvertimeIndicator = ({ isOvertime, overtimeDuration }: OvertimeIndicatorProps): JSX.Element | null => {
  const [visible, setVisible] = useState(false);
  
  // Add animation delay for better user experience
  useEffect(() => {
    if (isOvertime) {
      setVisible(true);
    } else {
      const timeout = setTimeout(() => setVisible(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [isOvertime]);
  
  if (!visible) return null;
  
  const formattedOvertime = formatDuration(overtimeDuration);
  
  return (
    <div 
      className={`${styles.overtimeIndicator} ${isOvertime ? styles.pulsing : ''}`}
      data-testid="overtime-indicator"
      aria-live="polite"
    >
      <span className={styles.label}>OVERTIME</span>
      <span className={styles.duration}>{formattedOvertime}</span>
    </div>
  );
};

export default OvertimeIndicator;
