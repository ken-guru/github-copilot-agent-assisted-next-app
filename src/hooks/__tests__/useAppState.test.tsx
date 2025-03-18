// filepath: /Users/ken/Workspace/ken-guru/github-copilot-agent-assisted-next-app/src/hooks/__tests__/useAppState.test.tsx
import { renderHook, act } from '@testing-library/react';
import { useAppState } from '../useAppState';

describe('useAppState', () => {
  const waitForStateUpdate = () => act(() => new Promise(resolve => setTimeout(resolve, 0)));

  describe('Initial State', () => {
    it('should initialize in the SETUP state', () => {
      const { result } = renderHook(() => useAppState());
      expect(result.current.currentState).toBe('SETUP');
      expect(result.current.isSetupState).toBe(true);
      expect(result.current.isPlanningState).toBe(false);
      expect(result.current.isActivityState).toBe(false);
      expect(result.current.isCompletedState).toBe(false);
    });
  });

  describe('State Transitions', () => {
    it('should transition from SETUP to PLANNING', async () => {
      const { result } = renderHook(() => useAppState());
      
      act(() => {
        result.current.moveToPlanning();
      });
      await waitForStateUpdate();
      
      expect(result.current.currentState).toBe('PLANNING');
      expect(result.current.isSetupState).toBe(false);
      expect(result.current.isPlanningState).toBe(true);
      expect(result.current.isActivityState).toBe(false);
      expect(result.current.isCompletedState).toBe(false);
    });
    
    it('should transition from PLANNING to ACTIVITY', async () => {
      const { result } = renderHook(() => useAppState());
      
      act(() => {
        result.current.moveToPlanning();
      });
      await waitForStateUpdate();
      
      act(() => {
        result.current.moveToActivity();
      });
      await waitForStateUpdate();
      
      expect(result.current.currentState).toBe('ACTIVITY');
      expect(result.current.isSetupState).toBe(false);
      expect(result.current.isPlanningState).toBe(false);
      expect(result.current.isActivityState).toBe(true);
      expect(result.current.isCompletedState).toBe(false);
    });
    
    it('should transition from ACTIVITY to COMPLETED', async () => {
      const { result } = renderHook(() => useAppState());
      
      act(() => {
        result.current.moveToPlanning();
      });
      await waitForStateUpdate();
      
      act(() => {
        result.current.moveToActivity();
      });
      await waitForStateUpdate();
      
      act(() => {
        result.current.moveToCompleted();
      });
      await waitForStateUpdate();
      
      expect(result.current.currentState).toBe('COMPLETED');
      expect(result.current.isSetupState).toBe(false);
      expect(result.current.isPlanningState).toBe(false);
      expect(result.current.isActivityState).toBe(false);
      expect(result.current.isCompletedState).toBe(true);
    });
    
    it('should reset from COMPLETED to SETUP', async () => {
      const { result } = renderHook(() => useAppState());
      
      // Move through all states
      act(() => {
        result.current.moveToPlanning();
      });
      await waitForStateUpdate();
      
      act(() => {
        result.current.moveToActivity();
      });
      await waitForStateUpdate();
      
      act(() => {
        result.current.moveToCompleted();
      });
      await waitForStateUpdate();
      
      act(() => {
        result.current.reset();
      });
      await waitForStateUpdate();
      
      expect(result.current.currentState).toBe('SETUP');
      expect(result.current.isSetupState).toBe(true);
      expect(result.current.isPlanningState).toBe(false);
      expect(result.current.isActivityState).toBe(false);
      expect(result.current.isCompletedState).toBe(false);
    });
  });

  describe('Invalid Transitions', () => {
    it('should not allow direct transition from SETUP to ACTIVITY', async () => {
      const { result } = renderHook(() => useAppState());
      
      expect(() => {
        act(() => {
          result.current.moveToActivity();
        });
      }).toThrow();
      
      // State should remain SETUP
      expect(result.current.currentState).toBe('SETUP');
      expect(result.current.isSetupState).toBe(true);
    });
    
    it('should not allow direct transition from SETUP to COMPLETED', async () => {
      const { result } = renderHook(() => useAppState());
      
      expect(() => {
        act(() => {
          result.current.moveToCompleted();
        });
      }).toThrow();
      
      // State should remain SETUP
      expect(result.current.currentState).toBe('SETUP');
      expect(result.current.isSetupState).toBe(true);
    });
    
    it('should not allow direct transition from PLANNING to COMPLETED', async () => {
      const { result } = renderHook(() => useAppState());
      
      act(() => {
        result.current.moveToPlanning();
      });
      await waitForStateUpdate();
      
      expect(() => {
        act(() => {
          result.current.moveToCompleted();
        });
      }).toThrow();
      
      // State should remain PLANNING
      expect(result.current.currentState).toBe('PLANNING');
      expect(result.current.isPlanningState).toBe(true);
    });
    
    it('should not allow reset from states other than COMPLETED', async () => {
      const { result } = renderHook(() => useAppState());
      
      // Cannot reset from SETUP
      expect(() => {
        act(() => {
          result.current.reset();
        });
      }).toThrow();
      
      // Move to PLANNING
      act(() => {
        result.current.moveToPlanning();
      });
      await waitForStateUpdate();
      
      // Cannot reset from PLANNING
      expect(() => {
        act(() => {
          result.current.reset();
        });
      }).toThrow();
      
      // Move to ACTIVITY
      act(() => {
        result.current.moveToActivity();
      });
      await waitForStateUpdate();
      
      // Cannot reset from ACTIVITY
      expect(() => {
        act(() => {
          result.current.reset();
        });
      }).toThrow();
      
      // Move to COMPLETED
      act(() => {
        result.current.moveToCompleted();
      });
      await waitForStateUpdate();
      
      // Can reset from COMPLETED
      expect(() => {
        act(() => {
          result.current.reset();
        });
      }).not.toThrow();
    });
  });
  
  describe('Timer Integration', () => {
    it('should call onTimerStart callback when moving to ACTIVITY state', async () => {
      const onTimerStart = jest.fn();
      const { result } = renderHook(() => useAppState({ onTimerStart }));
      
      // Timer shouldn't start yet
      expect(onTimerStart).not.toHaveBeenCalled();
      
      // Move to PLANNING
      act(() => {
        result.current.moveToPlanning();
      });
      await waitForStateUpdate();
      
      // Timer still shouldn't start
      expect(onTimerStart).not.toHaveBeenCalled();
      
      // Move to ACTIVITY
      act(() => {
        result.current.moveToActivity();
      });
      await waitForStateUpdate();
      
      // Timer should now start
      expect(onTimerStart).toHaveBeenCalledTimes(1);
    });
  });
});