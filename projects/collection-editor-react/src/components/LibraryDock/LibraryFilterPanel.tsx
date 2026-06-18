import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useEditorStore } from '../../store/editor.store';
import { useFramework } from '../../hooks/useFramework';
import { useAllowedCategories } from '../../hooks/useLibrary';
import styles from './LibraryFilterPanel.module.scss';

export interface LibraryFilters {
  board?: string[];
  medium?: string[];
  gradeLevel?: string[];
  subject?: string[];
  primaryCategory?: string[];
  contentType?: string[];
}

interface LibraryFilterPanelProps {
  isOpen: boolean;
  filters: LibraryFilters;
  onApply: (filters: LibraryFilters) => void;
  onClose: () => void;
}

// Sub-component so it can call useAllowedCategories (a hook) at the top level
const AllowedCategorySection: React.FC<{
  local: LibraryFilters;
  toggle: (key: keyof LibraryFilters, val: string) => void;
}> = ({ local, toggle }) => {
  const categories = useAllowedCategories();
  if (!categories.length) return null;
  return (
    <div className={styles.section}>
      <div className={styles.sectionLabel}>Primary Category</div>
      <div className={styles.chips}>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            className={[
              styles.chip,
              (local.primaryCategory ?? []).includes(cat) ? styles.active : '',
            ].join(' ')}
            onClick={() => toggle('primaryCategory', cat)}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};

export const LibraryFilterPanel: React.FC<LibraryFilterPanelProps> = ({
  isOpen,
  filters,
  onApply,
  onClose,
}) => {
  const config = useEditorStore((s) => s.editorConfig);
  const { organisationFramework } = useFramework(
    config?.context?.framework as string | undefined,
    config?.context?.targetFWIds as string[] | undefined,
  );
  const [local, setLocal] = useState<LibraryFilters>(filters);

  useEffect(() => {
    setLocal(filters);
  }, [filters]);

  const toggle = (key: keyof LibraryFilters, val: string) => {
    setLocal((prev) => {
      const arr = prev[key] ?? [];
      const next = arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];
      return { ...prev, [key]: next };
    });
  };

  const categories = organisationFramework?.categories ?? [];
  const getTerms = (code: string) =>
    categories.find((c) => c.code === code)?.terms ?? [];

  if (!isOpen) return null;

  return (
    <div className={styles.panel} role="dialog" aria-label="Filter library" aria-modal="true">
      <div className={styles.header}>
        <span className={styles.headerTitle}>Filters</span>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close filters"
        >
          <X size={16} />
        </button>
      </div>

      <div className={styles.body}>
        {(['board', 'medium', 'gradeLevel', 'subject'] as const).map((key) => {
          const terms = getTerms(key);
          if (!terms.length) return null;
          const labels: Record<string, string> = {
            board: 'Board',
            medium: 'Medium',
            gradeLevel: 'Class',
            subject: 'Subject',
          };
          return (
            <div key={key} className={styles.section}>
              <div className={styles.sectionLabel}>{labels[key]}</div>
              <div className={styles.chips}>
                {terms.slice(0, 20).map((t) => (
                  <button
                    key={t.identifier}
                    type="button"
                    className={[
                      styles.chip,
                      (local[key] ?? []).includes(t.name) ? styles.active : '',
                    ].join(' ')}
                    onClick={() => toggle(key, t.name)}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </div>
          );
        })}

        <AllowedCategorySection local={local} toggle={toggle} />
      </div>

      <div className={styles.footer}>
        <button
          type="button"
          className={styles.resetBtn}
          onClick={() => setLocal({})}
        >
          Reset
        </button>
        <button
          type="button"
          className={styles.applyBtn}
          onClick={() => {
            onApply(local);
            onClose();
          }}
        >
          Apply
        </button>
      </div>
    </div>
  );
};
