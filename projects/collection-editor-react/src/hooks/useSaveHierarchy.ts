import { useState, useCallback } from 'react';
import { useTreeStore } from '../store/tree.store';
import { useEditorStore } from '../store/editor.store';
import { updateHierarchy } from '../api/hierarchy';
import type { INode } from '../types/editor';
import toast from 'react-hot-toast';

// ---------------------------------------------------------------------------
// Build the nodesModified + hierarchy payload expected by Sunbird v3 API
//
// Key rules (derived from the working curl reference request):
//  1. nodesModified  → root node always; new nodes; folders WITH cached edits only
//                      Leaf content is NEVER in nodesModified (API ignores it)
//  2. hierarchy      → ALL nodes (root, folders, leaf content)
//                      Folder entries include relationalMetadata for any leaf
//                      children that have cached edits (name/keywords/optional)
//  3. lastUpdatedBy  → top-level field on `data`, NOT inside nodesModified entries
// ---------------------------------------------------------------------------
function buildSavePayload(
  nodes: INode[],
  treeCache: Record<string, Record<string, unknown>>,
  channel: string,
): {
  nodesModified: Record<string, unknown>;
  hierarchy: Record<string, unknown>;
} {
  const nodesModified: Record<string, unknown> = {};
  const hierarchy: Record<string, unknown> = {};

  // React-internal fields that must never be sent to the API
  const BASE_STRIP = new Set([
    'id', 'isFolder', 'children', 'parent', 'isNew', 'breadcrumb', 'title',
    // relationalMetadata is leaf-content-specific; it does not belong in nodesModified metadata
    'relationalMetadata', 'optional',
  ]);

  // Framework fields that require validated term identifiers.
  // Strip from ORIGINAL loaded metadata but ALLOW when user explicitly sets via form.
  const FRAMEWORK_STRIP = new Set([
    'targetBoardIds', 'targetMediumIds', 'targetGradeLevelIds',
    'targetSubjectIds', 'targetFWIds', 'targetTopicIds',
    'topic', 'topicsIds',
  ]);

  // Fields the API requires as arrays.
  // Both legacy names (board/medium/gradeLevel/subject) and *Ids variants are listed
  // because different category definitions use different field codes.
  const ARRAY_FIELDS = new Set([
    'audience', 'attributions', 'keywords', 'language', 'additionalCategories',
    // Org-framework fields — legacy codes (board is scalar; medium/gradeLevel/subject are arrays)
    'medium', 'gradeLevel', 'subject',
    // Org-framework fields — *Ids codes used by newer category definitions (all arrays)
    'boardIds', 'mediumIds', 'gradeLevelIds', 'subjectIds',
    // Target-framework fields
    'targetBoardIds', 'targetMediumIds', 'targetGradeLevelIds', 'targetSubjectIds',
    // Dial codes
    'dialcodes',
  ]);

  // Fields the API requires as numbers
  const NUMBER_FIELDS = new Set(['copyrightYear', 'compatibilityLevel', 'version']);

  function cleanMetadata(
    raw: Record<string, unknown>,
    stripFramework = false,
  ): Record<string, unknown> {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(raw)) {
      if (BASE_STRIP.has(k)) continue;
      if (stripFramework && FRAMEWORK_STRIP.has(k)) continue;
      if (ARRAY_FIELDS.has(k)) {
        if (Array.isArray(v)) out[k] = v;
        else if (v !== null && v !== undefined && v !== '') out[k] = [v];
        else out[k] = [];
      } else if (NUMBER_FIELDS.has(k)) {
        const n = Number(v);
        if (!isNaN(n)) out[k] = n;
      } else {
        out[k] = v;
      }
    }
    return out;
  }

  // Build relationalMetadata for direct leaf-content children of a folder.
  // The API stores collection-specific resource attributes (name, keywords, optional)
  // on the PARENT unit's hierarchy entry, not on the resource's nodesModified entry.
  function buildRelationalMeta(node: INode): Record<string, Record<string, unknown>> {
    const relMeta: Record<string, Record<string, unknown>> = {};
    for (const child of node.children ?? []) {
      if (child.isFolder) continue; // only for leaf content
      const childCached = treeCache[child.identifier];
      if (!childCached) continue;
      const { isNew: _, ...childEdits } = childCached;
      if (Object.keys(childEdits).length === 0) continue;

      // Merge existing relationalMetadata (from the loaded hierarchy) with user edits.
      const existingRelMeta = (child.metadata?.relationalMetadata ?? {}) as Record<string, unknown>;
      relMeta[child.identifier] = {
        name: child.name,
        ...existingRelMeta,
        ...childEdits, // user edits always win
      };
    }
    return relMeta;
  }

  function walk(node: INode, isRoot: boolean) {
    const identifier = node.identifier;
    const cached = treeCache[identifier];
    const isNew = identifier.startsWith('temp-') || !!(cached?.isNew);

    // ── nodesModified entry ──────────────────────────────────────────────────
    // Root: always. New nodes: always. Folders with cached edits: yes.
    // Leaf content: NEVER (goes into parent's relationalMetadata instead).
    const isLeaf = !node.isFolder && !isRoot;

    if (isRoot || isNew || (cached && !isLeaf)) {
      let metadata: Record<string, unknown>;

      if (isNew) {
        metadata = {
          mimeType: 'application/vnd.ekstep.content-collection',
          code: identifier,
          contentType: (node.metadata?.contentType as string) ?? 'CourseUnit',
          primaryCategory: (node.metadata?.primaryCategory as string) ?? 'Course Unit',
          name: node.name,
          visibility: 'Parent',
          channel,
          ...cleanMetadata(node.metadata ?? {}),
        };
      } else if (isRoot) {
        const { isNew: _n, ...cacheEdits } = cached ?? {};
        metadata = {
          ...cleanMetadata(node.metadata ?? {}, true),
          ...cleanMetadata(cacheEdits, false),
          name: node.name,
        };
      } else {
        // Existing folder (unit) with cached edits
        const { isNew: _n, ...cacheEdits } = cached ?? {};
        metadata = {
          name: node.name,
          visibility: 'Parent',
          ...cleanMetadata(cacheEdits, true),
        };
      }

      nodesModified[identifier] = {
        metadata,
        objectType: node.objectType || (node.isFolder ? 'Collection' : 'Content'),
        root: isRoot,
        isNew,
      };
    }

    // ── hierarchy entry — ALL nodes ──────────────────────────────────────────
    // Leaf content appears in hierarchy with empty children[].
    // Folders also carry relationalMetadata for any edited leaf children.
    const relMeta = node.isFolder ? buildRelationalMeta(node) : {};
    hierarchy[identifier] = {
      name: node.name,
      children: (node.children ?? []).map((c) => c.identifier),
      ...(Object.keys(relMeta).length > 0 ? { relationalMetadata: relMeta } : {}),
      root: isRoot,
    };

    // Recurse
    (node.children ?? []).forEach((child) => walk(child, false));
  }

  nodes.forEach((node, i) => walk(node, i === 0));

  return { nodesModified, hierarchy };
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------
export function useSaveHierarchy() {
  const [isSaving, setIsSaving] = useState(false);

  const treeCache = useTreeStore((s) => s.treeCache);
  const treeData = useTreeStore((s) => s.treeData);
  const isDirty = useEditorStore((s) => s.isDirty);
  const lastSaved = useEditorStore((s) => s.lastSaved);
  const { setIsDirty, setLastSaved } = useEditorStore();
  const config = useEditorStore((s) => s.editorConfig);

  const save = useCallback(async () => {
    if (!config || isSaving) return;
    const contentId =
      config.context.contentId ?? config.context.identifier ?? '';
    if (!contentId) return;

    const channel = config.context.channel ?? '';
    const lastUpdatedBy = config.context.userId ?? config.context.uid ?? '';

    setIsSaving(true);
    try {
      const { nodesModified, hierarchy } = buildSavePayload(treeData, treeCache, channel);
      const { identifiers } = await updateHierarchy(contentId, nodesModified, hierarchy, lastUpdatedBy);
      // Replace temp- ids with server-assigned do_ ids so subsequent saves
      // don't re-create the same nodes as new duplicates.
      if (identifiers && Object.keys(identifiers).length > 0) {
        useTreeStore.getState().replaceNodeIds(identifiers);
      }
      const ts = new Date().toISOString();
      setLastSaved(ts);
      setIsDirty(false);
    } catch (e) {
      console.error('[useSaveHierarchy] save failed:', e);
      toast.error('Failed to save. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }, [config, isSaving, treeData, treeCache, setIsDirty, setLastSaved]);

  return {
    save,
    isSaving,
    isDirty,
    lastSaved,
  };
}
