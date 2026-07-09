import React, { useState, useRef, useCallback, useEffect } from 'react';
import { X, FileText, Upload } from 'lucide-react';
import { Button } from '../shared/Button';
import {
  uploadCsvHierarchy,
  getCsvUploadStatus,
  downloadSampleCsv,
} from '../../api/bulkUpload';
import { useLabels } from '../../hooks/useLabels';
import styles from './BulkUpload.module.scss';

interface CsvUploadProps {
  contentId: string;
  onComplete: () => void;
  onClose: () => void;
  mode?: 'create' | 'update';
}

type UploadStatus = 'idle' | 'uploading' | 'processing' | 'done' | 'error';

interface FailedRecord {
  rowNumber?: number;
  name?: string;
  reason?: string;
  [key: string]: unknown;
}

export const CsvUpload: React.FC<CsvUploadProps> = ({
  contentId,
  onComplete,
  onClose,
  mode = 'create',
}) => {
  const lbl = useLabels();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [failedRecords, setFailedRecords] = useState<FailedRecord[]>([]);
  const [successCount, setSuccessCount] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = useCallback(() => {
    if (pollRef.current !== null) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  useEffect(() => () => stopPolling(), [stopPolling]);

  const validateFile = (file: File): boolean => {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setErrorMsg(lbl.csvUpload.invalidFileType);
      return false;
    }
    if (file.size > 50 * 1024 * 1024) {
      setErrorMsg(lbl.csvUpload.fileTooLarge);
      return false;
    }
    return true;
  };

  const handleFileSelect = useCallback((file: File) => {
    setErrorMsg('');
    setFailedRecords([]);
    setSuccessCount(null);
    setStatus('idle');
    if (validateFile(file)) {
      setSelectedFile(file);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFileSelect(file);
    },
    [handleFileSelect],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFileSelect(file);
      // reset input so same file can be re-selected
      e.target.value = '';
    },
    [handleFileSelect],
  );

  const handleDownloadSample = useCallback(async () => {
    try {
      // Returns a pre-signed URL to the current hierarchy CSV (used as a template).
      const url = await downloadSampleCsv(contentId);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sample_hierarchy.csv';
      a.target = '_blank';
      a.click();
    } catch {
      setErrorMsg(lbl.csvUpload.downloadSampleFailed);
    }
  }, [contentId, lbl.csvUpload.downloadSampleFailed]);

  const handleUpload = useCallback(async () => {
    if (!selectedFile) return;

    setStatus('uploading');
    setErrorMsg('');
    setFailedRecords([]);

    try {
      const { processId } = await uploadCsvHierarchy(contentId, selectedFile);

      // Synchronous import (no async process id) — treat as immediate success.
      if (!processId) {
        setStatus('done');
        setSuccessCount(null);
        setTimeout(onComplete, 1500);
        return;
      }

      setStatus('processing');

      pollRef.current = setInterval(async () => {
        try {
          const result = await getCsvUploadStatus(processId);
          if (result.status === 'COMPLETED') {
            stopPolling();
            setStatus('done');
            setSuccessCount(result.successCount ?? null);
            if (result.failedRecords && result.failedRecords.length > 0) {
              setFailedRecords(result.failedRecords as FailedRecord[]);
            } else {
              // Auto-close after short delay when fully successful
              setTimeout(onComplete, 1500);
            }
          } else if (result.status === 'FAILED') {
            stopPolling();
            setStatus('error');
            setErrorMsg(lbl.csvUpload.processingFailed);
            if (result.failedRecords) {
              setFailedRecords(result.failedRecords as FailedRecord[]);
            }
          }
        } catch {
          stopPolling();
          setStatus('error');
          setErrorMsg(lbl.csvUpload.connectionLost);
        }
      }, 2000);
    } catch {
      setStatus('error');
      setErrorMsg(lbl.csvUpload.uploadFailed);
    }
  }, [contentId, selectedFile, onComplete, stopPolling, lbl.csvUpload.processingFailed, lbl.csvUpload.connectionLost, lbl.csvUpload.uploadFailed]);

  const statusLabel: Record<UploadStatus, string> = {
    idle: '',
    uploading: lbl.csvUpload.statusUploading,
    processing: lbl.csvUpload.statusProcessing,
    done: lbl.csvUpload.statusDone,
    error: lbl.csvUpload.statusError,
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          {mode === 'update' ? lbl.csvUpload.titleUpdate : lbl.csvUpload.titleCreate}
        </h2>
        <button className={styles.closeBtn} onClick={onClose} aria-label={lbl.csvUpload.closeAriaLabel}>
          <X size={18} />
        </button>
      </div>

      <div className={styles.body}>
        {/* Drag-and-drop zone */}
        <div
          className={`${styles.dropZone} ${isDragOver ? styles.dragOver : ''} ${selectedFile ? styles.hasFile : ''}`}
          onDragEnter={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={(e) => { e.preventDefault(); setIsDragOver(false); }}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          aria-label={lbl.csvUpload.dropZoneAriaLabel}
          onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            className={styles.hiddenInput}
            onChange={handleInputChange}
            aria-hidden="true"
          />
          {selectedFile ? (
            <div className={styles.fileInfo}>
              <FileText size={24} className={styles.fileIcon} />
              <span className={styles.fileName}>{selectedFile.name}</span>
              <span className={styles.fileSize}>
                ({(selectedFile.size / 1024).toFixed(1)} KB)
              </span>
            </div>
          ) : (
            <div className={styles.dropHint}>
              <Upload size={32} className={styles.dropIcon} />
              <p className={styles.dropText}>{lbl.csvUpload.dropText}</p>
              <p className={styles.dropSubtext}>{lbl.csvUpload.dropSubtext}</p>
            </div>
          )}
        </div>

        {/* Download sample link */}
        <button
          className={styles.sampleLink}
          onClick={handleDownloadSample}
          type="button"
        >
          {lbl.csvUpload.downloadSample}
        </button>

        {/* Status indicator */}
        {status !== 'idle' && (
          <div
            className={`${styles.statusBar} ${styles[`status_${status}`]}`}
            role="status"
            aria-live="polite"
          >
            {status === 'processing' && (
              <span className={styles.spinner} aria-hidden="true" />
            )}
            {statusLabel[status]}
            {status === 'done' && successCount !== null && (
              <span className={styles.successDetail}>
                {lbl.csvUpload.itemsImportedSuffix.replace('{count}', String(successCount))}
              </span>
            )}
          </div>
        )}

        {/* Inline error */}
        {errorMsg && (
          <p className={styles.errorMsg} role="alert">{errorMsg}</p>
        )}

        {/* Failed records table */}
        {failedRecords.length > 0 && (
          <div className={styles.failedSection}>
            <h4 className={styles.failedTitle}>
              {lbl.csvUpload.failedRowsTitle.replace('{count}', String(failedRecords.length))}
            </h4>
            <div className={styles.tableWrap}>
              <table className={styles.failedTable}>
                <thead>
                  <tr>
                    <th>{lbl.csvUpload.rowHeader}</th>
                    <th>{lbl.csvUpload.nameHeader}</th>
                    <th>{lbl.csvUpload.reasonHeader}</th>
                  </tr>
                </thead>
                <tbody>
                  {failedRecords.map((row, idx) => (
                    <tr key={idx}>
                      <td>{row.rowNumber ?? idx + 1}</td>
                      <td>{row.name ?? '—'}</td>
                      <td className={styles.reasonCell}>{row.reason ?? lbl.csvUpload.unknownError}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <div className={styles.footer}>
        <Button variant="ghost" onClick={onClose} disabled={status === 'uploading' || status === 'processing'}>
          {lbl.csvUpload.cancel}
        </Button>
        <Button
          variant="primary"
          isLoading={status === 'uploading' || status === 'processing'}
          disabled={!selectedFile || status === 'done'}
          onClick={handleUpload}
        >
          {status === 'done' ? lbl.csvUpload.uploaded : lbl.csvUpload.upload}
        </Button>
      </div>
    </div>
  );
};
