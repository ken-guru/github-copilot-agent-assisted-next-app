import React from 'react';
import { useViewport } from '../hooks/useViewport';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
import styles from './Header.module.css';

/**
 * Header - The application header with logo and theme toggle
 * 
 * Adapts to mobile and desktop viewports
 */
const Header: React.FC = () => {
  const { isMobile } = useViewport();
  
  // Apply appropriate class based on viewport
  const headerClass = isMobile
    ? styles.mobileHeader
    : styles.header;
  
  return (
    <header className={headerClass} role="banner">
      <Logo />
      <ThemeToggle />
    </header>
  );
};

export default Header;
