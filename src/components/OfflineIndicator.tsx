import React from 'react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import styles from './OfflineIndicator.module.css';

/**
 * Component that displays an offline indicator when the user loses network connectivity
 */
export function OfflineIndicator(): React.ReactElement | null {
  const isOnline = useOnlineStatus();
  
  // Don't render anything if online
  if (isOnline) {
    return null;
  }

  return (
    <div className={styles.offlineIndicator} role="status">
      <div className={styles.content}>
        You are offline
      </div>
    </div>
  );
}