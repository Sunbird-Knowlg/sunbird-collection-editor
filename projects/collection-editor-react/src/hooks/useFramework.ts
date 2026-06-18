import { useQuery } from '@tanstack/react-query';
import { getFramework } from '../api/framework';
import type { IFrameworkDetails } from '../types/framework';

export function useFramework(
  frameworkId?: string,
  targetFWIds?: string[],
): IFrameworkDetails & { isLoading: boolean } {
  const orgQuery = useQuery({
    queryKey: ['framework', frameworkId],
    queryFn: () => getFramework(frameworkId!),
    enabled: !!frameworkId,
    staleTime: 5 * 60 * 1000,
  });

  // Query for first target framework (simplified — extend with useQueries if needed)
  const firstTargetId = targetFWIds?.[0];
  const targetQuery = useQuery({
    queryKey: ['framework', firstTargetId],
    queryFn: () => getFramework(firstTargetId!),
    enabled: !!firstTargetId,
    staleTime: 5 * 60 * 1000,
  });

  const targetFrameworks = targetQuery.data ? [targetQuery.data] : [];

  return {
    organisationFramework: orgQuery.data,
    targetFrameworks,
    isLoading: orgQuery.isLoading || targetQuery.isLoading,
  };
}
