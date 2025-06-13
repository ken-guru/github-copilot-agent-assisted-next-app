import React from 'react';
import { render, screen, within, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import Summary from '../Summary';
import { TimelineEntry } from '@/types';

// Create timeline entries for testing chronological order
const createTestTimelineEntries = (configs: Array<{name: string, startTime: number, duration: number}>): TimelineEntry[] => {
  return configs.map((config, index) => ({
    id: `${index + 1}`,
    activityId: `activity-${index + 1}`,
    activityName: config.name,
    startTime: config.startTime,
    endTime: config.startTime + config.duration,
    colors: {
      background: '#E8F5E9',
      text: '#1B5E20',
      border: '#2E7D32'
    }
  }));
};

describe('Summary Activity Order', () => {
  // Reset any mocks and cleanup DOM between tests
  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  it('should display activities in chronological order by start time (clearly different times)', () => {
    // Activities with clearly different start times
    const entries = createTestTimelineEntries([
      { name: 'Activity C', startTime: 1000, duration: 500 },
      { name: 'Activity A', startTime: 500, duration: 300 },
      { name: 'Activity B', startTime: 800, duration: 200 }
    ]);
    
    render(
      <Summary entries={entries}
        totalDuration={2000}
        elapsedTime={2000}
        allActivitiesCompleted={true}
      />
    );
    
    // Get all activity items by data-testid
    const activityItems = screen.getAllByTestId(/^activity-summary-item-/);
    
    // Extract activity names from the name elements
    const activityNames = activityItems.map(item => {
      const nameElement = within(item).getByTestId(/^activity-name-/);
      return nameElement.textContent;
    });
    
    // Verify correct chronological order (by start time)
    expect(activityNames).toEqual(['Activity A', 'Activity B', 'Activity C']);
  });

  it('should display activities in chronological order with very similar start times', () => {
    // Activities with start times just milliseconds apart
    const entries = createTestTimelineEntries([
      { name: 'Second Activity', startTime: 1000, duration: 500 },
      { name: 'First Activity', startTime: 999, duration: 300 },
      { name: 'Third Activity', startTime: 1001, duration: 200 }
    ]);
    
    render(
      <Summary entries={entries}
        totalDuration={2000}
        elapsedTime={2000}
        allActivitiesCompleted={true}
      />
    );
    
    // Get all activity items by data-testid
    const activityItems = screen.getAllByTestId(/^activity-summary-item-/);
    
    // Extract activity names from the name elements
    const activityNames = activityItems.map(item => {
      const nameElement = within(item).getByTestId(/^activity-name-/);
      return nameElement.textContent;
    });
    
    // Verify correct chronological order even with small time differences
    expect(activityNames).toEqual(['First Activity', 'Second Activity', 'Third Activity']);
  });

  it('should maintain a consistent order for activities with identical start times', () => {
    // Activities with identical start times
    const entries = createTestTimelineEntries([
      { name: 'Reading', startTime: 1000, duration: 500 },
      { name: 'Coding', startTime: 1000, duration: 300 },
      { name: 'Exercise', startTime: 1000, duration: 200 }
    ]);
    
    // Clear any previous renders
    cleanup();
    
    const { unmount } = render(
      <Summary entries={entries}
        totalDuration={2000}
        elapsedTime={2000}
        allActivitiesCompleted={true}
      />
    );
    
    // Get all activity items by data-testid
    const activityItems = screen.getAllByTestId(/^activity-summary-item-/);
    
    // Extract activity names from the name elements
    const activityNames = activityItems.map(item => {
      const nameElement = within(item).getByTestId(/^activity-name-/);
      return nameElement.textContent;
    });
    
    // Check that we got the same activities (in some order)
    expect(activityNames).toHaveLength(3);
    expect(activityNames.includes('Reading')).toBe(true);
    expect(activityNames.includes('Coding')).toBe(true);
    expect(activityNames.includes('Exercise')).toBe(true);
    
    // Store the order from the first render
    const initialOrder = [...activityNames];
    
    // Unmount and remount to test consistency
    unmount();
    
    // Re-render the component
    render(
      <Summary entries={entries}
        totalDuration={2000}
        elapsedTime={2000}
        allActivitiesCompleted={true}
      />
    );
    
    // Get all activity items after re-render
    const newActivityItems = screen.getAllByTestId(/^activity-summary-item-/);
    
    // Extract activity names from the name elements
    const newActivityNames = newActivityItems.map(item => {
      const nameElement = within(item).getByTestId(/^activity-name-/);
      return nameElement.textContent;
    });
    
    // Verify the order is consistent across renders
    expect(newActivityNames).toEqual(initialOrder);
  });

  it('should maintain activity order after component re-renders', () => {
    // Create activities with different start times
    const entries = createTestTimelineEntries([
      { name: 'Activity 3', startTime: 1200, duration: 500 },
      { name: 'Activity 1', startTime: 1000, duration: 300 },
      { name: 'Activity 2', startTime: 1100, duration: 200 }
    ]);
    
    const { rerender } = render(
      <Summary entries={entries}
        totalDuration={2000}
        elapsedTime={2000}
        allActivitiesCompleted={true}
      />
    );
    
    // Get all activity items by data-testid
    let activityItems = screen.getAllByTestId(/^activity-summary-item-/);
    
    // Extract activity names from the name elements
    let activityNames = activityItems.map(item => {
      const nameElement = within(item).getByTestId(/^activity-name-/);
      return nameElement.textContent;
    });
    
    // Verify initial chronological order
    expect(activityNames).toEqual(['Activity 1', 'Activity 2', 'Activity 3']);
    
    // Re-render with same props (simulating a parent component re-render)
    rerender(
      <Summary entries={entries}
        totalDuration={2000}
        elapsedTime={2000}
        allActivitiesCompleted={true}
      />
    );
    
    // Check order after re-render
    activityItems = screen.getAllByTestId(/^activity-summary-item-/);
    activityNames = activityItems.map(item => {
      const nameElement = within(item).getByTestId(/^activity-name-/);
      return nameElement.textContent;
    });
    
    // Verify order is maintained after re-render
    expect(activityNames).toEqual(['Activity 1', 'Activity 2', 'Activity 3']);
  });
  
  it('should handle empty activity list gracefully', () => {
    render(
      <Summary entries={[]}
        totalDuration={1000}
        elapsedTime={1000}
        allActivitiesCompleted={true}
      />
    );
    
    // With empty entries, the Summary component might not render at all
    // or might render without activity items. Let's check both possibilities.
    
    // Either the summary container doesn't exist (valid behavior)
    // or no activity items are rendered (also valid)
    
    // Verify no activity items are rendered
    const activityItems = screen.queryAllByTestId(/activity-summary-item-/);
    expect(activityItems).toHaveLength(0);
    
    // Verify the "Time Spent per Activity" heading doesn't exist
    const activityHeading = screen.queryByText('Time Spent per Activity');
    expect(activityHeading).not.toBeInTheDocument();
  });
});
