import React from 'react';
import { render, screen } from '@testing-library/react';
import NavigationShowcase from '../NavigationShowcase';
import '@testing-library/jest-dom';

// Mock the Navigation component
jest.mock('../../Navigation', () => {
  return function MockNavigation() {
    return <nav data-testid="mock-navigation">Mock Navigation</nav>;
  };
});

describe('NavigationShowcase', () => {
  it('renders the navigation showcase', () => {
    render(<NavigationShowcase />);
    
    expect(screen.getByText('Material 3 Expressive Navigation')).toBeInTheDocument();
    expect(screen.getByTestId('mock-navigation')).toBeInTheDocument();
  });

  it('displays features implemented', () => {
    render(<NavigationShowcase />);
    
    expect(screen.getByText('Features Implemented')).toBeInTheDocument();
    expect(screen.getByText(/Organic pill-shaped active indicators/)).toBeInTheDocument();
    expect(screen.getByText(/Dynamic color adaptation/)).toBeInTheDocument();
    expect(screen.getByText(/Smooth state transitions/)).toBeInTheDocument();
    expect(screen.getByText(/Enhanced focus indicators/)).toBeInTheDocument();
    expect(screen.getByText(/Responsive navigation behavior/)).toBeInTheDocument();
  });

  it('displays testing instructions', () => {
    render(<NavigationShowcase />);
    
    expect(screen.getByText('Testing Instructions')).toBeInTheDocument();
    expect(screen.getByText(/Hover over navigation items/)).toBeInTheDocument();
    expect(screen.getByText(/Click navigation items/)).toBeInTheDocument();
    expect(screen.getByText(/Use Tab key to navigate/)).toBeInTheDocument();
  });

  it('displays implementation complete message', () => {
    render(<NavigationShowcase />);
    
    expect(screen.getByText('Implementation Complete')).toBeInTheDocument();
    expect(screen.getByText(/navigation component has been successfully redesigned/)).toBeInTheDocument();
  });

  it('uses Material 3 design tokens in styling', () => {
    render(<NavigationShowcase />);
    
    // Check that the component renders with the expected structure
    // CSS custom properties will be resolved by the browser
    const container = screen.getByText('Material 3 Expressive Navigation').parentElement?.parentElement;
    expect(container).toBeInTheDocument();
    
    // Verify that Material 3 design tokens are used in inline styles
    const heading = screen.getByText('Material 3 Expressive Navigation');
    expect(heading).toHaveStyle({
      fontFamily: 'var(--md-sys-typescale-headline-large-font-family)',
      fontSize: 'var(--md-sys-typescale-headline-large-font-size)'
    });
  });
});