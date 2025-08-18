/**
 * CSRF (Cross-Site Request Forgery) protection utilities
 */

/**
 * Generate a cryptographically secure CSRF token
 */
export function generateCSRFToken(): string {
  // Generate 32 bytes of random data and encode as base64
  let array: Uint8Array;
  
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    // Browser environment
    array = new Uint8Array(32);
    crypto.getRandomValues(array);
  } else {
    // Fallback (not cryptographically secure, for testing only)
    array = new Uint8Array(32);
    for (let i = 0; i < 32; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
  }
  
  // Convert to base64url
  const base64 = typeof btoa !== 'undefined' 
    ? btoa(String.fromCharCode(...array))
    : Buffer.from(array).toString('base64');
    
  return base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

/**
 * Validate CSRF token format
 */
export function isValidCSRFToken(token: string): boolean {
  // Check if token is a valid base64url string of expected length
  const base64UrlPattern = /^[A-Za-z0-9_-]+$/;
  return typeof token === 'string' && 
         token.length >= 40 && 
         token.length <= 50 && 
         base64UrlPattern.test(token);
}

/**
 * CSRF token store for server-side validation
 * In production, consider using Redis or database storage
 */
class CSRFTokenStore {
  private tokens = new Map<string, { token: string; createdAt: number; ip: string }>();
  private readonly tokenLifetime = 60 * 60 * 1000; // 1 hour

  /**
   * Store a CSRF token for validation
   */
  storeToken(sessionId: string, token: string, ip: string): void {
    this.tokens.set(sessionId, {
      token,
      createdAt: Date.now(),
      ip,
    });
  }

  /**
   * Validate and consume a CSRF token
   */
  validateAndConsumeToken(sessionId: string, token: string, ip: string): boolean {
    const stored = this.tokens.get(sessionId);
    
    if (!stored) {
      return false; // Token not found
    }

    const now = Date.now();
    if (now - stored.createdAt > this.tokenLifetime) {
      this.tokens.delete(sessionId);
      return false; // Token expired
    }

    if (stored.token !== token) {
      return false; // Token mismatch
    }

    if (stored.ip !== ip) {
      return false; // IP mismatch
    }

    // Token is valid, consume it (one-time use)
    this.tokens.delete(sessionId);
    return true;
  }

  /**
   * Clean up expired tokens
   */
  cleanup(): void {
    const now = Date.now();
    for (const [sessionId, data] of this.tokens.entries()) {
      if (now - data.createdAt > this.tokenLifetime) {
        this.tokens.delete(sessionId);
      }
    }
  }

  /**
   * Get store size for monitoring
   */
  getStoreSize(): number {
    return this.tokens.size;
  }

  /**
   * Clear all tokens (for testing)
   */
  clear(): void {
    this.tokens.clear();
  }
}

/**
 * Global CSRF token store
 */
export const csrfTokenStore = new CSRFTokenStore();

/**
 * CSRF protection middleware for API routes
 */
export async function withCSRFProtection<T>(
  request: Request,
  sessionId: string,
  handler: () => Promise<T>
): Promise<T> {
  const method = request.method;
  
  // Only protect state-changing operations
  if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS') {
    return handler();
  }

  // Extract CSRF token from request
  const csrfToken = await extractCSRFToken(request);
  if (!csrfToken) {
    throw new CSRFError('CSRF token missing');
  }

  if (!isValidCSRFToken(csrfToken)) {
    throw new CSRFError('Invalid CSRF token format');
  }

  // Get client IP for validation
  const clientIP = getClientIPForCSRF(request);
  
  // Validate and consume token
  const isValid = csrfTokenStore.validateAndConsumeToken(sessionId, csrfToken, clientIP);
  if (!isValid) {
    throw new CSRFError('CSRF token validation failed');
  }

  return handler();
}

/**
 * Extract CSRF token from request
 */
async function extractCSRFToken(request: Request): Promise<string | null> {
  // Check header first
  const headerToken = request.headers.get('x-csrf-token');
  if (headerToken) {
    return headerToken;
  }

  // Check request body for POST requests
  if (request.method === 'POST') {
    try {
      const body = await request.clone().json();
      return body.csrfToken || null;
    } catch {
      // Body is not JSON or already consumed
      return null;
    }
  }

  return null;
}

/**
 * Get client IP for CSRF validation
 */
function getClientIPForCSRF(request: Request): string {
  const headers = request.headers;
  
  const forwardedFor = headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() || 'unknown';
  }
  
  const realIP = headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }
  
  return 'unknown';
}

/**
 * Custom error class for CSRF protection
 */
export class CSRFError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CSRFError';
  }
}

/**
 * Generate session ID for CSRF token association
 */
export function generateSessionId(): string {
  let array: Uint8Array;
  
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    // Browser environment
    array = new Uint8Array(16);
    crypto.getRandomValues(array);
  } else {
    // Fallback (not cryptographically secure, for testing only)
    array = new Uint8Array(16);
    for (let i = 0; i < 16; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
  }
  
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Client-side CSRF token management
 */
export class CSRFTokenManager {
  private static readonly STORAGE_KEY = 'csrf_session_id';
  
  /**
   * Get or create session ID for CSRF tokens
   */
  static getSessionId(): string {
    if (typeof window === 'undefined') {
      return ''; // Server-side, no session ID needed
    }

    let sessionId = sessionStorage.getItem(this.STORAGE_KEY);
    if (!sessionId) {
      sessionId = generateSessionId();
      sessionStorage.setItem(this.STORAGE_KEY, sessionId);
    }
    return sessionId;
  }

  /**
   * Request a new CSRF token from the server
   */
  static async requestToken(): Promise<string> {
    const sessionId = this.getSessionId();
    const response = await fetch('/api/csrf/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sessionId }),
    });

    if (!response.ok) {
      throw new Error('Failed to get CSRF token');
    }

    const data = await response.json();
    return data.token;
  }

  /**
   * Clear session ID (for logout or reset)
   */
  static clearSession(): void {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(this.STORAGE_KEY);
    }
  }
}

// Set up cleanup interval for CSRF tokens
setInterval(() => {
  csrfTokenStore.cleanup();
}, 5 * 60 * 1000); // Clean up every 5 minutes