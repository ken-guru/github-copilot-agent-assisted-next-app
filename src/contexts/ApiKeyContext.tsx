'use client';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type Persistence = 'memory' | 'session';

interface ApiKeyContextValue {
  apiKey: string | null;
  setApiKey: (key: string, persistence?: Persistence) => void;
  clearApiKey: () => void;
  persistence: Persistence;
}

// Provide a safe default so tests without provider won’t crash
const defaultValue: ApiKeyContextValue = {
  apiKey: null,
  persistence: 'memory',
  setApiKey: () => {},
  clearApiKey: () => {},
};

const ApiKeyContext = createContext<ApiKeyContextValue>(defaultValue);

interface ApiKeyProviderProps {
  children: React.ReactNode;
}

export function ApiKeyProvider({ children }: ApiKeyProviderProps) {
  const [apiKey, setApiKeyState] = useState<string | null>(null);
  const [persistence, setPersistence] = useState<Persistence>('memory');

  // Load from sessionStorage if present (explicit opt-in on prior session)
  useEffect(() => {
    try {
      const stored = typeof window !== 'undefined' ? window.sessionStorage.getItem('openai_api_key') : null;
      if (stored) {
        setApiKeyState(stored);
        setPersistence('session');
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  const setApiKey = (key: string, persist: Persistence = 'memory') => {
    setApiKeyState(key);
    setPersistence(persist);
    if (persist === 'session') {
      try {
        window.sessionStorage.setItem('openai_api_key', key);
      } catch {
        // ignore
      }
    } else {
      try {
        window.sessionStorage.removeItem('openai_api_key');
      } catch {
        // ignore
      }
    }
  };

  const clearApiKey = () => {
    setApiKeyState(null);
    try {
      window.sessionStorage.removeItem('openai_api_key');
    } catch {
      // ignore
    }
    setPersistence('memory');
  };

  const value = useMemo<ApiKeyContextValue>(() => ({ apiKey, setApiKey, clearApiKey, persistence }), [apiKey, persistence]);

  return (
    <ApiKeyContext.Provider value={value}>{children}</ApiKeyContext.Provider>
  );
}

export function useApiKey() {
  const ctx = useContext(ApiKeyContext);
  return ctx;
}
