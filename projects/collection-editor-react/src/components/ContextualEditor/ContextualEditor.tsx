import React, { useState, useCallback, useRef } from 'react';
import type { EditorMode, ToolbarAction, INode } from '../../types/editor';
import { useTreeStore } from '../../store/tree.store';
import { useEditorStore } from '../../store/editor.store';
import { Breadcrumb } from './Breadcrumb';
import { TabBar } from './TabBar';
import { SparkMetaForm } from '../SparkMetaForm';
import { UnitContentList } from '../UnitContentList';
import { DropZone } from '../shared/DropZone';
import { ContentPlayer } from '../ContentPlayer';
import { ResourceReorderDialog } from '../ResourceReorder/ResourceReorderDialog';
import { AssignPageNumber } from '../AssignPageNumber/AssignPageNumber';
import { ContentEditForm } from './ContentEditForm';
import { TitleAppIcon } from './TitleAppIcon';
import { useLabels } from '../../hooks/useLabels';
import styles from './ContextualEditor.module.scss';

const QUESTIONSET_MIME = 'application/vnd.sunbird.questionset';
const QUESTION_MIME = 'application/vnd.sunbird.question';
const QUML_TYPES = [QUESTIONSET_MIME, QUESTION_MIME];

interface ContextualEditorProps {
  editorMode: EditorMode;
  onToolbarEvent: (event: { action: ToolbarAction; data?: unknown }) => void;
}

type TabId = 'details' | 'audience' | 'licensing';

// A reviewer's rejectComment should only surface while the node is still in
// the Draft-after-reject state — hidden once resubmitted for review (status
// moves to 'Review') or published (status moves to 'Live'), even though the
// comment persists on the content's metadata.
function getDraftRejectComment(node: INode | null | undefined): string | undefined {
  if (!node || node.status !== 'Draft' || node.metadata?.prevStatus !== 'Review') {
    return undefined;
  }
  return node.metadata?.rejectComment as string | undefined;
}

