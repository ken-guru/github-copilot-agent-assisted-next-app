import React from 'react';
import Link from 'next/link';
import { useTheme } from '@/contexts/theme';
import ThemeToggle from '@/components/ThemeToggle';

/**
 * Simplified navigation bar for Timer and Activities
 * - Bootstrap styling with theme awareness
 * - No collapsible dropdown - always shows all items inline
 * - Mobile-friendly with responsive flexbox layout
 * - Automatic light/dark theme switching
 * Issue #245: Removed dropdown complexity for simple navigation needs
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
          <i className="bi bi-clock me-2" aria-hidden="true"></i>
          Mr. Timely
        </Link>
        
        {/* Simplified always-visible navigation - no collapse/dropdown */}
        <ul className="navbar-nav d-flex flex-row align-items-center">
          <li className="nav-item me-3">
            <Link className="nav-link" href="/">
              <span aria-label="Go to Timer">
                <i className="bi bi-stopwatch me-1" aria-hidden="true"></i>
                Timer
              </span>
            </Link>
          </li>
          <li className="nav-item me-3">
            <Link className="nav-link" href="/activities">
              <span aria-label="Go to Activities Management">
                <i className="bi bi-list-check me-1" aria-hidden="true"></i>
                Activities
              </span>
            </Link>
          </li>
          <li className="nav-item d-flex align-items-center">
            <ThemeToggle size="sm" variant="navbar" />
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
