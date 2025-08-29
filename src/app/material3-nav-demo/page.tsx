/**
 * Material 3 Navigation Demo Page
 * Demonstrates the new Material 3 navigation system
 */

'use client';

import React from 'react';
import { 
  Material3NavigationLayout, 
  Material3ThemeToggle,
  Material3Card,
  Material3Button 
} from '@/design-system';

const Material3NavigationDemo: React.FC = () => {
  const [selectedTheme, setSelectedTheme] = React.useState<'light' | 'dark' | 'system'>('system');

  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    setSelectedTheme(theme);
    console.log('Theme changed to:', theme);
  };

  const handleNavigationClick = (href: string) => {
    console.log('Navigation click:', href);
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Material 3 Navigation */}
      <Material3NavigationLayout
        themeToggle={
          <Material3ThemeToggle
            variant="icon-only"
            size="medium"
            onThemeChange={handleThemeChange}
          />
        }
        onNavigationClick={handleNavigationClick}
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          {/* Welcome Section */}
          <Material3Card variant="filled" padding="large">
            <div className="text-center space-y-4">
              <h1 className="m3-display-small text-on-surface">
                Material 3 Navigation Demo
              </h1>
              <p className="m3-body-large text-on-surface-variant">
                Experience the new Material 3 navigation system with modern design patterns
                and responsive behavior.
              </p>
            </div>
          </Material3Card>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* App Bar Feature */}
            <Material3Card variant="elevated" padding="medium">
              <div className="space-y-3">
                <h3 className="m3-title-medium text-on-surface">
                  Material 3 App Bar
                </h3>
                <p className="m3-body-medium text-on-surface-variant">
                  Responsive app bar with elevation on scroll, branding, and actions.
                </p>
                <ul className="m3-body-small text-on-surface-variant space-y-1">
                  <li>• Scroll-responsive elevation</li>
                  <li>• Logo and title support</li>
                  <li>• Action button integration</li>
                </ul>
              </div>
            </Material3Card>

            {/* Navigation Feature */}
            <Material3Card variant="elevated" padding="medium">
              <div className="space-y-3">
                <h3 className="m3-title-medium text-on-surface">
                  Navigation Bar
                </h3>
                <p className="m3-body-medium text-on-surface-variant">
                  Tab-style navigation with active states and accessibility.
                </p>
                <ul className="m3-body-small text-on-surface-variant space-y-1">
                  <li>• Active state indicators</li>
                  <li>• Icon and label support</li>
                  <li>• Badge notifications</li>
                </ul>
              </div>
            </Material3Card>

            {/* Theme Toggle Feature */}
            <Material3Card variant="elevated" padding="medium">
              <div className="space-y-3">
                <h3 className="m3-title-medium text-on-surface">
                  Theme System
                </h3>
                <p className="m3-body-medium text-on-surface-variant">
                  Material 3 theme toggle with light, dark, and system modes.
                </p>
                <div className="flex items-center gap-3">
                  <span className="m3-label-medium text-on-surface-variant">
                    Current: {selectedTheme}
                  </span>
                  <Material3ThemeToggle
                    variant="standard"
                    size="small"
                    onThemeChange={handleThemeChange}
                  />
                </div>
              </div>
            </Material3Card>
          </div>

          {/* Actions Section */}
          <Material3Card variant="outlined" padding="medium">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="m3-title-medium text-on-surface">
                  Try the Navigation
                </h3>
                <p className="m3-body-medium text-on-surface-variant">
                  Click the navigation items above to test the active states and routing.
                </p>
              </div>
              <div className="flex gap-3">
                <Material3Button variant="outlined" size="medium">
                  View Source
                </Material3Button>
                <Material3Button variant="filled" size="medium">
                  Learn More
                </Material3Button>
              </div>
            </div>
          </Material3Card>

          {/* Technical Details */}
          <Material3Card variant="filled" padding="large">
            <div className="space-y-4">
              <h2 className="m3-headline-small text-on-surface">
                Technical Implementation
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    Components
                  </h4>
                  <ul className="m3-body-small text-on-surface-variant space-y-1">
                    <li>• AppBar with scroll behavior</li>
                    <li>• Navigation with active states</li>
                    <li>• Theme toggle system</li>
                    <li>• Responsive breakpoints</li>
                    <li>• Accessibility features</li>
                  </ul>
                </div>
              </div>
            </div>
          </Material3Card>
        </div>
      </main>
    </div>
  );
};

export default Material3NavigationDemo;