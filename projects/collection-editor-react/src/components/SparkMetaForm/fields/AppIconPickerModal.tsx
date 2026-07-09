import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Search, Upload, X, Check, Loader } from 'lucide-react';
import { apiClient } from '../../../api/client';
import { createMediaAsset, getPreSignedUrl, uploadToBlob, finalizeAssetUpload } from '../../../api/asset';
import { useEditorStore } from '../../../store/editor.store';
import { useLabels } from '../../../hooks/useLabels';
import styles from './AppIconPickerModal.module.scss';

interface ImageAsset {
  identifier: string;
  name: string;
  appIcon?: string;
  artifactUrl?: string;
  downloadUrl?: string;
}

interface AppIconPickerModalProps {
  nodeId: string;
  currentValue?: string;
  onSelect: (url: string) => void;
  onClose: () => void;
}

const PAGE_SIZE = 18;

export const AppIconPickerModal: React.FC<AppIconPickerModalProps> = ({
  nodeId,
  currentValue,
  onSelect,
  onClose,
}) => {
  const lbl = useLabels();
  const [tab, setTab] = useState<'my' | 'all' | 'upload'>('my');
  const [query, setQuery] = useState('');
  const [images, setImages] = useState<ImageAsset[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selected, setSelected] = useState<ImageAsset | null>(null);
  const [offset, setOffset] = useState(0);

  // Upload tab state
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const channel = useEditorStore(s => s.editorConfig?.context?.channel ?? '');
  const uid = useEditorStore(s => s.editorConfig?.context?.uid ?? '');
  const presignedHeaders = useEditorStore(
    s => (s.editorConfig?.context?.cloudStorage?.presigned_headers ?? {}) as Record<string, string>,
  );
  // Read tenant-configured asset limits; default to 1 MB / png+jpeg (no SVG — XSS risk)
  const assetMaxBytes = useEditorStore(s => s.editorConfig?.config?.assetConfig?.size ?? 1 * 1024 * 1024);
  const assetAccept = useEditorStore(s => s.editorConfig?.config?.assetConfig?.accepted ?? 'image/png,image/jpeg');

  const searchImages = useCallback(async (q: string, off: number, append = false) => {
    setIsLoading(true);
    try {
      const filters: Record<string, unknown> = {
        status: ['Live'],
        mediaType: ['image'],
        mimeType: ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/svg+xml'],
      };
      if (tab === 'my' && uid) filters['createdBy'] = uid;
      if (channel) filters['channel'] = channel;

      const resp = await apiClient.post('/action/composite/v3/search', {
        request: {
          filters,
          query: q,
          limit: PAGE_SIZE,
          offset: off,
          sort_by: { createdOn: 'desc' },
          fields: ['identifier', 'name', 'appIcon', 'artifactUrl', 'downloadUrl'],
        },
      }, { headers: { 'X-Source': 'web' } });

      const result = resp.data?.result ?? {};
      const items = (result.content ?? []) as ImageAsset[];
      setTotalCount(result.count ?? 0);
      setImages(prev => append ? [...prev, ...items] : items);
    } catch {
      // silent
    } finally {
      setIsLoading(false);
    }
  }, [tab, uid, channel]);

  // Initial load
  useEffect(() => {
    if (tab !== 'upload') {
      setImages([]);
      setOffset(0);
      searchImages(query, 0);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  // Debounced search
  const searchTimer = useRef<ReturnType<typeof setTimeout>>();
  const handleQueryChange = (q: string) => {
    setQuery(q);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setImages([]);
      setOffset(0);
      searchImages(q, 0);
    }, 400);
  };

  const handleLoadMore = () => {
    const newOffset = offset + PAGE_SIZE;
    setOffset(newOffset);
    searchImages(query, newOffset, true);
  };

  const handleConfirmSelect = () => {
    const url = selected?.artifactUrl ?? selected?.appIcon ?? selected?.downloadUrl ?? '';
    if (url) onSelect(url);
  };

  // Revoke the Object URL when the component unmounts or when preview changes
  React.useEffect(() => {
    return () => {
      if (uploadPreview) URL.revokeObjectURL(uploadPreview);
    };
  }, [uploadPreview]);

  // Upload tab handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    // Validate MIME type against the configured allowlist (default: png + jpeg, no SVG)
    const allowedTypes = assetAccept.split(',').map(t => t.trim());
    if (!allowedTypes.includes(file.type)) {
      const readableTypes = allowedTypes.map(t => t.replace('image/', '').toUpperCase()).join(', ');
      setUploadError(lbl.appIconPickerModal.invalidFileTypeError.replace('{types}', readableTypes));
      return;
    }
    if (file.size > assetMaxBytes) {
      const mb = (assetMaxBytes / (1024 * 1024)).toFixed(0);
      setUploadError(lbl.appIconPickerModal.fileTooLargeError.replace('{size}', mb));
      return;
    }
    // Revoke previous preview before creating a new one to avoid blob URL leaks
    if (uploadPreview) URL.revokeObjectURL(uploadPreview);
    setUploadFile(file);
    setUploadPreview(URL.createObjectURL(file));
    setUploadError('');
  };

  const handleUpload = async () => {
    if (!uploadFile) return;
    setIsUploading(true);
    setUploadError('');
    try {
      // Step 1: Register a new asset node in Sunbird
      const assetId = await createMediaAsset(
        uploadFile.name.split('.').slice(0, -1).join('.') || uploadFile.name,
        uploadFile.type,
        uid,
        channel,
      );
      // Step 2: Get Azure pre-signed upload URL
      const signedUrl = await getPreSignedUrl(assetId, uploadFile.name);
      // Step 3: PUT raw file bytes directly to blob storage
      await uploadToBlob(signedUrl, uploadFile, presignedHeaders);
      // Step 4: Finalize — link blob URL to asset, get CDN content_url
      const fileUrl = signedUrl.split('?')[0];
      const contentUrl = await finalizeAssetUpload(assetId, fileUrl, uploadFile.type);
      onSelect(contentUrl);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : lbl.appIconPickerModal.uploadFailedError);
    } finally {
      setIsUploading(false);
    }
  };

  const hasMore = images.length < totalCount;

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label={lbl.appIconPickerModal.dialogAriaLabel}>
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.header}>
          <span className={styles.title}>{lbl.appIconPickerModal.title}</span>
          <button className={styles.closeBtn} onClick={onClose} aria-label={lbl.appIconPickerModal.closeAriaLabel}>
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className={styles.tabs} role="tablist">
          <button role="tab" aria-selected={tab === 'my'} className={`${styles.tab} ${tab === 'my' ? styles.activeTab : ''}`} onClick={() => setTab('my')}>{lbl.appIconPickerModal.myImagesTab}</button>
          <button role="tab" aria-selected={tab === 'all'} className={`${styles.tab} ${tab === 'all' ? styles.activeTab : ''}`} onClick={() => setTab('all')}>{lbl.appIconPickerModal.allImagesTab}</button>
          <button role="tab" aria-selected={tab === 'upload'} className={`${styles.tab} ${tab === 'upload' ? styles.activeTab : ''}`} onClick={() => setTab('upload')}>
            <Upload size={13} style={{ marginRight: 4 }} />
            {lbl.appIconPickerModal.uploadTab}
          </button>
        </div>

        <div className={styles.body}>
          {tab !== 'upload' ? (
            <>
              {/* Search */}
              <div className={styles.searchWrap}>
                <Search size={14} className={styles.searchIcon} />
                <input
                  type="search"
                  className={styles.searchInput}
                  placeholder={lbl.appIconPickerModal.searchPlaceholder}
                  value={query}
                  onChange={e => handleQueryChange(e.target.value)}
                />
              </div>

              {/* Image grid */}
              {isLoading && images.length === 0 ? (
                <div className={styles.loadingRow}>
                  <Loader size={20} className={styles.spinner} />
                  <span>{lbl.appIconPickerModal.loadingText}</span>
                </div>
              ) : images.length === 0 ? (
                <div className={styles.empty}>{lbl.appIconPickerModal.noImagesFound}</div>
              ) : (
                <div className={styles.grid}>
                  {images.map(img => {
                    const thumb = img.appIcon ?? img.artifactUrl ?? img.downloadUrl ?? '';
                    const isSelected = selected?.identifier === img.identifier;
                    return (
                      <button
                        key={img.identifier}
                        type="button"
                        className={`${styles.imgCell} ${isSelected ? styles.imgCellSelected : ''}`}
                        onClick={() => setSelected(img)}
                        title={img.name}
                      >
                        {thumb ? (
                          <img src={thumb} alt={img.name} className={styles.thumb} />
                        ) : (
                          <div className={styles.noThumb}>{lbl.appIconPickerModal.noThumbnailText}</div>
                        )}
                        {isSelected && <div className={styles.checkBadge}><Check size={12} /></div>}
                      </button>
                    );
                  })}
                </div>
              )}

              {hasMore && !isLoading && (
                <button className={styles.loadMoreBtn} onClick={handleLoadMore}>{lbl.appIconPickerModal.loadMoreButton}</button>
              )}
              {isLoading && images.length > 0 && (
                <div className={styles.loadingRow}><Loader size={16} className={styles.spinner} /></div>
              )}
            </>
          ) : (
            /* Upload tab */
            <div className={styles.uploadArea}>
              <div
                className={styles.dropZone}
                onClick={() => fileRef.current?.click()}
                onDragOver={e => e.preventDefault()}
                onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFileChange({ target: { files: [f], value: '' } } as unknown as React.ChangeEvent<HTMLInputElement>); }}
              >
                {uploadPreview ? (
                  <img src={uploadPreview} alt={lbl.appIconPickerModal.previewAlt} className={styles.uploadPreview} />
                ) : (
                  <>
                    <Upload size={32} className={styles.uploadIcon} />
                    <p className={styles.dropText}>{lbl.appIconPickerModal.dropZoneText}</p>
                    <p className={styles.dropSubtext}>
                      {lbl.appIconPickerModal.acceptedTypesInfo
                        .replace('{types}', assetAccept.split(',').map(t => t.replace('image/', '').toUpperCase()).join(', '))
                        .replace('{size}', (assetMaxBytes / (1024 * 1024)).toFixed(0))}
                    </p>
                  </>
                )}
              </div>
              <input ref={fileRef} type="file" accept={assetAccept} className={styles.hiddenInput} onChange={handleFileChange} />
              {uploadFile && <p className={styles.fileName}>{uploadFile.name}</p>}
              {uploadError && <p className={styles.errorText}>{uploadError}</p>}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onClose}>{lbl.appIconPickerModal.cancelButton}</button>
          {tab === 'upload' ? (
            <button
              className={styles.confirmBtn}
              disabled={!uploadFile || isUploading}
              onClick={handleUpload}
            >
              {isUploading ? <><Loader size={14} className={styles.spinner} /> {lbl.appIconPickerModal.uploadingText}</> : lbl.appIconPickerModal.uploadAndUseButton}
            </button>
          ) : (
            <button
              className={styles.confirmBtn}
              disabled={!selected}
              onClick={handleConfirmSelect}
            >
              {lbl.appIconPickerModal.useSelectedButton}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
