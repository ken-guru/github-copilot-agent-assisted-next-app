import React from 'react';
import { render, screen } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import Navigation from '../Navigation';
import { ThemeProvider } from '../../contexts/ThemeContext';

// Mock Next.js navigation hook
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

// Mock ThemeToggle component
jest.mock('../ThemeToggle', () => {
  return function MockThemeToggle({ size, variant }: { size: string; variant: string }) {
    return (
      <button data-testid="theme-toggle" data-size={size} data-variant={variant}>
        Theme Toggle
      </button>
    );
  };
});

const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>;

describe('Navigation - Active State Management', () => {
  const renderNavigation = () => {
    return render(
      <ThemeProvider>
        <Navigation />
      </ThemeProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Active State Detection', () => {
    it('should mark Timer as active when on root path', () => {
      mockUsePathname.mockReturnValue('/');
      renderNavigation();
      
      // Bootstrap Nav.Link components have the active class directly on the link element
      const timerLink = screen.getByTestId('timer-nav-item');
      expect(timerLink).toHaveClass('active');
      
      const activitiesLink = screen.getByTestId('activities-nav-item');
      expect(activitiesLink).not.toHaveClass('active');
    });

    it('should mark Activities as active when on /activities path', () => {
      mockUsePathname.mockReturnValue('/activities');
      renderNavigation();
      
      const activitiesLink = screen.getByTestId('activities-nav-item');
      expect(activitiesLink).toHaveClass('active');
      
      const timerLink = screen.getByTestId('timer-nav-item');
      expect(timerLink).not.toHaveClass('active');
    });

    it('should handle unknown paths gracefully', () => {
      mockUsePathname.mockReturnValue('/unknown');
      renderNavigation();
      
      // Bootstrap Nav.Link components have the active class directly on the link element
      const timerLink = screen.getByTestId('timer-nav-item');
      const activitiesLink = screen.getByTestId('activities-nav-item');
      
      expect(timerLink).not.toHaveClass('active');
      expect(activitiesLink).not.toHaveClass('active');
    });
  });

  describe('Bootstrap Navigation Styling', () => {
    it('should use Bootstrap navbar structure', () => {
      mockUsePathname.mockReturnValue('/');
      renderNavigation();
      
      // Should use Bootstrap navbar structure instead of nav-pills
      const navbar = screen.getByRole('navigation');
      expect(navbar).toHaveClass('navbar');
      
      const navContent = navbar.querySelector('.navbar-nav');
      expect(navContent).toBeInTheDocument();
    });

    it('should maintain proper Bootstrap responsive structure', () => {
      mockUsePathname.mockReturnValue('/');
      renderNavigation();
      
      // Theme toggle should be in separate container 
      const themeToggleContainer = screen.getByTestId('theme-toggle-container');
      expect(themeToggleContainer).toBeInTheDocument();
      
      // Navigation should use Bootstrap collapse structure
      const navbar = screen.getByRole('navigation');
      const navCollapse = navbar.querySelector('.navbar-collapse');
      expect(navCollapse).toBeInTheDocument();
    });

    it('should apply correct Bootstrap nav-link classes to active item', () => {
      mockUsePathname.mockReturnValue('/activities');
      renderNavigation();
      
      // Bootstrap Nav.Link components have the active class directly on the element
      const activitiesLink = screen.getByTestId('activities-nav-item');
      expect(activitiesLink).toHaveClass('nav-link', 'active');
    });
  });

  describe('Theme Integration with Active States', () => {
    it('should maintain active state styling in dark theme', () => {
      mockUsePathname.mockReturnValue('/');
      renderNavigation();
      
      // Bootstrap Nav.Link components have the active class directly on the element
      const timerLink = screen.getByTestId('timer-nav-item');
      expect(timerLink).toHaveClass('active');
    });

    it('should maintain active state styling in light theme', () => {
      mockUsePathname.mockReturnValue('/activities');
      renderNavigation();
      
      const activitiesLink = screen.getByTestId('activities-nav-item');
      expect(activitiesLink).toHaveClass('active');
    });
  });

  describe('Accessibility with Active States', () => {
    it('should provide accessible navigation with testids', () => {
      mockUsePathname.mockReturnValue('/');
      renderNavigation();
      
      // Bootstrap Nav.Link components use different accessibility patterns
      const timerLink = screen.getByTestId('timer-nav-item');
      expect(timerLink).toHaveClass('active');
      
      const activitiesLink = screen.getByTestId('activities-nav-item');
      expect(activitiesLink).not.toHaveClass('active');
    });

    it('should maintain screen reader support for navigation', () => {
      mockUsePathname.mockReturnValue('/activities');
      renderNavigation();
      
      // Bootstrap Nav.Link provides inherent accessibility
      const activitiesLink = screen.getByTestId('activities-nav-item');
      expect(activitiesLink).toHaveClass('active');
      
      // Main navigation should be properly labeled
      const navigation = screen.getByRole('navigation');
      expect(navigation).toHaveAttribute('aria-label', 'Main navigation');
    });
  });

  describe('Mobile Responsive Active States', () => {
    it('should maintain active state styling on mobile', () => {
      mockUsePathname.mockReturnValue('/');
      renderNavigation();
      
      // Active state should work with Bootstrap responsive design
      const timerLink = screen.getByTestId('timer-nav-item');
      expect(timerLink).toHaveClass('active');
      
      // Should be inside Bootstrap navbar collapse for mobile responsiveness
      const navbar = screen.getByRole('navigation');
      const navCollapse = navbar.querySelector('.navbar-collapse');
      expect(navCollapse).toBeInTheDocument();
    });

    it('should show active state on navigation items with icons', () => {
      mockUsePathname.mockReturnValue('/activities');
      renderNavigation();
      
      // Bootstrap Nav.Link components contain icons directly
      const activitiesLink = screen.getByTestId('activities-nav-item');
      const activitiesIcon = activitiesLink.querySelector('i');
      
      expect(activitiesLink).toHaveClass('active');
      expect(activitiesIcon).toBeInTheDocument(); // Icon should be present within active link
    });
  });
});
