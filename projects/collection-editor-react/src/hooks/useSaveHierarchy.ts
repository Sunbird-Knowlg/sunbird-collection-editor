import { useState, useCallback, useRef, useEffect } from 'react';
import { useTreeStore } from '../store/tree.store';
import { useEditorStore } from '../store/editor.store';
import { updateHierarchy } from '../api/hierarchy';
import type { INode } from '../types/editor';
import toast from 'react-hot-toast';

// ---------------------------------------------------------------------------
// Build the nodesModified + hierarchy payload expected by Sunbird v3 API
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
  ]);

  // Framework fields that require validated term identifiers.
  // Strip these from the ORIGINAL loaded metadata (may contain stale label-based values)
  // but ALLOW them when the user explicitly sets them via the form (stored in treeCache).
  const FRAMEWORK_STRIP = new Set([
    'targetBoardIds', 'targetMediumIds', 'targetGradeLevelIds',
    'targetSubjectIds', 'targetFWIds', 'targetTopicIds',
    'topic', 'topicsIds',
  ]);

  // Fields the API requires as arrays
  const ARRAY_FIELDS = new Set([
    'audience', 'attributions', 'targetBoardIds', 'targetMediumIds', 'targetGradeLevelIds',
    'targetSubjectIds', 'medium', 'gradeLevel', 'subject', 'additionalCategories',
    'keywords', 'language',
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

  function walk(node: INode, isRoot: boolean) {
    const identifier = node.identifier;
    const cached = treeCache[identifier];
    const isNew = identifier.startsWith('temp-') || !!(cached?.isNew);

    // ── nodesModified entry ──────────────────────────────────────────────────
    // Include if: root, new node, or has cached edits, or is a folder (unit)
    if (isRoot || isNew || cached || node.isFolder) {
      let metadata: Record<string, unknown>;

      if (isNew) {
        // New unit: send all required creation fields
        metadata = {
          mimeType: 'application/vnd.ekstep.content-collection',
          code: identifier, // server replaces temp IDs
          contentType: (node.metadata?.contentType as string) ?? 'CourseUnit',
          primaryCategory: (node.metadata?.primaryCategory as string) ?? 'Course Unit',
          name: node.name,
          visibility: 'Parent',
          channel,
          ...cleanMetadata(node.metadata ?? {}),
        };
      } else if (isRoot) {
        // Root: strip framework fields from original loaded metadata (may have stale label
        // values), but let user-edited cache values pass through with their correct identifiers.
        const { isNew: _n, ...cacheEdits } = cached ?? {};
        metadata = {
          ...cleanMetadata(node.metadata ?? {}, true),   // base: strip framework fields
          ...cleanMetadata(cacheEdits, false),            // user edits: allow framework fields
          name: node.name,
        };
      } else {
        // Existing folder: send only cached changes + name, stripped of framework fields
        const { isNew: _n, ...cacheEdits } = cached ?? {};
        metadata = {
          name: node.name,
          ...cleanMetadata(cacheEdits, true),
        };
      }

      nodesModified[identifier] = {
        metadata,
        objectType: 'Content',
        root: isRoot,
        isNew,
      };
    }

    // ── hierarchy entry (folder/collection nodes only) ───────────────────────
    if (node.isFolder) {
      hierarchy[identifier] = {
        name: node.name,
        children: (node.children ?? []).map((c) => c.identifier),
        root: isRoot,
      };
    }

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
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const treeCache = useTreeStore((s) => s.treeCache);
  const treeData = useTreeStore((s) => s.treeData);
  const isDirty = useEditorStore((s) => s.isDirty);
  const { setIsDirty, setLastSaved } = useEditorStore();
  const config = useEditorStore((s) => s.editorConfig);

  const save = useCallback(async () => {
    if (!config || isSaving) return;
    const contentId =
      config.context.contentId ?? config.context.identifier ?? '';
    if (!contentId) return;

    const channel = config.context.channel ?? '';

    setIsSaving(true);
    try {
      const { nodesModified, hierarchy } = buildSavePayload(treeData, treeCache, channel);
      await updateHierarchy(contentId, nodesModified, hierarchy);
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

  // Auto-save debounce on dirty changes
  useEffect(() => {
    if (!isDirty) return;
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(save, 1500);
    return () => clearTimeout(timerRef.current);
  }, [isDirty, treeCache, save]);

  return {
    save,
    isSaving,
    isDirty,
    lastSaved: useEditorStore.getState().lastSaved,
  };
}
