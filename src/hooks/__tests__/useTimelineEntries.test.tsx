import { renderHook, act } from '@testing-library/react';
import { useTimelineEntries } from '../useTimelineEntries';
import { getNextAvailableColorSet } from '../../utils/colors';

describe('useTimelineEntries', () => {
  const mockActivity = {
    id: '1',
    name: 'Test Activity',
    colorIndex: 0,
    createdAt: new Date().toISOString(),
    isActive: true
  };
  const mockColors = getNextAvailableColorSet(mockActivity.colorIndex);

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-01'));
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    jest.useRealTimers();
    // Clear localStorage after each test
    localStorage.clear();
  });

  it('should initialize with empty timeline', () => {
    const { result } = renderHook(() => useTimelineEntries());
    expect(result.current.timelineEntries).toHaveLength(0);
  });

  it('should add timeline entry for activity', () => {
    const { result } = renderHook(() => useTimelineEntries());

    act(() => {
      result.current.addTimelineEntry(mockActivity);
    });

    expect(result.current.timelineEntries).toHaveLength(1);
    expect(result.current.timelineEntries[0]).toEqual({
      id: Date.now().toString(),
      activityId: mockActivity.id,
      activityName: mockActivity.name,
      startTime: Date.now(),
      endTime: null,
  colors: mockColors
    });
  });

  it('should complete current timeline entry', () => {
    const { result } = renderHook(() => useTimelineEntries());
    const startTime = Date.now();

    act(() => {
      result.current.addTimelineEntry(mockActivity);
    });

    jest.advanceTimersByTime(1000); // Advance 1 second
    
    act(() => {
      result.current.completeCurrentTimelineEntry();
    });

    const firstEntry = result.current.timelineEntries[0];
    expect(firstEntry?.endTime).toBe(startTime + 1000);
  });

  it('should add and complete timeline entries', () => {
    const { result } = renderHook(() => useTimelineEntries());
    const startTime = Date.now();

    act(() => {
      result.current.addTimelineEntry(mockActivity);
    });

    jest.advanceTimersByTime(1000); // Advance 1 second
    
    act(() => {
      result.current.completeCurrentTimelineEntry();
    });

    const firstEntry = result.current.timelineEntries[0];
    expect(firstEntry?.endTime).toBe(startTime + 1000);
  });

  it('should not modify completed entries when completing current entry', () => {
    const { result } = renderHook(() => useTimelineEntries());
    const startTime = Date.now();

    // Add and complete first entry
    act(() => {
      result.current.addTimelineEntry(mockActivity);
    });

    jest.advanceTimersByTime(1000); // Advance 1 second
    
    act(() => {
      result.current.completeCurrentTimelineEntry();
    });

    const firstEntryEndTime = startTime + 1000;

    // Add second entry and complete it
    act(() => {
      result.current.addTimelineEntry(mockActivity);
    });
    
    jest.advanceTimersByTime(2000); // Advance 2 seconds
    
    act(() => {
      result.current.completeCurrentTimelineEntry();
    });

    // Verify first entry's end time hasn't changed
    const firstEntry = result.current.timelineEntries[0];
    expect(firstEntry?.endTime).toBe(firstEntryEndTime);
  });

  it('should do nothing when completing entry with no timeline entries', () => {
    const { result } = renderHook(() => useTimelineEntries());

    act(() => {
      result.current.completeCurrentTimelineEntry();
    });

    expect(result.current.timelineEntries).toHaveLength(0);
  });

  it('should do nothing when completing already completed entry', () => {
    const { result } = renderHook(() => useTimelineEntries());
    const startTime = Date.now();

    act(() => {
      result.current.addTimelineEntry(mockActivity);
    });

    jest.advanceTimersByTime(1000);
    
    act(() => {
      result.current.completeCurrentTimelineEntry();
    });

    const endTime = startTime + 1000;

    jest.advanceTimersByTime(1000);
    
    act(() => {
      result.current.completeCurrentTimelineEntry();
    });

    const firstEntry = result.current.timelineEntries[0];
    expect(firstEntry?.endTime).toBe(endTime);
  });

  it('should reset timeline entries', () => {
    const { result } = renderHook(() => useTimelineEntries());

    act(() => {
      result.current.addTimelineEntry(mockActivity);
    });

    act(() => {
      result.current.resetTimelineEntries();
    });

    expect(result.current.timelineEntries).toHaveLength(0);
  });
});