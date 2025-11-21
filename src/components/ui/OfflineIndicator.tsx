import React from 'react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import styles from './OfflineIndicator.module.css';
import { useIsClient } from '@/hooks/useIsClient';

/**
 * Props for the OfflineIndicator component
 * This component currently doesn't accept any props, but the interface is defined
 * for future extensibility and consistency
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface OfflineIndicatorProps { }

/**
 * Component that displays an offline indicator when the user loses network connectivity
 */
export function OfflineIndicator({ }: OfflineIndicatorProps): React.ReactElement | null {
  const isOnline = useOnlineStatus();
  const mounted = useIsClient();

  // Don't render anything if not mounted (prevents hydration mismatch)
  if (!mounted) {
    return null;
  }

  // Don't render anything if online
  if (isOnline) {
    return null;
  }

  return (
    <div className={styles.offlineIndicator} role="status" data-testid="offline-indicator">
      <div className={styles.content}>
        You are offline
      </div>
    </div>
  );
}
