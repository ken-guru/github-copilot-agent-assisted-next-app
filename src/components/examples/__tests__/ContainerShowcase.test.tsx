import React from 'react';
import { render, screen } from '@testing-library/react';
import { ContainerShowcase } from '../ContainerShowcase';

describe('ContainerShowcase', () => {
  it('renders without crashing', () => {
    render(<ContainerShowcase />);
    
    const heading = screen.getByText('Material 3 Expressive Container Components');
    expect(heading).toBeInTheDocument();
  });

  it('displays all container sections', () => {
    render(<ContainerShowcase />);
    
    // Check for main sections
    expect(screen.getByText('Basic Containers')).toBeInTheDocument();
    expect(screen.getByText('Shape Variations')).toBeInTheDocument();
    expect(screen.getByText('Interactive States')).toBeInTheDocument();
    expect(screen.getByText('Material 3 Cards')).toBeInTheDocument();
    expect(screen.getByText('Stats Cards')).toBeInTheDocument();
    expect(screen.getByText('Content States')).toBeInTheDocument();
    expect(screen.getByText('Color Roles')).toBeInTheDocument();
    expect(screen.getByText('Responsive Behavior')).toBeInTheDocument();
  });

  it('displays basic container variants', () => {
    render(<ContainerShowcase />);
    
    expect(screen.getByText('Elevated Container')).toBeInTheDocument();
    expect(screen.getByText('Filled Container')).toBeInTheDocument();
    expect(screen.getByText('Outlined Container')).toBeInTheDocument();
  });

  it('displays shape variations', () => {
    render(<ContainerShowcase />);
    
    expect(screen.getByText('Small Corners')).toBeInTheDocument();
    expect(screen.getByText('Asymmetric')).toBeInTheDocument();
    expect(screen.getByText('Activity Card')).toBeInTheDocument();
    expect(screen.getByText('Summary Card')).toBeInTheDocument();
  });

  it('displays interactive states', () => {
    render(<ContainerShowcase />);
    
    expect(screen.getByText('Interactive')).toBeInTheDocument();
    expect(screen.getByText('Focusable')).toBeInTheDocument();
    expect(screen.getAllByText('Active State')).toHaveLength(2); // One in interactive states, one in content states
    expect(screen.getAllByText('Loading State')).toHaveLength(2); // One in interactive states, one in content states
  });

  it('displays card examples', () => {
    render(<ContainerShowcase />);
    
    expect(screen.getByText('Card with Header')).toBeInTheDocument();
    expect(screen.getByText('Filled Card')).toBeInTheDocument();
    expect(screen.getByText('Outlined Card')).toBeInTheDocument();
  });

  it('displays stats cards with different configurations', () => {
    render(<ContainerShowcase />);
    
    expect(screen.getByText('Total Time')).toBeInTheDocument();
    expect(screen.getByText('2h 45m')).toBeInTheDocument();
    expect(screen.getByText('Completed Tasks')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('Active Sessions')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('Efficiency')).toBeInTheDocument();
    expect(screen.getByText('94%')).toBeInTheDocument();
  });

  it('displays content state examples', () => {
    render(<ContainerShowcase />);
    
    expect(screen.getByText('Default State')).toBeInTheDocument();
    expect(screen.getByText('Error State')).toBeInTheDocument();
    expect(screen.getByText('Success State')).toBeInTheDocument();
  });

  it('displays color role examples', () => {
    render(<ContainerShowcase />);
    
    expect(screen.getByText('Surface')).toBeInTheDocument();
    expect(screen.getByText('Primary')).toBeInTheDocument();
    expect(screen.getByText('Secondary')).toBeInTheDocument();
    expect(screen.getByText('Tertiary')).toBeInTheDocument();
  });

  it('displays responsive behavior examples', () => {
    render(<ContainerShowcase />);
    
    expect(screen.getByText('Responsive Container')).toBeInTheDocument();
    expect(screen.getByText('Mobile Optimized')).toBeInTheDocument();
    expect(screen.getByText('Tablet Ready')).toBeInTheDocument();
    expect(screen.getByText('Desktop Enhanced')).toBeInTheDocument();
  });

  it('includes interactive elements', () => {
    render(<ContainerShowcase />);
    
    // Check for buttons in card actions
    const cancelButton = screen.getByText('Cancel');
    const saveButton = screen.getByText('Save');
    
    expect(cancelButton).toBeInTheDocument();
    expect(saveButton).toBeInTheDocument();
  });

  it('includes trend indicators in stats cards', () => {
    render(<ContainerShowcase />);
    
    // Check for trend indicators (arrows)
    const upTrends = screen.getAllByLabelText(/Trend: up/);
    const neutralTrend = screen.getByLabelText('Trend: neutral');
    
    expect(upTrends.length).toBeGreaterThan(0);
    expect(neutralTrend).toBeInTheDocument();
  });

  it('includes icons in stats cards', () => {
    render(<ContainerShowcase />);
    
    // Check for emoji icons
    expect(screen.getByText('⏱️')).toBeInTheDocument();
    expect(screen.getByText('📈')).toBeInTheDocument();
  });

  it('includes secondary values in stats cards', () => {
    render(<ContainerShowcase />);
    
    expect(screen.getByText('+3 from yesterday')).toBeInTheDocument();
  });
});