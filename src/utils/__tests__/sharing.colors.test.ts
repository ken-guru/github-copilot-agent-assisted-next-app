import { mapTimelineEntriesForShare } from '../sharing';
import type { TimelineEntry } from '../../types';
import type { SharedTimelineEntry } from '../../types/sessionSharing';

describe('mapTimelineEntriesForShare - colors', () => {
  it('includes colors when entry has theme-aware colors', () => {
    const entries: TimelineEntry[] = [{
      id: 'e1', activityId: 'a1', activityName: 'Test', startTime: 1000, endTime: 2000,
      colors: {
        light: { background: 'hsl(120, 60%, 95%)', text: 'hsl(120, 60%, 25%)', border: 'hsl(120, 60%, 35%)' },
        dark: { background: 'hsl(120, 60%, 20%)', text: 'hsl(120, 60%, 85%)', border: 'hsl(120, 60%, 40%)' },
      }
    }];
  const mapped = mapTimelineEntriesForShare(entries);
  const first = mapped[0]! as SharedTimelineEntry;
  expect(first.colors).toBeDefined();
  const colors = first.colors! as NonNullable<SharedTimelineEntry['colors']>;
    if ('light' in colors) {
      expect(colors.light.background).toContain('hsl(');
    } else {
      // If we didn't get theme-aware colors, the test should fail
      throw new Error('Expected theme-aware colors to be present');
    }
  });

  it('derives colors from colorIndex when colors missing', () => {
    type TimelineEntryWithIndex = TimelineEntry & { colorIndex: number };
    const entries: TimelineEntryWithIndex[] = [{
      id: 'e2', activityId: 'a2', activityName: 'NoColors', startTime: 1000, endTime: 2000,
      colorIndex: 1,
    }];
  const mapped = mapTimelineEntriesForShare(entries);
  const first = mapped[0]! as SharedTimelineEntry;
  expect(first.colors).toBeDefined();
  const colors = first.colors! as NonNullable<SharedTimelineEntry['colors']>;
    if ('light' in colors) {
      expect(colors.light).toBeDefined();
      expect(colors.dark).toBeDefined();
    } else {
      throw new Error('Expected derived theme-aware colors to be present');
    }
  });
});
