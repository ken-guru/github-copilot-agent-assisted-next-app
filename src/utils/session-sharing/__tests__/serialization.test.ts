/**
 * Tests for session data serialization utilities
 */

import {
  serializeSessionData,
  deserializeSessionData,
  isSessionExpired,
  sessionToJSON,
  sessionFromJSON,
  SerializationError,
} from '../serialization';
import { SessionSummaryData, StoredSession } from '@/types/session-sharing';

// Mock the UUID generation
jest.mock('@/utils/uuid');
import { generateUUID } from '@/utils/uuid';
const mockGenerateUUID = generateUUID as jest.MockedFunction<typeof generateUUID>;

describe('serializeSessionData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGenerateUUID.mockReturnValue('test-uuid-123');
  });

  const validSessionData: SessionSummaryData = {
    plannedTime: 3600,
    timeSpent: 3000,
    overtime: 0,
    idleTime: 600,
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
        id: 'entry-1',
        activityId: 'activity-1',
        activityName: 'Test Activity',
        startTime: Date.now() - 1800000,
        endTime: Date.now(),
        colorIndex: 0,
      },
    ],
    completedAt: new Date().toISOString(),
    sessionType: 'completed',
  };

  it('should serialize valid session data', () => {
    const result = serializeSessionData(validSessionData);

    expect(result).toEqual({
      sessionData: expect.objectContaining({
        plannedTime: 3600,
        timeSpent: 3000,
        sessionType: 'completed',
      }),
      metadata: {
        id: 'test-uuid-123',
        createdAt: expect.any(String),
        expiresAt: expect.any(String),
        version: '1.0.0',
        userAgent: undefined,
      },
    });

    // Verify timestamps are valid
    expect(new Date(result.metadata.createdAt).toISOString()).toBe(result.metadata.createdAt);
    expect(new Date(result.metadata.expiresAt).toISOString()).toBe(result.metadata.expiresAt);
  });

  it('should include user agent when provided', () => {
    const result = serializeSessionData(validSessionData, {
      userAgent: 'Mozilla/5.0 Test Browser',
    });

    expect(result.metadata.userAgent).toBe('Mozilla/5.0 Test Browser');
  });

  it('should use custom expiration days', () => {
    const result = serializeSessionData(validSessionData, {
      expirationDays: 30,
    });

    const createdAt = new Date(result.metadata.createdAt);
    const expiresAt = new Date(result.metadata.expiresAt);
    const daysDiff = (expiresAt.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24);

    expect(Math.round(daysDiff)).toBe(30);
  });

  it('should throw SerializationError for invalid data', () => {
    const invalidData = {
      ...validSessionData,
      plannedTime: -1, // Invalid negative time
    };

    expect(() => serializeSessionData(invalidData)).toThrow(SerializationError);
  });
});

describe('deserializeSessionData', () => {
  const validStoredSession: StoredSession = {
    sessionData: {
      plannedTime: 3600,
      timeSpent: 3000,
      overtime: 0,
      idleTime: 600,
      activities: [],
      skippedActivities: [],
      timelineEntries: [],
      completedAt: new Date().toISOString(),
      sessionType: 'completed',
    },
    metadata: {
      id: 'test-uuid-123',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      version: '1.0.0',
    },
  };

  it('should deserialize valid stored session', () => {
    const result = deserializeSessionData(validStoredSession);
    expect(result).toEqual(validStoredSession);
  });

  it('should throw SerializationError for null data', () => {
    expect(() => deserializeSessionData(null)).toThrow(SerializationError);
  });

  it('should throw SerializationError for missing sessionData', () => {
    const invalidData = {
      metadata: validStoredSession.metadata,
    };

    expect(() => deserializeSessionData(invalidData)).toThrow(SerializationError);
  });

  it('should throw SerializationError for missing metadata', () => {
    const invalidData = {
      sessionData: validStoredSession.sessionData,
    };

    expect(() => deserializeSessionData(invalidData)).toThrow(SerializationError);
  });

  it('should throw SerializationError for invalid metadata', () => {
    const invalidData = {
      sessionData: validStoredSession.sessionData,
      metadata: {
        id: 'test-uuid-123',
        // Missing required fields
      },
    };

    expect(() => deserializeSessionData(invalidData)).toThrow(SerializationError);
  });
});

describe('isSessionExpired', () => {
  it('should return false for future expiration', () => {
    const metadata = {
      id: 'test-uuid',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
      version: '1.0.0',
    };

    expect(isSessionExpired(metadata)).toBe(false);
  });

  it('should return true for past expiration', () => {
    const metadata = {
      id: 'test-uuid',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      expiresAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
      version: '1.0.0',
    };

    expect(isSessionExpired(metadata)).toBe(true);
  });

  it('should return true for invalid expiration date', () => {
    const metadata = {
      id: 'test-uuid',
      createdAt: new Date().toISOString(),
      expiresAt: 'invalid-date',
      version: '1.0.0',
    };

    expect(isSessionExpired(metadata)).toBe(true);
  });
});

describe('sessionToJSON and sessionFromJSON', () => {
  const validStoredSession: StoredSession = {
    sessionData: {
      plannedTime: 3600,
      timeSpent: 3000,
      overtime: 0,
      idleTime: 600,
      activities: [],
      skippedActivities: [],
      timelineEntries: [],
      completedAt: new Date().toISOString(),
      sessionType: 'completed',
    },
    metadata: {
      id: 'test-uuid-123',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      version: '1.0.0',
    },
  };

  it('should convert session to JSON and back', () => {
    const jsonString = sessionToJSON(validStoredSession);
    expect(typeof jsonString).toBe('string');

    const parsed = sessionFromJSON(jsonString);
    expect(parsed).toEqual(validStoredSession);
  });

  it('should throw SerializationError for invalid JSON', () => {
    expect(() => sessionFromJSON('invalid json')).toThrow(SerializationError);
  });

  it('should throw SerializationError for JSON with invalid session structure', () => {
    const invalidJson = JSON.stringify({ invalid: 'structure' });
    expect(() => sessionFromJSON(invalidJson)).toThrow(SerializationError);
  });

  it('should handle circular references in sessionToJSON', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const circularSession: any = { ...validStoredSession };
    circularSession.circular = circularSession; // Create circular reference

    expect(() => sessionToJSON(circularSession)).toThrow(SerializationError);
  });
});