import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import StatusIndicator from '../StatusIndicator';

describe('StatusIndicator', () => {
  it('renders successfully with default props', () => {
    render(<StatusIndicator status="default" />);
    
    const indicator = screen.getByTestId('status-indicator');
    expect(indicator).toBeInTheDocument();
    expect(indicator).toHaveClass('default');
  });

  it('renders with different status types', () => {
    const { rerender } = render(<StatusIndicator status="success" />);
    let indicator = screen.getByTestId('status-indicator');
    expect(indicator).toHaveClass('success');
    
    rerender(<StatusIndicator status="error" />);
    indicator = screen.getByTestId('status-indicator');
    expect(indicator).toHaveClass('error');
    
    rerender(<StatusIndicator status="warning" />);
    indicator = screen.getByTestId('status-indicator');
    expect(indicator).toHaveClass('warning');
    
    rerender(<StatusIndicator status="info" />);
    indicator = screen.getByTestId('status-indicator');
    expect(indicator).toHaveClass('info');
    
    rerender(<StatusIndicator status="running" />);
    indicator = screen.getByTestId('status-indicator');
    expect(indicator).toHaveClass('running');
  });

  it('renders with label when provided', () => {
    render(<StatusIndicator status="success" label="Operation completed" />);
    
    const label = screen.getByText('Operation completed');
    expect(label).toBeInTheDocument();
  });

  it('renders with custom className', () => {
    render(<StatusIndicator status="default" className="custom-class" />);
    
    const indicator = screen.getByTestId('status-indicator');
    expect(indicator).toHaveClass('custom-class');
  });

  it('renders with a pulsing animation for running status', () => {
    render(<StatusIndicator status="running" />);
    
    const indicator = screen.getByTestId('status-indicator');
    expect(indicator).toHaveClass('pulsing');
  });

  it('does not render pulsing animation for non-running status', () => {
    render(<StatusIndicator status="success" />);
    
    const indicator = screen.getByTestId('status-indicator');
    expect(indicator).not.toHaveClass('pulsing');
  });

  it('can be explicitly set to pulsing', () => {
    render(<StatusIndicator status="warning" pulsing />);
    
    const indicator = screen.getByTestId('status-indicator');
    expect(indicator).toHaveClass('pulsing');
  });

  it('renders with custom size', () => {
    render(<StatusIndicator status="default" size="large" />);
    
    const indicator = screen.getByTestId('status-indicator');
    expect(indicator).toHaveClass('large');
  });

  it('renders with custom data-testid', () => {
    render(<StatusIndicator status="default" testId="custom-test-id" />);
    
    const indicator = screen.getByTestId('custom-test-id');
    expect(indicator).toBeInTheDocument();
  });
});