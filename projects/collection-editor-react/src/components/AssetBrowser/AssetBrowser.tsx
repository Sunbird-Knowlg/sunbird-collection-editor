import React, { useState, useCallback, useRef } from 'react';
import { Search, Upload, X } from 'lucide-react';
import { compositeSearch } from '../../api/content';
import { apiClient } from '../../api/client';
import type { IContent } from '../../types/content';
import { useLabels } from '../../hooks/useLabels';
import styles from './AssetBrowser.module.scss';

interface AssetBrowserProps {
  type?: 'image' | 'video' | 'audio' | 'all';
  onSelect: (url: string, asset: Record<string, unknown>) => void;
  onClose: () => void;
}

export const AssetBrowser: React.FC<AssetBrowserProps> = ({ type = 'all', onSelect, onClose }) => {
  const lbl = useLabels();
  const [tab, setTab] = useState<'browse' | 'upload'>('browse');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<IContent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const mimeMap: Record<string, string[]> = {
    image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    video: ['video/mp4', 'video/webm'],
    audio: ['audio/mp3', 'audio/mpeg', 'audio/ogg'],
    all: [],
  };

  const doSearch = useCallback(async (q: string) => {
    setIsLoading(true);
    try {
      const mimes = mimeMap[type];
      const filters: Record<string, unknown> = { status: ['Live'] };
      if (mimes.length) filters['mimeType'] = mimes;
      const { content } = await compositeSearch({ query: q, filters, limit: 30, fields: ['identifier','name','mimeType','artifactUrl','appIcon'] });
      setResults(content);
    } finally {
      setIsLoading(false);
    }
  }, [type]);

  const handleUpload = useCallback(async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const resp = await apiClient.post(
        `/action/content/v3/upload?fileType=${type === 'image' ? 'image' : 'asset'}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      const url = resp.data?.result?.artifactUrl as string;
      if (url) onSelect(url, { artifactUrl: url, name: file.name });
    } finally {
      setUploading(false);
    }
  }, [type, onSelect]);

  return (
    <div className={styles.overlay} role="dialog" aria-label={lbl.assetBrowser.dialogAriaLabel}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <span>{lbl.assetBrowser.title}</span>
          <button onClick={onClose} aria-label={lbl.assetBrowser.closeAriaLabel}><X size={16} /></button>
        </div>
        <div className={styles.tabs}>
          <button className={tab === 'browse' ? styles.activeTab : ''} onClick={() => setTab('browse')}>{lbl.assetBrowser.browseTab}</button>
          <button className={tab === 'upload' ? styles.activeTab : ''} onClick={() => setTab('upload')}>{lbl.assetBrowser.uploadTab}</button>
        </div>
        {tab === 'browse' ? (
          <div className={styles.body}>
            <div className={styles.searchRow}>
              <Search size={14} />
              <input
                type="search"
                placeholder={lbl.assetBrowser.searchPlaceholder}
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && doSearch(query)}
              />
              <button onClick={() => doSearch(query)}>{lbl.assetBrowser.searchButton}</button>
            </div>
            {isLoading ? <p className={styles.info}>{lbl.assetBrowser.loadingMessage}</p> : null}
            <div className={styles.grid}>
              {results.map(item => {
                const thumb = (item as unknown as Record<string, unknown>).appIcon as string ?? (item as unknown as Record<string, unknown>).artifactUrl as string ?? '';
                return (
                  <div key={item.identifier} className={styles.card} onClick={() => onSelect((item as unknown as Record<string, unknown>).artifactUrl as string ?? '', item as unknown as Record<string, unknown>)}>
                    {thumb && <img src={thumb} alt={item.name} />}
                    <span>{item.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className={styles.body}>
            <input ref={fileRef} type="file" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) handleUpload(f); }} />
            <button className={styles.uploadBtn} onClick={() => fileRef.current?.click()} disabled={uploading}>
              <Upload size={16} /> {uploading ? lbl.assetBrowser.uploadingMessage : lbl.assetBrowser.chooseFileButton}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
