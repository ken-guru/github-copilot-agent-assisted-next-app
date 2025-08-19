// Simple in-memory fixed-window rate limiter for low-traffic protection.
// Not suitable for distributed deployments. Intended as lightweight protection
// before adding a distributed limiter (redis, cloud provider, etc.).

type WindowEntry = { count: number; resetAt: number };

const windows = new Map<string, WindowEntry>();
const WINDOW_MS = 60_000; // 1 minute window
const DEFAULT_MAX_PER_WINDOW = 10;

export function checkAndIncrementKey(key: string, maxPerWindow = DEFAULT_MAX_PER_WINDOW) {
  const now = Date.now();
  const entry = windows.get(key);
  if (!entry || now > entry.resetAt) {
    windows.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true, remaining: maxPerWindow - 1 };
  }
  if (entry.count >= maxPerWindow) {
    return { ok: false, retryAfterMs: entry.resetAt - now };
  }
  entry.count += 1;
  return { ok: true, remaining: maxPerWindow - entry.count };
}

// Helper used by tests to reset limiter state
export function _resetRateLimiter() {
  windows.clear();
}
