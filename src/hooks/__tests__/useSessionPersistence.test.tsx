/**
 * Tests for useSessionPersistence hook
 */

import { renderHook, act } from '@testing-library/react';
import { useSessionPersistence, CurrentSessionState } from '../useSessionPersistence';
import { PersistedSession } from '@/types';
import * as sessionStorageModule from '@/utils/sessionStorage';

// Mock the sessionStorage module
jest.mock('@/utils/sessionStorage');

const mockCreateSessionStorage = sessionStorageModule.createSessionStorage as jest.MockedFunction<typeof sessionStorageModule.createSessionStorage>;
const mockSessionStorageUtils = sessionStorageModule.sessionStorageUtils as jest.Mocked<typeof sessionStorageModule.sessionStorageUtils>;

// Create mock session state
const createMockSessionState = (overrides: Partial<CurrentSessionState> = {}): CurrentSessionState => ({
  timeSet: true,
  totalDuration: 1800, // 30 minutes
  elapsedTime: 900, // 15 minutes
  timerActive: true,
  currentActivity: {
    id: 'activity-1',
    name: 'Test Activity',
    colorIndex: 0,
    createdAt: '2023-01-01T12:00:00.000Z',
    isActive: true
  },
  timelineEntries: [
    {
      id: 'entry-1',
      activityId: 'activity-1',
      activityName: 'Test Activity',
      startTime: Date.now() - 900000, // 15 minutes ago
      endTime: null
    }
  ],
  completedActivityIds: [],
  removedActivityIds: [],
  activities: [
    {
      id: 'activity-1',
      name: 'Test Activity',
      colorIndex: 0,
      createdAt: '2023-01-01T12:00:00.000Z',
      isActive: true
    }
  ],
  activityStates: [
    {
      id: 'activity-1',
      state: 'RUNNING',
      startedAt: Date.now() - 900000
    }
  ],
  ...overrides
});

