import React from 'react';
import { createPortal } from 'react-dom';
import { Button } from '../shared/Button';
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
  return createPortal(
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="unsaved-title">
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <span id="unsaved-title">Unsaved changes</span>
          <button className={styles.modalHeaderClose} onClick={onCancel} aria-label="Close" disabled={isSaving}>
            ×
          </button>
        </div>
        <div className={styles.modalBody}>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5 }}>
            You have unsaved changes. Would you like to save them before leaving?
          </p>
        </div>
        <div className={styles.modalFooter}>
          <Button variant="ghost" onClick={onCancel} disabled={isSaving}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onDiscard} disabled={isSaving}>
            Discard
          </Button>
          <Button variant="primary" onClick={onSave} isLoading={isSaving} disabled={isSaving}>
            Save
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
};
