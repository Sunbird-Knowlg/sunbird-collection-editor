import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { INode, EditorMode } from '../../types/editor';
import { useTreeStore } from '../../store/tree.store';
import { getCtStyle } from '../../hooks/useContentType';
import styles from './ContentEditForm.module.scss';

interface ContentEditFormProps {
  node: INode;
  editorMode: EditorMode;
  onMoveClick: () => void;
  reorderDialog?: React.ReactNode;
}

export const ContentEditForm: React.FC<ContentEditFormProps> = ({
  node, editorMode, onMoveClick, reorderDialog,
}) => {
  const { updateNode, markDirty } = useTreeStore();
  const isEditable = editorMode === 'edit';
  const ctStyle = getCtStyle(node);

  // Panel-level collapse (entire metadata section)
  const [panelOpen, setPanelOpen] = useState(true);
  // Keywords section collapse (within the panel)
  const [kwOpen, setKwOpen] = useState(false);

  const [name, setName] = useState(node.name ?? '');
  const [keywordsInput, setKeywordsInput] = useState('');
  const [keywords, setKeywords] = useState<string[]>(
    Array.isArray(node.metadata?.keywords) ? node.metadata.keywords as string[] : [],
  );
  const [trackable, setTrackable] = useState<boolean>(
    !!(node.metadata?.trackable === 'Yes' || node.metadata?.trackable === true
      || (node.metadata?.trackable as Record<string, unknown>)?.enabled === 'Yes'),
  );

  // Reset when node changes
  useEffect(() => {
    setName(node.name ?? '');
    setKeywords(Array.isArray(node.metadata?.keywords) ? node.metadata.keywords as string[] : []);
    setTrackable(
      !!(node.metadata?.trackable === 'Yes' || node.metadata?.trackable === true
        || (node.metadata?.trackable as Record<string, unknown>)?.enabled === 'Yes'),
    );
  }, [node.id]);

  const handleNameBlur = () => {
    if (name.trim() && name !== node.name) {
      updateNode(node.id, { name: name.trim() });
      markDirty();
    }
  };

  const addKeyword = () => {
    const kw = keywordsInput.trim();
    if (kw && !keywords.includes(kw)) {
      const next = [...keywords, kw];
      setKeywords(next);
      updateNode(node.id, { keywords: next });
      markDirty();
    }
    setKeywordsInput('');
  };

  const removeKeyword = (kw: string) => {
    const next = keywords.filter(k => k !== kw);
    setKeywords(next);
    updateNode(node.id, { keywords: next });
    markDirty();
  };

  const handleTrackChange = (val: boolean) => {
    setTrackable(val);
    updateNode(node.id, { trackable: { enabled: val ? 'Yes' : 'No', autoBatch: 'No' } });
    markDirty();
  };

  return (
    <div className={styles.container}>
      {/* Panel header — always visible, contains collapse toggle */}
      <div className={styles.panelHeader}>
        <div className={styles.panelHeaderLeft}>
          <span className={`sbx-ct-badge--${ctStyle.key}`}>{ctStyle.label}</span>
          {isEditable && (
            <button type="button" className={styles.moveBtn} onClick={onMoveClick}>
              Move to another unit
            </button>
          )}
        </div>
        <button
          type="button"
          className={styles.panelCollapseBtn}
          onClick={() => setPanelOpen(v => !v)}
          aria-expanded={panelOpen}
          aria-label={panelOpen ? 'Collapse metadata panel' : 'Expand metadata panel'}
          title={panelOpen ? 'Collapse' : 'Expand'}
        >
          {panelOpen ? <ChevronDown size={15} /> : <ChevronUp size={15} />}
        </button>
      </div>

      {/* Panel body — collapses entirely */}
      {panelOpen && (
        <>
          {/* App icon + name */}
          <div className={styles.titleRow}>
            {node.appIcon && (
              <img src={node.appIcon} alt="icon" className={styles.icon} />
            )}
            <input
              type="text"
              className={styles.nameInput}
              value={name}
              disabled={!isEditable}
              onChange={e => setName(e.target.value)}
              onBlur={handleNameBlur}
              placeholder="Content name"
            />
          </div>

          {/* Keywords — collapsible within the panel */}
          <div className={styles.field}>
            <div className={styles.fieldHeader}>
              <label className={styles.label}>
                Keywords
                {keywords.length > 0 && (
                  <span className={styles.fieldCount}>{keywords.length}</span>
                )}
              </label>
              <button
                type="button"
                className={styles.collapseBtn}
                onClick={() => setKwOpen(v => !v)}
                aria-expanded={kwOpen}
                aria-label={kwOpen ? 'Collapse keywords' : 'Expand keywords'}
              >
                <ChevronDown size={14} className={kwOpen ? styles.chevronUp : ''} />
              </button>
            </div>
            {kwOpen && (
              <>
                {keywords.length > 0 && (
                  <div className={styles.chips}>
                    {keywords.map(kw => (
                      <span key={kw} className={styles.chip}>
                        {kw}
                        {isEditable && (
                          <button type="button" className={styles.chipRemove} onClick={() => removeKeyword(kw)}>×</button>
                        )}
                      </span>
                    ))}
                  </div>
                )}
                {isEditable && (
                  <div className={styles.keywordInput}>
                    <input
                      type="text"
                      className={styles.input}
                      value={keywordsInput}
                      placeholder="Add keyword and press Enter"
                      onChange={e => setKeywordsInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addKeyword(); } }}
                    />
                    <button type="button" className={styles.addBtn} onClick={addKeyword}>Add</button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Track in Collections */}
          <div className={styles.field}>
            <label className={styles.label}>Track in Collections</label>
            <div className={styles.radioGroup}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name={`trackable-${node.id}`}
                  checked={trackable === true}
                  onChange={() => handleTrackChange(true)}
                  disabled={!isEditable}
                />
                Yes
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name={`trackable-${node.id}`}
                  checked={trackable === false}
                  onChange={() => handleTrackChange(false)}
                  disabled={!isEditable}
                />
                No
              </label>
            </div>
          </div>
        </>
      )}

      {reorderDialog}
    </div>
  );
};
