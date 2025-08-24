'use client';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import type { Activity } from '@/types/activity';

export type PageState = 'timer' | 'summary' | 'other';

export interface GlobalTimerState {
  sessionId: string | null;
  isTimerRunning: boolean;
  sessionStartTime: number | null; // epoch millis for serialization
  totalDuration: number; // seconds
  currentActivity: Activity | null;
  currentActivityStartTime: number | null; // epoch millis
  completedActivities: Activity[];
  currentBreakStartTime: number | null; // epoch millis
  drawerExpanded: boolean;
  currentPage: PageState;
}

type Action =
  | { type: 'HYDRATE'; payload: GlobalTimerState }
  | { type: 'START_SESSION'; payload: { totalDuration: number; startTime?: number; sessionId?: string } }
  | { type: 'RESET_SESSION' }
  | { type: 'SET_CURRENT_ACTIVITY'; payload: { activity: Activity | null; startTime?: number } }
  | { type: 'COMPLETE_CURRENT_ACTIVITY'; payload?: { completedAt?: number } }
  | { type: 'START_BREAK'; payload?: { startTime?: number } }
  | { type: 'END_BREAK' }
  | { type: 'SET_DRAWER_EXPANDED'; payload: boolean }
  | { type: 'SET_CURRENT_PAGE'; payload: PageState }
  | { type: 'ADD_ONE_MINUTE' };

const STORAGE_KEY = 'mrTimely.globalTimer.v1';

const initialState: GlobalTimerState = {
  sessionId: null,
  isTimerRunning: false,
  sessionStartTime: null,
  totalDuration: 0,
  currentActivity: null,
  currentActivityStartTime: null,
  completedActivities: [],
  currentBreakStartTime: null,
  drawerExpanded: false,
  currentPage: 'other',
};

function reducer(state: GlobalTimerState, action: Action): GlobalTimerState {
  switch (action.type) {
    case 'HYDRATE':
      return { ...state, ...action.payload };
    case 'START_SESSION': {
      const startTime = action.payload.startTime ?? Date.now();
      return {
        ...state,
        sessionId: action.payload.sessionId ?? state.sessionId ?? cryptoRandomId(),
        isTimerRunning: true,
        sessionStartTime: startTime,
        totalDuration: action.payload.totalDuration,
        // Reset per-session fields
        currentActivity: null,
        currentActivityStartTime: null,
        completedActivities: [],
        currentBreakStartTime: null,
      };
    }
    case 'RESET_SESSION':
      return { ...initialState };
    case 'SET_CURRENT_ACTIVITY': {
      const startTime = action.payload.startTime ?? Date.now();
      return {
        ...state,
        currentActivity: action.payload.activity,
        currentActivityStartTime: action.payload.activity ? startTime : null,
        // Leaving activity implies break not active
        currentBreakStartTime: action.payload.activity ? null : state.currentBreakStartTime,
      };
    }
    case 'COMPLETE_CURRENT_ACTIVITY': {
      if (!state.currentActivity) return state;
      return {
        ...state,
        completedActivities: [...state.completedActivities, state.currentActivity],
        currentActivity: null,
        currentActivityStartTime: null,
      };
    }
    case 'START_BREAK': {
      const startTime = action.payload?.startTime ?? Date.now();
      return {
        ...state,
        // Clear any current activity when break starts
        currentActivity: null,
        currentActivityStartTime: null,
        currentBreakStartTime: startTime,
      };
    }
    case 'END_BREAK': {
      return {
        ...state,
        currentBreakStartTime: null,
      };
    }
    case 'SET_DRAWER_EXPANDED':
      return { ...state, drawerExpanded: action.payload };
    case 'SET_CURRENT_PAGE':
      return { ...state, currentPage: action.payload };
    case 'ADD_ONE_MINUTE':
      return { ...state, totalDuration: state.totalDuration + 60 };
    default:
      return state;
  }
}

function cryptoRandomId(): string {
  // Create a reasonably unique id without external deps
  // Fallback for environments without crypto.getRandomValues
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const g: any = globalThis as any;
    if (g.crypto && g.crypto.getRandomValues) {
      const buf = new Uint8Array(16);
      g.crypto.getRandomValues(buf);
      return Array.from(buf).map((b) => b.toString(16).padStart(2, '0')).join('');
    }
  } catch {}
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

