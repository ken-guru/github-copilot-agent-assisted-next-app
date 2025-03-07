/// <reference types="@testing-library/jest-dom" />
import { render, screen } from '@testing-library/react';
import Timeline, { TimelineEntry } from '../Timeline';

describe('Timeline Component', () => {
  it('should render the timeline with entries', () => {
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
    ];
    render(
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
    render(
      <Timeline 
        entries={[]}
        totalDuration={3600}
        elapsedTime={0}
        timerActive={false}
      />
    );
    expect(screen.getByText('No activities started yet')).toBeInTheDocument();
  });

  it('should display a break when an activity is completed and a new one is started after a few seconds', () => {
    const startTime1 = Date.now() - 20000; // 20 seconds ago
    const endTime1 = Date.now() - 10000; // 10 seconds ago
    const startTime2 = Date.now() - 5000; // 5 seconds ago
    const endTime2 = Date.now(); // now

    const mockEntries: TimelineEntry[] = [
      {
        id: '1',
        activityId: 'activity-1',
        activityName: 'Task 1',
        startTime: startTime1,
        endTime: endTime1,
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
        startTime: startTime2,
        endTime: endTime2,
        colors: {
          background: '#FFEBEE',
          text: '#C62828',
          border: '#B71C1C'
        }
      }
    ];

    render(
      <Timeline 
        entries={mockEntries}
        totalDuration={3600}
        elapsedTime={30}
        timerActive={true}
      />
    );

    expect(screen.getByText((content) => {
      return content.includes('Break') && content.includes('(');
    })).toBeInTheDocument();
  });
});