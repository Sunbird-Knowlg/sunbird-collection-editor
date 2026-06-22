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
  // rootOrgId must be an array (matches the Sunbird user-search contract).
  if (opts.rootOrgId) filters.rootOrgId = [opts.rootOrgId];

  // Must use the /action proxy path — that's where the portal injects the
  // authenticated user token. /api/* is not authenticated and returns 401.
  const response = await apiClient.post('/action/user/v1/search', {
    request: {
      query,
      filters,
      fields: USER_FIELDS,
      offset: 0,
      limit: opts.limit ?? 20,
    },
  }, {
    headers: {
      'X-Source': 'web',
      'X-msgid': Math.random().toString(36).slice(2),
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
  const response = await apiClient.post('/action/user/v1/search', {
    request: {
      filters: { userId: ids },
      fields: USER_FIELDS,
      limit: ids.length,
    },
  }, {
    headers: {
      'X-Source': 'web',
      'X-msgid': Math.random().toString(36).slice(2),
    },
  });
  return (response.data?.result?.response?.content ?? []) as IUser[];
}
