import { useEffect } from 'react';
import { useAppState } from '../context/AppStateContext';
import { useTheme } from '../context/ThemeContext';
import { useViewport } from '../hooks/useViewport';
import OvertimeIndicator from '../components/OvertimeIndicator';
import styles from './App.module.css';
import mobileStyles from '../styles/mobile.module.css';

// Mock components for testing
const Logo = () => <div data-testid="logo">App Logo</div>;
const ThemeToggle = () => <button data-testid="theme-toggle">Toggle Theme</button>;
const TimeCounter = ({ timeRemaining, isRunning }: { timeRemaining: number, isRunning: boolean }) => (
  <div data-testid="time-counter">
    {isRunning ? 'Running' : 'Paused'}: {timeRemaining}s
  </div>
);

export function App() {
  const { state, dispatch } = useAppState();
  const { theme } = useTheme();
  const { isMobile } = useViewport();
  
  // Calculate if in overtime
  const isOvertime = state.timeRemaining < 0;
  const overtimeDuration = isOvertime ? Math.abs(state.timeRemaining) : 0;

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (state.isRunning) {
      interval = setInterval(() => {
        dispatch({ type: 'TICK' });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [state.isRunning, dispatch]);

  // Apply conditional classes based on viewport
  const containerClass = `${styles.container} ${isMobile ? 'mobileView' : ''}`;
  const headerClass = isMobile ? mobileStyles.mobileHeader : styles.header;
  const mainClass = isMobile ? mobileStyles.mobileMain : styles.main;
  const footerClass = isMobile ? mobileStyles.mobileFooter : styles.footer;

  return (
    <div 
      className={containerClass} 
      data-theme={theme}
      data-testid="app-container"
    >
      <header className={headerClass} role="banner">
        <Logo />
        <ThemeToggle />
      </header>

      <main className={mainClass} role="main">
        <div data-testid="duration-setup">Duration Setup</div>
        <div data-testid="progress">Progress</div>
        
        <div className={styles.timeDisplay}>
          <TimeCounter 
            timeRemaining={state.timeRemaining} 
            isRunning={state.isRunning} 
          />
          
          {isOvertime && (
            <OvertimeIndicator 
              isOvertime={isOvertime} 
              overtimeDuration={overtimeDuration} 
            />
          )}
        </div>

        <div data-testid="activity-manager">Activity Manager</div>
        <div data-testid="timeline">Timeline</div>
        <div data-testid="summary">Summary</div>
      </main>

      <footer className={footerClass} role="contentinfo">
        <button 
          className={styles.resetButton}
          onClick={() => dispatch({ type: 'RESET' })}
          data-testid="reset-button"
        >
          Reset
        </button>
        
        <button 
          className={styles.completeButton}
          onClick={() => dispatch({ type: 'COMPLETE_ALL' })}
          data-testid="complete-all-button"
        >
          Complete All
        </button>
      </footer>
    </div>
  );
}