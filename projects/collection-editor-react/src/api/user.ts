import { apiClient } from './client';

export interface IUser {
  identifier: string;
  firstName: string;
  lastName?: string;
  email?: string;
  phone?: string;
  userName?: string;
  rootOrgName?: string;
  organisations?: Array<{ orgName?: string; roles?: string[] }>;
}

// Fields the user-search API must return for the collaborator UI.
const USER_FIELDS = ['email', 'firstName', 'lastName', 'identifier', 'organisations', 'rootOrgName', 'phone'];

interface SearchOpts {
  // User's rootOrgId — scopes search to the current tenant (mirrors Angular's
  // ecEditor.getContext('user').orgIds). Without this Sunbird returns cross-
  // tenant results or nothing depending on server-side tenant isolation policy.
  rootOrgId?: string;
  // Passed as X-Channel-Id; redundant when client.ts injects it globally but
  // kept here for explicit per-call control if ever needed.
  objectType?: string;
  limit?: number;
}

/**
 * Search content-creator users by name, email, or phone number.
 * Mirrors the Angular collaborator plugin's three-branch detection logic:
 *   - Contains "@"         → filters.email  (exact match)
 *   - All digits, ≥10 chars → filters.phone  (exact match)
 *   - Everything else      → request.query  (free-text name search)
 *
 * The ?fields=orgName query param instructs the API to populate orgName inside
 * each user's organisations array, which is required to display the org name.
 */
export async function searchUsers(query: string, opts: SearchOpts = {}): Promise<IUser[]> {
  // Role: TextBook uses BOOK_CREATOR, everything else uses CONTENT_CREATOR.
  const role = opts.objectType?.toLowerCase() === 'textbook' ? 'BOOK_CREATOR' : 'CONTENT_CREATOR';
  const filters: Record<string, unknown> = { 'organisations.roles': [role] };

  // Scope to the current tenant so search returns relevant users only.
  if (opts.rootOrgId) filters['rootOrgId'] = [opts.rootOrgId];

  // Three-branch detection — mirrors Angular collaboratorApp.js
  const isEmail = query.includes('@');
  const isPhone = /^\d{10,}$/.test(query.trim());

  const requestBody: Record<string, unknown> = {
    filters,
    fields: USER_FIELDS,
    offset: 0,
    limit: opts.limit ?? 200,
  };

  if (isEmail) {
    filters['email'] = query.trim();
  } else if (isPhone) {
    filters['phone'] = query.trim();
  } else {
    requestBody['query'] = query;
  }

  const response = await apiClient.post(
    '/action/user/v1/search',
    { request: requestBody },
    {
      // ?fields=orgName populates orgName inside each user's organisations array.
      params: { fields: 'orgName' },
      headers: {
        'X-Source': 'web',
        'X-msgid': Math.random().toString(36).slice(2),
      },
    },
  );
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

/**
 * Read a user's profile — used to auto-fill the author field with the current
 * user's name. Served via the portal-service proxy (session auth), the same
 * route family as the questionset APIs (/portal/*).
 * Response shape: { result: { response: { firstName, lastName, userName, … } } }
 */
export async function readUser(userId: string): Promise<IUser> {
  const response = await apiClient.get(`/portal/user/v5/read/${userId}`);
  return (response.data?.result?.response ?? {}) as IUser;
}
