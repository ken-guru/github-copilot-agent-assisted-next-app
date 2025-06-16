'use client';
import { useRef, useImperativeHandle, forwardRef, useCallback } from 'react';
import styles from './ConfirmationDialog.module.css';

export interface ConfirmationDialogProps {
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
  ({ message, confirmText = 'Confirm', cancelText = 'Cancel', onConfirm, onCancel }, ref) => {
    const dialogRef = useRef<HTMLDialogElement>(null);

    const showDialog = useCallback(() => {
      dialogRef.current?.showModal();
    }, []);

    const handleConfirm = useCallback(() => {
      onConfirm();
      dialogRef.current?.close();
    }, [onConfirm]);

    const handleCancel = useCallback(() => {
      onCancel();
      dialogRef.current?.close();
    }, [onCancel]);

    useImperativeHandle(ref, () => ({
      showDialog
    }));

    return (
      <dialog 
        ref={dialogRef} 
        className={styles.confirmationDialog}
        aria-labelledby="confirmation-message"
        aria-modal="true"
      >
        <div className={styles.dialogContent}>
          <p 
            id="confirmation-message" 
            className={styles.message}
          >
            {message}
          </p>
          <div className={styles.buttonContainer}>
            <button 
              className={styles.confirmButton}
              onClick={handleConfirm}
              autoFocus
            >
              {confirmText}
            </button>
            <button 
              className={styles.cancelButton}
              onClick={handleCancel}
            >
              {cancelText}
            </button>
          </div>
        </div>
      </dialog>
    );
  }
);

// Explicitly set display name for debugging
ConfirmationDialog.displayName = 'ConfirmationDialog';

export default ConfirmationDialog;