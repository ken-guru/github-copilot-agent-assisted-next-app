// filepath: /Users/ken/Workspace/ken-guru/github-copilot-agent-assisted-next-app/src/hooks/useAppState.ts
import { useState, useCallback, useEffect } from 'react';
import { AppStateMachine, AppStateType } from '@/utils/appStateMachine';

export interface UseAppStateProps {
  onTimerStart?: () => void;
}

/**
 * Hook for managing application flow state
 * Controls transitions between the 4 main application states:
 * SETUP → PLANNING → ACTIVITY → COMPLETED
 */
export function useAppState({ onTimerStart }: UseAppStateProps = {}) {
  const [stateMachine] = useState(() => new AppStateMachine());
  const [currentState, setCurrentState] = useState<AppStateType>('SETUP');
  
  // Update local state when state machine state changes
  const updateStateFromMachine = useCallback(() => {
    const newState = stateMachine.getCurrentState();
    setCurrentState(newState);
  }, [stateMachine]);

  // Transition to the PLANNING state
  const moveToPlanning = useCallback(() => {
    try {
      stateMachine.moveToPlanning();
      updateStateFromMachine();
    } catch (error) {
      console.error('Failed to move to PLANNING state:', error);
      throw error;
    }
  }, [stateMachine, updateStateFromMachine]);

  // Transition to the ACTIVITY state
  const moveToActivity = useCallback(() => {
    try {
      stateMachine.moveToActivity();
      updateStateFromMachine();
      // Call onTimerStart callback when moving to ACTIVITY state
      onTimerStart?.();
    } catch (error) {
      console.error('Failed to move to ACTIVITY state:', error);
      throw error;
    }
  }, [stateMachine, updateStateFromMachine, onTimerStart]);

  // Transition to the COMPLETED state
  const moveToCompleted = useCallback(() => {
    try {
      stateMachine.moveToCompleted();
      updateStateFromMachine();
    } catch (error) {
      console.error('Failed to move to COMPLETED state:', error);
      throw error;
    }
  }, [stateMachine, updateStateFromMachine]);

  // Reset to the SETUP state (only valid from COMPLETED)
  const reset = useCallback(() => {
    try {
      stateMachine.reset();
      updateStateFromMachine();
    } catch (error) {
      console.error('Failed to reset to SETUP state:', error);
      throw error;
    }
  }, [stateMachine, updateStateFromMachine]);

  // Convenience methods to check current state
  const isSetupState = useCallback(() => stateMachine.isSetup(), [stateMachine]);
  const isPlanningState = useCallback(() => stateMachine.isPlanning(), [stateMachine]);
  const isActivityState = useCallback(() => stateMachine.isActivity(), [stateMachine]);
  const isCompletedState = useCallback(() => stateMachine.isCompleted(), [stateMachine]);

  // Ensure local state is always synced with state machine
  useEffect(() => {
    updateStateFromMachine();
  }, [updateStateFromMachine]);

  return {
    currentState,
    moveToPlanning,
    moveToActivity,
    moveToCompleted,
    reset,
    isSetupState: isSetupState(),
    isPlanningState: isPlanningState(),
    isActivityState: isActivityState(),
    isCompletedState: isCompletedState()
  };
}