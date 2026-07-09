import React, { useState, useCallback } from 'react';
import { Button } from '../shared/Button';
import { checkDialCode, linkDialCode, unlinkDialcode } from '../../api/dialcode';
import { useTreeStore } from '../../store/tree.store';
import { useLabels } from '../../hooks/useLabels';
import styles from './DialcodePanel.module.scss';

const DIALCODE_FORMAT = /^[A-Z0-9]{2,}$/;

interface DialcodePanelProps {
  contentId: string;
  existingDialcode?: string;
  editorMode: 'edit' | 'review' | 'read' | 'sourcingreview';
  onDialcodeChange?: (dialcode: string | null) => void;
}

type Status = 'idle' | 'loading' | 'error' | 'success';

export const DialcodePanel: React.FC<DialcodePanelProps> = ({
  contentId,
  existingDialcode,
  editorMode,
  onDialcodeChange,
}) => {
  const lbl = useLabels();
  const [dialcode, setDialcode] = useState<string | null>(existingDialcode ?? null);
  const [inputValue, setInputValue] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const treeData = useTreeStore((s) => s.treeData);
  const isReadOnly = editorMode === 'review' || editorMode === 'read' || editorMode === 'sourcingreview';

  const handleLink = useCallback(async () => {
    const code = inputValue.trim().toUpperCase();
    if (!code) return;

    // Format check: must be alphanumeric uppercase, at least 2 chars
    if (!DIALCODE_FORMAT.test(code)) {
      setErrorMsg(lbl.dialcodePanel.invalidFormatError);
      setStatus('error');
      return;
    }

    // Cross-tree duplicate check — same QR on multiple nodes causes ambiguous scans
    const isDuplicate = (function checkTree(nodes: typeof treeData): boolean {
      for (const node of nodes) {
        const nodeCodes = node.metadata?.['dialcodes'] as string[] | undefined;
        if (nodeCodes?.includes(code)) return true;
        if (node.children && checkTree(node.children)) return true;
      }
      return false;
    })(treeData);
    if (isDuplicate) {
      setErrorMsg(lbl.dialcodePanel.duplicateDialcodeError.replace('{code}', code));
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrorMsg('');

    try {
      const result = await checkDialCode(code);
      const dialcodeData = (result as Record<string, unknown>)?.result as Record<string, unknown> | undefined;
      const dialcodes = dialcodeData?.['dialcodes'] as unknown[] | undefined;
      if (!dialcodes || dialcodes.length === 0) {
        setErrorMsg(lbl.dialcodePanel.dialcodeNotFoundError);
        setStatus('error');
        return;
      }

      await linkDialCode(contentId, code);
      setDialcode(code);
      setInputValue('');
      setStatus('success');
      onDialcodeChange?.(code);
    } catch {
      setErrorMsg(lbl.dialcodePanel.linkFailedError);
      setStatus('error');
    }
  }, [contentId, inputValue, onDialcodeChange, treeData, lbl]);

  const handleUnlink = useCallback(async () => {
    if (!dialcode) return;

    setStatus('loading');
    setErrorMsg('');

    try {
      await unlinkDialcode(contentId);
      setDialcode(null);
      setStatus('idle');
      onDialcodeChange?.(null);
    } catch {
      setErrorMsg(lbl.dialcodePanel.unlinkFailedError);
      setStatus('error');
    }
  }, [contentId, dialcode, onDialcodeChange, lbl]);

  return (
    <div className={styles.panel}>
      <h3 className={styles.title}>{lbl.dialcodePanel.title}</h3>

      {dialcode ? (
        <div className={styles.qrSection}>
          <div className={styles.qrImageWrap}>
            <img
              src={`https://chart.googleapis.com/chart?cht=qr&chs=150x150&chl=${encodeURIComponent(dialcode ?? '')}`}
              alt={`${lbl.dialcodePanel.qrCodeAltPrefix} ${dialcode}`}
              className={styles.qrImage}
            />
          </div>
          <div className={styles.qrMeta}>
            <span className={styles.dialcodeLabel}>{lbl.dialcodePanel.linkedCodeLabel}</span>
            <code className={styles.dialcodeValue}>{dialcode}</code>
            {!isReadOnly && (
              <Button
                variant="danger"
                size="sm"
                isLoading={status === 'loading'}
                onClick={handleUnlink}
                className={styles.removeBtn}
              >
                {lbl.dialcodePanel.removeButton}
              </Button>
            )}
          </div>
        </div>
      ) : (
        <p className={styles.emptyState}>{lbl.dialcodePanel.noCodeLinkedMessage}</p>
      )}

      {!isReadOnly && (
        <div className={styles.linkSection}>
          <p className={styles.sectionLabel}>{lbl.dialcodePanel.linkManuallyLabel}</p>
          <div className={styles.inputRow}>
            <input
              type="text"
              className={styles.input}
              placeholder={lbl.dialcodePanel.dialcodeInputPlaceholder}
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value.toUpperCase());
                if (status === 'error') setStatus('idle');
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleLink()}
              disabled={status === 'loading'}
              aria-label={lbl.dialcodePanel.dialcodeInputAriaLabel}
            />
            <Button
              variant="primary"
              size="sm"
              isLoading={status === 'loading'}
              disabled={!inputValue.trim()}
              onClick={handleLink}
            >
              {lbl.dialcodePanel.linkButton}
            </Button>
          </div>
          {errorMsg && <p className={styles.error} role="alert">{errorMsg}</p>}
          {status === 'success' && (
            <p className={styles.successMsg} role="status">{lbl.dialcodePanel.linkedSuccessMessage}</p>
          )}
        </div>
      )}
    </div>
  );
};
