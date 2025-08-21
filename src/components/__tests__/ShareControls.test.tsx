import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ShareControls from '@/components/ShareControls';
import * as activityStorage from '../../utils/activity-storage';

// Mock Next.js app router to avoid invariant about router being mounted
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

// Mock activity-storage to allow interception of saveActivities calls
jest.mock('../../utils/activity-storage', () => ({
  __esModule: true,
  // keep other exports undefined for this test; only need saveActivities
  saveActivities: jest.fn(),
}));

// Mock window.alert to avoid noisy test output
beforeAll(() => {
  window.alert = jest.fn();
});

describe('ShareControls', () => {
  it('calls copy and download actions', async () => {
    const shareUrl = 'https://example.com/shared/abc-123';

    // mock clipboard
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn().mockResolvedValue(undefined),
      },
    });

    // mock fetch for download
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ sessionData: { foo: 'bar' }, metadata: { id: 'abc-123' } }),
    } as unknown as Response);

    render(<ShareControls shareUrl={shareUrl} />);

  const copyBtn = screen.getByRole('button', { name: /copy share link/i });
    fireEvent.click(copyBtn);

    await waitFor(() => expect(navigator.clipboard.writeText).toHaveBeenCalledWith(shareUrl));

  const downloadBtn = screen.getByRole('button', { name: /download json/i });
    fireEvent.click(downloadBtn);

    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
  });

  it('replaces activities from shared data', async () => {
    const shareUrl = 'https://example.com/shared/xyz-789';

    // Mock fetch to return StoredSession-like shape with activities and skippedActivities
    const sample = {
      sessionData: {
        activities: [
          { id: 'a1', name: 'Reading', colorIndex: 1 },
          { id: 'a2', name: 'Homework', colorIndex: 0 },
        ],
        skippedActivities: [
          { id: 's1', name: 'Chores' },
        ],
      },
      metadata: { id: 'xyz-789' },
    };
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => sample } as unknown as Response);

  const saveSpy = (activityStorage.saveActivities as unknown as jest.Mock).mockImplementation(() => {});

  const { getByRole } = render(<ShareControls shareUrl={shareUrl} />);
  const replaceBtn = getByRole('button', { name: /replace my activities/i });
  replaceBtn.click();

  // Click confirm on designed dialog
  const confirmButton = await screen.findByRole('button', { name: /confirm/i });
  fireEvent.click(confirmButton);

  await waitFor(() => expect(global.fetch).toHaveBeenCalled());
  await waitFor(() => expect(saveSpy).toHaveBeenCalled());

  // Clean up mock implementation
  (activityStorage.saveActivities as unknown as jest.Mock).mockReset();
  });
});
