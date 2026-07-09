import { apiClient } from './client';
import type { IFramework, ITerm } from '../types/framework';

export async function getFramework(frameworkId: string): Promise<IFramework> {
  const response = await apiClient.get(
    `/api/framework/v1/read/${frameworkId}`,
  );
  return response.data?.result?.framework as IFramework;
}

export async function searchTerms(
  frameworkId: string,
  categoryCode: string,
  query?: string,
): Promise<ITerm[]> {
  const response = await apiClient.get('/api/framework/v1/term/read', {
    params: {
      frameworkId,
      codeId: categoryCode,
      ...(query ? { query } : {}),
    },
  });
  return (response.data?.result?.terms ?? []) as ITerm[];
}

export interface IFrameworkSearchResult {
  identifier: string;
  name: string;
  type?: string;
}

/**
 * Discover Live frameworks via composite search — mirrors Angular
 * FrameworkService.getFrameworkData (framework.service.ts:102-119). Used to
 * extend the "Course Type" dropdown with frameworks whose orgFWType the
 * channel does not already list.
 */
export async function searchFrameworks(filters: {
  type?: string[];
  identifier?: string[];
  channel?: string;
  systemDefault?: string;
}): Promise<IFrameworkSearchResult[]> {
  const response = await apiClient.post('/action/composite/v3/search', {
    request: {
      filters: {
        objectType: 'Framework',
        status: ['Live'],
        ...(filters.type ? { type: filters.type } : {}),
        ...(filters.identifier ? { identifier: filters.identifier } : {}),
        ...(filters.channel ? { channel: filters.channel } : {}),
        ...(filters.systemDefault ? { systemDefault: filters.systemDefault } : {}),
      },
    },
  });
  return (response.data?.result?.Framework ?? []) as IFrameworkSearchResult[];
}
