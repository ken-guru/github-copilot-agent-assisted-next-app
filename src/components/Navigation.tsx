import React, { useCallback, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useThemeReactive } from '@/hooks/useThemeReactive';
import ThemeToggle from '@/components/ThemeToggle';
import { useGlobalTimer } from '@/contexts/GlobalTimerContext';
import ConfirmationDialog, { type ConfirmationDialogRef } from '@/components/ConfirmationDialog';
// AI nav is always visible; gating handled on page

/**
 * Enhanced navigation with active state management and tab-like styling
 * - Bootstrap nav pills for active state indication
 * - Visual separation between theme toggle and navigation items
 * - Tab-like appearance extending into header space
 * - Mobile-friendly with icon-only display on small screens
 * - Automatic light/dark theme switching with proper active state styling
 * Issue #245: Removed dropdown complexity + active state UX improvements
 */
const Navigation: React.FC = () => {
  // Get theme reactively to ensure component responds to theme changes (fixes issue #252)
  const theme = useThemeReactive(); 
  const pathname = usePathname();
  const router = useRouter();
  const { isTimerRunning } = useGlobalTimer();
  const confirmRef = useRef<ConfirmationDialogRef>(null);
  const [dialogHandlers, setDialogHandlers] = useState<{ onConfirm: () => void; onCancel: () => void }>({ onConfirm: () => {}, onCancel: () => {} });
  
  // Determine active states based on current path
  const isTimerActive = pathname === '/';
  const isActivitiesActive = pathname === '/activities';
  const isAIActive = pathname === '/ai';
  // Always show AI nav item; page handles gating/setup
  const showAI = true;

  // Accessible label for Timer link reflects state (smart nav intent)
  const timerAriaLabel = useMemo(() => (
    isTimerRunning ? 'Go to Active Timer' : 'Go to Timer Setup'
  ), [isTimerRunning]);

  // Intercept internal navigation during active session for destinations other than timer page
  const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // If no active session or navigating to timer page, let default proceed
    if (!isTimerRunning || href === '/') {
      return; // allow Next Link default navigation
    }
    // Active session and navigating away: confirm
    e.preventDefault();
    const proceed = () => {
      router.push(href);
    };
    const cancel = () => {
      // no-op; stay on page
    };
    setDialogHandlers({ onConfirm: proceed, onCancel: cancel });
    confirmRef.current?.showDialog();
  }, [isTimerRunning, router]);
  
  // Use Bootstrap's theme-aware classes (removed navbar-expand-lg for always-expanded behavior)
  const navClasses = theme === 'dark' 
    ? 'navbar navbar-dark bg-dark'
    : 'navbar navbar-light bg-light';

  return (
  <nav className={navClasses} aria-label="Main navigation">
      <div className="container-fluid d-flex justify-content-between align-items-center flex-wrap">
        <Link className="navbar-brand" href="/">
          <span data-testid="navbar-brand">
            <i className="bi bi-clock me-2" aria-hidden="true"></i>
            <span className="brand-text d-none d-sm-inline">Mr. Timely</span>
          </span>
        </Link>
        
        {/* Navigation with separated theme toggle and nav pills */}
        <div className="d-flex align-items-center">
          {/* Theme Toggle - Visually separated from navigation */}
          <div className="d-flex align-items-center me-4" data-testid="theme-toggle-container">
            <ThemeToggle size="sm" variant="navbar" />
          </div>
          
          {/* Navigation Items - Using Bootstrap nav pills for tab-like appearance */}
          <ul className="nav nav-pills nav-items-group" data-testid="nav-items-container">
            {/* Timer - First navigation item */}
            <li className="nav-item timer-item" data-testid="timer-nav-item">
              <Link 
                className={`nav-link ${isTimerActive ? 'active' : ''}`} 
                href="/"
                aria-current={isTimerActive ? 'page' : undefined}
                aria-label={timerAriaLabel}
                onClick={(e) => handleNavClick(e, '/')}
              >
                <span aria-label="Go to Timer">
                  <i className="bi bi-stopwatch me-sm-1" aria-hidden="true"></i>
                  <span className="nav-text d-none d-sm-inline">Timer</span>
                </span>
              </Link>
            </li>
            
            {/* Activities - Second navigation item */}
            <li className="nav-item activities-item" data-testid="activities-nav-item">
              <Link 
                className={`nav-link ${isActivitiesActive ? 'active' : ''}`} 
                href="/activities"
                aria-current={isActivitiesActive ? 'page' : undefined}
                onClick={(e) => handleNavClick(e, '/activities')}
              >
                <span aria-label="Go to Activities Management">
                  <i className="bi bi-list-check me-sm-1" aria-hidden="true"></i>
                  <span className="nav-text d-none d-sm-inline">Activities</span>
                </span>
              </Link>
            </li>

              {/* AI - Conditional navigation item */}
              {showAI && (
                <li className="nav-item ai-item" data-testid="ai-nav-item">
                  <Link
                    className={`nav-link ${isAIActive ? 'active' : ''}`}
                    href="/ai"
                    aria-current={isAIActive ? 'page' : undefined}
                    onClick={(e) => handleNavClick(e, '/ai')}
                  >
                    <span aria-label="Go to AI Planner">
                      <i className="bi bi-stars me-sm-1" aria-hidden="true"></i>
                      <span className="nav-text d-none d-sm-inline">AI</span>
                    </span>
                  </Link>
                </li>
              )}
          </ul>
        </div>
      </div>

      {/* Internal navigation confirmation modal (active session only) */}
      <ConfirmationDialog
        ref={confirmRef}
        message="You have an active timer running. Do you want to leave this page?"
        confirmText="Leave"
        cancelText="Stay"
        onConfirm={dialogHandlers.onConfirm}
        onCancel={dialogHandlers.onCancel}
      />
    </nav>
  );
};

export default Navigation;
