import React, { useState, useCallback } from 'react';
import { X, Save } from 'lucide-react';
import { useTreeStore } from '../../store/tree.store';
import type { INode } from '../../types/editor';
import { useLabels } from '../../hooks/useLabels';
import styles from './AssignPageNumber.module.scss';

interface AssignPageNumberProps {
  contentId: string;
  onClose: () => void;
}

function collectLeafNodes(nodes: INode[]): INode[] {
  const leaves: INode[] = [];
  const walk = (ns: INode[]) => {
    for (const n of ns) {
      if (!n.isFolder && (!n.children || n.children.length === 0)) {
        leaves.push(n);
      } else if (n.children?.length) {
        walk(n.children);
      }
    }
  };
  walk(nodes);
  return leaves;
}

export const AssignPageNumber: React.FC<AssignPageNumberProps> = ({ onClose }) => {
  const lbl = useLabels();
  const { treeData, updateNode } = useTreeStore();
  const leaves = collectLeafNodes(treeData);
  const [pageNumbers, setPageNumbers] = useState<Record<string, string>>(() =>
    Object.fromEntries(leaves.map(n => [n.id, String(n.metadata?.pageNumber ?? '')]))
  );

  const handleSave = useCallback(() => {
    for (const [id, val] of Object.entries(pageNumbers)) {
      if (val !== '') {
        updateNode(id, { pageNumber: parseInt(val, 10) || undefined });
      }
    }
    onClose();
  }, [pageNumbers, updateNode, onClose]);

  return (
    <div className={styles.overlay} role="dialog" aria-label={lbl.assignPageNumber.dialogAriaLabel}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <span>{lbl.assignPageNumber.title}</span>
          <button onClick={onClose} aria-label={lbl.assignPageNumber.closeAriaLabel}><X size={16} /></button>
        </div>
        <div className={styles.body}>
          {leaves.length === 0 ? (
            <p className={styles.empty}>{lbl.assignPageNumber.emptyState}</p>
          ) : (
            <table className={styles.table}>
              <thead><tr><th>{lbl.assignPageNumber.contentColumnHeader}</th><th>{lbl.assignPageNumber.pageNumberColumnHeader}</th></tr></thead>
              <tbody>
                {leaves.map(n => (
                  <tr key={n.id}>
                    <td>{n.name}</td>
                    <td>
                      <input
                        type="number"
                        min={1}
                        value={pageNumbers[n.id] ?? ''}
                        onChange={e => setPageNumbers(prev => ({ ...prev, [n.id]: e.target.value }))}
                        className={styles.pageInput}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onClose}>{lbl.assignPageNumber.cancelButton}</button>
          <button className={styles.saveBtn} onClick={handleSave}><Save size={14} /> {lbl.assignPageNumber.saveButton}</button>
        </div>
      </div>
    </div>
  );
};
