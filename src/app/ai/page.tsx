'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, Form, Spinner, Alert, InputGroup } from 'react-bootstrap';
import { useToast } from '@/contexts/ToastContext';
import { useApiKey } from '@/contexts/ApiKeyContext';
import { useOpenAIClient } from '@/utils/ai/byokClient';
import type { ChatCompletion } from '@/types/ai';
import { MAX_AI_ACTIVITIES } from '@/types/ai';
import useNetworkStatus from '@/hooks/useNetworkStatus';
import { AVAILABLE_MODELS, DEFAULT_MODEL_ID, getModelById } from '@/constants/openai-models';

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
  // Model selection state
  const [selectedModelId, setSelectedModelId] = useState<string>(DEFAULT_MODEL_ID);

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

  // Load model selection from localStorage once client is ready
  useEffect(() => {
    if (!ready) return;
    try {
      const saved = window.localStorage.getItem('selected_ai_model');
      if (saved && AVAILABLE_MODELS.some(m => m.id === saved)) {
        setSelectedModelId(saved);
      }
    } catch {
      // ignore storage access issues, use default
    }
  }, [ready]);

  // Handle model selection change
  const handleModelChange = (modelId: string) => {
    setSelectedModelId(modelId);
    try {
      window.localStorage.setItem('selected_ai_model', modelId);
    } catch {
      // ignore storage errors
    }
  };

  const pickActivityName = (a: { title?: unknown; name?: unknown }, idx: number) => {
    if (typeof a.title === 'string' && a.title.trim()) return a.title;
    if (typeof a.name === 'string' && a.name.trim()) return a.name;
    return `Activity ${idx + 1}`;
  };

  /**
   * Calculate the cost of an API request based on token usage and model pricing
   * @param promptTokens - Number of input tokens used
   * @param completionTokens - Number of output tokens generated
   * @param modelId - The ID of the model used
   * @returns The calculated cost in USD, or 0 if model not found
   */
  const calculateCost = (
    promptTokens: number,
    completionTokens: number,
    modelId: string
  ): number => {
    const model = getModelById(modelId);
    if (!model) return 0;
    
    const inputCost = (promptTokens / 1000) * model.costPer1kTokens.input;
    const outputCost = (completionTokens / 1000) * model.costPer1kTokens.output;
    
    return inputCost + outputCost;
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
          model: selectedModelId,
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
      <div className="container py-3">
        <Card>
          <Card.Header>
            <h5 className="mb-0 d-flex align-items-center">
              <i className="bi bi-key me-2" aria-hidden="true" />
              AI Session Planner — Bring Your Own Key
            </h5>
          </Card.Header>
          <Card.Body>
            <Card className="mb-3">
              <Card.Body>
                <Alert variant="warning" className="mb-3">
                  <Alert.Heading className="h6 mb-2">
                    <i className="bi bi-shield-exclamation me-2" aria-hidden="true" />
                    Security Notice
                  </Alert.Heading>
                  <ul className="mb-0 small">
                    <li>Your API key is stored only in memory and will be lost when you close this tab</li>
                    <li>Do not use this feature on shared computers or untrusted networks</li>
                    <li>Your API key and prompts are sent directly to OpenAI - not through our servers</li>
                    <li>Ensure your OpenAI account has appropriate usage limits configured</li>
                  </ul>
                </Alert>
                <Form.Label htmlFor="byokKey">Enter your OpenAI API key (client-only)</Form.Label>
                <InputGroup className="mb-2">
                  <Form.Control
                    id="byokKey"
                    type="password"
                    placeholder="sk-..."
                    value={keyInput}
                    onChange={(e) => setKeyInput(e.target.value)}
                  />
                  <Button
                    variant="primary"
                    onClick={() => {
                      const trimmed = keyInput.trim();
                      if (!trimmed) return;
                      setApiKey(trimmed, 'memory');
                      setKeyInput(''); // don't keep in input after saving
                      addToast({ message: 'API key saved (memory only)', variant: 'success' });
                    }}
                  >Save</Button>
                </InputGroup>
                <Form.Text className="text-body-secondary">Stored only in memory (RAM). Never sent to the server or logged.</Form.Text>
              </Card.Body>
            </Card>
            <div className="d-flex gap-2">
              <Button type="button" variant="outline-secondary" onClick={() => router.push('/') }>
                Go Home
              </Button>
            </div>
          </Card.Body>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-3">
      <Card>
        <Card.Header>
          <h5 className="mb-0 d-flex align-items-center">
            <i className="bi bi-stars me-2" aria-hidden="true" />
            AI Session Planner
          </h5>
        </Card.Header>
        <Card.Body>
          {/* Show prominent offline warning when not connected */}
          {!online && (
            <Alert variant="warning" role="alert" data-testid="ai-offline-warning" className="mb-3">
              AI planning requires a network connection — you are currently offline. Reconnect to use this feature.
            </Alert>
          )}
          <Form onSubmit={handlePlan} aria-label="AI planning form">
            <Form.Group className="mb-3">
              <Form.Label htmlFor="aiPrompt">Describe your session</Form.Label>
              <Form.Control
                id="aiPrompt"
                as="textarea"
                rows={4}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., 30-minute study sprint on React and JavaScript, plus a 10-minute break"
              />
              <Form.Text className="text-body-secondary">One request per plan to conserve tokens.</Form.Text>
            </Form.Group>
            <Alert variant="info" className="mb-3">
              Mode: Client-only (BYOK). Your key stays on this device.
            </Alert>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="modelSelect">AI Model</Form.Label>
              <Form.Select
                id="modelSelect"
                value={selectedModelId}
                onChange={(e) => handleModelChange(e.target.value)}
                aria-label="Select AI model"
              >
                {AVAILABLE_MODELS.map(model => (
                  <option key={model.id} value={model.id}>
                    {model.name} - ${model.costPer1kTokens.input}/1K tokens - {model.description}
                  </option>
                ))}
              </Form.Select>
              <Form.Text className="text-body-secondary">
                Context: {(() => {
                  const currentModel = getModelById(selectedModelId);
                  if (currentModel) {
                    return currentModel.contextWindow.toLocaleString();
                  }
                  // Fallback to first model if selected model not found
                  return AVAILABLE_MODELS[0]?.contextWindow.toLocaleString() || '128000';
                })()} tokens
              </Form.Text>
            </Form.Group>
            {error && (
              <Alert variant="danger" role="alert">{error}</Alert>
            )}
            <div className="d-flex gap-2">
              <Button
                type="submit"
                variant="primary"
                disabled={loading || !online}
                aria-disabled={loading || !online}
                title={!online ? 'You are offline. Reconnect to plan with AI.' : 'Generate AI plan'}
                aria-label="Generate AI plan"
              >
                {loading ? (<><Spinner size="sm" className="me-2" animation="border" />Planning…</>) : 'Plan with AI'}
              </Button>
              <Button type="button" variant="outline-danger" onClick={() => { clearApiKey(); addToast({ message: 'API key cleared', variant: 'success' }); }}>
                Clear key
              </Button>
              <Button type="button" variant="outline-secondary" onClick={() => router.push('/') }>
                Cancel
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}
