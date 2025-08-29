/**
 * Tests for Material 3 Input Component
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Material3Input from '../components/Input';

describe('Material3Input', () => {
  test('renders with default props', () => {
    render(<Material3Input />);
    
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass('m3-body-large');
  });

  test('renders with label', () => {
    render(<Material3Input label="Email" />);
    
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  test('renders with placeholder', () => {
    render(<Material3Input placeholder="Enter your email" />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('placeholder', 'Enter your email');
  });

  test('handles different variants', () => {
    const { rerender } = render(
      <Material3Input variant="filled" label="Filled" />
    );
    let container = screen.getByLabelText('Filled').closest('div');
    expect(container).toHaveClass('bg-surface-container-highest');

    rerender(
      <Material3Input variant="outlined" label="Outlined" />
    );
    container = screen.getByLabelText('Outlined').closest('div');
    expect(container).toHaveClass('border-2', 'border-outline');
  });

  test('handles different sizes', () => {
    const { rerender } = render(
      <Material3Input size="small" label="Small" />
    );
    let input = screen.getByLabelText('Small');
    expect(input).toHaveClass('px-3', 'py-2');

    rerender(
      <Material3Input size="large" label="Large" />
    );
    input = screen.getByLabelText('Large');
    expect(input).toHaveClass('px-5', 'py-4');
  });

  test('handles required state', () => {
    render(<Material3Input label="Required Field" required />);
    
    const input = screen.getByLabelText('Required Field');
    expect(input).toHaveAttribute('required');
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  test('handles disabled state', () => {
    render(<Material3Input label="Disabled" disabled />);
    
    const input = screen.getByLabelText('Disabled');
    expect(input).toBeDisabled();
    expect(input.closest('div')).toHaveClass('opacity-60', 'cursor-not-allowed');
  });

  test('handles error state', () => {
    render(<Material3Input label="Error Field" error errorText="This field is required" />);
    
    const input = screen.getByLabelText('Error Field');
    const container = input.closest('div');
    expect(container).toHaveClass('border-error');
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  test('renders with leading icon', () => {
    render(
      <Material3Input
        label="With Icon"
        leadingIcon={<span data-testid="leading-icon">🔍</span>}
      />
    );
    
    expect(screen.getByTestId('leading-icon')).toBeInTheDocument();
  });

  test('renders with trailing icon', () => {
    render(
      <Material3Input
        label="With Icon"
        trailingIcon={<span data-testid="trailing-icon">👁️</span>}
      />
    );
    
    expect(screen.getByTestId('trailing-icon')).toBeInTheDocument();
  });

  test('renders with both leading and trailing icons', () => {
    render(
      <Material3Input
        label="Both Icons"
        leadingIcon={<span data-testid="leading-icon">🔍</span>}
        trailingIcon={<span data-testid="trailing-icon">👁️</span>}
      />
    );
    
    expect(screen.getByTestId('leading-icon')).toBeInTheDocument();
    expect(screen.getByTestId('trailing-icon')).toBeInTheDocument();
  });

  test('handles floating label animation on focus', async () => {
    render(<Material3Input label="Floating Label" />);
    
    const input = screen.getByLabelText('Floating Label');
    const label = screen.getByText('Floating Label');
    
    // Initially, label should not be in floating state
    expect(label).toHaveClass('top-1/2', '-translate-y-1/2');
    
    // Focus the input
    fireEvent.focus(input);
    
    await waitFor(() => {
      expect(label).toHaveClass('top-2', 'text-xs');
    });
  });

  test('keeps label floating when input has value', async () => {
    render(<Material3Input label="With Value" value="test value" onChange={() => {}} />);
    
    const label = screen.getByText('With Value');
    expect(label).toHaveClass('top-2', 'text-xs');
  });

  test('handles input changes', async () => {
    const handleChange = jest.fn();
    render(<Material3Input label="Test Input" onChange={handleChange} />);
    
    const input = screen.getByLabelText('Test Input');
    fireEvent.change(input, { target: { value: 'hello' } });
    
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  test('handles different input types', () => {
    const { rerender } = render(
      <Material3Input type="email" label="Email" />
    );
    let input = screen.getByLabelText('Email');
    expect(input).toHaveAttribute('type', 'email');

    rerender(
      <Material3Input type="password" label="Password" />
    );
    input = screen.getByLabelText('Password');
    expect(input).toHaveAttribute('type', 'password');
  });

  test('forwards ref correctly', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Material3Input ref={ref} label="Ref Test" />);
    
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  test('applies custom className to container', () => {
    render(<Material3Input label="Custom Class" className="custom-input-class" />);
    
    const container = screen.getByLabelText('Custom Class').closest('div');
    expect(container).toHaveClass('custom-input-class');
  });

  test('handles focus and blur events', async () => {
    const handleFocus = jest.fn();
    const handleBlur = jest.fn();
    
    render(
      <Material3Input
        label="Focus Test"
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    );
    
    const input = screen.getByLabelText('Focus Test');
    
    fireEvent.focus(input);
    expect(handleFocus).toHaveBeenCalledTimes(1);
    
    fireEvent.blur(input);
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  test('shows helper text when provided', () => {
    render(<Material3Input label="With Helper" helperText="This is helper text" />);
    
    expect(screen.getByText('This is helper text')).toBeInTheDocument();
  });

  test('prioritizes error over helper text', () => {
    render(
      <Material3Input
        label="Error Priority"
        helperText="Helper text"
        error
        errorText="Error message"
      />
    );
    
    expect(screen.getByText('Error message')).toBeInTheDocument();
    expect(screen.queryByText('Helper text')).not.toBeInTheDocument();
  });

  test('handles full width variant', () => {
    render(<Material3Input label="Full Width" fullWidth />);
    
    const container = screen.getByLabelText('Full Width').closest('div');
    expect(container).toHaveClass('w-full');
  });

  test('handles success state', () => {
    render(<Material3Input label="Success Field" success />);
    
    const container = screen.getByLabelText('Success Field').closest('div');
    expect(container).toHaveClass('border-success');
  });

  test('maintains proper icon spacing', () => {
    render(
      <Material3Input
        label="Icon Spacing"
        leadingIcon={<span>🔍</span>}
        trailingIcon={<span>👁️</span>}
      />
    );
    
    const input = screen.getByLabelText('Icon Spacing');
    expect(input).toHaveClass('pl-12', 'pr-12');
  });

  test('handles controlled vs uncontrolled input', async () => {
    const { rerender } = render(<Material3Input label="Uncontrolled" />);
    
    let input = screen.getByLabelText('Uncontrolled');
    fireEvent.change(input, { target: { value: 'test' } });
    expect(input).toHaveValue('test');

    const handleChange = jest.fn();
    rerender(
      <Material3Input
        label="Controlled"
        value="controlled value"
        onChange={handleChange}
      />
    );
    
    input = screen.getByLabelText('Controlled');
    expect(input).toHaveValue('controlled value');
  });

  test('handles accessibility attributes', () => {
    render(
      <Material3Input
        label="Accessible Input"
        error
        errorText="Error message"
        helperText="Helper text"
        aria-describedby="custom-description"
      />
    );
    
    const input = screen.getByLabelText('Accessible Input');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby');
  });

  test('generates unique IDs for multiple inputs', () => {
    render(
      <div>
        <Material3Input label="Input 1" />
        <Material3Input label="Input 2" />
      </div>
    );
    
    const input1 = screen.getByLabelText('Input 1');
    const input2 = screen.getByLabelText('Input 2');
    
    expect(input1.id).not.toBe(input2.id);
    expect(input1.id).toBeTruthy();
    expect(input2.id).toBeTruthy();
  });

  test('handles onInvalid event', () => {
    const handleInvalid = jest.fn();
    render(
      <Material3Input
        label="Validation Test"
        required
        onInvalid={handleInvalid}
      />
    );
    
    const input = screen.getByLabelText('Validation Test');
    fireEvent.invalid(input);
    
    expect(handleInvalid).toHaveBeenCalledTimes(1);
  });
});