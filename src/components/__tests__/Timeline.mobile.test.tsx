import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Timeline from '../Timeline';
import { useViewport } from '../../hooks/useViewport';

// Mock the useViewport hook
jest.mock('../../hooks/useViewport', () => ({
  useViewport: jest.fn()
}));

describe('Timeline Mobile Enhancements', () => {
  // Sample timeline entries for testing
  const mockEntries = [
    {
      id: '1',
      activityId: 'activity-1',
      activityName: 'Activity 1',
      startTime: 1625097600000, // Some timestamp
      endTime: 1625097900000, // +5 minutes
      colors: { background: '#e0f7fa', border: '#00acc1' }
    },
    {
      id: '2',
      activityId: 'activity-2',
      activityName: 'Activity 2',
      startTime: 1625097900000,
      endTime: 1625098500000, // +10 minutes
      colors: { background: '#f3e5f5', border: '#9c27b0' }
    },
    {
      id: '3',
      activityId: 'activity-3',
      activityName: 'Break',
      startTime: 1625098500000,
      endTime: 1625098800000, // +5 minutes
      isBreak: true
    }
  ];
  
  const defaultProps = {
    entries: mockEntries,
    totalDuration: 1800, // 30 minutes
    elapsedTime: 900,    // 15 minutes
    timerActive: true,
    isTimeUp: false
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

  test('applies mobile-specific classes on mobile viewport', () => {
    render(<Timeline {...defaultProps} />);
    
    const timeline = screen.getByTestId('timeline-container');
    expect(timeline).toHaveClass('mobileTimeline');
  });

  test('renders compact time markers on small screens', () => {
    render(<Timeline {...defaultProps} />);
    
    const timeMarkers = screen.getAllByTestId('time-marker');
    
    // Check that at least one time marker exists
    expect(timeMarkers.length).toBeGreaterThan(0);
    
    // Check for compact time format
    const firstMarker = timeMarkers[0];
    expect(firstMarker).toHaveClass('mobileTimeMarker');
  });

  test('supports pinch zoom gestures on mobile', () => {
    render(<Timeline {...defaultProps} />);
    
    const timeline = screen.getByTestId('timeline-container');
    
    // Simulate pinch start with two touches
    fireEvent.touchStart(timeline, {
      touches: [
        { identifier: 0, clientX: 100, clientY: 100 },
        { identifier: 1, clientX: 150, clientY: 100 }
      ]
    });
    
    // Simulate pinch expand
    fireEvent.touchMove(timeline, {
      touches: [
        { identifier: 0, clientX: 50, clientY: 100 },
        { identifier: 1, clientX: 200, clientY: 100 }
      ]
    });
    
    // End touch
    fireEvent.touchEnd(timeline);
    
    // Verify zoom controls are visible after pinch
    const zoomControls = screen.getByTestId('zoom-controls');
    expect(zoomControls).toBeVisible();
  });

  test('shows touch-friendly zoom controls on mobile', () => {
    render(<Timeline {...defaultProps} />);
    
    // Initial state may have controls hidden
    const zoomInButton = screen.getByTestId('zoom-in-button');
    const zoomOutButton = screen.getByTestId('zoom-out-button');
    
    expect(zoomInButton).toBeInTheDocument();
    expect(zoomOutButton).toBeInTheDocument();
    
    // Touch controls should be larger on mobile
    expect(zoomInButton).toHaveClass('mobileZoomButton');
    expect(zoomOutButton).toHaveClass('mobileZoomButton');
  });

  test('presents activity details in a touch-friendly overlay', () => {
    render(<Timeline {...defaultProps} />);
    
    // Find an activity item
    const activityItem = screen.getByTestId('timeline-entry-1');
    
    // Tap on activity to show details
    fireEvent.click(activityItem);
    
    // Check if detail overlay appears
    const detailOverlay = screen.getByTestId('detail-overlay');
    expect(detailOverlay).toBeInTheDocument();
    expect(detailOverlay).toHaveClass('mobileDetailOverlay');
    
    // Check for close button
    const closeButton = screen.getByTestId('close-overlay-button');
    expect(closeButton).toBeInTheDocument();
    
    // Close the overlay
    fireEvent.click(closeButton);
    
    // Overlay should disappear
    expect(screen.queryByTestId('detail-overlay')).not.toBeInTheDocument();
  });

  test('optimizes visualization for small screens', () => {
    render(<Timeline {...defaultProps} />);
    
    // Check that the timeline visualization is adapted for mobile
    const visualizationContainer = screen.getByTestId('timeline-visualization');
    expect(visualizationContainer).toHaveClass('mobileVisualization');
    
    // Activity labels should be optimized for mobile
    const activityLabels = screen.getAllByTestId(/timeline-label/);
    expect(activityLabels[0]).toHaveClass('mobileLabel');
  });

  test('vertically centers current time indicator on mobile', () => {
    render(<Timeline {...defaultProps} />);
    
    const currentTimeIndicator = screen.getByTestId('current-time-indicator');
    expect(currentTimeIndicator).toHaveClass('mobileCentered');
  });

  test('applies touch-friendly styles to timeline entries', () => {
    render(<Timeline {...defaultProps} />);
    
    const entries = screen.getAllByTestId(/timeline-entry/);
    expect(entries[0]).toHaveClass('mobileTimelineEntry');
    
    // Touch targets should be larger
    const entryHeight = window.getComputedStyle(entries[0]).height;
    expect(parseInt(entryHeight)).toBeGreaterThan(30); // Assuming default is smaller
  });

  test('does not apply mobile styles on desktop', () => {
    // Mock desktop viewport
    (useViewport as jest.Mock).mockReturnValue({
      isMobile: false,
      hasTouch: false,
      width: 1024,
      height: 768
    });
    
    render(<Timeline {...defaultProps} />);
    
    const timeline = screen.getByTestId('timeline-container');
    expect(timeline).not.toHaveClass('mobileTimeline');
  });
});