interface GlobalTimerContextValue extends GlobalTimerState {
  startSession: (totalDuration: number, opts?: { startTime?: number; sessionId?: string }) => void;
  resetSession: () => void;
  setCurrentActivity: (activity: Activity | null, opts?: { startTime?: number }) => void;
  completeCurrentActivity: (opts?: { completedAt?: number }) => void;
  startBreak: (opts?: { startTime?: number }) => void;
  endBreak: () => void;
  addOneMinute: () => void;
  setDrawerExpanded: (expanded: boolean) => void;
  setCurrentPage: (page: PageState) => void;
}

const GlobalTimerContext = createContext<GlobalTimerContextValue | undefined>(undefined);

export const GlobalTimerProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  // Synchronous hydration from localStorage using lazy initializer to avoid UI flash
  const [state, dispatch] = useReducer(
    reducer,
    initialState,
    (init): GlobalTimerState => {
      if (typeof window === 'undefined') return init;
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return init;
        const parsed = JSON.parse(raw) as Partial<GlobalTimerState> | null;
        if (parsed && typeof parsed === 'object' && 'totalDuration' in parsed) {
          return { ...init, ...(parsed as GlobalTimerState) };
        }
      } catch (e) {
        console.warn('[GlobalTimer] Failed to hydrate from storage:', (e as Error).message);
      }
      return init;
    }
  );

  // Persist to localStorage on change (client only)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('[GlobalTimer] Failed to persist to storage:', (e as Error).message);
    }
  }, [state]);

  const startSession = useCallback<GlobalTimerContextValue['startSession']>((totalDuration, opts) => {
    dispatch({ type: 'START_SESSION', payload: { totalDuration, startTime: opts?.startTime, sessionId: opts?.sessionId } });
  }, []);

  const resetSession = useCallback(() => {
    dispatch({ type: 'RESET_SESSION' });
  }, []);

  const setCurrentActivity = useCallback<GlobalTimerContextValue['setCurrentActivity']>((activity, opts) => {
    dispatch({ type: 'SET_CURRENT_ACTIVITY', payload: { activity, startTime: opts?.startTime } });
  }, []);

  const completeCurrentActivity = useCallback<GlobalTimerContextValue['completeCurrentActivity']>((opts) => {
    dispatch({ type: 'COMPLETE_CURRENT_ACTIVITY', payload: { completedAt: opts?.completedAt } });
  }, []);

  const startBreak = useCallback<GlobalTimerContextValue['startBreak']>((opts) => {
    dispatch({ type: 'START_BREAK', payload: { startTime: opts?.startTime } });
  }, []);

  const endBreak = useCallback<GlobalTimerContextValue['endBreak']>(() => {
    dispatch({ type: 'END_BREAK' });
  }, []);

  const addOneMinute = useCallback(() => {
    dispatch({ type: 'ADD_ONE_MINUTE' });
  }, []);

  const setDrawerExpanded = useCallback((expanded: boolean) => {
    dispatch({ type: 'SET_DRAWER_EXPANDED', payload: expanded });
  }, []);

  const setCurrentPage = useCallback((page: PageState) => {
    dispatch({ type: 'SET_CURRENT_PAGE', payload: page });
  }, []);

  const value = useMemo<GlobalTimerContextValue>(() => ({
    ...state,
    startSession,
    resetSession,
    setCurrentActivity,
    completeCurrentActivity,
    startBreak,
    endBreak,
    addOneMinute,
    setDrawerExpanded,
    setCurrentPage,
  }), [state, startSession, resetSession, setCurrentActivity, completeCurrentActivity, startBreak, endBreak, addOneMinute, setDrawerExpanded, setCurrentPage]);

  return (
    <GlobalTimerContext.Provider value={value}>
      {children}
    </GlobalTimerContext.Provider>
  );
};

export function useGlobalTimer(): GlobalTimerContextValue {
  const ctx = useContext(GlobalTimerContext);
  if (!ctx) {
    throw new Error('useGlobalTimer must be used within a GlobalTimerProvider');
  }
  return ctx;
}

// Optional accessor for consumers that want to use the context when available
// without forcing a provider in test environments. Returns undefined when no provider
// is present, allowing components to fall back to prop-based behavior.
export function useOptionalGlobalTimer(): GlobalTimerContextValue | undefined {
  return useContext(GlobalTimerContext);
}
