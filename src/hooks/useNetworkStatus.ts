import { useEffect, useState } from 'react';

// Simple hook that exposes whether the browser is online and updates
// in response to the native `online` / `offline` events. Keeps implementation
// minimal and safe for SSR by checking typeof window.
export default function useNetworkStatus() {
  const [online, setOnline] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true; // assume online on server
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // In some test environments the navigator.onLine may be out-of-date
    // so check once on mount to sync state.
    try {
      setOnline(Boolean((navigator && (navigator as any).onLine) ?? true));
    } catch {
      // ignore
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { online };
}
