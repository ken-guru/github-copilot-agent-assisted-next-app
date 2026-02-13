import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MobileOptimizedInput } from '../forms/MobileOptimizedInput';

describe('MobileOptimizedInput Component', () => {
  test('renders input with label', () => {
    render(
      <MobileOptimizedInput 
        label="Test Label" 
        placeholder="Enter text"
      />
    );
    
    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  test('renders without label', () => {
    render(
      <MobileOptimizedInput 
        placeholder="No label"
      />
    );
    
    expect(screen.getByPlaceholderText('No label')).toBeInTheDocument();
  });

  test('displays error message', () => {
    render(
      <MobileOptimizedInput 
        label="Test Input"
        error="This field is required"
      />
    );
    
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  test('applies correct inputMode', () => {
    render(
      <MobileOptimizedInput 
        inputMode="numeric"
        placeholder="Number input"
      />
    );
    
    const input = screen.getByPlaceholderText('Number input');
    expect(input).toHaveAttribute('inputMode', 'numeric');
  });

  test('handles user input', () => {
    const handleChange = jest.fn();
    
    render(
      <MobileOptimizedInput 
        placeholder="Type here"
        onChange={handleChange}
      />
    );
    
    const input = screen.getByPlaceholderText('Type here');
    fireEvent.change(input, { target: { value: 'test' } });
    
    expect(handleChange).toHaveBeenCalled();
  });

  test('forwards ref correctly', () => {
    const ref = React.createRef<HTMLInputElement>();
    
    render(
      <MobileOptimizedInput 
        ref={ref}
        placeholder="Ref test"
      />
    );
    
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  test('applies custom className', () => {
    render(
      <MobileOptimizedInput 
        className="custom-class"
        placeholder="Custom class test"
      />
    );
    
    const input = screen.getByPlaceholderText('Custom class test');
    expect(input).toHaveClass('mobile-form-input');
    expect(input).toHaveClass('custom-class');
  });

  test('marks input as invalid when error is present', () => {
    render(
      <MobileOptimizedInput 
        error="Error message"
        placeholder="Invalid input"
      />
    );
    
    const input = screen.getByPlaceholderText('Invalid input');
    expect(input).toHaveClass('is-invalid');
  });
});
