import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import styles from './OfflineIndicator.module.css';

/**
 * Component that displays an offline indicator when the user loses network connectivity
 */
export function OfflineIndicator(): JSX.Element | null {
  const isOnline = useOnlineStatus();
  
  // Don't render anything if online
  if (isOnline) {
    return null;
  }
  
  return (
    <div className={styles.offlineIndicator} role="status" aria-live="polite">
      <div className={styles.content}>
        <span className={styles.icon}>⚠️</span>
        <span>You are offline. Some features may be limited.</span>
      </div>
    </div>
  );
}