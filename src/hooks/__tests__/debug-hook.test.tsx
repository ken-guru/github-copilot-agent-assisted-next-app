/**
 * Debug test for useSessionPersistence hook
 */

import { renderHook } from '@testing-library/react';
import { useSessionPersistence, CurrentSessionState } from '../useSessionPersistence';

// Mock the sessionStorage module
jest.mock('@/utils/sessionStorage', () => ({
  createSessionStorage: jest.fn(() => ({
    saveSession: jest.fn(),
    loadSession: jest.fn(),
    clearSession: jest.fn(),
    isAvailable: jest.fn(() => true),
    getStorageType: jest.fn(() => 'localStorage')
  })),
  sessionStorageUtils: {
    isSessionRecoverable: jest.fn(() => true)
  }
}));

describe('useSessionPersistence debug', () => {
  it('should return hook result with basic session state', () => {
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

    console.log('Hook result:', result.current);
    
    expect(result.current).toBeDefined();
    expect(typeof result.current.saveSession).toBe('function');
    expect(typeof result.current.clearSession).toBe('function');
    expect(typeof result.current.checkRecoverableSession).toBe('function');
  });

  it('should return hook result with null session state', () => {
    const { result } = renderHook(() => useSessionPersistence(null));

    console.log('Hook result with null:', result.current);
    
    expect(result.current).toBeDefined();
    expect(typeof result.current.saveSession).toBe('function');
    expect(typeof result.current.clearSession).toBe('function');
    expect(typeof result.current.checkRecoverableSession).toBe('function');
  });
});
