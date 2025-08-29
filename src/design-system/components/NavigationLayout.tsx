/**
 * Material 3 Navigation Layout Component
 * Combines app bar and navigation for the application
 */

'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Material3AppBar from './AppBar';
import Material3Navigation from './Navigation';
import type { Material3NavigationItem } from './Navigation';

// Icons for navigation items
const TimerIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M15 1H9v2h6V1zm-4 13h2V8h-2v6zm8.03-6.61l1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42A8.962 8.962 0 0 0 12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9a8.994 8.994 0 0 0 7.03-14.61zM12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/>
  </svg>
);

const ActivitiesIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm4 18H6V4h7v5h5v11zm-3-7v-2H9v2h6zm0 4v-2H9v2h6z"/>
  </svg>
);

const AIIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
  </svg>
);

const ClockIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
    <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
  </svg>
);

export interface Material3NavigationLayoutProps {
  children?: React.ReactNode;
  themeToggle?: React.ReactNode;
  onNavigationClick?: (href: string) => void;
  className?: string;
}

const Material3NavigationLayout: React.FC<Material3NavigationLayoutProps> = ({
  children,
  themeToggle,
  onNavigationClick,
  className = '',
}) => {
  const pathname = usePathname();

  // Navigation items configuration
  const navigationItems: Material3NavigationItem[] = [
    {
      href: '/',
      label: 'Timer',
      icon: <TimerIcon />,
    },
    {
      href: '/activities',
      label: 'Activities',
      icon: <ActivitiesIcon />,
    },
    {
      href: '/ai',
      label: 'AI',
      icon: <AIIcon />,
    },
  ];

  return (
    <div className={`flex flex-col min-h-screen material3-navigation-layout ${className}`}>
      {/* App Bar */}
      <Material3AppBar
        title="Activity Manager"
        logo={<ClockIcon />}
        actions={themeToggle}
        scrollBehavior="elevate"
        variant="medium"
      />

      {/* Navigation Bar */}
      <Material3Navigation
        items={navigationItems}
        variant="top"
        showLabels={true}
        onItemClick={onNavigationClick}
      />

      {/* Main Content */}
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
};

export default Material3NavigationLayout;