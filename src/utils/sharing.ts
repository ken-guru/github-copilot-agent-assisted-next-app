import type { TimelineEntry } from '@/types';
import { internalActivityColors } from '@/utils/colors';

/**
 * Map timeline entries into the sanitized shape used for session sharing.
 * This centralizes the logic so UI components and other callers produce
 * a consistent payload shape for the server-side schema validation.
 */
export function mapTimelineEntriesForShare(inputEntries: TimelineEntry[]) {
  return inputEntries.map((e) => {
    const rawColor = (e as unknown as Record<string, unknown>).colorIndex;
    const colorIndex = (typeof rawColor === 'number' && Number.isInteger(rawColor)) ? (rawColor as number) : undefined;

    // Prefer explicit colors on the entry; otherwise, if we have a colorIndex
    // map it to our theme-aware internal palette so shared sessions retain colors.
    const colors = (() => {
      if (e.colors) {
        return e.colors as unknown;
      }
      if (typeof colorIndex === 'number' && colorIndex >= 0 && colorIndex < internalActivityColors.length) {
        const defaultSet = internalActivityColors[0] ?? {
          light: { background: '#f0f0f0', text: '#000000', border: '#cccccc' },
          dark: { background: '#222222', text: '#ffffff', border: '#555555' },
        } as const;
        const set = internalActivityColors[colorIndex] ?? defaultSet;
        // Persist theme-aware variant to allow correct rendering in both themes
        return { light: set.light, dark: set.dark } as const;
      }
      return undefined;
    })();

  return {
      id: e.id ?? `${e.startTime}-${e.activityId ?? 'idle'}`,
      activityId: e.activityId ?? null,
      activityName: e.activityName ?? null,
      startTime: e.startTime,
      endTime: e.endTime ?? null,
      colors,
    };
  });
}
