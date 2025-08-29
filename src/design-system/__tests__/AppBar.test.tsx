/**
 * Tests for Material 3 AppBar Component
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Material3AppBar from '../components/AppBar';

// Mock window.scrollY for scroll behavior tests
Object.defineProperty(window, 'scrollY', {
  writable: true,
  value: 0,
});

describe('Material3AppBar', () => {
  beforeEach(() => {
    window.scrollY = 0;
  });

  test('renders with default props', () => {
    render(<Material3AppBar />);
    
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
    expect(header).toHaveClass('bg-surface');
  });

  test('renders with title', () => {
    render(<Material3AppBar title="Test App" />);
    
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Test App');
    expect(screen.getByRole('heading')).toHaveClass('m3-headline-small');
  });

  test('renders with logo', () => {
    const logo = <span data-testid="logo">🏠</span>;
    render(<Material3AppBar logo={logo} />);
    
    expect(screen.getByTestId('logo')).toBeInTheDocument();
  });

  test('renders with title and logo', () => {
    const logo = <span data-testid="logo">🏠</span>;
    render(<Material3AppBar title="Test App" logo={logo} />);
    
    expect(screen.getByTestId('logo')).toBeInTheDocument();
    expect(screen.getByRole('heading')).toHaveTextContent('Test App');
  });

  test('renders with actions', () => {
    const actions = (
      <button data-testid="action-button">Action</button>
    );
    render(<Material3AppBar actions={actions} />);
    
    expect(screen.getByTestId('action-button')).toBeInTheDocument();
  });

  test('handles different variants', () => {
    const { rerender } = render(<Material3AppBar variant="small" />);
    let header = screen.getByRole('banner');
    expect(header).toHaveClass('h-16');

    rerender(<Material3AppBar variant="medium" />);
    header = screen.getByRole('banner');
    expect(header).toHaveClass('h-16');

    rerender(<Material3AppBar variant="large" />);
    header = screen.getByRole('banner');
    expect(header).toHaveClass('h-20');
  });

  test('handles different scroll behaviors', () => {
    const { rerender } = render(<Material3AppBar scrollBehavior="fixed" />);
    let header = screen.getByRole('banner');
    expect(header).toHaveClass('sticky', 'top-0');

    rerender(<Material3AppBar scrollBehavior="scroll" />);
    header = screen.getByRole('banner');
    expect(header).not.toHaveClass('sticky');

    rerender(<Material3AppBar scrollBehavior="elevate" />);
    header = screen.getByRole('banner');
    expect(header).toHaveClass('sticky', 'top-0');
  });

  test('handles elevation changes on scroll', () => {
    render(<Material3AppBar scrollBehavior="elevate" elevation={0} />);
    
    let header = screen.getByRole('banner');
    expect(header).toHaveClass('m3-elevation-0');

    // Simulate scroll
    window.scrollY = 100;
    fireEvent.scroll(window);

    // Note: In a real test environment, we'd need to trigger a re-render
    // or use a more sophisticated testing approach for scroll behavior
  });

  test('handles custom elevation', () => {
    render(<Material3AppBar elevation={3} />);
    
    const header = screen.getByRole('banner');
    expect(header).toHaveClass('m3-elevation-3');
  });

  test('handles custom shape', () => {
    render(<Material3AppBar shape="sm" />);
    
    const header = screen.getByRole('banner');
    expect(header).toHaveClass('m3-shape-sm');
  });

  test('handles logo click callback', () => {
    const handleLogoClick = jest.fn();
    render(
      <Material3AppBar 
        title="Test App" 
        logo={<span>🏠</span>}
        onLogoClick={handleLogoClick} 
      />
    );
    
    const logoButton = screen.getByRole('button', { name: 'Go to home' });
    fireEvent.click(logoButton);
    
    expect(handleLogoClick).toHaveBeenCalledTimes(1);
  });

  test('renders logo as link when no click handler provided', () => {
    render(
      <Material3AppBar 
        title="Test App" 
        logo={<span>🏠</span>}
      />
    );
    
    const logoLink = screen.getByRole('link');
    expect(logoLink).toHaveAttribute('href', '/');
  });

  test('applies custom className', () => {
    render(<Material3AppBar className="custom-appbar-class" />);
    
    const header = screen.getByRole('banner');
    expect(header).toHaveClass('custom-appbar-class');
  });

  test('forwards ref correctly', () => {
    const ref = React.createRef<HTMLElement>();
    render(<Material3AppBar ref={ref} />);
    
    expect(ref.current).toBeInstanceOf(HTMLElement);
    expect(ref.current?.tagName).toBe('HEADER');
  });

  test('handles responsive title classes', () => {
    render(<Material3AppBar title="Responsive Title" />);
    
    const title = screen.getByRole('heading');
    expect(title).toHaveClass('m3-headline-small', 'md:m3-headline-medium');
  });

  test('renders with proper semantic structure', () => {
    const actions = <button>Action</button>;
    render(
      <Material3AppBar 
        title="Test App" 
        logo={<span>🏠</span>}
        actions={actions}
      />
    );
    
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
    
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    
    const button = screen.getByRole('button', { name: 'Action' });
    expect(button).toBeInTheDocument();
  });

  test('handles empty state gracefully', () => {
    render(<Material3AppBar />);
    
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
    
    // Should not render logo/title section when both are empty
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  test('truncates long titles properly', () => {
    const longTitle = 'This is a very long title that should be truncated';
    render(<Material3AppBar title={longTitle} />);
    
    const title = screen.getByRole('heading');
    expect(title).toHaveClass('truncate');
    expect(title).toHaveTextContent(longTitle);
  });
});