import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, X, Video, FileText, Layers, Package, Music, HelpCircle, File } from 'lucide-react';
import type { INode } from '../../types/editor';
import { getCtStyle } from '../../hooks/useContentType';
import { useLabels } from '../../hooks/useLabels';
import styles from './ContentRow.module.scss';

const CT_ICONS: Record<string, React.ElementType> = {
  video: Video, pdf: FileText, h5p: Layers, scorm: Package,
  audio: Music, quiz: HelpCircle, default: File,
};

interface ContentRowProps {
  item: INode;
  onRemove: (id: string) => void;
  isEditable: boolean;
}

export const ContentRow: React.FC<ContentRowProps> = ({ item, onRemove, isEditable }) => {
  const lbl = useLabels();
  const ctStyle = getCtStyle(item);
  const CtIcon = CT_ICONS[ctStyle.key] ?? File;

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
    disabled: !isEditable,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className={styles.row} role="listitem">
      {/* Drag grip */}
      {isEditable && (
        <span className={styles.grip} {...attributes} {...listeners} aria-label={lbl.contentRow.dragToReorderAriaLabel}>
          <GripVertical size={15} />
        </span>
      )}

      {/* CT icon */}
      <span className={[`sbx-ct-sq--${ctStyle.key}`, styles.ctIcon].join(' ')} aria-hidden="true">
        <CtIcon size={14} />
      </span>

      {/* Info */}
      <div className={styles.info}>
        <span className={styles.name} title={item.name}>{item.name}</span>
        <span className={styles.meta}>{ctStyle.label}</span>
      </div>

      {/* CT badge */}
      <span className={`sbx-ct-badge--${ctStyle.key}`}>{ctStyle.label}</span>

      {/* Remove */}
      {isEditable && (
        <button
          type="button"
          className={styles.removeBtn}
          onClick={() => onRemove(item.id)}
          aria-label={lbl.contentRow.removeAriaLabel.replace('{name}', item.name)}
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};
