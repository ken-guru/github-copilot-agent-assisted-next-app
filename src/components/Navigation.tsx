import React from 'react';
import Link from 'next/link';
import { useTheme } from '@/contexts/theme';
import ThemeToggle from '@/components/ThemeToggle';

/**
 * Enhanced simplified navigation bar 
 * - Bootstrap styling with theme awareness
 * - No collapsible dropdown - always shows all items inline
 * - Mobile-friendly with icon-only display on small screens
 * - Reordered items: Theme Toggle, Timer, Activities
 * - Automatic light/dark theme switching
 * Issue #245: Removed dropdown complexity + mobile UX enhancements
 */
const Navigation: React.FC = () => {
  // Get theme from context - this ensures component re-renders when theme changes
  const themeContext = useTheme();
  const theme = themeContext?.theme || 'light'; // Fallback for edge cases
  
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
        
        {/* Enhanced always-visible navigation - no collapse/dropdown, reordered items */}
        <ul className="navbar-nav d-flex flex-row align-items-center" data-testid="nav-items-container">
          {/* Theme Toggle - First item */}
          <li className="nav-item me-3 theme-toggle-item">
            <ThemeToggle size="sm" variant="navbar" />
          </li>
          
          {/* Timer - Second item */}
          <li className="nav-item me-3 timer-item" data-testid="timer-nav-item">
            <Link className="nav-link" href="/">
              <span aria-label="Go to Timer">
                <i className="bi bi-stopwatch me-1" aria-hidden="true"></i>
                <span className="nav-text d-none d-sm-inline">Timer</span>
              </span>
            </Link>
          </li>
          
          {/* Activities - Third item */}
          <li className="nav-item activities-item" data-testid="activities-nav-item">
            <Link className="nav-link" href="/activities">
              <span aria-label="Go to Activities Management">
                <i className="bi bi-list-check me-1" aria-hidden="true"></i>
                <span className="nav-text d-none d-sm-inline">Activities</span>
              </span>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
