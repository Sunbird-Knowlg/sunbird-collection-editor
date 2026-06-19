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
          try {
            const parsed = await getCategoryDefinition(
              primaryCategory, channel, config.config.objectType ?? 'Collection',
            );
            if (!cancelled) {
              setCategoryDefinition(parsed);
              // Honor the maxDepth declared by sourcingSettings when present.
              const sourcingMaxDepth = (
                parsed.sourcingSettings?.collection as Record<string, unknown> | undefined
              )?.maxDepth as number | undefined;
              if (sourcingMaxDepth && !config.config.maxDepth) {
                setEditorConfig({
                  ...config,
                  config: { ...config.config, maxDepth: sourcingMaxDepth },
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
