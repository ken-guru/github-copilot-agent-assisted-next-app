import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AIPlannerPage from '../../app/ai/page';
import { ToastProvider } from '../../contexts/ToastContext';
import { ApiKeyProvider } from '../../contexts/ApiKeyContext';

// Mock next/navigation useRouter
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

// Mock BYOK client to avoid real network
jest.mock('@/utils/ai/byokClient', () => ({
  useOpenAIClient: () => ({ callOpenAI: jest.fn().mockResolvedValue({
    id: 'mock',
    object: 'chat.completion',
    created: Date.now() / 1000,
    model: 'gpt-4o-mini',
    choices: [
      { index: 0, finish_reason: 'stop', message: { role: 'assistant', content: JSON.stringify({ activities: [] }) } },
    ],
  }) }),
}));

function renderWithProviders(node: React.ReactElement) {
  return render(
    <ToastProvider>
      <ApiKeyProvider>{node}</ApiKeyProvider>
    </ToastProvider>
  );
}

describe('AI Planner prompt persistence', () => {
  const STORAGE_KEY = 'ai_planner_last_prompt';

  beforeEach(() => {
    window.localStorage.clear();
    // Ensure API key exists so planner page renders planner form
    window.sessionStorage.setItem('openai_api_key', 'sk-test');
  });

  it('loads previous prompt from localStorage on revisit', async () => {
    const previous = 'Custom previous prompt about a 45-minute writing session with 5-minute break.';
    window.localStorage.setItem(STORAGE_KEY, previous);

    renderWithProviders(<AIPlannerPage />);

    // Wait for client-ready effect
    const textarea = await screen.findByLabelText('Describe your session');
    expect(textarea).toHaveValue(previous);
  });

  it('stores the prompt to localStorage on submit', async () => {
    renderWithProviders(<AIPlannerPage />);
    const textarea = await screen.findByLabelText('Describe your session');

    const newPrompt = 'Plan a focused 25-minute Pomodoro on algorithms with a 5-minute stretch.';
    fireEvent.change(textarea, { target: { value: newPrompt } });

  const submit = screen.getByRole('button', { name: /generate ai plan/i });
    fireEvent.click(submit);

    await waitFor(() => {
      expect(window.localStorage.getItem(STORAGE_KEY)).toBe(newPrompt);
    });
  });
});
