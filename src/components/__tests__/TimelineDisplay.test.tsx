import React from 'react';
import { render, screen } from '@testing-library/react';
import { createTimelineEntries } from '../../utils/testUtils/factories';
import TimelineDisplay from '../TimelineDisplay';

// Mock the child Timeline component that would render the entries
jest.mock('../Timeline', () => {
  return {
    __esModule: true,
    default: ({ entries }: { entries: any[] }) => (
      <div data-testid="timeline">
        {entries.map(entry => (
          <div key={entry.id} data-testid="timeline-entry">
            {entry.activityName} ({new Date(entry.startTime).toLocaleTimeString()} - {new Date(entry.endTime).toLocaleTimeString()})
          </div>
        ))}
      </div>
    )
  };
});

describe('TimelineDisplay', () => {
  it('should render timeline entries correctly', () => {
    // Create test entries using our factory
    const entries = createTimelineEntries(3);
    
    render(<TimelineDisplay entries={entries} />);
    
    // Check that all entries are rendered
    const timelineEntryElements = screen.getAllByTestId('timeline-entry');
    expect(timelineEntryElements).toHaveLength(3);
    
    // Verify entry content
    expect(timelineEntryElements[0]).toHaveTextContent('Test Activity 1');
    expect(timelineEntryElements[1]).toHaveTextContent('Test Activity 2');
    expect(timelineEntryElements[2]).toHaveTextContent('Test Activity 3');
  });
  
  it('should handle empty entries array', () => {
    render(<TimelineDisplay entries={[]} />);
    
    // Check that the empty state is rendered
    expect(screen.getByTestId('timeline')).toBeInTheDocument();
    expect(screen.queryByTestId('timeline-entry')).not.toBeInTheDocument();
  });
  
  it('should handle entries with varying durations', () => {
    // Create entries with different durations using our factory
    const entries = createTimelineEntries(3, (index) => ({
      startTime: 1000000 + (index * 3600000), // 1 hour increments
      endTime: 1000000 + ((index + 1) * 3600000) // 1 hour durations
    }));
    
    render(<TimelineDisplay entries={entries} />);
    
    // Verify all entries are rendered
    expect(screen.getAllByTestId('timeline-entry')).toHaveLength(3);
  });
  
  it('should pass entries in the original order', () => {
    // Create entries with reversed order
    const entries = createTimelineEntries(3, (index) => ({
      activityName: `Activity ${3 - index}`,
    }));
    
    render(<TimelineDisplay entries={entries} />);
    
    // Get all rendered entries
    const timelineEntryElements = screen.getAllByTestId('timeline-entry');
    
    // Verify the order is maintained (not automatically sorted)
    expect(timelineEntryElements[0]).toHaveTextContent('Activity 3');
    expect(timelineEntryElements[1]).toHaveTextContent('Activity 2');
    expect(timelineEntryElements[2]).toHaveTextContent('Activity 1');
  });
});