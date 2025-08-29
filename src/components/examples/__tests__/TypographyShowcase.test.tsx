/**
 * Tests for TypographyShowcase component
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TypographyShowcase from '../TypographyShowcase';

describe('TypographyShowcase', () => {
  it('should render with default props', () => {
    render(<TypographyShowcase />);
    
    expect(screen.getByText('Material 3 Expressive Typography')).toBeInTheDocument();
    expect(screen.getByText(/Enhanced typography system/)).toBeInTheDocument();
  });

  it('should display contextual typography with comfortable context by default', () => {
    render(<TypographyShowcase />);
    
    expect(screen.getByText('Contextual Typography (comfortable)')).toBeInTheDocument();
  });

  it('should display contextual typography with specified context', () => {
    render(<TypographyShowcase context="compact" />);
    
    expect(screen.getByText('Contextual Typography (compact)')).toBeInTheDocument();
  });

  it('should show responsive behavior section when showResponsive is true', () => {
    render(<TypographyShowcase showResponsive={true} />);
    
    expect(screen.getByText('Responsive Behavior')).toBeInTheDocument();
    expect(screen.getByText(/automatically adapts to different screen sizes/)).toBeInTheDocument();
  });

  it('should hide responsive behavior section when showResponsive is false', () => {
    render(<TypographyShowcase showResponsive={false} />);
    
    expect(screen.queryByText('Responsive Behavior')).not.toBeInTheDocument();
  });

  it('should display font weight variations', () => {
    render(<TypographyShowcase />);
    
    expect(screen.getByText('Font Weight Variations')).toBeInTheDocument();
    expect(screen.getByText(/Light weight \(300\)/)).toBeInTheDocument();
    expect(screen.getByText(/Regular weight \(400\)/)).toBeInTheDocument();
    expect(screen.getByText(/Medium weight \(500\)/)).toBeInTheDocument();
    expect(screen.getByText(/Semi-bold weight \(600\)/)).toBeInTheDocument();
    expect(screen.getByText(/Bold weight \(700\)/)).toBeInTheDocument();
  });

  it('should use utility classes for styling', () => {
    render(<TypographyShowcase />);
    
    const utilityElement = screen.getByText('Interactive element with utility classes');
    expect(utilityElement).toHaveClass('md-typescale-display-small');
    expect(utilityElement).toHaveClass('md-color-primary');
    expect(utilityElement).toHaveClass('md-state-layer');
  });

  it('should apply responsive typography information', () => {
    render(<TypographyShowcase />);
    
    expect(screen.getByText(/Mobile: 87.5% scaling/)).toBeInTheDocument();
    expect(screen.getByText(/Tablet: 95% scaling/)).toBeInTheDocument();
    expect(screen.getByText(/Desktop: 105% scaling/)).toBeInTheDocument();
  });

  it('should have proper semantic structure', () => {
    render(<TypographyShowcase />);
    
    // Check for proper heading hierarchy
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toHaveTextContent('Material 3 Expressive Typography');
    
    const h2Elements = screen.getAllByRole('heading', { level: 2 });
    expect(h2Elements.length).toBeGreaterThan(0);
    
    const h3Elements = screen.getAllByRole('heading', { level: 3 });
    expect(h3Elements.length).toBeGreaterThan(0);
  });

  it('should apply CSS custom properties for theming', () => {
    render(<TypographyShowcase />);
    
    const container = screen.getByText(/This typography system automatically adapts/).closest('section');
    expect(container).toHaveStyle({
      backgroundColor: 'var(--md-sys-color-surface-container)',
    });
  });
});