import { create } from 'zustand';
import type { INode } from '../types/editor';
import type { IContent } from '../types/content';
import { useEditorStore } from './editor.store';

interface TreeState {
  treeData: INode[];
  selectedNodeId: string | null;
  treeCache: Record<string, Record<string, unknown>>;
  breadcrumb: Array<{ id: string; name: string }>;
  activeNodeMeta: Record<string, unknown>;
  // actions
  setTreeData: (nodes: INode[]) => void;
  selectNode: (id: string) => void;
  updateNode: (id: string, patch: Record<string, unknown>) => void;
  addNode: (parentId: string, type: 'unit' | 'subunit') => string;
  deleteNode: (id: string) => void;
  reorderChildren: (parentId: string, fromIndex: number, toIndex: number) => void;
  addResource: (content: IContent, nodeId: string) => boolean;
  markDirty: () => void;
  getNodeById: (id: string) => INode | undefined;
  getChildrenOf: (id: string) => INode[];
  getBreadcrumb: (id: string) => Array<{ id: string; name: string }>;
  moveNode: (nodeId: string, fromParentId: string, toParentId: string) => void;
  replaceNodeIds: (identifiers: Record<string, string>) => void;
}

// BFS through treeData to find a node by id
function bfsFind(nodes: INode[], id: string): INode | undefined {
  const queue: INode[] = [...nodes];
  while (queue.length > 0) {
    const node = queue.shift()!;
    if (node.id === id) return node;
    if (node.children) queue.push(...node.children);
  }
  return undefined;
}

// Compute the depth of a target node (root nodes are depth 0)
function getNodeDepth(nodes: INode[], targetId: string, depth = 0): number {
  for (const n of nodes) {
    if (n.id === targetId) return depth;
    if (n.children?.length) {
      const found = getNodeDepth(n.children, targetId, depth + 1);
      if (found >= 0) return found;
    }
  }
  return -1;
}

// Deep merge a patch into a node's properties within a tree
// Fields that live both on INode top-level AND inside node.metadata
const METADATA_MIRROR_FIELDS = new Set([
  'name', 'appIcon', 'description', 'keywords', 'trackable',
  'qrCodeProcessId', 'reservedDialcodes',
]);

function deepMergeNode(nodes: INode[], id: string, patch: Record<string, unknown>): INode[] {
  return nodes.map((node) => {
    if (node.id === id) {
      const explicitMetaPatch = (patch['metadata'] as Record<string, unknown>) ?? {};
      // Mirror top-level patch fields into metadata so cleanMetadata sees the latest values
      const mirroredFields: Record<string, unknown> = {};
      for (const key of METADATA_MIRROR_FIELDS) {
        if (key in patch) mirroredFields[key] = patch[key];
      }
      return {
        ...node,
        ...patch,
        metadata: { ...(node.metadata ?? {}), ...mirroredFields, ...explicitMetaPatch },
      };
    }
    if (node.children && node.children.length > 0) {
      return { ...node, children: deepMergeNode(node.children, id, patch) };
    }
    return node;
  });
}

// Insert a new node into parent's children
function insertIntoParent(nodes: INode[], parentId: string, newNode: INode): INode[] {
  return nodes.map((node) => {
    if (node.id === parentId) {
      return { ...node, children: [...(node.children ?? []), newNode] };
    }
    if (node.children && node.children.length > 0) {
      return { ...node, children: insertIntoParent(node.children, parentId, newNode) };
    }
    return node;
  });
}

// Recursively filter out a node
function removeNode(nodes: INode[], id: string): INode[] {
  return nodes
    .filter((node) => node.id !== id)
    .map((node) => ({
      ...node,
      children: node.children ? removeNode(node.children, id) : [],
    }));
}

// Reorder children of a parent node
function reorderInParent(nodes: INode[], parentId: string, from: number, to: number): INode[] {
  return nodes.map((node) => {
    if (node.id === parentId) {
      const children = [...(node.children ?? [])];
      const [moved] = children.splice(from, 1);
      children.splice(to, 0, moved);
      return { ...node, children };
    }
    if (node.children && node.children.length > 0) {
      return { ...node, children: reorderInParent(node.children, parentId, from, to) };
    }
    return node;
  });
}

