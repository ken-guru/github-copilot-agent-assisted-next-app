/**
 * Session Recovery Alert Component
 * Bootstrap-based alert for session recovery with user-friendly interface
 */

import React from 'react';
import { Alert, Button } from 'react-bootstrap';
import { SessionRecoveryInfo } from '@/types/session';

export interface SessionRecoveryAlertProps {
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

/**
 * Alert component for session recovery
 */
export function SessionRecoveryAlert({
  recoveryInfo,
  onRecover,
  onStartFresh,
  isRecovering = false,
  className = ''
}: SessionRecoveryAlertProps) {
  if (!recoveryInfo.hasRecoverableSession) {
    return null;
  }

  return (
    <Alert 
      variant="info" 
      className={`mb-3 ${className}`}
      dismissible={false}
    >
      <div className="d-flex justify-content-between align-items-start">
        <div className="flex-grow-1 me-3">
          <Alert.Heading as="h5" className="mb-2">
            <i className="bi bi-clock-history me-2" aria-hidden="true"></i>
            Session Recovery Available
          </Alert.Heading>
          
          <p className="mb-0">
            {recoveryInfo.description}
          </p>
          
          {recoveryInfo.session && (
            <small className="text-muted d-block mt-1">
              Last saved: {new Date(recoveryInfo.session.lastSaved).toLocaleString()}
            </small>
          )}
        </div>
        
        <div className="d-flex gap-2 flex-shrink-0">
          <Button 
            variant="primary" 
            size="sm" 
            onClick={onRecover}
            disabled={isRecovering}
            className="d-flex align-items-center"
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
                <i className="bi bi-arrow-clockwise me-1" aria-hidden="true"></i>
                Recover Session
              </>
            )}
          </Button>
          
          <Button 
            variant="outline-secondary" 
            size="sm" 
            onClick={onStartFresh}
            disabled={isRecovering}
            className="d-flex align-items-center"
          >
            <i className="bi bi-plus-circle me-1" aria-hidden="true"></i>
            Start Fresh
          </Button>
        </div>
      </div>
    </Alert>
  );
}

export default SessionRecoveryAlert;
