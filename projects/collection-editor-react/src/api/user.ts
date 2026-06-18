import { apiClient } from './client';

export interface IUser {
  identifier: string;
  firstName: string;
  lastName?: string;
  email?: string;
  userName?: string;
}

export async function searchUsers(query: string): Promise<IUser[]> {
  const response = await apiClient.post('/api/user/v1/search', {
    request: {
      query,
      filters: {},
      limit: 20,
    },
  });
  return (response.data?.result?.response?.content ?? []) as IUser[];
}
