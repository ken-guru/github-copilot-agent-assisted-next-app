import React from 'react';
import { render, screen, act } from '@testing-library/react';
import Timeline from '../Timeline';
import { TimelineEntry } from '../../types';

// Fixed timestamp for consistent testing
const FIXED_TIME = 1609459200000; // 2021-01-01 00:00:00

describe('Timeline Break Visualization', () => {
  beforeEach(() => {
    // Mock Date.now() to return a fixed timestamp for deterministic results
    jest.useFakeTimers();
    jest.setSystemTime(FIXED_TIME);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should show break immediately after activity completion', () => {
    // Setup an entry that ended 10 seconds ago
    const mockEntries: TimelineEntry[] = [
      {
        id: '1',
        activityId: 'activity-1',
        activityName: 'Task 1',
        startTime: FIXED_TIME - 60000, // Started 1 minute ago
        endTime: FIXED_TIME - 10000,   // Ended 10 seconds ago
        colors: {
          background: '#E8F5E9',
          text: '#1B5E20',
          border: '#2E7D32'
        }
      }
    ];

    render(
      <Timeline 
        entries={mockEntries}
        totalDuration={3600}
        elapsedTime={60}
        timerActive={true}
        allActivitiesCompleted={false}
      />
    );

    // Should show a break entry with the correct duration (10 seconds)
    expect(screen.getByText((content) => {
      return content.includes('Break') && content.includes('0:10');
    })).toBeInTheDocument();
  });

  it('should update break duration in real-time', () => {
    // Setup an entry that ended 30 seconds ago
    const mockEntries: TimelineEntry[] = [
      {
        id: '1',
        activityId: 'activity-1',
        activityName: 'Task 1',
        startTime: FIXED_TIME - 120000, // Started 2 minutes ago
        endTime: FIXED_TIME - 30000,    // Ended 30 seconds ago
        colors: {
          background: '#E8F5E9',
          text: '#1B5E20',
          border: '#2E7D32'
        }
      }
    ];

    render(
      <Timeline 
        entries={mockEntries}
        totalDuration={3600}
        elapsedTime={120}
        timerActive={true}
        allActivitiesCompleted={false}
      />
    );

    // Initially shows 30 seconds
    expect(screen.getByText((content) => {
      return content.includes('Break') && content.includes('0:30');
    })).toBeInTheDocument();

    // Advance time by 15 seconds
    act(() => {
      jest.advanceTimersByTime(15000);
    });

    // Should now show 45 seconds
    expect(screen.getByText((content) => {
      return content.includes('Break') && content.includes('0:45');
    })).toBeInTheDocument();
  });

  it('should handle multiple break periods correctly', () => {
    // Setup entries with a gap between them
    const mockEntries: TimelineEntry[] = [
      {
        id: '1',
        activityId: 'activity-1',
        activityName: 'Task 1',
        startTime: FIXED_TIME - 180000, // Started 3 minutes ago
        endTime: FIXED_TIME - 120000,   // Ended 2 minutes ago
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
        startTime: FIXED_TIME - 90000,  // Started 1.5 minutes ago (30s break after first task)
        endTime: FIXED_TIME - 60000,    // Ended 1 minute ago
        colors: {
          background: '#E3F2FD',
          text: '#0D47A1',
          border: '#1976D2'
        }
      }
    ];

    render(
      <Timeline 
        entries={mockEntries}
        totalDuration={3600}
        elapsedTime={180}
        timerActive={true}
        allActivitiesCompleted={false}
      />
    );

    // Should show the first break (30s between Task 1 and Task 2)
    expect(screen.getByText((content) => {
      return content.includes('Break') && content.includes('0:30');
    })).toBeInTheDocument();

    // Should also show the current break (1 minute since Task 2 ended)
    expect(screen.getByText((content) => {
      return content.includes('Break') && content.includes('1:00');
    })).toBeInTheDocument();
  });

  it('should stop updating break duration when a new activity starts', () => {
    // Setup an entry that ended 1 minute ago
    const mockEntries: TimelineEntry[] = [
      {
        id: '1',
        activityId: 'activity-1',
        activityName: 'Task 1',
        startTime: FIXED_TIME - 180000, // Started 3 minutes ago
        endTime: FIXED_TIME - 60000,    // Ended 1 minute ago
        colors: {
          background: '#E8F5E9',
          text: '#1B5E20',
          border: '#2E7D32'
        }
      }
    ];

    const { rerender } = render(
      <Timeline 
        entries={mockEntries}
        totalDuration={3600}
        elapsedTime={180}
        timerActive={true}
        allActivitiesCompleted={false}
      />
    );

    // Initially shows 1 minute break
    expect(screen.getByText((content) => {
      return content.includes('Break') && content.includes('1:00');
    })).toBeInTheDocument();

    // Add a new activity that started now
    const updatedEntries = [
      ...mockEntries,
      {
        id: '2',
        activityId: 'activity-2',
        activityName: 'Task 2',
        startTime: FIXED_TIME,  // Started now
        endTime: null,          // Still ongoing
        colors: {
          background: '#E3F2FD',
          text: '#0D47A1',
          border: '#1976D2'
        }
      }
    ];

    rerender(
      <Timeline 
        entries={updatedEntries}
        totalDuration={3600}
        elapsedTime={180}
        timerActive={true}
        allActivitiesCompleted={false}
      />
    );

    // Break duration should be fixed at 1:00 (the time between the end of Task 1 and start of Task 2)
    expect(screen.getByText((content) => {
      return content.includes('Break') && content.includes('1:00');
    })).toBeInTheDocument();

    // Advance time by 30 seconds
    act(() => {
      jest.advanceTimersByTime(30000);
    });

    // Break duration should still be 1:00, not 1:30
    expect(screen.getByText((content) => {
      return content.includes('Break') && content.includes('1:00');
    })).toBeInTheDocument();
    
    // Should NOT find a break with 1:30
    expect(screen.queryByText((content) => {
      return content.includes('Break') && content.includes('1:30');
    })).not.toBeInTheDocument();
  });

  it('should properly visualize break with very short duration', () => {
    // Setup an entry that ended just 1 second ago
    const mockEntries: TimelineEntry[] = [
      {
        id: '1',
        activityId: 'activity-1',
        activityName: 'Task 1',
        startTime: FIXED_TIME - 60000, // Started 1 minute ago
        endTime: FIXED_TIME - 1000,    // Ended 1 second ago
        colors: {
          background: '#E8F5E9',
          text: '#1B5E20',
          border: '#2E7D32'
        }
      }
    ];

    render(
      <Timeline 
        entries={mockEntries}
        totalDuration={3600}
        elapsedTime={60}
        timerActive={true}
        allActivitiesCompleted={false}
      />
    );

    // Should show a break entry with the correct duration (1 second)
    expect(screen.getByText((content) => {
      return content.includes('Break') && content.includes('0:01');
    })).toBeInTheDocument();
  });
});