import React from 'react';
import { createPortal } from 'react-dom';
import { Button } from '../shared/Button';
import { useLabels } from '../../hooks/useLabels';
import styles from './modals.module.scss';

interface UnsavedChangesModalProps {
  onSave: () => void;
  onDiscard: () => void;
  onCancel: () => void;
  isSaving?: boolean;
}

/**
 * Shown when the user clicks Back with unsaved changes. Lets them save and
 * leave, discard and leave, or stay on the page.
 */
export const UnsavedChangesModal: React.FC<UnsavedChangesModalProps> = ({
  onSave,
  onDiscard,
  onCancel,
  isSaving,
}) => {
  const lbl = useLabels();
  return createPortal(
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="unsaved-title">
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <span id="unsaved-title">{lbl.unsavedChangesModal.title}</span>
          <button className={styles.modalHeaderClose} onClick={onCancel} aria-label={lbl.unsavedChangesModal.closeAriaLabel} disabled={isSaving}>
            ×
          </button>
        </div>
        <div className={styles.modalBody}>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5 }}>
            {lbl.unsavedChangesModal.bodyMessage}
          </p>
        </div>
        <div className={styles.modalFooter}>
          <Button variant="ghost" onClick={onCancel} disabled={isSaving}>
            {lbl.unsavedChangesModal.cancelButton}
          </Button>
          <Button variant="danger" onClick={onDiscard} disabled={isSaving}>
            {lbl.unsavedChangesModal.discardButton}
          </Button>
          <Button variant="primary" onClick={onSave} isLoading={isSaving} disabled={isSaving}>
            {lbl.unsavedChangesModal.saveButton}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
};