export const ContextualEditor: React.FC<ContextualEditorProps> = ({ editorMode, onToolbarEvent }) => {
  const lbl = useLabels();
  const [activeTab, setActiveTab] = useState<TabId>('details');
  const [errorTabs, setErrorTabs] = useState<TabId[]>([]);
  const [reorderResourceId, setReorderResourceId] = useState<string | null>(null);
  const [showAssignPage, setShowAssignPage] = useState(false);
  const titleRef = useRef<HTMLDivElement>(null);
  const titleTimerRef = useRef<ReturnType<typeof setTimeout>>();

  const { selectedNodeId, breadcrumb, activeNodeMeta, updateNode, treeData } = useTreeStore();
  const contentId = useEditorStore(
    s => s.editorConfig?.context?.contentId ?? s.editorConfig?.context?.identifier ?? '',
  );

  const selectedNode = selectedNodeId ? findNodeById(treeData, selectedNodeId) : null;

  // Derive node flags synchronously from the resolved node. The editor-store
  // flags (isCurrentNodeRoot/isCurrentNodeFolder) are set asynchronously in
  // selectNode and lag a render behind, which made the form mount with the
  // wrong field set on root→unit→root and lose its pre-selected dropdowns.
  const isCurrentNodeRoot = !!selectedNode && !selectedNode.parent;
  const isCurrentNodeFolder = !!selectedNode?.isFolder;

  const isQuml = selectedNode && QUML_TYPES.includes(selectedNode.mimeType ?? '');
  const isSingleQuestion = selectedNode?.mimeType === QUESTION_MIME;
  const isLeafContent = selectedNode && !selectedNode.isFolder && !isQuml && !isCurrentNodeRoot;

  // Review comment from previous rejection cycle — only while still in the
  // Draft-after-reject state; hidden once resubmitted for review or published.
  const reviewComment = getDraftRejectComment(selectedNode)
    ?? (isCurrentNodeRoot ? getDraftRejectComment(treeData[0]) : undefined);

  const handleTitleChange = useCallback(() => {
    const el = titleRef.current;
    if (!el || !selectedNodeId) return;
    const newTitle = el.innerText.trim();
    clearTimeout(titleTimerRef.current);
    titleTimerRef.current = setTimeout(() => {
      updateNode(selectedNodeId, { name: newTitle });
    }, 600);
  }, [selectedNodeId, updateNode]);

  const handleFormValueChange = useCallback((data: unknown) => {
    onToolbarEvent({ action: 'onFormValueChange', data });
  }, [onToolbarEvent]);

  const handleFormStatusChange = useCallback((isValid: boolean, invalidTabs: TabId[]) => {
    setErrorTabs(invalidTabs);
    onToolbarEvent({ action: 'onFormStatusChange', data: { isValid, nodeId: selectedNodeId } });
  }, [onToolbarEvent, selectedNodeId]);

  if (!selectedNode) {
    return (
      <div className={styles.emptyState}>
        <p>{lbl.contextualEditor.emptyStateMessage}</p>
      </div>
    );
  }

  if (isQuml) {
    return (
      <ContentPlayer
        node={selectedNode}
        editorMode={editorMode}
        type="quml"
        singleQuestion={isSingleQuestion}
      />
    );
  }

  if (isLeafContent) {
    return (
      <div className={styles.leafContentLayout}>
        <ContentPlayer node={selectedNode} editorMode={editorMode} type="content" layout="flow" />
        <ContentEditForm
          node={selectedNode}
          editorMode={editorMode}
          onMoveClick={() => setReorderResourceId(selectedNode.identifier)}
          reorderDialog={reorderResourceId ? (
            <ResourceReorderDialog
              resourceId={reorderResourceId}
              resourceName={selectedNode.name}
              currentUnitId={selectedNode.parent ?? ''}
              onClose={() => setReorderResourceId(null)}
            />
          ) : null}
        />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Breadcrumb crumbs={breadcrumb} />

      {/* Review comment bar — shown whenever a rejection comment exists (edit or review mode) */}
      {reviewComment && (
        <div className={styles.reviewComment} role="alert">
          <span className={styles.reviewCommentLabel}>{lbl.contextualEditor.reviewCommentLabel}</span>
          <span className={styles.reviewCommentText}>{reviewComment}</span>
        </div>
      )}

      {/* Title row: app icon (root only) + inline editable title */}
      <div className={styles.titleRow}>
        {isCurrentNodeRoot && selectedNodeId && (
          <TitleAppIcon
            nodeId={selectedNodeId}
            value={String(selectedNode.appIcon ?? selectedNode.metadata?.appIcon ?? '')}
            editable={editorMode === 'edit'}
          />
        )}
        <div
          ref={titleRef}
          className={styles.nodeTitle}
          contentEditable={editorMode === 'edit'}
          suppressContentEditableWarning
          onInput={handleTitleChange}
          onBlur={handleTitleChange}
          data-placeholder={lbl.contextualEditor.untitledPlaceholder}
          aria-label={lbl.contextualEditor.nodeTitleAriaLabel}
        >
          {selectedNode.name}
        </div>
      </div>

      {/* Tabs — root shows all three; units show only Details */}
      <TabBar
        activeTab={activeTab}
        onChange={tab => setActiveTab(tab as TabId)}
        errorTabs={errorTabs}
        visibleTabs={isCurrentNodeRoot ? undefined : ['details']}
      />

      {/* Form */}
      <div className={styles.formArea}>
        <SparkMetaForm
          key={`${selectedNodeId ?? 'none'}:${isCurrentNodeRoot ? 'root' : 'node'}`}
          nodeMetadata={activeNodeMeta}
          activeTab={activeTab}
          isRoot={isCurrentNodeRoot}
          isFolder={isCurrentNodeFolder}
          editorMode={editorMode}
          onFormValueChange={handleFormValueChange}
          onFormStatusChange={handleFormStatusChange}
        />
      </div>

      {/* Content list — for folder nodes (both root and non-root units) */}
      {(isCurrentNodeFolder || isCurrentNodeRoot) && activeTab === 'details' && (
        <div className={styles.contentListArea}>
          <UnitContentList editorMode={editorMode} />
        </div>
      )}

      {/* Drop zone overlay */}
      <DropZone
        isActive={false}
        label={lbl.contextualEditor.dropZoneLabel}
        nodeId={selectedNodeId ?? undefined}
        className={styles.dropZone}
      />

      {/* Modals */}
      {showAssignPage && (
        <AssignPageNumber contentId={contentId} onClose={() => setShowAssignPage(false)} />
      )}
    </div>
  );
};

function findNodeById(
  nodes: import('../../types/editor').INode[],
  id: string,
): import('../../types/editor').INode | undefined {
  for (const n of nodes) {
    if (n.id === id) return n;
    if (n.children) {
      const f = findNodeById(n.children, id);
      if (f) return f;
    }
  }
  return undefined;
}
