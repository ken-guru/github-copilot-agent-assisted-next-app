import { render, screen } from '@testing-library/react';
import Summary from '../Summary';
import { TimelineEntry } from '../Timeline';

// Mock TimelineEntry data
const createMockTimelineEntries = (): TimelineEntry[] => [
  {
    id: '1',
    activityId: 'activity-1',
    activityName: 'Activity 1',
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
    activityId: null,
    activityName: null,
    startTime: 1000000 + 3600000,
    endTime: 1000000 + 3900000 // 5 minute break
  },
  {
    id: '3',
    activityId: 'activity-2',
    activityName: 'Activity 2',
    startTime: 1000000 + 3900000,
    endTime: 1000000 + 5400000, // 25 minutes
    colors: {
      background: '#E3F2FD',
      text: '#0D47A1',
      border: '#1976D2'
    }
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
    
    expect(document.body.textContent).toBe('');
  });
  
  it('should render activity summary with grid layout when activities are completed', () => {
    const entries = createMockTimelineEntries();
    const totalDuration = 3600; // 1 hour planned
    const elapsedTime = 5400; // 1h 30m actually spent
    
    render(
      <Summary 
        entries={entries}
        totalDuration={totalDuration}
        elapsedTime={elapsedTime}
        allActivitiesCompleted={true}
      />
    );
    
    // Check for time statistics
    expect(screen.getByText('Total Time')).toBeInTheDocument();
    expect(screen.getByText('Planned Time')).toBeInTheDocument();
    expect(screen.getByText('Active Time')).toBeInTheDocument();
    expect(screen.getByText('Idle Time')).toBeInTheDocument();
    
    // Verify the time values are displayed
    expect(screen.getByText('1h 30m 0s')).toBeInTheDocument(); // Total time
    expect(screen.getByText('1h 0m 0s')).toBeInTheDocument(); // Planned time
    expect(screen.getByText('1h 25m 0s')).toBeInTheDocument(); // Active time (85 minutes)
    expect(screen.getByText('5m 0s')).toBeInTheDocument(); // Idle time (5 minutes)
    
    // Verify late message is displayed
    expect(screen.getByText(/You took .* more than planned/, { exact: false })).toBeInTheDocument();
  });
  
  it('should display on time message when completed within threshold', () => {
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

  it('should handle ongoing activities using current time', () => {
    // Mock Date.now() to return a fixed timestamp
    const originalNow = Date.now;
    const mockNow = 1000000 + 3600000; // 1 hour after start time
    global.Date.now = jest.fn(() => mockNow);
    
    const entries = [
      {
        id: '1',
        activityId: 'activity-1',
        activityName: 'Ongoing Activity',
        startTime: 1000000,
        endTime: null // null endTime to simulate ongoing activity
      }
    ];
    
    render(
      <Summary 
        entries={entries}
        totalDuration={7200}
        elapsedTime={3600}
        allActivitiesCompleted={true}
      />
    );
    
    // Look for the Active Time specifically
    const activeTimeValue = screen.getByText('Active Time')
      .closest('.statCard')
      ?.querySelector('.statValue');
    expect(activeTimeValue).toHaveTextContent('1h 0m 0s');
    
    // Clean up the mock
    global.Date.now = originalNow;
  });
});