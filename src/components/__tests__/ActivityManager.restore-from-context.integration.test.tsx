import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ActivityManager from '../ActivityManager';
import { GlobalTimerProvider, useGlobalTimer } from '../../contexts/GlobalTimerContext';

// Mock activity-storage to control loaded activities
jest.mock('@/utils/activity-storage', () => ({
  getActivities: jest.fn(() => ([
    { id: 'a1', name: 'Research', description: '', colorIndex: 1, isActive: true, createdAt: new Date().toISOString() },
    { id: 'a2', name: 'Coding', description: '', colorIndex: 2, isActive: true, createdAt: new Date().toISOString() },
  ])),
  addActivity: jest.fn(),
  deleteActivity: jest.fn(),
}));

const SeedContext: React.FC<{ now: number }> = ({ now }) => {
  const { startSession, setCurrentActivity, completeCurrentActivity } = useGlobalTimer();
  React.useEffect(() => {
    // Start session 2 minutes ago, 10 minutes total
    startSession(600, { startTime: now - 120_000, sessionId: 'restore-test' });
    // Mark first activity completed
    setCurrentActivity({ id: 'a1', name: 'Research', colorIndex: 1, createdAt: new Date(now - 180_000).toISOString(), isActive: true }, { startTime: now - 90_000 });
    completeCurrentActivity({ completedAt: now - 60_000 });
    // Set second activity as currently running
    setCurrentActivity({ id: 'a2', name: 'Coding', colorIndex: 2, createdAt: new Date(now - 120_000).toISOString(), isActive: true }, { startTime: now - 30_000 });
  }, [now, startSession, setCurrentActivity, completeCurrentActivity]);
  return null;
};

function renderWithProvider(ui: React.ReactElement) {
  return render(<GlobalTimerProvider>{ui}</GlobalTimerProvider>);
}

describe('ActivityManager – restore from GlobalTimerContext', () => {
  const FIXED_NOW = new Date('2024-01-01T12:00:00Z').getTime();
  let originalNow: () => number;

  beforeAll(() => {
    originalNow = Date.now;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (Date as any).now = () => FIXED_NOW;
  });

  afterAll(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (Date as any).now = originalNow;
  });

  beforeEach(() => {
    window.localStorage.clear();
  });

  it('immediately renders completed and running states based on context', async () => {
    renderWithProvider(<>
      <SeedContext now={FIXED_NOW} />
      <ActivityManager
        onActivitySelect={jest.fn()}
        onActivityRemove={jest.fn()}
        currentActivityId={null}
        completedActivityIds={[]}
        timelineEntries={[]}
        totalDuration={0}
        timerActive={true}
      />
    </>);

    // Wait for activities to load and UI to settle
    await waitFor(() => expect(screen.getByTestId('activity-manager')).toBeTruthy());

    // Running badge for Coding (a2) with elapsed shown
    const codingRow = screen.getByTestId('activity-column-a2');
    expect(codingRow).toBeTruthy();
    expect(codingRow.querySelector('.badge')).not.toBeNull();

    // Completed badge for Research (a1)
    const researchRow = screen.getByTestId('activity-column-a1');
    expect(researchRow).toBeTruthy();
    const completed = Array.from(researchRow.querySelectorAll('[aria-label="Completed"]'));
    expect(completed.length).toBeGreaterThan(0);
  });
});
