import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { ApiKeyProvider, useApiKey } from '../ApiKeyContext';

function wrapper({ children }: { children: React.ReactNode }) {
  return <ApiKeyProvider>{children}</ApiKeyProvider>;
}

describe('ApiKeyContext', () => {
  const validTestKey = 'sk-1234567890abcdef1234567890abcdef1234567890abcdef123';
  const validSessionKey = 'sk-session1234567890abcdef1234567890abcdef123456789';
  
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
    act(() => result.current.setApiKey(validTestKey));
    expect(result.current.apiKey).toBe(validTestKey);
    expect(window.sessionStorage.getItem('openai_api_key')).toBeNull();
  });

  it('forces memory-only storage for security even when session requested', () => {
    const { result } = renderHook(() => useApiKey(), { wrapper });
    act(() => result.current.setApiKey(validSessionKey, 'session'));
    expect(result.current.apiKey).toBe(validSessionKey);
    expect(result.current.persistence).toBe('memory'); // SECURITY: Always memory-only
    expect(window.sessionStorage.getItem('openai_api_key')).toBeNull(); // Never stored
  });

  it('clears key and sessionStorage on clear', () => {
    const { result } = renderHook(() => useApiKey(), { wrapper });
    act(() => result.current.setApiKey(validSessionKey, 'session'));
    act(() => result.current.clearApiKey());
    expect(result.current.apiKey).toBeNull();
    expect(result.current.persistence).toBe('memory');
    expect(window.sessionStorage.getItem('openai_api_key')).toBeNull();
  });

  it('validates API key format and rejects invalid keys', () => {
    const { result } = renderHook(() => useApiKey(), { wrapper });
    
    // Test invalid prefix
    expect(() => {
      act(() => result.current.setApiKey('invalid-key-1234567890abcdef1234567890abcdef'));
    }).toThrow('Invalid API key format');
    
    // Test too short
    expect(() => {
      act(() => result.current.setApiKey('sk-short'));
    }).toThrow('Invalid API key length');
    
    // Key should remain null after failed validation
    expect(result.current.apiKey).toBeNull();
  });

  it('trims whitespace from API keys', () => {
    const { result } = renderHook(() => useApiKey(), { wrapper });
    const keyWithWhitespace = `  ${validTestKey}  `;
    act(() => result.current.setApiKey(keyWithWhitespace));
    expect(result.current.apiKey).toBe(validTestKey);
  });
});
