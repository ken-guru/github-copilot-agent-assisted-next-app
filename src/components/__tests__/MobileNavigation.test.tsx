import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MobileNavigation from '../MobileNavigation';
import { useViewport } from '../../hooks/useViewport';

// Mock the useViewport hook
jest.mock('../../hooks/useViewport', () => ({
  useViewport: jest.fn()
}));

describe('MobileNavigation Component', () => {
  const mockViews = [
    { id: 'activity', label: 'Activities', icon: 'A' },
    { id: 'timeline', label: 'Timeline', icon: 'T' },
    { id: 'summary', label: 'Summary', icon: 'S' }
  ];

  const defaultProps = {
    views: mockViews,
    activeView: 'activity',
    onViewChange: jest.fn()
  };
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default to mobile viewport
    (useViewport as jest.Mock).mockReturnValue({
      isMobile: true,
      hasTouch: true,
      width: 375,
      height: 667
    });
  });

  test('renders mobile navigation container', () => {
    render(<MobileNavigation {...defaultProps} />);
    
    const navContainer = screen.getByTestId('mobile-navigation');
    expect(navContainer).toBeInTheDocument();
    expect(navContainer).toHaveClass('mobileNav');
  });

  test('renders all provided view buttons', () => {
    render(<MobileNavigation {...defaultProps} />);
    
    // Check for all view buttons
    mockViews.forEach(view => {
      const button = screen.getByTestId(`nav-button-${view.id}`);
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent(view.label);
    });
  });

  test('highlights the active view button', () => {
    render(<MobileNavigation {...defaultProps} />);
    
    // Active button should have active class
    const activeButton = screen.getByTestId(`nav-button-${defaultProps.activeView}`);
    expect(activeButton).toHaveClass('activeButton');
    
    // Other buttons should not have active class
    mockViews
      .filter(view => view.id !== defaultProps.activeView)
      .forEach(view => {
        const inactiveButton = screen.getByTestId(`nav-button-${view.id}`);
        expect(inactiveButton).not.toHaveClass('activeButton');
      });
  });

  test('calls onViewChange when a button is clicked', () => {
    render(<MobileNavigation {...defaultProps} />);
    
    // Click on a non-active button
    const inactiveButton = screen.getByTestId('nav-button-timeline');
    fireEvent.click(inactiveButton);
    
    // Check if callback was called with correct view
    expect(defaultProps.onViewChange).toHaveBeenCalledWith('timeline');
  });

  test('does not call onViewChange when active button is clicked', () => {
    render(<MobileNavigation {...defaultProps} />);
    
    // Click on already active button
    const activeButton = screen.getByTestId(`nav-button-${defaultProps.activeView}`);
    fireEvent.click(activeButton);
    
    // Callback should not be called
    expect(defaultProps.onViewChange).not.toHaveBeenCalled();
  });

  test('applies touch-friendly dimensions to navigation buttons', () => {
    render(<MobileNavigation {...defaultProps} />);
    
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
    
    // Check that each button has sufficient touch size
    buttons.forEach(button => {
      const styles = window.getComputedStyle(button);
      const minDimension = 44; // Minimum size in pixels for touch targets
      
      // getComputedStyle returns dimensions with 'px' suffix
      const height = parseInt(styles.height);
      const width = parseInt(styles.width);
      
      expect(height).toBeGreaterThanOrEqual(minDimension);
      expect(width).toBeGreaterThanOrEqual(minDimension);
    });
  });

  test('shows transition animation when view changes', () => {
    const { rerender } = render(<MobileNavigation {...defaultProps} />);
    
    // Initial state
    const navContainer = screen.getByTestId('mobile-navigation');
    expect(navContainer).toHaveStyle({ transition: expect.any(String) });
    
    // Change active view
    rerender(<MobileNavigation {...defaultProps} activeView="timeline" />);
    
    // Animation class should be applied
    expect(navContainer).toHaveClass('animating');
  });

  test('supports swipe gestures to navigate between views', () => {
    render(<MobileNavigation {...defaultProps} />);
    
    const navContainer = screen.getByTestId('mobile-navigation');
    
    // Simulate swipe left
    fireEvent.touchStart(navContainer, { touches: [{ clientX: 300, clientY: 50 }] });
    fireEvent.touchMove(navContainer, { touches: [{ clientX: 100, clientY: 50 }] });
    fireEvent.touchEnd(navContainer);
    
    // Should navigate to next view
    expect(defaultProps.onViewChange).toHaveBeenCalledWith('timeline');
    
    // Reset mock
    defaultProps.onViewChange.mockClear();
    
    // Simulate swipe right
    fireEvent.touchStart(navContainer, { touches: [{ clientX: 100, clientY: 50 }] });
    fireEvent.touchMove(navContainer, { touches: [{ clientX: 300, clientY: 50 }] });
    fireEvent.touchEnd(navContainer);
    
    // At first view, swipe right should either do nothing or cycle to last view
    // In this implementation, we'll check it does nothing when at first view
    expect(defaultProps.onViewChange).not.toHaveBeenCalled();
  });

  test('is not rendered on desktop', () => {
    // Mock desktop viewport
    (useViewport as jest.Mock).mockReturnValue({
      isMobile: false,
      hasTouch: false,
      width: 1024,
      height: 768
    });
    
    render(<MobileNavigation {...defaultProps} />);
    
    // Navigation should not be rendered for desktop
    expect(screen.queryByTestId('mobile-navigation')).not.toBeInTheDocument();
  });

  test('has proper accessibility attributes', () => {
    render(<MobileNavigation {...defaultProps} />);
    
    // Check nav element has correct role
    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
    expect(nav).toHaveAttribute('aria-label', 'View Navigation');
    
    // Check buttons have proper accessibility attributes
    mockViews.forEach(view => {
      const button = screen.getByTestId(`nav-button-${view.id}`);
      expect(button).toHaveAttribute('aria-pressed', view.id === defaultProps.activeView ? 'true' : 'false');
    });
  });
});
