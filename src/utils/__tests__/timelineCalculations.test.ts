import { calculateTimeSpans } from '../timelineCalculations';
import { TimelineEntry } from '@/components/Timeline';

describe('calculateTimeSpans', () => {
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

  it('should return a single activity item with the correct duration and height', () => {
    const startTime = Date.now() - 10000;
    const endTime = Date.now();
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

    expect(result.items.length).toBe(1);
    expect(result.items[0].type).toBe('activity');
    expect(result.items[0].duration).toBe(endTime - startTime);
    expect(result.items[0].height).toBeCloseTo(((endTime - startTime) / (totalDuration)) * 100);
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

    expect(result.items[0].type).toBe('activity');
    expect(result.items[0].duration).toBe(endTime1 - startTime1);
    expect(result.items[0].height).toBeCloseTo(((endTime1 - startTime1) / (totalDuration)) * 100);

    expect(result.items[1].type).toBe('activity');
    expect(result.items[1].duration).toBe(endTime2 - startTime2);
    expect(result.items[1].height).toBeCloseTo(((endTime2 - startTime2) / (totalDuration)) * 100);
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

    expect(result.items[0].type).toBe('activity');
    expect(result.items[1].type).toBe('gap');
    expect(result.items[2].type).toBe('activity');

    expect(result.items[1].duration).toBe(startTime2 - endTime1);
    expect(result.items[1].height).toBeCloseTo(((startTime2 - endTime1) / (totalDuration)) * 100);
  });

  it('should include a gap item for the remaining time when all activities are completed', () => {
    const startTime1 = Date.now() - 20000;
    const endTime1 = Date.now() - 10000;

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
      entries: entries,
      totalDuration: totalDuration,
      allActivitiesCompleted: allActivitiesCompleted,
      timeLeft: timeLeft,
    });

    expect(result.items.length).toBe(2);
    expect(result.items[1].type).toBe('gap');
    expect(result.items[1].duration).toBe(timeLeft);
    expect(result.items[1].height).toBeCloseTo(((timeLeft) / (totalDuration)) * 100);
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
    expect(result.items[0].type).toBe('activity');
    expect(result.items[0].duration).toBeCloseTo(Date.now() - startTime, -1);
    expect(result.items[0].height).toBeCloseTo(((Date.now() - startTime) / (totalDuration)) * 100);
  });
});
