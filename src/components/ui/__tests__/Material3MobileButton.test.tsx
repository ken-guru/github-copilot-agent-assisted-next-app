/**
 * Tests for Material3MobileButton component
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Material3MobileButton } from '../Material3MobileButton';

// Mock the mobile optimizations hook
jest.mock('../../hooks/useMobileOptimizations', () => ({
  useMobileOptimizations: () => ({
    isMobile: false,
    isTouch: false,
    getTouchSize: jest.fn(() => 48),
  }),
  useTouchOptimizedHandlers: () => ({
    createTouchHandler: jest.fn((onClick) => ({
      onClick,
      onTouchStart: undefined,
    })),
  }),
}));

describe('Material3MobileButton', () => {
  test('should render button with default props', () => {
    render(<Material3MobileButton>Click me</Material3MobileButton>);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Click me');
  });

  test('should apply variant classes', () => {
    const { rerender } = render(
      <Material3MobileButton variant="filled">Filled</Material3MobileButton>
    );

    let button = screen.getByRole('button');
    expect(button).toHaveClass('filled');

    rerender(<Material3MobileButton variant="outlined">Outlined</Material3MobileButton>);
    button = screen.getByRole('button');
    expect(button).toHaveClass('outlined');

    rerender(<Material3MobileButton variant="text">Text</Material3MobileButton>);
    button = screen.getByRole('button');
    expect(button).toHaveClass('text');

    rerender(<Material3MobileButton variant="elevated">Elevated</Material3MobileButton>);
    button = screen.getByRole('button');
    expect(button).toHaveClass('elevated');

    rerender(<Material3MobileButton variant="tonal">Tonal</Material3MobileButton>);
    button = screen.getByRole('button');
    expect(button).toHaveClass('tonal');
  });

  test('should apply size classes', () => {
    const { rerender } = render(
      <Material3MobileButton size="small">Small</Material3MobileButton>
    );

    let button = screen.getByRole('button');
    expect(button).toHaveClass('small');

    rerender(<Material3MobileButton size="medium">Medium</Material3MobileButton>);
    button = screen.getByRole('button');
    expect(button).toHaveClass('medium');

    rerender(<Material3MobileButton size="large">Large</Material3MobileButton>);
    button = screen.getByRole('button');
    expect(button).toHaveClass('large');
  });

  test('should handle click events', () => {
    const handleClick = jest.fn();
    render(
      <Material3MobileButton onClick={handleClick}>
        Click me
      </Material3MobileButton>
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('should render with start and end icons', () => {
    const startIcon = <span data-testid="start-icon">→</span>;
    const endIcon = <span data-testid="end-icon">←</span>;

    render(
      <Material3MobileButton startIcon={startIcon} endIcon={endIcon}>
        Button with icons
      </Material3MobileButton>
    );

    expect(screen.getByTestId('start-icon')).toBeInTheDocument();
    expect(screen.getByTestId('end-icon')).toBeInTheDocument();
    expect(screen.getByText('Button with icons')).toBeInTheDocument();
  });

  test('should show loading state', () => {
    render(
      <Material3MobileButton loading>
        Loading button
      </Material3MobileButton>
    );

    const button = screen.getByRole('button');
    expect(button).toHaveClass('loading');
    expect(button).toBeDisabled();

    // Should show loading spinner
    const spinner = button.querySelector('.spinner');
    expect(spinner).toBeInTheDocument();
  });

  test('should be disabled when disabled prop is true', () => {
    render(
      <Material3MobileButton disabled>
        Disabled button
      </Material3MobileButton>
    );

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled');
  });

  test('should render ripple container when ripple is enabled', () => {
    render(
      <Material3MobileButton enableRipple>
        Ripple button
      </Material3MobileButton>
    );

    const button = screen.getByRole('button');
    const rippleContainer = button.querySelector('.rippleContainer');
    expect(rippleContainer).toBeInTheDocument();
  });

  test('should not render ripple container when ripple is disabled', () => {
    render(
      <Material3MobileButton enableRipple={false}>
        No ripple button
      </Material3MobileButton>
    );

    const button = screen.getByRole('button');
    const rippleContainer = button.querySelector('.rippleContainer');
    expect(rippleContainer).not.toBeInTheDocument();
  });

  test('should apply custom className', () => {
    render(
      <Material3MobileButton className="custom-class">
        Custom button
      </Material3MobileButton>
    );

    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  test('should forward ref correctly', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(
      <Material3MobileButton ref={ref}>
        Ref button
      </Material3MobileButton>
    );

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current).toHaveTextContent('Ref button');
  });

  test('should apply mobile optimizations when on mobile', () => {
    // Mock mobile environment
    const mockUseMobileOptimizations = jest.requireMock('../../hooks/useMobileOptimizations');
    mockUseMobileOptimizations.useMobileOptimizations.mockReturnValue({
      isMobile: true,
      isTouch: true,
      getTouchSize: jest.fn(() => 56),
    });

    render(<Material3MobileButton>Mobile button</Material3MobileButton>);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('mobile');
    expect(button).toHaveClass('touch');
    expect(button).toHaveStyle({ minHeight: '56px', minWidth: '56px' });
  });

  test('should handle touch events on touch devices', () => {
    const handleClick = jest.fn();
    
    // Mock touch environment
    const mockUseTouchOptimizedHandlers = jest.requireMock('../../hooks/useMobileOptimizations');
    mockUseTouchOptimizedHandlers.useTouchOptimizedHandlers.mockReturnValue({
      createTouchHandler: jest.fn((onClick) => ({
        onClick,
        onTouchStart: jest.fn(),
      })),
    });

    render(
      <Material3MobileButton onClick={handleClick}>
        Touch button
      </Material3MobileButton>
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('should pass through additional props', () => {
    render(
      <Material3MobileButton
        data-testid="custom-button"
        aria-label="Custom button"
        type="submit"
      >
        Custom props button
      </Material3MobileButton>
    );

    const button = screen.getByTestId('custom-button');
    expect(button).toHaveAttribute('aria-label', 'Custom button');
    expect(button).toHaveAttribute('type', 'submit');
  });

  test('should not call onClick when disabled', () => {
    const handleClick = jest.fn();
    render(
      <Material3MobileButton onClick={handleClick} disabled>
        Disabled button
      </Material3MobileButton>
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });

  test('should not call onClick when loading', () => {
    const handleClick = jest.fn();
    render(
      <Material3MobileButton onClick={handleClick} loading>
        Loading button
      </Material3MobileButton>
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });

  test('should render without children', () => {
    const startIcon = <span data-testid="icon">🔥</span>;
    render(<Material3MobileButton startIcon={startIcon} />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });
});