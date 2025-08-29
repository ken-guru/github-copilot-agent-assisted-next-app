/**
 * Tests for Material 3 Navigation Component
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Material3Navigation from '../components/Navigation';
import type { Material3NavigationItem } from '../components/Navigation';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

const mockItems: Material3NavigationItem[] = [
  {
    href: '/',
    label: 'Home',
    icon: <span data-testid="home-icon">🏠</span>,
  },
  {
    href: '/about',
    label: 'About',
    icon: <span data-testid="about-icon">ℹ️</span>,
  },
  {
    href: '/contact',
    label: 'Contact',
    icon: <span data-testid="contact-icon">📧</span>,
    badge: 3,
  },
];

describe('Material3Navigation', () => {
  test('renders navigation items correctly', () => {
    render(<Material3Navigation items={mockItems} />);
    
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
    
    expect(screen.getByTestId('home-icon')).toBeInTheDocument();
    expect(screen.getByTestId('about-icon')).toBeInTheDocument();
    expect(screen.getByTestId('contact-icon')).toBeInTheDocument();
  });

  test('shows active state for current page', () => {
    render(<Material3Navigation items={mockItems} />);
    
    // Home should be active (based on mocked pathname)
    const homeItem = screen.getByText('Home').closest('div');
    expect(homeItem).toHaveClass('text-on-secondary-container');
    expect(homeItem).toHaveClass('bg-secondary-container');
  });

  test('renders badges correctly', () => {
    render(<Material3Navigation items={mockItems} />);
    
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByLabelText('3 notifications')).toBeInTheDocument();
  });

  test('handles different variants', () => {
    const { rerender } = render(<Material3Navigation items={mockItems} variant="top" />);
    let nav = screen.getByRole('navigation');
    expect(nav).toHaveClass('sticky', 'top-0');

    rerender(<Material3Navigation items={mockItems} variant="bottom" />);
    nav = screen.getByRole('navigation');
    expect(nav).toHaveClass('fixed', 'bottom-0');
  });

  test('handles showLabels prop', () => {
    const { rerender } = render(<Material3Navigation items={mockItems} showLabels={true} />);
    expect(screen.getByText('Home')).toBeInTheDocument();

    rerender(<Material3Navigation items={mockItems} showLabels={false} />);
    expect(screen.queryByText('Home')).not.toBeInTheDocument();
  });

  test('calls onItemClick when item is clicked', () => {
    const handleItemClick = jest.fn();
    render(<Material3Navigation items={mockItems} onItemClick={handleItemClick} />);
    
    fireEvent.click(screen.getByText('About').closest('div')!);
    expect(handleItemClick).toHaveBeenCalledWith('/about');
  });

  test('handles disabled items', () => {
    const disabledItems = [
      ...mockItems,
      {
        href: '/disabled',
        label: 'Disabled',
        icon: <span>❌</span>,
        disabled: true,
      },
    ];

    render(<Material3Navigation items={disabledItems} />);
    
    const disabledItem = screen.getByText('Disabled').closest('div');
    expect(disabledItem).toHaveClass('opacity-38', 'pointer-events-none');
  });

  test('handles keyboard navigation', () => {
    const handleItemClick = jest.fn();
    render(<Material3Navigation items={mockItems} onItemClick={handleItemClick} />);
    
    const aboutItem = screen.getByText('About').closest('div')!;
    
    // Test Enter key
    fireEvent.keyDown(aboutItem, { key: 'Enter' });
    expect(handleItemClick).toHaveBeenCalledWith('/about');
    
    // Test Space key
    handleItemClick.mockClear();
    fireEvent.keyDown(aboutItem, { key: ' ' });
    expect(handleItemClick).toHaveBeenCalledWith('/about');
  });

  test('applies custom className', () => {
    render(<Material3Navigation items={mockItems} className="custom-nav-class" />);
    
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveClass('custom-nav-class');
  });

  test('applies custom elevation', () => {
    render(<Material3Navigation items={mockItems} elevation={4} />);
    
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveClass('m3-elevation-4');
  });

  test('renders with proper accessibility attributes', () => {
    render(<Material3Navigation items={mockItems} />);
    
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveAttribute('aria-label', 'Main navigation');
    
    // Check active state accessibility
    const homeItem = screen.getByText('Home').closest('div')!;
    expect(homeItem).toHaveAttribute('aria-current', 'page');
    
    // Check non-active state
    const aboutItem = screen.getByText('About').closest('div')!;
    expect(aboutItem).not.toHaveAttribute('aria-current');
  });

  test('handles large badge numbers', () => {
    const itemsWithLargeBadge = [
      {
        href: '/notifications',
        label: 'Notifications',
        icon: <span>🔔</span>,
        badge: 150,
      },
    ];

    render(<Material3Navigation items={itemsWithLargeBadge} />);
    
    expect(screen.getByText('99+')).toBeInTheDocument();
  });

  test('forwards ref correctly', () => {
    const ref = React.createRef<HTMLElement>();
    render(<Material3Navigation ref={ref} items={mockItems} />);
    
    expect(ref.current).toBeInstanceOf(HTMLElement);
    expect(ref.current?.tagName).toBe('NAV');
  });
});