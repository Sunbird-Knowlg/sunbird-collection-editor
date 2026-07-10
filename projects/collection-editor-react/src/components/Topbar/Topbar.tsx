import React, { useCallback, useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  Send,
  Check,
  Users,
  CheckCircle,
  RotateCcw,
  Shield,
  QrCode,
  Download,
  ChevronDown,
  Info,
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
import { useLabels } from '../../hooks/useLabels';
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
  isFormValid?: boolean;
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

function deriveStatusLabel(status: unknown, draftFallbackLabel: string): string {
  if (typeof status === 'string' && status.trim().length > 0) {
    return status.trim();
  }
  return draftFallbackLabel;
}

// ---------------------------------------------------------------------------
// Generic review-comment modal — used by Request for Changes.
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
  const lbl = useLabels();
  const [comment, setComment] = useState('');
  const modalId = titleText.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={styles.sbOverlay} role="dialog" aria-modal="true" aria-labelledby={`${modalId}-title`}>
      <div className={styles.sbModal}>
        <div className={styles.sbModalHeader}>
          <span id={`${modalId}-title`} className={styles.sbModalTitle}>{titleText}</span>
          <button className={styles.sbModalClose} onClick={onCancel} aria-label={lbl.reviewCommentModal.closeAriaLabel} type="button">
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
            <p className={styles.sbError}>{lbl.reviewCommentModal.fillCommentsError}</p>
          )}
        </div>
        <div className={styles.sbModalFooter}>
          <Button variant="ghost" onClick={onCancel}>{lbl.reviewCommentModal.cancelButton}</Button>
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
  const lbl = useLabels();
  const [agreed, setAgreed] = useState(false);

  return (
    <div className={styles.sbOverlay} role="dialog" aria-modal="true" aria-labelledby="review-confirm-title">
      <div className={styles.sbModal}>
        <div className={styles.sbModalHeader}>
          <span id="review-confirm-title" className={styles.sbModalTitle}>{lbl.confirmReviewModal.title}</span>
          <button className={styles.sbModalClose} onClick={onCancel} aria-label={lbl.confirmReviewModal.closeAriaLabel} type="button">
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
              {lbl.confirmReviewModal.agreementTextPart1}{' '}
              <a
                className="sb-color-primary"
                style={{ fontWeight: 600 }}
                href="https://creativecommons.org/licenses"
                target="_blank"
                rel="noreferrer"
              >
                {lbl.confirmReviewModal.creativeCommonsLinkText}
              </a>{' '}
              {lbl.confirmReviewModal.agreementTextPart2} <strong>{lbl.confirmReviewModal.contentPolicyText}</strong>{lbl.confirmReviewModal.agreementTextPart3}
            </span>
          </label>
        </div>
        <div className={styles.sbModalFooter}>
          <Button variant="ghost" onClick={onCancel}>{lbl.confirmReviewModal.cancelButton}</Button>
          <Button variant="primary" onClick={onConfirm} disabled={!agreed}>
            {lbl.confirmReviewModal.submitButton}
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
  const lbl = useLabels();
  const [count, setCount] = useState('');
  const numCount = parseInt(count, 10);
  const isValid = !isNaN(numCount) && numCount >= 2 && numCount <= 250;

  return (
    <div className={styles.sbOverlay} role="dialog" aria-modal="true" aria-labelledby="genqr-title">
      <div className={styles.sbModal}>
        <div className={styles.sbModalHeader}>
          <span id="genqr-title" className={styles.sbModalTitle}>{lbl.generateQRModal.title}</span>
          <button className={styles.sbModalClose} onClick={onCancel} aria-label={lbl.generateQRModal.closeAriaLabel} type="button">
            ×
          </button>
        </div>
        <div className={styles.sbModalBody}>
          <label className={styles.sbLabel} htmlFor="qr-count">
            {lbl.generateQRModal.numberOfCodesLabel} <span aria-hidden="true" style={{ color: 'var(--sbx-error, #DC2626)' }}>*</span>
          </label>
          <input
            id="qr-count"
            type="number"
            min={2}
            max={250}
            className={styles.sbTextarea}
            style={{ resize: 'none', height: '40px' }}
            placeholder={lbl.generateQRModal.countPlaceholder}
            value={count}
            onChange={(e) => setCount(e.target.value)}
          />
          {count && !isValid && (
            <p className={styles.sbError}>{lbl.generateQRModal.countRangeError}</p>
          )}
        </div>
        <div className={styles.sbModalFooter}>
          <Button variant="ghost" onClick={onCancel}>{lbl.generateQRModal.cancelButton}</Button>
          <Button variant="primary" onClick={() => onConfirm(numCount)} disabled={!isValid}>
            {lbl.generateQRModal.generateButton}
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
  isFormValid = true,
  onToolbarEvent,
}) => {
  const lbl = useLabels();
  const treeData = useTreeStore((s) => s.treeData);
  const rootNode = treeData[0];
  const title = rootNode?.name ?? lbl.contextualEditor.untitledPlaceholder;
  const statusLabel = deriveStatusLabel(rootNode?.metadata?.status ?? rootNode?.status, lbl.topbar.draftStatusFallback);

  const contentId = useEditorStore(
    (s) =>
      s.editorConfig?.context?.contentId ??
      s.editorConfig?.context?.identifier ??
      '',
  );

  const { activeModal, modalData, closeModal, openModal } = useUiStore();

  const buttonLoaders = useEditorStore((s) => s.buttonLoaders);

  // Category definition controls optional toolbar features.
  // generateDIALCodes default "Yes" means QR codes are enabled for this content type.
  // Default to showing if the API hasn't loaded yet (backward compat).
  const categoryMeta = useEditorStore((s) => s.categoryMeta);
  const showDialcode = !categoryMeta || categoryMeta.schemaDefaults.generateDIALCodes !== 'No';

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
      const { processId, reservedDialcodes } = await reserveDialcodes(contentId, count);
      if (processId && rootNode) {
        updateNode(rootNode.id, { qrCodeProcessId: processId, reservedDialcodes });
      }
      toast.success(lbl.topbar.qrGenerationStartedToast);
    } catch {
      toast.error(lbl.topbar.qrGenerationFailedToast);
    } finally {
      setIsGeneratingQR(false);
    }
  }, [contentId, rootNode, updateNode, lbl]);

  const handleDownloadQR = useCallback(async () => {
    if (!qrCodeProcessId) {
      toast.error(lbl.topbar.qrCodesNotGeneratedToast);
      return;
    }

    setIsDownloadingQR(true);
    try {
      const result = await getDialcodeProcessStatus(qrCodeProcessId);

      if (result.status === 'in-process') {
        toast(lbl.topbar.qrGenerationInProgressToast, { icon: <Info size={16} /> });
        return;
      }

      const cloudUrl = result.url;
      if (!cloudUrl) {
        toast.error(lbl.topbar.qrCodesNotReadyToast);
        return;
      }

      // Blob-convert so the browser always triggers a local file download
      // regardless of the cloud storage server's Content-Disposition header.
      const blob = await fetch(cloudUrl).then(r => r.blob());
      const dataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });

      // Build filename — metadata fields are optional, omit empty segments
      const meta = rootNode?.metadata ?? {};
      const toStr = (v: unknown) =>
        Array.isArray(v) ? v.join('_') : typeof v === 'string' ? v : '';
      const parts = [
        contentId,
        toStr(meta['medium']),
        toStr(meta['gradeLevel']),
        toStr(meta['subject']),
      ].filter(Boolean);
      const ts = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `${parts.join('_')}_${ts}.zip`;

      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = filename;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      toast.success(lbl.topbar.qrCodesDownloadedToast);
    } catch {
      toast.error(lbl.topbar.qrCodesDownloadFailedToast);
    } finally {
      setIsDownloadingQR(false);
    }
  }, [qrCodeProcessId, rootNode, contentId, lbl]);

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

  return (
    <>
      <header className={styles.topbar} role="banner">
        {/* ── Left: Back + Title + Status ─────────────────────── */}
        <div className={styles.left}>
          <button
            className={styles.backBtn}
            onClick={() => emit('back')}
            aria-label={lbl.topbar.backAriaLabel}
            type="button"
          >
            <ArrowLeft size={18} />
          </button>

          <h1 className={styles.title} title={title}>
            {title}
          </h1>

          <span className={`sbx-chip ${styles.statusChip}`} aria-label={`${lbl.topbar.statusAriaLabelPrefix} ${statusLabel}`}>
            {statusLabel}
          </span>
        </div>

        {/* ── Right: Save indicator + actions ──────────────────── */}
        <div className={styles.right}>
          {/* Autosave / dirty indicator */}
          {isSaving ? (
            <span className={styles.savedIndicator} aria-live="polite">
              {lbl.topbar.savingIndicator}
            </span>
          ) : isDirty && isEditMode ? (
            // Dirty takes precedence over a prior "Saved" — no auto-save anymore.
            // View modes (review/read) never show "Unsaved".
            <span
              className={`${styles.savedIndicator} ${styles.unsaved}`}
              aria-live="polite"
            >
              {lbl.topbar.unsavedIndicator}
            </span>
          ) : lastSaved ? (
            <span className={styles.savedIndicator} aria-live="polite">
              <Check size={14} aria-hidden="true" />
              {lbl.topbar.savedIndicatorPrefix} {formatLastSaved(lastSaved)}
            </span>
          ) : null}

          {/* Save as Draft — author action only. Hidden in read-only and for
              content under review (review / sourcing modes or Review status). */}
          {!isReadOnly && !isReviewMode && !isSourcingReviewMode && statusLabel !== 'Review' && (
            <span title={!isFormValid ? lbl.topbar.fillRequiredFieldsTooltip : undefined}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => emit('saveCollection')}
                disabled={!isFormValid}
              >
                {lbl.topbar.saveAsDraftButton}
              </Button>
            </span>
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
                &nbsp;{lbl.topbar.sendForReviewButton}
              </Button>

              {/* Collaborators — icon only with tooltip */}
              <button
                className={styles.iconBtn}
                onClick={() => openModal('manageCollaborators')}
                aria-label={lbl.topbar.collaboratorsLabel}
                title={lbl.topbar.collaboratorsLabel}
                type="button"
              >
                <Users size={16} aria-hidden="true" />
              </button>

              {/* QR Codes dropdown — hidden when generateDIALCodes is "No" for this category */}
              {showDialcode && <div className={styles.qrDropdown} ref={qrMenuRef}>
                <button
                  className={styles.iconBtn}
                  onClick={() => setShowQRMenu(v => !v)}
                  aria-label={lbl.topbar.qrCodesLabel}
                  title={lbl.topbar.qrCodesLabel}
                  type="button"
                  aria-haspopup="true"
                  aria-expanded={showQRMenu}
                >
                  <QrCode size={16} aria-hidden="true" />
                  <span className={styles.iconBtnLabel}>{lbl.topbar.qrCodesLabel}</span>
                  <ChevronDown size={14} style={{ marginLeft: 2 }} aria-hidden="true" />
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
                      {isGeneratingQR ? lbl.topbar.generatingEllipsis : lbl.topbar.generateQrCodesMenuItem}
                    </button>
                    <button
                      role="menuitem"
                      type="button"
                      onClick={() => { setShowQRMenu(false); handleDownloadQR(); }}
                      disabled={isDownloadingQR || !qrCodeProcessId}
                    >
                      <Download size={14} />
                      {isDownloadingQR ? lbl.topbar.downloadingEllipsis : lbl.topbar.downloadQrCodesMenuItem}
                    </button>
                  </div>
                )}
              </div>}
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
                &nbsp;{lbl.topbar.publishButton}
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowRejectModal(true)}
                disabled={buttonLoaders.rejectCollection}
                isLoading={buttonLoaders.rejectCollection}
              >
                <RotateCcw size={14} aria-hidden="true" />
                &nbsp;{lbl.topbar.requestForChangesButton}
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
                &nbsp;{lbl.topbar.approveButton}
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={() => openModal('qualityParams', { action: 'reject' })}
              >
                <RotateCcw size={14} aria-hidden="true" />
                &nbsp;{lbl.topbar.requestForChangesButton}
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
          titleText={lbl.topbar.requestChangesTitle}
          labelText={lbl.topbar.changesRequestedLabel}
          placeholderText={lbl.topbar.describeChangesPlaceholder}
          submitLabel={lbl.topbar.requestForChangesButton}
          submitVariant="primary"
          onConfirm={(comment) => { setShowRejectModal(false); emit('reject', { comment }); }}
          onCancel={() => setShowRejectModal(false)}
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
