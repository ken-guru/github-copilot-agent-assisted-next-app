import { render, screen } from '@testing-library/react';
import Timeline from '../Timeline';
import { TimelineEntry } from '@/types';
import { ToastProvider } from '@/contexts/ToastContext';

describe('Timeline Component Rendering', () => {
  let dateNowSpy: jest.SpyInstance;
  
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });
  
  beforeEach(() => {
    dateNowSpy = jest.spyOn(Date, 'now').mockImplementation(() => 1000000);
  });

  afterEach(() => {
    dateNowSpy.mockRestore();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  it('should render the timeline with entries', () => {
    const mockEntries: TimelineEntry[] = [
      {
        id: '1',
        activityId: 'activity-1',
        activityName: 'Task 1',
        startTime: 1000000,
        endTime: 1000000 + 1800000,
        colors: {
          background: '#E8F5E9',
          text: '#1B5E20',
          border: '#2E7D32'
        }
      },
    ];
    render(
      <ToastProvider>
        <Timeline 
          entries={mockEntries}
          totalDuration={3600}
          elapsedTime={1800}
          timerActive={true}
        />
      </ToastProvider>
    );
    expect(screen.getByTestId('timeline-activity-name')).toBeInTheDocument();
  });
  
  it('should render an empty state when no entries are present', () => {
    render(
      <ToastProvider>
        <Timeline 
          entries={[]}
          totalDuration={3600}
          elapsedTime={0}
          timerActive={false}
        />
      </ToastProvider>
    );
    expect(screen.getByText('No activities started yet')).toBeInTheDocument();
  });

  it('should adjust timeline ruler when activities run into overtime', () => {
    const startTime = 1000000 - 4000 * 1000;
    const endTime = 1000000;
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
    
    render(
      <ToastProvider>
        <Timeline 
          entries={mockEntries}
          totalDuration={3600}
          elapsedTime={4000}
          timerActive={true}
        />
      </ToastProvider>
    );
    
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
});