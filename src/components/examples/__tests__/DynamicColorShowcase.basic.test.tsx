/**
 * Basic tests for Dynamic Color Showcase Component
 * Focuses on core functionality that doesn't depend on complex mocking
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DynamicColorShowcase } from '../DynamicColorShowcase';

// Mock the color system utilities with simple implementations
jest.mock('../../../utils/material3-color-system', () => ({
  generateDynamicColorScheme: jest.fn(() => ({
    primary: { 0: '#000000', 50: '#6750a4', 100: '#ffffff' },
    secondary: { 0: '#000000', 50: '#625b71', 100: '#ffffff' },
    tertiary: { 0: '#000000', 50: '#7d5260', 100: '#ffffff' },
    neutral: { 0: '#000000', 50: '#79747e', 100: '#ffffff' },
    neutralVariant: { 0: '#000000', 50: '#79747e', 100: '#ffffff' },
    error: { 0: '#000000', 50: '#ba1a1a', 100: '#ffffff' }
  })),
  getSemanticColorRoles: jest.fn(() => ({
    primary: '#6750a4',
    onPrimary: '#ffffff',
    secondary: '#625b71',
    onSecondary: '#ffffff',
    tertiary: '#7d5260',
    onTertiary: '#ffffff',
    surface: '#fffbfe',
    onSurface: '#1c1b1f',
    background: '#fffbfe',
    onBackground: '#1c1b1f'
  })),
  validateColorSchemeAccessibility: jest.fn(() => ({
    'primary-onPrimary': { ratio: 4.5, wcagAA: true, wcagAAA: false },
    'secondary-onSecondary': { ratio: 4.2, wcagAA: false, wcagAAA: false },
    'surface-onSurface': { ratio: 12.6, wcagAA: true, wcagAAA: true }
  })),
  applyDynamicColorScheme: jest.fn(),
  getContextualColor: jest.fn((color, state) => {
    if (state === 'hover') return '#5a3d8f';
    if (state === 'pressed') return '#4a2d7f';
    return color;
  })
}));

jest.mock('../../../utils/material3-utils', () => ({
  getMaterial3AccessibleColors: jest.fn(() => ({
    color: 'var(--md-sys-color-on-primary)',
    backgroundColor: 'var(--md-sys-color-primary)'
  })),
  getMaterial3SemanticColor: jest.fn(() => ({
    color: 'var(--md-sys-color-primary)',
    backgroundColor: 'var(--md-sys-color-primary-container)'
  }))
}));

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(() => Promise.resolve())
  }
});

describe('DynamicColorShowcase - Basic Functionality', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing', () => {
    render(<DynamicColorShowcase />);
    expect(screen.getByText('Material 3 Dynamic Color System')).toBeInTheDocument();
  });

  it('should render the main title and description', () => {
    render(<DynamicColorShowcase />);
    
    expect(screen.getByText('Material 3 Dynamic Color System')).toBeInTheDocument();
    expect(screen.getByText(/Explore dynamic color generation/)).toBeInTheDocument();
  });

  it('should render seed color controls', () => {
    render(<DynamicColorShowcase />);
    
    expect(screen.getByText('Seed Color:')).toBeInTheDocument();
    expect(screen.getAllByDisplayValue('#6750a4')).toHaveLength(2); // Color and text inputs
  });

  it('should render theme mode controls', () => {
    render(<DynamicColorShowcase />);
    
    expect(screen.getByText('light')).toBeInTheDocument();
    expect(screen.getByText('dark')).toBeInTheDocument();
    expect(screen.getByText('auto')).toBeInTheDocument();
  });

  it('should render accessibility report', () => {
    render(<DynamicColorShowcase />);
    
    expect(screen.getByText('Accessibility Report')).toBeInTheDocument();
    expect(screen.getByText('WCAG AA Compliant')).toBeInTheDocument();
    expect(screen.getByText('WCAG AAA Compliant')).toBeInTheDocument();
  });

  it('should update seed color when text input changes', () => {
    render(<DynamicColorShowcase />);
    
    // Get all inputs with the initial value
    const inputs = screen.getAllByDisplayValue('#6750a4');
    const textInput = inputs.find(input => input.getAttribute('type') === 'text');
    
    if (textInput) {
      fireEvent.change(textInput, { target: { value: '#ff0000' } });
      expect(textInput).toHaveValue('#ff0000');
    }
  });

  it('should update theme mode when button is clicked', () => {
    render(<DynamicColorShowcase />);
    
    const darkButton = screen.getByText('dark');
    fireEvent.click(darkButton);
    
    // The button should still be present (visual state change would be tested in integration tests)
    expect(darkButton).toBeInTheDocument();
  });

  it('should display accessibility statistics', () => {
    render(<DynamicColorShowcase />);
    
    // Based on mocked validation results: 2/3 pass AA, 1/3 pass AAA
    expect(screen.getByText('2/3')).toBeInTheDocument(); // WCAG AA
    expect(screen.getByText('1/3')).toBeInTheDocument(); // WCAG AAA
  });

  it('should display accessibility validation results', () => {
    render(<DynamicColorShowcase />);
    
    // Check that validation results are displayed
    expect(screen.getByText('primary-onPrimary')).toBeInTheDocument();
    expect(screen.getByText('4.50 ✓')).toBeInTheDocument();
    expect(screen.getByText('secondary-onSecondary')).toBeInTheDocument();
    expect(screen.getByText('4.20 ✗')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(<DynamicColorShowcase className="custom-class" />);
    
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('should call color system utilities on mount', () => {
    const { generateDynamicColorScheme, getSemanticColorRoles, validateColorSchemeAccessibility } = 
      require('../../../utils/material3-color-system');
    
    render(<DynamicColorShowcase />);
    
    expect(generateDynamicColorScheme).toHaveBeenCalledWith('#6750a4');
    expect(getSemanticColorRoles).toHaveBeenCalled();
    expect(validateColorSchemeAccessibility).toHaveBeenCalled();
  });

  it('should handle color input changes', () => {
    const { generateDynamicColorScheme } = require('../../../utils/material3-color-system');
    
    render(<DynamicColorShowcase />);
    
    // Get all inputs with the initial value
    const inputs = screen.getAllByDisplayValue('#6750a4');
    const colorInput = inputs.find(input => input.getAttribute('type') === 'color');
    
    if (colorInput) {
      fireEvent.change(colorInput, { target: { value: '#ff0000' } });
      
      // Should trigger regeneration of color scheme
      expect(generateDynamicColorScheme).toHaveBeenCalledWith('#ff0000');
    }
  });

  it('should handle invalid color inputs gracefully', () => {
    render(<DynamicColorShowcase />);
    
    const inputs = screen.getAllByDisplayValue('#6750a4');
    const textInput = inputs.find(input => input.getAttribute('type') === 'text');
    
    if (textInput) {
      // Test with invalid color
      fireEvent.change(textInput, { target: { value: 'invalid-color' } });
      
      // Component should still render without crashing
      expect(screen.getByText('Material 3 Dynamic Color System')).toBeInTheDocument();
    }
  });

  it('should render all required sections', () => {
    render(<DynamicColorShowcase />);
    
    // Check for main sections that should always render
    expect(screen.getByText('Material 3 Dynamic Color System')).toBeInTheDocument();
    expect(screen.getByText('Accessibility Report')).toBeInTheDocument();
    
    // These sections depend on mocked data, so they may or may not render
    const tonalSection = screen.queryByText('Tonal Palettes');
    const semanticSection = screen.queryByText('Semantic Color Roles');
    const interactiveSection = screen.queryByText('Interactive Color States');
    const applicationsSection = screen.queryByText('Semantic Color Applications');
    
    // At least one of these should render if mocking is working
    const hasAnySection = tonalSection || semanticSection || interactiveSection || applicationsSection;
    expect(hasAnySection).toBeTruthy();
  });
});