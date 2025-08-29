/**
 * Tests for Material3AnimatedTextField component
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Material3AnimatedTextField } from '../Material3AnimatedTextField';

// Mock the animation hooks
jest.mock('../../../hooks/useAnimations', () => ({
  useFocusAnimation: jest.fn(() => ({
    handleFocus: jest.fn(),
    handleBlur: jest.fn(),
  })),
  useMicroInteractions: jest.fn(() => ({
    triggerValidationError: jest.fn(),
    triggerSuccess: jest.fn(),
  })),
}));

const mockAnimationHooks = require('../../../hooks/useAnimations');

describe('Material3AnimatedTextField', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render text field with default props', () => {
    render(<Material3AnimatedTextField />);

    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    expect(input.parentElement?.parentElement).toHaveClass('container', 'outlined', 'medium');
  });

  it('should render different variants', () => {
    const { rerender } = render(<Material3AnimatedTextField variant="filled" />);

    let container = screen.getByRole('textbox').parentElement?.parentElement;
    expect(container).toHaveClass('filled');

    rerender(<Material3AnimatedTextField variant="outlined" />);
    container = screen.getByRole('textbox').parentElement?.parentElement;
    expect(container).toHaveClass('outlined');
  });

  it('should render different sizes', () => {
    const { rerender } = render(<Material3AnimatedTextField size="small" />);

    let container = screen.getByRole('textbox').parentElement?.parentElement;
    expect(container).toHaveClass('small');

    rerender(<Material3AnimatedTextField size="large" />);
    container = screen.getByRole('textbox').parentElement?.parentElement;
    expect(container).toHaveClass('large');
  });

  it('should render with label', () => {
    render(<Material3AnimatedTextField label="Email" />);

    const label = screen.getByText('Email');
    expect(label).toBeInTheDocument();
    expect(label).toHaveClass('label');
  });

  it('should animate label on focus', async () => {
    const user = userEvent.setup();
    render(<Material3AnimatedTextField label="Email" />);

    const input = screen.getByRole('textbox');
    const label = screen.getByText('Email');

    expect(label).not.toHaveClass('labelFloating');

    await user.click(input);

    expect(label).toHaveClass('labelFloating');
  });

  it('should keep label floating when input has value', () => {
    render(<Material3AnimatedTextField label="Email" value="test@example.com" />);

    const label = screen.getByText('Email');
    expect(label).toHaveClass('labelFloating');
  });

  it('should show helper text', () => {
    render(<Material3AnimatedTextField helperText="Enter your email address" />);

    const helperText = screen.getByText('Enter your email address');
    expect(helperText).toBeInTheDocument();
    expect(helperText).toHaveClass('helperText');
  });

  it('should show error state and text', () => {
    render(
      <Material3AnimatedTextField
        error
        errorText="Email is required"
        label="Email"
      />
    );

    const container = screen.getByRole('textbox').parentElement?.parentElement;
    expect(container).toHaveClass('error');

    const errorText = screen.getByText('Email is required');
    expect(errorText).toBeInTheDocument();
  });

  it('should show success state and text', () => {
    render(
      <Material3AnimatedTextField
        success
        successText="Email is valid"
        label="Email"
      />
    );

    const container = screen.getByRole('textbox').parentElement?.parentElement;
    expect(container).toHaveClass('success');

    const successText = screen.getByText('Email is valid');
    expect(successText).toBeInTheDocument();
  });

  it('should show loading state', () => {
    render(<Material3AnimatedTextField loading />);

    const container = screen.getByRole('textbox').parentElement?.parentElement;
    expect(container).toHaveClass('loading');

    const spinner = container?.querySelector('.loadingSpinner');
    expect(spinner).toBeInTheDocument();
  });

  it('should render with leading icon', () => {
    const icon = <span data-testid="leading-icon">📧</span>;
    render(<Material3AnimatedTextField leadingIcon={icon} />);

    const iconElement = screen.getByTestId('leading-icon');
    expect(iconElement).toBeInTheDocument();
    expect(iconElement.parentElement).toHaveClass('leadingIcon');

    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('hasLeadingIcon');
  });

  it('should render with trailing icon', () => {
    const icon = <span data-testid="trailing-icon">🔍</span>;
    render(<Material3AnimatedTextField trailingIcon={icon} />);

    const iconElement = screen.getByTestId('trailing-icon');
    expect(iconElement).toBeInTheDocument();
    expect(iconElement.parentElement).toHaveClass('trailingIcon');

    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('hasTrailingIcon');
  });

  it('should handle focus events with animation', async () => {
    const handleFocus = jest.fn();
    const handleBlur = jest.fn();
    const mockFocusHandler = jest.fn();
    const mockBlurHandler = jest.fn();

    mockAnimationHooks.useFocusAnimation.mockReturnValue({
      handleFocus: mockFocusHandler,
      handleBlur: mockBlurHandler,
    });

    const user = userEvent.setup();
    render(
      <Material3AnimatedTextField
        onFocus={handleFocus}
        onBlur={handleBlur}
        label="Test"
      />
    );

    const input = screen.getByRole('textbox');

    await user.click(input);
    expect(handleFocus).toHaveBeenCalled();
    expect(mockFocusHandler).toHaveBeenCalled();

    await user.tab();
    expect(handleBlur).toHaveBeenCalled();
    expect(mockBlurHandler).toHaveBeenCalled();
  });

  it('should handle change events', async () => {
    const handleChange = jest.fn();
    const user = userEvent.setup();

    render(<Material3AnimatedTextField onChange={handleChange} />);

    const input = screen.getByRole('textbox');
    await user.type(input, 'test');

    expect(handleChange).toHaveBeenCalledTimes(4); // Once for each character
  });

  it('should trigger validation animations', () => {
    const mockTriggerError = jest.fn();
    const mockTriggerSuccess = jest.fn();

    mockAnimationHooks.useMicroInteractions.mockReturnValue({
      triggerValidationError: mockTriggerError,
      triggerSuccess: mockTriggerSuccess,
    });

    const { rerender } = render(<Material3AnimatedTextField />);

    rerender(<Material3AnimatedTextField error />);
    expect(mockTriggerError).toHaveBeenCalled();

    rerender(<Material3AnimatedTextField success />);
    expect(mockTriggerSuccess).toHaveBeenCalled();
  });

  it('should disable animations when specified', async () => {
    const mockFocusHandler = jest.fn();

    mockAnimationHooks.useFocusAnimation.mockReturnValue({
      handleFocus: mockFocusHandler,
      handleBlur: jest.fn(),
    });

    const user = userEvent.setup();
    render(<Material3AnimatedTextField focusAnimation={false} />);

    const input = screen.getByRole('textbox');
    await user.click(input);

    expect(mockFocusHandler).not.toHaveBeenCalled();
  });

  it('should disable validation animations when specified', () => {
    const mockTriggerError = jest.fn();

    mockAnimationHooks.useMicroInteractions.mockReturnValue({
      triggerValidationError: mockTriggerError,
      triggerSuccess: jest.fn(),
    });

    const { rerender } = render(<Material3AnimatedTextField animateValidation={false} />);

    rerender(<Material3AnimatedTextField error animateValidation={false} />);
    expect(mockTriggerError).not.toHaveBeenCalled();
  });

  it('should disable label animation when specified', async () => {
    const user = userEvent.setup();
    render(<Material3AnimatedTextField label="Email" animateLabel={false} />);

    const input = screen.getByRole('textbox');
    const label = screen.getByText('Email');

    expect(label).not.toHaveClass('animateLabel');

    await user.click(input);
    expect(label).toHaveClass('labelFloating');
    expect(label).not.toHaveClass('animateLabel');
  });

  it('should be disabled when specified', () => {
    render(<Material3AnimatedTextField disabled />);

    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();

    const container = input.parentElement?.parentElement;
    expect(container).toHaveClass('disabled');
  });

  it('should be disabled when loading', () => {
    render(<Material3AnimatedTextField loading />);

    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  it('should render fieldset for outlined variant', () => {
    render(<Material3AnimatedTextField variant="outlined" label="Test" />);

    const container = screen.getByRole('textbox').parentElement?.parentElement;
    const fieldset = container?.querySelector('fieldset');
    expect(fieldset).toBeInTheDocument();
    expect(fieldset).toHaveClass('fieldset');

    const legend = fieldset?.querySelector('legend');
    expect(legend).toBeInTheDocument();
  });

  it('should update legend when label is floating', async () => {
    const user = userEvent.setup();
    render(<Material3AnimatedTextField variant="outlined" label="Email" />);

    const input = screen.getByRole('textbox');
    await user.click(input);

    const legend = screen.getByRole('textbox').parentElement?.parentElement?.querySelector('legend span');
    expect(legend).toHaveTextContent('Email');
  });

  it('should apply custom className', () => {
    render(<Material3AnimatedTextField className="custom-class" />);

    const container = screen.getByRole('textbox').parentElement?.parentElement;
    expect(container).toHaveClass('custom-class');
  });

  it('should forward other props to input element', () => {
    render(
      <Material3AnimatedTextField
        data-testid="custom-input"
        placeholder="Enter text"
        maxLength={100}
      />
    );

    const input = screen.getByTestId('custom-input');
    expect(input).toHaveAttribute('placeholder', 'Enter text');
    expect(input).toHaveAttribute('maxLength', '100');
  });

  it('should have proper accessibility attributes', () => {
    render(
      <Material3AnimatedTextField
        label="Email"
        helperText="Enter your email"
        id="email-input"
      />
    );

    const input = screen.getByRole('textbox');
    const label = screen.getByText('Email');

    expect(label).toHaveAttribute('for', 'email-input');
    expect(input).toHaveAttribute('id', 'email-input');
  });

  it('should update hasValue state when value prop changes', () => {
    const { rerender } = render(<Material3AnimatedTextField label="Test" />);

    let container = screen.getByRole('textbox').parentElement?.parentElement;
    expect(container).not.toHaveClass('hasValue');

    rerender(<Material3AnimatedTextField label="Test" value="test value" />);
    container = screen.getByRole('textbox').parentElement?.parentElement;
    expect(container).toHaveClass('hasValue');
  });

  it('should show loading spinner instead of trailing icon when loading', () => {
    const icon = <span data-testid="trailing-icon">🔍</span>;
    render(<Material3AnimatedTextField trailingIcon={icon} loading />);

    expect(screen.queryByTestId('trailing-icon')).not.toBeInTheDocument();

    const spinner = screen.getByRole('textbox').parentElement?.parentElement?.querySelector('.loadingSpinner');
    expect(spinner).toBeInTheDocument();
  });
});