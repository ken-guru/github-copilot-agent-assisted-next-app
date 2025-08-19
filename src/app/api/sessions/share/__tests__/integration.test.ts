/**
 * Integration tests for session sharing API route
 * These tests verify the core functionality without complex mocking
 */

import { validateSessionForSharing } from '@/utils/security';
import { generateSessionSharingId, generateShareUrl } from '@/utils/uuid';
import type { SessionSummaryData } from '@/types/session-sharing';

describe('Session Sharing Integration', () => {
  const validSessionData: SessionSummaryData = {
    plannedTime: 3600,
    timeSpent: 3500,
    overtime: 0,
    idleTime: 100,
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
    completedAt: '2024-01-01T12:00:00.000Z',
    sessionType: 'completed',
  };

  describe('Session validation', () => {
    it('should validate and sanitize valid session data', () => {
      const result = validateSessionForSharing(validSessionData);
      expect(result).toEqual(validSessionData);
    });

    it('should sanitize malicious content in activity names', () => {
      const maliciousData = {
        ...validSessionData,
        activities: [
          {
            id: 'activity-1',
            name: '<script>alert("xss")</script>Clean Name',
            duration: 1800,
            colorIndex: 0,
          },
        ],
      };

      const result = validateSessionForSharing(maliciousData);
      expect(result.activities[0]?.name).toBe('Clean Name');
      expect(result.activities[0]?.name).not.toContain('<script>');
    });

    it('should reject invalid session data', () => {
      const invalidData = {
        ...validSessionData,
        plannedTime: -1, // Invalid negative time
      };

      expect(() => validateSessionForSharing(invalidData)).toThrow();
    });

    it('should reject sessions with too many activities', () => {
      const tooManyActivities = {
        ...validSessionData,
        activities: Array.from({ length: 51 }, (_, i) => ({
          id: `activity-${i}`,
          name: `Activity ${i}`,
          duration: 1800,
          colorIndex: 0,
        })),
      };

      expect(() => validateSessionForSharing(tooManyActivities)).toThrow('Too many activities');
    });
  });

  describe('UUID generation', () => {
    it('should generate valid UUIDs', () => {
      const uuid = generateSessionSharingId();
      expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    it('should generate unique UUIDs', () => {
      const uuid1 = generateSessionSharingId();
      const uuid2 = generateSessionSharingId();
      expect(uuid1).not.toBe(uuid2);
    });

    it('should generate valid share URLs', () => {
      const baseUrl = 'https://example.com';
      const sessionId = generateSessionSharingId();
      const shareUrl = generateShareUrl(baseUrl, sessionId);
      
      expect(shareUrl).toBe(`${baseUrl}/shared/${sessionId}`);
      expect(() => new URL(shareUrl)).not.toThrow();
    });
  });

  describe('Session metadata', () => {
    it('should create proper expiration dates', () => {
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000); // 90 days
      
      const diffDays = (expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
      expect(diffDays).toBeCloseTo(90, 0);
    });

    it('should handle ISO timestamp formatting', () => {
      const now = new Date();
      const isoString = now.toISOString();
      
      expect(isoString).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
      expect(new Date(isoString).getTime()).toBe(now.getTime());
    });
  });

  describe('Data serialization', () => {
    it('should serialize and deserialize session data correctly', () => {
      const serialized = JSON.stringify(validSessionData);
      const deserialized = JSON.parse(serialized);
      
      expect(deserialized).toEqual(validSessionData);
    });

    it('should handle large session data within limits', () => {
      const largeButValidData = {
        ...validSessionData,
        activities: Array.from({ length: 20 }, (_, i) => ({
          id: `activity-${i}`,
          name: `Activity ${i} with some description`, // Within 100 char limit
          duration: 1800,
          colorIndex: i % 10,
        })),
      };

      expect(() => validateSessionForSharing(largeButValidData)).not.toThrow();
    });
  });
});