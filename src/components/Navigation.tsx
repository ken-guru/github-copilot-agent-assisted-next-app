import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeToggle from '@/components/ThemeToggle';
import styles from './Navigation.module.css';

/**
 * Material 3 Expressive Navigation Component
 * - Organic pill-shaped active indicators with subtle asymmetry
 * - Dynamic color adaptation based on theme and context
 * - Smooth state transitions with shared element animations
 * - Enhanced focus indicators with expressive outlines
 * - Responsive navigation behavior for mobile devices
 * - Material 3 Expressive design tokens and motion system
 */
const Navigation: React.FC = () => {
  const pathname = usePathname();
  
  // Determine active states based on current path
  const isTimerActive = pathname === '/';
  const isActivitiesActive = pathname === '/activities';
  const isAIActive = pathname === '/ai';
  // Always show AI nav item; page handles gating/setup
  const showAI = true;

  return (
    <nav className={styles.navigation} aria-label="Main navigation">
      <div className={styles.navigationContainer}>
        <Link className={styles.brand} href="/">
          <span data-testid="navbar-brand">
            <i className={`bi bi-clock ${styles.brandIcon}`} aria-hidden="true"></i>
            <span className={styles.brandText}>Mr. Timely</span>
          </span>
        </Link>
        
        {/* Navigation controls with theme toggle and nav items */}
        <div className={styles.navigationControls}>
          {/* Theme Toggle - Visually separated from navigation */}
          <div className={styles.themeToggleContainer} data-testid="theme-toggle-container">
            <ThemeToggle size="sm" variant="navbar" />
          </div>
          
          {/* Navigation Items - Material 3 Expressive pills */}
          <ul className={styles.navigationItems} data-testid="nav-items-container">
            {/* Timer - First navigation item */}
            <li className={styles.navigationItem} data-testid="timer-nav-item">
              <Link 
                className={`${styles.navigationLink} ${isTimerActive ? styles.active : ''}`} 
                href="/"
                aria-current={isTimerActive ? 'page' : undefined}
              >
                <span aria-label="Go to Timer">
                  <i className={`bi bi-stopwatch ${styles.navigationIcon}`} aria-hidden="true"></i>
                  <span className={styles.navigationText}>Timer</span>
                </span>
              </Link>
            </li>
            
            {/* Activities - Second navigation item */}
            <li className={styles.navigationItem} data-testid="activities-nav-item">
              <Link 
                className={`${styles.navigationLink} ${isActivitiesActive ? styles.active : ''}`} 
                href="/activities"
                aria-current={isActivitiesActive ? 'page' : undefined}
              >
                <span aria-label="Go to Activities Management">
                  <i className={`bi bi-list-check ${styles.navigationIcon}`} aria-hidden="true"></i>
                  <span className={styles.navigationText}>Activities</span>
                </span>
              </Link>
            </li>

            {/* AI - Conditional navigation item */}
            {showAI && (
              <li className={styles.navigationItem} data-testid="ai-nav-item">
                <Link
                  className={`${styles.navigationLink} ${isAIActive ? styles.active : ''}`}
                  href="/ai"
                  aria-current={isAIActive ? 'page' : undefined}
                >
                  <span aria-label="Go to AI Planner">
                    <i className={`bi bi-stars ${styles.navigationIcon}`} aria-hidden="true"></i>
                    <span className={styles.navigationText}>AI</span>
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
