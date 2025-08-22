import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '../../contexts/theme';
import { GlobalTimerProvider } from '../../contexts/GlobalTimerContext';
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
    <GlobalTimerProvider>
      <ThemeProvider>
        {component}
      </ThemeProvider>
    </GlobalTimerProvider>
  );
};

describe('Navigation - Simplified Layout (Issue #245)', () => {
  it('should render all navigation items inline without collapse toggle on all screen sizes', () => {
    renderWithTheme(<Navigation />);
    
    // Check for Bootstrap navbar classes but without expand-lg (no collapsing)
    const navbar = screen.getByRole('navigation');
    expect(navbar).toHaveClass('navbar');
    expect(navbar).not.toHaveClass('navbar-expand-lg');
    
    // Should NOT have hamburger toggle button since we're simplifying
    const toggleButton = screen.queryByRole('button', { name: /toggle navigation/i });
    expect(toggleButton).not.toBeInTheDocument();
    
    // Should NOT have collapsible div structure
    const collapseDiv = screen.queryByTestId('navbarNav');
    expect(collapseDiv).not.toBeInTheDocument();
  });

  it('should render navigation items in a simple horizontal layout', () => {
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

  it('should use flexbox for simple responsive layout', () => {
    renderWithTheme(<Navigation />);
    
    // The nav items should be in a simple flex container
    const navbar = screen.getByRole('navigation');
    const containerFluid = navbar.querySelector('.container-fluid');
    expect(containerFluid).toBeInTheDocument();
    
    // Should have a simple nav structure without collapse classes
    const navContent = containerFluid?.querySelector('.navbar-nav');
    if (navContent) {
      expect(navContent).not.toHaveClass('collapse');
      expect(navContent).not.toHaveClass('navbar-collapse');
    }
  });

  it('should maintain theme awareness in simplified layout', () => {
    renderWithTheme(<Navigation />);
    
    const navbar = screen.getByRole('navigation');
    // Should still have theme-aware classes
    expect(navbar).toHaveClass('navbar-light', 'bg-light');
  });

  it('should maintain accessibility in simplified layout', () => {
    renderWithTheme(<Navigation />);
    
    // Main navigation label
    expect(screen.getByLabelText('Main navigation')).toBeInTheDocument();
    
    // Individual link labels
    expect(screen.getByLabelText('Go to Timer')).toBeInTheDocument();
    expect(screen.getByLabelText('Go to Activities Management')).toBeInTheDocument();
  });

  it('should work on mobile screens without dropdown complexity', () => {
    // Mock window.innerWidth for mobile
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 320,
    });

    renderWithTheme(<Navigation />);
    
    // Even on mobile, no toggle button should exist
    const toggleButton = screen.queryByRole('button', { name: /toggle navigation/i });
    expect(toggleButton).not.toBeInTheDocument();
    
    // All navigation items should be visible
    expect(screen.getByText('Timer')).toBeInTheDocument();
    expect(screen.getByText('Activities')).toBeInTheDocument();
    expect(screen.getByRole('group', { name: /theme selection/i })).toBeInTheDocument();
  });
});
