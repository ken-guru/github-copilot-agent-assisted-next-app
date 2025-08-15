// Client-only OpenAI fetch helper using user BYOK from ApiKeyContext
'use client';

import { useCallback } from 'react';
import { useApiKey } from '@/contexts/ApiKeyContext';

export function useOpenAIClient() {
  const { apiKey } = useApiKey();

  const callOpenAI = useCallback(async (path: string, body: unknown, init?: RequestInit) => {
    if (!apiKey) {
      throw new Error('No API key set');
    }
    
    // Validate API key format
    const trimmedKey = apiKey.trim();
    if (!trimmedKey.startsWith('sk-')) {
      throw new Error('Invalid API key format. OpenAI API keys should start with "sk-".');
    }
    if (trimmedKey.length < 40) {
      throw new Error('Invalid API key length. OpenAI API keys are typically 51 characters long.');
    }
    
    // Debug logging (mask key for security)
    console.debug('Making OpenAI API call with key:', `${trimmedKey.substring(0, 7)}...${trimmedKey.substring(trimmedKey.length - 4)}`);
    
    let res: Response;
    try {
      res = await fetch(`https://api.openai.com${path}`, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-store',
        credentials: 'omit',
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${trimmedKey}`,
        },
        body: JSON.stringify(body),
        ...init,
      });
    } catch (err: unknown) {
      if (err instanceof TypeError) {
        throw new Error('Network error: could not reach OpenAI (blocked or connection closed). Check ad blockers, VPN, or firewall.');
      }
      const msg = err && typeof err === 'object' && 'message' in err ? String((err as { message?: unknown }).message) : 'Unknown network error';
      throw new Error(msg);
    }
    if (!res.ok) {
      // Avoid echoing any server-provided text to the UI/logs
      // Provide user-friendly, status-specific messages where safe
      let message = `OpenAI request failed (${res.status})`;
      switch (res.status) {
        case 400:
          message = 'OpenAI rejected the request (400). Please adjust your input.';
          break;
        case 401:
          message = 'Invalid or missing OpenAI API key (401). Check your key.';
          break;
        case 403:
          message = 'Access to the requested OpenAI resource is forbidden (403).';
          break;
        case 429:
          message = 'Rate limit exceeded (429). Please wait and try again.';
          break;
        default:
          // keep default generic message
          break;
      }
      throw new Error(message);
    }
    return res.json();
  }, [apiKey]);

  return { callOpenAI } as const;
}
