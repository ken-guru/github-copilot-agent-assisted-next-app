/**
 * Tests for session storage utilities
 */

import { createSessionStorage, sessionStorageUtils } from '../sessionStorage';
import { PersistedSession, SESSION_PERSISTENCE_VERSION } from '@/types/session';

// Mock indexedDB and localStorage
const mockIndexedDB = {
  open: jest.fn(),
  deleteDatabase: jest.fn(),
};

const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

// Create mock session data
const createMockSession = (overrides: Partial<PersistedSession> = {}): PersistedSession => ({
  id: 'test-session-123',
  startTime: '2023-01-01T12:00:00.000Z',
  totalDuration: 1800, // 30 minutes
  elapsedTime: 900, // 15 minutes
  currentActivityId: 'activity-1',
  timerActive: true,
  activities: [
    {
      id: 'activity-1',
      name: 'Test Activity',
      colorIndex: 0,
      createdAt: '2023-01-01T12:00:00.000Z',
      isActive: true
    }
  ],
  completedActivityIds: [],
  removedActivityIds: [],
  timelineEntries: [
    {
      id: 'entry-1',
      activityId: 'activity-1',
      activityName: 'Test Activity',
      startTime: Date.now() - 900000, // 15 minutes ago
      endTime: null
    }
  ],
  activityStates: [
    {
      id: 'activity-1',
      state: 'RUNNING',
      startedAt: Date.now() - 900000
    }
  ],
  lastSaved: '2023-01-01T12:15:00.000Z',
  version: SESSION_PERSISTENCE_VERSION,
  ...overrides
});

describe('sessionStorageUtils', () => {
  describe('isSessionRecoverable', () => {
    it('should return true for sessions within recovery window', () => {
      const session = createMockSession({
        lastSaved: new Date(Date.now() - 1000 * 60 * 30).toISOString() // 30 minutes ago
      });
      const maxAge = 4 * 60 * 60 * 1000; // 4 hours
      
      expect(sessionStorageUtils.isSessionRecoverable(session, maxAge)).toBe(true);
    });

    it('should return false for sessions outside recovery window', () => {
      const session = createMockSession({
        lastSaved: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() // 5 hours ago
      });
      const maxAge = 4 * 60 * 60 * 1000; // 4 hours
      
      expect(sessionStorageUtils.isSessionRecoverable(session, maxAge)).toBe(false);
    });
  });

  describe('formatSessionAge', () => {
    it('should format session age in minutes for recent sessions', () => {
      const session = createMockSession({
        lastSaved: new Date(Date.now() - 1000 * 60 * 30).toISOString() // 30 minutes ago
      });
      
      const result = sessionStorageUtils.formatSessionAge(session);
      expect(result).toBe('30m ago');
    });

    it('should format session age in hours and minutes for older sessions', () => {
      const session = createMockSession({
        lastSaved: new Date(Date.now() - 1000 * 60 * 90).toISOString() // 90 minutes ago
      });
      
      const result = sessionStorageUtils.formatSessionAge(session);
      expect(result).toBe('1h 30m ago');
    });
  });

  describe('formatElapsedTime', () => {
    it('should format time in MM:SS format for short durations', () => {
      const result = sessionStorageUtils.formatElapsedTime(125); // 2:05
      expect(result).toBe('02:05');
    });

    it('should format time in H:MM:SS format for long durations', () => {
      const result = sessionStorageUtils.formatElapsedTime(3725); // 1:02:05
      expect(result).toBe('62:05');
    });

    it('should handle zero time', () => {
      const result = sessionStorageUtils.formatElapsedTime(0);
      expect(result).toBe('00:00');
    });
  });
});

describe('createSessionStorage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Reset global mocks
    delete (global as Record<string, unknown>).indexedDB;
    delete (global as Record<string, unknown>).localStorage;
  });

  it('should prefer IndexedDB when available', () => {
    // Mock indexedDB availability
    (global as Record<string, unknown>).indexedDB = mockIndexedDB;
    Object.defineProperty(window, 'indexedDB', {
      value: mockIndexedDB,
      writable: true
    });

    const storage = createSessionStorage();
    expect(storage.getStorageType()).toBe('IndexedDB');
    expect(storage.isAvailable()).toBe(true);
  });

  it('should fallback to localStorage when IndexedDB is not available', () => {
    // Mock localStorage availability
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true
    });

    const storage = createSessionStorage();
    expect(storage.getStorageType()).toBe('localStorage');
    expect(storage.isAvailable()).toBe(true);
  });

  it('should return no-op storage when neither is available', () => {
    // Mock storage being unavailable
    const originalLocalStorage = Object.getOwnPropertyDescriptor(window, 'localStorage');
    
    Object.defineProperty(window, 'localStorage', {
      value: undefined,
      writable: true
    });

    const storage = createSessionStorage();
    expect(storage.getStorageType()).toBe('none');
    expect(storage.isAvailable()).toBe(false);

    // Restore original localStorage
    if (originalLocalStorage) {
      Object.defineProperty(window, 'localStorage', originalLocalStorage);
    }
  });
});

// Integration-style tests for localStorage implementation
describe('LocalStorageSessionStorage', () => {
  let mockStorage: { [key: string]: string };

  beforeEach(() => {
    mockStorage = {};
    
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn((key: string) => mockStorage[key] || null),
        setItem: jest.fn((key: string, value: string) => {
          mockStorage[key] = value;
        }),
        removeItem: jest.fn((key: string) => {
          delete mockStorage[key];
        }),
        clear: jest.fn(() => {
          mockStorage = {};
        })
      },
      writable: true
    });
  });

  it('should save and load session data', async () => {
    const storage = createSessionStorage();
    const session = createMockSession();

    await storage.saveSession(session);
    const loaded = await storage.loadSession();

    expect(loaded).toEqual(session);
  });

  it('should return null when no session is saved', async () => {
    const storage = createSessionStorage();
    const loaded = await storage.loadSession();

    expect(loaded).toBeNull();
  });

  it('should clear session data', async () => {
    const storage = createSessionStorage();
    const session = createMockSession();

    await storage.saveSession(session);
    await storage.clearSession();
    
    const loaded = await storage.loadSession();
    expect(loaded).toBeNull();
  });
});
