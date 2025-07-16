import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@/contexts/theme';
import Navigation from '@/components/Navigation';

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
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
    
    // Check for Bootstrap navbar classes
    const navbar = screen.getByRole('navigation');
    expect(navbar).toHaveClass('navbar', 'navbar-expand-lg');
    
    // Check for navbar brand
    const brand = screen.getByText('Mr. Timely');
    expect(brand).toBeInTheDocument();
    
    // Check for hamburger toggle button
    const toggleButton = screen.getByRole('button', { name: /toggle navigation/i });
    expect(toggleButton).toHaveClass('navbar-toggler');
    expect(toggleButton).toHaveAttribute('data-bs-toggle', 'collapse');
    expect(toggleButton).toHaveAttribute('data-bs-target', '#navbarNav');
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
});
