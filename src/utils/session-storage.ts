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
  const obj = v as Record<string, unknown>;
  const timeSetOk = typeof obj.timeSet === 'boolean';
  const totalDurationOk = typeof obj.totalDuration === 'number';
  const timerActiveOk = typeof obj.timerActive === 'boolean';
  const currentActivityId = (obj as { currentActivityId?: unknown }).currentActivityId;
  const currentActivityIdOk =
    currentActivityId === null || typeof currentActivityId === 'string';
  const entries = (obj as { timelineEntries?: unknown }).timelineEntries;
  const entriesOk = Array.isArray(entries) && (entries as unknown[]).every(isTimelineEntry);
  return timeSetOk && totalDurationOk && timerActiveOk && currentActivityIdOk && entriesOk;
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
