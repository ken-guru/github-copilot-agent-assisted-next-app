'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, Form, Spinner, Alert } from 'react-bootstrap';
import { useToast } from '@/contexts/ToastContext';
import { isAuthenticatedClient } from '@/utils/auth/client';

export default function AIPlannerPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [ready, setReady] = useState(false);
  const [prompt, setPrompt] = useState('I want a 30-minute study sprint on React and JavaScript, plus a 10-minute break.');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Determine auth after hydration to avoid SSR false negatives
  const [isAuthed, setIsAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    // Evaluate cookie on client only
    setIsAuthed(isAuthenticatedClient());
  }, []);

  useEffect(() => {
    if (isAuthed === null) return; // wait for hydration check
    if (!isAuthed) {
      // Redirect unauthenticated users to home for now (placeholder for login flow)
      router.replace('/');
    } else {
      setReady(true);
    }
  }, [isAuthed, router]);

  const handlePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/ai/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as unknown;
        const message = (typeof data === 'object' && data && 'error' in data && typeof (data as { error?: unknown }).error === 'string')
          ? (data as { error: string }).error
          : 'Failed to generate plan';
        throw new Error(message);
      }
      const data = (await res.json()) as unknown;
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
        const planned = acts.slice(0, 20).map((a: LoosePlanActivity, idx: number) => ({
          id: crypto.randomUUID(),
          name: String((typeof a.title === 'string' ? a.title : (typeof a.name === 'string' ? a.name : `Activity ${idx + 1}`))),
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
            {error && (
              <Alert variant="danger" role="alert">{error}</Alert>
            )}
            <div className="d-flex gap-2">
              <Button type="submit" variant="primary" disabled={loading} aria-label="Generate AI plan">
                {loading ? (<><Spinner size="sm" className="me-2" animation="border" />Planning…</>) : 'Plan with AI'}
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
