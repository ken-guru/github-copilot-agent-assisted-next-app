import React from 'react';
import { Alert } from 'react-bootstrap';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useIsClient } from '@/hooks/useIsClient';

/**
 * Component that displays an offline indicator when the user loses network connectivity
 * Uses Bootstrap Alert component for consistent styling
 */
export function OfflineIndicator(): React.ReactElement | null {
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
    <Alert
      variant="warning"
      className="text-center mb-3 fade show"
      data-testid="offline-indicator"
    >
      You are offline
    </Alert>
  );
}