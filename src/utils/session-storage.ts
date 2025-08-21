import type { TimelineEntry } from '@/types';

export const SESSION_STORAGE_KEY = 'session_v1';

export interface SessionSnapshot {
  timeSet: boolean;
  totalDuration: number; // seconds
  timerActive: boolean;
  currentActivityId: string | null;
  timelineEntries: TimelineEntry[]; // minimal shape needed to rehydrate
}

function isObject(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === 'object';
}

function isTimelineEntry(v: unknown): v is TimelineEntry {
  if (!isObject(v)) return false;
  return (
    typeof v.id === 'string' &&
    (typeof v.activityId === 'string' || v.activityId === null) &&
    (typeof v.activityName === 'string' || v.activityName === null) &&
    typeof v.startTime === 'number' &&
    (typeof v.endTime === 'number' || v.endTime === null)
  );
}

function isValidSnapshot(v: unknown): v is SessionSnapshot {
  if (!isObject(v)) return false;
  return (
    typeof v.timeSet === 'boolean' &&
    typeof v.totalDuration === 'number' &&
    typeof v.timerActive === 'boolean' &&
    ('currentActivityId' in v) && (typeof (v as any).currentActivityId === 'string' || (v as any).currentActivityId === null) &&
    Array.isArray((v as any).timelineEntries) && (v as any).timelineEntries.every(isTimelineEntry)
  );
}

export function loadSessionSnapshot(): SessionSnapshot | null {
  try {
    if (typeof localStorage === 'undefined') return null;
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (isValidSnapshot(parsed)) return parsed;
    return null;
  } catch {
    return null;
  }
}

export function saveSessionSnapshot(snapshot: SessionSnapshot): void {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(snapshot));
  } catch {
    // ignore quota errors
  }
}

export function clearSessionSnapshot(): void {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.removeItem(SESSION_STORAGE_KEY);
  } catch {
    // ignore
  }
}