// Recursively rename node ids (temp-xxx → do_xxx) after a save that returns identifiers
function renameNodeIds(nodes: INode[], idMap: Record<string, string>): INode[] {
  return nodes.map((node) => {
    const newId = idMap[node.id] ?? node.id;
    const newParent = node.parent ? (idMap[node.parent] ?? node.parent) : node.parent;
    return {
      ...node,
      id: newId,
      identifier: newId,
      parent: newParent,
      children: node.children ? renameNodeIds(node.children, idMap) : [],
    };
  });
}

// Count all non-folder (leaf content) nodes in the tree via BFS
function countLeafNodes(nodes: INode[]): number {
  let count = 0;
  const queue: INode[] = [...nodes];
  while (queue.length > 0) {
    const node = queue.shift()!;
    if (!node.isFolder) count++;
    if (node.children) queue.push(...node.children);
  }
  return count;
}

// Build breadcrumb by walking parent references via BFS lookup
function buildBreadcrumb(
  nodes: INode[],
  id: string,
): Array<{ id: string; name: string }> {
  const node = bfsFind(nodes, id);
  if (!node) return [];
  const crumbs: Array<{ id: string; name: string }> = [];
  let current: INode | undefined = node;
  while (current) {
    crumbs.unshift({ id: current.id, name: current.name });
    current = current.parent ? bfsFind(nodes, current.parent) : undefined;
  }
  return crumbs;
}

