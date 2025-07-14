import React, { useEffect, useState } from 'react';
import { Alert } from 'react-bootstrap';
import { useOnlineStatus } from '@hooks/use-online-status';

/**
 * Component that displays an offline indicator when the user loses network connectivity
 * Uses Bootstrap Alert component for consistent styling
 */
export function OfflineIndicator(): React.ReactElement | null {
  const isOnline = useOnlineStatus();
  const [mounted, setMounted] = useState(false);

  // Handle SSR
  useEffect(() => {
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
      className="text-center mb-3"
      data-testid="offline-indicator"
    >
      You are offline
    </Alert>
  );
}