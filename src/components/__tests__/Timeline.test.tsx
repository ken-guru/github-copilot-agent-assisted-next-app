import { render, screen } from '@testing-library/react';
import Timeline, { TimelineEntry } from '../Timeline';

// Mock implementation of Date.now for consistent testing
const originalDateNow = Date.now;

// Mock TimelineEntry data
const mockEntries: TimelineEntry[] = [
  {
    id: '1',
    activityId: 'activity-1',
    activityName: 'Task 1',
    startTime: 1000000,
    endTime: 1000000 + 1800000, // 30 min
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
    startTime: 1000000 + 1800000, // Starts right after Task 1
    endTime: 1000000 + 2100000, // 5 min break
  },
  {
    id: '3',
    activityId: 'activity-2',
    activityName: 'Task 2',
    startTime: 1000000 + 2100000, // Starts after break
    endTime: 1000000 + 3900000, // 30 min
    colors: {
      background: '#E3F2FD', 
      text: '#0D47A1',
      border: '#1976D2'
    }
  }
];

describe('Timeline Component', () => {
  beforeAll(() => {
    // Mock Date.now to return a fixed timestamp
    jest.spyOn(Date, 'now').mockImplementation(() => 1000000 + 3900000);
  });
  
  afterAll(() => {
    // Restore the original implementation
    jest.spyOn(Date, 'now').mockRestore();
  });
  
  it('should render the timeline with entries', () => {
    // Using a much larger elapsed time to ensure overtime
    const result = render(
      <Timeline 
        entries={mockEntries}
        totalDuration={3600} // 1 hour (3600 seconds)
        elapsedTime={3900} // 1h 5m (3900 seconds) - this exceeds the totalDuration
        timerActive={true}
      />
    );
    
    // Check for Timeline heading
    expect(screen.getByText('Timeline')).toBeInTheDocument();
    
    // Check for activity names
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
    expect(screen.getByText('Break')).toBeInTheDocument();
    
    // Check for overtime by looking for the warning message
    expect(screen.getByText(/You've exceeded the planned time!/)).toBeInTheDocument();
  });
  
  it('should render an empty state when no entries are present', () => {
    render(
      <Timeline 
        entries={[]}
        totalDuration={3600}
        elapsedTime={0}
        timerActive={false}
      />
    );
    
    expect(screen.getByText('No activities started yet')).toBeInTheDocument();
    
    // Check for "Timer ready" by partial text matching
    const timerReadyText = screen.getByText(/Timer ready:/);
    expect(timerReadyText).toBeInTheDocument();
  });
  
  it('should show the time remaining when timer is active and within time limit', () => {
    render(
      <Timeline 
        entries={mockEntries}
        totalDuration={4000} // More than elapsed time
        elapsedTime={3000}
        timerActive={true}
      />
    );
    
    // Should show time left since elapsedTime < totalDuration
    const timeLeftText = screen.getByText(/Time Left:/);
    expect(timeLeftText).toBeInTheDocument();
  });
  
  it('should add leftover time entry when all activities are completed with time remaining', () => {
    render(
      <Timeline 
        entries={mockEntries}
        totalDuration={5000} // More than elapsed time
        elapsedTime={3900} // 65 min (3900 seconds)
        timerActive={true}
        allActivitiesCompleted={true}
      />
    );
    
    // Should show leftover time entry
    expect(screen.getByText('Time Remaining')).toBeInTheDocument();
  });
  
  it('should format times correctly in hours when needed', () => {
    const longEntries = [
      {
        id: '1',
        activityId: 'activity-1',
        activityName: 'Long Task',
        startTime: 1000000,
        endTime: 1000000 + 7200000 // 2 hours
      }
    ];
    
    render(
      <Timeline 
        entries={longEntries}
        totalDuration={7200}
        elapsedTime={7200}
        timerActive={true}
      />
    );
    
    // Should format the 2 hour duration with hours
    expect(screen.getByText('2:00:00')).toBeInTheDocument();
  });
  
  it('should show timer ready state when timer is inactive', () => {
    render(
      <Timeline 
        entries={mockEntries}
        totalDuration={3600}
        elapsedTime={0}
        timerActive={false}
      />
    );
    
    // Check for "Timer ready" by partial text matching
    const timerReadyText = screen.getByText(/Timer ready:/);
    expect(timerReadyText).toBeInTheDocument();
  });
});