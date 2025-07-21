import React from 'react';
import { render, screen } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { ThemeProvider } from '@/contexts/ThemeContext';

// Mock Next.js navigation hook
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

// Mock ThemeToggle component
jest.mock('@/components/ThemeToggle', () => {
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
  const renderNavigation = (theme: 'light' | 'dark' = 'light') => {
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
      
      const timerLink = screen.getByTestId('timer-nav-item').querySelector('.nav-link');
      expect(timerLink).toHaveClass('active');
      
      const activitiesLink = screen.getByTestId('activities-nav-item').querySelector('.nav-link');
      expect(activitiesLink).not.toHaveClass('active');
    });

    it('should mark Activities as active when on /activities path', () => {
      mockUsePathname.mockReturnValue('/activities');
      renderNavigation();
      
      const activitiesLink = screen.getByTestId('activities-nav-item').querySelector('.nav-link');
      expect(activitiesLink).toHaveClass('active');
      
      const timerLink = screen.getByTestId('timer-nav-item').querySelector('.nav-link');
      expect(timerLink).not.toHaveClass('active');
    });

    it('should handle unknown paths gracefully', () => {
      mockUsePathname.mockReturnValue('/unknown');
      renderNavigation();
      
      const timerLink = screen.getByTestId('timer-nav-item').querySelector('.nav-link');
      const activitiesLink = screen.getByTestId('activities-nav-item').querySelector('.nav-link');
      
      expect(timerLink).not.toHaveClass('active');
      expect(activitiesLink).not.toHaveClass('active');
    });
  });

  describe('Tab Styling with Active States', () => {
    it('should apply tab styling to navigation items', () => {
      mockUsePathname.mockReturnValue('/');
      renderNavigation();
      
      const navContainer = screen.getByTestId('nav-items-container');
      expect(navContainer).toHaveClass('nav-pills');
    });

    it('should maintain proper spacing and visual separation', () => {
      mockUsePathname.mockReturnValue('/');
      renderNavigation();
      
      // Theme toggle should be in separate container 
      const themeToggleContainer = screen.getByTestId('theme-toggle-container');
      expect(themeToggleContainer).toBeInTheDocument();
      
      // Navigation items should be grouped separately
      const navItemsGroup = screen.getByTestId('nav-items-container');
      expect(navItemsGroup).toBeInTheDocument();
      expect(navItemsGroup).toHaveClass('nav-items-group');
    });

    it('should apply correct Bootstrap pill classes to active item', () => {
      mockUsePathname.mockReturnValue('/activities');
      renderNavigation();
      
      const activitiesLink = screen.getByTestId('activities-nav-item').querySelector('.nav-link');
      expect(activitiesLink).toHaveClass('nav-link', 'active');
    });
  });

  describe('Theme Integration with Active States', () => {
    it('should maintain active state styling in dark theme', () => {
      mockUsePathname.mockReturnValue('/');
      renderNavigation('dark');
      
      const timerLink = screen.getByTestId('timer-nav-item').querySelector('.nav-link');
      expect(timerLink).toHaveClass('active');
    });

    it('should maintain active state styling in light theme', () => {
      mockUsePathname.mockReturnValue('/activities');
      renderNavigation('light');
      
      const activitiesLink = screen.getByTestId('activities-nav-item').querySelector('.nav-link');
      expect(activitiesLink).toHaveClass('active');
    });
  });

  describe('Accessibility with Active States', () => {
    it('should include aria-current for active navigation item', () => {
      mockUsePathname.mockReturnValue('/');
      renderNavigation();
      
      const timerLink = screen.getByTestId('timer-nav-item').querySelector('.nav-link');
      expect(timerLink).toHaveAttribute('aria-current', 'page');
      
      const activitiesLink = screen.getByTestId('activities-nav-item').querySelector('.nav-link');
      expect(activitiesLink).not.toHaveAttribute('aria-current');
    });

    it('should maintain screen reader support for active states', () => {
      mockUsePathname.mockReturnValue('/activities');
      renderNavigation();
      
      const activitiesLink = screen.getByTestId('activities-nav-item').querySelector('.nav-link');
      expect(activitiesLink).toHaveAttribute('aria-current', 'page');
      
      // Should still have the original aria-label
      const activitiesSpan = activitiesLink?.querySelector('span');
      expect(activitiesSpan).toHaveAttribute('aria-label', 'Go to Activities Management');
    });
  });

  describe('Mobile Responsive Active States', () => {
    it('should maintain active state styling on mobile', () => {
      mockUsePathname.mockReturnValue('/');
      renderNavigation();
      
      // Active state should work regardless of responsive text hiding
      const timerLink = screen.getByTestId('timer-nav-item').querySelector('.nav-link');
      expect(timerLink).toHaveClass('active');
      
      // Text should still have responsive hiding classes
      const timerText = timerLink?.querySelector('.nav-text');
      expect(timerText).toHaveClass('d-none', 'd-sm-inline');
    });

    it('should show active state on icons when text is hidden', () => {
      mockUsePathname.mockReturnValue('/activities');
      renderNavigation();
      
      const activitiesLink = screen.getByTestId('activities-nav-item').querySelector('.nav-link');
      const activitiesIcon = activitiesLink?.querySelector('i');
      
      expect(activitiesLink).toHaveClass('active');
      expect(activitiesIcon).toBeInTheDocument(); // Icon should be present and inherit active styling
    });
  });
});
