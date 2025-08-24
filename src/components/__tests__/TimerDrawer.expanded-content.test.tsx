import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { GlobalTimerProvider, useGlobalTimer } from '../../contexts/GlobalTimerContext';
import TimerDrawer from '../TimerDrawer';

// Mock next/navigation to control pathname in tests (stay on timer page by default)
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/'),
}));

// Helpers
const StartSessionOnMount: React.FC<{ totalDuration: number; startTime: number }> = ({ totalDuration, startTime }) => {
  const { startSession } = useGlobalTimer();
  React.useEffect(() => {
    startSession(totalDuration, { startTime, sessionId: 'test-session' });
  }, [startSession, totalDuration, startTime]);
  return null;
};

const SetActivityOnMount: React.FC<{ name: string; colorIndex?: number; startTime: number }> = ({ name, colorIndex = 0, startTime }) => {
  const { setCurrentActivity } = useGlobalTimer();
  React.useEffect(() => {
    setCurrentActivity({ id: 'a1', name, colorIndex, createdAt: new Date(startTime).toISOString(), isActive: true }, { startTime });
  }, [setCurrentActivity, name, colorIndex, startTime]);
  return null;
};

const StartBreakOnMount: React.FC<{ startTime: number }> = ({ startTime }) => {
  const { startBreak } = useGlobalTimer();
  React.useEffect(() => {
    startBreak({ startTime });
  }, [startBreak, startTime]);
  return null;
};

function renderWithProvider(ui: React.ReactElement) {
  return render(<GlobalTimerProvider>{ui}</GlobalTimerProvider>);
}

describe('TimerDrawer expanded content – activity/break states', () => {
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

  it('shows RunningActivityCard when a current activity is set', async () => {
    const activityStart = FIXED_NOW - 30_000; // 30s ago
    renderWithProvider(
      <>
        <StartSessionOnMount totalDuration={300} startTime={activityStart} />
        <SetActivityOnMount name="Focus Work" startTime={activityStart} />
        <TimerDrawer />
      </>
    );

    await waitFor(() => expect(screen.getByTestId('timer-drawer')).toBeTruthy());
    // Expand the drawer
    const toggle = await screen.findByRole('button', { name: /expand timer drawer/i });
    fireEvent.click(toggle);
    // RunningActivityCard should be present
    const running = await screen.findByTestId('running-activity-card');
    expect(running).toBeTruthy();
    expect(running).toHaveAttribute('aria-label', expect.stringContaining('Focus Work'));
  });

  it('shows ActiveBreakCard when on a break (no current activity)', async () => {
    const breakStart = FIXED_NOW - 45_000; // 45s ago
    renderWithProvider(
      <>
        <StartSessionOnMount totalDuration={300} startTime={breakStart} />
        <StartBreakOnMount startTime={breakStart} />
        <TimerDrawer />
      </>
    );

    await waitFor(() => expect(screen.getByTestId('timer-drawer')).toBeTruthy());
    // Expand the drawer
    const toggle = await screen.findByRole('button', { name: /expand timer drawer/i });
    fireEvent.click(toggle);
    const breakCard = await screen.findByTestId('active-break-card');
    expect(breakCard).toBeTruthy();
    expect(breakCard).toHaveAttribute('aria-label', expect.stringMatching(/Break elapsed/i));
  });
});
