import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useEditorStore } from '../../store/editor.store';
import { useFramework } from '../../hooks/useFramework';
import { useAllowedCategories } from '../../hooks/useLibrary';
import { useLabels } from '../../hooks/useLabels';
import type { LabelConfig } from '../../i18n';
import styles from './LibraryFilterPanel.module.scss';

export interface LibraryFilters {
  board?: string[];
  medium?: string[];
  gradeLevel?: string[];
  subject?: string[];
  topic?: string[];
  primaryCategory?: string[];
  contentType?: string[];
}

// Framework-category filter sections, used when the API search form is absent.
const getDefaultFilterSections = (
  lbl: LabelConfig,
): Array<{ key: keyof LibraryFilters; label: string }> => [
  { key: 'board', label: lbl.libraryFilterPanel.boardLabel },
  { key: 'medium', label: lbl.libraryFilterPanel.mediumLabel },
  { key: 'gradeLevel', label: lbl.libraryFilterPanel.classLabel },
  { key: 'subject', label: lbl.libraryFilterPanel.subjectLabel },
];

const FRAMEWORK_FILTER_KEYS = new Set(['board', 'medium', 'gradeLevel', 'subject', 'topic']);

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
  const lbl = useLabels();
  const categories = useAllowedCategories();
  if (!categories.length) return null;
  return (
    <div className={styles.section}>
      <div className={styles.sectionLabel}>{lbl.libraryFilterPanel.primaryCategoryLabel}</div>
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
  const lbl = useLabels();
  const config = useEditorStore((s) => s.editorConfig);
  const searchFormConfig = useEditorStore((s) => s.searchFormConfig);
  const contentFramework = useEditorStore((s) => s.contentFramework);
  const contentTargetFWIds = useEditorStore((s) => s.contentTargetFWIds);
  const { organisationFramework } = useFramework(
    (contentFramework ?? config?.context?.framework) as string | undefined,
    (contentTargetFWIds ?? config?.context?.targetFWIds) as string[] | undefined,
  );
  const [local, setLocal] = useState<LibraryFilters>(filters);

  // Drive the framework-category filter sections from the API search form when
  // available (codes + labels), else fall back to the hardcoded defaults.
  const filterSections: Array<{ key: keyof LibraryFilters; label: string }> =
    searchFormConfig?.length
      ? searchFormConfig
          .filter((f) => FRAMEWORK_FILTER_KEYS.has(f.code))
          .map((f) => ({ key: f.code as keyof LibraryFilters, label: f.label || f.code }))
      : getDefaultFilterSections(lbl);

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
    <div className={styles.panel} role="dialog" aria-label={lbl.libraryFilterPanel.filterLibraryAriaLabel} aria-modal="true">
      <div className={styles.header}>
        <span className={styles.headerTitle}>{lbl.libraryFilterPanel.filtersHeaderTitle}</span>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={onClose}
          aria-label={lbl.libraryFilterPanel.closeFiltersAriaLabel}
        >
          <X size={16} />
        </button>
      </div>

      <div className={styles.body}>
        {filterSections.map(({ key, label }) => {
          const terms = getTerms(key);
          if (!terms.length) return null;
          return (
            <div key={key} className={styles.section}>
              <div className={styles.sectionLabel}>{label}</div>
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
          {lbl.libraryFilterPanel.resetButton}
        </button>
        <button
          type="button"
          className={styles.applyBtn}
          onClick={() => {
            onApply(local);
            onClose();
          }}
        >
          {lbl.libraryFilterPanel.applyButton}
        </button>
      </div>
    </div>
  );
};
