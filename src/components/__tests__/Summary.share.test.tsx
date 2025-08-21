import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Summary from '../Summary';
import { ToastProvider } from '../../contexts/ToastContext';

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

// Mock getActivities to return a stable activity list used by Summary
jest.mock('@/utils/activity-storage', () => ({
  getActivities: jest.fn(() => [
    { id: 'a1', name: 'Activity 1', description: 'desc', colorIndex: 1 },
  ])
}));

describe('Summary share flow', () => {
  beforeAll(() => {
    // Mock window.fetch for creating a share
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ metadata: { id: 'share-123' } })
    } as unknown as Response);
    // Mock clipboard
    Object.assign(navigator, { clipboard: { writeText: jest.fn().mockResolvedValue(undefined) } });
  });

  it('renders share buttons and creates a share', async () => {
    render(
      <ToastProvider>
        <Summary entries={[]} totalDuration={60} elapsedTime={60} allActivitiesCompleted={true} />
      </ToastProvider>
    );

    // Header share button should be present
    const headerBtn = screen.getByTestId('open-share-modal-summary');
    expect(headerBtn).toBeInTheDocument();

    // Open modal
    fireEvent.click(headerBtn);

    // Create share button in modal
    const createBtn = await screen.findByRole('button', { name: /create share/i });
    expect(createBtn).toBeInTheDocument();

    fireEvent.click(createBtn);

    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith('/api/sessions/share', expect.any(Object)));

  // After share created, ShareControls should render copy/download and open buttons
  await screen.findByRole('button', { name: /copy share link/i });
  await screen.findByRole('button', { name: /download json/i });
  await screen.findByRole('button', { name: /open shared session in new window/i });
  // Replace button should be hidden inside the dialog
  expect(screen.queryByRole('button', { name: /replace my activities/i })).not.toBeInTheDocument();
  });
});
