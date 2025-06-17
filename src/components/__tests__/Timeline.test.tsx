/// <reference types="@testing-library/jest-dom" />
import { render, screen } from '@testing-library/react';
import Timeline from '../Timeline';
import { TimelineEntry } from '@/types';
import { formatTimeHuman } from '@/utils/time'; // Added import for formatTimeHuman

// Mock react-bootstrap components to simplify testing and avoid rendering complex Bootstrap DOM
// We are interested in the logic and data flow, not Bootstrap's internal rendering.
jest.mock('react-bootstrap', () => {
  const ActualReactBootstrap = jest.requireActual('react-bootstrap');
  return {
    ...ActualReactBootstrap,
    Container: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    Row: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    Col: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    ListGroup: ({ children, ...props }: any) => <ul {...props}>{children}</ul>,
    ListGroupItem: ({ children, ...props }: any) => <li {...props}>{children}</li>,
    Badge: ({ children, ...props }: any) => <span {...props}>{children}</span>,
    Alert: ({ children, ...props }: any) => <div {...props} role="alert">{children}</div>,
  };
});

// Mock utility functions that are not the focus of this component's tests
jest.mock('@/utils/timelineCalculations', () => ({
  calculateTimeSpans: jest.fn((data) => ({
    items: data.entries.map((entry: TimelineEntry) => ({
      type: 'activity',
      entry,
      duration: (entry.endTime || Date.now()) - entry.startTime,
      height: 20, // Mock height
    })),
    totalHeight: data.entries.length * 20,
  })),
}));

describe('Timeline Component', () => {
  let dateNowSpy: jest.SpyInstance;
  const FIXED_TIME = 1000000;
  
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date(FIXED_TIME));
    // dateNowSpy = jest.spyOn(Date, 'now').mockImplementation(() => FIXED_TIME); // Redundant with setSystemTime
  });

  afterEach(() => {
    // dateNowSpy.mockRestore(); // No longer needed
    jest.useRealTimers();
    jest.clearAllMocks();
    // jest.clearAllTimers(); // Covered by useRealTimers and clearAllMocks
  });

  const mockTimelineEntryColors = {
    background: '#E8F5E9',
    text: '#1B5E20',
    border: '#2E7D32'
  };

  // Helper function to render timeline with standard props
  const renderTimeline = (entries: TimelineEntry[], props = {}) => {
    return render(
      <Timeline entries={entries}
        totalDuration={3600} // 1 hour
        elapsedTime={30}    // 30 seconds elapsed
        timerActive={true}
        {...props}
      />
    );
  };

  it('should render the timeline title and time display', () => {
    renderTimeline([]);
    expect(screen.getByText('Timeline')).toBeInTheDocument();
    expect(screen.getByTestId('time-display')).toBeInTheDocument();
    // Check for initial time display format (example)
    expect(screen.getByText(/Time Left:/)).toBeInTheDocument();
  });

  it('should render timeline entries when provided', () => {
    const mockEntries: TimelineEntry[] = [
      {
        id: '1',
        activityId: 'activity-1',
        activityName: 'Task 1',
        startTime: FIXED_TIME - 30000, // 30s ago
        endTime: FIXED_TIME - 10000,   // 10s ago (duration 20s)
        colors: mockTimelineEntryColors,
      },
      {
        id: '2',
        activityId: 'activity-2',
        activityName: 'Task 2',
        startTime: FIXED_TIME - 5000, // 5s ago
        endTime: null, // Ongoing
        colors: mockTimelineEntryColors,
      }
    ];

    renderTimeline(mockEntries);
    const entryElements = screen.getAllByTestId(/timeline-entry-/);
    expect(entryElements.length).toBe(mockEntries.length);
    expect(screen.getAllByTestId('timeline-activity-name')[0]).toHaveTextContent('Task 1');
    expect(screen.getAllByTestId('timeline-activity-name')[1]).toHaveTextContent('Task 2');
  });

  it('should render an empty state message when no entries are present', () => {
    renderTimeline([]);
    expect(screen.getByTestId('no-entries-message')).toBeInTheDocument();
    expect(screen.getByText('No activities planned yet.')).toBeInTheDocument();
  });

  it('should display overtime warning and adjust UI when isTimeUp is true and time is negative', () => {
    const mockEntries: TimelineEntry[] = [
      {
        id: '1',
        activityId: 'activity-1',
        activityName: 'Long Task',
        startTime: FIXED_TIME - 4000 * 1000, // Started 4000s ago
        endTime: FIXED_TIME,                 // Ended now
        colors: mockTimelineEntryColors,
      }
    ];
    
    renderTimeline(mockEntries, {
      totalDuration: 3600, // 1 hour planned
      elapsedTime: 4000,   // 4000s elapsed (400s overtime)
      isTimeUp: true,      // Timer has indicated time is up
    });
    
    expect(screen.getByTestId('overtime-warning')).toBeInTheDocument();
    expect(screen.getByText('Timeline is in overtime.')).toBeInTheDocument();
    expect(screen.getByTestId('overtime-section')).toBeInTheDocument(); // Checks for the visual overtime section
    expect(screen.getByTestId('overtime-ruler-section')).toBeInTheDocument();
    expect(screen.getByText(/Overtime:/)).toBeInTheDocument(); // Time display should show overtime

    const timeMarkers = screen.getAllByTestId('time-marker');
    expect(timeMarkers.length).toBeGreaterThan(0);
    const lastMarker = timeMarkers[timeMarkers.length - 1];
    // Check that the last time marker is beyond the original total duration (e.g. > 1:00:00 if totalDuration was 3600)
    // This requires formatTimeHuman to be consistent or a more robust check on the marker's time value if accessible.
    // For now, we check it's not the original end time.
    if (lastMarker) { // Added null check for lastMarker
      expect(lastMarker.textContent).not.toBe(formatTimeHuman(3600 * 1000)); 
    }
  });

  it('should render time markers correctly based on duration', () => {
    renderTimeline([], { totalDuration: 600 }); // 10 minutes
    const timeMarkers = screen.getAllByTestId('time-marker');
    // Based on calculateTimeIntervals for 600s (10min), interval is 60s, count is 10. So 11 markers (0 to 10).
    expect(timeMarkers.length).toBe(11); 
    expect(timeMarkers[0]).toHaveTextContent('0:00');
    expect(timeMarkers[timeMarkers.length -1]).toHaveTextContent('10:00');
  });

  it('should correctly display activity names and durations', () => {
    const mockEntries: TimelineEntry[] = [
      {
        id: '1',
        activityId: 'activity-1',
        activityName: 'Coding Session',
        startTime: FIXED_TIME - 1800 * 1000, // 30 mins ago
        endTime: FIXED_TIME - 900 * 1000,    // 15 mins ago (duration 15 mins)
        colors: mockTimelineEntryColors,
      }
    ];
    renderTimeline(mockEntries);
    expect(screen.getByText('Coding Session')).toBeInTheDocument();
    expect(screen.getByText(`(${formatTimeHuman(900 * 1000)})`)).toBeInTheDocument(); // (15:00)
  });

  it('should display "Timer ready" message when timer is not active', () => {
    renderTimeline([], { timerActive: false, totalDuration: 1800 });
    expect(screen.getByTestId('time-display')).toHaveTextContent('Timer ready: 30:00');
  });

});