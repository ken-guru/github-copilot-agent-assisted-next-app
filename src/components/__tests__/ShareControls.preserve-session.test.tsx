import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ShareControls from '../ShareControls';
import { SESSION_STORAGE_KEY } from '../../utils/session-storage';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Ensure localStorage is available and controllable
beforeEach(() => {
  // Setup a session snapshot to simulate an in-progress session
  const snapshot = {
    timeSet: true,
    totalDuration: 1800,
    timerActive: true,
    currentActivityId: 'a1',
    timelineEntries: [
      { id: 't1', activityId: 'a1', activityName: 'Reading', startTime: 0, endTime: null },
    ],
  };
  window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(snapshot));
});

afterEach(() => {
  window.localStorage.removeItem(SESSION_STORAGE_KEY);
  jest.resetAllMocks();
});

describe('ShareControls replace preserves session_v1', () => {
  it('does not clear session snapshot on replace', async () => {
    const shareUrl = 'https://example.com/shared/keep-123';
    // Mock fetch to return a minimal valid shared session
    const sample = {
      sessionData: {
        activities: [
          { id: 'a2', name: 'Homework', colorIndex: 0 },
        ],
        skippedActivities: [],
      },
      metadata: { id: 'keep-123' },
    };
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => sample } as unknown as Response);

    render(<ShareControls shareUrl={shareUrl} />);

    // Trigger replace flow
    const replaceBtn = screen.getByRole('button', { name: /replace my activities/i });
    fireEvent.click(replaceBtn);
    const confirmButton = await screen.findByRole('button', { name: /confirm/i });
    fireEvent.click(confirmButton);

    await waitFor(() => expect(global.fetch).toHaveBeenCalled());

    // Verify session snapshot still exists
    const persisted = window.localStorage.getItem(SESSION_STORAGE_KEY);
    expect(persisted).toBeTruthy();
    const parsed = persisted ? JSON.parse(persisted) : null;
    expect(parsed?.timeSet).toBe(true);
  });
});
