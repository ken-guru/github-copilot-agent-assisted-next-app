import { useEffect, useState, useRef } from 'react';

// Simple hook that exposes whether the browser is online and updates
// in response to the native `online` / `offline` events. Keeps implementation
// minimal and safe for SSR by checking typeof window.
export default function useNetworkStatus() {
  const [online, setOnline] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true; // assume online on server
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });
  const syncedRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // In some test environments the navigator.onLine may be out-of-date
    // so check once on mount to sync state.
    if (!syncedRef.current) {
      syncedRef.current = true;
      queueMicrotask(() => {
        try {
          // Avoid using `any` casts for navigator; narrow safely
          const nav = typeof navigator !== 'undefined' ? navigator : undefined;
          setOnline(Boolean(nav?.onLine ?? true));
        } catch {
          // ignore
        }
      });
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { online };
}
