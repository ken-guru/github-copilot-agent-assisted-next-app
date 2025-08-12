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
    const res = await fetch(`https://api.openai.com${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
      ...init,
    });
    if (!res.ok) {
      // Avoid echoing secrets
      const text = await res.text().catch(() => '');
  throw new Error(`OpenAI request failed (${res.status})${text ? `: ${text}` : ''}`);
    }
    return res.json();
  }, [apiKey]);

  return { callOpenAI } as const;
}