describe('useSessionPersistence', () => {
  let mockStorage: {
    saveSession: jest.Mock;
    loadSession: jest.Mock;
    clearSession: jest.Mock;
    isAvailable: jest.Mock;
    getStorageType: jest.Mock;
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Reset timers
    jest.useFakeTimers();

    // Create mock storage
    mockStorage = {
      saveSession: jest.fn().mockResolvedValue(undefined),
      loadSession: jest.fn().mockResolvedValue(null),
      clearSession: jest.fn().mockResolvedValue(undefined),
      isAvailable: jest.fn().mockReturnValue(true),
      getStorageType: jest.fn().mockReturnValue('localStorage')
    };

    mockCreateSessionStorage.mockReturnValue(mockStorage);

    // Mock utils
    mockSessionStorageUtils.isSessionRecoverable = jest.fn().mockReturnValue(true);
    mockSessionStorageUtils.formatElapsedTime = jest.fn().mockReturnValue('15:00');
    mockSessionStorageUtils.formatSessionAge = jest.fn().mockReturnValue('5m ago');
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should initialize with correct default values', () => {
    const { result } = renderHook(() => useSessionPersistence(null));

    expect(result.current.isPersistenceAvailable).toBe(true);
    expect(result.current.storageType).toBe('localStorage');
    expect(result.current.isAutoSaveActive).toBe(false);
    expect(result.current.lastSaveTime).toBeNull();
  });

  it('should not start auto-save when timeSet is false', () => {
    const sessionState = createMockSessionState({ timeSet: false });
    const { result } = renderHook(() => useSessionPersistence(sessionState));

    expect(result.current.isAutoSaveActive).toBe(false);
    expect(mockStorage.saveSession).not.toHaveBeenCalled();
  });

  it('should start auto-save when session state is provided and timeSet is true', () => {
    const sessionState = createMockSessionState();
    const { result } = renderHook(() => useSessionPersistence(sessionState));

    expect(result.current.isAutoSaveActive).toBe(true);
  });

  it('should save session automatically on interval', async () => {
    jest.useFakeTimers();
    
    const sessionState: CurrentSessionState = {
      timeSet: true,
      totalDuration: 1800,
      elapsedTime: 900,
      timerActive: true,
      currentActivity: null,
      timelineEntries: [],
      activities: [],
      completedActivityIds: [],
      removedActivityIds: [],
      activityStates: []
    };

    const { result } = renderHook(() => useSessionPersistence(sessionState));

    // Wait for hook to initialize
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Clear any initial save calls
    mockStorage.saveSession.mockClear();

    // Advance timer by 10 seconds to trigger interval
    await act(async () => {
      jest.advanceTimersByTime(10000);
    });

    expect(mockStorage.saveSession).toHaveBeenCalledTimes(1);
    
    jest.useRealTimers();
  });

  it('should save session when state changes', async () => {
    const initialState = createMockSessionState();
    const { result, rerender } = renderHook(
      ({ sessionState }) => useSessionPersistence(sessionState),
      { initialProps: { sessionState: initialState } }
    );

    // Wait for hook to initialize and clear any initial saves
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    mockStorage.saveSession.mockClear();

    // Change state and rerender
    const updatedState = {
      ...initialState,
      elapsedTime: 1200 // Changed from 900
    };

    await act(async () => {
      rerender({ sessionState: updatedState });
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(mockStorage.saveSession).toHaveBeenCalled();
  });

  it('should manually save session', async () => {
    const sessionState = createMockSessionState();
    const { result } = renderHook(() => useSessionPersistence(sessionState));

    // Wait for hook to initialize
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    mockStorage.saveSession.mockClear();

    await act(async () => {
      await result.current.saveSession();
    });

    expect(mockStorage.saveSession).toHaveBeenCalledTimes(1);
    expect(result.current.lastSaveTime).toBeInstanceOf(Date);
  });

  it('should clear session', async () => {
    const sessionState = createMockSessionState();
    const { result } = renderHook(() => useSessionPersistence(sessionState));

    // Wait for hook to initialize
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    await act(async () => {
      await result.current.clearSession();
    });

    expect(mockStorage.clearSession).toHaveBeenCalledTimes(1);
    expect(result.current.lastSaveTime).toBeNull();
  });

  it('should check for recoverable session', async () => {
    const mockSession: PersistedSession = {
      id: 'test-session',
      startTime: '2023-01-01T12:00:00.000Z',
      totalDuration: 1800,
      elapsedTime: 900,
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
      timelineEntries: [],
      activityStates: [],
      lastSaved: new Date().toISOString(),
      version: 1
    };

    mockStorage.loadSession.mockResolvedValue(mockSession);
    
    const { result } = renderHook(() => useSessionPersistence(null));

    // Wait for hook to initialize
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    let recoveryInfo;
    await act(async () => {
      recoveryInfo = await result.current.checkRecoverableSession();
    });

    expect(recoveryInfo.hasRecoverableSession).toBe(true);
    expect(recoveryInfo.session).toBe(mockSession);
    expect(recoveryInfo.currentActivityName).toBe('Test Activity');
  });

  it('should return no recoverable session when none exists', async () => {
    mockStorage.loadSession.mockResolvedValue(null);
    
    const { result } = renderHook(() => useSessionPersistence(null));

    let recoveryInfo;
    await act(async () => {
      recoveryInfo = await result.current.checkRecoverableSession();
    });

    expect(recoveryInfo.hasRecoverableSession).toBe(false);
  });

  it('should clear old sessions outside recovery window', async () => {
    const oldSession: PersistedSession = {
      id: 'old-session',
      startTime: '2023-01-01T12:00:00.000Z',
      totalDuration: 1800,
      elapsedTime: 900,
      currentActivityId: null,
      timerActive: false,
      activities: [],
      completedActivityIds: [],
      removedActivityIds: [],
      timelineEntries: [],
      activityStates: [],
      lastSaved: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
      version: 1
    };

    mockStorage.loadSession.mockResolvedValue(oldSession);
    mockSessionStorageUtils.isSessionRecoverable.mockReturnValue(false);
    
    const { result } = renderHook(() => useSessionPersistence(null));

    let recoveryInfo;
    await act(async () => {
      recoveryInfo = await result.current.checkRecoverableSession();
    });

    expect(recoveryInfo.hasRecoverableSession).toBe(false);
    expect(mockStorage.clearSession).toHaveBeenCalled();
  });

  it('should handle storage errors gracefully', async () => {
    mockStorage.saveSession.mockRejectedValue(new Error('Storage full'));
    
    const sessionState = createMockSessionState();
    const { result } = renderHook(() => useSessionPersistence(sessionState));

    // Should not throw
    await act(async () => {
      await result.current.saveSession();
    });

    expect(result.current.lastSaveTime).toBeNull(); // Should not update on error
  });

  it('should not save when storage is not available', async () => {
    mockStorage.isAvailable.mockReturnValue(false);
    
    const sessionState = createMockSessionState();
    const { result } = renderHook(() => useSessionPersistence(sessionState));

    await act(async () => {
      await result.current.saveSession();
    });

    expect(mockStorage.saveSession).not.toHaveBeenCalled();
    expect(result.current.isPersistenceAvailable).toBe(false);
  });

  it('should cleanup timers on unmount', () => {
    const sessionState = createMockSessionState();
    const { unmount } = renderHook(() => useSessionPersistence(sessionState));

    const clearIntervalSpy = jest.spyOn(global, 'clearInterval');

    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();
  });
});
