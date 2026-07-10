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
import { findMissingRequiredFields } from '../utils/validateRequiredFields';
import { useFramework } from './useFramework';

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
  const rootFormConfig = useEditorStore((s) => s.rootFormConfig);
  const unitFormConfig = useEditorStore((s) => s.unitFormConfig);
  const treeData = useTreeStore((s) => s.treeData);
  const treeCache = useTreeStore((s) => s.treeCache);
  const selectNode = useTreeStore((s) => s.selectNode);

  // Same framework resolution as SparkMetaForm (react-query dedupes the read),
  // so required-field validation sees the same adapted field set the form
  // renders — e.g. USF drops the BMGS fields, so they must not be validated.
  const contentFramework = useEditorStore((s) => s.contentFramework);
  const contentTargetFWIds = useEditorStore((s) => s.contentTargetFWIds);
  const { organisationFramework, targetFrameworks } = useFramework(
    (contentFramework ?? config?.context?.framework) as string | undefined,
    (contentTargetFWIds ?? config?.context?.targetFWIds) as string[] | undefined,
  );

  /**
   * Tree-wide required-field gate for Save / Send-for-review / Publish.
   * Unlike validateAllForms (touched-forms only), this validates every
   * root/unit node's metadata against its form config. On failure: toast the
   * first offending node + fields, flag the nodes, and select the first one
   * so its form opens with the errors visible.
   */
  const checkRequiredFields = useCallback((): boolean => {
    const ctx = {
      editorMode: 'edit' as const,
      objectType: config?.config?.objectType,
      userFullName: (config?.context as unknown as { user?: { fullName?: string } })
        ?.user?.fullName,
    };
    const gaps = findMissingRequiredFields(
      treeData,
      treeCache,
      rootFormConfig as Array<Record<string, unknown>> | null,
      unitFormConfig as Array<Record<string, unknown>> | null,
      ctx,
      { organisationFramework, targetFrameworks },
    );
    if (gaps.length === 0) return true;

    const first = gaps[0];
    toast.error(
      `"${first.nodeName}": please fill required field${first.missing.length > 1 ? 's' : ''} — ${first.missing.join(', ')}`,
    );
    const { setFormStatus } = useEditorStore.getState();
    gaps.forEach((g) => setFormStatus(g.nodeId, false));
    selectNode(first.nodeId);
    return false;
  }, [treeData, treeCache, rootFormConfig, unitFormConfig, config, selectNode, organisationFramework, targetFrameworks]);

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
            // Metadata-level gate (toasts specifics internally), then the
            // touched-form mapper for format-level errors.
            if (!checkRequiredFields()) return false;
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
            if (!checkRequiredFields()) return false;
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
    [config, save, setButtonLoader, checkRequiredFields, validateAllForms, treeData],
  );

  return { runAction, checkRequiredFields };
}
