import React, { useEffect, useState } from 'react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

/**
 * Component that displays an offline indicator when the user loses network connectivity
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
    <div role="status" data-testid="offline-indicator">
      <div>
        You are offline
      </div>
    </div>
  );
}