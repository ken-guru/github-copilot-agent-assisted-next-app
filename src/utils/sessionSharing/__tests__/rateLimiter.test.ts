import { checkAndIncrementKey, _resetRateLimiter } from '../rateLimiter';

describe('in-memory rate limiter', () => {
  beforeEach(() => _resetRateLimiter());

  it('allows up to the configured number of requests then blocks', () => {
    const key = 'test';
    const max = 3;
    for (let i = 1; i <= max; i++) {
      const r = checkAndIncrementKey(key, max);
      expect(r.ok).toBe(true);
    }
    const blocked = checkAndIncrementKey(key, max);
    expect(blocked.ok).toBe(false);
    expect(typeof blocked.retryAfterMs).toBe('number');
  });
});
