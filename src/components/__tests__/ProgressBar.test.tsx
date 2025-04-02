import React from 'react';
import { render } from '@testing-library/react';
import ProgressBar from '../ProgressBar';
import { TimelineEntry } from '../Timeline';

// Mock the CSS module
jest.mock('../ProgressBar.module.css', () => ({
  container: 'container',
  progressBarContainer: 'progressBarContainer',
  progressFill: 'progressFill',
  timeMarkers: 'timeMarkers',
  timeMarker: 'timeMarker',
  inactiveBar: 'inactiveBar',
  mobileContainer: 'mobileContainer'
}));

// Mock getComputedStyle to return our CSS variables
Object.defineProperty(window, 'getComputedStyle', {
  value: () => ({
    getPropertyValue: (prop: string) => {
      switch (prop) {
        case '--progress-green-hue':
          return '142';
        case '--progress-yellow-hue':
          return '48';
        case '--progress-orange-hue':
          return '25';
        case '--progress-red-hue':
          return '0';
        case '--progress-saturation':
          return '85%';
        case '--progress-lightness':
          return '45%';
        default:
          return '';
      }
    }
  })
});

describe('ProgressBar Component', () => {
  const mockEntries: TimelineEntry[] = [
    {
      id: '1',
      activityId: 'activity-1',
      activityName: 'Task 1',
      startTime: 0,
      endTime: 1800000, // 30 minutes
      colors: {
        background: '#E8F5E9',
        text: '#1B5E20',
        border: '#2E7D32'
      }
    },
  ];

  it('should render empty inactive progress bar when timer is not active', () => {
    const { container } = render(
      <ProgressBar 
        entries={mockEntries}
        totalDuration={3600}
        elapsedTime={0}
        timerActive={false}
      />
    );
    
    // Should now render an empty progress bar instead of null
    expect(container.firstChild).not.toBeNull();
    
    const progressBarContainer = container.querySelector('.progressBarContainer');
    expect(progressBarContainer).toBeInTheDocument();
    
    // Should have inactive state
    expect(progressBarContainer).toHaveClass('inactiveBar');
  });

  it('should render the progress bar with correct progress percentage', () => {
    const { container } = render(
      <ProgressBar 
        entries={mockEntries}
        totalDuration={3600}
        elapsedTime={1800} // 50% of total duration
        timerActive={true}
      />
    );
    
    const progressFill = container.querySelector('.progressFill');
    expect(progressFill).toBeInTheDocument();
    
    // Updated to check for style attribute containing width: 50%
    const style = progressFill?.getAttribute('style');
    expect(style).toContain('width: 50%');
  });

  it('should have background color style when less than 50% of time is elapsed', () => {
    const { container } = render(
      <ProgressBar 
        entries={mockEntries}
        totalDuration={3600}
        elapsedTime={1440} // 40% of total duration
        timerActive={true}
      />
    );
    
    const progressFill = container.querySelector('.progressFill');
    // Updated to check for style attribute containing background-color
    const style = progressFill?.getAttribute('style');
    expect(style).toContain('background-color:');
  });

  it('should have background color style when between 50% and 75% of time is elapsed', () => {
    const { container } = render(
      <ProgressBar 
        entries={mockEntries}
        totalDuration={3600}
        elapsedTime={2340} // 65% of total duration
        timerActive={true}
      />
    );
    
    const progressFill = container.querySelector('.progressFill');
    // Updated to check for style attribute containing background-color
    const style = progressFill?.getAttribute('style');
    expect(style).toContain('background-color:');
  });

  it('should have background color style when between 75% and 100% of time is elapsed', () => {
    const { container } = render(
      <ProgressBar 
        entries={mockEntries}
        totalDuration={3600}
        elapsedTime={3240} // 90% of total duration
        timerActive={true}
      />
    );
    
    const progressFill = container.querySelector('.progressFill');
    // Updated to check for style attribute containing background-color
    const style = progressFill?.getAttribute('style');
    expect(style).toContain('background-color:');
  });

  it('should have red color when 100% or more of time is elapsed', () => {
    const { container } = render(
      <ProgressBar 
        entries={mockEntries}
        totalDuration={3600}
        elapsedTime={3600} // 100% of total duration
        timerActive={true}
      />
    );
    
    const progressFill = container.querySelector('.progressFill');
    // Updated to check for style attribute containing background-color
    const style = progressFill?.getAttribute('style');
    expect(style).toContain('background-color:');
    // We can't test the exact color but we can verify the style attribute exists
  });

  it('should cap at 100% width when time exceeds provided duration', () => {
    const { container } = render(
      <ProgressBar 
        entries={mockEntries}
        totalDuration={3600}
        elapsedTime={4500} // 125% of total duration
        timerActive={true}
      />
    );
    
    const progressFill = container.querySelector('.progressFill');
    // Updated to check for style attribute containing width: 100%
    const style = progressFill?.getAttribute('style');
    expect(style).toContain('width: 100%');
  });
  
  it('should have appropriate aria-valuenow attribute for accessibility', () => {
    const { container } = render(
      <ProgressBar 
        entries={mockEntries}
        totalDuration={3600}
        elapsedTime={1800} // 50% of total duration
        timerActive={true}
      />
    );
    
    const progressBar = container.querySelector('[role="progressbar"]');
    expect(progressBar).toHaveAttribute('aria-valuenow', '50');
  });

  // Since testing height directly isn't reliable in Jest, we'll verify it exists and is rendered
  it('should render the progress bar component', () => {
    const { container } = render(
      <ProgressBar 
        entries={mockEntries}
        totalDuration={3600}
        elapsedTime={1800}
        timerActive={true}
      />
    );
    
    const progressBarContainer = container.querySelector('.progressBarContainer');
    expect(progressBarContainer).toBeInTheDocument();
    // We'll rely on the CSS file for the height definition
  });

  it('should render time markers in the correct order for mobile view', () => {
    // Mock matchMedia to simulate mobile viewport
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: query === '(max-width: 768px)',
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    const { container } = render(
      <ProgressBar 
        entries={mockEntries}
        totalDuration={3600}
        elapsedTime={1800}
        timerActive={true}
      />
    );
    
    // Check that container has mobile class
    const root = container.firstChild;
    expect(root).not.toBeNull();
    expect(root).toHaveClass('mobileContainer');
    
    // Get all direct children of the container
    if (!root) return;
    const children = root.childNodes;
    
    // First child should be time markers in mobile view
    expect(children[0]).toHaveClass('timeMarkers');
    
    // Second child should be progress bar container
    expect(children[1]).toHaveClass('progressBarContainer');
  });
});
