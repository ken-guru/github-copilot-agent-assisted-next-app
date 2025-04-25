import React, { ReactNode, useState } from 'react';
import { useViewport } from '../hooks/useViewport';
import { useTheme } from '../context/ThemeContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MobileNavigation from '../components/MobileNavigation';
import styles from './AppLayout.module.css';

// Icons for mobile navigation
import { Activity, Clock, FileText } from 'react-feather';

interface AppLayoutProps {
  children: ReactNode;
  initialView?: string;
}

/**
 * AppLayout - Provides a responsive layout structure with header, main content, and footer
 * 
 * This component uses semantic HTML elements and adapts to mobile/desktop viewports
 */
export const AppLayout: React.FC<AppLayoutProps> = ({ 
  children, 
  initialView = 'activity'
}) => {
  const { isMobile } = useViewport();
  const { theme } = useTheme();
  const [activeView, setActiveView] = useState(initialView);
  
  // Navigation views configuration
  const navigationViews = [
    { id: 'activity', label: 'Activities', icon: <Activity size={20} /> },
    { id: 'timeline', label: 'Timeline', icon: <Clock size={20} /> },
    { id: 'summary', label: 'Summary', icon: <FileText size={20} /> }
  ];
  
  // Handle navigation view change
  const handleViewChange = (viewId: string) => {
    setActiveView(viewId);
    // Additional logic for view changing could go here
  };
  
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
      
      {isMobile ? (
        <MobileNavigation
          views={navigationViews}
          activeView={activeView}
          onViewChange={handleViewChange}
        />
      ) : (
        <Footer />
      )}
    </div>
  );
};
