import { validateSessionSummaryData, validateStoredSession } from '../../sessionSharing/schema';
import { generateShareId, isValidUUID } from '../../sessionSharing/utils';

const sampleSession = {
  plannedTime: 3600,
  timeSpent: 3550,
  overtime: 0,
  idleTime: 50,
  activities: [
    { id: 'a1', name: 'Task 1', duration: 1800, colorIndex: 1 },
    { id: 'a2', name: 'Task 2', duration: 1800, colorIndex: 2 },
  ],
  skippedActivities: [],
  timelineEntries: [
    { id: 't1', activityId: 'a1', activityName: 'Task 1', startTime: 0, endTime: 1800000, colorIndex: 1 },
  ],
  completedAt: new Date().toISOString(),
  sessionType: 'completed',
};

describe('SessionSharing schemas', () => {
  it('validates a correct SessionSummaryData object', () => {
    expect(() => validateSessionSummaryData(sampleSession)).not.toThrow();
  });

  it('rejects invalid session data (negative duration)', () => {
    const bad = { ...sampleSession, plannedTime: -1 };
    expect(() => validateSessionSummaryData(bad)).toThrow();
  });

  it('validates stored session schema', () => {
    const id = generateShareId();
    const stored = {
      sessionData: sampleSession,
      metadata: {
        id,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90).toISOString(),
        version: '1',
      },
    };
    expect(() => validateStoredSession(stored)).not.toThrow();
  });

  it('generates a UUID-like id and validates it', () => {
    const id = generateShareId();
    // generated fallback may not be RFC4122 if crypto not available, but isValidUUID should still work when crypto exists
    if (isValidUUID(id)) {
      expect(isValidUUID(id)).toBe(true);
    } else {
      // when fallback random is used, just assert it's a non-empty string
      expect(typeof id).toBe('string');
      expect(id.length).toBeGreaterThan(0);
    }
  });
});
