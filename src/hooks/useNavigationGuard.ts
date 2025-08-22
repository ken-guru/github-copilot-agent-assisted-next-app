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

    function handleBeforeUnload(e: BeforeUnloadEvent) {
      // Standard pattern: set returnValue to a non-empty string
      e.preventDefault();
      e.returnValue = '';
      return '';
    }

    if (hasActiveSession) {
      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }

    return undefined;
  }, [sessionStartTime]);
}
