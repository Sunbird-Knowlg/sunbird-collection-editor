import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Plus, Video, FileText, Layers, Package, Music, HelpCircle, File, Check } from 'lucide-react';
import type { IContent } from '../../types/content';
import { getCtStyle } from '../../hooks/useContentType';
import { useIsDraftStatus, useSelectedNodeIsUnit } from '../../hooks/useContentStatus';
import styles from './LibraryCard.module.scss';

const CT_ICONS: Record<string, React.ElementType> = {
  video: Video, pdf: FileText, h5p: Layers, scorm: Package,
  audio: Music, quiz: HelpCircle, default: File,
};

interface LibraryCardProps {
  item: IContent;
  onAdd: (item: IContent) => void;
  onPreview?: (item: IContent) => void;
  isDraggable?: boolean;
  isAdded?: boolean;
}

export const LibraryCard: React.FC<LibraryCardProps> = ({
  item,
  onAdd,
  onPreview,
  isDraggable,
  isAdded,
}) => {
  const ctStyle = getCtStyle(item);
  const CtIcon = CT_ICONS[ctStyle.key] ?? File;
  const isDraft = useIsDraftStatus();
  const isUnitSelected = useSelectedNodeIsUnit();
  // Content can only be added while the collection is in Draft and a unit is selected.
  const canAdd = isDraft && !isAdded && isUnitSelected;

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: item.identifier,
    disabled: !isDraggable || !isDraft || !isUnitSelected,
    data: { type: 'library-item', item },
  });

  const handleCardClick = () => {
    if (onPreview) {
      onPreview(item);
    }
  };

  return (
    <div
      ref={setNodeRef}
      className={[
        styles.card,
        isDragging ? styles.dragging : '',
        isAdded ? styles.added : '',
      ].join(' ')}
      aria-label={item.name}
      {...(isDraggable ? { ...attributes, ...listeners } : {})}
      role="listitem"
      onClick={handleCardClick}
    >
      {/* CT icon */}
      <span className={[`sbx-ct-sq--${ctStyle.key}`, styles.ctIcon].join(' ')} aria-hidden="true">
        <CtIcon size={14} />
      </span>

      {/* Info */}
      <div className={styles.info}>
        <span className={styles.name} title={item.name}>{item.name}</span>
        <span className={styles.meta}>
          {item.organisation?.[0] ?? item.channel ?? ''}
          {item.organisation?.[0] && item.primaryCategory ? ' · ' : ''}
          {item.primaryCategory ?? ''}
        </span>
      </div>

      {/* Already-added badge */}
      {isAdded && (
        <span className={styles.addedBadge} aria-label="Already added" title="Already added to this collection">
          <Check size={12} />
        </span>
      )}

      {/* Add button — hidden when already added; disabled for non-Draft content */}
      {!isAdded && (
        <button
          type="button"
          className={styles.addBtn}
          onClick={(e) => { e.stopPropagation(); if (canAdd) onAdd(item); }}
          disabled={!canAdd}
          aria-label={`Add ${item.name} to unit`}
          title={isDraft ? 'Add to unit' : 'Only Draft content can be edited'}
        >
          <Plus size={14} />
        </button>
      )}
    </div>
  );
};
