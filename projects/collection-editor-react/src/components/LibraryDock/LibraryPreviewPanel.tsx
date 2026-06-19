import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Maximize2, Minimize2 } from 'lucide-react';
import type { IContent } from '../../types/content';
import type { INode } from '../../types/editor';
import { ContentPlayer } from '../ContentPlayer';
import styles from './LibraryPreviewPanel.module.scss';

interface LibraryPreviewPanelProps {
  content: IContent | null;
  onAdd: (item: IContent) => void;
  onClose: () => void;
}

export const LibraryPreviewPanel: React.FC<LibraryPreviewPanelProps> = ({
  content,
  onAdd,
  onClose,
}) => {
  const [expanded, setExpanded] = useState(false);

  if (!content) return null;

  // Convert IContent to INode — ContentPlayer will fetch full details by identifier
  const node: INode = {
    id: content.identifier,
    identifier: content.identifier,
    name: content.name ?? '',
    mimeType: content.mimeType,
    primaryCategory: content.primaryCategory,
    contentType: content.contentType,
    appIcon: content.appIcon,
    status: content.status,
    isFolder: false,
    children: [],
    metadata: content as unknown as Record<string, unknown>,
  };

  const panelContent = (
    <>
      <div className={styles.header}>
        <span className={styles.title} title={content.name}>
          {content.name}
        </span>
        <div className={styles.headerActions}>
          <button
            type="button"
            className={styles.iconBtn}
            onClick={() => setExpanded(v => !v)}
            aria-label={expanded ? 'Collapse preview' : 'Expand preview'}
            title={expanded ? 'Collapse' : 'Expand'}
          >
            {expanded ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>
          <button
            type="button"
            className={styles.iconBtn}
            onClick={onClose}
            aria-label="Close preview"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      <div className={styles.playerArea}>
        <ContentPlayer node={node} editorMode="read" type="content" />
      </div>

      <div className={styles.footer}>
        <button
          type="button"
          className={styles.addBtn}
          onClick={() => onAdd(content)}
        >
          + Add to Unit
        </button>
      </div>
    </>
  );

  if (expanded) {
    // Portal to body so the modal escapes the library dock's stacking context
    // (.sidePanelOverlay is a positioned, z-indexed ancestor that would otherwise trap it).
    return createPortal(
      <div className={styles.modalOverlay} role="dialog" aria-modal="true" aria-label="Content preview">
        <div className={styles.modalPanel}>
          {panelContent}
        </div>
      </div>,
      document.body,
    );
  }

  return (
    <div className={styles.panel}>
      {panelContent}
    </div>
  );
};
