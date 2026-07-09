import React from 'react';
import { Button } from '../shared/Button';
import { useLabels } from '../../hooks/useLabels';
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
  confirmLabel,
  cancelLabel,
  variant = 'primary',
  onConfirm,
  onCancel,
}) => {
  const lbl = useLabels();
  const resolvedConfirmLabel = confirmLabel ?? lbl.confirmDialog.confirmButton;
  const resolvedCancelLabel = cancelLabel ?? lbl.confirmDialog.cancelButton;
  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="confirm-dialog-title">
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <span id="confirm-dialog-title">{title}</span>
          <button
            className={styles.modalHeaderClose}
            onClick={onCancel}
            aria-label={lbl.confirmDialog.closeAriaLabel}
          >
            ×
          </button>
        </div>

        <div className={styles.modalBody}>{message}</div>

        <div className={styles.modalFooter}>
          <Button variant="ghost" onClick={onCancel}>
            {resolvedCancelLabel}
          </Button>
          <Button variant={variant} onClick={onConfirm}>
            {resolvedConfirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};
