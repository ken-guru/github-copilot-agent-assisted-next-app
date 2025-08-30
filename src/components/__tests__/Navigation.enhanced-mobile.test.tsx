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

// Mock window.innerWidth for responsive testing
const mockInnerWidth = (width: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
  window.dispatchEvent(new Event('resize'));
};

describe('Navigation - Bootstrap Mobile Responsive UX', () => {
  beforeEach(() => {
    // Reset to desktop width by default
    mockInnerWidth(1024);
  });

  describe('Bootstrap Structure', () => {
    it('should render with proper Bootstrap navbar structure', () => {
      renderWithTheme(<Navigation />);
      
      // Theme toggle should be in its separate container
      const themeToggleContainer = screen.getByTestId('theme-toggle-container');
      expect(themeToggleContainer).toBeInTheDocument();
      
      // Navigation should use Bootstrap structure
      const navbar = screen.getByRole('navigation');
      expect(navbar).toHaveClass('navbar', 'navbar-expand-lg');
      
      // Should have Bootstrap navbar navigation
      const navContent = navbar.querySelector('.navbar-nav');
      expect(navContent).toBeInTheDocument();
      
      // Navigation items should be properly structured
      const timerLink = screen.getByTestId('timer-nav-item');
      const activitiesLink = screen.getByTestId('activities-nav-item');
      expect(timerLink).toBeInTheDocument();
      expect(activitiesLink).toBeInTheDocument();
    });
  });

  describe('Desktop Display', () => {
    it('should show full text and icons on desktop screens', () => {
      mockInnerWidth(1024);
      renderWithTheme(<Navigation />);
      
      // Brand should show both icon and text
      const brand = screen.getByText('Mr. Timely');
      expect(brand).toBeInTheDocument();
      
      // Navigation items should show both icons and text
      expect(screen.getByText('Timer')).toBeInTheDocument();
      expect(screen.getByText('Activities')).toBeInTheDocument();
      
      // Theme toggle should be visible
      const themeGroup = screen.getByRole('group', { name: /theme selection/i });
      expect(themeGroup).toBeInTheDocument();
    });
  });

  describe('Mobile Responsive Display', () => {
    it('should provide responsive navigation with Bootstrap collapse', () => {
      mockInnerWidth(400); // Mobile width
      renderWithTheme(<Navigation />);
      
      // Should have mobile toggle button
      const toggleButton = screen.getByRole('button', { name: /toggle navigation/i });
      expect(toggleButton).toBeInTheDocument();
      
      // Icons should be present in navigation items
      const timerIcon = screen.getByTestId('timer-nav-item').querySelector('i.bi-stopwatch');
      const activitiesIcon = screen.getByTestId('activities-nav-item').querySelector('i.bi-list-check');
      
      expect(timerIcon).toBeInTheDocument();
      expect(activitiesIcon).toBeInTheDocument();
      
      // Text should be visible (Bootstrap handles responsive behavior via collapse)
      expect(screen.getByText('Timer')).toBeInTheDocument();
      expect(screen.getByText('Activities')).toBeInTheDocument();
    });

    it('should show responsive brand text', () => {
      mockInnerWidth(576);
      renderWithTheme(<Navigation />);
      
      const brand = screen.getByTestId('navbar-brand');
      
      // Brand text should be hidden on mobile
      expect(brand.querySelector('.brand-text')).toHaveClass('d-none', 'd-sm-inline');
      
      // Brand icon should be visible
      expect(brand.querySelector('.bi-clock')).toBeInTheDocument();
    });

    it('should maintain theme toggle visibility on mobile', () => {
      mockInnerWidth(576);
      renderWithTheme(<Navigation />);
      
      // Theme toggle should remain fully visible on mobile
      const themeGroup = screen.getByRole('group', { name: /theme selection/i });
      expect(themeGroup).toBeInTheDocument();
      expect(themeGroup).not.toHaveClass('d-none');
    });
  });

  describe('Responsive Breakpoints', () => {
    it('should transition from icon-only to full display at sm breakpoint (576px)', () => {
      // Test just below breakpoint (mobile)
      mockInnerWidth(575);
      const { unmount } = renderWithTheme(<Navigation />);
      
      let timerItem = screen.getByTestId('timer-nav-item');
      expect(timerItem.querySelector('.nav-text')).toHaveClass('d-none', 'd-sm-inline');
      
      // Clean up and re-render for different screen size
      unmount();
      
      // Test just above breakpoint (tablet/desktop)
      mockInnerWidth(577);
      renderWithTheme(<Navigation />);
      
      timerItem = screen.getByTestId('timer-nav-item');
      expect(timerItem.querySelector('.nav-text')).toHaveClass('d-none', 'd-sm-inline');
    });
  });

  describe('Accessibility on Mobile', () => {
    it('should maintain proper ARIA labels when text is hidden', () => {
      mockInnerWidth(576);
      renderWithTheme(<Navigation />);
      
      // Links should still have proper aria-labels even when text is hidden
      expect(screen.getByLabelText('Go to Timer')).toBeInTheDocument();
      expect(screen.getByLabelText('Go to Activities Management')).toBeInTheDocument();
    });

    it('should maintain semantic navigation structure on mobile', () => {
      mockInnerWidth(576);
      renderWithTheme(<Navigation />);
      
      // Navigation landmark should still be present
      expect(screen.getByLabelText('Main navigation')).toBeInTheDocument();
      
      // Navigation list structure should remain
      const navList = screen.getByRole('list');
      expect(navList).toBeInTheDocument();
    });
  });
});
