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

  // SECURITY: API keys are NEVER persisted to storage to prevent XSS attacks
  // Only memory-based storage is supported for maximum security
  useEffect(() => {
    // Intentionally do not load from any persistent storage
    // API keys must be re-entered each session for security
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const setApiKey = (key: string, _persist: Persistence = 'memory') => {
    const trimmedKey = key.trim();
    
    // Basic validation for OpenAI API key format
    if (!trimmedKey.startsWith('sk-')) {
      throw new Error('Invalid API key format. OpenAI API keys should start with "sk-".');
    }
    if (trimmedKey.length < 40) {
      throw new Error('Invalid API key length. OpenAI API keys should be around 51 characters long.');
    }
    
    setApiKeyState(trimmedKey);
    // SECURITY: Force memory-only persistence regardless of user preference
    setPersistence('memory');
    
    // SECURITY: Ensure no API key is ever stored in any browser storage
    try {
      window.sessionStorage.removeItem('openai_api_key');
      window.localStorage.removeItem('openai_api_key');
    } catch {
      // ignore storage errors
    }
  };

  const clearApiKey = () => {
    setApiKeyState(null);
    try {
      // SECURITY: Clear from all possible storage locations
      window.sessionStorage.removeItem('openai_api_key');
      window.localStorage.removeItem('openai_api_key');
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
