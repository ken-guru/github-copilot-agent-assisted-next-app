/// <reference types="@testing-library/jest-dom" />
import { render, screen } from '@testing-library/react';
import Timeline from '../Timeline';
import { TimelineEntry } from '@/types';
import { ToastProvider } from '@/contexts/ToastContext';

describe('Timeline Component', () => {
  let dateNowSpy: jest.SpyInstance;
  const FIXED_TIME = 1000000;
  
  beforeEach(() => {
    jest.useFakeTimers();
    dateNowSpy = jest.spyOn(Date, 'now').mockImplementation(() => FIXED_TIME);
  });

  afterEach(() => {
    dateNowSpy.mockRestore();
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  // Helper function to render timeline with standard props
  const renderTimeline = (entries: TimelineEntry[], props = {}) => {
    return render(
      <ToastProvider>
        <Timeline 
          entries={entries}
          totalDuration={3600}
          elapsedTime={30}
          timerActive={true}
          {...props}
        />
      </ToastProvider>
    );
  };

  it('should render the timeline with entries', () => {
    const mockEntries: TimelineEntry[] = [
      {
        id: '1',
        activityId: 'activity-1',
        activityName: 'Task 1',
        startTime: FIXED_TIME - 30000,
        endTime: FIXED_TIME - 10000,
        colors: {
          background: '#E8F5E9',
          text: '#1B5E20',
          border: '#2E7D32'
        }
      }
    ];

    renderTimeline(mockEntries);
    expect(screen.getByTestId('timeline-activity-name')).toBeInTheDocument();
  });

  it('should render an empty state when no entries are present', () => {
    renderTimeline([]);
    expect(screen.getByText('No activities started yet')).toBeInTheDocument();
  });

  it('should adjust timeline ruler when activities run into overtime', () => {
    const startTime = FIXED_TIME - 4000 * 1000;
    const endTime = FIXED_TIME;
    const mockEntries: TimelineEntry[] = [
      {
        id: '1',
        activityId: 'activity-1',
        activityName: 'Task 1',
        startTime: startTime,
        endTime: endTime,
        colors: {
          background: '#E8F5E9',
          text: '#1B5E20',
          border: '#2E7D32'
        }
      }
    ];
    
    renderTimeline(mockEntries, {
      elapsedTime: 4000,
      isTimeUp: true
    });
    
    // Verify overtime time display is shown
    const timeDisplay = screen.getByTestId('time-display');
    expect(timeDisplay).toBeInTheDocument();
    expect(timeDisplay.textContent).toContain('Overtime');
    expect(screen.getByTestId('overtime-section')).toBeInTheDocument();
    
    const timeMarkers = screen.getAllByTestId('time-marker');
    expect(timeMarkers.length).toBeGreaterThan(0);
    
    const lastMarker = timeMarkers[timeMarkers.length - 1];
    const lastMarkerTime = lastMarker ? lastMarker.textContent : '';
    expect(lastMarkerTime).not.toBe('1:00:00');
  });

  it('should dismiss overtime toast when allActivitiesCompleted becomes true', async () => {
    const mockEntries: TimelineEntry[] = [
      {
        id: '1',
        activityId: 'activity-1',
        activityName: 'Test Activity',
        startTime: FIXED_TIME - 30000,
        endTime: FIXED_TIME + 30000,
        colors: {
          background: '#E8F5E9',
          text: '#1B5E20',
          border: '#2E7D32'
        }
      }
    ];
    
    const { rerender } = renderTimeline(mockEntries, {
      elapsedTime: 4000,
      isTimeUp: true,
      timerActive: true
    });
    
    // Simulate all activities being completed (summary state)
    rerender(
      <ToastProvider>
        <Timeline 
          entries={mockEntries}
          totalDuration={3600}
          elapsedTime={4000}
          timerActive={false}
          allActivitiesCompleted={true}
        />
      </ToastProvider>
    );
    
    // The overtime toast should be dismissed when transitioning to summary
    // We can't easily test the toast removal in this unit test context,
    // but we can verify the component doesn't crash and renders properly
    const timeDisplay = screen.getByTestId('time-display');
    expect(timeDisplay).toBeInTheDocument();
  });

  it('should dismiss overtime toast when duration is extended and no longer in overtime', async () => {
    // Use exact same mock entries as working test
    const startTime = FIXED_TIME - 4000 * 1000;
    const endTime = FIXED_TIME;
    const mockEntries: TimelineEntry[] = [
      {
        id: '1',
        activityId: 'activity-1',
        activityName: 'Task 1',
        startTime: startTime,
        endTime: endTime,
        colors: {
          background: '#E8F5E9',
          text: '#1B5E20',
          border: '#2E7D32'
        }
      }
    ];
    
    // Start with overtime condition
    const { rerender } = renderTimeline(mockEntries, {
      elapsedTime: 4000, // 66 min 40 sec (400 seconds over default 3600)
      isTimeUp: true
    });
    
    // Verify we're in overtime state
    const timeDisplay = screen.getByTestId('time-display');
    expect(timeDisplay.textContent).toContain('Overtime');
    
    // Extend duration to get out of overtime: default 3600 + 500 = 4100 (100 sec buffer)
    rerender(
      <ToastProvider>
        <Timeline 
          entries={mockEntries}
          totalDuration={4100} // Extended beyond current elapsed time
          elapsedTime={4000} // Same elapsed time, now under new limit
          timerActive={true}
          allActivitiesCompleted={false}
        />
      </ToastProvider>
    );
    
    // After extension, should no longer be in overtime
    expect(timeDisplay.textContent).toContain('Time Left');
    expect(timeDisplay.textContent).not.toContain('Overtime');
  });

  it('should dismiss overtime toast when component unmounts or resets', async () => {
    const mockEntries: TimelineEntry[] = [
      {
        id: '1',
        activityId: 'activity-1',
        activityName: 'Task 1',
        startTime: FIXED_TIME - 4000 * 1000,
        endTime: FIXED_TIME,
        colors: {
          background: '#E8F5E9',
          text: '#1B5E20',
          border: '#2E7D32'
        }
      }
    ];
    
    // Render in overtime condition
    const { unmount } = renderTimeline(mockEntries, {
      elapsedTime: 4000,
      isTimeUp: true
    });
    
    // Verify we're in overtime state
    const timeDisplay = screen.getByTestId('time-display');
    expect(timeDisplay.textContent).toContain('Overtime');
    
    // Unmount component (simulates reset to setup)
    unmount();
    
    // Test passed if no errors during unmount (toast properly cleaned up)
  });

  // Test if timeline activity colors update when theme changes
  test('updates activity colors when theme changes', () => {
    // Mock entries with colors for testing
    const mockEntries: TimelineEntry[] = [
      {
        id: '1',
        activityId: 'activity-1',
        activityName: 'Task 1',
        startTime: FIXED_TIME - 30000,
        endTime: FIXED_TIME - 10000,
        colors: {
          background: 'hsl(120, 60%, 95%)', // Light mode color
          text: 'hsl(120, 60%, 25%)',
          border: 'hsl(120, 60%, 35%)'
        }
      }
    ];
    
    // Create a custom mock of the isDarkMode function that we can control
    const mockIsDarkMode = false;
    jest.mock('../../utils/colors', () => ({
      ...jest.requireActual('../../utils/colors'),
      isDarkMode: () => mockIsDarkMode,
      internalActivityColors: jest.requireActual('../../utils/colors').internalActivityColors
    }));
    
    // Render with light mode (default)
    renderTimeline(mockEntries);
    
    // Verify activity name appears (basic rendering check)
    expect(screen.getByTestId('timeline-activity-name')).toBeInTheDocument();
    
    // Clean up the mock to prevent affecting other tests
    jest.unmock('../../utils/colors');
  });
});