import React, { useEffect, useState } from 'react';
import { useToast } from './ToastNotificationProvider';
import { useRef } from 'react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

/**
 * Component that displays an offline indicator when the user loses network connectivity
 * Uses Toast notification for consistent styling
 */
export function OfflineIndicator(): React.ReactElement | null {
  const isOnline = useOnlineStatus();
  const [mounted, setMounted] = useState(false);
  const { showToast } = useToast();
  const offlineToastShown = useRef(false);

  // Handle SSR
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isOnline && !offlineToastShown.current) {
      showToast('warning', 'You are offline');
      offlineToastShown.current = true;
    } else if (isOnline) {
      offlineToastShown.current = false;
    }
  }, [isOnline, mounted, showToast]);

  // Don't render anything if not mounted (prevents hydration mismatch)
  if (!mounted) {
    return null;
  }
  // Don't render anything if online
  if (isOnline) {
    return null;
  }
  // Render a persistent offline indicator for E2E and accessibility
  return (
    <div
      data-testid="offline-indicator"
      className="alert alert-warning text-center mb-0"
      role="status"
      aria-live="polite"
      style={{ position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 2000 }}
    >
      <span className="visually-hidden">Offline:</span> You are offline
    </div>
  );
}