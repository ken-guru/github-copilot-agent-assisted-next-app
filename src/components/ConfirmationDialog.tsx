// Bootstrap Modal migration
import { useState, useImperativeHandle, forwardRef, useCallback } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

export interface ConfirmationDialogProps {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export interface ConfirmationDialogRef {
  showDialog: () => void;
}

const ConfirmationDialog = forwardRef<ConfirmationDialogRef, ConfirmationDialogProps>(
  ({ title = 'Confirm action', message, confirmText = 'Confirm', cancelText = 'Cancel', onConfirm, onCancel }, ref) => {
    const [show, setShow] = useState(false);

    const showDialog = useCallback(() => {
      setShow(true);
    }, []);

    const handleConfirm = useCallback(() => {
      onConfirm();
      setShow(false);
    }, [onConfirm]);

    const handleCancel = useCallback(() => {
      onCancel();
      setShow(false);
    }, [onCancel]);

    useImperativeHandle(ref, () => ({
      showDialog
    }));

    return (
      <Modal
        show={show}
        onHide={handleCancel}
        backdrop="static"
        keyboard
        centered
        aria-modal="true"
        animation={true}
        className="fade"
      >
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{message}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancel} autoFocus>
            {cancelText}
          </Button>
          <Button variant="primary" onClick={handleConfirm}>
            {confirmText}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
);

ConfirmationDialog.displayName = 'ConfirmationDialog';
export default ConfirmationDialog;