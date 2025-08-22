import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { GlobalTimerProvider, useGlobalTimer } from '../../contexts/GlobalTimerContext';
import TimerDrawer from '../TimerDrawer';
// Mock next/navigation to control pathname in tests
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/'),
}));
import { usePathname } from 'next/navigation';

// Helper to start a session immediately on mount
const StartSessionOnMount: React.FC<{ totalDuration: number; startTime: number }> = ({ totalDuration, startTime }) => {
  const { startSession } = useGlobalTimer();
  React.useEffect(() => {
    startSession(totalDuration, { startTime, sessionId: 'test-session' });
  }, [startSession, totalDuration, startTime]);
  return null;
};

// Helper to set current page in context (to simulate being on timer page)
const SetPageOnMount: React.FC<{ page: 'timer' | 'summary' | 'other' }> = ({ page }) => {
  const { setCurrentPage } = useGlobalTimer();
  React.useEffect(() => {
    setCurrentPage(page);
  }, [setCurrentPage, page]);
  return null;
};

function renderWithProvider(ui: React.ReactElement) {
  return render(<GlobalTimerProvider>{ui}</GlobalTimerProvider>);
}

describe('TimerDrawer', () => {
  const FIXED_NOW = new Date('2024-01-01T12:00:00Z').getTime();
  let originalNow: () => number;

  beforeAll(() => {
    originalNow = Date.now;
    // Override Date.now in a typed-safe way for tests
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (Date as any).now = () => FIXED_NOW;
  });

  afterAll(() => {
    // Restore Date.now
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (Date as any).now = originalNow;
  });

  beforeEach(() => {
    // Ensure no persisted state interferes
    window.localStorage.clear();
    // Default pathname as timer page
    (usePathname as unknown as jest.Mock).mockReturnValue('/');
  });

  it('does not render when no session is active', () => {
    renderWithProvider(<TimerDrawer />);
    expect(screen.queryByTestId('timer-drawer')).toBeNull();
  });

  it('renders elapsed and remaining time when session is active', async () => {
    const sessionStart = FIXED_NOW - 90_000; // started 90s ago
    renderWithProvider(<>
      <StartSessionOnMount totalDuration={300} startTime={sessionStart} />
      <TimerDrawer />
    </>);

  // Wait for drawer to render then verify times
  await waitFor(() => expect(screen.getByTestId('timer-drawer')).toBeTruthy());
  await waitFor(() => expect(screen.getByTestId('elapsed-time')).toBeTruthy());
  // Elapsed 90 seconds => 01:30 (MM:SS)
  expect(screen.getByTestId('elapsed-time').textContent).toContain('01:30');

    // Remaining = 300 - 90 = 210 => 00:03:30
  expect(screen.getByTestId('remaining-time').textContent).toContain('03:30');
  });

  it('expands and collapses when toggle is clicked', async () => {
    const sessionStart = FIXED_NOW - 30_000; // 30s ago
    renderWithProvider(<>
      <StartSessionOnMount totalDuration={120} startTime={sessionStart} />
      <TimerDrawer />
    </>);

  await waitFor(() => expect(screen.getByTestId('timer-drawer')).toBeTruthy());
  const toggle = await screen.findByRole('button', { name: /expand timer drawer/i });
  expect(toggle.getAttribute('aria-expanded')).toBe('false');
    fireEvent.click(toggle);
  expect(toggle.getAttribute('aria-expanded')).toBe('true');
    // Expect expanded content to be present
  expect(screen.getByTestId('drawer-expanded-content')).toBeTruthy();
    // Collapse
    fireEvent.click(toggle);
  expect(toggle.getAttribute('aria-expanded')).toBe('false');
  });

  it('adds one minute to remaining when Add 1 min clicked', async () => {
    const sessionStart = FIXED_NOW - 120_000; // 120s ago
    renderWithProvider(<>
      <StartSessionOnMount totalDuration={180} startTime={sessionStart} />
      <TimerDrawer />
    </>);

  // Wait for initial render, remaining = 60s => 01:00
  await waitFor(() => expect(screen.getByTestId('timer-drawer')).toBeTruthy());
  await waitFor(() => expect(screen.getByTestId('remaining-time').textContent).toContain('01:00'));

  // Expand to reveal controls
  const toggle = await screen.findByRole('button', { name: /expand timer drawer/i });
  fireEvent.click(toggle);
  const addBtn = await screen.findByRole('button', { name: /add 1 min/i });
    fireEvent.click(addBtn);

    // After adding, remaining = 120s => 02:00
  expect(screen.getByTestId('remaining-time').textContent).toContain('02:00');
  });

  it('shows Add 1 min even when collapsed on the timer page', async () => {
    const sessionStart = FIXED_NOW - 60_000; // 60s ago
    renderWithProvider(<>
      <SetPageOnMount page="timer" />
      <StartSessionOnMount totalDuration={120} startTime={sessionStart} />
      <TimerDrawer />
    </>);

    await waitFor(() => expect(screen.getByTestId('timer-drawer')).toBeTruthy());
    // Collapsed by default on timer page; quick action should be visible
    const addBtn = await screen.findByRole('button', { name: /add 1 min/i });
    fireEvent.click(addBtn);
    // Remaining initially: 60s -> after click: 120s
    expect(screen.getByTestId('remaining-time').textContent).toContain('02:00');
  });

  it('renders a progress bar reflecting elapsed/total (capped at 100%)', async () => {
    const sessionStart = FIXED_NOW - 90_000; // 90s ago
    renderWithProvider(<>
      <StartSessionOnMount totalDuration={300} startTime={sessionStart} />
      <TimerDrawer />
    </>);

    await waitFor(() => expect(screen.getByTestId('timer-drawer')).toBeTruthy());
    const progress = await screen.findByTestId('timer-progressbar');
    // 90/300 = 30%
    expect(progress).toHaveAttribute('aria-valuenow', '30');

    // Overtime case: elapsed > totalDuration => cap at 100
    window.localStorage.clear();
    renderWithProvider(<>
      <StartSessionOnMount totalDuration={60} startTime={FIXED_NOW - 120_000} />
      <TimerDrawer />
    </>);
    await waitFor(() => expect(screen.getAllByTestId('timer-progressbar').length).toBeGreaterThan(0));
    const bars = screen.getAllByTestId('timer-progressbar');
    const overtimeProgress = bars[bars.length - 1];
    expect(overtimeProgress).toHaveAttribute('aria-valuenow', '100');
  });
});
