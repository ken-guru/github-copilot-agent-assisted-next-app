import type { TimelineEntry } from '@/types';

/**
 * Map timeline entries into the sanitized shape used for session sharing.
 * This centralizes the logic so UI components and other callers produce
 * a consistent payload shape for the server-side schema validation.
 */
export function mapTimelineEntriesForShare(inputEntries: TimelineEntry[]) {
  return inputEntries.map((e) => {
    const rawColor = (e as unknown as Record<string, unknown>).colorIndex;
    const colorIndex = (typeof rawColor === 'number' && Number.isInteger(rawColor)) ? (rawColor as number) : undefined;

    return {
      id: e.id ?? `${e.startTime}-${e.activityId ?? 'idle'}`,
      activityId: e.activityId ?? null,
      activityName: e.activityName ?? null,
      startTime: e.startTime,
      endTime: e.endTime ?? null,
      colorIndex,
    };
  });
}
