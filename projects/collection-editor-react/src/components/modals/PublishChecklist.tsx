import React, { useState } from 'react';
import { useEditorStore } from '../../store/editor.store';
import { Button } from '../shared/Button';
import { useLabels } from '../../hooks/useLabels';
import styles from './modals.module.scss';

interface PublishChecklistProps {
  contentId: string;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Publish confirmation — mirrors the Angular publish-checklist popup.
 * - With no checklist items: a simple "Are you sure you want to publish this {objectType}?"
 * - With checklist items: the reviewer must tick every item before "Yes" is enabled.
 */
export const PublishChecklist: React.FC<PublishChecklistProps> = ({
  contentId: _contentId,
  onConfirm,
  onCancel,
}) => {
  const lbl = useLabels();
  const objectType =
    useEditorStore((s) => s.editorConfig?.config?.objectType) || 'Content';

  // Manual confirmation items defined by the category definition (forms.publishchecklist).
  const checklistItems = useEditorStore((s) => s.publishChecklist) ?? [];
  const [confirmed, setConfirmed] = useState<Record<string, boolean>>({});
  const allConfirmed = checklistItems.every((c) => confirmed[c.code]);
  const canPublish = checklistItems.length === 0 || allConfirmed;

  // Publishing is performed centrally (useToolbarActions) after confirmation.
  const handlePublish = () => {
    onConfirm();
  };

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="publish-modal-title">
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <span id="publish-modal-title">{lbl.publishChecklist.publishTitlePrefix} {objectType}</span>
          <button
            className={styles.modalHeaderClose}
            onClick={onCancel}
            aria-label={lbl.publishChecklist.closeAriaLabel}
          >
            ×
          </button>
        </div>

        <div className={styles.modalBody}>
          {checklistItems.length === 0 ? (
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5 }}>
              {lbl.publishChecklist.confirmPublishPrefix} {objectType}?
            </p>
          ) : (
            <>
              <p className={styles.sectionTitle}>
                {lbl.publishChecklist.checklistInstructions}
              </p>
              {checklistItems.map((item) => (
                <label key={item.code} className={styles.checkRow}>
                  <input
                    type="checkbox"
                    checked={!!confirmed[item.code]}
                    onChange={(e) =>
                      setConfirmed((prev) => ({ ...prev, [item.code]: e.target.checked }))
                    }
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </>
          )}
        </div>

        <div className={styles.modalFooter}>
          <Button variant="ghost" onClick={onCancel}>
            {lbl.publishChecklist.noButton}
          </Button>
          <Button variant="primary" onClick={handlePublish} disabled={!canPublish}>
            {lbl.publishChecklist.yesButton}
          </Button>
        </div>
      </div>
    </div>
  );
};
