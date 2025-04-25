import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProgressBar from '../ProgressBar';
import { useViewport } from '../../hooks/useViewport';

// Mock the useViewport hook
jest.mock('../../hooks/useViewport', () => ({
  useViewport: jest.fn()
}));

// Mock the CSS modules
jest.mock('../ProgressBar.module.css', () => ({
  progressBarContainer: 'progressBarContainer',
  progressFill: 'progressFill',
  mobileProgressBarContainer: 'mobileProgressBarContainer',
  touchFriendly: 'touchFriendly',
  inactiveBar: 'inactiveBar',
  textLabel: 'textLabel',
  largeIndicator: 'largeIndicator',
  labelContainer: 'labelContainer',
  fadingLabel: 'fadingLabel'
}));

describe('ProgressBar Mobile Enhancements', () => {
  beforeEach(() => {
    // Clear mocks between tests
    jest.clearAllMocks();
    
    // Default to mobile viewport
    (useViewport as jest.Mock).mockReturnValue({
      isMobile: true,
      hasTouch: true,
      width: 375,
      height: 667
    });
  });
  
  test('applies mobile-specific classes on mobile viewport', () => {
    render(
      <ProgressBar 
        elapsedTime={1800}
        totalDuration={3600}
        isActive={true}
      />
    );
    
    const progressContainer = screen.getByRole('progressbar');
    expect(progressContainer).toHaveClass('mobileProgressBarContainer');
    expect(progressContainer).toHaveClass('touchFriendly');
  });
  
  test('does not apply mobile classes on desktop', () => {
    // Mock desktop viewport
    (useViewport as jest.Mock).mockReturnValue({
      isMobile: false,
      hasTouch: false,
      width: 1024,
      height: 768
    });
    
    render(
      <ProgressBar 
        elapsedTime={1800}
        totalDuration={3600}
        isActive={true}
      />
    );
    
    const progressContainer = screen.getByRole('progressbar');
    expect(progressContainer).not.toHaveClass('mobileProgressBarContainer');
    expect(progressContainer).not.toHaveClass('touchFriendly');
  });
  
  test('displays text percentage on mobile', () => {
    render(
      <ProgressBar 
        elapsedTime={1800}
        totalDuration={3600}
        isActive={true}
        showPercentage={true}
      />
    );
    
    // Check for percentage display (50%)
    const percentageLabel = screen.getByText('50%');
    expect(percentageLabel).toBeInTheDocument();
    expect(percentageLabel).toHaveClass('textLabel');
  });
  
  test('applies large indicator style on touch devices', () => {
    render(
      <ProgressBar 
        elapsedTime={1800}
        totalDuration={3600}
        isActive={true}
        showPercentage={true}
      />
    );
    
    const percentageLabel = screen.getByText('50%');
    expect(percentageLabel).toHaveClass('largeIndicator');
  });
  
  test('hides percentage display when showPercentage is false', () => {
    render(
      <ProgressBar 
        elapsedTime={1800}
        totalDuration={3600}
        isActive={true}
        showPercentage={false}
      />
    );
    
    // Should not find a percentage label
    const percentageLabel = screen.queryByText('50%');
    expect(percentageLabel).not.toBeInTheDocument();
  });
  
  test('applies fading label animation when progress changes', () => {
    const { rerender } = render(
      <ProgressBar 
        elapsedTime={1800}
        totalDuration={3600}
        isActive={true}
        showPercentage={true}
      />
    );
    
    // Initial render
    let percentageLabel = screen.getByText('50%');
    expect(percentageLabel.parentElement).not.toHaveClass('fadingLabel');
    
    // Update progress
    rerender(
      <ProgressBar 
        elapsedTime={2160}
        totalDuration={3600}
        isActive={true}
        showPercentage={true}
      />
    );
    
    // After progress change
    percentageLabel = screen.getByText('60%');
    expect(percentageLabel.parentElement).toHaveClass('fadingLabel');
  });
  
  test('maintains accessibility attributes on mobile', () => {
    render(
      <ProgressBar 
        elapsedTime={1800}
        totalDuration={3600}
        isActive={true}
        showPercentage={true}
      />
    );
    
    const progressbar = screen.getByRole('progressbar');
    expect(progressbar).toHaveAttribute('aria-valuenow', '50');
    expect(progressbar).toHaveAttribute('aria-valuemin', '0');
    expect(progressbar).toHaveAttribute('aria-valuemax', '100');
  });
});
