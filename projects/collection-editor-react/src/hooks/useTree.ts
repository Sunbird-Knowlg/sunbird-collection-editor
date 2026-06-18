import { useTreeStore } from '../store/tree.store';
import type { INode } from '../types/editor';
import type { IContent } from '../types/content';

export interface UseTreeReturn {
  treeData: INode[];
  selectedNode: INode | undefined;
  selectedNodeId: string | null;
  breadcrumb: Array<{ id: string; name: string }>;
  isFolder: boolean;
  isRoot: boolean;
  children: INode[];
  addNode: (parentId: string, type: 'unit' | 'subunit') => string;
  deleteNode: (id: string) => void;
  addResource: (content: IContent, nodeId: string) => void;
  reorderChildren: (parentId: string, fromIndex: number, toIndex: number) => void;
  updateNode: (id: string, patch: Record<string, unknown>) => void;
  getNodeById: (id: string) => INode | undefined;
  selectNode: (id: string) => void;
}

export function useTree(): UseTreeReturn {
  const treeData = useTreeStore((s) => s.treeData);
  const selectedNodeId = useTreeStore((s) => s.selectedNodeId);
  const breadcrumb = useTreeStore((s) => s.breadcrumb);
  const addNode = useTreeStore((s) => s.addNode);
  const deleteNode = useTreeStore((s) => s.deleteNode);
  const addResource = useTreeStore((s) => s.addResource);
  const reorderChildren = useTreeStore((s) => s.reorderChildren);
  const updateNode = useTreeStore((s) => s.updateNode);
  const getNodeById = useTreeStore((s) => s.getNodeById);
  const getChildrenOf = useTreeStore((s) => s.getChildrenOf);
  const selectNode = useTreeStore((s) => s.selectNode);

  const selectedNode = selectedNodeId ? getNodeById(selectedNodeId) : undefined;
  const isFolder = selectedNode?.isFolder ?? false;
  const isRoot = !selectedNode?.parent;
  const children = selectedNodeId ? getChildrenOf(selectedNodeId) : [];

  return {
    treeData,
    selectedNode,
    selectedNodeId,
    breadcrumb,
    isFolder,
    isRoot,
    children,
    addNode,
    deleteNode,
    addResource,
    reorderChildren,
    updateNode,
    getNodeById,
    selectNode,
  };
}
