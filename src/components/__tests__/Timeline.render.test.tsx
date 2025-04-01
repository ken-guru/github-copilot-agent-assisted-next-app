import { screen } from '@testing-library/react';
import React from 'react';
import Timeline, { TimelineEntry } from '../Timeline';
import { renderWithTheme } from '../../test/utils/renderWithTheme';

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
    renderWithTheme(
      <Timeline 
        entries={mockEntries}
        totalDuration={3600}
        elapsedTime={1800}
        timerActive={true}
      />
    );
    expect(screen.getByTestId('timeline-activity-name')).toBeInTheDocument();
  });
  
  it('should render an empty state when no entries are present', () => {
    renderWithTheme(
      <Timeline 
        entries={[]}
        totalDuration={3600}
        elapsedTime={0}
        timerActive={false}
      />
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
    
    renderWithTheme(
      <Timeline 
        entries={mockEntries}
        totalDuration={3600}
        elapsedTime={4000}
        timerActive={true}
        isTimeUp={true}
      />
    );
    
    expect(screen.getByTestId('overtime-warning')).toBeInTheDocument();
    expect(screen.getByTestId('overtime-section')).toBeInTheDocument();
    
    const timeMarkers = screen.getAllByTestId('time-marker');
    expect(timeMarkers.length).toBeGreaterThan(0);
    
    const lastMarkerTime = timeMarkers[timeMarkers.length - 1].textContent;
    expect(lastMarkerTime).not.toBe('1:00:00');
  });
});