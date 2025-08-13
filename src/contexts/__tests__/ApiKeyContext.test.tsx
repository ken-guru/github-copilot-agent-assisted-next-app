import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { ApiKeyProvider, useApiKey } from '../ApiKeyContext';

function wrapper({ children }: { children: React.ReactNode }) {
  return <ApiKeyProvider>{children}</ApiKeyProvider>;
}

describe('ApiKeyContext', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  it('defaults to null key and memory persistence', () => {
    const { result } = renderHook(() => useApiKey(), { wrapper });
    expect(result.current.apiKey).toBeNull();
    expect(result.current.persistence).toBe('memory');
  });

  it('sets key in memory by default and does not write to sessionStorage', () => {
    const { result } = renderHook(() => useApiKey(), { wrapper });
    act(() => result.current.setApiKey('sk-test'));
    expect(result.current.apiKey).toBe('sk-test');
    expect(window.sessionStorage.getItem('openai_api_key')).toBeNull();
  });

  it('forces memory-only storage for security even when session requested', () => {
    const { result } = renderHook(() => useApiKey(), { wrapper });
    act(() => result.current.setApiKey('sk-session', 'session'));
    expect(result.current.apiKey).toBe('sk-session');
    expect(result.current.persistence).toBe('memory'); // SECURITY: Always memory-only
    expect(window.sessionStorage.getItem('openai_api_key')).toBeNull(); // Never stored
  });

  it('clears key and sessionStorage on clear', () => {
    const { result } = renderHook(() => useApiKey(), { wrapper });
    act(() => result.current.setApiKey('sk-session', 'session'));
    act(() => result.current.clearApiKey());
    expect(result.current.apiKey).toBeNull();
    expect(result.current.persistence).toBe('memory');
    expect(window.sessionStorage.getItem('openai_api_key')).toBeNull();
  });
});
