/**
 * Tests for session data extraction utilities
 */

import { extractSessionSummaryData } from '../extraction';
import type { TimelineEntry } from '@/types';
import * as activityStorage from '@/utils/activity-storage';

// Mock activity storage
jest.mock('@/utils/activity-storage');
const mockGetActivities = activityStorage.getActivities as jest.MockedFunction<typeof activityStorage.getActivities>;

describe('extractSessionSummaryData', () => {
  const mockActivities = [
    { id: '1', name: 'Study Math', colorIndex: 0, createdAt: '2024-01-01T00:00:00Z', isActive: true },
    { id: '2', name: 'Read Book', colorIndex: 1, createdAt: '2024-01-01T00:00:00Z', isActive: true },
    { id: '3', name: 'Exercise', colorIndex: 2, createdAt: '2024-01-01T00:00:00Z', isActive: true },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetActivities.mockReturnValue(mockActivities);
  });

  it('extracts basic session data correctly', () => {
    const baseTime = Date.now();
    const entries: TimelineEntry[] = [
      {
        id: 'entry-1',
        activityId: '1',
        activityName: 'Study Math',
        startTime: baseTime,
        endTime: baseTime + 900000, // 15 minutes
      },
      {
        id: 'entry-2',
        activityId: '2',
        activityName: 'Read Book',
        startTime: baseTime + 1000000, // 1 minute break
        endTime: baseTime + 1600000, // 10 minutes
      },
    ];

    const result = extractSessionSummaryData(
      entries,
      1800, // 30 minutes planned
      1600, // 26 minutes 40 seconds actual
      true, // completed
      false, // not time up
      ['3'] // skipped exercise
    );

    expect(result).toMatchObject({
      plannedTime: 1800,
      timeSpent: 1600,
      sessionType: 'completed',
      activities: [
        {
          id: '1',
          name: 'Study Math',
          duration: 900, // 15 minutes in seconds
          colorIndex: 0,
        },
        {
          id: '2',
          name: 'Read Book',
          duration: 600, // 10 minutes in seconds
          colorIndex: 0,
        },
      ],
      skippedActivities: [
        {
          id: '3',
          name: 'Exercise',
        },
      ],
      timelineEntries: [
        {
          id: 'entry-1',
          activityId: '1',
          activityName: 'Study Math',
          startTime: baseTime,
          endTime: baseTime + 900000,
          colorIndex: 0,
        },
        {
          id: 'entry-2',
          activityId: '2',
          activityName: 'Read Book',
          startTime: baseTime + 1000000,
          endTime: baseTime + 1600000,
          colorIndex: 0,
        },
      ],
    });

    expect(result.completedAt).toBeDefined();
    expect(new Date(result.completedAt)).toBeInstanceOf(Date);
  });

  it('calculates overtime correctly', () => {
    const baseTime = Date.now();
    const entries: TimelineEntry[] = [
      {
        id: 'entry-1',
        activityId: '1',
        activityName: 'Study Math',
        startTime: baseTime,
        endTime: baseTime + 2400000, // 40 minutes
      },
    ];

    const result = extractSessionSummaryData(
      entries,
      1800, // 30 minutes planned
      2400, // 40 minutes actual
      true,
      false,
      []
    );

    expect(result.overtime).toBe(600); // 10 minutes overtime in seconds
  });

  it('calculates idle time correctly', () => {
    const baseTime = Date.now();
    const entries: TimelineEntry[] = [
      {
        id: 'entry-1',
        activityId: '1',
        activityName: 'Study Math',
        startTime: baseTime,
        endTime: baseTime + 900000, // 15 minutes
      },
      {
        id: 'entry-2',
        activityId: '2',
        activityName: 'Read Book',
        startTime: baseTime + 1200000, // 5 minute break
        endTime: baseTime + 1800000, // 10 minutes
      },
    ];

    const result = extractSessionSummaryData(
      entries,
      1800,
      1800,
      true,
      false,
      []
    );

    expect(result.idleTime).toBe(300); // 5 minutes idle time in seconds
  });

  it('handles time up session type', () => {
    const result = extractSessionSummaryData(
      [],
      1800,
      1800,
      false,
      true, // time up
      []
    );

    expect(result.sessionType).toBe('timeUp');
  });

  it('handles empty entries', () => {
    const result = extractSessionSummaryData(
      [],
      1800,
      0,
      false,
      false,
      []
    );

    expect(result).toMatchObject({
      plannedTime: 1800,
      timeSpent: 0,
      overtime: 0,
      idleTime: 0,
      activities: [],
      skippedActivities: [],
      timelineEntries: [],
      sessionType: 'completed',
    });
  });

  it('handles skipped activities when storage fails', () => {
    mockGetActivities.mockImplementation(() => {
      throw new Error('Storage error');
    });

    const result = extractSessionSummaryData(
      [],
      1800,
      0,
      false,
      false,
      ['1', '2']
    );

    expect(result.skippedActivities).toEqual([
      { id: '1', name: '1' }, // Falls back to ID as name
      { id: '2', name: '2' },
    ]);
  });

  it('aggregates multiple entries for the same activity', () => {
    const baseTime = Date.now();
    const entries: TimelineEntry[] = [
      {
        id: 'entry-1',
        activityId: '1',
        activityName: 'Study Math',
        startTime: baseTime,
        endTime: baseTime + 600000, // 10 minutes
      },
      {
        id: 'entry-2',
        activityId: '2',
        activityName: 'Read Book',
        startTime: baseTime + 600000,
        endTime: baseTime + 1200000, // 10 minutes
      },
      {
        id: 'entry-3',
        activityId: '1', // Same activity again
        activityName: 'Study Math',
        startTime: baseTime + 1200000,
        endTime: baseTime + 1500000, // 5 minutes
      },
    ];

    const result = extractSessionSummaryData(
      entries,
      1800,
      1500,
      true,
      false,
      []
    );

    expect(result.activities).toHaveLength(2);
    
    const mathActivity = result.activities.find(a => a.id === '1');
    const readActivity = result.activities.find(a => a.id === '2');
    
    expect(mathActivity?.duration).toBe(900); // 15 minutes total (10 + 5)
    expect(readActivity?.duration).toBe(600); // 10 minutes
  });

  it('handles entries with title instead of activityName', () => {
    const baseTime = Date.now();
    const entries: TimelineEntry[] = [
      {
        id: 'entry-1',
        activityId: '1',
        title: 'Study Math', // Using title instead of activityName
        startTime: baseTime,
        endTime: baseTime + 900000,
      },
    ];

    const result = extractSessionSummaryData(
      entries,
      1800,
      900,
      true,
      false,
      []
    );

    expect(result.activities[0].name).toBe('Study Math');
    expect(result.timelineEntries[0].activityName).toBe('Study Math');
  });

  it('handles ongoing activities (no endTime)', () => {
    const baseTime = Date.now() - 60000; // 1 minute ago to ensure positive duration
    const entries: TimelineEntry[] = [
      {
        id: 'entry-1',
        activityId: '1',
        activityName: 'Study Math',
        startTime: baseTime,
        // No endTime - ongoing activity
      },
    ];

    const result = extractSessionSummaryData(
      entries,
      1800,
      900,
      false,
      false,
      []
    );

    expect(result.timelineEntries[0].endTime).toBeNull();
    expect(result.activities[0].duration).toBeGreaterThan(0); // Should calculate duration to now
  });
});