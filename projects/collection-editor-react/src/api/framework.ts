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
