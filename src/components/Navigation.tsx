import React from 'react';
import Link from 'next/link';
import { useTheme } from '@/contexts/theme';
import ThemeToggle from '@/components/ThemeToggle';

/**
 * Responsive navigation bar for Timer and Activities
 * - Bootstrap styling with theme awareness
 * - ARIA labels for accessibility
 * - Mobile-first design
 * - Automatic light/dark theme switching
 */
const Navigation: React.FC = () => {
  // Safely get theme with fallback for when component is rendered outside ThemeProvider
  let theme = 'light';
  try {
    const themeContext = useTheme();
    theme = themeContext.theme;
  } catch (error) {
    // Fallback to light theme if no context available (e.g., in tests)
    theme = 'light';
  }
  
  // Use Bootstrap's theme-aware classes
  const navClasses = theme === 'dark' 
    ? 'navbar navbar-expand-lg navbar-dark bg-dark'
    : 'navbar navbar-expand-lg navbar-light bg-light';

  return (
    <nav className={navClasses} aria-label="Main navigation">
      <div className="container-fluid">
        <Link className="navbar-brand" href="/">
          <i className="bi bi-clock me-2" aria-hidden="true"></i>
          Mr. Timely
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" href="/" aria-label="Go to Timer">
                <i className="bi bi-stopwatch me-1" aria-hidden="true"></i>
                Timer
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="/activities" aria-label="Go to Activities Management">
                <i className="bi bi-list-check me-1" aria-hidden="true"></i>
                Activities
              </Link>
            </li>
            <li className="nav-item d-flex align-items-center">
              <ThemeToggle size="sm" variant="navbar" />
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
