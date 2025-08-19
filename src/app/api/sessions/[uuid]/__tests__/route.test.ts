/**
 * Tests for session retrieval API endpoint
 * GET /api/sessions/[uuid]
 * 
 * @jest-environment node
 */

import { NextRequest } from 'next/server';
import { GET } from '../route';
import { head, del } from '@vercel/blob';
import { rateLimiters } from '@/utils/security';
import type { 
  StoredSession, 
  SessionSummaryData, 
  SessionMetadata,
  GetSessionResponse,
  SessionSharingError,
} from '@/types/session-sharing';

// Mock Vercel Blob functions
jest.mock('@vercel/blob', () => ({
  head: jest.fn(),
  del: jest.fn(),
}));

// Mock fetch for blob retrieval
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('GET /api/sessions/[uuid]', () => {
  const validSessionId = 'fd1a89eb-d7df-4713-8cff-0dd01f5ea3bf';
  
  const mockSessionData: SessionSummaryData = {
    plannedTime: 3600,
    timeSpent: 3300,
    overtime: 0,
    idleTime: 300,
    activities: [
      {
        id: 'activity-1',
        name: 'Test Activity',
        duration: 1800,
        colorIndex: 0,
      },
    ],
    skippedActivities: [],
    timelineEntries: [
      {
        id: 'timeline-1',
        activityId: 'activity-1',
        activityName: 'Test Activity',
        startTime: 0,
        endTime: 1800,
        colorIndex: 0,
      },
    ],
    completedAt: '2025-08-15T10:00:00.000Z',
    sessionType: 'completed',
  };

  const mockMetadata: SessionMetadata = {
    id: validSessionId,
    createdAt: '2025-08-15T10:00:00.000Z',
    expiresAt: '2025-12-15T10:00:00.000Z', // Future date
    version: '1.0.0',
    userAgent: 'Test User Agent',
  };

  const mockStoredSession: StoredSession = {
    sessionData: mockSessionData,
    metadata: mockMetadata,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    rateLimiters.retrieveSession.clear();
  });

  describe('Successful retrieval', () => {
    it('should retrieve a valid session successfully', async () => {
      (head as jest.Mock).mockResolvedValue({});
      mockFetch.mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(JSON.stringify(mockStoredSession)),
      });

      const request = new NextRequest(`http://localhost:3000/api/sessions/${validSessionId}`, {
        method: 'GET',
        headers: { 'x-forwarded-for': '192.168.1.1' },
      });

      const response = await GET(request, { params: { uuid: validSessionId } });
      const responseData = await response.json() as GetSessionResponse;

      expect(response.status).toBe(200);
      expect(responseData.sessionData).toEqual(mockSessionData);
      expect(responseData.metadata).toEqual(mockMetadata);
      expect(response.headers.get('X-Session-Id')).toBe(validSessionId);
      expect(response.headers.get('Cache-Control')).toBe('public, max-age=300, s-maxage=300');
    });
  });

  describe('UUID validation', () => {
    it('should reject invalid UUID format', async () => {
      const request = new NextRequest('http://localhost:3000/api/sessions/invalid-uuid', {
        method: 'GET',
        headers: { 'x-forwarded-for': '192.168.1.1' },
      });

      const response = await GET(request, { params: { uuid: 'invalid-uuid' } });
      const responseData = await response.json() as SessionSharingError;

      expect(response.status).toBe(400);
      expect(responseData.error).toBe('Invalid session ID');
      expect(responseData.code).toBe('INVALID_SESSION_ID');
    });
  });

  describe('Session not found', () => {
    it('should return 404 when session does not exist', async () => {
      (head as jest.Mock).mockRejectedValue(new Error('Not found'));

      const request = new NextRequest(`http://localhost:3000/api/sessions/${validSessionId}`, {
        method: 'GET',
        headers: { 'x-forwarded-for': '192.168.1.1' },
      });

      const response = await GET(request, { params: { uuid: validSessionId } });
      const responseData = await response.json() as SessionSharingError;

      expect(response.status).toBe(404);
      expect(responseData.error).toBe('Session not found');
      expect(responseData.code).toBe('SESSION_NOT_FOUND');
    });
  });

  describe('Session expiration', () => {
    it('should return 410 for expired sessions and clean them up', async () => {
      const expiredSession: StoredSession = {
        sessionData: mockSessionData,
        metadata: {
          ...mockMetadata,
          expiresAt: '2023-01-15T10:00:00.000Z', // Expired
        },
      };

      (head as jest.Mock).mockResolvedValue({});
      mockFetch.mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(JSON.stringify(expiredSession)),
      });
      (del as jest.Mock).mockResolvedValue({});

      const request = new NextRequest(`http://localhost:3000/api/sessions/${validSessionId}`, {
        method: 'GET',
        headers: { 'x-forwarded-for': '192.168.1.1' },
      });

      const response = await GET(request, { params: { uuid: validSessionId } });
      const responseData = await response.json() as SessionSharingError;

      expect(response.status).toBe(410);
      expect(responseData.error).toBe('Session expired');
      expect(responseData.code).toBe('SESSION_EXPIRED');
      expect(del).toHaveBeenCalledWith(`sessions/${validSessionId}.json`);
    });
  });

  describe('Rate limiting', () => {
    it('should enforce rate limits', async () => {
      // Make requests up to the limit
      for (let i = 0; i < 100; i++) {
        const request = new NextRequest(`http://localhost:3000/api/sessions/${validSessionId}`, {
          method: 'GET',
          headers: { 'x-forwarded-for': '192.168.1.1' },
        });
        await GET(request, { params: { uuid: validSessionId } });
      }

      // Next request should be rate limited
      const request = new NextRequest(`http://localhost:3000/api/sessions/${validSessionId}`, {
        method: 'GET',
        headers: { 'x-forwarded-for': '192.168.1.1' },
      });

      const response = await GET(request, { params: { uuid: validSessionId } });
      const responseData = await response.json() as SessionSharingError;

      expect(response.status).toBe(429);
      expect(responseData.error).toBe('Rate limit exceeded');
      expect(response.headers.get('Retry-After')).toBeTruthy();
    });
  });

  describe('Security headers', () => {
    it('should include security headers in all responses', async () => {
      (head as jest.Mock).mockResolvedValue({});
      mockFetch.mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(JSON.stringify(mockStoredSession)),
      });

      const request = new NextRequest(`http://localhost:3000/api/sessions/${validSessionId}`, {
        method: 'GET',
        headers: { 'x-forwarded-for': '192.168.1.1' },
      });

      const response = await GET(request, { params: { uuid: validSessionId } });

      expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');
      expect(response.headers.get('X-Frame-Options')).toBe('DENY');
      expect(response.headers.get('X-XSS-Protection')).toBe('1; mode=block');
    });
  });

  describe('Unsupported HTTP methods', () => {
    it('should return 405 for POST requests', async () => {
      const { POST } = await import('../route');
      const response = await POST();
      const responseData = await response.json() as SessionSharingError;

      expect(response.status).toBe(405);
      expect(responseData.error).toBe('Method not allowed');
      expect(response.headers.get('Allow')).toBe('GET');
    });
  });
});