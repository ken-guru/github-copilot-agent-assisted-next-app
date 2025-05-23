import { calculateTimeSpans } from '../timelineCalculations';
import { TimelineEntry } from '@/types';

describe('calculateTimeSpans', () => {
  let dateNowSpy: jest.SpyInstance;
  const FIXED_TIME = 1000000;

  beforeEach(() => {
    // Mock Date.now to return a fixed timestamp
    dateNowSpy = jest.spyOn(Date, 'now').mockImplementation(() => FIXED_TIME);
  });

  afterEach(() => {
    dateNowSpy.mockRestore();
  });

  it('should return an empty array when there are no entries', () => {
    const entries: TimelineEntry[] = [];
    const totalDuration = 60 * 1000;
    const allActivitiesCompleted = false;
    const timeLeft = 0;

    const result = calculateTimeSpans({
      entries: entries,
      totalDuration: totalDuration,
      allActivitiesCompleted: allActivitiesCompleted,
      timeLeft: timeLeft,
    });

    expect(result.items).toEqual([]);
  });

  it('should return activity and break items for a completed activity', () => {
    const startTime = FIXED_TIME - 20000; // 20 seconds ago
    const endTime = FIXED_TIME - 10000;   // 10 seconds ago
    const entries: TimelineEntry[] = [
      {
        id: 'test-id',
        activityId: null,
        activityName: 'Test Activity',
        startTime: startTime,
        endTime: endTime,
      },
    ];
    const totalDuration = 60 * 1000;
    const allActivitiesCompleted = false;
    const timeLeft = 0;

    const result = calculateTimeSpans({
      entries: entries,
      totalDuration: totalDuration,
      allActivitiesCompleted: allActivitiesCompleted,
      timeLeft: timeLeft,
    });

    // Expect two items: the activity and the break after it
    expect(result.items.length).toBe(2);
    
    // Verify activity item
    expect(result.items[0]?.type).toBe('activity');
    expect(result.items[0]?.duration).toBe(endTime - startTime);
    expect(result.items[0]?.height).toBeCloseTo(((endTime - startTime) / totalDuration) * 100);
    
    // Verify break item
    expect(result.items[1]?.type).toBe('gap');
    expect(result.items[1]?.duration).toBe(FIXED_TIME - endTime);
    expect(result.items[1]?.height).toBeCloseTo(((FIXED_TIME - endTime) / totalDuration) * 100);
  });

  it('should return multiple activity items with the correct durations and heights', () => {
    const startTime1 = Date.now() - 20000;
    const endTime1 = Date.now() - 10000;
    const startTime2 = Date.now() - 10000;
    const endTime2 = Date.now();

    const entries: TimelineEntry[] = [
      {
        id: 'test-id-1',
        activityId: null,
        activityName: 'Test Activity 1',
        startTime: startTime1,
        endTime: endTime1,
      },
      {
        id: 'test-id-2',
        activityId: null,
        activityName: 'Test Activity 2',
        startTime: startTime2,
        endTime: endTime2,
      },
    ];
    const totalDuration = 60 * 1000;
    const allActivitiesCompleted = false;
    const timeLeft = 0;

    const result = calculateTimeSpans({
      entries: entries,
      totalDuration: totalDuration,
      allActivitiesCompleted: allActivitiesCompleted,
      timeLeft: timeLeft,
    });

    expect(result.items.length).toBe(2);

    expect(result.items[0]?.type).toBe('activity');
    expect(result.items[0]?.duration).toBe(endTime1 - startTime1);
    expect(result.items[0]?.height).toBeCloseTo(((endTime1 - startTime1) / (totalDuration)) * 100);

    expect(result.items[1]?.type).toBe('activity');
    expect(result.items[1]?.duration).toBe(endTime2 - startTime2);
    expect(result.items[1]?.height).toBeCloseTo(((endTime2 - startTime2) / (totalDuration)) * 100);
  });

  it('should return multiple activity items with gaps', () => {
    const startTime1 = Date.now() - 30000;
    const endTime1 = Date.now() - 20000;
    const startTime2 = Date.now() - 10000;
    const endTime2 = Date.now();

    const entries: TimelineEntry[] = [
      {
        id: 'test-id-1',
        activityId: null,
        activityName: 'Test Activity 1',
        startTime: startTime1,
        endTime: endTime1,
      },
      {
        id: 'test-id-2',
        activityId: null,
        activityName: 'Test Activity 2',
        startTime: startTime2,
        endTime: endTime2,
      },
    ];
    const totalDuration = 60 * 1000;
    const allActivitiesCompleted = false;
    const timeLeft = 0;

    const result = calculateTimeSpans({
      entries: entries,
      totalDuration: totalDuration,
      allActivitiesCompleted: allActivitiesCompleted,
      timeLeft: timeLeft,
    });

    expect(result.items.length).toBe(3);

    expect(result.items[0]?.type).toBe('activity');
    expect(result.items[1]?.type).toBe('gap');
    expect(result.items[2]?.type).toBe('activity');

    expect(result.items[1]?.duration).toBe(startTime2 - endTime1);
    expect(result.items[1]?.height).toBeCloseTo(((startTime2 - endTime1) / (totalDuration)) * 100);
  });

  it('should include a gap item for the remaining time when all activities are completed', () => {
    const startTime1 = FIXED_TIME - 20000; // 20 seconds ago
    const endTime1 = FIXED_TIME - 10000;   // 10 seconds ago
    
    const entries: TimelineEntry[] = [
      {
        id: 'test-id-1',
        activityId: null,
        activityName: 'Test Activity 1',
        startTime: startTime1,
        endTime: endTime1,
      },
    ];
    const totalDuration = 60 * 1000;
    const allActivitiesCompleted = true;
    const timeLeft = 10 * 1000;
    
    const result = calculateTimeSpans({
      entries,
      totalDuration,
      allActivitiesCompleted,
      timeLeft,
    });

    // We expect 3 items:
    // 1. The activity
    // 2. The ongoing break since activity completion (10 seconds)
    // 3. The remaining time gap (10 seconds)
    expect(result.items.length).toBe(3);
    expect(result.items[0]?.type).toBe('activity');
    expect(result.items[0]?.duration).toBe(10000); // Activity lasted 10 seconds
    
    expect(result.items[1]?.type).toBe('gap'); // Ongoing break
    expect(result.items[1]?.duration).toBe(10000); // Break is 10 seconds
    
    expect(result.items[2]?.type).toBe('gap'); // Remaining time
    expect(result.items[2]?.duration).toBe(timeLeft);
    expect(result.items[2]?.height).toBeCloseTo((timeLeft / totalDuration) * 100);
  });

  it('should use Date.now() to calculate the duration for entries with `endTime` undefined', () => {
    const startTime = Date.now() - 10000;
    const entries: TimelineEntry[] = [
      {
        id: 'test-id',
        activityId: null,
        activityName: 'Test Activity',
        startTime: startTime,
        endTime: undefined,
      },
    ];
    const totalDuration = 60 * 1000;
    const allActivitiesCompleted = false;
    const timeLeft = 0;

    const result = calculateTimeSpans({
      entries: entries,
      totalDuration: totalDuration,
      allActivitiesCompleted: allActivitiesCompleted,
      timeLeft: timeLeft,
    });

    expect(result.items.length).toBe(1);
    expect(result.items[0]?.type).toBe('activity');
    expect(result.items[0]?.duration).toBeCloseTo(Date.now() - startTime, -1);
    expect(result.items[0]?.height).toBeCloseTo(((Date.now() - startTime) / (totalDuration)) * 100);
  });
});
