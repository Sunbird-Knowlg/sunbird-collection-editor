import { useTreeStore } from '../store/tree.store';

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
