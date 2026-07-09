import React, { useState } from 'react';
import { ImageIcon, Trash2 } from 'lucide-react';
import { AppIconPickerModal } from '../SparkMetaForm/fields/AppIconPickerModal';
import { useTreeStore } from '../../store/tree.store';
import { useLabels } from '../../hooks/useLabels';
import styles from './TitleAppIcon.module.scss';

interface TitleAppIconProps {
  nodeId: string;
  value?: string;
  editable: boolean;
}

export const TitleAppIcon: React.FC<TitleAppIconProps> = ({ nodeId, value, editable }) => {
  const [pickerOpen, setPickerOpen] = useState(false);
  const { updateNode, markDirty } = useTreeStore();
  const lbl = useLabels();

  const handleSelect = (url: string) => {
    updateNode(nodeId, { appIcon: url });
    markDirty();
    setPickerOpen(false);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateNode(nodeId, { appIcon: '' });
    markDirty();
  };

  return (
    <>
      <div
        className={[styles.iconBtn, editable ? styles.editable : ''].filter(Boolean).join(' ')}
        role={editable ? 'button' : undefined}
        tabIndex={editable ? 0 : -1}
        aria-label={editable ? lbl.titleAppIcon.selectAppIconAriaLabel : lbl.titleAppIcon.appIconAriaLabel}
        onClick={() => editable && setPickerOpen(true)}
        onKeyDown={e => { if (editable && (e.key === 'Enter' || e.key === ' ')) setPickerOpen(true); }}
      >
        {value ? (
          <img src={value} alt={lbl.titleAppIcon.appIconAlt} className={styles.iconImg} />
        ) : (
          <div className={styles.placeholder}>
            <ImageIcon size={18} />
          </div>
        )}
        {value && editable && (
          <button
            type="button"
            className={styles.removeBtn}
            onClick={handleRemove}
            aria-label={lbl.titleAppIcon.removeIconAriaLabel}
          >
            <Trash2 size={11} />
          </button>
        )}
      </div>

      {pickerOpen && (
        <AppIconPickerModal
          nodeId={nodeId}
          currentValue={value}
          onSelect={handleSelect}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </>
  );
};
