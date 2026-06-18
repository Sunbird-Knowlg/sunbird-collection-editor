import React, { useCallback, useRef, useState, useEffect } from 'react';
import { Tree, type NodeRendererProps, type TreeApi } from 'react-arborist';
import { Plus, FolderPlus, MoreVertical, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import type { INode, EditorMode } from '../../types/editor';
import { useTreeStore } from '../../store/tree.store';
import { useEditorStore } from '../../store/editor.store';
import { TreeNode } from './TreeNode';
import { Button } from '../shared/Button';
import { CsvUpload } from '../BulkUpload/CsvUpload';
import { downloadSampleCsv } from '../../api/bulkUpload';
import styles from './OutlineTree.module.scss';

interface OutlineTreeProps {
  editorMode: EditorMode;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const OutlineTree: React.FC<OutlineTreeProps> = ({
  editorMode,
  collapsed = false,
  onToggleCollapse,
}) => {
  const treeRef = useRef<TreeApi<INode>>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [treeHeight, setTreeHeight] = useState(400);
  const [showMenu, setShowMenu] = useState(false);
  const [showCsvUpload, setShowCsvUpload] = useState(false);
  const [csvMode, setCsvMode] = useState<'create' | 'update'>('create');

  const { treeData, selectedNodeId, selectNode, addNode, deleteNode, reorderChildren } = useTreeStore();
  const isEditable = editorMode === 'edit';
  const contentId = useEditorStore(
    s => s.editorConfig?.context?.contentId ?? s.editorConfig?.context?.identifier ?? '',
  );

  // Measure wrapper height for react-arborist virtualization
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setTreeHeight(el.clientHeight || 400);
    });
    ro.observe(el);
    setTreeHeight(el.clientHeight || 400);
    return () => ro.disconnect();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    if (!showMenu) return;
    const handler = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setShowMenu(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showMenu]);

  const handleSelect = useCallback((nodes: { data: INode }[]) => {
    if (nodes.length > 0) selectNode(nodes[0].data.id);
  }, [selectNode]);

  const handleMove = useCallback(
    ({ parentId, index, dragIds }: { parentId: string | null; index: number; dragIds: string[] }) => {
      if (!parentId) return;
      const nodeId = dragIds[0];
      const parent = findNode(treeData, parentId);
      if (!parent?.children) return;
      const fromIndex = parent.children.findIndex((c) => c.id === nodeId);
      if (fromIndex < 0) return;
      reorderChildren(parentId, fromIndex, index > fromIndex ? index - 1 : index);
    },
    [treeData, reorderChildren],
  );

  const handleDelete = useCallback(
    ({ ids }: { ids: string[] }) => { ids.forEach((id) => deleteNode(id)); },
    [deleteNode],
  );

  const handleCreate = useCallback(
    ({ parentId }: { parentId: string | null; index?: number; type?: string }) => {
      const resolvedParentId = parentId ?? treeData[0]?.id ?? '';
      if (!resolvedParentId) return { id: crypto.randomUUID() };
      const id = addNode(resolvedParentId, 'unit');
      if (!id) {
        toast.error('Maximum depth reached');
        return { id: crypto.randomUUID() };
      }
      return { id };
    },
    [addNode, treeData],
  );

  const handleAddUnit = useCallback(() => {
    const rootId = treeData[0]?.id;
    if (rootId) {
      const id = addNode(rootId, 'unit');
      if (!id) toast.error('Maximum depth reached');
    }
  }, [treeData, addNode]);

  const handleAddSubunit = useCallback(() => {
    if (selectedNodeId) {
      const id = addNode(selectedNodeId, 'subunit');
      if (!id) toast.error('Maximum depth reached');
    }
  }, [selectedNodeId, addNode]);

  const handleDownloadCsv = useCallback(async () => {
    setShowMenu(false);
    if (!contentId) return;
    try {
      const blob = await downloadSampleCsv(contentId);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${contentId}-folders.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      toast.error('Failed to download CSV');
    }
  }, [contentId]);

  return (
    <div className={styles.container}>
      {/* Header bar */}
      <div className={styles.header}>
        <div className={styles.headerActions}>
          {isEditable && (
            <div className={styles.menuWrap} ref={menuRef}>
              <button
                type="button"
                className={styles.iconBtn}
                onClick={() => setShowMenu(v => !v)}
                aria-label="More options"
                title="More options"
                aria-haspopup="true"
                aria-expanded={showMenu}
              >
                <MoreVertical size={15} />
              </button>

              {showMenu && (
                <div className={styles.dropdownMenu} role="menu">
                  <button
                    role="menuitem"
                    type="button"
                    onClick={() => { setShowMenu(false); setCsvMode('create'); setShowCsvUpload(true); }}
                  >
                    Create folders using csv file
                  </button>
                  <button
                    role="menuitem"
                    type="button"
                    onClick={handleDownloadCsv}
                  >
                    Download folders as csv file
                  </button>
                  <button
                    role="menuitem"
                    type="button"
                    onClick={() => { setShowMenu(false); setCsvMode('update'); setShowCsvUpload(true); }}
                  >
                    Update folder metadata using csv file
                  </button>
                </div>
              )}
            </div>
          )}

          {onToggleCollapse && (
            <button
              type="button"
              className={styles.iconBtn}
              onClick={onToggleCollapse}
              aria-label={collapsed ? 'Expand outline' : 'Collapse outline'}
              title={collapsed ? 'Expand outline' : 'Collapse outline'}
            >
              {collapsed ? <PanelLeftOpen size={15} /> : <PanelLeftClose size={15} />}
            </button>
          )}
        </div>
      </div>

      <div className={styles.treeWrapper} ref={wrapperRef}>
        <Tree
          ref={treeRef}
          data={treeData}
          idAccessor="id"
          childrenAccessor="children"
          onSelect={handleSelect}
          onMove={isEditable ? handleMove : undefined}
          onDelete={isEditable ? handleDelete : undefined}
          onCreate={isEditable ? handleCreate : undefined}
          disableEdit={!isEditable}
          disableDrop={!isEditable}
          selection={selectedNodeId ?? undefined}
          rowHeight={40}
          indent={20}
          paddingBottom={16}
          height={treeHeight}
          width="100%"
        >
          {(props: NodeRendererProps<INode>) => (
            <TreeNode {...props} editorMode={editorMode} />
          )}
        </Tree>
      </div>

      {isEditable && (
        <div className={styles.footer}>
          <Button variant="ghost" size="sm" onClick={handleAddUnit}>
            <Plus size={14} /> Add Unit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleAddSubunit}
            disabled={!selectedNodeId}
          >
            <FolderPlus size={14} /> Add Sub-unit
          </Button>
        </div>
      )}

      {showCsvUpload && (
        <div className={styles.csvModal}>
          <CsvUpload
            contentId={contentId}
            mode={csvMode}
            onComplete={() => setShowCsvUpload(false)}
            onClose={() => setShowCsvUpload(false)}
          />
        </div>
      )}
    </div>
  );
};

function findNode(nodes: INode[], id: string): INode | undefined {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findNode(node.children, id);
      if (found) return found;
    }
  }
  return undefined;
}
