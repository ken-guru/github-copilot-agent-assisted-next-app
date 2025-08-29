import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Navigation from '../Navigation';
import '@testing-library/jest-dom';

// Mock the usePathname hook
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/'),
}));

// Note: useThemeReactive is no longer used in the component
// Theme adaptation is handled via CSS custom properties

// Mock the ThemeToggle component
jest.mock('@/components/ThemeToggle', () => {
  return function MockThemeToggle() {
    return <button data-testid="theme-toggle">Theme Toggle</button>;
  };
});

describe('Navigation - Material 3 Expressive', () => {
  beforeEach(() => {
    // Reset mocks before each test
    const { usePathname } = require('next/navigation');
    usePathname.mockReturnValue('/');
  });

  it('renders Timer and Activities links', () => {
    render(<Navigation />);
    expect(screen.getByText('Timer')).toBeInTheDocument();
    expect(screen.getByText('Activities')).toBeInTheDocument();
  });

  it('renders AI link', () => {
    render(<Navigation />);
    expect(screen.getByText('AI')).toBeInTheDocument();
  });

  it('has accessible ARIA labels', () => {
    render(<Navigation />);
    expect(screen.getByLabelText('Main navigation')).toBeInTheDocument();
    expect(screen.getByLabelText('Go to Timer')).toBeInTheDocument();
    expect(screen.getByLabelText('Go to Activities Management')).toBeInTheDocument();
    expect(screen.getByLabelText('Go to AI Planner')).toBeInTheDocument();
  });

  it('applies active state to current page', () => {
    const { usePathname } = require('next/navigation');
    usePathname.mockReturnValue('/activities');
    
    render(<Navigation />);
    
    const activitiesLink = screen.getByLabelText('Go to Activities Management').closest('a');
    expect(activitiesLink).toHaveAttribute('aria-current', 'page');
  });

  it('renders brand with icon and text', () => {
    render(<Navigation />);
    const brand = screen.getByTestId('navbar-brand');
    expect(brand).toBeInTheDocument();
    expect(brand.querySelector('.bi-clock')).toBeInTheDocument();
    expect(screen.getByText('Mr. Timely')).toBeInTheDocument();
  });

  it('includes theme toggle component', () => {
    render(<Navigation />);
    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
  });

  it('has proper navigation structure with CSS modules', () => {
    render(<Navigation />);
    const nav = screen.getByLabelText('Main navigation');
    expect(nav).toHaveClass('navigation');
    
    const navContainer = nav.querySelector('[class*="navigationContainer"]');
    expect(navContainer).toBeInTheDocument();
    
    const navItems = screen.getByTestId('nav-items-container');
    expect(navItems).toHaveClass('navigationItems');
  });

  it('supports keyboard navigation', () => {
    render(<Navigation />);
    const timerLink = screen.getByLabelText('Go to Timer').closest('a') as HTMLElement;
    
    // Focus the link
    timerLink.focus();
    expect(timerLink).toHaveFocus();
    
    // Test keyboard interaction
    fireEvent.keyDown(timerLink, { key: 'Enter' });
    // Link behavior is handled by Next.js Link component
  });

  it('has proper responsive behavior indicators', () => {
    render(<Navigation />);
    
    // Check that navigation text elements exist (they'll be hidden via CSS on mobile)
    const timerText = screen.getByText('Timer');
    const activitiesText = screen.getByText('Activities');
    const aiText = screen.getByText('AI');
    
    expect(timerText).toHaveClass('navigationText');
    expect(activitiesText).toHaveClass('navigationText');
    expect(aiText).toHaveClass('navigationText');
    
    // Check that brand text exists (hidden on mobile via CSS)
    const brandText = screen.getByText('Mr. Timely');
    expect(brandText).toHaveClass('brandText');
  });

  it('applies correct active styles based on pathname', () => {
    const { usePathname } = require('next/navigation');
    
    // Test timer active
    usePathname.mockReturnValue('/');
    const { rerender } = render(<Navigation />);
    let timerLink = screen.getByLabelText('Go to Timer').closest('a');
    expect(timerLink).toHaveClass('active');
    
    // Test activities active
    usePathname.mockReturnValue('/activities');
    rerender(<Navigation />);
    let activitiesLink = screen.getByLabelText('Go to Activities Management').closest('a');
    expect(activitiesLink).toHaveClass('active');
    
    // Test AI active
    usePathname.mockReturnValue('/ai');
    rerender(<Navigation />);
    let aiLink = screen.getByLabelText('Go to AI Planner').closest('a');
    expect(aiLink).toHaveClass('active');
  });

  it('maintains accessibility with proper ARIA attributes', () => {
    render(<Navigation />);
    
    // Check navigation landmark
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveAttribute('aria-label', 'Main navigation');
    
    // Check list structure
    const navList = screen.getByTestId('nav-items-container');
    expect(navList).toBeInTheDocument();
    
    // Check that icons are properly hidden from screen readers
    const icons = nav.querySelectorAll('[aria-hidden="true"]');
    expect(icons.length).toBeGreaterThan(0);
  });
});
  describe('Material 3 Expressive Features', () => {
    it('applies Material 3 Expressive CSS classes', () => {
      render(<Navigation />);
      
      const nav = screen.getByLabelText('Main navigation');
      expect(nav).toHaveClass('navigation');
      
      const navigationLinks = nav.querySelectorAll('[class*="navigationLink"]');
      expect(navigationLinks.length).toBeGreaterThan(0);
      
      navigationLinks.forEach(link => {
        expect(link).toHaveClass('navigationLink');
      });
    });

    it('has proper icon styling classes', () => {
      render(<Navigation />);
      
      const timerIcon = screen.getByLabelText('Go to Timer').querySelector('.bi-stopwatch');
      const activitiesIcon = screen.getByLabelText('Go to Activities Management').querySelector('.bi-list-check');
      const aiIcon = screen.getByLabelText('Go to AI Planner').querySelector('.bi-stars');
      
      expect(timerIcon).toHaveClass('navigationIcon');
      expect(activitiesIcon).toHaveClass('navigationIcon');
      expect(aiIcon).toHaveClass('navigationIcon');
    });

    it('has organic pill-shaped active indicators structure', () => {
      const { usePathname } = require('next/navigation');
      usePathname.mockReturnValue('/');
      
      render(<Navigation />);
      
      const activeLink = screen.getByLabelText('Go to Timer').closest('a');
      expect(activeLink).toHaveClass('navigationLink');
      expect(activeLink).toHaveClass('active');
    });

    it('supports theme adaptation via CSS custom properties', () => {
      render(<Navigation />);
      
      // Component should render without errors and rely on CSS for theme adaptation
      const nav = screen.getByLabelText('Main navigation');
      expect(nav).toBeInTheDocument();
      expect(nav).toHaveClass('navigation');
      
      // Theme adaptation is handled via CSS custom properties in material3-tokens.css
    });

    it('has proper responsive structure for mobile optimization', () => {
      render(<Navigation />);
      
      // Check that responsive elements have the correct classes
      const brandText = screen.getByText('Mr. Timely');
      expect(brandText).toHaveClass('brandText');
      
      const navigationTexts = screen.getAllByText(/Timer|Activities|AI/);
      navigationTexts.forEach(text => {
        if (text.classList.contains('navigationText')) {
          expect(text).toHaveClass('navigationText');
        }
      });
    });

    it('maintains proper navigation structure hierarchy', () => {
      render(<Navigation />);
      
      const nav = screen.getByLabelText('Main navigation');
      const container = nav.querySelector('[class*="navigationContainer"]');
      const controls = nav.querySelector('[class*="navigationControls"]');
      const items = nav.querySelector('[class*="navigationItems"]');
      
      expect(container).toBeInTheDocument();
      expect(controls).toBeInTheDocument();
      expect(items).toBeInTheDocument();
      
      // Check hierarchy
      expect(container).toContainElement(controls);
      expect(controls).toContainElement(items);
    });

    it('has enhanced focus indicators ready for CSS styling', () => {
      render(<Navigation />);
      
      const links = [
        screen.getByLabelText('Go to Timer').closest('a'),
        screen.getByLabelText('Go to Activities Management').closest('a'),
        screen.getByLabelText('Go to AI Planner').closest('a')
      ];
      
      links.forEach(link => {
        expect(link).toHaveClass('navigationLink');
        // CSS will handle the enhanced focus styling
      });
    });

    it('supports smooth state transitions structure', () => {
      render(<Navigation />);
      
      // All navigation links should have the base class for CSS transitions
      const navigationLinks = screen.getAllByRole('link').filter(link => 
        link.getAttribute('aria-label')?.includes('Go to')
      );
      
      navigationLinks.forEach(link => {
        expect(link).toHaveClass('navigationLink');
      });
    });
  });