import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Button from '../Button';

describe('Button', () => {
  const defaultProps = {
    onClick: jest.fn(),
    children: 'Test Button',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with default props', () => {
    render(<Button {...defaultProps} />);
    
    const button = screen.getByRole('button', { name: /test button/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Test Button');
  });

  it('renders with custom className', () => {
    render(<Button {...defaultProps} className="custom-class" />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  it('can be disabled', () => {
    render(<Button {...defaultProps} disabled />);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('calls onClick handler when clicked', () => {
    render(<Button {...defaultProps} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', () => {
    render(<Button {...defaultProps} disabled />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(defaultProps.onClick).not.toHaveBeenCalled();
  });

  it('renders with different variants', () => {
    const { rerender } = render(
      <Button {...defaultProps} variant="primary" />
    );
    
    let button = screen.getByRole('button');
    expect(button).toHaveClass('primary');
    
    rerender(
      <Button {...defaultProps} variant="secondary" />
    );
    
    button = screen.getByRole('button');
    expect(button).toHaveClass('secondary');
    
    rerender(
      <Button {...defaultProps} variant="danger" />
    );
    
    button = screen.getByRole('button');
    expect(button).toHaveClass('danger');
  });

  it('renders with different sizes', () => {
    const { rerender } = render(
      <Button {...defaultProps} size="small" />
    );
    
    let button = screen.getByRole('button');
    expect(button).toHaveClass('small');
    
    rerender(
      <Button {...defaultProps} size="large" />
    );
    
    button = screen.getByRole('button');
    expect(button).toHaveClass('large');
  });

  it('renders with an icon when provided', () => {
    render(
      <Button {...defaultProps} iconLeft="check" />
    );
    
    const icon = document.querySelector('svg');
    expect(icon).toBeInTheDocument();
    
    const path = document.querySelector('path');
    expect(path).toHaveAttribute('d', 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z');
  });

  it('renders with a right-aligned icon when provided', () => {
    render(
      <Button {...defaultProps} iconRight="play" />
    );
    
    const icon = document.querySelector('svg');
    expect(icon).toBeInTheDocument();
    
    // Verify the icon has the correct className indicating it's positioned on the right
    const iconContainer = icon?.parentElement;
    expect(iconContainer).toHaveClass('iconRight');
    
    const path = document.querySelector('path');
    expect(path).toHaveAttribute('d', 'M8 5v14l11-7z');
  });

  it('renders a custom data-testid when provided', () => {
    render(
      <Button {...defaultProps} testId="custom-button-testid" />
    );
    
    const button = screen.getByTestId('custom-button-testid');
    expect(button).toBeInTheDocument();
  });

  it('applies fullWidth style when specified', () => {
    render(
      <Button {...defaultProps} fullWidth />
    );
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('fullWidth');
  });
});