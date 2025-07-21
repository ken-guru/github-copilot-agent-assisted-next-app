import React from 'react';
import { render, screen } from '@testing-library/react';
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

// Mock window.innerWidth for responsive testing
const mockInnerWidth = (width: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
  window.dispatchEvent(new Event('resize'));
};

describe('Navigation - Enhanced Mobile UX (Follow-up improvements)', () => {
  beforeEach(() => {
    // Reset to desktop width by default
    mockInnerWidth(1024);
  });

  describe('Item Order', () => {
    it('should render items in correct order: Theme Toggle, Timer, Activities', () => {
      renderWithTheme(<Navigation />);
      
      const navItems = screen.getByTestId('nav-items-container');
      const listItems = navItems.querySelectorAll('li');
      
      // Check the order: ThemeToggle (first), Timer (second), Activities (third)
      expect(listItems[0]).toHaveClass('theme-toggle-item');
      expect(listItems[1]).toHaveClass('timer-item');
      expect(listItems[2]).toHaveClass('activities-item');
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

  describe('Mobile Icon-Only Display', () => {
    it('should show icon-only navigation items on small screens', () => {
      mockInnerWidth(576); // Mobile screen size
      renderWithTheme(<Navigation />);
      
      // Timer and Activities text should be hidden on mobile (accessible via aria-label only)
      const timerItem = screen.getByTestId('timer-nav-item');
      const activitiesItem = screen.getByTestId('activities-nav-item');
      
      // Text should be visually hidden but accessible
      expect(timerItem.querySelector('.nav-text')).toHaveClass('d-none', 'd-sm-inline');
      expect(activitiesItem.querySelector('.nav-text')).toHaveClass('d-none', 'd-sm-inline');
      
      // Icons should be visible
      expect(timerItem.querySelector('.bi-stopwatch')).toBeInTheDocument();
      expect(activitiesItem.querySelector('.bi-list-check')).toBeInTheDocument();
    });

    it('should show icon-only brand on small screens', () => {
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
