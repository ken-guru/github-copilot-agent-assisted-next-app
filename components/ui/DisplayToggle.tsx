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
  
  // Function to handle clicks - provides feedback when not supported
  const handleToggleClick = () => {
    if (!isSupported && typeof window !== 'undefined') {
      // Could show a notification or alert here if needed
      console.warn('Wake Lock API is not supported on this device');
      return;
    }
    toggleKeepDisplayOn();
  };
  
  return (
    <div className={styles.container}>
      {/* Show prominent warning if not supported */}
      {!isSupported && typeof window !== 'undefined' && (
        <div className={styles.warningMessage} data-testid="support-warning">
          Screen wake lock not supported on this device
        </div>
      )}
      
      <button
        className={`${styles.toggleButton} ${keepDisplayOn ? styles.active : styles.inactive} ${!isSupported ? styles.unsupported : ''}`}
        onClick={handleToggleClick}
        disabled={!isSupported}
        aria-label={keepDisplayOn ? "Turn display sleep on" : "Keep display on"}
        title={!isSupported ? "Not supported on this device" : keepDisplayOn ? "Display sleep is off" : "Keep display on"}
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
        
        {/* Status label with enhanced feedback */}
        <span 
          className={styles.statusLabel} 
          data-testid="toggle-status"
        >
          {!isSupported && typeof window !== 'undefined' ? "N/A" : keepDisplayOn ? "On" : "Off"}
        </span>
        
        {/* Show small indicator dot if not supported - keep for backwards compatibility */}
        {!isSupported && typeof window !== 'undefined' && (
          <span className={styles.unsupportedIndicator} title="Not supported on this device"></span>
        )}
      </button>
    </div>
  );
};

export default DisplayToggle;
