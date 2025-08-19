/**
 * Tests for session data extraction utilities
 */

import { extractSessionData, type SummaryDataProps } from '../extraction';
import { TimelineEntry } from '@/types';
import { getActivities } from '@/utils/activity-storage';

// Mock the activity storage
jest.mock('@/utils/activity-storage');
const mockGetActivities = getActivities as jest.MockedFunction<typeof getActivities>;

describe('extractSessionData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetActivities.mockReturnValue([
      {
        id: 'activity-1',
        name: 'Test Activity 1',
        colorIndex: 0,
        createdAt: '2024-01-01T00:00:00.000Z',
        isActive: true,
      },
      {
        id: 'activity-2',
        name: 'Test Activity 2',
        colorIndex: 1,
        createdAt: '2024-01-01T00:00:00.000Z',
        isActive: true,
      },
    ]);
  });

  it('should extract basic session data with no entries', () => {
    const props: SummaryDataProps = {
      entries: [],
      totalDuration: 3600, // 1 hour
      elapsedTime: 3000, // 50 minutes
      allActivitiesCompleted: true,
    };

    const result = extractSessionData(props);

    expect(result).toEqual({
      plannedTime: 3600,
      timeSpent: 3000,
      overtime: 0,
      idleTime: 0,
      activities: [],
      skippedActivities: [],
      timelineEntries: [],
      completedAt: expect.any(String),
      sessionType: 'completed',
    });

    // Verify completedAt is a valid ISO string
    expect(new Date(result.completedAt).toISOString()).toBe(result.completedAt);
  });

  it('should extract session data with timeline entries', () => {
    const now = Date.now();
    const entries: TimelineEntry[] = [
      {
        id: 'entry-1',
        activityId: 'activity-1',
        activityName: 'Test Activity 1',
        startTime: now - 2000000, // 33+ minutes ago
        endTime: now - 1000000, // 16+ minutes ago
        colors: {
          background: 'hsl(0, 70%, 90%)',
          text: 'hsl(0, 70%, 20%)',
          border: 'hsl(0, 70%, 80%)',
        },
      },
      {
        id: 'entry-2',
        activityId: 'activity-2',
        activityName: 'Test Activity 2',
        startTime: now - 800000, // 13+ minutes ago
        endTime: now - 200000, // 3+ minutes ago
        colors: {
          background: 'hsl(120, 70%, 90%)',
          text: 'hsl(120, 70%, 20%)',
          border: 'hsl(120, 70%, 80%)',
        },
      },
    ];

    const props: SummaryDataProps = {
      entries,
      totalDuration: 3600,
      elapsedTime: 2400,
      allActivitiesCompleted: true,
    };

    const result = extractSessionData(props);

    expect(result.activities).toHaveLength(2);
    expect(result.activities[0]).toEqual({
      id: 'activity-1',
      name: 'Test Activity 1',
      duration: expect.any(Number),
      colorIndex: 0,
    });

    expect(result.timelineEntries).toHaveLength(2);
    expect(result.timelineEntries[0]).toEqual({
      id: 'entry-1',
      activityId: 'activity-1',
      activityName: 'Test Activity 1',
      startTime: entries[0]!.startTime,
      endTime: entries[0]!.endTime,
      colorIndex: 0,
    });
  });

  it('should handle skipped activities', () => {
    const props: SummaryDataProps = {
      entries: [],
      totalDuration: 3600,
      elapsedTime: 2400,
      allActivitiesCompleted: true,
      skippedActivityIds: ['activity-1', 'activity-2'],
    };

    const result = extractSessionData(props);

    expect(result.skippedActivities).toHaveLength(2);
    expect(result.skippedActivities[0]).toEqual({
      id: 'activity-1',
      name: 'Test Activity 1',
    });
    expect(result.skippedActivities[1]).toEqual({
      id: 'activity-2',
      name: 'Test Activity 2',
    });
  });

  it('should handle skipped activities when storage fails', () => {
    mockGetActivities.mockImplementation(() => {
      throw new Error('Storage error');
    });

    const props: SummaryDataProps = {
      entries: [],
      totalDuration: 3600,
      elapsedTime: 2400,
      allActivitiesCompleted: true,
      skippedActivityIds: ['activity-1', 'unknown-activity'],
    };

    const result = extractSessionData(props);

    expect(result.skippedActivities).toHaveLength(2);
    expect(result.skippedActivities[0]).toEqual({
      id: 'activity-1',
      name: 'activity-1', // Falls back to ID when storage fails
    });
    expect(result.skippedActivities[1]).toEqual({
      id: 'unknown-activity',
      name: 'unknown-activity',
    });
  });

  it('should calculate overtime correctly', () => {
    const now = Date.now();
    const entries: TimelineEntry[] = [
      {
        id: 'entry-1',
        activityId: 'activity-1',
        activityName: 'Test Activity 1',
        startTime: now - 5000000, // Started 83+ minutes ago
        endTime: now - 1000000, // Ended 16+ minutes ago
      },
    ];

    const props: SummaryDataProps = {
      entries,
      totalDuration: 3600, // 1 hour planned
      elapsedTime: 4800, // 80 minutes actual
      allActivitiesCompleted: true,
    };

    const result = extractSessionData(props);

    // Overtime should be calculated from timeline span, not elapsed time
    expect(result.overtime).toBeGreaterThan(0);
  });

  it('should set session type based on isTimeUp flag', () => {
    const props: SummaryDataProps = {
      entries: [],
      totalDuration: 3600,
      elapsedTime: 3600,
      isTimeUp: true,
    };

    const result = extractSessionData(props);
    expect(result.sessionType).toBe('timeUp');
  });

  it('should default to completed session type', () => {
    const props: SummaryDataProps = {
      entries: [],
      totalDuration: 3600,
      elapsedTime: 3000,
      allActivitiesCompleted: true,
    };

    const result = extractSessionData(props);
    expect(result.sessionType).toBe('completed');
  });

  it('should handle entries with null endTime (ongoing activities)', () => {
    const now = Date.now();
    const entries: TimelineEntry[] = [
      {
        id: 'entry-1',
        activityId: 'activity-1',
        activityName: 'Test Activity 1',
        startTime: now - 1000000,
        endTime: null, // Ongoing activity
      },
    ];

    const props: SummaryDataProps = {
      entries,
      totalDuration: 3600,
      elapsedTime: 2400,
      allActivitiesCompleted: false,
    };

    const result = extractSessionData(props);

    expect(result.activities).toHaveLength(1);
    expect(result.activities[0]!.duration).toBeGreaterThan(0);
    expect(result.timelineEntries[0]!.endTime).toBeNull();
  });
});