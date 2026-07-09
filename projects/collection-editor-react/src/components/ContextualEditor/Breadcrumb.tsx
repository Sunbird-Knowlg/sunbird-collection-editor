import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { useTreeStore } from '../../store/tree.store';
import { useLabels } from '../../hooks/useLabels';
import styles from './Breadcrumb.module.scss';

interface BreadcrumbProps {
  crumbs: Array<{ id: string; name: string }>;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ crumbs }) => {
  const selectNode = useTreeStore(s => s.selectNode);
  const lbl = useLabels();
  if (!crumbs.length) return null;

  return (
    <nav className={styles.breadcrumb} aria-label={lbl.breadcrumb.nodePathAriaLabel}>
      <button className={styles.crumb} onClick={() => selectNode(crumbs[0].id)} aria-label={lbl.breadcrumb.homeAriaLabel}>
        <Home size={13} />
      </button>
      {crumbs.map((crumb, i) => (
        <React.Fragment key={crumb.id}>
          <ChevronRight size={13} className={styles.sep} />
          {i < crumbs.length - 1 ? (
            <button className={styles.crumb} onClick={() => selectNode(crumb.id)}>
              {crumb.name}
            </button>
          ) : (
            <span className={styles.current}>{crumb.name}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
