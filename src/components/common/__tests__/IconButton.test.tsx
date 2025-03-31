import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import IconButton from '../IconButton';

describe('IconButton', () => {
  const defaultProps = {
    onClick: jest.fn(),
    icon: 'check',
    label: 'Test Button',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with default props', () => {
    render(<IconButton {...defaultProps} />);
    
    const button = screen.getByRole('button', { name: /test button/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('title', 'Test Button');
    expect(button).toHaveAttribute('aria-label', 'Test Button');
  });

  it('renders with custom className', () => {
    render(<IconButton {...defaultProps} className="custom-class" />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  it('can be disabled', () => {
    render(<IconButton {...defaultProps} disabled />);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('calls onClick handler when clicked', () => {
    render(<IconButton {...defaultProps} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', () => {
    render(<IconButton {...defaultProps} disabled />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(defaultProps.onClick).not.toHaveBeenCalled();
  });

  it('renders the correct check icon', () => {
    render(<IconButton {...defaultProps} icon="check" />);
    
    // Check icon path should be rendered
    const svgPath = document.querySelector('path');
    expect(svgPath).toHaveAttribute('d', 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z');
  });

  it('renders the correct play icon', () => {
    render(<IconButton {...defaultProps} icon="play" />);
    
    // Play icon path should be rendered
    const svgPath = document.querySelector('path');
    expect(svgPath).toHaveAttribute('d', 'M8 5v14l11-7z');
  });

  it('renders the correct close icon', () => {
    render(<IconButton {...defaultProps} icon="close" />);
    
    // Close icon path should be rendered
    const svgPath = document.querySelector('path');
    expect(svgPath).toHaveAttribute('d', 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z');
  });

  it('applies variant styles correctly', () => {
    render(<IconButton {...defaultProps} variant="primary" />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('primary');
  });

  it('renders custom data-testid attribute', () => {
    render(<IconButton {...defaultProps} testId="custom-test-id" />);
    
    const button = screen.getByTestId('custom-test-id');
    expect(button).toBeInTheDocument();
  });
});