import { useEffect } from 'react';
import { useGlobalTimer } from '@/contexts/GlobalTimerContext';

/**
 * Attaches a beforeunload handler while a session is running to prevent
 * accidental page unload/navigation. Automatically cleans up when session ends.
 */
export function useNavigationGuard() {
  const { sessionStartTime } = useGlobalTimer();

  useEffect(() => {
    const hasActiveSession = Boolean(sessionStartTime);

    function handleBeforeUnload() {
      try {
        // Mark that we left the origin while a session was active
        if (typeof window !== 'undefined' && window.sessionStorage) {
          window.sessionStorage.setItem('mrTimely.leftOriginAt', String(Date.now()));
        }
      } catch (err) {
        // Non-blocking: log to aid debugging; ignore quota or storage access errors
        console.error('useNavigationGuard: failed to set session flag', err);
      }
      // Do not set e.returnValue or call preventDefault — avoids leave-site confirmation
    }

    if (hasActiveSession) {
      window.addEventListener('beforeunload', handleBeforeUnload as EventListener);
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload as EventListener);
      };
    }

    return undefined;
  }, [sessionStartTime]);
}
