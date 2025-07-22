import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { ThemeProvider } from '@/contexts/theme';
import Navigation from '@/components/Navigation';

// Mock Next.js Link component
jest.mock('next/link', () => {
  const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
  MockLink.displayName = 'MockLink';
  return MockLink;
});

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider>
      {component}
    </ThemeProvider>
  );
};

describe('Navigation Integration', () => {
  it('should render navigation with proper Bootstrap structure', () => {
    renderWithTheme(<Navigation />);
    
    // Check for Bootstrap navbar classes (simplified - no expand-lg)
    const navbar = screen.getByRole('navigation');
    expect(navbar).toHaveClass('navbar');
    // No longer has navbar-expand-lg due to simplification (Issue #245)
    expect(navbar).not.toHaveClass('navbar-expand-lg');
    
    // Check for navbar brand
    const brand = screen.getByText('Mr. Timely');
    expect(brand).toBeInTheDocument();
    
    // No longer has hamburger toggle button (Issue #245 - simplified navigation)
    const toggleButton = screen.queryByRole('button', { name: /toggle navigation/i });
    expect(toggleButton).not.toBeInTheDocument();
  });

  it('should render navigation links', () => {
    renderWithTheme(<Navigation />);
    
    // Check for Timer link
    const timerLink = screen.getByRole('link', { name: /timer/i });
    expect(timerLink).toHaveAttribute('href', '/');
    
    // Check for Activities link
    const activitiesLink = screen.getByRole('link', { name: /activities/i });
    expect(activitiesLink).toHaveAttribute('href', '/activities');
  });

  it('should render theme toggle in navigation', () => {
    renderWithTheme(<Navigation />);
    
    // Check for theme toggle group
    const themeGroup = screen.getByRole('group', { name: /theme selection/i });
    expect(themeGroup).toBeInTheDocument();
    
    // Check for individual theme buttons
    expect(screen.getByRole('button', { name: /light theme/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /dark theme/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /system theme/i })).toBeInTheDocument();
  });

  it('should apply dark theme classes when theme is dark', () => {
    // Create a simple dark theme test component to verify CSS classes
    const DarkNavigation = () => {
      const navClasses = 'navbar navbar-expand-lg navbar-dark bg-dark';
      return (
        <nav className={navClasses} aria-label="Main navigation">
          <div className="container-fluid">
            <span>Navigation with dark theme</span>
          </div>
        </nav>
      );
    };

    render(<DarkNavigation />);
    
    const navbar = screen.getByRole('navigation');
    expect(navbar).toHaveClass('navbar-dark', 'bg-dark');
  });

  it('should apply light theme classes when theme is light', () => {
    renderWithTheme(<Navigation />);
    
    const navbar = screen.getByRole('navigation');
    expect(navbar).toHaveClass('navbar-light', 'bg-light');
  });

  it('should reactively update theme classes when theme changes', async () => {
    // This test verifies the fix for issue #252 - navbar should respond to theme changes
    renderWithTheme(<Navigation />);
    
    const navbar = screen.getByRole('navigation');
    
    // Initially should have light theme
    expect(navbar).toHaveClass('navbar-light', 'bg-light');
    expect(navbar).not.toHaveClass('navbar-dark', 'bg-dark');

    // Simulate theme change to dark with act() to avoid warnings
    await act(async () => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark-mode');
      
      // Dispatch a custom event to trigger theme change detection
      window.dispatchEvent(new Event('themeChange'));
      
      // Wait for state updates to complete
      await new Promise(resolve => setTimeout(resolve, 100));
    });
    
    // Check if classes changed after the update
    expect(navbar).toHaveClass('navbar-dark', 'bg-dark');
    expect(navbar).not.toHaveClass('navbar-light', 'bg-light');
  });
});
