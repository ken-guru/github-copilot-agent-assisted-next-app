import React, { ReactNode } from 'react';
import { useViewport } from '../hooks/useViewport';
import { useTheme } from '../context/ThemeContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from './AppLayout.module.css';

interface AppLayoutProps {
  children: ReactNode;
}

/**
 * AppLayout - Provides a responsive layout structure with header, main content, and footer
 * 
 * This component uses semantic HTML elements and adapts to mobile/desktop viewports
 */
export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { isMobile } = useViewport();
  const { theme } = useTheme();
  
  // Determine CSS classes based on viewport
  const containerClass = isMobile 
    ? `${styles.container} ${styles.mobileContainer}`
    : styles.container;
  
  const mainClass = isMobile
    ? styles.mobileMain
    : styles.main;
  
  return (
    <div 
      className={containerClass}
      data-theme={theme}
      data-testid="app-layout"
    >
      <Header />
      
      <main className={mainClass} role="main">
        {children}
      </main>
      
      <Footer />
    </div>
  );
};
