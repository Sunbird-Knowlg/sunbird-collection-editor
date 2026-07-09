import React, { useState, useCallback, useRef, useEffect } from 'react';
import { type NodeRendererProps } from 'react-arborist';
import {
  ChevronRight,
  ChevronDown,
  GripVertical,
  MoreVertical,
  Pencil,
  Plus,
  Trash2,
  FolderPlus,
  Book,
  Folder,
  Video,
  FileText,
  Layers,
  Package,
  Music,
  HelpCircle,
  File,
} from 'lucide-react';
import type { INode, EditorMode } from '../../types/editor';
import { getCtStyle } from '../../hooks/useContentType';
import { useIsDraftStatus } from '../../hooks/useContentStatus';
import { useLabels } from '../../hooks/useLabels';
import styles from './TreeNode.module.scss';

const CT_ICON_COMPONENTS: Record<string, React.ElementType> = {
  video: Video,
  pdf: FileText,
  h5p: Layers,
  scorm: Package,
  audio: Music,
  quiz: HelpCircle,
  default: File,
};

interface TreeNodeProps extends NodeRendererProps<INode> {
  editorMode: EditorMode;
}

export const TreeNode: React.FC<TreeNodeProps> = ({
  node,
  style,
  dragHandle,
  editorMode,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameVal, setRenameVal] = useState(node.data.name);
  const menuRef = useRef<HTMLDivElement>(null);
  const lbl = useLabels();
  const isEditable = editorMode === 'edit';
  const isDraft = useIsDraftStatus();
  const ctStyle = getCtStyle(node.data);
  const CtIcon = CT_ICON_COMPONENTS[ctStyle.key] ?? File;
  const isSelected = node.isSelected;
  const isRoot = node.level === 0;
  const isFolder =
    node.data.isFolder ?? (node.children && node.children.length > 0);
  // Root (Course) → Book, Unit/Sub-Unit (folders) → Folder, leaf → content-type icon.
  const NodeIcon = isRoot ? Book : isFolder ? Folder : CtIcon;

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  const handleRenameSubmit = useCallback(() => {
    if (renameVal.trim()) node.submit(renameVal.trim());
    setIsRenaming(false);
  }, [renameVal, node]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') handleRenameSubmit();
      if (e.key === 'Escape') {
        setRenameVal(node.data.name);
        setIsRenaming(false);
      }
    },
    [handleRenameSubmit, node.data.name],
  );

  return (
    <div
      className={[
        styles.row,
        isSelected ? styles.selected : '',
        (node.state as unknown as Record<string, boolean>).isOver && isFolder ? styles.dropTarget : '',
      ]
        .filter(Boolean)
        .join(' ')}
      style={style}
      onClick={() => node.select()}
      data-node-id={node.data.id}
      data-droppable={isFolder ? 'true' : undefined}
      role="treeitem"
      aria-selected={isSelected}
      aria-expanded={isFolder ? !node.isClosed : undefined}
    >
      {/* Drag handle */}
      {isEditable && (
        <span ref={dragHandle} className={styles.grip} aria-hidden="true">
          <GripVertical size={14} />
        </span>
      )}

      {/* Expand toggle */}
      <button
        className={styles.toggle}
        onClick={(e) => {
          e.stopPropagation();
          node.toggle();
        }}
        aria-label={node.isClosed ? lbl.treeNode.expandAriaLabel : lbl.treeNode.collapseAriaLabel}
        style={{ visibility: isFolder ? 'visible' : 'hidden' }}
      >
        {node.isClosed ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
      </button>

      {/* Node icon: Book (root) / Folder (unit) / content-type (leaf) */}
      <span
        className={`${styles.ctIcon} ${isRoot || isFolder ? styles.folderIcon ?? '' : ctStyle.bgClass}`}
        aria-hidden="true"
      >
        <NodeIcon size={12} />
      </span>

      {/* Title or rename input */}
      {isRenaming ? (
        <input
          className={styles.renameInput}
          value={renameVal}
          autoFocus
          onChange={(e) => setRenameVal(e.target.value)}
          onBlur={handleRenameSubmit}
          onKeyDown={handleKeyDown}
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <span
          className={styles.title}
          title={node.data.name}
          onDoubleClick={() => isEditable && setIsRenaming(true)}
        >
          {node.data.name.length > 25 ? `${node.data.name.slice(0, 25)}...` : node.data.name}
        </span>
      )}

      {/* "Drop here" marker (visible when drag is over this folder) */}
      {(node.state as unknown as Record<string, boolean>).isOver && isFolder && (
        <span className={styles.dropHere} aria-hidden="true">
          {lbl.treeNode.dropHereLabel}
        </span>
      )}

      {/* Context menu button */}
      {isEditable && (
        <div className={styles.menuWrap} ref={menuRef}>
          <button
            className={styles.menuBtn}
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((v) => !v);
            }}
            aria-label={lbl.treeNode.nodeOptionsAriaLabel}
          >
            <MoreVertical size={14} />
          </button>
          {menuOpen && (
            <div className={styles.menu} role="menu">
              <button
                role="menuitem"
                onClick={() => {
                  setIsRenaming(true);
                  setMenuOpen(false);
                }}
              >
                <Pencil size={13} /> {lbl.treeNode.renameMenuItem}
              </button>
              {isFolder && isDraft && (
                <button
                  role="menuitem"
                  onClick={() => {
                    node.tree.create({ parentId: node.id });
                    setMenuOpen(false);
                  }}
                >
                  <FolderPlus size={13} /> {lbl.treeNode.addSubunitMenuItem}
                </button>
              )}
              {node.data.parent && isDraft && (
                <button
                  role="menuitem"
                  onClick={() => {
                    node.tree.create({ parentId: node.data.parent as string });
                    setMenuOpen(false);
                  }}
                >
                  <Plus size={13} /> {lbl.treeNode.addSiblingMenuItem}
                </button>
              )}
              <button
                role="menuitem"
                className={styles.dangerItem}
                onClick={() => {
                  node.tree.delete(node.id);
                  setMenuOpen(false);
                }}
              >
                <Trash2 size={13} /> {lbl.treeNode.deleteMenuItem}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
