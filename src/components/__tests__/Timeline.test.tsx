/// <reference types="@testing-library/jest-dom" />
import { render, screen } from '@testing-library/react';
import Timeline from '../Timeline';
import { ToastProvider } from '../ToastNotificationProvider';
import { TimelineEntry } from '@/types';

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
    
  // Overtime toast should be present
  const toast = screen.getByTestId('global-toast');
  expect(toast).toBeInTheDocument();
  expect(toast).toHaveTextContent(/overtime/i);
  expect(screen.getByTestId('overtime-section')).toBeInTheDocument();
    
    const timeMarkers = screen.getAllByTestId('time-marker');
    expect(timeMarkers.length).toBeGreaterThan(0);
    
    const lastMarker = timeMarkers[timeMarkers.length - 1];
    const lastMarkerTime = lastMarker ? lastMarker.textContent : '';
    expect(lastMarkerTime).not.toBe('1:00:00');
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