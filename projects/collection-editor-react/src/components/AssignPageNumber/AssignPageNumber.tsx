import React, { useState, useCallback } from 'react';
import { X, Save } from 'lucide-react';
import { useTreeStore } from '../../store/tree.store';
import type { INode } from '../../types/editor';
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
    <div className={styles.overlay} role="dialog" aria-label="Assign Page Numbers">
      <div className={styles.modal}>
        <div className={styles.header}>
          <span>Assign Page Numbers</span>
          <button onClick={onClose} aria-label="Close"><X size={16} /></button>
        </div>
        <div className={styles.body}>
          {leaves.length === 0 ? (
            <p className={styles.empty}>No content items found in this collection.</p>
          ) : (
            <table className={styles.table}>
              <thead><tr><th>Content</th><th>Page Number</th></tr></thead>
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
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button className={styles.saveBtn} onClick={handleSave}><Save size={14} /> Save</button>
        </div>
      </div>
    </div>
  );
};
