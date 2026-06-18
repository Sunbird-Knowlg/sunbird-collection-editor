import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Search, Upload, X, Check, Loader } from 'lucide-react';
import { apiClient } from '../../../api/client';
import { useEditorStore } from '../../../store/editor.store';
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

  // Upload tab handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setUploadError('Only image files are accepted.');
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setUploadError('Image must be under 4 MB.');
      return;
    }
    setUploadFile(file);
    setUploadPreview(URL.createObjectURL(file));
    setUploadError('');
  };

  const handleUpload = async () => {
    if (!uploadFile) return;
    setIsUploading(true);
    setUploadError('');
    try {
      const formData = new FormData();
      formData.append('file', uploadFile);
      const resp = await apiClient.post(
        `/action/content/v3/upload/${nodeId}?fileType=image`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } },
      );
      const url = resp.data?.result?.artifactUrl as string | undefined;
      if (!url) throw new Error('No URL in response');
      onSelect(url);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setIsUploading(false);
    }
  };

  const hasMore = images.length < totalCount;

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="Select App Icon">
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.header}>
          <span className={styles.title}>Select App Icon</span>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className={styles.tabs} role="tablist">
          <button role="tab" aria-selected={tab === 'my'} className={`${styles.tab} ${tab === 'my' ? styles.activeTab : ''}`} onClick={() => setTab('my')}>My Images</button>
          <button role="tab" aria-selected={tab === 'all'} className={`${styles.tab} ${tab === 'all' ? styles.activeTab : ''}`} onClick={() => setTab('all')}>All Images</button>
          <button role="tab" aria-selected={tab === 'upload'} className={`${styles.tab} ${tab === 'upload' ? styles.activeTab : ''}`} onClick={() => setTab('upload')}>
            <Upload size={13} style={{ marginRight: 4 }} />
            Upload
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
                  placeholder="Search images…"
                  value={query}
                  onChange={e => handleQueryChange(e.target.value)}
                />
              </div>

              {/* Image grid */}
              {isLoading && images.length === 0 ? (
                <div className={styles.loadingRow}>
                  <Loader size={20} className={styles.spinner} />
                  <span>Loading…</span>
                </div>
              ) : images.length === 0 ? (
                <div className={styles.empty}>No images found</div>
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
                          <div className={styles.noThumb}>IMG</div>
                        )}
                        {isSelected && <div className={styles.checkBadge}><Check size={12} /></div>}
                      </button>
                    );
                  })}
                </div>
              )}

              {hasMore && !isLoading && (
                <button className={styles.loadMoreBtn} onClick={handleLoadMore}>Load More</button>
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
                  <img src={uploadPreview} alt="Preview" className={styles.uploadPreview} />
                ) : (
                  <>
                    <Upload size={32} className={styles.uploadIcon} />
                    <p className={styles.dropText}>Drag &amp; drop or click to browse</p>
                    <p className={styles.dropSubtext}>PNG, JPG, SVG · max 4 MB</p>
                  </>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" className={styles.hiddenInput} onChange={handleFileChange} />
              {uploadFile && <p className={styles.fileName}>{uploadFile.name}</p>}
              {uploadError && <p className={styles.errorText}>{uploadError}</p>}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          {tab === 'upload' ? (
            <button
              className={styles.confirmBtn}
              disabled={!uploadFile || isUploading}
              onClick={handleUpload}
            >
              {isUploading ? <><Loader size={14} className={styles.spinner} /> Uploading…</> : 'Upload & Use'}
            </button>
          ) : (
            <button
              className={styles.confirmBtn}
              disabled={!selected}
              onClick={handleConfirmSelect}
            >
              Use Selected
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
