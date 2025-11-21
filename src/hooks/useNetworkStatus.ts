import { useSyncExternalStore } from 'react';

// Simple hook that exposes whether the browser is online and updates
// in response to the native `online` / `offline` events. Keeps implementation
// minimal and safe for SSR by checking typeof window.

function subscribe(callback: () => void) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

function getSnapshot() {
  return navigator.onLine;
}

function getServerSnapshot() {
  return true;
}

export default function useNetworkStatus() {
  const online = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return { online };
}
