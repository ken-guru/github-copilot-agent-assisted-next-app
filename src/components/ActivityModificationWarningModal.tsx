import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { Modal, Button } from 'react-bootstrap';

interface ActivityModificationWarningModalProps {
  operationType?: 'create' | 'edit' | 'delete' | 'ai-generate';
  operationDescription?: string;
}

export interface ActivityModificationWarningModalRef {
  showModal: (options?: { 
    operationType?: 'create' | 'edit' | 'delete' | 'ai-generate';
    operationDescription?: string;
  }) => Promise<boolean>;
  hideModal: () => void;
}

interface ModalState {
  isVisible: boolean;
  operationType: 'create' | 'edit' | 'delete' | 'ai-generate';
  operationDescription: string;
  resolve?: (confirmed: boolean) => void;
}

const ActivityModificationWarningModal = forwardRef<
  ActivityModificationWarningModalRef,
  ActivityModificationWarningModalProps
>(({ operationType = 'edit', operationDescription }, ref) => {
  const [modalState, setModalState] = React.useState<ModalState>({
    isVisible: false,
    operationType,
    operationDescription: operationDescription || '',
    resolve: undefined
  });

  const modalRef = useRef<HTMLDivElement>(null);

  const showModal = React.useCallback((options?: { 
    operationType?: 'create' | 'edit' | 'delete' | 'ai-generate';
    operationDescription?: string;
  }) => {
    return new Promise<boolean>((resolve) => {
      const finalOperationType = options?.operationType || operationType;
      const finalDescription = options?.operationDescription || 
        operationDescription || 
        getDefaultDescription(finalOperationType);

      setModalState({
        isVisible: true,
        operationType: finalOperationType,
        operationDescription: finalDescription,
        resolve
      });
    });
  }, [operationType, operationDescription]);

  const hideModal = React.useCallback(() => {
    setModalState(prev => ({
      ...prev,
      isVisible: false
    }));
    
    // Wait for modal hide animation to complete before resolving
    setTimeout(() => {
      if (modalState.resolve) {
        modalState.resolve(false);
      }
      setModalState(prev => ({
        ...prev,
        resolve: undefined
      }));
    }, 300);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleConfirm = React.useCallback(() => {
    if (modalState.resolve) {
      modalState.resolve(true);
    }
    setModalState(prev => ({
      ...prev,
      resolve: undefined
    }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCancel = React.useCallback(() => {
    if (modalState.resolve) {
      modalState.resolve(false);
    }
    setModalState(prev => ({
      ...prev,
      resolve: undefined
    }));
  // eslint-disable-next-line react-hooks/exhaustive-deps  
  }, []);

  useImperativeHandle(ref, () => ({
    showModal,
    hideModal
  }), [showModal, hideModal]);

  const getDefaultDescription = (type: 'create' | 'edit' | 'delete' | 'ai-generate'): string => {
    switch (type) {
      case 'create':
        return 'adding new activities';
      case 'edit':
        return 'editing activities';
      case 'delete':
        return 'deleting activities';
      case 'ai-generate':
        return 'generating AI activities';
      default:
        return 'modifying activities';
    }
  };

  const getModalTitle = (type: 'create' | 'edit' | 'delete' | 'ai-generate'): string => {
    switch (type) {
      case 'create':
        return 'Confirm Activity Creation';
      case 'edit':
        return 'Confirm Activity Edit';
      case 'delete':
        return 'Confirm Activity Deletion';
      case 'ai-generate':
        return 'Confirm AI Activity Generation';
      default:
        return 'Confirm Activity Modification';
    }
  };

  const getWarningIcon = (type: 'create' | 'edit' | 'delete' | 'ai-generate'): string => {
    switch (type) {
      case 'delete':
        return 'bi-trash';
      case 'ai-generate':
        return 'bi-stars';
      case 'create':
        return 'bi-plus-circle';
      case 'edit':
        return 'bi-pencil';
      default:
        return 'bi-exclamation-triangle';
    }
  };

  const getConfirmButtonVariant = (type: 'create' | 'edit' | 'delete' | 'ai-generate'): string => {
    switch (type) {
      case 'delete':
        return 'danger';
      case 'ai-generate':
        return 'primary';
      case 'create':
      case 'edit':
        return 'warning';
      default:
        return 'warning';
    }
  };

  const getConfirmButtonText = (type: 'create' | 'edit' | 'delete' | 'ai-generate'): string => {
    switch (type) {
      case 'create':
        return 'Continue Adding';
      case 'edit':
        return 'Continue Editing';
      case 'delete':
        return 'Continue Deleting';
      case 'ai-generate':
        return 'Continue with AI';
      default:
        return 'Continue';
    }
  };

  return (
    <Modal
      show={modalState.isVisible}
      onHide={handleCancel}
      centered
      backdrop="static"
      keyboard={false}
      ref={modalRef}
      data-testid="activity-modification-warning-modal"
    >
      <Modal.Header>
        <Modal.Title className="d-flex align-items-center">
          <i 
            className={`${getWarningIcon(modalState.operationType)} text-warning me-2`} 
            aria-hidden="true"
          />
          {getModalTitle(modalState.operationType)}
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        <div className="d-flex align-items-start">
          <i 
            className="bi bi-exclamation-triangle-fill text-warning me-3 mt-1" 
            style={{ fontSize: '1.5rem' }}
            aria-hidden="true"
          />
          <div>
            <p className="mb-3">
              <strong>Warning:</strong> You have a recoverable session that will be lost if you proceed with {modalState.operationDescription}.
            </p>
            <p className="mb-3">
              If you continue, your current session recovery data will be permanently discarded and cannot be restored.
            </p>
            <p className="mb-0 text-body-secondary">
              <strong>Recommendation:</strong> Cancel this action to keep your recoverable session, or proceed if you&apos;re certain you want to start fresh.
            </p>
          </div>
        </div>
      </Modal.Body>
      
      <Modal.Footer>
        <Button 
          variant="outline-secondary" 
          onClick={handleCancel}
          data-testid="activity-modification-warning-cancel"
        >
          Cancel & Keep Session
        </Button>
        <Button 
          variant={getConfirmButtonVariant(modalState.operationType)}
          onClick={handleConfirm}
          data-testid="activity-modification-warning-confirm"
        >
          {getConfirmButtonText(modalState.operationType)}
        </Button>
      </Modal.Footer>
    </Modal>
  );
});

ActivityModificationWarningModal.displayName = 'ActivityModificationWarningModal';

export default ActivityModificationWarningModal;
