import React from 'react';
import { Button } from '../shared/Button';
import styles from './modals.module.scss';

interface ConfirmDialogProps {
  title: string;
  message: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'primary' | 'danger';
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'primary',
  onConfirm,
  onCancel,
}) => (
  <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="confirm-dialog-title">
    <div className={styles.modal}>
      <div className={styles.modalHeader}>
        <span id="confirm-dialog-title">{title}</span>
        <button
          className={styles.modalHeaderClose}
          onClick={onCancel}
          aria-label="Close"
        >
          ×
        </button>
      </div>

      <div className={styles.modalBody}>{message}</div>

      <div className={styles.modalFooter}>
        <Button variant="ghost" onClick={onCancel}>
          {cancelLabel}
        </Button>
        <Button variant={variant} onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </div>
  </div>
);
