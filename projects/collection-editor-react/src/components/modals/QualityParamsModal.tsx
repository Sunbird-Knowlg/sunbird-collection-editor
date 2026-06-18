import React, { useState } from 'react';
import { Button } from '../shared/Button';
import styles from './modals.module.scss';

interface QualityParamsModalProps {
  contentId: string;
  action: 'approve' | 'reject';
  onConfirm: (comment: string, score?: number) => void;
  onCancel: () => void;
}

export const QualityParamsModal: React.FC<QualityParamsModalProps> = ({
  contentId: _contentId,
  action,
  onConfirm,
  onCancel,
}) => {
  const [comment, setComment] = useState('');
  const [score, setScore] = useState<number>(7);

  const isApprove = action === 'approve';
  const title = isApprove ? 'Review Quality' : 'Reject Content';

  // For reject the comment is required; for approve it is optional
  const isSubmitDisabled = !isApprove && comment.trim().length === 0;

  const handleSubmit = () => {
    if (isApprove) {
      onConfirm(comment.trim(), score);
    } else {
      onConfirm(comment.trim());
    }
  };

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="quality-modal-title">
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <span id="quality-modal-title">{title}</span>
          <button
            className={styles.modalHeaderClose}
            onClick={onCancel}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className={styles.modalBody}>
          {isApprove ? (
            <>
              <div className={styles.formGroup}>
                <label htmlFor="quality-score">Quality Score</label>
                <div className={styles.sliderGroup}>
                  <input
                    id="quality-score"
                    type="range"
                    min={0}
                    max={10}
                    step={1}
                    value={score}
                    onChange={(e) => setScore(Number(e.target.value))}
                    aria-valuemin={0}
                    aria-valuemax={10}
                    aria-valuenow={score}
                  />
                  <span className={styles.sliderValue}>{score}</span>
                </div>
                <div className={styles.sliderLabels}>
                  <span>0 — Poor</span>
                  <span>10 — Excellent</span>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="quality-comment">
                  Comment{' '}
                  <span style={{ fontWeight: 400, color: 'var(--sbx-gray-400, #9CA3AF)' }}>
                    (optional)
                  </span>
                </label>
                <textarea
                  id="quality-comment"
                  className={styles.textarea}
                  placeholder="Add any notes for the content creator…"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                />
              </div>
            </>
          ) : (
            <div className={styles.formGroup}>
              <label htmlFor="reject-reason">
                Rejection Reason{' '}
                <span style={{ color: 'var(--sbx-error, #DC2626)' }}>*</span>
              </label>
              <textarea
                id="reject-reason"
                className={styles.textarea}
                placeholder="Describe why this content is being rejected…"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={5}
                required
                aria-required="true"
              />
              {comment.trim().length === 0 && (
                <p
                  style={{
                    fontSize: 12,
                    color: 'var(--sbx-error, #DC2626)',
                    marginTop: 4,
                  }}
                >
                  A rejection reason is required.
                </p>
              )}
            </div>
          )}
        </div>

        <div className={styles.modalFooter}>
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            variant={isApprove ? 'primary' : 'danger'}
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
          >
            {isApprove ? 'Approve' : 'Reject'}
          </Button>
        </div>
      </div>
    </div>
  );
};
