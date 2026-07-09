import React, { useState } from 'react';
import { X, FolderOpen } from 'lucide-react';
import { useTreeStore } from '../../store/tree.store';
import type { INode } from '../../types/editor';
import { useLabels } from '../../hooks/useLabels';
import styles from './ResourceReorderDialog.module.scss';

interface ResourceReorderDialogProps {
  resourceId: string;
  resourceName: string;
  currentUnitId: string;
  onClose: () => void;
}

function collectFolders(nodes: INode[], rootId: string, exclude?: string): INode[] {
  const folders: INode[] = [];
  const walk = (ns: INode[]) => {
    for (const n of ns) {
      if (n.isFolder && n.id !== exclude && n.id !== rootId) folders.push(n);
      if (n.children?.length) walk(n.children);
    }
  };
  walk(nodes);
  return folders;
}

export const ResourceReorderDialog: React.FC<ResourceReorderDialogProps> = ({
  resourceId, resourceName, currentUnitId, onClose,
}) => {
  const lbl = useLabels();
  const { treeData, moveNode } = useTreeStore();
  const folders = collectFolders(treeData, treeData[0]?.id ?? '', currentUnitId);
  const [selected, setSelected] = useState<string | null>(null);

  const handleMove = () => {
    if (!selected) return;
    moveNode(resourceId, currentUnitId, selected);
    onClose();
  };

  return (
    <div className={styles.overlay} role="dialog" aria-label={lbl.resourceReorderDialog.dialogAriaLabel}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <span>{lbl.resourceReorderDialog.moveHeaderPrefix} &quot;{resourceName}&quot;</span>
          <button onClick={onClose} aria-label={lbl.resourceReorderDialog.closeAriaLabel}><X size={16} /></button>
        </div>
        <div className={styles.body}>
          <p className={styles.hint}>{lbl.resourceReorderDialog.selectUnitHint}</p>
          <ul className={styles.list}>
            {folders.map(f => (
              <li
                key={f.id}
                className={`${styles.item} ${selected === f.id ? styles.selected : ''}`}
                onClick={() => setSelected(f.id)}
              >
                <FolderOpen size={14} />
                <span>{f.name}</span>
              </li>
            ))}
            {folders.length === 0 && <li className={styles.empty}>{lbl.resourceReorderDialog.noUnitsAvailable}</li>}
          </ul>
        </div>
        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onClose}>{lbl.resourceReorderDialog.cancelButton}</button>
          <button className={styles.moveBtn} onClick={handleMove} disabled={!selected}>{lbl.resourceReorderDialog.moveButton}</button>
        </div>
      </div>
    </div>
  );
};
