import { useState, useEffect } from 'react';
import type { IEditorConfig } from '../types/editor';
import { useEditorStore } from '../store/editor.store';
import { useTreeStore } from '../store/tree.store';
import { readHierarchy } from '../api/hierarchy';
import { getCategoryDefinition } from '../api/categoryDefinition';
import { setApiBaseUrl } from '../api/client';

interface UseEditorInitOptions {
  config: IEditorConfig;
  onError?: (e: Error) => void;
}

export function useEditorInit({ config, onError }: UseEditorInitOptions) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isReady, setIsReady] = useState(false);

  const { setEditorConfig, setEditorMode, setCategoryDefinition } = useEditorStore();
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

        if (contentId) {
          const { rootNode } = await readHierarchy(contentId);
          if (!cancelled) {
            const nodes = rootNode ? [rootNode] : [];
            setTreeData(nodes);
            if (rootNode) {
              selectNode(rootNode.id);
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
