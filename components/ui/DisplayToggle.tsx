import React, { useEffect } from 'react';
import { useDisplaySettings } from '../contexts/DisplaySettingsContext';
import useWakeLock from '../../hooks/useWakeLock';
import styles from './DisplayToggle.module.css';

const DisplayToggle: React.FC = () => {
  const { keepDisplayOn, toggleKeepDisplayOn } = useDisplaySettings();
  const { isSupported, isActive, request, release } = useWakeLock();
  
  // Effect to handle wake lock when keepDisplayOn changes
  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return;
    
    if (!isSupported) return;
    
    if (keepDisplayOn && !isActive) {
      request();
    } else if (!keepDisplayOn && isActive) {
      release();
    }
  }, [keepDisplayOn, isActive, isSupported, request, release]);
  
  return (
    <div className={styles.container}>
      <button
        className={`${styles.toggleButton} ${keepDisplayOn ? styles.active : styles.inactive}`}
        onClick={toggleKeepDisplayOn}
        disabled={!isSupported}
        aria-label={keepDisplayOn ? "Turn display sleep on" : "Keep display on"}
        title={keepDisplayOn ? "Display sleep is off" : "Keep display on"}
        data-testid="display-toggle"
        role="switch"
        aria-checked={keepDisplayOn}
      >
        {/* Screen/Display icon */}
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
          <line x1="8" y1="21" x2="16" y2="21"></line>
          <line x1="12" y1="17" x2="12" y2="21"></line>
        </svg>
        
        {/* Status label */}
        <span 
          className={styles.statusLabel} 
          data-testid="toggle-status"
        >
          {keepDisplayOn ? "On" : "Off"}
        </span>
        
        {/* Show small indicator dot if not supported */}
        {!isSupported && typeof window !== 'undefined' && (
          <span className={styles.unsupportedIndicator} title="Not supported on this device"></span>
        )}
      </button>
    </div>
  );
};

export default DisplayToggle;
