import { apiClient } from './client';
import type { IContent } from '../types/content';

export async function compositeSearch(params: {
  filters?: Record<string, unknown>;
  query?: string;
  limit?: number;
  offset?: number;
  fields?: string[];
  channel?: string;
  sortBy?: Record<string, string>;
}): Promise<{ content: IContent[]; count: number }> {
  const baseFilters: Record<string, unknown> = {
    status: ['Live'],
    ...(params.filters ?? {}),
  };
  if (params.channel) {
    baseFilters['channel'] = params.channel;
  }

  const response = await apiClient.post('/action/composite/v3/search', {
    request: {
      filters: baseFilters,
      query: params.query ?? '',
      limit: params.limit ?? 20,
      offset: params.offset ?? 0,
      sort_by: params.sortBy ?? { lastUpdatedOn: 'desc' },
      fields: params.fields ?? [
        'identifier',
        'name',
        'mimeType',
        'contentType',
        'primaryCategory',
        'appIcon',
        'channel',
        'organisation',
        'pkgVersion',
      ],
    },
  }, {
    headers: {
      'X-Source': 'web',
      'X-msgid': Math.random().toString(36).slice(2),
    },
  });

  const result = response.data?.result ?? {};
  const NON_CONTENT_KEYS = new Set(['count', 'facets']);
  const content = Object.entries(result as Record<string, unknown>)
    .filter(([key]) => !NON_CONTENT_KEYS.has(key))
    .flatMap(([, items]) => Array.isArray(items) ? items : []) as IContent[];
  return {
    content,
    count: (result.count ?? 0) as number,
  };
}

export async function fetchContentDetails(
  contentId: string,
): Promise<IContent> {
  const response = await apiClient.get(
    `/action/content/v3/read/${contentId}`,
  );
  return response.data?.result?.content as IContent;
}
