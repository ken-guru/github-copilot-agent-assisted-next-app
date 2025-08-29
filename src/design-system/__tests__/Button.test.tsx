/**
 * Tests for Material 3 Button Component
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Material3Button from '../components/Button';

describe('Material3Button', () => {
  test('renders with default props', () => {
    render(<Material3Button>Click me</Material3Button>);
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Click me');
    expect(button).toHaveClass('m3-label-large');
  });

  test('renders different variants correctly', () => {
    const { rerender } = render(<Material3Button variant="filled">Filled</Material3Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-primary', 'text-on-primary');

    rerender(<Material3Button variant="outlined">Outlined</Material3Button>);
    expect(screen.getByRole('button')).toHaveClass('border-2', 'border-outline', 'bg-transparent');

    rerender(<Material3Button variant="text">Text</Material3Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-transparent', 'border-transparent');

    rerender(<Material3Button variant="elevated">Elevated</Material3Button>);
    expect(screen.getByRole('button')).toHaveClass('m3-elevation-1');

    rerender(<Material3Button variant="tonal">Tonal</Material3Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-secondary-container');
  });

  test('renders different sizes correctly', () => {
    const { rerender } = render(<Material3Button size="small">Small</Material3Button>);
    expect(screen.getByRole('button')).toHaveClass('h-8', 'px-3', 'text-sm');

    rerender(<Material3Button size="medium">Medium</Material3Button>);
    expect(screen.getByRole('button')).toHaveClass('h-10', 'px-6');

    rerender(<Material3Button size="large">Large</Material3Button>);
    expect(screen.getByRole('button')).toHaveClass('h-12', 'px-8', 'text-lg');
  });

  test('handles disabled state correctly', () => {
    render(<Material3Button disabled>Disabled</Material3Button>);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('cursor-not-allowed', 'pointer-events-none');
  });

  test('handles loading state correctly', () => {
    render(<Material3Button loading>Loading</Material3Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('cursor-wait', 'pointer-events-none');
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('renders with start and end icons', () => {
    render(
      <Material3Button 
        startIcon={<span data-testid="start-icon">←</span>}
        endIcon={<span data-testid="end-icon">→</span>}
      >
        With Icons
      </Material3Button>
    );
    
    expect(screen.getByTestId('start-icon')).toBeInTheDocument();
    expect(screen.getByTestId('end-icon')).toBeInTheDocument();
  });

  test('handles full width correctly', () => {
    render(<Material3Button fullWidth>Full Width</Material3Button>);
    
    expect(screen.getByRole('button')).toHaveClass('w-full');
  });

  test('handles click events', () => {
    const handleClick = jest.fn();
    render(<Material3Button onClick={handleClick}>Click me</Material3Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('prevents click when disabled', () => {
    const handleClick = jest.fn();
    render(<Material3Button disabled onClick={handleClick}>Disabled</Material3Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  test('prevents click when loading', () => {
    const handleClick = jest.fn();
    render(<Material3Button loading onClick={handleClick}>Loading</Material3Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  test('creates ripple effect on click', async () => {
    render(<Material3Button>Ripple test</Material3Button>);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);

    // Check if ripple element is created
    await waitFor(() => {
      const ripple = button.querySelector('span[style*="animation: ripple"]');
      expect(ripple).toBeInTheDocument();
    });
  });

  test('applies custom className', () => {
    render(<Material3Button className="custom-class">Custom</Material3Button>);
    
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });

  test('forwards ref correctly', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Material3Button ref={ref}>Ref test</Material3Button>);
    
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  test('handles keyboard navigation', () => {
    const handleClick = jest.fn();
    render(<Material3Button onClick={handleClick}>Keyboard test</Material3Button>);
    
    const button = screen.getByRole('button');
    
    // Test Enter key
    fireEvent.keyDown(button, { key: 'Enter' });
    fireEvent.keyUp(button, { key: 'Enter' });
    
    // Test Space key
    fireEvent.keyDown(button, { key: ' ' });
    fireEvent.keyUp(button, { key: ' ' });
    
    // Button should be focusable
    expect(button).toHaveAttribute('tabIndex');
  });

  test('renders with different shapes', () => {
    const { rerender } = render(<Material3Button shape="sm">Small Shape</Material3Button>);
    let button = screen.getByRole('button');
    expect(button.className).toContain('m3-shape-sm');

    rerender(<Material3Button shape="lg">Large Shape</Material3Button>);
    button = screen.getByRole('button');
    expect(button.className).toContain('m3-shape-lg');

    rerender(<Material3Button shape="full">Full Shape</Material3Button>);
    button = screen.getByRole('button');
    expect(button.className).toContain('m3-shape-full');
  });

  test('applies elevation when specified', () => {
    render(<Material3Button elevation={3}>Elevated</Material3Button>);
    
    const button = screen.getByRole('button');
    expect(button.className).toContain('m3-elevation-3');
  });

  test('handles complex combinations', () => {
    render(
      <Material3Button
        variant="outlined"
        size="large"
        shape="lg"
        elevation={2}
        fullWidth
        startIcon={<span>🚀</span>}
        className="custom-complex"
      >
        Complex Button
      </Material3Button>
    );
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('border-2', 'h-12', 'w-full', 'custom-complex');
    expect(button.className).toContain('m3-shape-lg');
    expect(button.className).toContain('m3-elevation-2');
  });
});