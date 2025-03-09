import { render, screen } from '@testing-library/react';
import Summary from '../Summary';
import { TimelineEntry } from '../Timeline';

// Mock TimelineEntry data
const createMockTimelineEntries = (): TimelineEntry[] => [
  {
    id: '1',
    activityId: 'activity-1',
    activityName: 'Coding',
    startTime: 1000000,
    endTime: 1000000 + 3600000, // 1 hour
    colors: {
      background: '#E8F5E9',
      text: '#1B5E20',
      border: '#2E7D32'
    }
  },
  {
    id: '2',
    activityId: 'activity-2',
    activityName: 'Planning',
    startTime: 1000000 + 3700000, // After a 100 second break
    endTime: 1000000 + 5400000, // 30 minutes
    colors: {
      background: '#E3F2FD',
      text: '#0D47A1',
      border: '#1976D2'
    }
  },
  {
    id: '3',
    activityId: null,
    activityName: null,
    startTime: 1000000 + 5400000,
    endTime: 1000000 + 5700000 // 5 minute break
  }
];

describe('Summary Component', () => {
  it('should not render anything when activities are not completed', () => {
    render(
      <Summary 
        entries={[]}
        totalDuration={3600}
        elapsedTime={1800}
        allActivitiesCompleted={false}
      />
    );
    
    // The component should return null, so there should be no content
    expect(document.body.textContent).toBe('');
  });
  
  it('should render activity summary when activities are completed', () => {
    const entries = createMockTimelineEntries();
    const totalDuration = 3600; // 1 hour planned
    const elapsedTime = 5700; // 1h 35m actually spent
    
    render(
      <Summary 
        entries={entries}
        totalDuration={totalDuration}
        elapsedTime={elapsedTime}
        allActivitiesCompleted={true}
      />
    );
    
    // Verify heading is displayed
    expect(screen.getByText('Activity Summary')).toBeInTheDocument();
    
    // Verify statistics are displayed
    expect(screen.getByRole('heading', { name: 'Activity Summary' })).toBeInTheDocument();
    expect(screen.getByText('Total Time:')).toBeInTheDocument();
    expect(screen.getByText('Planned Time:')).toBeInTheDocument();
    expect(screen.getByText('Active Time:')).toBeInTheDocument();
    expect(screen.getByText('Idle Time:')).toBeInTheDocument();
    
    // Verify activity names are displayed
    expect(screen.getByText('Coding')).toBeInTheDocument();
    expect(screen.getByText('Planning')).toBeInTheDocument();
    expect(screen.getByText('Breaks/Idle time')).toBeInTheDocument();
    
    // Verify the late message is displayed (since elapsedTime > totalDuration)
    expect(screen.getByText(/You took .* more than planned/, { exact: false })).toBeInTheDocument();
  });
  
  it('should display on time message when completed close to planned time', () => {
    const entries = createMockTimelineEntries();
    const totalDuration = 3600; // 1 hour planned
    const elapsedTime = 3630; // 1h 30s - within 60s threshold
    
    render(
      <Summary 
        entries={entries}
        totalDuration={totalDuration}
        elapsedTime={elapsedTime}
        allActivitiesCompleted={true}
      />
    );
    
    expect(screen.getByText('Great job! You completed everything right on schedule!')).toBeInTheDocument();
  });
  
  it('should display early message when completed before planned time', () => {
    const entries = createMockTimelineEntries();
    const totalDuration = 7200; // 2 hours planned
    const elapsedTime = 5400; // 1h 30m - 30m early
    
    render(
      <Summary 
        entries={entries}
        totalDuration={totalDuration}
        elapsedTime={elapsedTime}
        allActivitiesCompleted={true}
      />
    );
    
    expect(screen.getByText(/Amazing! You finished .* earlier than planned!/, { exact: false })).toBeInTheDocument();
  });
  
  it('should format time correctly', () => {
    const entries = [
      {
        id: '1',
        activityId: 'activity-1',
        activityName: 'Long Task',
        startTime: 1000000,
        endTime: 1000000 + 7200000 // 2 hours
      }
    ];
    
    render(
      <Summary 
        entries={entries}
        totalDuration={7200}
        elapsedTime={7200}
        allActivitiesCompleted={true}
      />
    );
    
    // Check for hours in formatted time (more specifically in the activity item)
    expect(screen.getByText('Long Task').nextSibling).toHaveTextContent('2h 0m 0s');
  });
  
  it('should handle entries with null or undefined endTime', () => {
    // Mock Date.now() to return a fixed timestamp
    const originalNow = Date.now;
    const mockNow = 1000000 + 3600000; // 1 hour after start time
    global.Date.now = jest.fn(() => mockNow);
    
    const entries = [
      {
        id: '1',
        activityId: 'activity-1',
        activityName: 'Ongoing Task',
        startTime: 1000000,
        endTime: null // null endTime to simulate ongoing activity
      }
    ];
    
    render(
      <Summary 
        entries={entries}
        totalDuration={7200}
        elapsedTime={3600}
        timerActive={true}
        allActivitiesCompleted={true}
      />
    );
    
    // The activity duration should be calculated using the current time
    expect(screen.getByText('Ongoing Task').nextSibling).toHaveTextContent('1h 0m 0s');
    
    // Clean up the mock
    global.Date.now = originalNow;
  });
});