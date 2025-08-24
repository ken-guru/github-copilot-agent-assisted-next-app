import React from 'react';
import { act, renderHook } from '@testing-library/react';
import { GlobalTimerProvider } from '../../contexts/GlobalTimerContext';
import { useGlobalTimer } from '../../contexts/GlobalTimerContext';
import { useGlobalTimerProgress } from '../useGlobalTimerProgress';

describe('useGlobalTimerProgress', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });
  afterAll(() => {
    jest.useRealTimers();
  });

  it('returns live-updating progress while session is active', () => {
    const { result } = renderHook(() => {
      const timer = useGlobalTimer();
      const progress = useGlobalTimerProgress(500);
      return { timer, progress };
    }, { wrapper: ({ children }) => <GlobalTimerProvider>{children}</GlobalTimerProvider> });

    act(() => {
      result.current.timer.startSession(120, { startTime: Date.now() });
    });

    const first = result.current.progress.elapsed;
    act(() => {
      jest.advanceTimersByTime(1100);
    });
    const second = result.current.progress.elapsed;

    expect(second).toBeGreaterThanOrEqual(first + 1);
  });

  it('starts immediately after mount for restored running session', () => {
    // simulate a running session with a start time in the past
    const { result } = renderHook(() => {
      const timer = useGlobalTimer();
      const progress = useGlobalTimerProgress(500);
      return { timer, progress };
    }, { wrapper: ({ children }) => <GlobalTimerProvider>{children}</GlobalTimerProvider> });

    const pastStart = Date.now() - 5_000; // 5 seconds ago
    act(() => {
      result.current.timer.startSession(60, { startTime: pastStart });
    });
    // On first read, elapsed should reflect past start
    expect(result.current.progress.elapsed).toBeGreaterThanOrEqual(5);

    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(result.current.progress.elapsed).toBeGreaterThanOrEqual(6);
  });
});
