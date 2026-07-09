import React, { useCallback, useEffect, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import type { EditorMode, ToolbarAction } from '../../types/editor';
import type { IContent } from '../../types/content';
import { Topbar } from '../Topbar';
import { UnsavedChangesModal } from '../modals/UnsavedChangesModal';
import { OutlineTree } from '../OutlineTree';
import { ContextualEditor } from '../ContextualEditor';
import { LibraryDock } from '../LibraryDock';
import { useTreeStore } from '../../store/tree.store';
import { useEditorStore } from '../../store/editor.store';
import { useSaveHierarchy } from '../../hooks/useSaveHierarchy';
import { useToolbarActions } from '../../hooks/useToolbarActions';
import { useLabels } from '../../hooks/useLabels';
import toast from 'react-hot-toast';
import styles from './SplitBuilderShell.module.scss';

interface SplitBuilderShellProps {
  editorMode: EditorMode;
  onToolbarEvent?: (event: { action: ToolbarAction; data?: unknown }) => void;
  onContentAdded?: (item: unknown, targetNodeId: string) => void;
  onHierarchySaved?: (hierarchy: unknown) => void;
}

export const SplitBuilderShell: React.FC<SplitBuilderShellProps> = ({
  editorMode,
  onToolbarEvent,
  onContentAdded,
  onHierarchySaved,
}) => {
  const lbl = useLabels();
  const [activeDragItem, setActiveDragItem] = useState<IContent | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [dockCollapsed, setDockCollapsed] = useState(false);
  const [showUnsavedPrompt, setShowUnsavedPrompt] = useState(false);

  const { addResource, treeData } = useTreeStore();
  const setFormStatus = useEditorStore((s) => s.setFormStatus);
  // isFormValid: true while the current node's form hasn't been touched or is valid.
  const [isFormValid, setIsFormValid] = useState(true);
  const selectedNodeId = useTreeStore((s) => s.selectedNodeId);
  const { save, isSaving, isDirty, lastSaved } = useSaveHierarchy();
  const { runAction, checkRequiredFields } = useToolbarActions(save);

  useEffect(() => {
    if (!isDirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const item = event.active.data.current?.item as IContent | undefined;
    if (item) setActiveDragItem(item);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveDragItem(null);
      const item = event.active.data.current?.item as IContent | undefined;
      if (!item) return;
      const over = event.over;
      const targetNodeId = (over?.id as string | undefined) ?? selectedNodeId ?? undefined;
      if (!targetNodeId) {
        toast.error(lbl.splitBuilderShell.dropOntoUnitError);
        return;
      }
      const rootId = treeData[0]?.id;
      const allowContentUnderRoot = false; // matches tree.store guard
      if (!allowContentUnderRoot && targetNodeId === rootId) {
        toast.error(lbl.splitBuilderShell.dropOntoCourseError);
        return;
      }
      const added = addResource(item, targetNodeId);
      if (!added) {
        toast.error(lbl.splitBuilderShell.alreadyInCollectionError.replace('{name}', item.name));
        return;
      }
      onContentAdded?.(item, targetNodeId);
      toast.success(lbl.splitBuilderShell.addedToUnitSuccess.replace('{name}', item.name));
    },
    [selectedNodeId, addResource, onContentAdded, lbl],
  );

  const handleToolbarEvent = useCallback(
    async (event: { action: ToolbarAction; data?: unknown }) => {
      // Intercept form status updates from ContextualEditor — don't bubble up.
      if (event.action === 'onFormStatusChange') {
        const { isValid, nodeId } = (event.data ?? {}) as { isValid?: boolean; nodeId?: string | null };
        const valid = isValid !== false;
        setIsFormValid(valid);
        if (nodeId) setFormStatus(nodeId, valid);
        return;
      }
      // Guard Back when there are unsaved changes (auto-save is disabled).
      // Only in edit mode — reviewers/viewers exit without a save prompt.
      if (event.action === 'back' && isDirty && editorMode === 'edit') {
        setShowUnsavedPrompt(true);
        return;
      }
      if (event.action === 'saveCollection') {
        if (!isFormValid) {
          toast.error(lbl.splitBuilderShell.fillRequiredMetadataError);
          return;
        }
        // Tree-wide required-field gate — blocks saving until every node's
        // required metadata is filled (toasts + selects the offender itself).
        if (!checkRequiredFields()) return;
        await save();
        onHierarchySaved?.(treeData);
        onToolbarEvent?.(event);
        return;
      }
      // review / publish / reject are handled internally (Angular parity);
      // still emit afterwards so the host app can navigate/close on success.
      if (
        event.action === 'sendForReview' ||
        event.action === 'reject' ||
        event.action === 'publish'
      ) {
        const ok = await runAction(event.action, event.data);
        if (ok) onToolbarEvent?.(event);
        return;
      }
      onToolbarEvent?.(event);
    },
    [save, runAction, checkRequiredFields, onToolbarEvent, onHierarchySaved, treeData, isDirty, isFormValid, editorMode, lbl],
  );

  // Resolve the unsaved-changes prompt for Back.
  const handleUnsavedSave = useCallback(async () => {
    // Same required-field gate as Save — stay in the editor so the user can
    // fill the flagged fields (the gate toasts and selects the offender).
    if (!checkRequiredFields()) {
      setShowUnsavedPrompt(false);
      return;
    }
    await save();
    setShowUnsavedPrompt(false);
    onHierarchySaved?.(treeData);
    onToolbarEvent?.({ action: 'back' });
  }, [save, checkRequiredFields, onHierarchySaved, onToolbarEvent, treeData]);

  const handleUnsavedDiscard = useCallback(() => {
    setShowUnsavedPrompt(false);
    onToolbarEvent?.({ action: 'back' });
  }, [onToolbarEvent]);

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className={styles.shell}>
        <Topbar
          editorMode={editorMode}
          isSaving={isSaving}
          isDirty={isDirty}
          lastSaved={lastSaved}
          isFormValid={isFormValid}
          onToolbarEvent={handleToolbarEvent}
        />

        <div className={[
          styles.workspace,
          sidebarCollapsed ? styles.sidebarCollapsed : '',
          dockCollapsed ? styles.dockCollapsed : '',
        ].filter(Boolean).join(' ')}>
          <aside
            className={[styles.outline, sidebarCollapsed ? styles.outlineHidden : ''].join(' ')}
            aria-label={lbl.splitBuilderShell.outlineAriaLabel}
            aria-hidden={sidebarCollapsed}
          >
            <OutlineTree
              editorMode={editorMode}
              collapsed={sidebarCollapsed}
              onToggleCollapse={() => setSidebarCollapsed(v => !v)}
            />
          </aside>

          {/* Reopen tab when sidebar is collapsed */}
          {sidebarCollapsed && (
            <button
              className={styles.reopenTab}
              onClick={() => setSidebarCollapsed(false)}
              title={lbl.splitBuilderShell.showOutlineTitle}
              type="button"
            >
              ›
            </button>
          )}

          <main className={styles.editor} role="main" aria-label={lbl.splitBuilderShell.editorAriaLabel}>
            <ContextualEditor editorMode={editorMode} onToolbarEvent={handleToolbarEvent} />
          </main>

          <aside
            className={[styles.dock, dockCollapsed ? styles.dockHidden : ''].filter(Boolean).join(' ')}
            aria-label={lbl.splitBuilderShell.libraryAriaLabel}
            aria-hidden={dockCollapsed}
          >
            <LibraryDock
              editorMode={editorMode}
              collapsed={dockCollapsed}
              onToggleCollapse={() => setDockCollapsed(v => !v)}
            />
          </aside>

          {/* Reopen tab when library dock is collapsed */}
          {dockCollapsed && (
            <button
              className={styles.dockReopenTab}
              onClick={() => setDockCollapsed(false)}
              title={lbl.splitBuilderShell.showLibraryTitle}
              type="button"
            >
              ‹
            </button>
          )}
        </div>
      </div>

      <DragOverlay dropAnimation={null}>
        {activeDragItem ? (
          <div className={styles.dragChip}>
            <span className={styles.dragChipLabel}>{activeDragItem.name}</span>
          </div>
        ) : null}
      </DragOverlay>

      {showUnsavedPrompt && (
        <UnsavedChangesModal
          onSave={handleUnsavedSave}
          onDiscard={handleUnsavedDiscard}
          onCancel={() => setShowUnsavedPrompt(false)}
          isSaving={isSaving}
        />
      )}
    </DndContext>
  );
};
