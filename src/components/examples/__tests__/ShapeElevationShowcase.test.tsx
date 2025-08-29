/**
 * Tests for Material 3 Expressive Shape and Elevation Showcase Component
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ShapeElevationShowcase } from '../ShapeElevationShowcase';

// Mock the Material 3 utilities
jest.mock('../../../utils/material3-utils', () => ({
  getMaterial3ComponentStyle: jest.fn(() => ({
    backgroundColor: 'var(--md-sys-color-surface)',
    color: 'var(--md-sys-color-on-surface)',
    borderRadius: 'var(--md-sys-shape-corner-large)',
    boxShadow: 'var(--md-sys-elevation-level1)',
  })),
  getMaterial3ExpressiveContainer: jest.fn(() => ({
    borderRadius: 'var(--md-sys-shape-corner-medium)',
    boxShadow: 'var(--md-sys-elevation-level1)',
    transition: 'all 200ms cubic-bezier(0.2, 0.0, 0, 1.0)',
  })),
  getMaterial3OrganicShape: jest.fn(() => ({
    borderRadius: 'var(--md-sys-shape-corner-asymmetric-medium)',
  })),
  getMaterial3ContextualElevation: jest.fn(() => ({
    boxShadow: 'var(--md-sys-elevation-card-resting)',
  })),
  getMaterial3ResponsiveShape: jest.fn(() => ({
    borderRadius: 'calc(var(--md-sys-shape-corner-medium) * var(--md-sys-shape-scale-factor-comfortable))',
  })),
  getMaterial3OrganicElevation: jest.fn(() => ({
    boxShadow: 'var(--md-sys-elevation-organic-moderate)',
  })),
}));

describe('ShapeElevationShowcase', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the showcase component', () => {
    render(<ShapeElevationShowcase />);
    
    expect(screen.getByText('Material 3 Expressive Shape & Elevation System')).toBeInTheDocument();
    expect(screen.getByText(/Explore organic corner radius variations/)).toBeInTheDocument();
  });

  it('displays all component type options', () => {
    render(<ShapeElevationShowcase />);
    
    const componentTypes = ['Button', 'Card', 'Field', 'Navigation', 'Activity', 'Timer', 'Summary', 'Chip'];
    componentTypes.forEach(type => {
      const elements = screen.getAllByText(type);
      expect(elements.length).toBeGreaterThan(0);
    });
  });

  it('displays all shape variant options', () => {
    render(<ShapeElevationShowcase />);
    
    const shapeVariants = ['Primary', 'Secondary', 'Tertiary', 'Organic', 'Asymmetric'];
    shapeVariants.forEach(variant => {
      const elements = screen.getAllByText(variant);
      expect(elements.length).toBeGreaterThan(0);
    });
  });

  it('displays all elevation state options', () => {
    render(<ShapeElevationShowcase />);
    
    const elevationStates = ['Resting', 'Hover', 'Pressed', 'Focused', 'Dragged'];
    elevationStates.forEach(state => {
      expect(screen.getByText(state)).toBeInTheDocument();
    });
  });

  it('allows selecting different component types', () => {
    render(<ShapeElevationShowcase />);
    
    const buttonRadio = screen.getByDisplayValue('button');
    fireEvent.click(buttonRadio);
    
    expect(buttonRadio).toBeChecked();
  });

  it('allows selecting different shape variants', () => {
    render(<ShapeElevationShowcase />);
    
    const organicRadio = screen.getByDisplayValue('organic');
    fireEvent.click(organicRadio);
    
    expect(organicRadio).toBeChecked();
  });

  it('allows selecting different elevation states', () => {
    render(<ShapeElevationShowcase />);
    
    const hoverRadio = screen.getByDisplayValue('hover');
    fireEvent.click(hoverRadio);
    
    expect(hoverRadio).toBeChecked();
  });

  it('allows toggling interactive transitions', () => {
    render(<ShapeElevationShowcase />);
    
    const interactiveCheckbox = screen.getByLabelText('Interactive Transitions');
    expect(interactiveCheckbox).toBeChecked(); // Default is true
    
    fireEvent.click(interactiveCheckbox);
    expect(interactiveCheckbox).not.toBeChecked();
  });

  it('displays the live preview section', () => {
    render(<ShapeElevationShowcase />);
    
    expect(screen.getByText('Live Preview')).toBeInTheDocument();
    const cardElements = screen.getAllByText('Card');
    expect(cardElements.length).toBeGreaterThan(0); // Default component type appears in multiple places
    expect(screen.getByText('primary • resting')).toBeInTheDocument(); // Default variant and state
  });

  it('displays organic shape variations grid', () => {
    render(<ShapeElevationShowcase />);
    
    expect(screen.getByText('Organic Shape Variations')).toBeInTheDocument();
    
    // Check that shape examples are rendered
    const shapeVariants = ['Primary', 'Secondary', 'Tertiary', 'Organic', 'Asymmetric'];
    shapeVariants.forEach(variant => {
      // Should appear in both the controls and the examples grid
      const elements = screen.getAllByText(variant);
      expect(elements.length).toBeGreaterThan(1);
    });
  });

  it('displays elevation levels grid', () => {
    render(<ShapeElevationShowcase />);
    
    expect(screen.getByText('Elevation Levels')).toBeInTheDocument();
    
    // Check that elevation levels 0-8 are displayed
    for (let i = 0; i <= 8; i++) {
      expect(screen.getByText(`Level ${i}`)).toBeInTheDocument();
    }
  });

  it('displays organic elevation variations', () => {
    render(<ShapeElevationShowcase />);
    
    expect(screen.getByText('Organic Elevation Variations')).toBeInTheDocument();
    expect(screen.getByText('Subtle')).toBeInTheDocument();
    expect(screen.getByText('Moderate')).toBeInTheDocument();
    expect(screen.getByText('Pronounced')).toBeInTheDocument();
  });

  it('displays directional shadows', () => {
    render(<ShapeElevationShowcase />);
    
    expect(screen.getByText('Directional Shadows')).toBeInTheDocument();
    expect(screen.getByText('Top')).toBeInTheDocument();
    expect(screen.getByText('Bottom')).toBeInTheDocument();
    expect(screen.getByText('Left')).toBeInTheDocument();
    expect(screen.getByText('Right')).toBeInTheDocument();
  });

  it('displays responsive shape scaling examples', () => {
    render(<ShapeElevationShowcase />);
    
    expect(screen.getByText('Responsive Shape Scaling')).toBeInTheDocument();
    expect(screen.getByText('Compact')).toBeInTheDocument();
    expect(screen.getByText('Comfortable')).toBeInTheDocument();
    expect(screen.getByText('Spacious')).toBeInTheDocument();
  });

  it('displays usage examples', () => {
    render(<ShapeElevationShowcase />);
    
    expect(screen.getByText('Usage Examples')).toBeInTheDocument();
    expect(screen.getByText('CSS Classes')).toBeInTheDocument();
    expect(screen.getByText('Utility Functions')).toBeInTheDocument();
    
    // Check for some utility function names
    expect(screen.getByText('getMaterial3OrganicShape()')).toBeInTheDocument();
    expect(screen.getByText('getMaterial3ContextualElevation()')).toBeInTheDocument();
    expect(screen.getByText('getMaterial3ExpressiveContainer()')).toBeInTheDocument();
    expect(screen.getByText('getMaterial3ResponsiveShape()')).toBeInTheDocument();
  });

  it('updates live preview when selections change', () => {
    render(<ShapeElevationShowcase />);
    
    // Change component type to button
    const buttonRadio = screen.getByDisplayValue('button');
    fireEvent.click(buttonRadio);
    
    const buttonElements = screen.getAllByText('Button');
    expect(buttonElements.length).toBeGreaterThan(0);
    
    // Change shape variant to organic
    const organicRadio = screen.getByDisplayValue('organic');
    fireEvent.click(organicRadio);
    
    // Change elevation state to hover
    const hoverRadio = screen.getByDisplayValue('hover');
    fireEvent.click(hoverRadio);
    
    expect(screen.getByText('organic • hover')).toBeInTheDocument();
  });

  it('applies custom className when provided', () => {
    const { container } = render(<ShapeElevationShowcase className="custom-class" />);
    
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('calls Material 3 utility functions with correct parameters', () => {
    const { getMaterial3ExpressiveContainer } = require('../../../utils/material3-utils');
    
    render(<ShapeElevationShowcase />);
    
    expect(getMaterial3ExpressiveContainer).toHaveBeenCalledWith({
      componentType: 'card',
      shapeVariant: 'primary',
      elevationState: 'resting',
      responsive: true,
      context: 'comfortable',
      interactive: true,
    });
  });

  it('handles component type changes correctly', () => {
    const { getMaterial3ExpressiveContainer } = require('../../../utils/material3-utils');
    
    render(<ShapeElevationShowcase />);
    
    // Change to button
    const buttonRadio = screen.getByDisplayValue('button');
    fireEvent.click(buttonRadio);
    
    expect(getMaterial3ExpressiveContainer).toHaveBeenCalledWith(
      expect.objectContaining({
        componentType: 'button',
      })
    );
  });

  it('handles shape variant changes correctly', () => {
    const { getMaterial3ExpressiveContainer } = require('../../../utils/material3-utils');
    
    render(<ShapeElevationShowcase />);
    
    // Change to asymmetric
    const asymmetricRadio = screen.getByDisplayValue('asymmetric');
    fireEvent.click(asymmetricRadio);
    
    expect(getMaterial3ExpressiveContainer).toHaveBeenCalledWith(
      expect.objectContaining({
        shapeVariant: 'asymmetric',
      })
    );
  });

  it('handles elevation state changes correctly', () => {
    const { getMaterial3ExpressiveContainer } = require('../../../utils/material3-utils');
    
    render(<ShapeElevationShowcase />);
    
    // Change to pressed
    const pressedRadio = screen.getByDisplayValue('pressed');
    fireEvent.click(pressedRadio);
    
    expect(getMaterial3ExpressiveContainer).toHaveBeenCalledWith(
      expect.objectContaining({
        elevationState: 'pressed',
      })
    );
  });

  it('handles interactive toggle correctly', () => {
    const { getMaterial3ExpressiveContainer } = require('../../../utils/material3-utils');
    
    render(<ShapeElevationShowcase />);
    
    // Toggle interactive off
    const interactiveCheckbox = screen.getByLabelText('Interactive Transitions');
    fireEvent.click(interactiveCheckbox);
    
    expect(getMaterial3ExpressiveContainer).toHaveBeenCalledWith(
      expect.objectContaining({
        interactive: false,
      })
    );
  });
});