export const useTreeStore = create<TreeState>((set, get) => ({
  treeData: [],
  selectedNodeId: null,
  treeCache: {},
  breadcrumb: [],
  activeNodeMeta: {},

  setTreeData: (nodes) => {
    const firstId = nodes[0]?.id ?? null;
    set({ treeData: nodes, selectedNodeId: firstId });
    // Activate the first node so activeNodeMeta and isCurrentNodeRoot are populated
    if (firstId) {
      // Use setTimeout to let the treeData state settle before selectNode reads it
      setTimeout(() => get().selectNode(firstId), 0);
    }
  },

  selectNode: (id) => {
    const { treeData, treeCache, getBreadcrumb } = get();
    const node = bfsFind(treeData, id);
    const breadcrumb = getBreadcrumb(id);
    // Merge treeCache so non-mirror fields (audience, board, targetBoardIds, etc.)
    // are included in activeNodeMeta and available to SparkMetaForm on remount.
    const activeNodeMeta = { ...(node?.metadata ?? {}), ...(treeCache[id] ?? {}) };

    // Update editor store node flags synchronously so consumers don't read a
    // stale isRoot/isFolder for a render after the node changes.
    useEditorStore.getState().setNodeFlags({
      isFolder: node?.isFolder ?? false,
      isRoot: !node?.parent,
      isQuml: false,
    });

    set({ selectedNodeId: id, breadcrumb, activeNodeMeta });
  },

  updateNode: (id, patch) => {
    set((state) => ({
      treeData: deepMergeNode(state.treeData, id, patch),
      treeCache: {
        ...state.treeCache,
        [id]: { ...(state.treeCache[id] ?? {}), ...patch },
      },
    }));
    // Any node edit (root/unit/leaf form, inline title) must mark the tree
    // dirty so the debounced autosave in useSaveHierarchy actually runs.
    get().markDirty();
  },

  addNode: (parentId, _type) => {
    const state = get();
    const maxDepth = useEditorStore.getState().editorConfig?.config?.maxDepth ?? 4;
    const parentDepth = getNodeDepth(state.treeData, parentId);

    // parentDepth is the depth of the parent; child would be at parentDepth + 1.
    // Allow children at depths 1..maxDepth (root is depth 0), matching Angular behaviour.
    if (parentDepth >= maxDepth) {
      console.warn(`[tree.store] addNode: depth would exceed maxDepth (${maxDepth}). parentDepth=${parentDepth}`);
      return '';
    }

    const newId = 'temp-' + Math.random().toString(36).slice(2);
    const newNode: INode = {
      id: newId,
      identifier: newId,
      name: 'Untitled Unit',
      isFolder: true,
      children: [],
      parent: parentId,
      metadata: {
        mimeType: 'application/vnd.ekstep.content-collection',
        code: newId,
        name: 'Untitled Unit',
        visibility: 'Parent',
      },
    };

    set((state) => ({
      treeData: insertIntoParent(state.treeData, parentId, newNode),
      treeCache: {
        ...state.treeCache,
        [newId]: { ...newNode.metadata, isNew: true },
      },
    }));

    // Defer selectNode so treeData settles before bfsFind runs — same pattern as setTreeData.
    setTimeout(() => get().selectNode(newId), 0);
    return newId;
  },

  deleteNode: (id) => {
    set((state) => ({
      treeData: removeNode(state.treeData, id),
      selectedNodeId: state.selectedNodeId === id ? null : state.selectedNodeId,
    }));
  },

  reorderChildren: (parentId, fromIndex, toIndex) => {
    set((state) => ({
      treeData: reorderInParent(state.treeData, parentId, fromIndex, toIndex),
    }));
  },

  moveNode: (nodeId, _fromParentId, toParentId) => {
    set((state) => {
      const node = bfsFind(state.treeData, nodeId);
      if (!node) return state;
      let newTree = removeNode(state.treeData, nodeId);
      newTree = insertIntoParent(newTree, toParentId, { ...node, parent: toParentId });
      return { treeData: newTree };
    });
    get().markDirty();
  },

  addResource: (content, nodeId) => {
    const config = useEditorStore.getState().editorConfig;
    // Prevent adding content directly under the root node unless explicitly allowed by config
    const allowContentUnderRoot = config?.config?.allowContentUnderRoot ?? false;
    const rootId = get().treeData[0]?.id;
    if (!allowContentUnderRoot && nodeId === rootId) {
      return false;
    }

    // Prevent duplicate content anywhere in the collection (cross-unit)
    if (bfsFind(get().treeData, content.identifier)) {
      return false;
    }

    // Enforce maxContentsLimit (default 1200) and maxQuestionsLimit (default 500)
    const maxContents = (config?.config as unknown as Record<string, unknown>)?.['maxContentsLimit'] as number | undefined ?? 1200;
    const currentLeafCount = countLeafNodes(get().treeData);
    if (currentLeafCount >= maxContents) {
      return false;
    }

    const leafNode: INode = {
      id: content.identifier,
      identifier: content.identifier,
      name: content.name,
      isFolder: false,
      children: [],
      parent: nodeId,
      mimeType: content.mimeType,
      primaryCategory: content.primaryCategory,
      contentType: content.contentType,
      appIcon: content.appIcon,
      status: content.status,
      metadata: content as unknown as Record<string, unknown>,
    };

    set((state) => ({
      treeData: insertIntoParent(state.treeData, nodeId, leafNode),
    }));

    get().markDirty();
    return true;
  },

  markDirty: () => {
    // View modes (review/read/sourcingreview) never dirty the tree — form
    // mount-time normalization fires updateNode even when just viewing, which
    // would otherwise show "Unsaved" and trigger the back-guard.
    const { editorMode, setIsDirty } = useEditorStore.getState();
    if (editorMode === 'edit') setIsDirty(true);
  },

  replaceNodeIds: (identifiers) => {
    if (!identifiers || Object.keys(identifiers).length === 0) return;
    set((state) => {
      const newTreeData = renameNodeIds(state.treeData, identifiers);
      // Rebuild treeCache with renamed keys and clear isNew flags for persisted nodes
      const newCache: Record<string, Record<string, unknown>> = {};
      for (const [oldId, cached] of Object.entries(state.treeCache)) {
        const newId = identifiers[oldId] ?? oldId;
        const { isNew: _, ...rest } = cached;
        newCache[newId] = rest;
      }
      const newSelectedId = state.selectedNodeId
        ? (identifiers[state.selectedNodeId] ?? state.selectedNodeId)
        : null;
      return { treeData: newTreeData, treeCache: newCache, selectedNodeId: newSelectedId };
    });
  },

  getNodeById: (id) => {
    return bfsFind(get().treeData, id);
  },

  getChildrenOf: (id) => {
    const node = bfsFind(get().treeData, id);
    return node?.children ?? [];
  },

  getBreadcrumb: (id) => {
    return buildBreadcrumb(get().treeData, id);
  },
}));

export const getTreeStore = () => useTreeStore.getState;
