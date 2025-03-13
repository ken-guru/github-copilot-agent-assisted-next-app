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
  
  it('should render activity summary with updated metric names when activities are completed', () => {
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
    
    // Check for the new metric names
    expect(screen.getByText('Planned Time')).toBeInTheDocument();
    expect(screen.getByText('Spent Time')).toBeInTheDocument();
    expect(screen.getByText('Idle Time')).toBeInTheDocument();
    expect(screen.getByText('Overtime')).toBeInTheDocument();
    
    // Verify the time values are displayed with whole seconds (no decimals)
    const plannedTime = screen.getByText('Planned Time')
      .closest('.statCard')
      ?.querySelector('.statValue');
    expect(plannedTime).toHaveTextContent('1h 0m 0s');

    const spentTime = screen.getByText('Spent Time')
      .closest('.statCard')
      ?.querySelector('.statValue');
    expect(spentTime).toHaveTextContent('1h 30m 0s');

    const idleTime = screen.getByText('Idle Time')
      .closest('.statCard')
      ?.querySelector('.statValue');
    expect(idleTime).toHaveTextContent('5m 0s');

    const overtime = screen.getByText('Overtime')
      .closest('.statCard')
      ?.querySelector('.statValue');
    expect(overtime).toHaveTextContent('30m 0s');
    
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
    // Overtime should be 0 when within threshold
    expect(screen.getByText('Overtime').nextSibling).toHaveTextContent('0s');
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
    // Overtime should be 0s when completed early
    expect(screen.getByText('Overtime').nextSibling).toHaveTextContent('0s');
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
    
    // Look for the Spent Time specifically
    const spentTimeValue = screen.getByText('Spent Time')
      .closest('.statCard')
      ?.querySelector('.statValue');
    expect(spentTimeValue).toHaveTextContent('1h 0m 0s');
    
    // Clean up the mock
    global.Date.now = originalNow;
  });

  it('should not display decimal places in time values', () => {
    const entries = [
      {
        id: '1',
        activityId: 'activity-1',
        activityName: 'Activity with decimal seconds',
        startTime: 1000000,
        endTime: 1000000 + 3661500, // 1h 1m 1.5s
      }
    ];
    
    render(
      <Summary 
        entries={entries}
        totalDuration={3600}
        elapsedTime={3661.5} // 1h 1m 1.5s
        allActivitiesCompleted={true}
      />
    );
    
    // Verify spent time is rounded without decimals
    const spentTime = screen.getByText('Spent Time')
      .closest('.statCard')
      ?.querySelector('.statValue');
    expect(spentTime).toHaveTextContent('1h 1m 2s'); // Spent time (rounded up)
    expect(screen.queryByText('1h 1m 1.5s')).not.toBeInTheDocument(); // No decimals
  });
});