import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { GlobalTimerProvider, useGlobalTimer } from '../../contexts/GlobalTimerContext';
import { usePageStateSync } from '../usePageStateSync';
import * as NextNavigation from 'next/navigation';

// Mock next/navigation usePathname to control route in tests
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

const mockedUsePathname = jest.mocked(NextNavigation.usePathname);

function wrapper({ children }: { children: React.ReactNode }) {
  return <GlobalTimerProvider>{children}</GlobalTimerProvider>;
}

describe('usePageStateSync', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('sets currentPage based on pathname and collapses drawer on timer page', () => {
    mockedUsePathname.mockReturnValue('/');
    const { result } = renderHook(() => {
      usePageStateSync();
      return useGlobalTimer();
    }, { wrapper });

    expect(result.current.currentPage).toBe('timer');
    expect(result.current.drawerExpanded).toBe(false);
  });

  it('marks summary page and keeps drawer collapsed when no session', () => {
    mockedUsePathname.mockReturnValue('/summary');
    const { result } = renderHook(() => {
      usePageStateSync();
      return useGlobalTimer();
    }, { wrapper });

    expect(result.current.currentPage).toBe('summary');
    expect(result.current.drawerExpanded).toBe(false);
  });

  it('does not force-collapse drawer on other pages if session running and user expands it', () => {
    mockedUsePathname.mockReturnValue('/activities');
    const { result, rerender } = renderHook(() => {
      usePageStateSync();
      return useGlobalTimer();
    }, { wrapper });

    // Start a session
    act(() => {
      result.current.startSession(300, { startTime: Date.now(), sessionId: 's1' });
    });

    // User expands the drawer
    act(() => {
      result.current.setDrawerExpanded(true);
    });

    // Trigger effect again (simulate re-render)
    rerender();

    expect(result.current.currentPage).toBe('other');
    expect(result.current.drawerExpanded).toBe(true);
  });
});
