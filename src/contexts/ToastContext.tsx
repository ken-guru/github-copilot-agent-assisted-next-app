import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { ToastMessage, ToastContextType } from '@/types/toast';

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastState {
  toasts: ToastMessage[];
}

type ToastAction =
  | { type: 'ADD_TOAST'; payload: ToastMessage }
  | { type: 'REMOVE_TOAST'; payload: string }
  | { type: 'CLEAR_ALL_TOASTS' };

function toastReducer(state: ToastState, action: ToastAction): ToastState {
  switch (action.type) {
    case 'ADD_TOAST':
      return {
        ...state,
        toasts: [...state.toasts, action.payload],
      };
    case 'REMOVE_TOAST':
      return {
        ...state,
        toasts: state.toasts.filter(toast => toast.id !== action.payload),
      };
    case 'CLEAR_ALL_TOASTS':
      return {
        ...state,
        toasts: [],
      };
    default:
      return state;
  }
}

interface ToastProviderProps {
  children: React.ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps): React.ReactElement {
  const [state, dispatch] = useReducer(toastReducer, { toasts: [] });

  const addToast = useCallback((toastData: Omit<ToastMessage, 'id'>): string => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const toast: ToastMessage = {
      id,
      autoDismiss: true,
      duration: 5000, // Default 5 seconds
      ...toastData,
    };

    // Override autoDismiss if persistent is true
    if (toast.persistent) {
      toast.autoDismiss = false;
    }

    dispatch({ type: 'ADD_TOAST', payload: toast });
    return id;
  }, []);

  const removeToast = useCallback((id: string): void => {
    dispatch({ type: 'REMOVE_TOAST', payload: id });
  }, []);

  const clearAllToasts = useCallback((): void => {
    dispatch({ type: 'CLEAR_ALL_TOASTS' });
  }, []);

  const value: ToastContextType = {
    toasts: state.toasts,
    addToast,
    removeToast,
    clearAllToasts,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextType {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
