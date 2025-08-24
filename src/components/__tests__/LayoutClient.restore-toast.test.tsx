import React from 'react';
import { render, screen } from '@testing-library/react';
import { LayoutClient } from '../LayoutClient';
import { GlobalTimerProvider } from '../../contexts/GlobalTimerContext';

// Mock hooks that rely on browser
jest.mock('../../hooks/useNavigationGuard', () => ({ useNavigationGuard: jest.fn() }));
jest.mock('../../hooks/usePageStateSync', () => ({ usePageStateSync: jest.fn() }));

// Mock next/script
jest.mock('next/script', () => {
  return function MockScript({ src }: { src?: string }) {
    return <div data-testid="bootstrap-script" data-src={src} />;
  };
});

// Mock Navigation component
jest.mock('../Navigation', () => {
  return function MockNavigation() {
    return <nav data-testid="navigation">Navigation</nav>;
  };
});

// Mock ServiceWorkerUpdater component
jest.mock('../ui/ServiceWorkerUpdater', () => {
  return function MockServiceWorkerUpdater() {
    return <div data-testid="service-worker-updater">SW Updater</div>;
  };
});

// Mock TimerDrawer component
jest.mock('../TimerDrawer', () => {
  return function MockTimerDrawer() {
    return <div data-testid="timer-drawer">Timer Drawer</div>;
  };
});

// Ensure ToastContainer renders in tests (it is inside LayoutClient)

describe('LayoutClient restore toast', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Clear session and local storage
    window.sessionStorage.clear();
    window.localStorage.clear();
  });

  it('shows a restore toast when returning from outside with active session', async () => {
    // Seed localStorage with an active session
    window.localStorage.setItem(
      'mrTimely.globalTimer.v1',
      JSON.stringify({
        sessionId: 'seed',
        isTimerRunning: true,
        sessionStartTime: 1000,
        totalDuration: 600,
        currentActivity: null,
        currentActivityStartTime: null,
        completedActivities: [],
        currentBreakStartTime: null,
        drawerExpanded: false,
        currentPage: 'other',
      })
    );
    // Simulate we left origin earlier
    window.sessionStorage.setItem('mrTimely.leftOriginAt', String(Date.now() - 1000));

    render(
      <GlobalTimerProvider>
        <LayoutClient>
          <div>Content</div>
        </LayoutClient>
      </GlobalTimerProvider>
    );

    // The toast container is rendered after effects run; wait for it
    const toast = await screen.findByTestId('toast-container');
    expect(Boolean(toast)).toBe(true);
    expect(screen.getByTestId('toast-message').textContent).toContain('Session restored');
  });

  it('does not show restore toast for internal navigation (no flag set)', () => {
    // Seed localStorage with an active session
    window.localStorage.setItem(
      'mrTimely.globalTimer.v1',
      JSON.stringify({
        sessionId: 'seed',
        isTimerRunning: true,
        sessionStartTime: 1000,
        totalDuration: 600,
        currentActivity: null,
        currentActivityStartTime: null,
        completedActivities: [],
        currentBreakStartTime: null,
        drawerExpanded: false,
        currentPage: 'timer',
      })
    );

    render(
      <GlobalTimerProvider>
        <LayoutClient>
          <div>Content</div>
        </LayoutClient>
      </GlobalTimerProvider>
    );

    // No restore flag, so toast container should not render
    expect(screen.queryByTestId('toast-container')).toBeNull();
  });
});
