import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { GlobalTimerProvider, useGlobalTimer } from '../GlobalTimerContext';
import type { Activity } from '@/types/activity';

// Helper to render hook with provider wrapper
function renderWithProvider() {
  const wrapper: React.FC<React.PropsWithChildren> = ({ children }) => (
    <GlobalTimerProvider>{children}</GlobalTimerProvider>
  );
  return renderHook(() => useGlobalTimer(), { wrapper });
}

describe('GlobalTimerContext', () => {
  beforeEach(() => {
    // Ensure clean storage for each test
    if (typeof window !== 'undefined') {
      window.localStorage.clear();
    }
  });

  it('initializes with defaults and persists to localStorage', () => {
    const { result } = renderWithProvider();
    expect(result.current.isTimerRunning).toBe(false);
    expect(result.current.totalDuration).toBe(0);

    act(() => {
      result.current.startSession(3600, { startTime: 123456 });
    });

    expect(result.current.isTimerRunning).toBe(true);
    expect(result.current.totalDuration).toBe(3600);
    // Check persistence
    const raw = window.localStorage.getItem('mrTimely.globalTimer.v1');
    expect(raw).toBeTruthy();
    const parsed = JSON.parse(raw as string);
    expect(parsed.isTimerRunning).toBe(true);
    expect(parsed.totalDuration).toBe(3600);
  });

  it('sets and completes current activity', () => {
    const { result } = renderWithProvider();
    act(() => {
      result.current.startSession(1800, { startTime: 1000 });
      const activity: Activity = {
        id: 'a1',
        name: 'Focus',
        description: 'desc',
        colorIndex: 0,
        createdAt: new Date(0).toISOString(),
        isActive: true,
      };
      result.current.setCurrentActivity(activity, { startTime: 2000 });
    });
    expect(result.current.currentActivity?.id).toBe('a1');
    expect(result.current.currentActivityStartTime).toBe(2000);

    act(() => {
      result.current.completeCurrentActivity();
    });
    expect(result.current.currentActivity).toBeNull();
    expect(result.current.completedActivities.length).toBe(1);
  });

  it('hydrates from localStorage on mount', () => {
    // Seed storage with a running session
    window.localStorage.setItem(
      'mrTimely.globalTimer.v1',
      JSON.stringify({
        sessionId: 'seed',
        isTimerRunning: true,
        sessionStartTime: 5000,
        totalDuration: 900,
        currentActivity: null,
        currentActivityStartTime: null,
        completedActivities: [],
        currentBreakStartTime: null,
        drawerExpanded: true,
        currentPage: 'timer',
      })
    );

    const { result } = renderWithProvider();
    expect(result.current.isTimerRunning).toBe(true);
    expect(result.current.sessionStartTime).toBe(5000);
    expect(result.current.totalDuration).toBe(900);
    expect(result.current.drawerExpanded).toBe(true);
    expect(result.current.currentPage).toBe('timer');
  });
});
