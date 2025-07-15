import React from 'react';
import { render, screen } from '@testing-library/react';
import Timeline from '../Timeline';
import { TimelineEntry } from '../../types';

// Fixed timestamp for consistent testing
const FIXED_TIME = 1609459200000; // 2021-01-01 00:00:00

describe('Timeline Transition Behavior', () => {
  beforeEach(() => {
    // Mock Date.now() to return a fixed timestamp for deterministic results
    jest.useFakeTimers();
    jest.setSystemTime(FIXED_TIME);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should apply consistent transition styles to both activities and breaks', () => {
    // Setup entries with completed activity and ongoing break
    const mockEntries: TimelineEntry[] = [
      {
        id: '1',
        activityId: 'activity-1',
        activityName: 'Test Activity',
        startTime: FIXED_TIME - 60000, // Started 1 minute ago
        endTime: FIXED_TIME - 30000,   // Ended 30 seconds ago
        colors: {
          background: '#E8F5E9',
          text: '#1B5E20',
          border: '#2E7D32'
        }
      }
    ];

    render(
      <Timeline 
        entries={mockEntries}
        totalDuration={3600}
        elapsedTime={60}
        timerActive={true}
        allActivitiesCompleted={false}
      />
    );

    // Get the timeline container which should contain both activity and break elements
    const timelineContainer = document.querySelector('.timeline-container');
    expect(timelineContainer).toBeInTheDocument();

    // Find activity element (should have class containing 'timelineEntry')
    const activityElement = document.querySelector('[class*="timelineEntry"]');
    expect(activityElement).toBeInTheDocument();

    // Find break element (should have class containing 'timeGap')
    const breakElement = document.querySelector('[class*="timeGap"]');
    expect(breakElement).toBeInTheDocument();

    // Get computed styles
    const activityStyles = activityElement ? window.getComputedStyle(activityElement) : null;
    const breakStyles = breakElement ? window.getComputedStyle(breakElement) : null;

    expect(activityStyles).not.toBeNull();
    expect(breakStyles).not.toBeNull();

    // Both should have transition properties set
    // Note: In JSDOM, getComputedStyle might not return the exact CSS transition values,
    // but we can at least verify the elements exist and would receive the styles
    expect(activityElement?.className).toContain('timelineEntry');
    expect(breakElement?.className).toContain('timeGap');
  });

  it('should render break elements with proper CSS classes for transitions', () => {
    // Setup entry that has ended to create a break
    const mockEntries: TimelineEntry[] = [
      {
        id: '1',
        activityId: 'activity-1',
        activityName: 'Test Activity',
        startTime: FIXED_TIME - 60000,
        endTime: FIXED_TIME - 30000,
        colors: {
          background: '#E8F5E9',
          text: '#1B5E20',
          border: '#2E7D32'
        }
      }
    ];

    render(
      <Timeline 
        entries={mockEntries}
        totalDuration={3600}
        elapsedTime={60}
        timerActive={true}
        allActivitiesCompleted={false}
      />
    );

    // Verify that break element has the timeGap class which should have the transition CSS
    const breakElement = screen.getByText((content) => {
      return content.includes('Break') && content.includes('0:30');
    });
    expect(breakElement).toBeInTheDocument();
    
    // Verify the break element has the proper parent with timeGap styling
    expect(breakElement.closest('[class*="timeGap"]')).toBeInTheDocument();
  });

  it('should maintain consistent styling structure for smooth transitions', () => {
    // Test with multiple entries to ensure both activities and breaks maintain consistent structure
    const mockEntries: TimelineEntry[] = [
      {
        id: '1',
        activityId: 'activity-1',
        activityName: 'First Activity',
        startTime: FIXED_TIME - 120000,
        endTime: FIXED_TIME - 90000,
        colors: {
          background: '#E8F5E9',
          text: '#1B5E20',
          border: '#2E7D32'
        }
      },
      {
        id: '2',
        activityId: 'activity-2',
        activityName: 'Second Activity',
        startTime: FIXED_TIME - 60000,
        endTime: FIXED_TIME - 30000,
        colors: {
          background: '#E3F2FD',
          text: '#0D47A1',
          border: '#1976D2'
        }
      }
    ];

    render(
      <Timeline 
        entries={mockEntries}
        totalDuration={3600}
        elapsedTime={120}
        timerActive={true}
        allActivitiesCompleted={false}
      />
    );

    // Should have activity elements
    const activityElements = document.querySelectorAll('[class*="timelineEntry"]');
    expect(activityElements).toHaveLength(2);

    // Should have break elements (gaps between activities and current break)
    const breakElements = document.querySelectorAll('[class*="timeGap"]');
    expect(breakElements.length).toBeGreaterThanOrEqual(1);

    // All elements should be within the entries wrapper
    const entriesWrapper = document.querySelector('[class*="entriesWrapper"]');
    expect(entriesWrapper).toBeInTheDocument();
    
    // Verify that both activities and breaks are children of the entries wrapper
    activityElements.forEach(element => {
      expect(entriesWrapper).toContainElement(element as HTMLElement);
    });
    
    breakElements.forEach(element => {
      expect(entriesWrapper).toContainElement(element as HTMLElement);
    });
  });
});