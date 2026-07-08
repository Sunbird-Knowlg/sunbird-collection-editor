import React, { useState } from 'react';
import { ImageIcon, Trash2 } from 'lucide-react';
import { AppIconPickerModal } from '../SparkMetaForm/fields/AppIconPickerModal';
import { useTreeStore } from '../../store/tree.store';
import styles from './TitleAppIcon.module.scss';

interface TitleAppIconProps {
  nodeId: string;
  value?: string;
  editable: boolean;
}

export const TitleAppIcon: React.FC<TitleAppIconProps> = ({ nodeId, value, editable }) => {
  const [pickerOpen, setPickerOpen] = useState(false);
  const { updateNode, markDirty } = useTreeStore();

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
        aria-label={editable ? 'Select app icon' : 'App icon'}
        onClick={() => editable && setPickerOpen(true)}
        onKeyDown={e => { if (editable && (e.key === 'Enter' || e.key === ' ')) setPickerOpen(true); }}
      >
        {value ? (
          <img src={value} alt="App icon" className={styles.iconImg} />
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
            aria-label="Remove icon"
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
