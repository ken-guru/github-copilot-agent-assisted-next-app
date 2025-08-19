/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';
import { GET } from '../route';
import { get } from '@vercel/blob';
import { checkRateLimit } from '@/utils/security/rateLimiting';
import { validateUUID } from '@/utils/uuid';

// Mock dependencies
jest.mock('@vercel/blob', () => ({
  get: jest.fn()
}));

jest.mock('@/utils/security/rateLimiting', () => ({
  checkRateLimit: jest.fn()
}));

jest.mock('@/utils/uuid', () => ({
  validateUUID: jest.fn()
}));

// Mock environment variable
process.env.BLOB_READ_WRITE_TOKEN = 'test-token';

describe('/api/sessions/[uuid]/activities', () => {
  const mockRequest = () => {
    return {
      nextUrl: { origin: 'https://example.com' },
      headers: { get: jest.fn().mockReturnValue('test-user-agent') }
    } as unknown as NextRequest;
  };

  const mockStoredSession = {
    sessionData: {
      activities: [
        { id: '1', name: 'Activity 1', duration: 1800, colorIndex: 0 },
        { id: '2', name: 'Activity 2', duration: 1200, colorIndex: 1 }
      ]
    },
    metadata: {
      id: 'test-session-id',
      createdAt: '2023-01-01T00:00:00.000Z',
      expiresAt: '2023-04-01T00:00:00.000Z', // Future date
      version: '1.0'
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (checkRateLimit as jest.Mock).mockResolvedValue({ success: true });
    (validateUUID as jest.Mock).mockReturnValue(true);
    
    // Mock current date to be before expiration
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2023-02-01T00:00:00.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('GET', () => {
    it('should successfully return activities', async () => {
      const mockBlob = {
        json: jest.fn().mockResolvedValue(mockStoredSession)
      };
      (get as jest.Mock).mockResolvedValue(mockBlob);

      const request = mockRequest();
      const response = await GET(request, { params: { uuid: 'test-session-id' } });
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData.activities).toEqual([
        { id: '1', name: 'Activity 1', duration: 1800, colorIndex: 0 },
        { id: '2', name: 'Activity 2', duration: 1200, colorIndex: 1 }
      ]);
      expect(responseData.sessionId).toBe('test-session-id');
      expect(responseData.totalActivities).toBe(2);
    });

    it('should handle rate limiting', async () => {
      (checkRateLimit as jest.Mock).mockResolvedValue({ success: false });

      const request = mockRequest();
      const response = await GET(request, { params: { uuid: 'test-session-id' } });

      expect(response.status).toBe(429);
      const responseData = await response.json();
      expect(responseData.error).toBe('Rate limit exceeded. Please try again later.');
    });

    it('should handle invalid UUID format', async () => {
      (validateUUID as jest.Mock).mockReturnValue(false);

      const request = mockRequest();
      const response = await GET(request, { params: { uuid: 'invalid-uuid' } });

      expect(response.status).toBe(400);
      const responseData = await response.json();
      expect(responseData.error).toBe('Invalid session ID format');
    });

    it('should handle session not found', async () => {
      (get as jest.Mock).mockResolvedValue(null);

      const request = mockRequest();
      const response = await GET(request, { params: { uuid: 'non-existent-session' } });

      expect(response.status).toBe(404);
      const responseData = await response.json();
      expect(responseData.error).toBe('Session not found');
    });

    it('should handle expired session', async () => {
      const expiredSession = {
        ...mockStoredSession,
        metadata: {
          ...mockStoredSession.metadata,
          expiresAt: '2023-01-15T00:00:00.000Z' // Past date
        }
      };

      const mockBlob = {
        json: jest.fn().mockResolvedValue(expiredSession)
      };
      (get as jest.Mock).mockResolvedValue(mockBlob);

      const request = mockRequest();
      const response = await GET(request, { params: { uuid: 'expired-session' } });

      expect(response.status).toBe(410);
      const responseData = await response.json();
      expect(responseData.error).toBe('Session has expired');
    });

    it('should handle blob storage errors', async () => {
      (get as jest.Mock).mockRejectedValue(new Error('Blob storage error'));

      const request = mockRequest();
      const response = await GET(request, { params: { uuid: 'test-session-id' } });

      expect(response.status).toBe(404);
      const responseData = await response.json();
      expect(responseData.error).toBe('Session not found');
    });

    it('should handle empty activities list', async () => {
      const sessionWithNoActivities = {
        ...mockStoredSession,
        sessionData: {
          activities: []
        }
      };

      const mockBlob = {
        json: jest.fn().mockResolvedValue(sessionWithNoActivities)
      };
      (get as jest.Mock).mockResolvedValue(mockBlob);

      const request = mockRequest();
      const response = await GET(request, { params: { uuid: 'test-session-id' } });
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData.activities).toEqual([]);
      expect(responseData.totalActivities).toBe(0);
    });

    it('should handle malformed session data', async () => {
      const mockBlob = {
        json: jest.fn().mockRejectedValue(new Error('Invalid JSON'))
      };
      (get as jest.Mock).mockResolvedValue(mockBlob);

      const request = mockRequest();
      const response = await GET(request, { params: { uuid: 'test-session-id' } });

      expect(response.status).toBe(500);
      const responseData = await response.json();
      expect(responseData.error).toBe('Internal server error');
    });

    it('should extract only necessary activity fields', async () => {
      const sessionWithExtraFields = {
        sessionData: {
          activities: [
            { 
              id: '1', 
              name: 'Activity 1', 
              duration: 1800, 
              colorIndex: 0,
              extraField: 'should not be included',
              anotherField: 123
            }
          ]
        },
        metadata: mockStoredSession.metadata
      };

      const mockBlob = {
        json: jest.fn().mockResolvedValue(sessionWithExtraFields)
      };
      (get as jest.Mock).mockResolvedValue(mockBlob);

      const request = mockRequest();
      const response = await GET(request, { params: { uuid: 'test-session-id' } });
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData.activities).toEqual([
        { id: '1', name: 'Activity 1', duration: 1800, colorIndex: 0 }
      ]);
      expect(responseData.activities[0]).not.toHaveProperty('extraField');
      expect(responseData.activities[0]).not.toHaveProperty('anotherField');
    });
  });
});