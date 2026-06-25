import { useCallback } from 'react';
import toast from 'react-hot-toast';
import type { ToolbarAction } from '../types/editor';
import { useEditorStore } from '../store/editor.store';
import { useTreeStore } from '../store/tree.store';
import {
  sendForReview as sendForReviewApi,
  rejectContent,
  publishContent,
} from '../api/hierarchy';

/**
 * Centralises the review / publish / reject toolbar flows — mirroring how the
 * Angular editor.component handles them internally (save → API → toast).
 *
 * The modals (publish checklist, reject comment, send-for-review confirm) only
 * collect input and emit the action; this hook performs the actual API work so
 * the buttons function out-of-the-box without the host app implementing them.
 *
 * Returns runAction(action, data) -> Promise<boolean> (true on success).
 */
export function useToolbarActions(save: () => Promise<void>) {
  const config = useEditorStore((s) => s.editorConfig);
  const setButtonLoader = useEditorStore((s) => s.setButtonLoader);
  const validateAllForms = useEditorStore((s) => s.validateAllForms);
  const treeData = useTreeStore((s) => s.treeData);

  const runAction = useCallback(
    async (action: ToolbarAction, data?: unknown): Promise<boolean> => {
      const contentId =
        config?.context?.contentId ?? config?.context?.identifier ?? '';
      if (!contentId) {
        toast.error('No content identifier found.');
        return false;
      }
      const lastUpdatedBy =
        config?.context?.userId ?? config?.context?.uid ?? '';

      try {
        switch (action) {
          case 'sendForReview':
            if (!validateAllForms(treeData)) {
              toast.error('Some units have missing required fields. Please fill them before sending for review.');
              return false;
            }
            setButtonLoader('saveCollection', true);
            // Persist the hierarchy first (Angular: saveContent() -> reviewContent()).
            await save();
            await sendForReviewApi(contentId);
            toast.success('Content sent for review');
            return true;

          case 'reject': {
            setButtonLoader('rejectCollection', true);
            const comment = (data as { comment?: string } | undefined)?.comment ?? '';
            await rejectContent(contentId, comment);
            toast.success('Content rejected and sent back to the author');
            return true;
          }

          case 'publish':
            if (!validateAllForms(treeData)) {
              toast.error('Some units have missing required fields. Please fill them before publishing.');
              return false;
            }
            setButtonLoader('publishCollection', true);
            await save();
            await publishContent(contentId, lastUpdatedBy);
            toast.success('Content published successfully');
            return true;

          default:
            return false;
        }
      } catch (err) {
        console.error(`[useToolbarActions] ${action} failed`, err);
        const verb =
          action === 'sendForReview'
            ? 'send for review'
            : action === 'reject'
              ? 'reject'
              : 'publish';
        toast.error(`Failed to ${verb}. Please try again.`);
        return false;
      } finally {
        setButtonLoader('saveCollection', false);
        setButtonLoader('rejectCollection', false);
        setButtonLoader('publishCollection', false);
      }
    },
    [config, save, setButtonLoader],
  );

  return { runAction };
}
