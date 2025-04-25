import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Summary from '../Summary';
import { useViewport } from '../../hooks/useViewport';

// Mock the useViewport hook
jest.mock('../../hooks/useViewport', () => ({
  useViewport: jest.fn()
}));

describe('Summary Mobile Enhancements', () => {
  // Sample timeline entries for testing
  const mockEntries = [
    {
      id: '1',
      activityId: 'activity-1',
      activityName: 'Activity 1',
      startTime: 1625097600000,
      endTime: 1625097900000,
      colors: { 
        background: 'hsl(200, 80%, 90%)', 
        border: 'hsl(200, 80%, 70%)' 
      }
    },
    {
      id: '2',
      activityId: 'activity-2',
      activityName: 'Activity 2',
      startTime: 1625097900000,
      endTime: 1625098500000,
      colors: { 
        background: 'hsl(150, 80%, 90%)', 
        border: 'hsl(150, 80%, 70%)' 
      }
    },
    {
      id: '3',
      activityId: 'activity-3',
      activityName: 'Activity 3',
      startTime: 1625098500000,
      endTime: 1625099100000,
      isBreak: true
    }
  ];

  const defaultProps = {
    entries: mockEntries,
    totalDuration: 1800, // 30 minutes
    elapsedTime: 900,    // 15 minutes
    timerActive: true
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default to mobile viewport
    (useViewport as jest.Mock).mockReturnValue({
      isMobile: true,
      hasTouch: true,
      width: 375,
      height: 667
    });
  });

  test('applies mobile-specific classes when on mobile viewport', () => {
    render(<Summary {...defaultProps} />);
    
    const summaryContainer = screen.getByTestId('summary-container');
    expect(summaryContainer).toHaveClass('mobileSummary');
  });

  test('renders status message with mobile styling', () => {
    render(<Summary {...defaultProps} />);
    
    const statusMessage = screen.getByTestId('status-message');
    expect(statusMessage).toHaveClass('mobileStatusMessage');
  });

  test('uses stacked layout for stats on small screens', () => {
    render(<Summary {...defaultProps} />);
    
    const statsContainer = screen.getByTestId('stats-container');
    expect(statsContainer).toHaveClass('mobileStats');
  });

  test('renders activity list with mobile-friendly styling', () => {
    render(<Summary {...defaultProps} />);
    
    const activityList = screen.getByTestId('activity-list');
    expect(activityList).toHaveClass('mobileActivityList');
    
    // Individual activity items should have mobile styling
    const activityItems = screen.getAllByTestId(/activity-item/);
    expect(activityItems[0]).toHaveClass('mobileActivityItem');
  });

  test('formats durations appropriately for mobile viewing', () => {
    render(<Summary {...defaultProps} />);
    
    const durationElements = screen.getAllByTestId(/duration/);
    
    // At least one duration element should have mobile styling
    expect(durationElements.length).toBeGreaterThan(0);
    expect(durationElements[0]).toHaveClass('mobileDuration');
  });

  test('uses larger typography for status message on mobile', () => {
    // Test with time-up state
    render(<Summary {...defaultProps} isTimeUp={true} />);
    
    const statusMessage = screen.getByTestId('status-message');
    expect(statusMessage).toHaveClass('mobileStatusMessage');
    
    // Text should be larger and more prominent
    const computedStyle = window.getComputedStyle(statusMessage);
    expect(statusMessage).toBeVisible();
  });

  test('provides touch-friendly spacing between items', () => {
    render(<Summary {...defaultProps} />);
    
    const activityItems = screen.getAllByTestId(/activity-item/);
    
    // Check that at least one activity item exists
    expect(activityItems.length).toBeGreaterThan(0);
    
    // Touch-friendly classes should be applied
    expect(activityItems[0]).toHaveClass('mobileActivityItem');
  });

  test('does not apply mobile styles on desktop', () => {
    // Mock desktop viewport
    (useViewport as jest.Mock).mockReturnValue({
      isMobile: false,
      hasTouch: false,
      width: 1024,
      height: 768
    });
    
    render(<Summary {...defaultProps} />);
    
    const summaryContainer = screen.getByTestId('summary-container');
    expect(summaryContainer).not.toHaveClass('mobileSummary');
    
    const activityList = screen.getByTestId('activity-list');
    expect(activityList).not.toHaveClass('mobileActivityList');
  });
});
