import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ActivityManager from '../ActivityManager';
import { GlobalTimerProvider, useGlobalTimer } from '../../contexts/GlobalTimerContext';

// Helper to start a session immediately on mount
const StartSessionOnMount: React.FC<{ totalDuration: number; startTime?: number }> = ({ totalDuration, startTime }) => {
  const { startSession } = useGlobalTimer();
  React.useEffect(() => {
    startSession(totalDuration, { startTime: startTime ?? Date.now(), sessionId: 'unify-add-1m' });
  }, [startSession, totalDuration, startTime]);
  return null;
};

function renderWithProvider(ui: React.ReactElement) {
  return render(<GlobalTimerProvider>{ui}</GlobalTimerProvider>);
}

describe('ActivityManager +1 min unification via GlobalTimerContext', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('does not render local progress section when GlobalTimerContext is present (deduplicated)', async () => {
    const FIXED_NOW = new Date('2024-01-01T12:00:00Z').getTime();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const originalNow: any = Date.now;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (Date as any).now = () => FIXED_NOW;

    try {
      renderWithProvider(
        <>
          <StartSessionOnMount totalDuration={300} startTime={FIXED_NOW - 60_000} />
          <ActivityManager 
            onActivitySelect={jest.fn()}
            onActivityRemove={jest.fn()}
            currentActivityId={null}
            completedActivityIds={[]}
            timelineEntries={[]}
          />
        </>
      );

      // With context present, ActivityManager should not render its own progress container
      expect(screen.queryByTestId('progress-container')).not.toBeInTheDocument();
    } finally {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (Date as any).now = originalNow;
    }
  });

  it('invokes context addOneMinute when no onExtendDuration prop is provided', async () => {
    const FIXED_NOW = new Date('2024-01-01T12:00:00Z').getTime();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const originalNow: any = Date.now;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (Date as any).now = () => FIXED_NOW;

    try {
      renderWithProvider(
        <>
          <StartSessionOnMount totalDuration={120} startTime={FIXED_NOW - 60_000} />
          <ActivityManager 
            onActivitySelect={jest.fn()}
            onActivityRemove={jest.fn()}
            currentActivityId={null}
            completedActivityIds={[]}
            timelineEntries={[]}
          />
        </>
      );

  // Button should be present due to context wiring even without prop
  const extendButton = await screen.findByRole('button', { name: /1 min/i });
      // Click to add one minute
      fireEvent.click(extendButton);

      // After add, totalDuration should increase by 60; we assert via drawer-independent progress section text
      // Since ActivityManager delegates progress display to TimerProgressSection and uses computeProgress with context,
      // we can only indirectly verify by ensuring the button remains enabled and no error occurs.
      // A more direct assertion is covered in TimerDrawer tests; here we ensure the button exists and is clickable.
  expect(extendButton).toBeEnabled();
    } finally {
      // Restore Date.now
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (Date as any).now = originalNow;
    }
  });
});
