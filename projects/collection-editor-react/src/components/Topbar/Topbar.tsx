import React, { useCallback, useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  Send,
  Check,
  Users,
  CheckCircle,
  XCircle,
  RotateCcw,
  Shield,
  QrCode,
  Download,
} from 'lucide-react';
import type { EditorMode, ToolbarAction } from '../../types/editor';
import { useTreeStore } from '../../store/tree.store';
import { useEditorStore } from '../../store/editor.store';
import { useUiStore } from '../../store/ui.store';
import { Button } from '../shared/Button';
import { PublishChecklist } from '../modals/PublishChecklist';
import { QualityParamsModal } from '../modals/QualityParamsModal';
import { ManageCollaborators } from '../Collaborators/ManageCollaborators';
import { reserveDialcodes, getDialcodeProcessStatus } from '../../api/dialcode';
import toast from 'react-hot-toast';
import styles from './Topbar.module.scss';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
interface TopbarProps {
  editorMode: EditorMode;
  isSaving: boolean;
  isDirty: boolean;
  lastSaved: string | null;
  onToolbarEvent: (event: { action: ToolbarAction; data?: unknown }) => void;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function formatLastSaved(ts: string | null): string {
  if (!ts) return '';
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function deriveStatusLabel(status: unknown): string {
  if (typeof status === 'string' && status.trim().length > 0) {
    return status.trim();
  }
  return 'Draft';
}

// ---------------------------------------------------------------------------
// Generic review-comment modal — used for both Reject and Send Back.
// Matches the Angular "Add Review Comments" popup text.
// ---------------------------------------------------------------------------
interface ReviewCommentModalProps {
  titleText: string;
  labelText: string;
  placeholderText: string;
  submitLabel: string;
  submitVariant?: 'primary' | 'danger';
  onConfirm: (comment: string) => void;
  onCancel: () => void;
}

const ReviewCommentModal: React.FC<ReviewCommentModalProps> = ({
  titleText,
  labelText,
  placeholderText,
  submitLabel,
  submitVariant = 'primary',
  onConfirm,
  onCancel,
}) => {
  const [comment, setComment] = useState('');
  const modalId = titleText.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={styles.sbOverlay} role="dialog" aria-modal="true" aria-labelledby={`${modalId}-title`}>
      <div className={styles.sbModal}>
        <div className={styles.sbModalHeader}>
          <span id={`${modalId}-title`} className={styles.sbModalTitle}>{titleText}</span>
          <button className={styles.sbModalClose} onClick={onCancel} aria-label="Close" type="button">
            ×
          </button>
        </div>
        <div className={styles.sbModalBody}>
          <label className={styles.sbLabel} htmlFor={`${modalId}-comment`}>
            {labelText} <span aria-hidden="true" style={{ color: 'var(--sbx-error, #DC2626)' }}>*</span>
          </label>
          <textarea
            id={`${modalId}-comment`}
            className={styles.sbTextarea}
            placeholder={placeholderText}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            required
            aria-required="true"
          />
          {comment.trim().length === 0 && (
            <p className={styles.sbError}>Fill comments</p>
          )}
        </div>
        <div className={styles.sbModalFooter}>
          <Button variant="ghost" onClick={onCancel}>Cancel</Button>
          <Button
            variant={submitVariant}
            onClick={() => onConfirm(comment.trim())}
            disabled={comment.trim().length === 0}
          >
            {submitLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Send-for-Review confirmation modal (inline)
// Mirrors Angular's "Accept Terms & Conditions" confirm before submitting.
// ---------------------------------------------------------------------------
interface ConfirmReviewModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmReviewModal: React.FC<ConfirmReviewModalProps> = ({ onConfirm, onCancel }) => {
  const [agreed, setAgreed] = useState(false);

  return (
    <div className={styles.sbOverlay} role="dialog" aria-modal="true" aria-labelledby="review-confirm-title">
      <div className={styles.sbModal}>
        <div className={styles.sbModalHeader}>
          <span id="review-confirm-title" className={styles.sbModalTitle}>Accepting Terms &amp; Conditions</span>
          <button className={styles.sbModalClose} onClick={onCancel} aria-label="Close" type="button">
            ×
          </button>
        </div>
        <div className={styles.sbModalBody}>
          <label style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 13, lineHeight: 1.55 }}>
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              style={{ marginTop: 2 }}
            />
            <span>
              I agree that by submitting / publishing this Content, I confirm that this
              Content complies with prescribed guidelines, including the Terms of Use and
              Content Policy and that I consent to publish it under the{' '}
              <a
                className="sb-color-primary"
                style={{ fontWeight: 600 }}
                href="https://creativecommons.org/licenses"
                target="_blank"
                rel="noreferrer"
              >
                Creative Commons Framework
              </a>{' '}
              in accordance with the <strong>Content Policy</strong>. I have made sure that
              I do not violate others&rsquo; copyright or privacy rights.
            </span>
          </label>
        </div>
        <div className={styles.sbModalFooter}>
          <Button variant="ghost" onClick={onCancel}>Cancel</Button>
          <Button variant="primary" onClick={onConfirm} disabled={!agreed}>
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Generate QR Codes modal (inline)
// ---------------------------------------------------------------------------
interface GenerateQRModalProps {
  onConfirm: (count: number) => void;
  onCancel: () => void;
}

const GenerateQRModal: React.FC<GenerateQRModalProps> = ({ onConfirm, onCancel }) => {
  const [count, setCount] = useState('');
  const numCount = parseInt(count, 10);
  const isValid = !isNaN(numCount) && numCount >= 1 && numCount <= 250;

  return (
    <div className={styles.sbOverlay} role="dialog" aria-modal="true" aria-labelledby="genqr-title">
      <div className={styles.sbModal}>
        <div className={styles.sbModalHeader}>
          <span id="genqr-title" className={styles.sbModalTitle}>Generate QR Codes</span>
          <button className={styles.sbModalClose} onClick={onCancel} aria-label="Close" type="button">
            ×
          </button>
        </div>
        <div className={styles.sbModalBody}>
          <label className={styles.sbLabel} htmlFor="qr-count">
            Number of QR Codes <span aria-hidden="true" style={{ color: 'var(--sbx-error, #DC2626)' }}>*</span>
          </label>
          <input
            id="qr-count"
            type="number"
            min={1}
            max={250}
            className={styles.sbTextarea}
            style={{ resize: 'none', height: '40px' }}
            placeholder="Enter number (1–250)"
            value={count}
            onChange={(e) => setCount(e.target.value)}
          />
          {count && !isValid && (
            <p className={styles.sbError}>Enter a number between 1 and 250.</p>
          )}
        </div>
        <div className={styles.sbModalFooter}>
          <Button variant="ghost" onClick={onCancel}>Cancel</Button>
          <Button variant="primary" onClick={() => onConfirm(numCount)} disabled={!isValid}>
            Generate
          </Button>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export const Topbar: React.FC<TopbarProps> = ({
  editorMode,
  isSaving,
  isDirty,
  lastSaved,
  onToolbarEvent,
}) => {
  const treeData = useTreeStore((s) => s.treeData);
  const rootNode = treeData[0];
  const title = rootNode?.name ?? 'Untitled';
  const statusLabel = deriveStatusLabel(rootNode?.metadata?.status ?? rootNode?.status);

  const contentId = useEditorStore(
    (s) =>
      s.editorConfig?.context?.contentId ??
      s.editorConfig?.context?.identifier ??
      '',
  );

  const { activeModal, modalData, closeModal, openModal } = useUiStore();

  const buttonLoaders = useEditorStore((s) => s.buttonLoaders);

  // Local state for the send-back modal (not stored in ui.store)
  const [showSendBack, setShowSendBack] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showConfirmReview, setShowConfirmReview] = useState(false);
  const [showQRMenu, setShowQRMenu] = useState(false);
  const qrMenuRef = useRef<HTMLDivElement>(null);
  const [showGenerateQR, setShowGenerateQR] = useState(false);

  useEffect(() => {
    if (!showQRMenu) return;
    const handler = (e: MouseEvent) => {
      if (!qrMenuRef.current?.contains(e.target as Node)) setShowQRMenu(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showQRMenu]);
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);
  const [isDownloadingQR, setIsDownloadingQR] = useState(false);

  const { updateNode } = useTreeStore();
  const qrCodeProcessId = rootNode?.metadata?.qrCodeProcessId as string | undefined;

  const handleGenerateQR = useCallback(async (count: number) => {
    if (!contentId) return;
    setShowGenerateQR(false);
    setIsGeneratingQR(true);
    try {
      const processId = await reserveDialcodes(contentId, count);
      if (processId && rootNode) {
        updateNode(rootNode.id, { qrCodeProcessId: processId });
      }
      toast.success('QR Codes generation started. Use "Download QR Codes" once ready.');
    } catch {
      toast.error('Failed to generate QR Codes. Please try again.');
    } finally {
      setIsGeneratingQR(false);
    }
  }, [contentId, rootNode, updateNode]);

  const handleDownloadQR = useCallback(async () => {
    if (!qrCodeProcessId) {
      toast.error('No QR codes generated yet. Generate QR Codes first.');
      return;
    }
    setIsDownloadingQR(true);
    try {
      const result = await getDialcodeProcessStatus(qrCodeProcessId);
      const zipUrl = result.zipFileName;
      if (zipUrl) {
        const a = document.createElement('a');
        a.href = zipUrl;
        a.download = 'qrcodes.zip';
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        toast.error('QR Codes not ready yet. Please wait and try again.');
      }
    } catch {
      toast.error('Failed to download QR Codes.');
    } finally {
      setIsDownloadingQR(false);
    }
  }, [qrCodeProcessId]);

  const isEditMode = editorMode === 'edit';
  const isReviewMode = editorMode === 'review';
  const isSourcingReviewMode = editorMode === 'sourcingreview';
  const isReadOnly = editorMode === 'read';

  const emit = useCallback(
    (action: ToolbarAction, data?: unknown) => {
      onToolbarEvent({ action, data });
    },
    [onToolbarEvent],
  );

  // ---------------------------------------------------------------------------
  // Modal handlers
  // ---------------------------------------------------------------------------
  const handlePublishConfirm = useCallback(() => {
    closeModal();
    emit('publish');
  }, [closeModal, emit]);

  const handleQualityConfirm = useCallback(
    (comment: string, score?: number) => {
      const action = modalData?.action as 'approve' | 'reject' | undefined;
      closeModal();
      if (action === 'approve') {
        emit('sourcingApprove', { comment, score });
      } else {
        emit('reject', { comment });
      }
    },
    [closeModal, emit, modalData],
  );

  const handleSendBack = useCallback(
    (comment: string) => {
      setShowSendBack(false);
      emit('sendBackForCorrections', { comment });
    },
    [emit],
  );

  return (
    <>
      <header className={styles.topbar} role="banner">
        {/* ── Left: Back + Title + Status ─────────────────────── */}
        <div className={styles.left}>
          <button
            className={styles.backBtn}
            onClick={() => emit('back')}
            aria-label="Go back"
            type="button"
          >
            <ArrowLeft size={18} />
          </button>

          <h1 className={styles.title} title={title}>
            {title}
          </h1>

          <span className={`sbx-chip ${styles.statusChip}`} aria-label={`Status: ${statusLabel}`}>
            {statusLabel}
          </span>
        </div>

        {/* ── Right: Save indicator + actions ──────────────────── */}
        <div className={styles.right}>
          {/* Autosave / dirty indicator */}
          {isSaving ? (
            <span className={styles.savedIndicator} aria-live="polite">
              Saving&hellip;
            </span>
          ) : isDirty ? (
            // Dirty takes precedence over a prior "Saved" — no auto-save anymore.
            <span
              className={`${styles.savedIndicator} ${styles.unsaved}`}
              aria-live="polite"
            >
              Unsaved
            </span>
          ) : lastSaved ? (
            <span className={styles.savedIndicator} aria-live="polite">
              <Check size={14} aria-hidden="true" />
              Saved {formatLastSaved(lastSaved)}
            </span>
          ) : null}

          {/* Save as Draft — author action only. Hidden in read-only and for
              content under review (review / sourcing modes or Review status). */}
          {!isReadOnly && !isReviewMode && !isSourcingReviewMode && statusLabel !== 'Review' && (
            <Button variant="ghost" size="sm" onClick={() => emit('saveCollection')}>
              Save as Draft
            </Button>
          )}

          {/* ── edit mode ─────────────────────────────────────── */}
          {isEditMode && (
            <>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowConfirmReview(true)}
                disabled={buttonLoaders.saveCollection}
                isLoading={buttonLoaders.saveCollection}
              >
                <Send size={14} aria-hidden="true" />
                &nbsp;Send for review
              </Button>

              {/* Collaborators — icon only with tooltip */}
              <button
                className={styles.iconBtn}
                onClick={() => openModal('manageCollaborators')}
                aria-label="Collaborators"
                title="Collaborators"
                type="button"
              >
                <Users size={16} aria-hidden="true" />
              </button>

              {/* QR Codes dropdown */}
              <div className={styles.qrDropdown} ref={qrMenuRef}>
                <button
                  className={styles.iconBtn}
                  onClick={() => setShowQRMenu(v => !v)}
                  aria-label="QR Codes"
                  title="QR Codes"
                  type="button"
                  aria-haspopup="true"
                  aria-expanded={showQRMenu}
                >
                  <QrCode size={16} aria-hidden="true" />
                  <span className={styles.iconBtnLabel}>QR Codes</span>
                  <span style={{ fontSize: 10, marginLeft: 2 }}>▾</span>
                </button>
                {showQRMenu && (
                  <div className={styles.qrMenu} role="menu">
                    <button
                      role="menuitem"
                      type="button"
                      onClick={() => { setShowQRMenu(false); setShowGenerateQR(true); }}
                      disabled={isGeneratingQR}
                    >
                      <QrCode size={14} />
                      {isGeneratingQR ? 'Generating…' : 'Generate QR Codes'}
                    </button>
                    <button
                      role="menuitem"
                      type="button"
                      onClick={() => { setShowQRMenu(false); handleDownloadQR(); }}
                      disabled={isDownloadingQR || !qrCodeProcessId}
                    >
                      <Download size={14} />
                      {isDownloadingQR ? 'Downloading…' : 'Download QR Codes'}
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          {/* ── review mode ───────────────────────────────────── */}
          {isReviewMode && (
            <div className={styles.reviewBtns}>
              <Button
                variant="primary"
                size="sm"
                onClick={() => openModal('publishChecklist')}
                disabled={buttonLoaders.publishCollection}
                isLoading={buttonLoaders.publishCollection}
              >
                <CheckCircle size={14} aria-hidden="true" />
                &nbsp;Publish
              </Button>

              <Button
                variant="danger"
                size="sm"
                onClick={() => setShowRejectModal(true)}
                disabled={buttonLoaders.rejectCollection}
                isLoading={buttonLoaders.rejectCollection}
              >
                <XCircle size={14} aria-hidden="true" />
                &nbsp;Reject
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSendBack(true)}
              >
                <RotateCcw size={14} aria-hidden="true" />
                &nbsp;Send Back
              </Button>
            </div>
          )}

          {/* ── sourcingreview mode ───────────────────────────── */}
          {isSourcingReviewMode && (
            <div className={styles.sourcingBtns}>
              <Button
                variant="primary"
                size="sm"
                onClick={() => openModal('qualityParams', { action: 'approve' })}
              >
                <Shield size={14} aria-hidden="true" />
                &nbsp;Approve
              </Button>

              <Button
                variant="danger"
                size="sm"
                onClick={() => openModal('qualityParams', { action: 'reject' })}
              >
                <XCircle size={14} aria-hidden="true" />
                &nbsp;Reject
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* ── Modals ──────────────────────────────────────────────── */}

      {activeModal === 'publishChecklist' && (
        <PublishChecklist
          contentId={contentId}
          onConfirm={handlePublishConfirm}
          onCancel={closeModal}
        />
      )}

      {activeModal === 'qualityParams' && (
        <QualityParamsModal
          contentId={contentId}
          action={(modalData?.action as 'approve' | 'reject') ?? 'reject'}
          onConfirm={handleQualityConfirm}
          onCancel={closeModal}
        />
      )}

      {activeModal === 'manageCollaborators' && (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true">
          <ManageCollaborators
            contentId={contentId}
            onClose={closeModal}
          />
        </div>
      )}

      {showConfirmReview && (
        <ConfirmReviewModal
          onConfirm={() => { setShowConfirmReview(false); emit('sendForReview'); }}
          onCancel={() => setShowConfirmReview(false)}
        />
      )}

      {showRejectModal && (
        <ReviewCommentModal
          titleText="Add Review Comments"
          labelText="Enter your comments"
          placeholderText="Add comment"
          submitLabel="Submit Review"
          submitVariant="danger"
          onConfirm={(comment) => { setShowRejectModal(false); emit('reject', { comment }); }}
          onCancel={() => setShowRejectModal(false)}
        />
      )}

      {showSendBack && (
        <ReviewCommentModal
          titleText="Add Review Comments"
          labelText="Enter your comments"
          placeholderText="Add comment"
          submitLabel="Submit Review"
          onConfirm={handleSendBack}
          onCancel={() => setShowSendBack(false)}
        />
      )}

      {showGenerateQR && (
        <GenerateQRModal
          onConfirm={handleGenerateQR}
          onCancel={() => setShowGenerateQR(false)}
        />
      )}
    </>
  );
};
