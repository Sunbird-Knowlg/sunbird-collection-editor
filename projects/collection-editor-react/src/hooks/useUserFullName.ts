import { useQuery } from '@tanstack/react-query';
import { readUser } from '../api/user';

/**
 * Display name of a user, for auto-filling the author field.
 * firstName + lastName (trimmed), falling back to userName.
 * Cached indefinitely — a user's name doesn't change within a session.
 */
export function useUserFullName(userId?: string): string | undefined {
  const { data } = useQuery({
    queryKey: ['user', 'read', userId],
    enabled: !!userId,
    staleTime: Infinity,
    queryFn: () => readUser(userId!),
  });
  if (!data) return undefined;
  const name = [data.firstName, data.lastName].filter(Boolean).join(' ').trim();
  return name || data.userName || undefined;
}
