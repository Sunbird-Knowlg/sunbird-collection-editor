import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { INode, EditorMode } from '../../types/editor';
import { useTreeStore } from '../../store/tree.store';
import { useEditorStore } from '../../store/editor.store';
import { getCtStyle } from '../../hooks/useContentType';
import { useLabels } from '../../hooks/useLabels';
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
  const lbl = useLabels();

  // The leaf-in-collection metadata form is defined by forms.relationalMetadata.
  // Use it to drive field labels / visibility, falling back to defaults.
  const relationalForm = useEditorStore((s) => s.relationalFormConfig);
  const fieldOf = (code: string) => relationalForm?.find((f) => f.code === code);
  const showField = (code: string) => !relationalForm || !!fieldOf(code);
  const labelOf = (code: string, fallback: string) => fieldOf(code)?.label || fallback;

  // Panel-level collapse (entire metadata section)
  const [panelOpen, setPanelOpen] = useState(true);

  // relationalMetadata holds the collection-specific overrides for this resource.
  // The hierarchy/update API stores name/keywords/optional there (on the parent unit),
  // NOT in nodesModified for the leaf content itself.
  const relMeta = (node.metadata?.relationalMetadata ?? {}) as Record<string, unknown>;

  const [name, setName] = useState(
    (relMeta.name as string) ?? node.name ?? '',
  );
  const [keywordsInput, setKeywordsInput] = useState('');
  const [keywords, setKeywords] = useState<string[]>(
    Array.isArray(relMeta.keywords) ? relMeta.keywords as string[]
      : Array.isArray(node.metadata?.keywords) ? node.metadata.keywords as string[]
      : [],
  );
  // `optional: true`  = content is optional in this collection (tracking not required)
  // `optional: false` = content is required  (must be completed / tracked)
  const [optional, setOptional] = useState<boolean>(
    !!(relMeta.optional),
  );

  // Reset when node changes
  useEffect(() => {
    const rm = (node.metadata?.relationalMetadata ?? {}) as Record<string, unknown>;
    setName((rm.name as string) ?? node.name ?? '');
    setKeywords(
      Array.isArray(rm.keywords) ? rm.keywords as string[]
        : Array.isArray(node.metadata?.keywords) ? node.metadata.keywords as string[]
        : [],
    );
    setOptional(!!(rm.optional));
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

  const handleOptionalChange = (val: boolean) => {
    setOptional(val);
    updateNode(node.id, { optional: val });
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
              {lbl.contentEditForm.moveToAnotherUnitButton}
            </button>
          )}
        </div>
        <button
          type="button"
          className={styles.panelCollapseBtn}
          onClick={() => setPanelOpen(v => !v)}
          aria-expanded={panelOpen}
          aria-label={panelOpen ? lbl.contentEditForm.collapseMetadataPanelAriaLabel : lbl.contentEditForm.expandMetadataPanelAriaLabel}
          title={panelOpen ? lbl.contentEditForm.collapseTitle : lbl.contentEditForm.expandTitle}
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
              <img src={node.appIcon} alt={lbl.contentEditForm.iconAlt} className={styles.icon} />
            )}
            <input
              type="text"
              className={styles.nameInput}
              value={name}
              disabled={!isEditable}
              onChange={e => setName(e.target.value)}
              onBlur={handleNameBlur}
              placeholder={lbl.contentEditForm.contentNamePlaceholder}
            />
          </div>

          {/* Keywords — the panel-level collapse already covers this section */}
          {showField('keywords') && (
          <div className={styles.field}>
            <div className={styles.fieldHeader}>
              <label className={styles.label}>
                {labelOf('keywords', lbl.contentEditForm.keywordsLabel)}
                {keywords.length > 0 && (
                  <span className={styles.fieldCount}>{keywords.length}</span>
                )}
              </label>
            </div>
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
                  placeholder={lbl.contentEditForm.addKeywordPlaceholder}
                  onChange={e => setKeywordsInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addKeyword(); } }}
                />
                <button type="button" className={styles.addBtn} onClick={addKeyword}>{lbl.contentEditForm.addButton}</button>
              </div>
            )}
          </div>
          )}

          {/* Optional in collection (optional: true = not required, optional: false = required) */}
          {showField('optional') && (
          <div className={styles.field}>
            <label className={styles.label}>{labelOf('optional', lbl.contentEditForm.optionalInCollectionLabel)}</label>
            <div className={styles.radioGroup}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name={`optional-${node.id}`}
                  checked={optional === true}
                  onChange={() => handleOptionalChange(true)}
                  disabled={!isEditable}
                />
                {lbl.contentEditForm.yesOption}
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name={`optional-${node.id}`}
                  checked={optional === false}
                  onChange={() => handleOptionalChange(false)}
                  disabled={!isEditable}
                />
                {lbl.contentEditForm.noOption}
              </label>
            </div>
          </div>
          )}
        </>
      )}

      {reorderDialog}
    </div>
  );
};
