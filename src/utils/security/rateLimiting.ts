/**
 * Rate limiting utilities for API endpoints
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  keyGenerator?: (req: Request) => string;
}

/**
 * In-memory rate limiter for development and simple use cases
 * In production, consider using Redis or similar for distributed rate limiting
 */
export class MemoryRateLimiter {
  private store = new Map<string, RateLimitEntry>();
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
    
    // Clean up expired entries every 5 minutes
    setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }

  /**
   * Check if request is within rate limit
   */
  async checkLimit(key: string): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
    const now = Date.now();
    const entry = this.store.get(key);

    if (!entry || now > entry.resetTime) {
      // First request or window expired
      const resetTime = now + this.config.windowMs;
      this.store.set(key, { count: 1, resetTime });
      return {
        allowed: true,
        remaining: this.config.maxRequests - 1,
        resetTime,
      };
    }

    if (entry.count >= this.config.maxRequests) {
      // Rate limit exceeded
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.resetTime,
      };
    }

    // Increment counter
    entry.count++;
    this.store.set(key, entry);

    return {
      allowed: true,
      remaining: this.config.maxRequests - entry.count,
      resetTime: entry.resetTime,
    };
  }

  /**
   * Clean up expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.resetTime) {
        this.store.delete(key);
      }
    }
  }

  /**
   * Get current store size (for monitoring)
   */
  getStoreSize(): number {
    return this.store.size;
  }

  /**
   * Clear all entries (for testing)
   */
  clear(): void {
    this.store.clear();
  }
}

/**
 * Rate limit configurations for different endpoints
 */
export const RATE_LIMIT_CONFIGS = {
  shareSession: {
    maxRequests: 10,
    windowMs: 60 * 60 * 1000, // 1 hour
  },
  retrieveSession: {
    maxRequests: 100,
    windowMs: 60 * 60 * 1000, // 1 hour
  },
  duplicateSession: {
    maxRequests: 20,
    windowMs: 60 * 60 * 1000, // 1 hour
  },
} as const;

/**
 * Global rate limiters for different endpoints
 */
export const rateLimiters = {
  shareSession: new MemoryRateLimiter(RATE_LIMIT_CONFIGS.shareSession),
  retrieveSession: new MemoryRateLimiter(RATE_LIMIT_CONFIGS.retrieveSession),
  duplicateSession: new MemoryRateLimiter(RATE_LIMIT_CONFIGS.duplicateSession),
};

/**
 * Extract client IP from request headers
 */
export function getClientIP(request: Request): string {
  // Check various headers for client IP
  const headers = request.headers;
  
  // Vercel provides the real IP in x-forwarded-for
  const forwardedFor = headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() || 'unknown';
  }
  
  // Fallback headers
  const realIP = headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }
  
  const cfConnectingIP = headers.get('cf-connecting-ip');
  if (cfConnectingIP) {
    return cfConnectingIP;
  }
  
  // Default fallback
  return 'unknown';
}

/**
 * Rate limiting middleware for Next.js API routes
 */
export async function withRateLimit<T>(
  request: Request,
  limiter: MemoryRateLimiter,
  handler: () => Promise<T>
): Promise<T> {
  const clientIP = getClientIP(request);
  const result = await limiter.checkLimit(clientIP);

  if (!result.allowed) {
    const resetDate = new Date(result.resetTime);
    throw new RateLimitError(
      'Rate limit exceeded',
      result.resetTime,
      resetDate.toISOString()
    );
  }

  return handler();
}

/**
 * Custom error class for rate limiting
 */
export class RateLimitError extends Error {
  constructor(
    message: string,
    public resetTime: number,
    public resetDate: string
  ) {
    super(message);
    this.name = 'RateLimitError';
  }
}

/**
 * Storage quota tracking for per-IP limits
 */
export class StorageQuotaTracker {
  private quotas = new Map<string, { used: number; lastUpdate: number }>();
  private readonly maxQuotaPerIP = 10 * 1024 * 1024; // 10MB per IP
  private readonly quotaWindowMs = 24 * 60 * 60 * 1000; // 24 hours

  /**
   * Check if IP has quota available for storing data
   */
  checkQuota(ip: string, dataSize: number): boolean {
    const now = Date.now();
    const quota = this.quotas.get(ip);

    if (!quota || now - quota.lastUpdate > this.quotaWindowMs) {
      // Reset quota for new window
      this.quotas.set(ip, { used: dataSize, lastUpdate: now });
      return dataSize <= this.maxQuotaPerIP;
    }

    const newUsed = quota.used + dataSize;
    if (newUsed > this.maxQuotaPerIP) {
      return false;
    }

    // Update quota
    this.quotas.set(ip, { used: newUsed, lastUpdate: now });
    return true;
  }

  /**
   * Get remaining quota for IP
   */
  getRemainingQuota(ip: string): number {
    const quota = this.quotas.get(ip);
    if (!quota) {
      return this.maxQuotaPerIP;
    }

    const now = Date.now();
    if (now - quota.lastUpdate > this.quotaWindowMs) {
      return this.maxQuotaPerIP;
    }

    return Math.max(0, this.maxQuotaPerIP - quota.used);
  }

  /**
   * Clean up expired quotas
   */
  cleanup(): void {
    const now = Date.now();
    for (const [ip, quota] of this.quotas.entries()) {
      if (now - quota.lastUpdate > this.quotaWindowMs) {
        this.quotas.delete(ip);
      }
    }
  }
}

/**
 * Global storage quota tracker
 */
export const storageQuotaTracker = new StorageQuotaTracker();

/**
 * Duplicate detection for preventing identical session shares
 */
export class DuplicateDetector {
  private hashes = new Map<string, { count: number; lastSeen: number }>();
  private readonly maxDuplicates = 3;
  private readonly windowMs = 60 * 60 * 1000; // 1 hour

  /**
   * Generate hash for session data
   */
  private generateHash(data: any): string {
    const serialized = JSON.stringify(data, Object.keys(data).sort());
    return btoa(serialized).slice(0, 32); // Simple hash for duplicate detection
  }

  /**
   * Check if session data is a duplicate
   */
  checkDuplicate(ip: string, sessionData: any): boolean {
    const hash = this.generateHash(sessionData);
    const key = `${ip}:${hash}`;
    const now = Date.now();
    
    const entry = this.hashes.get(key);
    if (!entry || now - entry.lastSeen > this.windowMs) {
      // First occurrence or window expired
      this.hashes.set(key, { count: 1, lastSeen: now });
      return false;
    }

    if (entry.count >= this.maxDuplicates) {
      return true; // Duplicate detected
    }

    // Increment counter
    entry.count++;
    entry.lastSeen = now;
    this.hashes.set(key, entry);
    return false;
  }

  /**
   * Clean up expired entries
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.hashes.entries()) {
      if (now - entry.lastSeen > this.windowMs) {
        this.hashes.delete(key);
      }
    }
  }
}

/**
 * Global duplicate detector
 */
export const duplicateDetector = new DuplicateDetector();

// Set up cleanup intervals
setInterval(() => {
  storageQuotaTracker.cleanup();
  duplicateDetector.cleanup();
}, 5 * 60 * 1000); // Clean up every 5 minutes