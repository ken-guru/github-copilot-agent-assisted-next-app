/**
 * Tests for Material3AnimatedButton component
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Material3AnimatedButton } from '../Material3AnimatedButton';

// Mock the animation hooks
jest.mock('../../../hooks/useAnimations', () => ({
  useHoverAnimation: jest.fn(() => ({
    handleMouseEnter: jest.fn(),
    handleMouseLeave: jest.fn(),
  })),
  useFocusAnimation: jest.fn(() => ({
    handleFocus: jest.fn(),
    handleBlur: jest.fn(),
  })),
  useMicroInteractions: jest.fn(() => ({
    triggerClick: jest.fn(),
    triggerSuccess: jest.fn(),
    triggerValidationError: jest.fn(),
  })),
}));

const mockAnimationHooks = require('../../../hooks/useAnimations');

describe('Material3AnimatedButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render button with default props', () => {
    render(<Material3AnimatedButton>Click me</Material3AnimatedButton>);

    const button = screen.getByRole('button', { name: 'Click me' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('button', 'filled', 'medium');
  });

  it('should render different variants', () => {
    const { rerender } = render(
      <Material3AnimatedButton variant="outlined">Outlined</Material3AnimatedButton>
    );

    let button = screen.getByRole('button');
    expect(button).toHaveClass('outlined');

    rerender(<Material3AnimatedButton variant="text">Text</Material3AnimatedButton>);
    button = screen.getByRole('button');
    expect(button).toHaveClass('text');

    rerender(<Material3AnimatedButton variant="elevated">Elevated</Material3AnimatedButton>);
    button = screen.getByRole('button');
    expect(button).toHaveClass('elevated');

    rerender(<Material3AnimatedButton variant="tonal">Tonal</Material3AnimatedButton>);
    button = screen.getByRole('button');
    expect(button).toHaveClass('tonal');
  });

  it('should render different sizes', () => {
    const { rerender } = render(
      <Material3AnimatedButton size="small">Small</Material3AnimatedButton>
    );

    let button = screen.getByRole('button');
    expect(button).toHaveClass('small');

    rerender(<Material3AnimatedButton size="large">Large</Material3AnimatedButton>);
    button = screen.getByRole('button');
    expect(button).toHaveClass('large');
  });

  it('should show loading state', () => {
    render(<Material3AnimatedButton loading>Loading</Material3AnimatedButton>);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('loading');
    expect(button).toBeDisabled();

    const spinner = button.querySelector('.loadingSpinner');
    expect(spinner).toBeInTheDocument();
  });

  it('should show success state', () => {
    render(<Material3AnimatedButton success>Success</Material3AnimatedButton>);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('success');

    const successIcon = button.querySelector('.successIcon');
    expect(successIcon).toBeInTheDocument();
    expect(successIcon).toHaveTextContent('✓');
  });

  it('should show error state', () => {
    render(<Material3AnimatedButton error>Error</Material3AnimatedButton>);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('error');

    const errorIcon = button.querySelector('.errorIcon');
    expect(errorIcon).toBeInTheDocument();
    expect(errorIcon).toHaveTextContent('⚠');
  });

  it('should render with icons', () => {
    const icon = <span data-testid="icon">🚀</span>;

    const { rerender } = render(
      <Material3AnimatedButton icon={icon} iconPosition="start">
        With Icon
      </Material3AnimatedButton>
    );

    let button = screen.getByRole('button');
    let iconElement = screen.getByTestId('icon');
    expect(iconElement).toBeInTheDocument();
    expect(iconElement.parentElement).toHaveClass('iconStart');

    rerender(
      <Material3AnimatedButton icon={icon} iconPosition="end">
        With Icon
      </Material3AnimatedButton>
    );

    button = screen.getByRole('button');
    iconElement = screen.getByTestId('icon');
    expect(iconElement.parentElement).toHaveClass('iconEnd');
  });

  it('should handle click events with animation', () => {
    const handleClick = jest.fn();
    const mockTriggerClick = jest.fn();

    mockAnimationHooks.useMicroInteractions.mockReturnValue({
      triggerClick: mockTriggerClick,
      triggerSuccess: jest.fn(),
      triggerValidationError: jest.fn(),
    });

    render(
      <Material3AnimatedButton onClick={handleClick}>
        Click me
      </Material3AnimatedButton>
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalled();
    expect(mockTriggerClick).toHaveBeenCalled();
  });

  it('should handle hover events with animation', () => {
    const handleMouseEnter = jest.fn();
    const handleMouseLeave = jest.fn();
    const mockHoverEnter = jest.fn();
    const mockHoverLeave = jest.fn();

    mockAnimationHooks.useHoverAnimation.mockReturnValue({
      handleMouseEnter: mockHoverEnter,
      handleMouseLeave: mockHoverLeave,
    });

    render(
      <Material3AnimatedButton
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        Hover me
      </Material3AnimatedButton>
    );

    const button = screen.getByRole('button');

    fireEvent.mouseEnter(button);
    expect(handleMouseEnter).toHaveBeenCalled();
    expect(mockHoverEnter).toHaveBeenCalled();

    fireEvent.mouseLeave(button);
    expect(handleMouseLeave).toHaveBeenCalled();
    expect(mockHoverLeave).toHaveBeenCalled();
  });

  it('should handle focus events with animation', () => {
    const handleFocus = jest.fn();
    const handleBlur = jest.fn();
    const mockFocusHandler = jest.fn();
    const mockBlurHandler = jest.fn();

    mockAnimationHooks.useFocusAnimation.mockReturnValue({
      handleFocus: mockFocusHandler,
      handleBlur: mockBlurHandler,
    });

    render(
      <Material3AnimatedButton onFocus={handleFocus} onBlur={handleBlur}>
        Focus me
      </Material3AnimatedButton>
    );

    const button = screen.getByRole('button');

    fireEvent.focus(button);
    expect(handleFocus).toHaveBeenCalled();
    expect(mockFocusHandler).toHaveBeenCalled();

    fireEvent.blur(button);
    expect(handleBlur).toHaveBeenCalled();
    expect(mockBlurHandler).toHaveBeenCalled();
  });

  it('should trigger success animation when success state changes', () => {
    const mockTriggerSuccess = jest.fn();

    mockAnimationHooks.useMicroInteractions.mockReturnValue({
      triggerClick: jest.fn(),
      triggerSuccess: mockTriggerSuccess,
      triggerValidationError: jest.fn(),
    });

    const { rerender } = render(
      <Material3AnimatedButton>Button</Material3AnimatedButton>
    );

    rerender(<Material3AnimatedButton success>Button</Material3AnimatedButton>);

    expect(mockTriggerSuccess).toHaveBeenCalled();
  });

  it('should trigger error animation when error state changes', () => {
    const mockTriggerError = jest.fn();

    mockAnimationHooks.useMicroInteractions.mockReturnValue({
      triggerClick: jest.fn(),
      triggerSuccess: jest.fn(),
      triggerValidationError: mockTriggerError,
    });

    const { rerender } = render(
      <Material3AnimatedButton>Button</Material3AnimatedButton>
    );

    rerender(<Material3AnimatedButton error>Button</Material3AnimatedButton>);

    expect(mockTriggerError).toHaveBeenCalled();
  });

  it('should disable animations when disabled', () => {
    const mockTriggerClick = jest.fn();

    mockAnimationHooks.useMicroInteractions.mockReturnValue({
      triggerClick: mockTriggerClick,
      triggerSuccess: jest.fn(),
      triggerValidationError: jest.fn(),
    });

    render(<Material3AnimatedButton disabled>Disabled</Material3AnimatedButton>);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();

    fireEvent.click(button);
    expect(mockTriggerClick).not.toHaveBeenCalled();
  });

  it('should disable ripple effect when specified', () => {
    const mockTriggerClick = jest.fn();

    mockAnimationHooks.useMicroInteractions.mockReturnValue({
      triggerClick: mockTriggerClick,
      triggerSuccess: jest.fn(),
      triggerValidationError: jest.fn(),
    });

    render(
      <Material3AnimatedButton rippleEffect={false}>
        No Ripple
      </Material3AnimatedButton>
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockTriggerClick).not.toHaveBeenCalled();
  });

  it('should disable hover animation when specified', () => {
    const mockHoverEnter = jest.fn();

    mockAnimationHooks.useHoverAnimation.mockReturnValue({
      handleMouseEnter: mockHoverEnter,
      handleMouseLeave: jest.fn(),
    });

    render(
      <Material3AnimatedButton hoverAnimation={false}>
        No Hover
      </Material3AnimatedButton>
    );

    const button = screen.getByRole('button');
    fireEvent.mouseEnter(button);

    expect(mockHoverEnter).not.toHaveBeenCalled();
  });

  it('should disable focus animation when specified', () => {
    const mockFocusHandler = jest.fn();

    mockAnimationHooks.useFocusAnimation.mockReturnValue({
      handleFocus: mockFocusHandler,
      handleBlur: jest.fn(),
    });

    render(
      <Material3AnimatedButton focusAnimation={false}>
        No Focus
      </Material3AnimatedButton>
    );

    const button = screen.getByRole('button');
    fireEvent.focus(button);

    expect(mockFocusHandler).not.toHaveBeenCalled();
  });

  it('should apply custom className', () => {
    render(
      <Material3AnimatedButton className="custom-class">
        Custom
      </Material3AnimatedButton>
    );

    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  it('should forward other props to button element', () => {
    render(
      <Material3AnimatedButton data-testid="custom-button" aria-label="Custom button">
        Custom
      </Material3AnimatedButton>
    );

    const button = screen.getByTestId('custom-button');
    expect(button).toHaveAttribute('aria-label', 'Custom button');
  });

  it('should have proper accessibility attributes', () => {
    render(<Material3AnimatedButton>Accessible Button</Material3AnimatedButton>);

    const button = screen.getByRole('button', { name: 'Accessible Button' });
    expect(button).toBeInTheDocument();
  });

  it('should handle loading state properly', () => {
    render(<Material3AnimatedButton loading>Loading Button</Material3AnimatedButton>);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('loading');

    const content = button.querySelector('.content');
    expect(content).toHaveStyle({ opacity: '0.6' });
  });
});