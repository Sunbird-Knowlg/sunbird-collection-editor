import { apiClient } from './client';

export interface IUser {
  identifier: string;
  firstName: string;
  lastName?: string;
  email?: string;
  userName?: string;
  organisations?: Array<{ orgName?: string }>;
}

// Fields the user-search API must return for the collaborator UI.
const USER_FIELDS = ['email', 'firstName', 'lastName', 'identifier', 'organisations', 'rootOrgName', 'phone'];

interface SearchOpts {
  rootOrgId?: string;
  limit?: number;
}

/**
 * Search content-creator users by name/email. Mirrors the Sunbird collaborator
 * search: restricts to CONTENT_CREATOR role and (optionally) the same org.
 */
export async function searchUsers(query: string, opts: SearchOpts = {}): Promise<IUser[]> {
  const filters: Record<string, unknown> = { 'organisations.roles': 'CONTENT_CREATOR' };
  if (opts.rootOrgId) filters.rootOrgId = opts.rootOrgId;

  const response = await apiClient.post('/api/user/v1/search', {
    request: {
      query,
      filters,
      fields: USER_FIELDS,
      offset: 0,
      limit: opts.limit ?? 20,
    },
  });
  return (response.data?.result?.response?.content ?? []) as IUser[];
}

/**
 * Resolve a set of user identifiers to full user objects (used to render the
 * content's existing collaborators by name rather than raw id).
 */
export async function getUsersByIds(ids: string[]): Promise<IUser[]> {
  if (!ids.length) return [];
  const response = await apiClient.post('/api/user/v1/search', {
    request: {
      filters: { userId: ids },
      fields: USER_FIELDS,
      limit: ids.length,
    },
  });
  return (response.data?.result?.response?.content ?? []) as IUser[];
}
