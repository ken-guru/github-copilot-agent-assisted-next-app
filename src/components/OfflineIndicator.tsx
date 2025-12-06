import React, { useEffect, useState } from 'react';
import { Alert } from 'react-bootstrap';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

/**
 * Component that displays an offline indicator when the user loses network connectivity
 * Uses Bootstrap Alert component for consistent styling
 */
export function OfflineIndicator(): React.ReactElement | null {
  const isOnline = useOnlineStatus();
  const [mounted, setMounted] = useState(false);

  // Handle SSR
  useEffect(() => {
    // SSR hydration pattern - set state on mount to prevent hydration mismatch
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

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