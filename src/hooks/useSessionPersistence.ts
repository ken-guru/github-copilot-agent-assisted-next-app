/**
 * Hook for automatic session persistence and recovery
 */

import { useEffect, useRef, useCallback, useState } from 'react';
import { Activity } from '@/types/activity';
import { TimelineEntry, PersistedSession, SessionPersistenceOptions, SessionRecoveryInfo, DEFAULT_PERSISTENCE_OPTIONS, SESSION_PERSISTENCE_VERSION } from '@/types';
import { ActivityState } from '@/utils/activityStateMachine';
import { createSessionStorage, sessionStorageUtils } from '@/utils/sessionStorage';

/**
 * Current session state for persistence
 */
export interface CurrentSessionState {
  timeSet: boolean;
  totalDuration: number;
  elapsedTime: number;
  timerActive: boolean;
  currentActivity: Activity | null;
  timelineEntries: TimelineEntry[];
  completedActivityIds: string[];
  removedActivityIds: string[];
  activities: Activity[];
  activityStates: ActivityState[];
}

/**
 * Session persistence hook result
 */
export interface UseSessionPersistenceResult {
  /** Whether session persistence is available */
  isPersistenceAvailable: boolean;
  
  /** Storage type being used */
  storageType: string;
  
  /** Manually save current session */
  saveSession: () => Promise<void>;
  
  /** Clear saved session */
  clearSession: () => Promise<void>;
  
  /** Check for recoverable session */
  checkRecoverableSession: () => Promise<SessionRecoveryInfo>;
  
  /** Load and return session data for recovery */
  loadSessionForRecovery: () => Promise<PersistedSession | null>;
  
  /** Whether auto-save is currently active */
  isAutoSaveActive: boolean;
  
  /** Last save timestamp */
  lastSaveTime: Date | null;
}

/**
 * Hook for session persistence and recovery
 */
export function useSessionPersistence(
  sessionState: CurrentSessionState | null,
  options: SessionPersistenceOptions = {}
): UseSessionPersistenceResult {
  const opts = { ...DEFAULT_PERSISTENCE_OPTIONS, ...options };
  const storage = useRef(createSessionStorage());
  const saveIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastStateRef = useRef<string>('');
  
  const [isAutoSaveActive, setIsAutoSaveActive] = useState(false);
  const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null);

  /**
   * Convert current session state to persistable format
   */
  const createPersistedSession = useCallback((state: CurrentSessionState): PersistedSession => {
    const now = new Date().toISOString();
    
    return {
      id: `session-${Date.now()}`,
      startTime: now, // In a real implementation, this would track actual session start
      totalDuration: state.totalDuration,
      elapsedTime: state.elapsedTime,
      currentActivityId: state.currentActivity?.id || null,
      timerActive: state.timerActive,
      activities: state.activities,
      completedActivityIds: state.completedActivityIds,
      removedActivityIds: state.removedActivityIds,
      timelineEntries: state.timelineEntries,
      activityStates: state.activityStates,
      lastSaved: now,
      version: SESSION_PERSISTENCE_VERSION
    };
  }, []);

  /**
   * Save current session to storage
   */
  const saveSession = useCallback(async (): Promise<void> => {
    if (!sessionState || !storage.current.isAvailable()) {
      return;
    }

    // Only save if time is set (session has actually started)
    if (!sessionState.timeSet) {
      return;
    }

    try {
      const persistedSession = createPersistedSession(sessionState);
      await storage.current.saveSession(persistedSession);
      setLastSaveTime(new Date());
      
      // Update state tracking for change detection
      lastStateRef.current = JSON.stringify(sessionState);
    } catch (error) {
      console.error('Failed to save session:', error);
    }
  }, [sessionState, createPersistedSession]);

  /**
   * Clear saved session
   */
  const clearSession = useCallback(async (): Promise<void> => {
    try {
      await storage.current.clearSession();
      setLastSaveTime(null);
      lastStateRef.current = '';
    } catch (error) {
      console.error('Failed to clear session:', error);
    }
  }, []);

  /**
   * Check if there's a recoverable session
   */
  const checkRecoverableSession = useCallback(async (): Promise<SessionRecoveryInfo> => {
    try {
      const session = await storage.current.loadSession();
      
      if (!session) {
        return { hasRecoverableSession: false };
      }

      // Check if session is within recovery time window
      if (!sessionStorageUtils.isSessionRecoverable(session, opts.maxRecoveryAge)) {
        // Clean up old session
        await storage.current.clearSession();
        return { hasRecoverableSession: false };
      }

      // Get current activity name for display
      const currentActivity = session.activities.find(a => a.id === session.currentActivityId);
      const currentActivityName = currentActivity?.name || 'Unknown Activity';
      
      // Format time elapsed for display
      const timeElapsed = sessionStorageUtils.formatElapsedTime(session.elapsedTime);
      
      // Create description
      const description = session.currentActivityId 
        ? `You had an active timer session (${currentActivityName} - ${timeElapsed} elapsed)`
        : `You had a timer session (${timeElapsed} elapsed)`;

      return {
        hasRecoverableSession: true,
        session,
        description,
        timeElapsed,
        currentActivityName: session.currentActivityId ? currentActivityName : undefined
      };
    } catch (error) {
      console.error('Failed to check recoverable session:', error);
      return { hasRecoverableSession: false };
    }
  }, [opts.maxRecoveryAge]);

  /**
   * Load session data for recovery
   */
  const loadSessionForRecovery = useCallback(async (): Promise<PersistedSession | null> => {
    try {
      return await storage.current.loadSession();
    } catch (error) {
      console.error('Failed to load session for recovery:', error);
      return null;
    }
  }, []);

  /**
   * Check if session state has changed significantly
   */
  const hasSessionChanged = useCallback((state: CurrentSessionState): boolean => {
    const currentStateString = JSON.stringify(state);
    return currentStateString !== lastStateRef.current;
  }, []);

  /**
   * Auto-save logic
   */
  useEffect(() => {
    if (!sessionState || !storage.current.isAvailable()) {
      setIsAutoSaveActive(false);
      return;
    }

    // Only start auto-save if session has actually started
    if (!sessionState.timeSet) {
      setIsAutoSaveActive(false);
      return;
    }

    setIsAutoSaveActive(true);

    // Set up interval for regular saves
    saveIntervalRef.current = setInterval(() => {
      if (sessionState && hasSessionChanged(sessionState)) {
        saveSession();
      }
    }, opts.saveInterval);

    // Save immediately on timer state changes if auto-save is enabled
    if (opts.autoSaveOnActivity && hasSessionChanged(sessionState)) {
      saveSession();
    }

    return () => {
      if (saveIntervalRef.current) {
        clearInterval(saveIntervalRef.current);
        saveIntervalRef.current = null;
      }
      setIsAutoSaveActive(false);
    };
  }, [sessionState, opts.saveInterval, opts.autoSaveOnActivity, hasSessionChanged, saveSession]);

  /**
   * Clean up on unmount
   */
  useEffect(() => {
    return () => {
      if (saveIntervalRef.current) {
        clearInterval(saveIntervalRef.current);
      }
    };
  }, []);

  return {
    isPersistenceAvailable: storage.current.isAvailable(),
    storageType: storage.current.getStorageType(),
    saveSession,
    clearSession,
    checkRecoverableSession,
    loadSessionForRecovery,
    isAutoSaveActive,
    lastSaveTime
  };
}
