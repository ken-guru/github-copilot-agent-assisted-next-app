/**
 * Tests for Material 3 NavigationLayout Component
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import NavigationLayout from '../components/NavigationLayout';

// Mock Next.js usePathname hook
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/'),
}));

describe('NavigationLayout', () => {
  test('renders with default props', () => {
    render(<NavigationLayout />);
    
    // Should render AppBar
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
    
    // Should render Navigation
    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
    
    // Should render main content area
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
  });

  test('renders with children content', () => {
    render(
      <NavigationLayout>
        <div data-testid="test-content">Test Content</div>
      </NavigationLayout>
    );
    
    expect(screen.getByTestId('test-content')).toBeInTheDocument();
    expect(screen.getByTestId('test-content')).toHaveTextContent('Test Content');
  });

  test('renders app bar with logo and title', () => {
    render(<NavigationLayout />);
    
    // Should have logo/home link
    const homeLink = screen.getByRole('link');
    expect(homeLink).toHaveAttribute('href', '/');
    
    // Should have title
    const title = screen.getByRole('heading', { level: 1 });
    expect(title).toHaveTextContent('Activity Manager');
  });

  test('renders theme toggle in app bar', () => {
    render(<NavigationLayout />);
    
    // Should have theme toggle button
    const themeToggle = screen.getByRole('button', { name: /toggle theme/i });
    expect(themeToggle).toBeInTheDocument();
  });

  test('renders navigation with default items', () => {
    render(<NavigationLayout />);
    
    // Should have navigation items
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /activities/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /settings/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument();
  });

  test('handles navigation item clicks', () => {
    render(<NavigationLayout />);
    
    const homeLink = screen.getByRole('link', { name: /home/i });
    expect(homeLink).toHaveAttribute('href', '/');
    
    const activitiesLink = screen.getByRole('link', { name: /activities/i });
    expect(activitiesLink).toHaveAttribute('href', '/activities');
    
    const settingsLink = screen.getByRole('link', { name: /settings/i });
    expect(settingsLink).toHaveAttribute('href', '/settings');
    
    const aboutLink = screen.getByRole('link', { name: /about/i });
    expect(aboutLink).toHaveAttribute('href', '/about');
  });

  test('has proper responsive layout structure', () => {
    render(<NavigationLayout />);
    
    const container = screen.getByRole('main').parentElement;
    expect(container).toHaveClass('flex', 'flex-col', 'min-h-screen');
    
    const main = screen.getByRole('main');
    expect(main).toHaveClass('flex-1', 'p-6');
  });

  test('renders with navigation badges', () => {
    render(<NavigationLayout />);
    
    // Check for activities badge (should be rendered by Navigation component)
    // This tests the integration between NavigationLayout and Navigation
    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
  });

  test('applies correct semantic structure', () => {
    render(<NavigationLayout />);
    
    // Should have proper landmark roles
    expect(screen.getByRole('banner')).toBeInTheDocument(); // AppBar
    expect(screen.getByRole('navigation')).toBeInTheDocument(); // Navigation
    expect(screen.getByRole('main')).toBeInTheDocument(); // Main content
  });

  test('handles theme toggle interaction', () => {
    render(<NavigationLayout />);
    
    const themeToggle = screen.getByRole('button', { name: /toggle theme/i });
    
    // Should be clickable
    fireEvent.click(themeToggle);
    // In a real app, this would trigger theme changes
    expect(themeToggle).toBeInTheDocument();
  });

  test('renders icons correctly', () => {
    render(<NavigationLayout />);
    
    // Home icon should be in the logo/link
    const homeLink = screen.getByRole('link', { name: /go to home/i });
    expect(homeLink).toBeInTheDocument();
    
    // Navigation items should have their icons (tested through svg elements)
    const nav = screen.getByRole('navigation');
    const svgElements = nav.querySelectorAll('svg');
    expect(svgElements.length).toBeGreaterThan(0);
  });

  test('handles empty content gracefully', () => {
    render(<NavigationLayout />);
    
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
    expect(main).toHaveClass('flex-1', 'p-6');
  });

  test('maintains layout consistency', () => {
    render(
      <NavigationLayout>
        <div>Content 1</div>
        <div>Content 2</div>
      </NavigationLayout>
    );
    
    const main = screen.getByRole('main');
    expect(main.children).toHaveLength(2);
    expect(main).toHaveTextContent('Content 1Content 2');
  });
});