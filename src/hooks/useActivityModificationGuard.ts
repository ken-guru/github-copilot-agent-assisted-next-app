/**
 * Hook for protecting activity modifications when recoverable sessions exist
 * Provides a guarded execution pattern that warns users before activity operations
 * that would invalidate session recovery
 */

import { useCallback, useRef } from 'react';
import { useSessionPersistence } from './useSessionPersistence';
import type { ActivityModificationWarningModalRef } from '../components/ActivityModificationWarningModal';

export interface ActivityModificationGuardOptions {
  /**
   * Reference to the activity modification warning modal
   */
  warningModalRef: React.RefObject<ActivityModificationWarningModalRef | null>;
  
  /**
   * Whether to show warnings for activity modifications
   * Can be disabled for testing or if user explicitly opts out
   */
  enableWarnings?: boolean;
  
  /**
   * Custom check for when to show warnings
   * If not provided, defaults to checking for recoverable sessions
   */
  shouldWarn?: () => Promise<boolean>;
}

export interface GuardedOperation {
  /**
   * Type of operation being performed
   */
  operationType: 'create' | 'edit' | 'delete' | 'ai-generate';
  
  /**
   * Human-readable description of the operation
   */
  operationDescription?: string;
  
  /**
   * The operation to execute if user confirms
   */
  operation: () => Promise<void> | void;
  
  /**
   * Optional callback when user cancels the operation
   */
  onCancel?: () => void;
  
  /**
   * Optional callback when operation completes successfully
   */
  onSuccess?: () => void;
  
  /**
   * Optional callback when operation fails
   */
  onError?: (error: Error) => void;
}

export interface UseActivityModificationGuardResult {
  /**
   * Execute an operation with session protection warning if needed
   */
  guardedExecute: (operation: GuardedOperation) => Promise<boolean>;
  
  /**
   * Check if there's a recoverable session (for UI feedback)
   */
  hasRecoverableSession: () => Promise<boolean>;
  
  /**
   * Clear the current session (called after successful operations)
   */
  clearRecoverableSession: () => Promise<void>;
}

/**
 * Hook for protecting activity modifications when recoverable sessions exist
 */
export function useActivityModificationGuard(
  options: ActivityModificationGuardOptions
): UseActivityModificationGuardResult {
  const { warningModalRef, enableWarnings = true, shouldWarn } = options;
  
  // Get session persistence functionality
  const { checkRecoverableSession, clearSession } = useSessionPersistence(null);
  
  // Track if we're currently showing a warning to prevent multiple modals
  const showingWarningRef = useRef(false);

  /**
   * Check if there's a recoverable session
   */
  const hasRecoverableSession = useCallback(async (): Promise<boolean> => {
    try {
      if (shouldWarn) {
        return await shouldWarn();
      }
      
      const recoveryInfo = await checkRecoverableSession();
      return recoveryInfo.hasRecoverableSession;
    } catch (error) {
      console.error('Failed to check recoverable session:', error);
      return false;
    }
  }, [checkRecoverableSession, shouldWarn]);

  /**
   * Clear the recoverable session
   */
  const clearRecoverableSession = useCallback(async (): Promise<void> => {
    try {
      await clearSession();
    } catch (error) {
      console.error('Failed to clear recoverable session:', error);
      // Don't throw here - clearing session is a cleanup operation
    }
  }, [clearSession]);

  /**
   * Execute an operation with protection warning if needed
   */
  const guardedExecute = useCallback(async (operation: GuardedOperation): Promise<boolean> => {
    const { 
      operationType, 
      operationDescription, 
      operation: operationFn, 
      onCancel, 
      onSuccess, 
      onError 
    } = operation;

    try {
      // Check if warnings are enabled and we should warn
      if (!enableWarnings) {
        // No warnings - execute directly
        await operationFn();
        await clearRecoverableSession();
        onSuccess?.();
        return true;
      }

      // Prevent multiple warning modals
      if (showingWarningRef.current) {
        console.warn('Activity modification guard already showing warning modal');
        return false;
      }

      // Check if we need to warn the user
      const shouldShowWarning = await hasRecoverableSession();
      
      if (!shouldShowWarning) {
        // No recoverable session - execute directly
        await operationFn();
        onSuccess?.();
        return true;
      }

      // Show warning modal and get user confirmation
      if (!warningModalRef.current) {
        console.error('Warning modal ref not available');
        // Fall back to executing without warning
        await operationFn();
        await clearRecoverableSession();
        onSuccess?.();
        return true;
      }

      showingWarningRef.current = true;
      
      try {
        const userConfirmed = await warningModalRef.current.showModal({
          operationType,
          operationDescription
        });

        if (userConfirmed) {
          // User confirmed - execute operation and clear session
          await operationFn();
          await clearRecoverableSession();
          onSuccess?.();
          return true;
        } else {
          // User cancelled
          onCancel?.();
          return false;
        }
      } finally {
        showingWarningRef.current = false;
      }

    } catch (error) {
      showingWarningRef.current = false;
      const errorObj = error instanceof Error ? error : new Error(String(error));
      console.error('Failed to execute guarded operation:', errorObj);
      onError?.(errorObj);
      return false;
    }
  }, [
    enableWarnings, 
    hasRecoverableSession, 
    clearRecoverableSession, 
    warningModalRef
  ]);

  return {
    guardedExecute,
    hasRecoverableSession,
    clearRecoverableSession
  };
}

/**
 * Utility function to create a simple guarded operation
 */
export function createGuardedOperation(
  operationType: GuardedOperation['operationType'],
  operation: () => Promise<void> | void,
  operationDescription?: string
): Omit<GuardedOperation, 'onCancel' | 'onSuccess' | 'onError'> {
  return {
    operationType,
    operation,
    operationDescription
  };
}

export default useActivityModificationGuard;
