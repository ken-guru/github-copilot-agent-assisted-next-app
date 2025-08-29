/**
 * Tests for Material3MobileTextField component
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Material3MobileTextField } from '../Material3MobileTextField';

// Mock the mobile optimizations hook
jest.mock('../../hooks/useMobileOptimizations', () => ({
  useMobileOptimizations: () => ({
    isMobile: false,
    getTouchSize: jest.fn(() => 56),
  }),
}));

describe('Material3MobileTextField', () => {
  test('should render text field with default props', () => {
    render(<Material3MobileTextField />);

    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
  });

  test('should render with label', () => {
    render(<Material3MobileTextField label="Email" />);

    const label = screen.getByText('Email');
    expect(label).toBeInTheDocument();
  });

  test('should render with helper text', () => {
    render(<Material3MobileTextField helperText="Enter your email address" />);

    const helperText = screen.getByText('Enter your email address');
    expect(helperText).toBeInTheDocument();
  });

  test('should render with error message', () => {
    render(<Material3MobileTextField error="Email is required" hasError />);

    const errorText = screen.getByText('Email is required');
    expect(errorText).toBeInTheDocument();
  });

  test('should apply variant classes', () => {
    const { rerender } = render(
      <Material3MobileTextField variant="filled" data-testid="container" />
    );

    let container = screen.getByTestId('container').parentElement;
    expect(container).toHaveClass('filled');

    rerender(<Material3MobileTextField variant="outlined" data-testid="container" />);
    container = screen.getByTestId('container').parentElement;
    expect(container).toHaveClass('outlined');
  });

  test('should apply size classes', () => {
    const { rerender } = render(
      <Material3MobileTextField size="small" data-testid="container" />
    );

    let container = screen.getByTestId('container').parentElement;
    expect(container).toHaveClass('small');

    rerender(<Material3MobileTextField size="medium" data-testid="container" />);
    container = screen.getByTestId('container').parentElement;
    expect(container).toHaveClass('medium');

    rerender(<Material3MobileTextField size="large" data-testid="container" />);
    container = screen.getByTestId('container').parentElement;
    expect(container).toHaveClass('large');
  });

  test('should handle focus and blur events', () => {
    const handleFocus = jest.fn();
    const handleBlur = jest.fn();

    render(
      <Material3MobileTextField
        onFocus={handleFocus}
        onBlur={handleBlur}
        data-testid="container"
      />
    );

    const input = screen.getByRole('textbox');
    const container = screen.getByTestId('container').parentElement;

    fireEvent.focus(input);
    expect(handleFocus).toHaveBeenCalledTimes(1);
    expect(container).toHaveClass('focused');

    fireEvent.blur(input);
    expect(handleBlur).toHaveBeenCalledTimes(1);
    expect(container).not.toHaveClass('focused');
  });

  test('should handle input changes', () => {
    const handleChange = jest.fn();
    render(
      <Material3MobileTextField
        onChange={handleChange}
        data-testid="container"
      />
    );

    const input = screen.getByRole('textbox');
    const container = screen.getByTestId('container').parentElement;

    fireEvent.change(input, { target: { value: 'test value' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(container).toHaveClass('hasValue');
  });

  test('should render with start and end icons', () => {
    const startIcon = <span data-testid="start-icon">📧</span>;
    const endIcon = <span data-testid="end-icon">✓</span>;

    render(
      <Material3MobileTextField
        startIcon={startIcon}
        endIcon={endIcon}
      />
    );

    expect(screen.getByTestId('start-icon')).toBeInTheDocument();
    expect(screen.getByTestId('end-icon')).toBeInTheDocument();
  });

  test('should apply error state', () => {
    render(
      <Material3MobileTextField
        hasError
        error="This field is required"
        data-testid="container"
      />
    );

    const container = screen.getByTestId('container').parentElement;
    expect(container).toHaveClass('error');
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  test('should be disabled when disabled prop is true', () => {
    render(
      <Material3MobileTextField
        disabled
        data-testid="container"
      />
    );

    const input = screen.getByRole('textbox');
    const container = screen.getByTestId('container').parentElement;

    expect(input).toBeDisabled();
    expect(container).toHaveClass('disabled');
  });

  test('should apply mobile optimizations when on mobile', () => {
    // Mock mobile environment
    const mockUseMobileOptimizations = jest.requireMock('../../hooks/useMobileOptimizations');
    mockUseMobileOptimizations.useMobileOptimizations.mockReturnValue({
      isMobile: true,
      getTouchSize: jest.fn(() => 64),
    });

    render(
      <Material3MobileTextField
        touchOptimized
        data-testid="container"
      />
    );

    const container = screen.getByTestId('container').parentElement;
    const input = screen.getByRole('textbox');

    expect(container).toHaveClass('mobile');
    expect(container).toHaveStyle({ minHeight: '64px' });
    expect(input).toHaveStyle({ fontSize: '16px' });
  });

  test('should set appropriate input mode', () => {
    const { rerender } = render(
      <Material3MobileTextField inputMode="email" />
    );

    let input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('inputMode', 'email');

    rerender(<Material3MobileTextField inputMode="numeric" />);
    input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('inputMode', 'numeric');

    rerender(<Material3MobileTextField inputMode="tel" />);
    input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('inputMode', 'tel');
  });

  test('should apply custom className', () => {
    render(
      <Material3MobileTextField
        className="custom-class"
        data-testid="container"
      />
    );

    const container = screen.getByTestId('container').parentElement;
    expect(container).toHaveClass('custom-class');
  });

  test('should forward ref correctly', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Material3MobileTextField ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  test('should show hasValue class with default value', () => {
    render(
      <Material3MobileTextField
        defaultValue="default text"
        data-testid="container"
      />
    );

    const container = screen.getByTestId('container').parentElement;
    expect(container).toHaveClass('hasValue');
  });

  test('should show hasValue class with controlled value', () => {
    render(
      <Material3MobileTextField
        value="controlled text"
        data-testid="container"
      />
    );

    const container = screen.getByTestId('container').parentElement;
    expect(container).toHaveClass('hasValue');
  });

  test('should prioritize error over helper text', () => {
    render(
      <Material3MobileTextField
        helperText="Helper text"
        error="Error message"
        hasError
      />
    );

    expect(screen.getByText('Error message')).toBeInTheDocument();
    expect(screen.queryByText('Helper text')).not.toBeInTheDocument();
  });

  test('should pass through additional input props', () => {
    render(
      <Material3MobileTextField
        placeholder="Enter text"
        maxLength={100}
        data-testid="input-field"
      />
    );

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('placeholder', 'Enter text');
    expect(input).toHaveAttribute('maxLength', '100');
  });

  test('should handle blur with empty value', () => {
    render(
      <Material3MobileTextField
        data-testid="container"
      />
    );

    const input = screen.getByRole('textbox');
    const container = screen.getByTestId('container').parentElement;

    fireEvent.focus(input);
    expect(container).toHaveClass('focused');

    fireEvent.blur(input, { target: { value: '' } });
    expect(container).not.toHaveClass('focused');
    expect(container).not.toHaveClass('hasValue');
  });

  test('should handle blur with value', () => {
    render(
      <Material3MobileTextField
        data-testid="container"
      />
    );

    const input = screen.getByRole('textbox');
    const container = screen.getByTestId('container').parentElement;

    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.blur(input, { target: { value: 'test' } });

    expect(container).toHaveClass('hasValue');
  });
});