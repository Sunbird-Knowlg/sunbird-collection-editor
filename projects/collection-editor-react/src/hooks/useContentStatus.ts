import { useTreeStore } from '../store/tree.store';
import type { INode } from '../types/editor';

/**
 * Reads the root collection's status from the tree and reports whether it is
 * still in "Draft". Adding units / content is only allowed for Draft content —
 * once it moves to Review / Live, the add affordances are disabled.
 */
export function useIsDraftStatus(): boolean {
  return useTreeStore((s) => {
    const root = s.treeData[0];
    const status =
      ((root?.metadata?.status as string | undefined) ?? root?.status ?? 'Draft');
    return status.toLowerCase() === 'draft';
  });
}

/**
 * Returns true only when the currently selected tree node is a Unit or
 * Sub-Unit (isFolder, but NOT the root). Used to gate the Library + button —
 * content should only be addable to units, not directly to the course root or
 * to individual leaf content nodes.
 */
export function useSelectedNodeIsUnit(): boolean {
  return useTreeStore((s) => {
    if (!s.selectedNodeId) return false;
    const rootId = s.treeData[0]?.id;
    const findNode = (nodes: INode[]): INode | undefined => {
      for (const n of nodes) {
        if (n.id === s.selectedNodeId) return n;
        if (n.children?.length) {
          const found = findNode(n.children);
          if (found) return found;
        }
      }
      return undefined;
    };
    const node = findNode(s.treeData);
    return !!node?.isFolder && node.id !== rootId;
  });
}
