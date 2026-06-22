import React, { useState } from 'react';
import { X, FolderOpen } from 'lucide-react';
import { useTreeStore } from '../../store/tree.store';
import type { INode } from '../../types/editor';
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
  const { treeData, moveNode } = useTreeStore();
  const folders = collectFolders(treeData, treeData[0]?.id ?? '', currentUnitId);
  const [selected, setSelected] = useState<string | null>(null);

  const handleMove = () => {
    if (!selected) return;
    moveNode(resourceId, currentUnitId, selected);
    onClose();
  };

  return (
    <div className={styles.overlay} role="dialog" aria-label="Move resource">
      <div className={styles.modal}>
        <div className={styles.header}>
          <span>Move &quot;{resourceName}&quot;</span>
          <button onClick={onClose} aria-label="Close"><X size={16} /></button>
        </div>
        <div className={styles.body}>
          <p className={styles.hint}>Select a unit to move this content to:</p>
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
            {folders.length === 0 && <li className={styles.empty}>No other units available</li>}
          </ul>
        </div>
        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button className={styles.moveBtn} onClick={handleMove} disabled={!selected}>Move here</button>
        </div>
      </div>
    </div>
  );
};
