/**
 * Session Recovery Modal Component
 * Bootstrap-based modal for session recovery with consistent UX patterns
 */

import React, { useState, useImperativeHandle, forwardRef, useCallback } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { SessionRecoveryInfo } from '@/types/session';

export interface SessionRecoveryModalProps {
  /** Recovery information to display */
  recoveryInfo: SessionRecoveryInfo;
  
  /** Callback when user chooses to recover the session */
  onRecover: () => void;
  
  /** Callback when user chooses to start fresh */
  onStartFresh: () => void;
  
  /** Whether recovery is in progress */
  isRecovering?: boolean;
  
  /** Additional CSS classes */
  className?: string;
}

export interface SessionRecoveryModalRef {
  showModal: () => void;
  hideModal: () => void;
}

/**
 * Modal component for session recovery with consistent UX patterns
 */
const SessionRecoveryModal = forwardRef<SessionRecoveryModalRef, SessionRecoveryModalProps>(
  ({ 
    recoveryInfo, 
    onRecover, 
    onStartFresh, 
    isRecovering = false, 
    className = '' 
  }, ref) => {
    const [show, setShow] = useState(false);

    const showModal = useCallback(() => {
      if (recoveryInfo.hasRecoverableSession) {
        setShow(true);
      }
    }, [recoveryInfo.hasRecoverableSession]);

    const hideModal = useCallback(() => {
      setShow(false);
    }, []);

    const handleRecover = useCallback(() => {
      onRecover();
      // Keep modal open while recovering to show loading state
      // Let parent component control when to close
    }, [onRecover]);

    const handleStartFresh = useCallback(() => {
      onStartFresh();
      setShow(false);
    }, [onStartFresh]);

    useImperativeHandle(ref, () => ({
      showModal,
      hideModal
    }));

    // Don't render if no recoverable session
    if (!recoveryInfo.hasRecoverableSession) {
      return null;
    }

    return (
      <Modal
        show={show}
        onHide={handleStartFresh}
        backdrop="static"
        keyboard={!isRecovering}
        centered
        aria-modal="true"
        className={className}
        data-testid="session-recovery-modal"
      >
        <Modal.Header closeButton={!isRecovering}>
          <Modal.Title className="d-flex align-items-center">
            <i className="bi bi-clock-history me-2" aria-hidden="true"></i>
            Session Recovery Available
          </Modal.Title>
        </Modal.Header>
        
        <Modal.Body>
          <div className="mb-3">
            <p className="mb-2">
              {recoveryInfo.description}
            </p>
            
            {recoveryInfo.session && (
              <small className="text-muted">
                <i className="bi bi-calendar-event me-1" aria-hidden="true"></i>
                Last saved: {new Date(recoveryInfo.session.lastSaved).toLocaleString()}
              </small>
            )}
          </div>
          
          <div className="alert alert-info mb-0">
            <i className="bi bi-info-circle me-2" aria-hidden="true"></i>
            <strong>What would you like to do?</strong>
            <ul className="mb-0 mt-2">
              <li><strong>Recover Session:</strong> Restore your previous activities and timer state</li>
              <li><strong>Start Fresh:</strong> Begin a new session (previous data will be cleared)</li>
            </ul>
          </div>
        </Modal.Body>
        
        <Modal.Footer>
          <Button 
            variant="primary" 
            onClick={handleRecover}
            disabled={isRecovering}
            autoFocus
            className="d-flex align-items-center"
            data-testid="recover-session-button"
          >
            {isRecovering ? (
              <>
                <span 
                  className="spinner-border spinner-border-sm me-2" 
                  role="status" 
                  aria-hidden="true"
                ></span>
                Recovering...
              </>
            ) : (
              <>
                <i className="bi bi-arrow-clockwise me-2" aria-hidden="true"></i>
                Recover Session
              </>
            )}
          </Button>
          
          <Button 
            variant="secondary" 
            onClick={handleStartFresh}
            disabled={isRecovering}
            className="d-flex align-items-center"
            data-testid="start-fresh-button"
          >
            <i className="bi bi-plus-circle me-2" aria-hidden="true"></i>
            Start Fresh
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
);

SessionRecoveryModal.displayName = 'SessionRecoveryModal';
export default SessionRecoveryModal;
