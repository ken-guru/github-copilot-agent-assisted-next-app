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
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify(body),
        ...init,
      });
  } catch {
      throw new Error('Network error: could not reach OpenAI (blocked or connection closed). Check ad blockers, VPN, or firewall.');
    }
    if (!res.ok) {
      // Avoid echoing any server-provided text to the UI/logs
      let text = '';
      try { text = await res.text(); } catch {}
      throw new Error(`OpenAI request failed (${res.status})${text ? `: ${text}` : ''}`);
    }
    return res.json();
  }, [apiKey]);

  return { callOpenAI } as const;
}
