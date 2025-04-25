import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Define Activity type
interface Activity {
  id: string;
  name: string;
  duration: number; // in seconds
  status: 'pending' | 'active' | 'completed';
  startTime?: number; // timestamp
  endTime?: number; // timestamp
}

// Define the state shape
interface AppState {
  duration: number; // total duration in seconds
  timeRemaining: number; // time remaining in seconds
  isRunning: boolean;
  isComplete: boolean;
  activities: Activity[];
  currentActivityId: string | null;
}

// Define action types
type AppAction =
  | { type: 'START' }
  | { type: 'PAUSE' }
  | { type: 'RESET' }
  | { type: 'SET_DURATION', payload: number }
  | { type: 'TICK' }
  | { type: 'ADD_ACTIVITY', payload: Omit<Activity, 'id' | 'status'> }
  | { type: 'START_ACTIVITY', payload: string }
  | { type: 'COMPLETE_ACTIVITY', payload: string }
  | { type: 'REMOVE_ACTIVITY', payload: string }
  | { type: 'COMPLETE_ALL' };

// Initial state
const initialState: AppState = {
  duration: 3600, // 1 hour default
  timeRemaining: 3600,
  isRunning: false,
  isComplete: false,
  activities: [],
  currentActivityId: null
};

// Reducer function
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'START':
      return {
        ...state,
        isRunning: true
      };
    case 'PAUSE':
      return {
        ...state,
        isRunning: false
      };
    case 'RESET':
      return {
        ...initialState,
        duration: state.duration // Keep the current duration setting
      };
    case 'SET_DURATION':
      return {
        ...state,
        duration: action.payload,
        timeRemaining: action.payload
      };
    case 'TICK':
      const newTimeRemaining = Math.max(state.timeRemaining - 1, -3600); // Allow up to 1 hour of overtime
      const isComplete = newTimeRemaining <= 0 && state.activities.every(a => a.status === 'completed');
      
      return {
        ...state,
        timeRemaining: newTimeRemaining,
        isComplete: isComplete
      };
    case 'ADD_ACTIVITY':
      const newActivity: Activity = {
        id: Date.now().toString(),
        status: 'pending',
        ...action.payload
      };
      return {
        ...state,
        activities: [...state.activities, newActivity]
      };
    case 'START_ACTIVITY':
      return {
        ...state,
        activities: state.activities.map(activity =>
          activity.id === action.payload
            ? { ...activity, status: 'active', startTime: Date.now() }
            : activity
        ),
        currentActivityId: action.payload
      };
    case 'COMPLETE_ACTIVITY':
      return {
        ...state,
        activities: state.activities.map(activity =>
          activity.id === action.payload
            ? { ...activity, status: 'completed', endTime: Date.now() }
            : activity
        ),
        currentActivityId: state.currentActivityId === action.payload ? null : state.currentActivityId
      };
    case 'REMOVE_ACTIVITY':
      return {
        ...state,
        activities: state.activities.filter(activity => activity.id !== action.payload),
        currentActivityId: state.currentActivityId === action.payload ? null : state.currentActivityId
      };
    case 'COMPLETE_ALL':
      // Complete current activity and remove pending ones
      return {
        ...state,
        activities: state.activities
          .filter(activity => activity.status !== 'pending' || activity.id === state.currentActivityId)
          .map(activity => 
            activity.id === state.currentActivityId 
              ? { ...activity, status: 'completed', endTime: Date.now() } 
              : activity
          ),
        currentActivityId: null,
        isComplete: true
      };
    default:
      return state;
  }
}

// Create context
interface AppStateContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

// Provider component
interface AppStateProviderProps {
  children: ReactNode;
  initialAppState?: Partial<AppState>;
}

export const AppStateProvider: React.FC<AppStateProviderProps> = ({ 
  children, 
  initialAppState = {}
}) => {
  const [state, dispatch] = useReducer(
    appReducer, 
    { ...initialState, ...initialAppState }
  );

  return (
    <AppStateContext.Provider value={{ state, dispatch }}>
      {children}
    </AppStateContext.Provider>
  );
};

// Hook for consuming the context
export function useAppState(): AppStateContextType {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
}
