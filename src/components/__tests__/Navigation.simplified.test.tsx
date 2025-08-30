import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '../../contexts/theme';
import Navigation from '../Navigation';

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

describe('Navigation - Responsive Bootstrap Layout', () => {
  it('should use Bootstrap responsive navbar with proper structure', () => {
    renderWithTheme(<Navigation />);
    
    // Check for Bootstrap navbar with responsive behavior
    const navbar = screen.getByRole('navigation');
    expect(navbar).toHaveClass('navbar', 'navbar-expand-lg');
    
    // Should have mobile toggle for smaller screens
    const toggleButton = screen.getByRole('button', { name: /toggle navigation/i });
    expect(toggleButton).toBeInTheDocument();
    
    // Should have collapsible content for responsive behavior
    const navContent = navbar.querySelector('#basic-navbar-nav');
    expect(navContent).toBeInTheDocument();
  });

  it('should render navigation items with Bootstrap structure', () => {
    renderWithTheme(<Navigation />);
    
    // Check for navbar brand
    const brand = screen.getByText('Mr. Timely');
    expect(brand).toBeInTheDocument();
    
    // Check for Timer link
    const timerLink = screen.getByRole('link', { name: /timer/i });
    expect(timerLink).toHaveAttribute('href', '/');
    
    // Check for Activities link
    const activitiesLink = screen.getByRole('link', { name: /activities/i });
    expect(activitiesLink).toHaveAttribute('href', '/activities');
    
    // Check for theme toggle
    const themeGroup = screen.getByRole('group', { name: /theme selection/i });
    expect(themeGroup).toBeInTheDocument();
  });

  it('should use Bootstrap responsive layout with collapse', () => {
    renderWithTheme(<Navigation />);
    
    // The nav items should be in Bootstrap navbar structure
    const navbar = screen.getByRole('navigation');
    const containerFluid = navbar.querySelector('.container-fluid');
    expect(containerFluid).toBeInTheDocument();
    
    // Should have Bootstrap responsive navigation structure
    const navContent = containerFluid?.querySelector('.navbar-collapse');
    expect(navContent).toBeInTheDocument();
    expect(navContent).toHaveClass('navbar-collapse');
  });

  it('should maintain theme awareness in simplified layout', () => {
    renderWithTheme(<Navigation />);
    
    const navbar = screen.getByRole('navigation');
    // Should still have theme-aware classes
    expect(navbar).toHaveClass('navbar-light', 'bg-light');
  });

  it('should maintain accessibility with Bootstrap components', () => {
    renderWithTheme(<Navigation />);
    
    // Main navigation label
    expect(screen.getByLabelText('Main navigation')).toBeInTheDocument();
    
    // Navigation items should be accessible via test IDs
    expect(screen.getByTestId('timer-nav-item')).toBeInTheDocument();
    expect(screen.getByTestId('activities-nav-item')).toBeInTheDocument();
  });

  it('should provide mobile responsiveness with Bootstrap toggle', () => {
    // Mock window.innerWidth for mobile
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 320,
    });

    renderWithTheme(<Navigation />);
    
    // Should have toggle button for mobile responsiveness
    const toggleButton = screen.getByRole('button', { name: /toggle navigation/i });
    expect(toggleButton).toBeInTheDocument();
    
    // All navigation items should be present in collapsed nav
    expect(screen.getByText('Timer')).toBeInTheDocument();
    expect(screen.getByText('Activities')).toBeInTheDocument();
    expect(screen.getByRole('group', { name: /theme selection/i })).toBeInTheDocument();
  });
});
