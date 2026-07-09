import React, { useMemo, useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useTreeStore } from '../../store/tree.store';
import type { INode } from '../../types/editor';
import { useLabels } from '../../hooks/useLabels';
import styles from './ProgressStatus.module.scss';

interface Criterion {
  label: string;
  current: number;
  required: number;
}

interface ProgressStatusProps {
  criteria?: Criterion[];
}

function countNodes(nodes: INode[], isFolder: boolean): number {
  let count = 0;
  const walk = (ns: INode[]) => {
    for (const n of ns) {
      if (!!n.isFolder === isFolder) count++;
      if (n.children?.length) walk(n.children);
    }
  };
  walk(nodes);
  return count;
}

export const ProgressStatus: React.FC<ProgressStatusProps> = ({ criteria }) => {
  const lbl = useLabels();
  const [open, setOpen] = useState(false);
  const { treeData } = useTreeStore();

  const computed = useMemo<Criterion[]>(() => {
    if (criteria) return criteria;
    const units = countNodes(treeData, true);
    const content = countNodes(treeData, false);
    return [
      { label: lbl.progressStatus.unitsAddedLabel, current: units, required: 1 },
      { label: lbl.progressStatus.contentItemsLabel, current: content, required: 1 },
    ];
  }, [criteria, treeData, lbl]);

  const allGood = computed.every(c => c.current >= c.required);
  const barColor = (c: Criterion) => {
    if (c.current >= c.required) return 'var(--sbx-success)';
    if (c.current / c.required > 0.5) return 'var(--sbx-warning)';
    return 'var(--sbx-error)';
  };

  return (
    <div className={styles.container}>
      <button className={styles.toggle} onClick={() => setOpen(v => !v)}>
        <span className={`${styles.dot} ${allGood ? styles.green : styles.yellow}`} />
        <span>{lbl.progressStatus.progressLabel}</span>
        {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
      </button>
      {open && (
        <div className={styles.list}>
          {computed.map(c => (
            <div key={c.label} className={styles.row}>
              <div className={styles.rowLabel}>
                <span>{c.label}</span>
                <span className={styles.count}>{c.current} / {c.required}</span>
              </div>
              <div className={styles.track}>
                <div
                  className={styles.bar}
                  style={{
                    width: `${Math.min(100, (c.current / Math.max(c.required, 1)) * 100)}%`,
                    background: barColor(c),
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
