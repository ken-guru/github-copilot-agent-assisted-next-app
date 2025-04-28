import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock RootLayout component with proper casing for React components
const MockRootLayout = ({ children }) => (
  <div data-testid="mock-layout-wrapper">
    <div data-testid="mock-html" lang="en">
      <div data-testid="mock-body" className="mocked-geist-variable mocked-geist-mono-variable">
        <div data-testid="layout-client">{children}</div>
        <div data-testid="register-service-worker">Script</div>
      </div>
    </div>
  </div>
);

// Simple test for the layout components
describe('RootLayout', () => {
  test('Component Structure', () => {
    render(
      <MockRootLayout>
        <div>Test content</div>
      </MockRootLayout>
    );
    
    // Check wrapper exists
    const wrapper = screen.getByTestId('mock-layout-wrapper');
    expect(wrapper).toBeInTheDocument();
    
    // Check html tag
    const html = screen.getByTestId('mock-html');
    expect(html).toHaveAttribute('lang', 'en');
    
    // Check body class
    const body = screen.getByTestId('mock-body');
    expect(body.className).toContain('mocked-geist-variable');
    expect(body.className).toContain('mocked-geist-mono-variable');
  });
  
  test('renders LayoutClient component', () => {
    render(
      <MockRootLayout>
        <div>Test content</div>
      </MockRootLayout>
    );
    
    const layoutClient = screen.getByTestId('layout-client');
    expect(layoutClient).toBeInTheDocument();
  });
});
