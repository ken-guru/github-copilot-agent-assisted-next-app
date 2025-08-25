import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { GlobalTimerProvider, useGlobalTimer } from '../../contexts/GlobalTimerContext';
import TimerDrawer from '../TimerDrawer';

// Mock next/navigation to keep pathname on timer page
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/'),
}));

const StartSessionOnMount: React.FC<{ totalDuration: number; startTime: number }> = ({ totalDuration, startTime }) => {
  const { startSession } = useGlobalTimer();
  React.useEffect(() => {
    startSession(totalDuration, { startTime, sessionId: 'layout-test' });
  }, [startSession, totalDuration, startTime]);
  return null;
};

function renderWithProvider(ui: React.ReactElement) {
  return render(<GlobalTimerProvider>{ui}</GlobalTimerProvider>);
}

describe('TimerDrawer layout - quick actions nowrap', () => {
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

  it('renders the actions row with flex-nowrap when expanded', async () => {
    const sessionStart = FIXED_NOW - 30_000; // 30s ago
    renderWithProvider(
      <>
        <StartSessionOnMount totalDuration={300} startTime={sessionStart} />
        <TimerDrawer />
      </>
    );

    await waitFor(() => expect(screen.getByTestId('timer-drawer')).toBeTruthy());
    const toggle = await screen.findByRole('button', { name: /expand timer drawer/i });
    fireEvent.click(toggle);
    const actions = await screen.findByTestId('drawer-actions-row');
    expect(actions.className).toEqual(expect.stringContaining('flex-nowrap'));
  });
});
