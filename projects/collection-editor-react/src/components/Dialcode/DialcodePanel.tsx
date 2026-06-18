import React, { useState, useCallback } from 'react';
import { Button } from '../shared/Button';
import { checkDialCode, linkDialCode, unlinkDialcode } from '../../api/dialcode';
import styles from './DialcodePanel.module.scss';

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
  const [dialcode, setDialcode] = useState<string | null>(existingDialcode ?? null);
  const [inputValue, setInputValue] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const isReadOnly = editorMode === 'review' || editorMode === 'read' || editorMode === 'sourcingreview';

  const handleLink = useCallback(async () => {
    const code = inputValue.trim().toUpperCase();
    if (!code) return;

    setStatus('loading');
    setErrorMsg('');

    try {
      const result = await checkDialCode(code);
      const dialcodeData = (result as Record<string, unknown>)?.result as Record<string, unknown> | undefined;
      const dialcodes = dialcodeData?.['dialcodes'] as unknown[] | undefined;
      if (!dialcodes || dialcodes.length === 0) {
        setErrorMsg('Dialcode not found. Please enter a valid code.');
        setStatus('error');
        return;
      }

      await linkDialCode(contentId, code);
      setDialcode(code);
      setInputValue('');
      setStatus('success');
      onDialcodeChange?.(code);
    } catch {
      setErrorMsg('Failed to link dialcode. Please try again.');
      setStatus('error');
    }
  }, [contentId, inputValue, onDialcodeChange]);

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
      setErrorMsg('Failed to remove dialcode. Please try again.');
      setStatus('error');
    }
  }, [contentId, dialcode, onDialcodeChange]);

  return (
    <div className={styles.panel}>
      <h3 className={styles.title}>QR Code (Dialcode)</h3>

      {dialcode ? (
        <div className={styles.qrSection}>
          <div className={styles.qrImageWrap}>
            <img
              src={`https://chart.googleapis.com/chart?cht=qr&chs=150x150&chl=${dialcode}`}
              alt={`QR code for ${dialcode}`}
              className={styles.qrImage}
            />
          </div>
          <div className={styles.qrMeta}>
            <span className={styles.dialcodeLabel}>Linked code:</span>
            <code className={styles.dialcodeValue}>{dialcode}</code>
            {!isReadOnly && (
              <Button
                variant="danger"
                size="sm"
                isLoading={status === 'loading'}
                onClick={handleUnlink}
                className={styles.removeBtn}
              >
                Remove
              </Button>
            )}
          </div>
        </div>
      ) : (
        <p className={styles.emptyState}>No QR code linked to this content.</p>
      )}

      {!isReadOnly && (
        <div className={styles.linkSection}>
          <p className={styles.sectionLabel}>Link manually</p>
          <div className={styles.inputRow}>
            <input
              type="text"
              className={styles.input}
              placeholder="Enter dialcode (e.g. A1B2C3)"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value.toUpperCase());
                if (status === 'error') setStatus('idle');
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleLink()}
              disabled={status === 'loading'}
              aria-label="Dialcode input"
            />
            <Button
              variant="primary"
              size="sm"
              isLoading={status === 'loading'}
              disabled={!inputValue.trim()}
              onClick={handleLink}
            >
              Link
            </Button>
          </div>
          {errorMsg && <p className={styles.error} role="alert">{errorMsg}</p>}
          {status === 'success' && (
            <p className={styles.successMsg} role="status">Dialcode linked successfully.</p>
          )}
        </div>
      )}
    </div>
  );
};
