import React from 'react';
import { renderHook } from '@testing-library/react';
import { useActivityModificationGuard, createGuardedOperation } from '../useActivityModificationGuard';
import { useSessionPersistence } from '../useSessionPersistence';
import { ActivityModificationWarningModalRef } from '../../components/ActivityModificationWarningModal';

// Mock the session persistence hook
jest.mock('../useSessionPersistence');
const mockUseSessionPersistence = useSessionPersistence as jest.MockedFunction<typeof useSessionPersistence>;

describe('useActivityModificationGuard', () => {
  let mockWarningModalRef: React.RefObject<ActivityModificationWarningModalRef>;
  let mockCheckRecoverableSession: jest.Mock;
  let mockClearSession: jest.Mock;
  let mockShowModal: jest.Mock;
  let mockHideModal: jest.Mock;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Create mock modal ref
    mockShowModal = jest.fn();
    mockHideModal = jest.fn();
    mockWarningModalRef = {
      current: {
        showModal: mockShowModal,
        hideModal: mockHideModal
      }
    };

    // Create mock session persistence functions
    mockCheckRecoverableSession = jest.fn();
    mockClearSession = jest.fn();

    // Mock the session persistence hook
    mockUseSessionPersistence.mockReturnValue({
      checkRecoverableSession: mockCheckRecoverableSession,
      clearSession: mockClearSession,
      isPersistenceAvailable: true,
      storageType: 'IndexedDB',
      saveSession: jest.fn(),
      loadSessionForRecovery: jest.fn(),
      isAutoSaveActive: false,
      lastSaveTime: null
    });
  });

  describe('Initialization', () => {
    it('should initialize with correct default options', () => {
      const { result } = renderHook(() =>
        useActivityModificationGuard({
          warningModalRef: mockWarningModalRef
        })
      );

      expect(result.current).toEqual({
        guardedExecute: expect.any(Function),
        hasRecoverableSession: expect.any(Function),
        clearRecoverableSession: expect.any(Function)
      });
    });

    it('should accept custom options', () => {
      const customShouldWarn = jest.fn().mockResolvedValue(true);
      
      const { result } = renderHook(() =>
        useActivityModificationGuard({
          warningModalRef: mockWarningModalRef,
          enableWarnings: false,
          shouldWarn: customShouldWarn
        })
      );

      expect(result.current).toBeDefined();
    });
  });

  describe('hasRecoverableSession', () => {
    it('should return true when recoverable session exists', async () => {
      mockCheckRecoverableSession.mockResolvedValue({
        hasRecoverableSession: true,
        session: { id: 'test-session' }
      });

      const { result } = renderHook(() =>
        useActivityModificationGuard({
          warningModalRef: mockWarningModalRef
        })
      );

      const hasRecoverable = await result.current.hasRecoverableSession();
      expect(hasRecoverable).toBe(true);
      expect(mockCheckRecoverableSession).toHaveBeenCalledTimes(1);
    });

    it('should return false when no recoverable session exists', async () => {
      mockCheckRecoverableSession.mockResolvedValue({
        hasRecoverableSession: false
      });

      const { result } = renderHook(() =>
        useActivityModificationGuard({
          warningModalRef: mockWarningModalRef
        })
      );

      const hasRecoverable = await result.current.hasRecoverableSession();
      expect(hasRecoverable).toBe(false);
    });

    it('should use custom shouldWarn function when provided', async () => {
      const customShouldWarn = jest.fn().mockResolvedValue(true);
      
      const { result } = renderHook(() =>
        useActivityModificationGuard({
          warningModalRef: mockWarningModalRef,
          shouldWarn: customShouldWarn
        })
      );

      const hasRecoverable = await result.current.hasRecoverableSession();
      expect(hasRecoverable).toBe(true);
      expect(customShouldWarn).toHaveBeenCalledTimes(1);
      expect(mockCheckRecoverableSession).not.toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      mockCheckRecoverableSession.mockRejectedValue(new Error('Session check failed'));
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const { result } = renderHook(() =>
        useActivityModificationGuard({
          warningModalRef: mockWarningModalRef
        })
      );

      const hasRecoverable = await result.current.hasRecoverableSession();
      expect(hasRecoverable).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith('Failed to check recoverable session:', expect.any(Error));
      
      consoleSpy.mockRestore();
    });
  });

  describe('clearRecoverableSession', () => {
    it('should clear session successfully', async () => {
      mockClearSession.mockResolvedValue(undefined);

      const { result } = renderHook(() =>
        useActivityModificationGuard({
          warningModalRef: mockWarningModalRef
        })
      );

      await result.current.clearRecoverableSession();
      expect(mockClearSession).toHaveBeenCalledTimes(1);
    });

    it('should handle clear errors gracefully', async () => {
      mockClearSession.mockRejectedValue(new Error('Clear failed'));
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const { result } = renderHook(() =>
        useActivityModificationGuard({
          warningModalRef: mockWarningModalRef
        })
      );

      await expect(result.current.clearRecoverableSession()).resolves.toBeUndefined();
      expect(consoleSpy).toHaveBeenCalledWith('Failed to clear recoverable session:', expect.any(Error));
      
      consoleSpy.mockRestore();
    });
  });

  describe('guardedExecute', () => {
    describe('When warnings are disabled', () => {
      it('should execute operation directly without warning', async () => {
        const mockOperation = jest.fn().mockResolvedValue(undefined);
        const mockOnSuccess = jest.fn();

        const { result } = renderHook(() =>
          useActivityModificationGuard({
            warningModalRef: mockWarningModalRef,
            enableWarnings: false
          })
        );

        const success = await result.current.guardedExecute({
          operationType: 'create',
          operation: mockOperation,
          onSuccess: mockOnSuccess
        });

        expect(success).toBe(true);
        expect(mockOperation).toHaveBeenCalledTimes(1);
        expect(mockOnSuccess).toHaveBeenCalledTimes(1);
        expect(mockShowModal).not.toHaveBeenCalled();
        expect(mockClearSession).toHaveBeenCalledTimes(1);
      });
    });

    describe('When no recoverable session exists', () => {
      it('should execute operation directly without warning', async () => {
        mockCheckRecoverableSession.mockResolvedValue({
          hasRecoverableSession: false
        });

        const mockOperation = jest.fn().mockResolvedValue(undefined);
        const mockOnSuccess = jest.fn();

        const { result } = renderHook(() =>
          useActivityModificationGuard({
            warningModalRef: mockWarningModalRef
          })
        );

        const success = await result.current.guardedExecute({
          operationType: 'edit',
          operation: mockOperation,
          onSuccess: mockOnSuccess
        });

        expect(success).toBe(true);
        expect(mockOperation).toHaveBeenCalledTimes(1);
        expect(mockOnSuccess).toHaveBeenCalledTimes(1);
        expect(mockShowModal).not.toHaveBeenCalled();
      });
    });

    describe('When recoverable session exists', () => {
      beforeEach(() => {
        mockCheckRecoverableSession.mockResolvedValue({
          hasRecoverableSession: true,
          session: { id: 'test-session' }
        });
      });

      it('should show warning and execute on user confirmation', async () => {
        mockShowModal.mockResolvedValue(true);
        
        const mockOperation = jest.fn().mockResolvedValue(undefined);
        const mockOnSuccess = jest.fn();

        const { result } = renderHook(() =>
          useActivityModificationGuard({
            warningModalRef: mockWarningModalRef
          })
        );

        const success = await result.current.guardedExecute({
          operationType: 'delete',
          operationDescription: 'removing activities',
          operation: mockOperation,
          onSuccess: mockOnSuccess
        });

        expect(success).toBe(true);
        expect(mockShowModal).toHaveBeenCalledWith({
          operationType: 'delete',
          operationDescription: 'removing activities'
        });
        expect(mockOperation).toHaveBeenCalledTimes(1);
        expect(mockOnSuccess).toHaveBeenCalledTimes(1);
        expect(mockClearSession).toHaveBeenCalledTimes(1);
      });

      it('should not execute on user cancellation', async () => {
        mockShowModal.mockResolvedValue(false);
        
        const mockOperation = jest.fn();
        const mockOnCancel = jest.fn();

        const { result } = renderHook(() =>
          useActivityModificationGuard({
            warningModalRef: mockWarningModalRef
          })
        );

        const success = await result.current.guardedExecute({
          operationType: 'ai-generate',
          operation: mockOperation,
          onCancel: mockOnCancel
        });

        expect(success).toBe(false);
        expect(mockShowModal).toHaveBeenCalledWith({
          operationType: 'ai-generate',
          operationDescription: undefined
        });
        expect(mockOperation).not.toHaveBeenCalled();
        expect(mockOnCancel).toHaveBeenCalledTimes(1);
        expect(mockClearSession).not.toHaveBeenCalled();
      });

      it('should handle missing modal ref gracefully', async () => {
        const mockOperation = jest.fn().mockResolvedValue(undefined);
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

        const nullModalRef = React.createRef<ActivityModificationWarningModalRef>();
        
        const { result } = renderHook(() =>
          useActivityModificationGuard({
            warningModalRef: nullModalRef
          })
        );

        const success = await result.current.guardedExecute({
          operationType: 'create',
          operation: mockOperation
        });

        expect(success).toBe(true);
        expect(consoleSpy).toHaveBeenCalledWith('Warning modal ref not available');
        expect(mockOperation).toHaveBeenCalledTimes(1);
        expect(mockClearSession).toHaveBeenCalledTimes(1);
        
        consoleSpy.mockRestore();
      });
    });

    describe('Error handling', () => {
      it('should handle operation errors', async () => {
        mockCheckRecoverableSession.mockResolvedValue({
          hasRecoverableSession: false
        });

        const operationError = new Error('Operation failed');
        const mockOperation = jest.fn().mockRejectedValue(operationError);
        const mockOnError = jest.fn();
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

        const { result } = renderHook(() =>
          useActivityModificationGuard({
            warningModalRef: mockWarningModalRef
          })
        );

        const success = await result.current.guardedExecute({
          operationType: 'edit',
          operation: mockOperation,
          onError: mockOnError
        });

        expect(success).toBe(false);
        expect(mockOnError).toHaveBeenCalledWith(operationError);
        expect(consoleSpy).toHaveBeenCalledWith('Failed to execute guarded operation:', operationError);
        
        consoleSpy.mockRestore();
      });

      it('should handle non-Error exceptions', async () => {
        mockCheckRecoverableSession.mockResolvedValue({
          hasRecoverableSession: false
        });

        const mockOperation = jest.fn().mockRejectedValue('String error');
        const mockOnError = jest.fn();
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

        const { result } = renderHook(() =>
          useActivityModificationGuard({
            warningModalRef: mockWarningModalRef
          })
        );

        const success = await result.current.guardedExecute({
          operationType: 'create',
          operation: mockOperation,
          onError: mockOnError
        });

        expect(success).toBe(false);
        expect(mockOnError).toHaveBeenCalledWith(expect.any(Error));
        expect(consoleSpy).toHaveBeenCalled();
        
        consoleSpy.mockRestore();
      });

      it('should prevent multiple concurrent warning modals', async () => {
        mockCheckRecoverableSession.mockResolvedValue({
          hasRecoverableSession: true
        });

        // First call will hang
        mockShowModal.mockImplementation(() => new Promise(() => {}));
        
        const mockOperation = jest.fn();
        const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

        const { result } = renderHook(() =>
          useActivityModificationGuard({
            warningModalRef: mockWarningModalRef
          })
        );

        // Start first operation
        const firstPromise = result.current.guardedExecute({
          operationType: 'create',
          operation: mockOperation
        });

        // Start second operation immediately
        const secondResult = await result.current.guardedExecute({
          operationType: 'edit',
          operation: mockOperation
        });

        expect(secondResult).toBe(false);
        expect(consoleWarnSpy).toHaveBeenCalledWith('Activity modification guard already showing warning modal');
        
        consoleWarnSpy.mockRestore();
        
        // Clean up hanging promise by resolving it
        mockShowModal.mockResolvedValue(false);
        await firstPromise;
      });
    });
  });

  describe('createGuardedOperation utility', () => {
    it('should create a valid guarded operation object', () => {
      const mockOperation = jest.fn();
      
      const guardedOp = createGuardedOperation(
        'create',
        mockOperation,
        'test operation'
      );

      expect(guardedOp).toEqual({
        operationType: 'create',
        operation: mockOperation,
        operationDescription: 'test operation'
      });
    });

    it('should create operation without description', () => {
      const mockOperation = jest.fn();
      
      const guardedOp = createGuardedOperation('delete', mockOperation);

      expect(guardedOp).toEqual({
        operationType: 'delete',
        operation: mockOperation,
        operationDescription: undefined
      });
    });
  });
});
