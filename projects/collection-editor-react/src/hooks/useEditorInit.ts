import { useState, useEffect } from 'react';
import type { IEditorConfig } from '../types/editor';
import { useEditorStore } from '../store/editor.store';
import { useTreeStore } from '../store/tree.store';
import { readHierarchy, readQuestionSetHierarchyTree } from '../api/hierarchy';
import { getCategoryDefinition } from '../api/categoryDefinition';
import { getChannelData } from '../api/channel';
import { setApiBaseUrl } from '../api/client';

interface UseEditorInitOptions {
  config: IEditorConfig;
  onError?: (e: Error) => void;
}

/**
 * Pure framework/target resolution — exported for tests.
 *
 * Priority: content metadata (existing content keeps the framework it was
 * authored in) → channel defaultFramework (new/unpinned content follows the
 * channel) → editorConfig context → null.
 */
export function resolveFrameworkIds(
  meta: Record<string, unknown>,
  channelDefaultFramework: string | undefined,
  context: { framework?: string; targetFWIds?: string[] },
): { framework: string | null; targetFWIds: string[] | null } {
  return {
    framework: (meta['framework'] as string | undefined)
      ?? channelDefaultFramework
      ?? context.framework
      ?? null,
    targetFWIds: (meta['targetFWIds'] as string[] | undefined)
      ?? context.targetFWIds
      ?? null,
  };
}

export function useEditorInit({ config, onError }: UseEditorInitOptions) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isReady, setIsReady] = useState(false);

  const { setEditorConfig, setEditorMode, setCategoryDefinition, setContentFramework } = useEditorStore();
  const { setTreeData, selectNode } = useTreeStore();

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        setIsLoading(true);
        setError(null);

        if (config.apiBaseUrl) {
          setApiBaseUrl(config.apiBaseUrl);
        }

        setEditorConfig(config);
        setEditorMode(config.config.mode);

        const contentId =
          config.context.contentId ?? config.context.identifier ?? '';

        // Channel defaultFramework is the middle fallback for framework
        // resolution (content metadata → channel default → context). Fetched
        // best-effort: a failed channel read must not block editor init.
        const channelId = config.context.channel ?? '';
        let channelDefaultFramework: string | undefined;
        if (channelId) {
          try {
            channelDefaultFramework = (await getChannelData(channelId))?.defaultFramework;
          } catch { /* fall through to context.framework */ }
        }
        let frameworkResolved = false;

        if (contentId) {
          // QuestionSet-rooted editors must read from the questionset endpoint
          // (payload under result.questionset); everything else is a
          // content-collection hierarchy.
          const isQuestionSetRoot = config.config.objectType === 'QuestionSet';
          const { rootNode } = isQuestionSetRoot
            ? await readQuestionSetHierarchyTree(contentId)
            : await readHierarchy(contentId);
          if (!cancelled) {
            const nodes = rootNode ? [rootNode] : [];
            setTreeData(nodes);
            if (rootNode) {
              selectNode(rootNode.id);
              const { framework, targetFWIds } = resolveFrameworkIds(
                rootNode.metadata ?? {}, channelDefaultFramework, config.context,
              );
              setContentFramework(framework, targetFWIds);
              frameworkResolved = true;
            }
          }

          // Fetch category definition for dynamic form fields (best-effort, non-blocking)
          const primaryCategory = config.config.primaryCategory ?? 'Course';
          const channel = config.context.channel ?? '';
          const apiVersion = config.config.categoryDefinitionApiVersion ?? 'v1';
          try {
            const parsed = await getCategoryDefinition(
              primaryCategory, channel, config.config.objectType ?? 'Collection', apiVersion,
            );
            if (!cancelled) {
              setCategoryDefinition(parsed);

              // Apply sourcing settings from the category definition into editorConfig.
              // Angular does this via sethierarchyConfig() — merges the full
              // sourcingSettings.collection into editorConfig.config.
              const sourcing = (
                parsed.sourcingSettings?.collection as Record<string, unknown> | undefined
              ) ?? {};

              const configPatch: Record<string, unknown> = {};
              if (sourcing.maxDepth && !config.config.maxDepth) {
                configPatch.maxDepth = sourcing.maxDepth as number;
              }
              // Propagate allowed children types and hierarchy level definitions
              // (used by the tree to control what can be added at each depth).
              if (sourcing.children && !config.config.children) {
                configPatch.children = sourcing.children;
              }
              if (sourcing.hierarchy && !(config.config.hierarchy as Record<string, unknown> | undefined)?.level1) {
                configPatch.hierarchy = {
                  ...(config.config.hierarchy as Record<string, unknown> | undefined ?? {}),
                  ...sourcing.hierarchy as Record<string, unknown>,
                };
              }

              if (Object.keys(configPatch).length > 0) {
                setEditorConfig({
                  ...config,
                  config: { ...config.config, ...configPatch },
                });
              }
            }
          } catch {
            // silently fall back to hardcoded defaults
          }
        }

        // New content (no contentId) or a hierarchy read that returned no root
        // node: still resolve the framework so the form doesn't fall back to
        // context.framework when the channel declares a default.
        if (!cancelled && !frameworkResolved) {
          const { framework, targetFWIds } = resolveFrameworkIds(
            {}, channelDefaultFramework, config.context,
          );
          setContentFramework(framework, targetFWIds);
        }

        if (!cancelled) {
          setIsReady(true);
        }
      } catch (err) {
        if (!cancelled) {
          const e = err instanceof Error ? err : new Error(String(err));
          setError(e);
          onError?.(e);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    init();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.context.contentId, config.context.identifier]);

  return { isLoading, error, isReady };
}
