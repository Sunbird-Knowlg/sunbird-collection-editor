import React, { useCallback } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import type { EditorMode } from '../../types/editor';
import { useTreeStore } from '../../store/tree.store';
import { useLabels } from '../../hooks/useLabels';
import { ContentRow } from './ContentRow';
import styles from './UnitContentList.module.scss';

interface UnitContentListProps {
  editorMode: EditorMode;
}

export const UnitContentList: React.FC<UnitContentListProps> = ({ editorMode }) => {
  const lbl = useLabels();
  const { selectedNodeId, getChildrenOf, reorderChildren, deleteNode } = useTreeStore();
  const children = selectedNodeId ? getChildrenOf(selectedNodeId) : [];
  const isEditable = editorMode === 'edit';

  const sensors = useSensors(
    // distance:5 prevents conflict with outer DnD context (distance:8) while still feeling responsive
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id || !selectedNodeId) return;
    // Read fresh children at event time to avoid stale closure
    const fresh = useTreeStore.getState().getChildrenOf(selectedNodeId);
    const fromIndex = fresh.findIndex(c => c.id === active.id);
    const toIndex = fresh.findIndex(c => c.id === over.id);
    if (fromIndex < 0 || toIndex < 0) return;
    reorderChildren(selectedNodeId, fromIndex, toIndex);
  }, [selectedNodeId, reorderChildren]);

  const handleRemove = useCallback((id: string) => {
    if (window.confirm(lbl.unitContentList.removeConfirm)) {
      deleteNode(id);
    }
  }, [deleteNode, lbl.unitContentList.removeConfirm]);

  if (!selectedNodeId) return null;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.heading}>{lbl.unitContentList.heading}</span>
        <span className={styles.count}>{children.length}</span>
      </div>

      {children.length > 0 ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={children.map(c => c.id)} strategy={verticalListSortingStrategy}>
            <div className={styles.list} role="list">
              {children.map(child => (
                <ContentRow
                  key={child.id}
                  item={child}
                  onRemove={handleRemove}
                  isEditable={isEditable}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <div className={styles.emptyState}>
          <p>{lbl.unitContentList.emptyTitle}</p>
          <span>{lbl.unitContentList.emptyHint}</span>
        </div>
      )}

      {isEditable && (
        <button className={styles.addRow} type="button" aria-label={lbl.unitContentList.addContentAriaLabel}>
          <Plus size={14} /> {lbl.unitContentList.addContent}
        </button>
      )}
    </div>
  );
};
