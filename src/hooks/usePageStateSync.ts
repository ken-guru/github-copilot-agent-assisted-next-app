"use client";
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useGlobalTimer, type PageState } from '@/contexts/GlobalTimerContext';

/**
 * usePageStateSync
 * Syncs the current route to GlobalTimerContext currentPage and manages
 * drawer expansion defaults when navigating between pages.
 *
 * Rules:
 * - '/' is the timer page
 * - '/summary' is the summary page
 * - anything else is 'other'
 * - When on timer page, default drawer collapsed
 * - When off timer page and a session is running, keep user's choice but
 *   auto-collapse when there is no active session
 */
export function usePageStateSync() {
  const pathname = usePathname();
  const { setCurrentPage, isTimerRunning, setDrawerExpanded } = useGlobalTimer();

  useEffect(() => {
    let page: PageState = 'other';
    if (pathname === '/') page = 'timer';
    else if (pathname?.startsWith('/summary')) page = 'summary';
    setCurrentPage(page);

    // Manage drawer behavior on navigation
    if (page === 'timer') {
      // Collapse on the timer page to avoid duplication with main UI
      setDrawerExpanded(false);
    } else if (!isTimerRunning) {
      // If session ended while on other pages, ensure drawer is collapsed
      setDrawerExpanded(false);
    }
  }, [pathname, setCurrentPage, isTimerRunning, setDrawerExpanded]);
}
