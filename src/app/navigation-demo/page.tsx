'use client';

import React, { useState } from 'react';
import { 
  Material3NavigationRail, 
  Material3TabBar, 
  Material3NavigationDrawer,
  Material3Button,
  Material3Card
} from '@/design-system/components';
import ThemeToggle from '@/components/ThemeToggle';

// Icons for navigation items
const TimerIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M15 1H9v2h6V1zm-4 13h2V8h-2v6zm8.03-6.61l1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42A8.962 8.962 0 0 0 12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9a8.994 8.994 0 0 0 7.03-14.61zM12 20c-3.87 0-7-3.13-7 7s3.13 7 7 7 7-3.13 7-7-3.13 7-7 7z"/>
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

const SettingsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.43-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
  </svg>
);

const ProfileIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
  </svg>
);

const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
  </svg>
);

const NavigationDemo: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeDemo, setActiveDemo] = useState<'rail' | 'tabs' | 'drawer'>('rail');

  // Navigation items for all components
  const navigationItems = [
    {
      href: '/',
      label: 'Timer',
      icon: <TimerIcon />,
    },
    {
      href: '/activities',
      label: 'Activities',
      icon: <ActivitiesIcon />,
      badge: 3,
    },
    {
      href: '/ai',
      label: 'AI',
      icon: <AIIcon />,
    },
  ];

  // Drawer sections
  const drawerSections = [
    {
      title: 'Main',
      items: [
        {
          href: '/',
          label: 'Timer',
          icon: <TimerIcon />,
        },
        {
          href: '/activities',
          label: 'Activities',
          icon: <ActivitiesIcon />,
          badge: 3,
        },
        {
          href: '/ai',
          label: 'AI',
          icon: <AIIcon />,
        },
      ],
    },
    {
      title: 'Settings',
      items: [
        {
          href: '/settings',
          label: 'Settings',
          icon: <SettingsIcon />,
          divider: true,
        },
        {
          href: '/profile',
          label: 'Profile',
          icon: <ProfileIcon />,
        },
      ],
    },
  ];

  const handleNavigationClick = (href: string) => {
    console.log('Navigation clicked:', href);
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-outline-variant">
        <h1 className="m3-headline-large text-on-surface">
          Material 3 Navigation Components
        </h1>
        <div className="flex items-center gap-4">
          <ThemeToggle size="md" variant="standalone" />
          <Material3Button
            variant="outlined"
            size="medium"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open navigation drawer"
          >
            <MenuIcon />
          </Material3Button>
        </div>
      </div>

      {/* Demo selector */}
      <div className="p-6 border-b border-outline-variant">
        <Material3TabBar
          tabs={[
            { href: '#rail', label: 'Navigation Rail', icon: <ActivitiesIcon /> },
            { href: '#tabs', label: 'Tab Bar', icon: <TimerIcon /> },
            { href: '#drawer', label: 'Navigation Drawer', icon: <MenuIcon /> },
          ]}
          onTabClick={(href) => {
            const demo = href.replace('#', '') as 'rail' | 'tabs' | 'drawer';
            setActiveDemo(demo);
          }}
          showIcons={true}
          scrollable={false}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 p-6 space-y-8">
        {/* Navigation Rail Demo */}
        {activeDemo === 'rail' && (
          <div className="space-y-6">
            <div>
              <h2 className="m3-headline-medium text-on-surface mb-4">
                Navigation Rail
              </h2>
              <p className="m3-body-large text-on-surface-variant mb-6">
                Vertical navigation component for desktop and tablet viewports.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Standard Navigation Rail */}
              <Material3Card variant="outlined" padding="none">
                <div className="relative h-96 overflow-hidden">
                  <h3 className="m3-title-medium text-on-surface p-4 border-b border-outline-variant">
                    Standard Navigation Rail
                  </h3>
                  <div className="relative h-80">
                    <Material3NavigationRail
                      items={navigationItems}
                      onItemClick={handleNavigationClick}
                      header={<TimerIcon />}
                      footer={<SettingsIcon />}
                      compact={false}
                    />
                    <div className="ml-20 p-4">
                      <p className="m3-body-medium text-on-surface-variant">
                        Content area with standard navigation rail (80px width)
                      </p>
                    </div>
                  </div>
                </div>
              </Material3Card>

              {/* Compact Navigation Rail */}
              <Material3Card variant="outlined" padding="none">
                <div className="relative h-96 overflow-hidden">
                  <h3 className="m3-title-medium text-on-surface p-4 border-b border-outline-variant">
                    Compact Navigation Rail
                  </h3>
                  <div className="relative h-80">
                    <Material3NavigationRail
                      items={navigationItems}
                      onItemClick={handleNavigationClick}
                      header={<TimerIcon />}
                      footer={<SettingsIcon />}
                      compact={true}
                    />
                    <div className="ml-14 p-4">
                      <p className="m3-body-medium text-on-surface-variant">
                        Content area with compact navigation rail (56px width)
                      </p>
                    </div>
                  </div>
                </div>
              </Material3Card>
            </div>
          </div>
        )}

        {/* Tab Bar Demo */}
        {activeDemo === 'tabs' && (
          <div className="space-y-6">
            <div>
              <h2 className="m3-headline-medium text-on-surface mb-4">
                Tab Bar
              </h2>
              <p className="m3-body-large text-on-surface-variant mb-6">
                Horizontal tab navigation with scrollable behavior.
              </p>
            </div>

            <div className="space-y-6">
              {/* Primary Tab Bar */}
              <Material3Card variant="outlined" padding="none">
                <div>
                  <h3 className="m3-title-medium text-on-surface p-4 border-b border-outline-variant">
                    Primary Tab Bar
                  </h3>
                  <Material3TabBar
                    tabs={navigationItems}
                    variant="primary"
                    onTabClick={handleNavigationClick}
                    showIcons={true}
                    scrollable={false}
                  />
                  <div className="p-4">
                    <p className="m3-body-medium text-on-surface-variant">
                      Primary variant with icons and labels
                    </p>
                  </div>
                </div>
              </Material3Card>

              {/* Secondary Tab Bar */}
              <Material3Card variant="outlined" padding="none">
                <div>
                  <h3 className="m3-title-medium text-on-surface p-4 border-b border-outline-variant">
                    Secondary Tab Bar
                  </h3>
                  <Material3TabBar
                    tabs={navigationItems}
                    variant="secondary"
                    onTabClick={handleNavigationClick}
                    showIcons={true}
                    scrollable={false}
                  />
                  <div className="p-4">
                    <p className="m3-body-medium text-on-surface-variant">
                      Secondary variant with different surface color
                    </p>
                  </div>
                </div>
              </Material3Card>

              {/* Scrollable Tab Bar */}
              <Material3Card variant="outlined" padding="none">
                <div>
                  <h3 className="m3-title-medium text-on-surface p-4 border-b border-outline-variant">
                    Scrollable Tab Bar
                  </h3>
                  <Material3TabBar
                    tabs={[
                      ...navigationItems,
                      { href: '/settings', label: 'Settings', icon: <SettingsIcon /> },
                      { href: '/profile', label: 'Profile', icon: <ProfileIcon /> },
                      { href: '/help', label: 'Help & Support', icon: <AIIcon /> },
                      { href: '/feedback', label: 'Feedback', icon: <SettingsIcon /> },
                    ]}
                    variant="primary"
                    onTabClick={handleNavigationClick}
                    showIcons={true}
                    scrollable={true}
                  />
                  <div className="p-4">
                    <p className="m3-body-medium text-on-surface-variant">
                      Scrollable variant for many tabs
                    </p>
                  </div>
                </div>
              </Material3Card>
            </div>
          </div>
        )}

        {/* Navigation Drawer Demo */}
        {activeDemo === 'drawer' && (
          <div className="space-y-6">
            <div>
              <h2 className="m3-headline-medium text-on-surface mb-4">
                Navigation Drawer
              </h2>
              <p className="m3-body-large text-on-surface-variant mb-6">
                Slide-out navigation menu for mobile and desktop.
              </p>
            </div>

            <div className="space-y-4">
              <Material3Button
                variant="filled"
                size="medium"
                onClick={() => setDrawerOpen(true)}
              >
                Open Navigation Drawer
              </Material3Button>

              <Material3Card variant="filled" padding="large">
                <div className="space-y-4">
                  <h3 className="m3-title-medium text-on-surface">
                    Drawer Features
                  </h3>
                  <ul className="m3-body-medium text-on-surface-variant space-y-2">
                    <li>• Modal variant with backdrop</li>
                    <li>• Sectioned navigation items</li>
                    <li>• Header and footer areas</li>
                    <li>• Keyboard navigation support</li>
                    <li>• Badge and disabled state support</li>
                    <li>• Auto-close on navigation (modal)</li>
                  </ul>
                </div>
              </Material3Card>
            </div>
          </div>
        )}

        {/* Technical Details */}
        <Material3Card variant="outlined" padding="large">
          <div className="space-y-4">
            <h2 className="m3-headline-small text-on-surface">
              Technical Implementation
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="m3-title-small text-on-surface mb-2">
                  Design Tokens
                </h4>
                <ul className="m3-body-small text-on-surface-variant space-y-1">
                  <li>• Material 3 color system</li>
                  <li>• Typography scale</li>
                  <li>• Elevation and shadows</li>
                  <li>• Shape and border radius</li>
                  <li>• Motion and transitions</li>
                </ul>
              </div>
              <div>
                <h4 className="m3-title-small text-on-surface mb-2">
                  Accessibility
                </h4>
                <ul className="m3-body-small text-on-surface-variant space-y-1">
                  <li>• ARIA labels and roles</li>
                  <li>• Keyboard navigation</li>
                  <li>• Focus management</li>
                  <li>• Screen reader support</li>
                  <li>• Active state indication</li>
                </ul>
              </div>
              <div>
                <h4 className="m3-title-small text-on-surface mb-2">
                  Responsive Design
                </h4>
                <ul className="m3-body-small text-on-surface-variant space-y-1">
                  <li>• Navigation Rail (desktop)</li>
                  <li>• Tab Bar (tablet)</li>
                  <li>• Navigation Drawer (mobile)</li>
                  <li>• Adaptive layouts</li>
                  <li>• Touch-friendly targets</li>
                </ul>
              </div>
            </div>
          </div>
        </Material3Card>
      </div>

      {/* Navigation Drawer */}
      <Material3NavigationDrawer
        sections={drawerSections}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        variant="modal"
        onItemClick={handleNavigationClick}
        header={
          <div className="flex items-center gap-3">
            <TimerIcon />
            <span className="m3-title-medium text-on-surface">Activity Manager</span>
          </div>
        }
        footer={
          <div className="flex items-center gap-3">
            <ProfileIcon />
            <span className="m3-body-medium text-on-surface-variant">User Profile</span>
          </div>
        }
      />
    </div>
  );
};

export default NavigationDemo;