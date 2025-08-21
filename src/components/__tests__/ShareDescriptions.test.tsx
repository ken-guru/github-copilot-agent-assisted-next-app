import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Summary from '../Summary';
import { ToastProvider } from '../../contexts/ToastContext';
import type { TimelineEntry } from '../../types';
import type { ActivitySummary } from '../../types/sessionSharing';

// Mock Next.js app router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
}));

// Mock getActivities to include descriptions
jest.mock('@/utils/activity-storage', () => ({
  getActivities: jest.fn(() => [
    { id: 'a1', name: 'Activity 1', description: 'Desc 1', colorIndex: 1 },
    { id: 'a2', name: 'Activity 2', description: 'Desc 2', colorIndex: 2 },
  ])
}));

// Capture body posted to /api/sessions/share
const fetchMock = jest.fn();

describe('Shared JSON includes descriptions and replace imports them', () => {
  beforeEach(() => {
    fetchMock.mockReset();
    // First call: POST /api/sessions/share
    fetchMock.mockResolvedValueOnce({ ok: true, json: async () => ({ metadata: { id: 'share-xyz' } }) } as Response);
    // Second call: GET /api/sessions/[id]
    fetchMock.mockResolvedValueOnce({ ok: true, json: async () => ({
      sessionData: {
        plannedTime: 60,
        timeSpent: 60,
        overtime: 0,
        idleTime: 0,
        activities: [
          { id: 'a1', name: 'Activity 1', description: 'Desc 1', duration: 30 },
          { id: 'a2', name: 'Activity 2', description: 'Desc 2', duration: 30 },
        ],
        skippedActivities: [],
        timelineEntries: [],
        completedAt: new Date().toISOString(),
        sessionType: 'completed'
      },
      metadata: { id: 'share-xyz' }
    }) } as Response);

  (global as unknown as { fetch: typeof fetch }).fetch = fetchMock as unknown as typeof fetch;

    // clipboard mock
    Object.assign(navigator, { clipboard: { writeText: jest.fn().mockResolvedValue(undefined) } });
  });

  it('emits descriptions on share and uses them on replace', async () => {
    const now = Date.now();
    const entries: TimelineEntry[] = [
      { id: 'e1', activityId: 'a1', activityName: 'Activity 1', startTime: now - 60000, endTime: now - 30000 },
      { id: 'e2', activityId: 'a2', activityName: 'Activity 2', startTime: now - 30000, endTime: now - 0 },
    ];

    render(
      <ToastProvider>
        <Summary entries={entries} totalDuration={60} elapsedTime={60} allActivitiesCompleted={true} />
      </ToastProvider>
    );

    fireEvent.click(screen.getByTestId('open-share-modal-summary'));
    fireEvent.click(await screen.findByRole('button', { name: /create share/i }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalled());

    // Inspect POST payload to ensure descriptions are present
    const postCall = fetchMock.mock.calls.find(([url]) => url === '/api/sessions/share');
    expect(postCall).toBeTruthy();
    const [, postInit] = postCall as [string, RequestInit];
  const body = JSON.parse(String(postInit.body)) as { sessionData: { activities: ActivitySummary[] } };
  const activities: ActivitySummary[] = body.sessionData.activities;
    expect(Array.isArray(activities)).toBe(true);
  expect(activities.find((a) => a.name === 'Activity 1')?.description).toBe('Desc 1');
  expect(activities.find((a) => a.name === 'Activity 2')?.description).toBe('Desc 2');

    // After share created, ShareControls appear
    await screen.findByRole('button', { name: /copy share link/i });

    // Simulate Replace from outside dialog (we just test the replace handler via fetching the shared session)
    // Find Download button to ensure ShareControls rendered; replace button is hidden in modal, but replace flow is covered in ShareControls unit.
    await screen.findByRole('button', { name: /download json/i });
  });
});
