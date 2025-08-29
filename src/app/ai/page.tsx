'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/contexts/ToastContext';
import { useApiKey } from '@/contexts/ApiKeyContext';
import { useOpenAIClient } from '@/utils/ai/byokClient';
import type { ChatCompletion } from '@/types/ai';
import { MAX_AI_ACTIVITIES } from '@/types/ai';
import useNetworkStatus from '@/hooks/useNetworkStatus';
// Import Material 3 components instead of react-bootstrap
import Material3Button from '@/design-system/components/Button';
import Material3Card from '@/design-system/components/Card';
import Material3Input from '@/design-system/components/Input';

export default function AIPlannerPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [ready, setReady] = useState(false);
  const [prompt, setPrompt] = useState('I want a 30-minute study sprint on React and JavaScript, plus a 10-minute break.');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // BYOK inline setup
  const [keyInput, setKeyInput] = useState('');
  const { apiKey, setApiKey, clearApiKey } = useApiKey();
  const { callOpenAI } = useOpenAIClient();
  const PROMPT_STORAGE_KEY = 'ai_planner_last_prompt';
  const { online } = useNetworkStatus();

  useEffect(() => {
    // Hydration guard for client-only rendering
    setReady(true);
  }, []);

  // Load last used prompt from localStorage once client is ready
  useEffect(() => {
    if (!ready) return;
    try {
      const saved = window.localStorage.getItem(PROMPT_STORAGE_KEY);
      if (typeof saved === 'string' && saved.trim()) {
        setPrompt(saved);
      }
    } catch {
      // ignore storage access issues
    }
  }, [ready]);

  const pickActivityName = (a: { title?: unknown; name?: unknown }, idx: number) => {
    if (typeof a.title === 'string' && a.title.trim()) return a.title;
    if (typeof a.name === 'string' && a.name.trim()) return a.name;
    return `Activity ${idx + 1}`;
  };

  const handlePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      // Persist the latest prompt immediately upon submit
      try {
        window.localStorage.setItem(PROMPT_STORAGE_KEY, prompt);
      } catch {
        // ignore storage errors
      }
      // BYOK-only: this page requires a user-provided OpenAI API key; no server fallback exists here
  if (!apiKey) {
        throw new Error('Please enter and save your OpenAI API key first.');
      }
      let data: unknown;
      {
        // Client-direct call to OpenAI with BYOK
        // Minimal example: responses API, text generation with JSON instruction
        const payload = {
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'You are planning study/work sessions.' },
            { role: 'user', content: `${prompt}\n\nReturn strict JSON: {"activities": [{"title": string, "description": string, "duration": number}]}` }
          ],
          response_format: { type: 'json_object' }
        };
        data = await callOpenAI('/v1/chat/completions', payload);
        // Extract JSON from choices
  const cc = (data as Partial<ChatCompletion>) ?? {};
  const firstChoice = (Array.isArray(cc.choices) && cc.choices.length > 0) ? cc.choices[0] : undefined;
  const content = firstChoice?.message?.content ? String(firstChoice.message.content) : '';
        try {
          data = JSON.parse(content);
        } catch {
          throw new Error('Malformed AI response');
        }
      }
      type LoosePlanActivity = {
        title?: unknown;
        name?: unknown;
        description?: unknown;
        duration?: unknown;
      };
      type PlanResponse = { activities: unknown };
      const acts = ((): LoosePlanActivity[] => {
        if (typeof data === 'object' && data && 'activities' in (data as PlanResponse)) {
          const a = (data as PlanResponse).activities;
          return Array.isArray(a) ? (a as unknown[] as LoosePlanActivity[]) : [];
        }
        return [];
      })();
      // Overwrite activities local storage as requested by issue
      if (Array.isArray(acts)) {
        // Map to app's Activity shape
        const now = new Date().toISOString();
        const planned = acts.slice(0, MAX_AI_ACTIVITIES).map((a: LoosePlanActivity, idx: number) => ({
          id: crypto.randomUUID(),
          name: String(pickActivityName(a, idx)),
          description: typeof a.description === 'string' ? a.description : undefined,
          colorIndex: idx % 8,
          createdAt: now,
          isActive: true
        }));
        try {
          localStorage.setItem('activities_v1', JSON.stringify(planned));
          addToast({ message: 'Activities replaced by AI plan', variant: 'success' });
          router.push('/');
        } catch {
          throw new Error('Unable to save activities locally');
        }
      } else {
        throw new Error('Malformed response from AI');
      }
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Unknown error';
      setError(message);
      addToast({ message: message || 'AI planning failed', variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (!ready) return null;

  // State 1: Supply a key (BYOK). No additional enablement required.
  // BYOK-only page: server never receives this key and no server AI calls are made here.
  if (!apiKey) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Material3Card>
          <div className="p-6">
            <h5 className="mb-0 flex items-center text-lg font-medium">
              <i className="bi bi-key mr-2" aria-hidden="true" />
              AI Session Planner — Bring Your Own Key
            </h5>
          </div>
          <div className="p-6 pt-0">
            <Material3Card className="mb-6">
              <div className="p-6">
                <div className="mb-4 p-4 border border-amber-200 bg-amber-50 rounded-lg dark:border-amber-800 dark:bg-amber-950">
                  <h6 className="mb-2 font-medium flex items-center">
                    <i className="bi bi-shield-exclamation mr-2" aria-hidden="true" />
                    Security Notice
                  </h6>
                  <ul className="mb-0 text-sm list-disc list-inside space-y-1">
                    <li>Your API key is stored only in memory and will be lost when you close this tab</li>
                    <li>Do not use this feature on shared computers or untrusted networks</li>
                    <li>Your API key and prompts are sent directly to OpenAI - not through our servers</li>
                    <li>Ensure your OpenAI account has appropriate usage limits configured</li>
                  </ul>
                </div>
                <label htmlFor="byokKey" className="block text-sm font-medium mb-2">
                  Enter your OpenAI API key (client-only)
                </label>
                <div className="flex gap-2 mb-2">
                  <Material3Input
                    id="byokKey"
                    type="password"
                    placeholder="sk-..."
                    value={keyInput}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setKeyInput(e.target.value)}
                    className="flex-1"
                  />
                  <Material3Button
                    variant="filled"
                    onClick={() => {
                      const trimmed = keyInput.trim();
                      if (!trimmed) return;
                      setApiKey(trimmed, 'memory');
                      setKeyInput(''); // don't keep in input after saving
                      addToast({ message: 'API key saved (memory only)', variant: 'success' });
                    }}
                  >
                    Save
                  </Material3Button>
                </div>
                <p className="text-sm text-on-surface-variant">
                  Stored only in memory (RAM). Never sent to the server or logged.
                </p>
              </div>
            </Material3Card>
            <div className="flex gap-2">
              <Material3Button
                variant="outlined"
                onClick={() => router.push('/')}
              >
                Go Home
              </Material3Button>
            </div>
          </div>
        </Material3Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Material3Card>
        <div className="p-6">
          <h5 className="mb-0 flex items-center text-lg font-medium">
            <i className="bi bi-stars mr-2" aria-hidden="true" />
            AI Session Planner
          </h5>
        </div>
        <div className="p-6 pt-0">
          {/* Show prominent offline warning when not connected */}
          {!online && (
            <div className="mb-6 p-4 border border-amber-200 bg-amber-50 rounded-lg dark:border-amber-800 dark:bg-amber-950" role="alert" data-testid="ai-offline-warning">
              AI planning requires a network connection — you are currently offline. Reconnect to use this feature.
            </div>
          )}
          <form onSubmit={handlePlan} aria-label="AI planning form">
            <div className="mb-6">
              <label htmlFor="aiPrompt" className="block text-sm font-medium mb-2">
                Describe your session
              </label>
              <textarea
                id="aiPrompt"
                rows={4}
                value={prompt}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setPrompt(e.target.value)}
                placeholder="e.g., 30-minute study sprint on React and JavaScript, plus a 10-minute break"
                className="w-full px-4 py-3 border border-outline rounded-lg bg-surface text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors resize-none"
              />
              <p className="mt-2 text-sm text-on-surface-variant">
                One request per plan to conserve tokens.
              </p>
            </div>
            <div className="mb-6 p-4 border border-blue-200 bg-blue-50 rounded-lg dark:border-blue-800 dark:bg-blue-950">
              Mode: Client-only (BYOK). Your key stays on this device.
            </div>
            {error && (
              <div className="mb-6 p-4 border border-red-200 bg-red-50 rounded-lg dark:border-red-800 dark:bg-red-950" role="alert">
                {error}
              </div>
            )}
            <div className="flex gap-2">
              <Material3Button
                type="submit"
                variant="filled"
                disabled={loading || !online}
                title={!online ? 'You are offline. Reconnect to plan with AI.' : 'Generate AI plan'}
                aria-label="Generate AI plan"
              >
                {loading ? (
                  <>
                    <div className="mr-2 w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Planning…
                  </>
                ) : (
                  'Plan with AI'
                )}
              </Material3Button>
              <Material3Button
                type="button"
                variant="outlined"
                color="error"
                onClick={() => {
                  clearApiKey();
                  addToast({ message: 'API key cleared', variant: 'success' });
                }}
              >
                Clear key
              </Material3Button>
              <Material3Button
                type="button"
                variant="outlined"
                onClick={() => router.push('/')}
              >
                Cancel
              </Material3Button>
            </div>
          </form>
        </div>
      </Material3Card>
    </div>
  );
}
