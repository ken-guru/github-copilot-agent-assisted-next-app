/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';
import { POST } from '../route';
import { put, head } from '@vercel/blob';
import { rateLimiters } from '@/utils/security';
import { generateSessionSharingId } from '@/utils/uuid';

// Mock dependencies
jest.mock('@vercel/blob', () => ({
  put: jest.fn(),
  head: jest.fn(),
}));

jest.mock('@/utils/security', () => ({
  rateLimiters: {
    duplicateSession: {
      checkLimit: jest.fn(),
    },
  },
  validateSessionForSharing: jest.fn(),
  applySecurityHeaders: jest.fn(),
  getClientIP: jest.fn().mockReturnValue('127.0.0.1'),
  SECURITY_CONFIG: {
    DUPLICATE_RATE_LIMIT: 20,
    SESSION_EXPIRY_MS: 90 * 24 * 60 * 60 * 1000,
    MAX_DERIVED_SESSIONS: 10,
  },
  DuplicateSessionRequestSchema: {
    safeParse: jest.fn(),
  },
  RateLimitError: class RateLimitError extends Error {
    constructor(message: string, public resetTime: number, public resetDate: string) {
      super(message);
      this.name = 'RateLimitError';
    }
  },
}));

jest.mock('@/utils/uuid', () => ({
  generateSessionSharingId: jest.fn(),
  generateShareUrl: jest.fn().mockReturnValue('https://example.com/shared/new-session-id'),
}));

// Mock environment variable
process.env.BLOB_READ_WRITE_TOKEN = 'test-token';

const mockPut = put as jest.MockedFunction<typeof put>;
const mockHead = head as jest.MockedFunction<typeof head>;
const mockGenerateSessionSharingId = generateSessionSharingId as jest.MockedFunction<typeof generateSessionSharingId>;

describe('/api/sessions/duplicate', () => {
  const mockRequest = (body: unknown) => {
    return {
      json: jest.fn().mockResolvedValue(body),
      nextUrl: { origin: 'https://example.com' },
      headers: { 
        get: jest.fn().mockImplementation((header: string) => {
          if (header === 'user-agent') return 'test-user-agent';
          return null;
        })
      }
    } as unknown as NextRequest;
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock rate limiter
    (rateLimiters.duplicateSession.checkLimit as jest.Mock).mockResolvedValue({
      allowed: true,
      remaining: 19,
      resetTime: Date.now() + 3600000,
    });

    // Mock UUID generation
    mockGenerateSessionSharingId.mockReturnValue('new-session-id');
  });

  describe('POST', () => {
    it('should successfully create duplicate session', async () => {
      const requestBody = {
        sourceSessionId: 'source-session-id',
        newSessionData: {
          plannedTime: 3600,
          timeSpent: 3500,
          overtime: 0,
          idleTime: 100,
          activities: [
            { id: '1', name: 'Activity 1', duration: 1800, colorIndex: 0 }
          ],
          skippedActivities: [],
          timelineEntries: [],
          completedAt: '2023-01-01T12:00:00.000Z',
          sessionType: 'completed' as const
        }
      };

      // Mock validation success
      const { DuplicateSessionRequestSchema, validateSessionForSharing } = await import('@/utils/security');
      
      (DuplicateSessionRequestSchema.safeParse as jest.Mock).mockReturnValue({
        success: true,
        data: requestBody,
      });

      (validateSessionForSharing as jest.Mock).mockReturnValue(requestBody.newSessionData);

      // Mock source session exists and is valid
      const mockSourceSession = {
        sessionData: { 
          derivedSessionIds: [],
          originalSessionId: undefined,
        },
        metadata: {
          expiresAt: new Date(Date.now() + 86400000).toISOString(), // Valid for 1 day
        }
      };

      mockHead.mockResolvedValue(undefined as never); // Session exists
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        text: jest.fn().mockResolvedValue(JSON.stringify(mockSourceSession)),
      });

      // Mock successful storage
      mockPut.mockResolvedValue({ url: 'blob-url' } as Awaited<ReturnType<typeof put>>);

      const request = mockRequest(requestBody);
      const response = await POST(request);
      const responseData = await response.json();

      expect(response.status).toBe(201);
      expect(responseData.shareId).toBe('new-session-id');
      expect(responseData.shareUrl).toBe('https://example.com/shared/new-session-id');
      expect(responseData.expiresAt).toBeDefined();
    });

    it('should handle rate limiting', async () => {
      (rateLimiters.duplicateSession.checkLimit as jest.Mock).mockResolvedValue({
        allowed: false,
        remaining: 0,
        resetTime: Date.now() + 3600000,
      });

      const request = mockRequest({});
      const response = await POST(request);

      expect(response.status).toBe(429);
      const responseData = await response.json();
      expect(responseData.error).toBe('Rate limit exceeded');
    });

    it('should handle validation errors', async () => {
      const { DuplicateSessionRequestSchema } = await import('@/utils/security');
      (DuplicateSessionRequestSchema.safeParse as jest.Mock).mockReturnValue({
        success: false,
        error: {
          issues: [{ path: ['sourceSessionId'], message: 'Invalid UUID' }],
        },
      });

      const request = mockRequest({});
      const response = await POST(request);

      expect(response.status).toBe(400);
      const responseData = await response.json();
      expect(responseData.error).toBe('Validation failed');
    });

    it('should handle source session not found', async () => {
      const requestBody = {
        sourceSessionId: 'non-existent-session',
        newSessionData: {
          plannedTime: 3600,
          timeSpent: 3500,
          overtime: 0,
          idleTime: 100,
          activities: [],
          skippedActivities: [],
          timelineEntries: [],
          completedAt: '2023-01-01T12:00:00.000Z',
          sessionType: 'completed' as const
        }
      };

      const { DuplicateSessionRequestSchema } = await import('@/utils/security');
      (DuplicateSessionRequestSchema.safeParse as jest.Mock).mockReturnValue({
        success: true,
        data: requestBody,
      });

      // Mock source session not found
      mockHead.mockRejectedValue(new Error('Not found'));

      const request = mockRequest(requestBody);
      const response = await POST(request);

      expect(response.status).toBe(404);
      const responseData = await response.json();
      expect(responseData.error).toBe('Source session not found');
    });
  });
});