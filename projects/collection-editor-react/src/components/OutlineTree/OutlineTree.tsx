import React, { useCallback, useRef, useState, useEffect } from 'react';
import { Tree, type NodeRendererProps, type TreeApi } from 'react-arborist';
import { Plus, FolderPlus, MoreVertical, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import type { INode, EditorMode } from '../../types/editor';
import { useTreeStore } from '../../store/tree.store';
import { useEditorStore } from '../../store/editor.store';
import { useIsDraftStatus } from '../../hooks/useContentStatus';
import { useLabels } from '../../hooks/useLabels';
import { TreeNode } from './TreeNode';
import { Button } from '../shared/Button';
import { CsvUpload } from '../BulkUpload/CsvUpload';
import { exportFolderCsv } from '../../api/bulkUpload';
import { readHierarchy } from '../../api/hierarchy';
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
  const lbl = useLabels();
  const treeRef = useRef<TreeApi<INode>>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [treeHeight, setTreeHeight] = useState(400);
  const [showMenu, setShowMenu] = useState(false);
  const [showCsvUpload, setShowCsvUpload] = useState(false);
  const [csvMode, setCsvMode] = useState<'create' | 'update'>('create');

  const { treeData, selectedNodeId, selectNode, addNode, deleteNode, reorderChildren, moveNode, setTreeData } = useTreeStore();
  const isEditable = editorMode === 'edit';
  const isDraft = useIsDraftStatus();
  // Adding units/content is only allowed while the collection is in Draft.
  const canAdd = isEditable && isDraft;
  // Mirror Angular: "Create" is only useful when no folders exist yet;
  // "Download/Update" only make sense when folders already exist.
  const hasFolders = (treeData[0]?.children ?? []).some(c => c.isFolder);
  const contentId = useEditorStore(
    s => s.editorConfig?.context?.contentId ?? s.editorConfig?.context?.identifier ?? '',
  );

  // enableBulkUpload from sourcingSettings controls CSV menu visibility.
  // Default to true when the category definition hasn't loaded yet.
  const enableBulkUpload = useEditorStore(s => {
    const sourcing = s.categoryMeta?.sourcingSettings?.collection as Record<string, unknown> | undefined;
    return sourcing?.enableBulkUpload !== false;
  });

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
      const sourceNode = findNode(treeData, nodeId);
      if (!sourceNode) return;
      const sourceParentId = sourceNode.parent;

      if (sourceParentId === parentId) {
        // Same parent: reorder within the folder
        const parent = findNode(treeData, parentId);
        if (!parent?.children) return;
        const fromIndex = parent.children.findIndex((c) => c.id === nodeId);
        if (fromIndex < 0) return;
        reorderChildren(parentId, fromIndex, index > fromIndex ? index - 1 : index);
      } else {
        // Cross-folder: move to destination parent
        moveNode(nodeId, sourceParentId ?? '', parentId);
      }
    },
    [treeData, reorderChildren, moveNode],
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
        toast.error(lbl.outlineTree.maxDepthReachedToast);
        return { id: crypto.randomUUID() };
      }
      return { id };
    },
    [addNode, treeData, lbl],
  );

  const handleAddUnit = useCallback(() => {
    const rootId = treeData[0]?.id;
    if (rootId) {
      const id = addNode(rootId, 'unit');
      if (!id) toast.error(lbl.outlineTree.maxDepthReachedToast);
    }
  }, [treeData, addNode, lbl]);

  const handleAddSubunit = useCallback(() => {
    if (selectedNodeId) {
      const id = addNode(selectedNodeId, 'subunit');
      if (!id) toast.error(lbl.outlineTree.maxDepthReachedToast);
    }
  }, [selectedNodeId, addNode, lbl]);

  const handleDownloadCsv = useCallback(async () => {
    setShowMenu(false);
    if (!contentId) return;
    try {
      const tocUrl = await exportFolderCsv(contentId);
      // Blob-convert so download works regardless of server Content-Disposition header
      const blob = await fetch(tocUrl).then(r => r.blob());
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = `${contentId}-folders.csv`;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(objectUrl);
    } catch {
      toast.error(lbl.outlineTree.downloadCsvFailedToast);
    }
  }, [contentId, lbl]);

  // After CSV upload succeeds, re-fetch the hierarchy so the tree reflects
  // the newly created/updated folders without requiring a page reload.
  const handleCsvComplete = useCallback(async () => {
    setShowCsvUpload(false);
    if (!contentId) return;
    try {
      const { rootNode } = await readHierarchy(contentId);
      setTreeData([rootNode]);
      toast.success(lbl.outlineTree.outlineRefreshedToast);
    } catch {
      toast.error(lbl.outlineTree.outlineRefreshFailedToast);
    }
  }, [contentId, setTreeData, lbl]);

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
                aria-label={lbl.outlineTree.moreOptionsAriaLabel}
                title={lbl.outlineTree.moreOptionsTitle}
                aria-haspopup="true"
                aria-expanded={showMenu}
              >
                <MoreVertical size={15} />
              </button>

              {showMenu && (
                <div className={styles.dropdownMenu} role="menu">
                  {enableBulkUpload && (
                    <>
                      <button
                        role="menuitem"
                        type="button"
                        disabled={hasFolders}
                        title={hasFolders ? lbl.outlineTree.foldersExistTitle : undefined}
                        onClick={() => { setShowMenu(false); setCsvMode('create'); setShowCsvUpload(true); }}
                      >
                        {lbl.outlineTree.createFoldersCsvButton}
                      </button>
                      <button
                        role="menuitem"
                        type="button"
                        disabled={!hasFolders}
                        title={!hasFolders ? lbl.outlineTree.noFoldersYetTitle : undefined}
                        onClick={handleDownloadCsv}
                      >
                        {lbl.outlineTree.downloadFoldersCsvButton}
                      </button>
                      <button
                        role="menuitem"
                        type="button"
                        disabled={!hasFolders}
                        title={!hasFolders ? lbl.outlineTree.noFoldersYetTitle : undefined}
                        onClick={() => { setShowMenu(false); setCsvMode('update'); setShowCsvUpload(true); }}
                      >
                        {lbl.outlineTree.updateFoldersCsvButton}
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {onToggleCollapse && (
            <button
              type="button"
              className={styles.iconBtn}
              onClick={onToggleCollapse}
              aria-label={collapsed ? lbl.outlineTree.expandOutlineAriaLabel : lbl.outlineTree.collapseOutlineAriaLabel}
              title={collapsed ? lbl.outlineTree.expandOutlineAriaLabel : lbl.outlineTree.collapseOutlineAriaLabel}
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
          <Button
            variant="ghost"
            size="sm"
            onClick={handleAddUnit}
            disabled={!canAdd}
          >
            <Plus size={14} /> {lbl.outlineTree.addUnitButton}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleAddSubunit}
            disabled={!canAdd || !selectedNodeId}
          >
            <FolderPlus size={14} /> {lbl.outlineTree.addSubunitButton}
          </Button>
        </div>
      )}

      {showCsvUpload && (
        <div className={styles.csvModal}>
          <CsvUpload
            contentId={contentId}
            mode={csvMode}
            onComplete={handleCsvComplete}
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
