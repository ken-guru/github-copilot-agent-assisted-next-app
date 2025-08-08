import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useThemeReactive } from '@/hooks/useThemeReactive';
import ThemeToggle from '@/components/ThemeToggle';
import { isAuthenticatedClient } from '@/utils/auth/client';

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
  
  // Determine active states based on current path
  const isTimerActive = pathname === '/';
  const isActivitiesActive = pathname === '/activities';
  const isAIActive = pathname === '/ai';
  const showAI = isAuthenticatedClient();
  
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
          <div className="theme-toggle-separator me-4" data-testid="theme-toggle-container">
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
    </nav>
  );
};

export default Navigation;
