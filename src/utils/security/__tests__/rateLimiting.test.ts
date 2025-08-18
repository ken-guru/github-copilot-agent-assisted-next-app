import {
  MemoryRateLimiter,
  getClientIP,
  StorageQuotaTracker,
  DuplicateDetector,
} from '../rateLimiting';

describe('Rate Limiting', () => {
  describe('MemoryRateLimiter', () => {
    it('should allow requests within limit', async () => {
      const limiter = new MemoryRateLimiter({ maxRequests: 5, windowMs: 60000 });
      
      const result = await limiter.checkLimit('test-key');
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(4);
    });

    it('should block requests exceeding limit', async () => {
      const limiter = new MemoryRateLimiter({ maxRequests: 2, windowMs: 60000 });
      
      // First two requests should be allowed
      await limiter.checkLimit('test-key');
      await limiter.checkLimit('test-key');
      
      // Third request should be blocked
      const result = await limiter.checkLimit('test-key');
      expect(result.allowed).toBe(false);
      expect(result.remaining).toBe(0);
    });

    it('should reset after window expires', async () => {
      const limiter = new MemoryRateLimiter({ maxRequests: 1, windowMs: 100 });
      
      // First request
      await limiter.checkLimit('test-key');
      
      // Second request should be blocked
      let result = await limiter.checkLimit('test-key');
      expect(result.allowed).toBe(false);
      
      // Wait for window to expire
      await new Promise(resolve => setTimeout(resolve, 150));
      
      // Should be allowed again
      result = await limiter.checkLimit('test-key');
      expect(result.allowed).toBe(true);
    });
  });

  describe('getClientIP', () => {
    // Mock Request object for Node.js environment
    const createMockRequest = (headers: Record<string, string> = {}) => ({
      headers: {
        get: (name: string) => headers[name] || null,
      },
    } as Request);

    it('should extract IP from x-forwarded-for header', () => {
      const request = createMockRequest({
        'x-forwarded-for': '192.168.1.1, 10.0.0.1',
      });
      
      const ip = getClientIP(request);
      expect(ip).toBe('192.168.1.1');
    });

    it('should fallback to x-real-ip header', () => {
      const request = createMockRequest({
        'x-real-ip': '192.168.1.2',
      });
      
      const ip = getClientIP(request);
      expect(ip).toBe('192.168.1.2');
    });

    it('should return unknown for missing headers', () => {
      const request = createMockRequest();
      
      const ip = getClientIP(request);
      expect(ip).toBe('unknown');
    });
  });

  describe('StorageQuotaTracker', () => {
    it('should allow storage within quota', () => {
      const tracker = new StorageQuotaTracker();
      
      const allowed = tracker.checkQuota('192.168.1.1', 1024);
      expect(allowed).toBe(true);
    });

    it('should track cumulative usage', () => {
      const tracker = new StorageQuotaTracker();
      const ip = '192.168.1.1';
      
      // Use most of the quota
      tracker.checkQuota(ip, 9 * 1024 * 1024);
      
      // Small addition should still work
      let allowed = tracker.checkQuota(ip, 1024);
      expect(allowed).toBe(true);
      
      // Large addition should be rejected
      allowed = tracker.checkQuota(ip, 2 * 1024 * 1024);
      expect(allowed).toBe(false);
    });

    it('should return correct remaining quota', () => {
      const tracker = new StorageQuotaTracker();
      const ip = '192.168.1.1';
      
      tracker.checkQuota(ip, 1024 * 1024); // Use 1MB
      
      const remaining = tracker.getRemainingQuota(ip);
      expect(remaining).toBe(9 * 1024 * 1024); // 9MB remaining
    });
  });

  describe('DuplicateDetector', () => {
    it('should allow first occurrence', () => {
      const detector = new DuplicateDetector();
      const sessionData = { activities: ['task1', 'task2'] };
      
      const isDuplicate = detector.checkDuplicate('192.168.1.1', sessionData);
      expect(isDuplicate).toBe(false);
    });

    it('should detect duplicates within limit', () => {
      const detector = new DuplicateDetector();
      const sessionData = { activities: ['task1', 'task2'] };
      const ip = '192.168.1.1';
      
      // First few occurrences should be allowed
      detector.checkDuplicate(ip, sessionData);
      detector.checkDuplicate(ip, sessionData);
      detector.checkDuplicate(ip, sessionData);
      
      // Fourth occurrence should be detected as duplicate
      const isDuplicate = detector.checkDuplicate(ip, sessionData);
      expect(isDuplicate).toBe(true);
    });

    it('should treat different data as non-duplicates', () => {
      const detector = new DuplicateDetector();
      const sessionData1 = { activities: ['task1'] };
      const sessionData2 = { activities: ['task2'] };
      const ip = '192.168.1.1';
      
      detector.checkDuplicate(ip, sessionData1);
      const isDuplicate = detector.checkDuplicate(ip, sessionData2);
      
      expect(isDuplicate).toBe(false);
    });
  });
});