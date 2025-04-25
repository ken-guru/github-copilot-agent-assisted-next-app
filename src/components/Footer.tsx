import React from 'react';
import { useViewport } from '../hooks/useViewport';
import { useAppState } from '../context/AppStateContext';
import TouchableButton from './TouchableButton';
import styles from './Footer.module.css';

/**
 * Footer - The application footer with action buttons
 * 
 * Adapts to mobile and desktop viewports
 */
const Footer: React.FC = () => {
  const { isMobile, hasTouch } = useViewport();
  const { dispatch } = useAppState();
  
  // Apply appropriate class based on viewport
  const footerClass = isMobile
    ? styles.mobileFooter
    : styles.footer;
  
  // Handle button actions
  const handleReset = () => {
    dispatch({ type: 'RESET' });
  };
  
  const handleCompleteAll = () => {
    dispatch({ type: 'COMPLETE_ALL' });
  };
  
  return (
    <footer className={footerClass} role="contentinfo">
      <TouchableButton 
        variant="secondary"
        onClick={handleReset}
        data-testid="reset-button"
      >
        Reset
      </TouchableButton>
      
      <TouchableButton 
        variant="primary"
        onClick={handleCompleteAll}
        data-testid="complete-all-button"
      >
        Complete All
      </TouchableButton>
    </footer>
  );
};

export default Footer;
