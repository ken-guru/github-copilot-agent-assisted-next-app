export interface ProgressMetrics {
  elapsed: number; // seconds
  remaining: number; // seconds (>= 0)
  percent: number; // 0..100
}

export function computeProgress(
  sessionStartTime: number | null,
  totalDurationSeconds: number,
  nowMs: number = Date.now()
): ProgressMetrics {
  if (!sessionStartTime || totalDurationSeconds <= 0) {
    return { elapsed: 0, remaining: Math.max(0, totalDurationSeconds), percent: 0 };
  }
  const elapsed = Math.max(0, Math.floor((nowMs - sessionStartTime) / 1000));
  const remaining = Math.max(0, totalDurationSeconds - elapsed);
  const percent = Math.min(100, Math.max(0, (elapsed / Math.max(1, totalDurationSeconds)) * 100));
  return { elapsed, remaining, percent };
}
