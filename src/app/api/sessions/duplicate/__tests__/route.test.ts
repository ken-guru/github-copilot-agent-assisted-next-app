/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';
import { POST } from '../route';
import { put, head } from '@vercel/blob';
import { checkRateLimit } from '@/utils/security/rateLimiting';
import { validateInput, sanitizeSessionData } from '@/utils/security/validation';

// Mock dependencies
jest.mock('@vercel/blob', () => ({
  put: jest.fn(),
  head: jest.fn()
}));

jest.mock('@/utils/security/rateLimiting', () => ({
  checkRateLimit: jest.fn()
}));

jest.mock('@/utils/uuid', () => ({
  validateUUID: jest.fn().mockReturnValue(true)
}));

jest.mock('@/utils/security/validation', () => ({
  validateInput: jest.fn(),
  sanitizeSessionData: jest.fn()
}));

// Mock crypto.randomUUID
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: jest.fn().mockReturnValue('new-session-id')
  }
});

// Mock environment variable
process.env.BLOB_READ_WRITE_TOKEN = 'test-token';

const mockValidateInput = validateInput as jest.MockedFunction<typeof validateInput>;
const mockSanitizeSessionData = sanitizeSessionData as jest.MockedFunction<typeof sanitizeSessionData>;

describe('/api/sessions/duplicate', () => {
  const mockRequest = (body: unknown) => {
    return {
      json: jest.fn().mockResolvedValue(body),
      nextUrl: { origin: 'https://example.com' },
      headers: { get: jest.fn().mockReturnValue('test-user-agent') }
    } as unknown as NextRequest;
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (checkRateLimit as jest.Mock).mockResolvedValue({ success: true });
    mockSanitizeSessionData.mockImplementation(data => data);
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
      mockValidateInput.mockReturnValue({ success: true, data: requestBody });

      // Mock source session exists
      (head as jest.Mock).mockResolvedValue({ exists: true });

      // Mock successful storage
      (put as jest.Mock).mockResolvedValue({ url: 'blob-url' });

      // Mock fetch for updating source session
      global.fetch = jest.fn()
        .mockResolvedValueOnce({
          ok: true,
          json: jest.fn().mockResolvedValue({
            sessionData: { derivedSessionIds: [] },
            metadata: {}
          })
        });

      const request = mockRequest(requestBody);
      const response = await POST(request);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData.shareId).toBe('new-session-id');
      expect(responseData.shareUrl).toBe('https://example.com/shared/new-session-id');
      expect(responseData.expiresAt).toBeDefined();
    });

    it('should handle rate limiting', async () => {
      (checkRateLimit as jest.Mock).mockResolvedValue({ success: false });

      const request = mockRequest({});
      const response = await POST(request);

      expect(response.status).toBe(429);
      const responseData = await response.json();
      expect(responseData.error).toBe('Rate limit exceeded. Please try again later.');
    });

    it('should handle validation errors', async () => {
      mockValidateInput.mockReturnValue({ 
        success: false, 
        error: 'Invalid data' 
      });

      const request = mockRequest({});
      const response = await POST(request);

      expect(response.status).toBe(400);
      const responseData = await response.json();
      expect(responseData.error).toBe('Invalid request data');
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

      mockValidateInput.mockReturnValue({ success: true, data: requestBody });

      // Mock source session not found
      (head as jest.Mock).mockRejectedValue(new Error('Not found'));

      const request = mockRequest(requestBody);
      const response = await POST(request);

      expect(response.status).toBe(404);
      const responseData = await response.json();
      expect(responseData.error).toBe('Source session not found or expired');
    });

    it('should prevent circular references', async () => {
      const requestBody = {
        sourceSessionId: 'source-session-id',
        newSessionData: {
          plannedTime: 3600,
          timeSpent: 3500,
          overtime: 0,
          idleTime: 100,
          activities: [],
          skippedActivities: [],
          timelineEntries: [],
          completedAt: '2023-01-01T12:00:00.000Z',
          sessionType: 'completed' as const,
          originalSessionId: 'source-session-id' // Circular reference
        }
      };

      mockValidateInput.mockReturnValue({ success: true, data: requestBody });

      (head as jest.Mock).mockResolvedValue({ exists: true });

      const request = mockRequest(requestBody);
      const response = await POST(request);

      expect(response.status).toBe(400);
      const responseData = await response.json();
      expect(responseData.error).toBe('Cannot create circular session reference');
    });

    it('should handle storage errors', async () => {
      const requestBody = {
        sourceSessionId: 'source-session-id',
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

      mockValidateInput.mockReturnValue({ success: true, data: requestBody });

      (head as jest.Mock).mockResolvedValue({ exists: true });
      (put as jest.Mock).mockRejectedValue(new Error('Storage error'));

      const request = mockRequest(requestBody);
      const response = await POST(request);

      expect(response.status).toBe(500);
      const responseData = await response.json();
      expect(responseData.error).toBe('Internal server error');
    });

    it('should handle chain depth limits', async () => {
      const requestBody = {
        sourceSessionId: 'source-session-id',
        newSessionData: {
          plannedTime: 3600,
          timeSpent: 3500,
          overtime: 0,
          idleTime: 100,
          activities: [],
          skippedActivities: [],
          timelineEntries: [],
          completedAt: '2023-01-01T12:00:00.000Z',
          sessionType: 'completed' as const,
          originalSessionId: 'deep-chain-session'
        }
      };

      mockValidateInput.mockReturnValue({ success: true, data: requestBody });

      (head as jest.Mock).mockResolvedValue({ exists: true });

      // Mock deep chain by making fetch return nested sessions
      global.fetch = jest.fn()
        .mockResolvedValue({
          ok: true,
          json: jest.fn().mockResolvedValue({
            sessionData: { originalSessionId: 'another-session' },
            metadata: {}
          })
        });

      // Mock the chain depth calculation to exceed limit
      const originalFetch = global.fetch;
      let callCount = 0;
      global.fetch = jest.fn().mockImplementation(() => {
        callCount++;
        if (callCount <= 6) { // Simulate deep chain
          return Promise.resolve({
            ok: true,
            json: jest.fn().mockResolvedValue({
              sessionData: { originalSessionId: `session-${callCount}` },
              metadata: {}
            })
          });
        }
        return originalFetch();
      });

      const request = mockRequest(requestBody);
      const response = await POST(request);

      expect(response.status).toBe(400);
      const responseData = await response.json();
      expect(responseData.error).toBe('Maximum session chain depth exceeded');
    });
  });
});