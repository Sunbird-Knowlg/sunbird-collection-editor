import React from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import type { IContent } from '../../types/content';
import type { EditorMode, INode } from '../../types/editor';
import { ContentPlayer } from '../ContentPlayer';
import { useLabels } from '../../hooks/useLabels';
import styles from './LibraryPreviewPanel.module.scss';

const QUESTIONSET_MIME = 'application/vnd.sunbird.questionset';

interface LibraryPreviewPanelProps {
  content: IContent | null;
  editorMode: EditorMode;
  onAdd: (item: IContent) => void;
  onClose: () => void;
}

/**
 * Content preview shown when a library item is selected. Opens directly as a
 * centered modal (portaled to body so it escapes the dock's stacking context).
 */
export const LibraryPreviewPanel: React.FC<LibraryPreviewPanelProps> = ({
  content,
  editorMode,
  onAdd,
  onClose,
}) => {
  const lbl = useLabels();
  const isEditable = editorMode === 'edit';
  if (!content) return null;

  // Convert IContent to INode — ContentPlayer fetches full details by identifier
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

  return createPortal(
    <div
      className={styles.modalOverlay}
      role="dialog"
      aria-modal="true"
      aria-label={lbl.libraryPreviewPanel.contentPreviewAriaLabel}
      onClick={onClose}
    >
      <div className={styles.modalPanel} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <span className={styles.title} title={content.name}>
            {content.name}
          </span>
          <div className={styles.headerActions}>
            <button
              type="button"
              className={styles.iconBtn}
              onClick={onClose}
              aria-label={lbl.libraryPreviewPanel.closePreviewAriaLabel}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div className={styles.playerArea}>
          {/* QuestionSets preview via the QuML player (whole set); everything
              else goes through the content players. */}
          <ContentPlayer
            node={node}
            editorMode="read"
            type={content.mimeType === QUESTIONSET_MIME ? 'quml' : 'content'}
          />
        </div>

        {isEditable && (
          <div className={styles.footer}>
            <button
              type="button"
              className={styles.addBtn}
              onClick={() => onAdd(content)}
            >
              {lbl.libraryPreviewPanel.addToUnitButton}
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
};
