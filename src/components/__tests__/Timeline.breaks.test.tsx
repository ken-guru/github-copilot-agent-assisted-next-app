import { screen, act } from '@testing-library/react';
import { renderWithTheme } from '@/test/utils/renderWithTheme';
import Timeline, { TimelineEntry } from '../Timeline';

describe('Timeline Break Visualization', () => {
  const FIXED_TIME = 1000000;
  let dateNowSpy: jest.SpyInstance;
  
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

  it('should show ongoing break immediately after completing an activity', () => {
    const mockEntries = [{
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
    }];

    renderWithTheme(
      <Timeline 
        entries={mockEntries}
        totalDuration={3600}
        elapsedTime={30}
        timerActive={true}
      />
    );

    // Look for break with correct time format
    expect(screen.getByText((content) => {
      return content.includes('Break') && content.includes('0:10');
    })).toBeInTheDocument();

    act(() => {
      dateNowSpy.mockImplementation(() => FIXED_TIME + 5000);
      jest.advanceTimersByTime(5000);
    });

    expect(screen.getByText((content) => {
      return content.includes('Break') && content.includes('0:15');
    })).toBeInTheDocument();
  });

  it('should handle ongoing break after completing the last activity', () => {
    const mockEntries: TimelineEntry[] = [
      {
        id: '1',
        activityId: 'activity-1',
        activityName: 'Task 1',
        startTime: FIXED_TIME - 3600000,
        endTime: FIXED_TIME - 1800000,
        colors: {
          background: '#E8F5E9',
          text: '#1B5E20',
          border: '#2E7D32'
        }
      }
    ];

    renderWithTheme(
      <Timeline 
        entries={mockEntries}
        totalDuration={7200}
        elapsedTime={3600}
        timerActive={true}
        allActivitiesCompleted={true}
      />
    );

    expect(screen.getByText((content) => {
      return content.includes('Break') && content.includes('30:00');
    })).toBeInTheDocument();
  });

  it('should transition from break to new activity correctly', () => {
    const mockEntries: TimelineEntry[] = [
      {
        id: '1',
        activityId: 'activity-1',
        activityName: 'Task 1',
        startTime: FIXED_TIME - 30000,
        endTime: FIXED_TIME - 20000,
        colors: {
          background: '#E8F5E9',
          text: '#1B5E20',
          border: '#2E7D32'
        }
      },
      {
        id: '2',
        activityId: 'activity-2',
        activityName: 'Task 2',
        startTime: FIXED_TIME - 10000,
        endTime: null,
        colors: {
          background: '#FFEBEE',
          text: '#C62828',
          border: '#B71C1C'
        }
      }
    ];

    renderWithTheme(
      <Timeline 
        entries={mockEntries}
        totalDuration={3600}
        elapsedTime={30}
        timerActive={true}
      />
    );

    expect(screen.getByText((content) => {
      return content.includes('Break') && content.includes('0:10');
    })).toBeInTheDocument();

    expect(screen.getAllByTestId('timeline-activity-name')).toHaveLength(2);
  });
});